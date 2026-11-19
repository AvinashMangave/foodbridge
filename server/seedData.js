const bcrypt = require('bcryptjs');
const User = require('./models/User');
const FoodDonation = require('./models/FoodDonation');
const DonationRequest = require('./models/DonationRequest');
const Notification = require('./models/Notification');
const NGOProfile = require('./models/NGOProfile');

const seedDatabase = async () => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('ℹ️  Database already contains users. Checking if seed refresh is required...');
      return;
    }

    console.log('🌱 Populating FoodBridge with realistic demo data...');

    const salt = await bcrypt.genSalt(10);
    const donorPass = await bcrypt.hash('password123', salt);
    const ngoPass = await bcrypt.hash('password123', salt);
    const adminPass = await bcrypt.hash('admin123', salt);

    // 1. Create Demo Users
    const donor1 = await User.create({
      name: 'Chef Marco Silva',
      email: 'donor@restaurant.com',
      password: donorPass,
      role: 'donor',
      phone: '+1 (555) 234-5678',
      address: '45 Culinary Boulevard, Downtown Metro',
      organizationName: 'Golden Spoon Fine Dining Restaurant',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80'
    });

    const donor2 = await User.create({
      name: 'Priya Sharma',
      email: 'events@royalpalace.com',
      password: donorPass,
      role: 'donor',
      phone: '+1 (555) 876-5432',
      address: '102 Grand Banquet Way, North Heights',
      organizationName: 'Royal Palace Wedding & Convention Hall',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });

    const donor3 = await User.create({
      name: 'David Chen',
      email: 'green@supermarket.com',
      password: donorPass,
      role: 'donor',
      phone: '+1 (555) 345-6789',
      address: '78 Eco Commerce Park, Green Valley',
      organizationName: 'GreenEarth Fresh Supermarket',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    });

    const donor4 = await User.create({
      name: 'Sophie Laurent',
      email: 'bakery@sunrise.com',
      password: donorPass,
      role: 'donor',
      phone: '+1 (555) 456-7890',
      address: '12 Bakery Lane, Old Town Square',
      organizationName: 'Sunrise Artisan Bakery',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    });

    const ngo1 = await User.create({
      name: 'Robin Hood Food Relief',
      email: 'ngo@robinhood.org',
      password: ngoPass,
      role: 'ngo',
      phone: '+1 (555) 912-3456',
      address: '500 Harmony Road, East District',
      organizationName: 'Robin Hood Army Community Kitchen',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=200&q=80'
    });

    const ngo2 = await User.create({
      name: 'Hope Children Home',
      email: 'hope@charity.org',
      password: ngoPass,
      role: 'ngo',
      phone: '+1 (555) 654-3210',
      address: '88 Children Haven Way, South Park',
      organizationName: 'Hope Children Shelter & Orphanage',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=200&q=80'
    });

    const ngo3 = await User.create({
      name: 'Silver Linings Care',
      email: 'elder@shelter.org',
      password: ngoPass,
      role: 'ngo',
      phone: '+1 (555) 789-0123',
      address: '32 Peaceful Gardens, West Suburbs',
      organizationName: 'Silver Linings Senior Citizen Shelter',
      isVerified: false, // For testing admin verification
      avatar: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=200&q=80'
    });

    const admin = await User.create({
      name: 'Admin Supervisor',
      email: 'admin@foodbridge.org',
      password: adminPass,
      role: 'admin',
      phone: '+1 (555) 000-1122',
      address: 'FoodBridge Global HQ, Floor 10',
      organizationName: 'FoodBridge Central Administration',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
    });

    // 2. NGO Profiles
    await NGOProfile.create({
      user: ngo1._id || ngo1.id,
      organizationName: 'Robin Hood Army Community Kitchen',
      registrationNumber: 'NGO-RHA-84920',
      focusArea: 'Surplus food collection & street hunger eradication',
      dailyCapacityServings: 350,
      coverageRadiusKm: 25,
      verified: true,
      address: '500 Harmony Road, East District',
      operatingHours: '6:00 AM - 11:30 PM'
    });

    await NGOProfile.create({
      user: ngo2._id || ngo2.id,
      organizationName: 'Hope Children Shelter & Orphanage',
      registrationNumber: 'NGO-HCS-39104',
      focusArea: 'Nutritious meals for orphaned and underprivileged youth',
      dailyCapacityServings: 120,
      coverageRadiusKm: 15,
      verified: true,
      address: '88 Children Haven Way, South Park',
      operatingHours: '7:00 AM - 9:00 PM'
    });

    // 3. Realistic Food Donations
    const now = new Date();

    // Expiring in 3.5 hours (Urgent tag demo)
    const urgentExpiry = new Date(now.getTime() + 3.5 * 60 * 60 * 1000);
    // Expiring in 8 hours
    const midExpiry = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    // Expiring in 24 hours
    const freshExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    // Expiring in 48 hours
    const longExpiry = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const donation1 = await FoodDonation.create({
      donor: donor1._id || donor1.id,
      donorName: donor1.name,
      donorPhone: donor1.phone,
      donorOrganization: donor1.organizationName,
      title: '20 kg Cooked Rice & Mild Veggie Lentil Curry',
      category: 'Cooked Food',
      quantity: 20,
      unit: 'kg',
      servingsEstimate: 50,
      preparationTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      expiryTime: urgentExpiry,
      description: 'Freshly prepared premium basmati rice paired with nutritious lentil vegetable curry from evening buffet. Stored in hot holding food-grade stainless containers.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      pickupAddress: '45 Culinary Boulevard, Downtown Metro (Kitchen Back Entrance)',
      pickupWindow: 'Today within next 2.5 hours',
      contactNumber: donor1.phone,
      specialInstructions: 'Insulated hot carriers recommended. Kitchen staff ready to assist loading.',
      foodSafetyDeclared: true,
      status: 'available',
      location: { lat: 28.6139, lng: 77.2090, city: 'Downtown' }
    });

    const donation2 = await FoodDonation.create({
      donor: donor2._id || donor2.id,
      donorName: donor2.name,
      donorPhone: donor2.phone,
      donorOrganization: donor2.organizationName,
      title: '50 Fresh Gourmet Meal Packets from Wedding Reception',
      category: 'Cooked Food',
      quantity: 50,
      unit: 'packets',
      servingsEstimate: 50,
      preparationTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      expiryTime: urgentExpiry,
      description: 'Individually boxed high-quality wedding dinner boxes containing paneer butter masala, pulao, butter naan, and dessert. Untouched surplus.',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      pickupAddress: '102 Grand Banquet Way, North Heights (Loading Bay 2)',
      pickupWindow: 'Immediate pickup required (before 11:30 PM)',
      contactNumber: donor2.phone,
      specialInstructions: 'Ready-to-eat individual portions. Temperature controlled.',
      foodSafetyDeclared: true,
      status: 'available',
      location: { lat: 28.6340, lng: 77.2180, city: 'North Heights' }
    });

    const donation3 = await FoodDonation.create({
      donor: donor3._id || donor3.id,
      donorName: donor3.name,
      donorPhone: donor3.phone,
      donorOrganization: donor3.organizationName,
      title: '15 kg Crisp Farm-Fresh Vegetables',
      category: 'Fruits & Vegetables',
      quantity: 15,
      unit: 'kg',
      servingsEstimate: 40,
      preparationTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      expiryTime: freshExpiry,
      description: 'Farm-fresh bell peppers, broccoli, carrots, and sweet potatoes sorted from daily supermarket delivery. Perfectly wholesome and crunchy.',
      imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
      pickupAddress: '78 Eco Commerce Park, Green Valley (Supermarket Dock B)',
      pickupWindow: 'Today 9:00 AM - 8:00 PM',
      contactNumber: donor3.phone,
      specialInstructions: 'Packed in ventilated wooden crates.',
      foodSafetyDeclared: true,
      status: 'available',
      location: { lat: 28.5850, lng: 77.2300, city: 'Green Valley' }
    });

    const donation4 = await FoodDonation.create({
      donor: donor4._id || donor4.id,
      donorName: donor4.name,
      donorPhone: donor4.phone,
      donorOrganization: donor4.organizationName,
      title: '30 Fresh Artisan Bread & Croissant Packets',
      category: 'Bakery & Bread',
      quantity: 30,
      unit: 'packets',
      servingsEstimate: 60,
      preparationTime: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      expiryTime: midExpiry,
      description: 'Oven-baked whole wheat sourdough loaves, baguettes, and butter croissants baked this morning. Sealed in bakery paper bags.',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      pickupAddress: '12 Bakery Lane, Old Town Square',
      pickupWindow: 'Until 9:00 PM tonight',
      contactNumber: donor4.phone,
      specialInstructions: 'Store in dry place. Excellent for breakfast or dinner soup pairing.',
      foodSafetyDeclared: true,
      status: 'available',
      location: { lat: 28.6010, lng: 77.1950, city: 'Old Town' }
    });

    const donation5 = await FoodDonation.create({
      donor: donor3._id || donor3.id,
      donorName: donor3.name,
      donorPhone: donor3.phone,
      donorOrganization: donor3.organizationName,
      title: '10 kg Assorted Seasonal Fresh Fruits',
      category: 'Fruits & Vegetables',
      quantity: 10,
      unit: 'kg',
      servingsEstimate: 30,
      preparationTime: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      expiryTime: freshExpiry,
      description: 'Sweet red apples, Cavendish bananas, and Valencia oranges from premium organic crates. Ideal for community orphanages and shelters.',
      imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
      pickupAddress: '78 Eco Commerce Park, Green Valley (Supermarket Front Desk)',
      pickupWindow: 'Today 10:00 AM - 7:00 PM',
      contactNumber: donor3.phone,
      specialInstructions: 'Ready to distribute directly to children or shelter residents.',
      foodSafetyDeclared: true,
      status: 'available',
      location: { lat: 28.5850, lng: 77.2300, city: 'Green Valley' }
    });

    // 4. Sample Tracked Donation & Request (for the 6-Step Tracking Page Demo)
    const trackedDonation = await FoodDonation.create({
      donor: donor1._id || donor1.id,
      donorName: donor1.name,
      donorPhone: donor1.phone,
      donorOrganization: donor1.organizationName,
      title: '35 kg Nutritious Vegetable Biryani & Raita',
      category: 'Cooked Food',
      quantity: 35,
      unit: 'kg',
      servingsEstimate: 90,
      preparationTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      expiryTime: midExpiry,
      description: 'Fragrant saffron vegetable biryani prepared for corporate banquet, kept warm and safe.',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      pickupAddress: '45 Culinary Boulevard, Downtown Metro (Dispatch Bay 1)',
      pickupWindow: 'Within next 3 hours',
      contactNumber: donor1.phone,
      specialInstructions: 'Ready in large thermal containers.',
      foodSafetyDeclared: true,
      status: 'ready_for_pickup',
      claimedByNgo: ngo1._id || ngo1.id,
      claimedByNgoName: ngo1.organizationName,
      location: { lat: 28.6139, lng: 77.2090, city: 'Downtown' }
    });

    const sampleRequest = await DonationRequest.create({
      donation: trackedDonation._id || trackedDonation.id,
      donationTitle: trackedDonation.title,
      ngo: ngo1._id || ngo1.id,
      ngoName: ngo1.organizationName,
      ngoPhone: ngo1.phone,
      donor: donor1._id || donor1.id,
      donorName: donor1.name,
      requestedQuantity: 35,
      servingsNeeded: 90,
      purposeNote: 'Distributing warm evening dinner to 90 families in the Eastern Community Center shelter.',
      pickupEstimatedTime: 'Volunteer van arriving in 35 minutes',
      pickupCode: 'FB-9418',
      status: 'ready_for_pickup',
      statusHistory: [
        {
          status: 'Donation Posted',
          timestamp: new Date(now.getTime() - 2.5 * 60 * 60 * 1000),
          updatedBy: donor1.name,
          note: '35 kg Vegetable Biryani listed on FoodBridge platform.'
        },
        {
          status: 'Request Received',
          timestamp: new Date(now.getTime() - 2.0 * 60 * 60 * 1000),
          updatedBy: ngo1.organizationName,
          note: 'Request placed: Needed for Eastern Shelter dinner service.'
        },
        {
          status: 'Request Approved',
          timestamp: new Date(now.getTime() - 1.5 * 60 * 60 * 1000),
          updatedBy: donor1.name,
          note: 'Chef Marco approved the request. Verification code generated: FB-9418.'
        },
        {
          status: 'Food Ready for Pickup',
          timestamp: new Date(now.getTime() - 0.5 * 60 * 60 * 1000),
          updatedBy: donor1.name,
          note: 'Food packaged in insulated thermal carriers at Dispatch Bay 1.'
        }
      ]
    });

    await FoodDonation.findByIdAndUpdate(trackedDonation._id || trackedDonation.id, {
      activeRequestId: sampleRequest._id || sampleRequest.id
    });

    // 5. Seed Notifications
    await Notification.create({
      recipient: ngo1._id || ngo1.id,
      sender: donor1._id || donor1.id,
      title: 'Food Ready for Pickup!',
      message: `Your requested donation "${trackedDonation.title}" is packaged and ready at Dispatch Bay 1. Pickup code: ${sampleRequest.pickupCode}`,
      type: 'status_update',
      link: `/tracking/${sampleRequest._id || sampleRequest.id}`
    });

    await Notification.create({
      recipient: donor1._id || donor1.id,
      sender: ngo1._id || ngo1.id,
      title: 'Volunteer en-route for pickup',
      message: 'Robin Hood Army driver reported volunteer van arriving in approximately 35 minutes.',
      type: 'system',
      link: `/tracking/${sampleRequest._id || sampleRequest.id}`
    });

    console.log('✅ Realistic sample seed data loaded successfully!');
    console.log('   👤 Demo Accounts:');
    console.log('      - Donor: donor@restaurant.com / password123');
    console.log('      - NGO:   ngo@robinhood.org / password123');
    console.log('      - Admin: admin@foodbridge.org / admin123');
  } catch (err) {
    console.error('Seed database error:', err);
  }
};

module.exports = seedDatabase;
