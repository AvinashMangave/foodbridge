import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Phone,
  ShieldCheck,
  CheckCircle,
  PackageCheck,
  Truck,
  HeartHandshake,
  Key,
  Copy,
  Check,
  AlertCircle,
  FileText
} from 'lucide-react';
import { requestAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import StatusTimeline from '../components/StatusTimeline';

const TrackingPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchTracking = async () => {
    try {
      const res = await requestAPI.getById(id);
      if (res.data.success) {
        setRequest(res.data.request);
        setDonation(res.data.donation);
        if (res.data.request.status === 'delivered') {
          // trigger celebration
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
      }
    } catch (err) {
      setError(err.message || 'Error loading tracking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await requestAPI.updateStatus(id, {
        status: newStatus,
        note: statusNote || undefined
      });

      if (res.data.success) {
        setRequest(res.data.request);
        setStatusNote('');
        setSuccessMsg(`Status updated to: ${newStatus.replace('_', ' ')}!`);

        if (newStatus === 'delivered') {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.5 }
          });
        }
      }
    } catch (err) {
      setError(err.message || 'Error updating status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (request?.pickupCode) {
      navigator.clipboard.writeText(request.pickupCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-bold text-slate-500">Connecting to FoodBridge Live Tracking Engine...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Tracking Record Not Found</h2>
        <p className="text-xs text-slate-500">The requested donation track ID does not exist or has expired.</p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Return Home
        </Link>
      </div>
    );
  }

  const isCurrentDonor = user && (String(user.id) === String(request.donor) || String(user._id) === String(request.donor) || user.role === 'admin');
  const isCurrentNgo = user && (String(user.id) === String(request.ngo) || String(user._id) === String(request.ngo) || user.role === 'admin');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={user?.role === 'ngo' ? '/ngo-dashboard' : user?.role === 'donor' ? '/donor-dashboard' : '/donations'}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs text-slate-400 font-medium">
          Tracking ID: <span className="font-mono text-slate-700 font-bold">{request._id || request.id}</span>
        </span>
      </div>

      {/* Main Tracking Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-8">
        
        {/* Header Summary */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                request.status === 'delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-brand-100 text-brand-800'
              }`}>
                {request.status.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-500">
                Created: {new Date(request.createdAt).toLocaleString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {request.donationTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              <strong>{request.requestedQuantity} kg / {request.servingsNeeded} servings</strong> allocated for hunger relief
            </p>
          </div>

          {/* Secure Handover Verification Code */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Pickup Verification Code
              </span>
              <span className="text-xl font-mono font-black text-brand-400 tracking-wider">
                {request.pickupCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Copy code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 6-Step Visual Timeline */}
        <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Live 6-Step Food Rescue Progress Tracker
          </h3>
          <StatusTimeline currentStatus={request.status} statusHistory={request.statusHistory} />
        </div>

        {/* Interactive Lifecycle Status Advancement Actions */}
        <div className="p-6 rounded-3xl bg-brand-50/50 border border-brand-100 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600" />
              Advance Lifecycle Status (Interactive Simulation)
            </h4>
            <span className="text-[11px] text-brand-700 font-semibold bg-brand-100/60 px-2.5 py-0.5 rounded-full">
              Authorized Actor Mode
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Optional progress note (e.g. Volunteer van arriving at Bay 2)..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-white"
            />

            {/* Action Buttons depending on current status */}
            <div className="flex items-center gap-2 flex-wrap">
              {request.status === 'pending' && (
                <>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus('approved')}
                    className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm"
                  >
                    3. Approve Request
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus('rejected')}
                    className="px-4 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold"
                  >
                    Reject
                  </button>
                </>
              )}

              {request.status === 'approved' && (
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus('ready_for_pickup')}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
                >
                  4. Mark Ready for Pickup
                </button>
              )}

              {request.status === 'ready_for_pickup' && (
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus('picked_up')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                >
                  5. Confirm Food Picked Up
                </button>
              )}

              {request.status === 'picked_up' && (
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus('delivered')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/25"
                >
                  6. Confirm Successfully Delivered 🎉
                </button>
              )}

              {request.status === 'delivered' && (
                <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Mission Accomplished!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stakeholder Info & Pickup Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          
          {/* Donor Column */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Food Donor Information
            </h4>
            <div className="text-xs space-y-1.5 text-slate-700">
              <p><strong>Name / Org:</strong> {request.donorName}</p>
              <p><strong>Pickup Address:</strong> {donation?.pickupAddress || 'Kitchen Loading Bay'}</p>
              <p><strong>Pickup Window:</strong> {donation?.pickupWindow || 'Immediate collection'}</p>
              <p><strong>Contact:</strong> {donation?.contactNumber || '+1 (555) 234-5678'}</p>
            </div>
          </div>

          {/* Receiver NGO Column */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Claiming NGO / Shelter
            </h4>
            <div className="text-xs space-y-1.5 text-slate-700">
              <p><strong>Organization:</strong> {request.ngoName}</p>
              <p><strong>Contact Phone:</strong> {request.ngoPhone || '+1 (555) 912-3456'}</p>
              <p><strong>Pickup Vehicle ETA:</strong> {request.pickupEstimatedTime}</p>
              <p><strong>Intended Purpose:</strong> "{request.purposeNote}"</p>
            </div>
          </div>

        </div>

        {/* Audit Log / Status History Table */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" />
            Audit Log & Status History
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400">
                  <th className="py-2.5 font-semibold">Timestamp</th>
                  <th className="py-2.5 font-semibold">Stage</th>
                  <th className="py-2.5 font-semibold">Updated By</th>
                  <th className="py-2.5 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(request.statusHistory || []).map((h, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-2.5 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {new Date(h.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 font-bold text-slate-900">{h.status}</td>
                    <td className="py-2.5 text-slate-600">{h.updatedBy}</td>
                    <td className="py-2.5 text-slate-500 italic">{h.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default TrackingPage;
