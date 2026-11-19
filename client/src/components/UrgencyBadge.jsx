import React from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const UrgencyBadge = ({ expiryTime }) => {
  if (!expiryTime) return null;

  const now = new Date();
  const expiry = new Date(expiryTime);
  const diffMs = expiry - now;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffMs <= 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
        <AlertTriangle className="w-3.5 h-3.5" /> Expired
      </span>
    );
  }

  if (diffHours <= 4) {
    const hours = Math.floor(diffHours);
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm animate-pulse">
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <Clock className="w-3.5 h-3.5" />
        Expiring in {hours > 0 ? `${hours}h ` : ''}{minutes}m
      </span>
    );
  }

  if (diffHours <= 12) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
        <Clock className="w-3.5 h-3.5" /> {Math.round(diffHours)} hours left
      </span>
    );
  }

  const days = Math.floor(diffHours / 24);
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle className="w-3.5 h-3.5" /> Fresh ({days > 0 ? `${days}d left` : `${Math.round(diffHours)}h left`})
    </span>
  );
};

export default UrgencyBadge;
