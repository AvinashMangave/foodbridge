import React from 'react';
import { MapPin, User, Utensils, Clock, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import UrgencyBadge from './UrgencyBadge';
import { useAuth } from '../context/AuthContext';

const FoodCard = ({ donation, onViewDetails, onRequest }) => {
  const { isAuthenticated, isNgo } = useAuth();

  const isAvailable = donation.status === 'available';

  const categoryColor = {
    'Cooked Food': 'bg-amber-100 text-amber-800 border-amber-200',
    'Fruits & Vegetables': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Bakery & Bread': 'bg-orange-100 text-orange-800 border-orange-200',
    'Packaged Food': 'bg-blue-100 text-blue-800 border-blue-200',
    'Dairy Products': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Beverages': 'bg-teal-100 text-teal-800 border-teal-200'
  }[donation.category] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      
      {/* Top Image & Floating Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={donation.imageUrl}
          alt={donation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${categoryColor}`}>
            {donation.category}
          </span>
          <UrgencyBadge expiryTime={donation.expiryTime} />
        </div>

        {/* Bottom Image Stats: Quantity & Servings */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-brand-400" />
            <span>{donation.quantity} {donation.unit}</span>
            <span className="text-slate-300 font-normal">({donation.servingsEstimate || Math.round(donation.quantity * 2.5)} meals)</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold capitalize ${
            isAvailable ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            {donation.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {donation.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {donation.description}
          </p>

          {/* Details metadata */}
          <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="font-medium truncate">{donation.donorOrganization || donation.donorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{donation.pickupAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{donation.pickupWindow}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(donation)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            View Details
          </button>

          <button
            onClick={() => onRequest(donation)}
            disabled={!isAvailable}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isAvailable
                ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20 active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{isAvailable ? 'Request Food' : 'Claimed'}</span>
            {isAvailable && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

    </div>
  );
};

export default FoodCard;
