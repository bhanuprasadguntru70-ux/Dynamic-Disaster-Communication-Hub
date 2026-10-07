import React, { useState } from 'react';
import { EmergencyRecord, EmergencyStatus } from '../models/emergency';
import { StatusTimeline } from '../components/StatusTimeline';
import { SeverityBadge } from '../components/SeverityBadge';
import { emergencyService } from '../services/emergencyService';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  Phone, 
  Users, 
  Activity, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface EmergencyStatusPageProps {
  emergencyId: string;
  onBack: () => void;
  onNavigate: (section: string) => void;
}

export const EmergencyStatusPage: React.FC<EmergencyStatusPageProps> = ({
  emergencyId,
  onBack,
  onNavigate,
}) => {
  const [emergency, setEmergency] = useState<EmergencyRecord | undefined>(
    emergencyService.getEmergencyById(emergencyId)
  );

  if (!emergency) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 text-xs">
        <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">Emergency Request Not Found</h3>
        <p className="text-slate-400">
          No record found for identifier <code className="text-rose-400 font-mono">{emergencyId}</code>.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleSimulateStatus = (newStatus: EmergencyStatus) => {
    const updated = emergencyService.updateStatus(emergency.id, newStatus);
    if (updated) {
      if (newStatus === 'RESOLVED') {
        soundManager.playAllClearChime();
      } else {
        soundManager.playDispatchChime();
      }
      setEmergency(updated);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer font-bold"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO DASHBOARD</span>
      </button>

      {/* Main Status Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-rose-400 font-extrabold text-sm sm:text-base">
                {emergency.id}
              </span>
              <SeverityBadge severity={emergency.severity} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {emergency.type} Emergency Status
            </h2>
          </div>

          <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-white font-bold">{emergency.status}</span>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="p-3 bg-amber-950/40 border border-amber-900/60 rounded-xl text-amber-300 text-xs flex items-center justify-between">
          <span>⚠️ DEMO MODE: Emergency lifecycle simulated in local storage session.</span>
          <span className="text-[10px] text-amber-400/80 font-mono">Backend Phase 3 Ready</span>
        </div>

        {/* Professional Status Timeline */}
        <div className="space-y-2 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block text-center mb-1">
            Official Emergency Response Timeline
          </span>
          <StatusTimeline
            currentStatus={emergency.status}
            allowInteractive={true}
            onStatusChange={handleSimulateStatus}
          />
          <p className="text-[11px] text-slate-500 text-center font-mono pt-1">
            In this demo, you can click any stage above to simulate real-time dispatch progress.
          </p>
        </div>

        {/* Dossier Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">
              Incident Location
            </span>
            <div className="flex items-start gap-2 text-slate-200">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">
                {emergency.location.address || `${emergency.location.latitude}°N, ${emergency.location.longitude}°E`}
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-400 pt-1">
              <span>Lat: {emergency.location.latitude}° | Lng: {emergency.location.longitude}°</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">
              Timing &amp; Origin
            </span>
            <div className="flex items-center gap-2 text-slate-200">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="font-mono font-bold">{emergency.createdAt}</span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 font-mono">
              <span>Channel: {emergency.isSOS ? 'Direct SOS Broadcast' : 'Incident Report Form'}</span>
            </div>
          </div>

        </div>

        {/* Description & Field Notes */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">
            Reported Situation &amp; Notes
          </span>
          <p className="text-slate-200 text-xs leading-relaxed">
            {emergency.description}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            <div>
              <span>People Affected: </span>
              <strong className="text-white">{emergency.peopleAffected || 1}</strong>
            </div>
            <div>
              <span>Injured: </span>
              <strong className="text-rose-400">{emergency.injuredCount || 0}</strong>
            </div>
            <div>
              <span>Assigned Team: </span>
              <strong className="text-sky-400">{emergency.assignedTeam || 'Triage Queue'}</strong>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => onNavigate('map')}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center"
          >
            Locate on Emergency Map
          </button>
          <button
            onClick={onBack}
            className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer text-center shadow-md shadow-rose-950"
          >
            Back to Citizen Dashboard
          </button>
        </div>

      </div>

    </div>
  );
};
