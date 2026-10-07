import React from 'react';
import { SeverityLevel } from '../models/emergency';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className = '' }) => {
  const getColors = () => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'HIGH':
        return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'MEDIUM':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'LOW':
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    }
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded text-[10.5px] font-mono font-bold uppercase tracking-wider border inline-flex items-center gap-1 ${getColors()} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        severity === 'CRITICAL' ? 'bg-rose-500 animate-pulse' :
        severity === 'HIGH' ? 'bg-orange-400' :
        severity === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
      }`} />
      <span>{severity}</span>
    </span>
  );
};
