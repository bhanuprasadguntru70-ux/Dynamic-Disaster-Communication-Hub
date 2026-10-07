import React from 'react';
import { EmergencyStatus } from '../models/emergency';
import { CheckCircle2, Clock, Users, ShieldAlert, Check } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: EmergencyStatus;
  onStatusChange?: (newStatus: EmergencyStatus) => void;
  allowInteractive?: boolean;
}

const STAGES: { status: EmergencyStatus; label: string; icon: React.ElementType }[] = [
  { status: 'ACTIVE', label: 'ACTIVE', icon: ShieldAlert },
  { status: 'ACKNOWLEDGED', label: 'ACKNOWLEDGED', icon: Clock },
  { status: 'ASSIGNED', label: 'ASSIGNED', icon: Users },
  { status: 'RESCUE IN PROGRESS', label: 'RESCUE IN PROGRESS', icon: Clock },
  { status: 'RESOLVED', label: 'RESOLVED', icon: CheckCircle2 },
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  onStatusChange,
  allowInteractive = false,
}) => {
  const currentIndex = STAGES.findIndex(s => s.status === currentStatus);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />
        {/* Active progress fill line */}
        <div 
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-rose-500 transition-all duration-500 -z-0"
          style={{ width: `${Math.min(100, (Math.max(0, currentIndex) / (STAGES.length - 1)) * 100)}%` }}
        />

        {STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;

          return (
            <div 
              key={stage.status}
              onClick={() => allowInteractive && onStatusChange && onStatusChange(stage.status)}
              className={`flex flex-col items-center relative z-10 ${allowInteractive ? 'cursor-pointer group' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                  isCurrent
                    ? 'bg-rose-600 border-white text-white shadow-lg shadow-rose-950 scale-110 ring-4 ring-rose-500/30'
                    : isPassed
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>

              <span
                className={`mt-2 text-[10px] sm:text-xs font-mono font-semibold tracking-wider text-center whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'text-rose-400 font-bold'
                    : isPassed
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
