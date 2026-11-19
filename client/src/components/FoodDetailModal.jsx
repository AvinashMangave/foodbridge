import React from 'react';
import { X, Clock, MapPin, User, Phone, ShieldCheck, AlertCircle, Utensils, Calendar } from 'lucide-react';
import UrgencyBadge from './UrgencyBadge';

const FoodDetailModal = ({ donation, isOpen, onClose, onRequest }) => {
  if (!isOpen || !donation) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Image */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-100">
          <img
            src={donation.imageUrl}
            alt={donation.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500 text-white shadow-md">
              {donation.category}
            </span>
            <UrgencyBadge expiryTime={donation.expiryTime} />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-snug">
              {donation.title}
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {donation.description}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block">Quantity</span>
              <span className="text-base font-bold text-slate-800">{donation.quantity} {donation.unit}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block">Est. Meals</span>
              <span className="text-base font-bold text-brand-600">{donation.servingsEstimate || Math.round(donation.quantity * 2.5)} servings</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block">Prepared</span>
              <span className="text-xs font-bold text-slate-700">
                {new Date(donation.preparationTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                {new Date(donation.preparationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block">Best Before</span>
              <span className="text-xs font-bold text-amber-700">
                {new Date(donation.expiryTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                {new Date(donation.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Donor & Pickup Info */}
          <div className="bg-brand-50/60 rounded-2xl p-4 border border-brand-100/80 space-y-2.5 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              Donor & Pickup Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-500 block">Donor / Organization:</span>
                <span className="font-semibold text-slate-900">{donation.donorOrganization || donation.donorName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Contact Number:</span>
                <span className="font-semibold text-slate-900">{donation.contactNumber || donation.donorPhone || 'Provided upon request'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Pickup Location:</span>
                <span className="font-semibold text-slate-900">{donation.pickupAddress}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Pickup Window:</span>
                <span className="font-semibold text-slate-900">{donation.pickupWindow}</span>
              </div>
              {donation.specialInstructions && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Handling Instructions:</span>
                  <span className="font-medium text-slate-800">{donation.specialInstructions}</span>
                </div>
              )}
            </div>
          </div>

          {/* Food Safety Guarantee */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-950">Food Safety & Hygiene Compliant</p>
              <p className="text-emerald-800 mt-0.5 leading-relaxed">
                The donor has certified that this food was prepared and held under sanitary conditions, stored at safe temperatures, and is fit for human consumption in compliance with standard food conservation protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onRequest(donation);
            }}
            disabled={donation.status !== 'available'}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
              donation.status === 'available'
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/25 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {donation.status === 'available' ? 'Request This Donation' : 'Currently Claimed'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default FoodDetailModal;
