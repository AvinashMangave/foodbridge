import React from 'react';
import {
  CheckCircle,
  Clock,
  ThumbsUp,
  PackageCheck,
  Truck,
  HeartHandshake,
  AlertCircle
} from 'lucide-react';

const TRACKING_STEPS = [
  {
    key: 'posted',
    label: 'Donation Posted',
    desc: 'Surplus food listed on platform',
    icon: CheckCircle
  },
  {
    key: 'requested',
    label: 'Request Received',
    desc: 'NGO submitted meal claim',
    icon: Clock
  },
  {
    key: 'approved',
    label: 'Request Approved',
    desc: 'Donor approved collection',
    icon: ThumbsUp
  },
  {
    key: 'ready_for_pickup',
    label: 'Ready for Pickup',
    desc: 'Safely packed & staged',
    icon: PackageCheck
  },
  {
    key: 'picked_up',
    label: 'Food Picked Up',
    desc: 'In transit with volunteer',
    icon: Truck
  },
  {
    key: 'delivered',
    label: 'Successfully Delivered',
    desc: 'Distributed to beneficiaries',
    icon: HeartHandshake
  }
];

const getStepIndex = (status) => {
  switch (status) {
    case 'available':
      return 0;
    case 'pending':
    case 'requested':
      return 1;
    case 'approved':
      return 2;
    case 'ready_for_pickup':
      return 3;
    case 'picked_up':
      return 4;
    case 'delivered':
      return 5;
    case 'rejected':
    case 'cancelled':
      return -1;
    default:
      return 0;
  }
};

const StatusTimeline = ({ currentStatus, statusHistory = [] }) => {
  const currentIndex = getStepIndex(currentStatus);
  const isRejected = currentStatus === 'rejected' || currentStatus === 'cancelled';

  return (
    <div className="w-full py-6">
      {isRejected ? (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Donation Request Cancelled / Rejected</h4>
            <p className="text-xs text-red-600 mt-0.5">
              This request was not fulfilled. The surplus food was made available again for other organizations.
            </p>
          </div>
        </div>
      ) : (
        <div>
          {/* Progress Stepper Bar for Desktop */}
          <div className="hidden md:flex items-center justify-between relative mb-10">
            {/* Background connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-brand-500 -translate-y-1/2 transition-all duration-500 z-0"
              style={{
                width: `${Math.min(100, Math.max(0, (currentIndex / (TRACKING_STEPS.length - 1)) * 100))}%`
              }}
            />

            {TRACKING_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isFuture = idx > currentIndex;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center group">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isPast
                        ? 'bg-brand-600 text-white shadow-brand-500/30'
                        : isCurrent
                        ? 'bg-brand-500 text-white ring-4 ring-brand-100 scale-110 shadow-lg animate-pulse'
                        : 'bg-white text-slate-400 border-2 border-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-center mt-3 max-w-[110px]">
                    <span
                      className={`text-xs font-bold block ${
                        isCurrent ? 'text-brand-700' : isPast ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">
                      {step.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vertical Stepper for Mobile */}
          <div className="md:hidden space-y-4">
            {TRACKING_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div key={step.key} className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isPast
                        ? 'bg-brand-600 text-white'
                        : isCurrent
                        ? 'bg-brand-500 text-white ring-4 ring-brand-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-brand-700' : isPast ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </h5>
                    <p className="text-[11px] text-slate-500">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusTimeline;
