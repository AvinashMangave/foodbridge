import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, AlertCircle, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';
import { requestAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const RequestModal = ({ donation, isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated, isNgo, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [servingsNeeded, setServingsNeeded] = useState('');
  const [purposeNote, setPurposeNote] = useState('');
  const [pickupEstimatedTime, setPickupEstimatedTime] = useState('Within 1 - 2 hours');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !donation) return null;

  const maxServings = donation.servingsEstimate || Math.round(donation.quantity * 2.5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purposeNote.trim()) {
      setError('Please provide a short description of how the food will be distributed.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await requestAPI.create({
        donationId: donation._id || donation.id,
        requestedQuantity: donation.quantity,
        servingsNeeded: Number(servingsNeeded) || maxServings,
        purposeNote,
        pickupEstimatedTime,
        contactPhone: contactPhone || user?.phone || '+1 555-0199'
      });

      if (res.data.success) {
        onSuccess(res.data.request);
        onClose();
        navigate(`/tracking/${res.data.request._id || res.data.request.id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit food request');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickNgoLogin = async () => {
    try {
      await demoLogin('ngo');
    } catch (err) {
      setError('Could not switch to demo NGO account.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-brand-700 to-brand-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="w-6 h-6 text-brand-200" />
            <div>
              <h3 className="text-lg font-bold">Request Surplus Food</h3>
              <p className="text-xs text-brand-100 truncate max-w-xs">{donation.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isAuthenticated ? (
            <div className="text-center py-6 space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <div>
                <h4 className="text-base font-bold text-slate-900">Sign In Required</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Only registered NGOs, food banks, and verified shelters can claim and coordinate food pickups.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleQuickNgoLogin}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>One-Click Login as Demo NGO (Robin Hood Army)</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/auth?tab=register&role=ngo');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  Register New NGO Account
                </button>
              </div>
            </div>
          ) : !isNgo && !user?.role === 'admin' ? (
            <div className="text-center py-6 space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <div>
                <h4 className="text-base font-bold text-slate-900">Donor Account Active</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  You are currently signed in as a Food Donor. Surplus food requests must be placed from an NGO or Shelter account.
                </p>
              </div>
              <button
                onClick={handleQuickNgoLogin}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Switch to Demo NGO Account</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Donor</span>
                  <span className="font-bold text-slate-800">{donation.donorOrganization || donation.donorName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block font-medium">Available</span>
                  <span className="font-bold text-brand-600">{donation.quantity} {donation.unit} (~{maxServings} meals)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Beneficiaries / Servings Needed
                </label>
                <input
                  type="number"
                  min="1"
                  max={maxServings}
                  defaultValue={maxServings}
                  onChange={(e) => setServingsNeeded(e.target.value)}
                  placeholder={`e.g. ${maxServings}`}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Distribution Purpose & Beneficiary Group *
                </label>
                <textarea
                  rows="3"
                  required
                  value={purposeNote}
                  onChange={(e) => setPurposeNote(e.target.value)}
                  placeholder="e.g. Distributing directly to 50 children and elderly at Hope Shelter dinner service."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Pickup Time
                  </label>
                  <input
                    type="text"
                    value={pickupEstimatedTime}
                    onChange={(e) => setPickupEstimatedTime(e.target.value)}
                    placeholder="e.g. Within 45 mins"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Volunteer / Driver Phone
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-brand-50/50 border border-brand-100 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-brand-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                  Fast 6-Step Automated Tracking
                </div>
                <p>
                  Upon submission, the donor receives an instant alert. Once approved, you'll receive a secure handover verification code.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-600/25 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Submitting...' : 'Send Food Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default RequestModal;
