import React from 'react';
import { EmergencyRecord } from '../models/emergency';
import { SeverityBadge } from './SeverityBadge';
import { MapPin, Clock, ArrowRight, ShieldAlert, LifeBuoy } from 'lucide-react';

interface EmergencyCardProps {
  emergency: EmergencyRecord;
  onViewDetails: (id: string) => void;
}

export const EmergencyCard: React.FC<EmergencyCardProps> = ({
  emergency,
  onViewDetails,
}) => {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all shadow-md text-xs space-y-3 flex flex-col justify-between">
      <div>
        {/* Top bar with ID, Type, and Severity */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            {emergency.isSOS ? (
              <LifeBuoy className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: '8s' }} />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            )}
            <span className="font-mono font-bold text-rose-400 text-xs">{emergency.id}</span>
          </div>

          <SeverityBadge severity={emergency.severity} />
        </div>

        <h4 className="font-bold text-white text-sm leading-snug">
          {emergency.type} Incident
        </h4>

        <p className="text-slate-400 text-xs line-clamp-2 mt-1 leading-relaxed">
          {emergency.description}
        </p>

        <div className="pt-2 mt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{emergency.location.address || `${emergency.location.latitude}°N, ${emergency.location.longitude}°E`}</span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="flex items-center gap-1 font-mono text-[10.5px]">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{emergency.createdAt}</span>
            </span>

            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              emergency.status === 'ACTIVE' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
              emergency.status === 'ASSIGNED' ? 'bg-sky-950 text-sky-300 border border-sky-800' :
              emergency.status === 'RESCUE IN PROGRESS' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
              'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {emergency.status}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onViewDetails(emergency.id)}
        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs shadow-xs"
      >
        <span>VIEW DETAILS</span>
        <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
      </button>
    </div>
  );
};
