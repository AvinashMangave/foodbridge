const express = require('express');
const router = express.Router();
const DonationRequest = require('../models/DonationRequest');
const FoodDonation = require('../models/FoodDonation');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/requests
// @desc    Submit a food donation request (NGO only)
router.post('/', protect, authorize('ngo', 'admin'), async (req, res) => {
  try {
    const {
      donationId,
      requestedQuantity,
      servingsNeeded,
      purposeNote,
      pickupEstimatedTime,
      contactPhone
    } = req.body;

    if (!donationId || !purposeNote) {
      return res.status(400).json({ success: false, message: 'Please provide donation ID and purpose note.' });
    }

    const donation = await FoodDonation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation listing not found.' });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `This donation is currently ${donation.status} and cannot be requested.`
      });
    }

    // Generate unique 4-digit verification pickup code
    const pickupCode = 'FB-' + Math.floor(1000 + Math.random() * 9000);

    const newRequest = await DonationRequest.create({
      donation: donation._id || donation.id,
      donationTitle: donation.title,
      ngo: req.user.id,
      ngoName: req.user.organizationName || req.user.name,
      ngoPhone: contactPhone || req.user.phone,
      donor: donation.donor,
      donorName: donation.donorName,
      requestedQuantity: requestedQuantity || donation.quantity,
      servingsNeeded: servingsNeeded || donation.servingsEstimate,
      purposeNote,
      pickupEstimatedTime: pickupEstimatedTime || 'Within 2 hours',
      pickupCode,
      status: 'pending',
      statusHistory: [
        {
          status: 'Donation Posted',
          timestamp: donation.createdAt,
          updatedBy: donation.donorName,
          note: 'Surplus food item was listed on FoodBridge'
        },
        {
          status: 'Request Received',
          timestamp: new Date(),
          updatedBy: req.user.organizationName || req.user.name,
          note: `Request submitted: "${purposeNote}"`
        }
      ]
    });

    // Update donation status to 'requested'
    await FoodDonation.findByIdAndUpdate(donation._id || donation.id, {
      status: 'requested',
      activeRequestId: newRequest._id || newRequest.id
    });

    // Notify donor
    await Notification.create({
      recipient: donation.donor,
      sender: req.user.id,
      title: 'New Food Donation Request Received!',
      message: `${req.user.organizationName || req.user.name} requested "${donation.title}". Please review and approve.`,
      type: 'request_received',
      link: `/tracking/${newRequest._id || newRequest.id}`
    });

    res.status(201).json({
      success: true,
      message: 'Donation request submitted successfully! The donor has been notified.',
      request: newRequest
    });
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ success: false, message: 'Server error processing request.' });
  }
});

// @route   GET /api/requests/donor
// @desc    Get requests received by current donor
router.get('/donor', protect, authorize('donor', 'admin'), async (req, res) => {
  try {
    const requests = await DonationRequest.find({ donor: req.user.id });
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving incoming requests.' });
  }
});

// @route   GET /api/requests/ngo
// @desc    Get requests made by current NGO
router.get('/ngo', protect, authorize('ngo', 'admin'), async (req, res) => {
  try {
    const requests = await DonationRequest.find({ ngo: req.user.id });
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving your requests.' });
  }
});

// @route   GET /api/requests/:id
// @desc    Get single request with tracking history and donation info
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const donation = await FoodDonation.findById(request.donation);

    res.json({
      success: true,
      request,
      donation
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving tracking details.' });
  }
});

// @route   PUT /api/requests/:id/status
// @desc    Update request status along the 6-step lifecycle
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, note, verifyCode } = req.body;
    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request record not found' });
    }

    const donation = await FoodDonation.findById(request.donation);

    const validStatuses = [
      'approved',
      'rejected',
      'ready_for_pickup',
      'picked_up',
      'delivered',
      'cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status transition value.' });
    }

    let statusDisplay = status;
    let notifyRecipient = null;
    let notifyTitle = '';
    let notifyMessage = '';

    if (status === 'approved') {
      statusDisplay = 'Request Approved';
      notifyRecipient = request.ngo;
      notifyTitle = 'Good News! Food Donation Request Approved';
      notifyMessage = `${request.donorName} approved your request for "${request.donationTitle}". Pickup code: ${request.pickupCode}`;
      
      // Update donation status
      if (donation) {
        await FoodDonation.findByIdAndUpdate(donation._id || donation.id, {
          status: 'approved',
          claimedByNgo: request.ngo,
          claimedByNgoName: request.ngoName
        });
      }
    } else if (status === 'rejected') {
      statusDisplay = 'Request Rejected';
      notifyRecipient = request.ngo;
      notifyTitle = 'Donation Request Update';
      notifyMessage = `Your request for "${request.donationTitle}" was not approved. ${note ? 'Reason: ' + note : ''}`;
      
      // Revert donation status to available
      if (donation) {
        await FoodDonation.findByIdAndUpdate(donation._id || donation.id, {
          status: 'available',
          activeRequestId: null
        });
      }
    } else if (status === 'ready_for_pickup') {
      statusDisplay = 'Food Ready for Pickup';
      notifyRecipient = request.ngo;
      notifyTitle = 'Food Packaged & Ready for Pickup!';
      notifyMessage = `${request.donorName} has prepared and packaged "${request.donationTitle}". Please proceed for pickup.`;

      if (donation) {
        await FoodDonation.findByIdAndUpdate(donation._id || donation.id, { status: 'ready_for_pickup' });
      }
    } else if (status === 'picked_up') {
      statusDisplay = 'Food Picked Up';
      notifyRecipient = request.donor;
      notifyTitle = 'Food Successfully Collected';
      notifyMessage = `${request.ngoName} has safely picked up the food from your location. Thank you for making a difference!`;

      if (donation) {
        await FoodDonation.findByIdAndUpdate(donation._id || donation.id, { status: 'picked_up' });
      }
    } else if (status === 'delivered') {
      statusDisplay = 'Successfully Delivered';
      notifyRecipient = request.donor;
      notifyTitle = 'Meal Distribution Completed! 🌟';
      notifyMessage = `The food donated by you has been successfully served to the needy by ${request.ngoName}. Impact achieved!`;

      if (donation) {
        await FoodDonation.findByIdAndUpdate(donation._id || donation.id, { status: 'delivered' });
      }
    }

    // Append to statusHistory
    const historyItem = {
      status: statusDisplay,
      timestamp: new Date(),
      updatedBy: req.user.name + ` (${req.user.role.toUpperCase()})`,
      note: note || `Status updated to ${statusDisplay}`
    };

    const updated = await DonationRequest.findByIdAndUpdate(
      request._id || request.id,
      {
        status,
        $push: { statusHistory: historyItem }
      },
      { new: true }
    );

    // Send notification
    if (notifyRecipient) {
      await Notification.create({
        recipient: notifyRecipient,
        sender: req.user.id,
        title: notifyTitle,
        message: notifyMessage,
        type: 'status_update',
        link: `/tracking/${request._id || request.id}`
      });
    }

    res.json({
      success: true,
      message: `Status updated to ${statusDisplay}!`,
      request: updated
    });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
});

module.exports = router;
