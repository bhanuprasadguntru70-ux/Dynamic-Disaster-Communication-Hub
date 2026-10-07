import React, { useState } from 'react';
import { 
  Flame, 
  Search, 
  ShieldAlert, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  UserCheck, 
  Check, 
  RotateCcw,
  MapPin
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { EmergencyRecord, EmergencyStatus } from '../models/emergency';
import { emergencyService } from '../services/emergencyService';
import { StatusTimeline } from '../components/StatusTimeline';
import { soundManager } from '../utils/audio';

interface RescueDashboardPageProps {
  lang: Language;
  emergencies: EmergencyRecord[];
  onEmergencyUpdated: (record: EmergencyRecord) => void;
  focusedEmergencyId?: string;
}

export const RescueDashboardPage: React.FC<RescueDashboardPageProps> = ({
  lang,
  emergencies,
  onEmergencyUpdated,
  focusedEmergencyId,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const [search, setSearch] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | EmergencyStatus>('ALL');
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyRecord | null>(
    emergencies.find(e => e.id === focusedEmergencyId) || emergencies[0] || null
  );

  const handleStatusTransition = (emg: EmergencyRecord, nextStatus: EmergencyStatus, team?: string) => {
    const updated = emergencyService.updateStatus(emg.id, nextStatus, team);
    if (updated) {
      if (nextStatus === 'RESOLVED') {
        soundManager.playAllClearChime();
      } else {
        soundManager.playDispatchChime();
      }
      onEmergencyUpdated(updated);
      if (selectedEmergency?.id === emg.id) {
        setSelectedEmergency(updated);
      }
    }
  };

  const activeCount = emergencies.filter(e => e.status === 'ACTIVE').length;
  const criticalCount = emergencies.filter(e => e.severity === 'CRITICAL' && e.status !== 'RESOLVED').length;
  const assignedCount = emergencies.filter(e => e.status === 'ASSIGNED').length;
  const inProgressCount = emergencies.filter(e => e.status === 'RESCUE IN PROGRESS').length;
  const resolvedCount = emergencies.filter(e => e.status === 'RESOLVED').length;

  const filtered = emergencies.filter(e => {
    const matchesSearch = e.id.toLowerCase().includes(search.toLowerCase()) ||
                          e.type.toLowerCase().includes(search.toLowerCase()) ||
                          e.description.toLowerCase().includes(search.toLowerCase()) ||
                          (e.location.address && e.location.address.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = selectedStatusFilter === 'ALL' || e.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs font-semibold text-rose-500 uppercase tracking-widest block mb-1">
            Incident Command Operations
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-rose-500" />
            <span>Search &amp; Rescue Operations Command Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time rescue team assignments, emergency acceptance triage, and incident resolution tracking.
          </p>
        </div>

        <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono">
          <span className="text-rose-400 font-bold">RESCUE DISPATCH DESK</span>
        </div>
      </div>

      {/* 5 Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div 
          onClick={() => setSelectedStatusFilter('ACTIVE')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'ACTIVE'
              ? 'bg-rose-950/40 border-rose-600 ring-2 ring-rose-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">ACTIVE</span>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-rose-400">{activeCount}</div>
          <span className="text-[10px] text-slate-500">Unassigned emergencies</span>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter('ALL')}
          className="p-4 rounded-2xl border bg-slate-900 border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
        >
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">CRITICAL</span>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-rose-500">{criticalCount}</div>
          <span className="text-[10px] text-slate-500">Immediate life threat</span>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter('ASSIGNED')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'ASSIGNED'
              ? 'bg-sky-950/40 border-sky-600 ring-2 ring-sky-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">ASSIGNED</span>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-sky-400">{assignedCount}</div>
          <span className="text-[10px] text-slate-500">Squad designated</span>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter('RESCUE IN PROGRESS')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'RESCUE IN PROGRESS'
              ? 'bg-amber-950/40 border-amber-600 ring-2 ring-amber-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">IN PROGRESS</span>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-amber-400">{inProgressCount}</div>
          <span className="text-[10px] text-slate-500">Units on-scene</span>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter('RESOLVED')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer col-span-2 sm:col-span-1 ${
            selectedStatusFilter === 'RESOLVED'
              ? 'bg-emerald-950/40 border-emerald-600 ring-2 ring-emerald-500/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">RESOLVED</span>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-emerald-400">{resolvedCount}</div>
          <span className="text-[10px] text-slate-500">Safe extract complete</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ID, incident type, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500"
          />
        </div>

        {selectedStatusFilter !== 'ALL' && (
          <button
            onClick={() => setSelectedStatusFilter('ALL')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            Clear Status Filter ({selectedStatusFilter}) ✕
          </button>
        )}
      </div>

      {/* Main Table + Active Dossier Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Table View (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-950/60 font-mono">
                  <th className="py-3 px-3">Emergency ID</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                {filtered.map((emg) => {
                  const isSelected = selectedEmergency?.id === emg.id;
                  return (
                    <tr 
                      key={emg.id} 
                      onClick={() => setSelectedEmergency(emg)}
                      className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-slate-800/80' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-rose-400">
                        {emg.id}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {emg.type}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          emg.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          emg.severity === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {emg.severity}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 truncate max-w-[140px]">
                        {emg.location.address || `${emg.location.latitude}, ${emg.location.longitude}`}
                      </td>
                      <td className="py-3 px-3 font-mono text-[10.5px]">
                        <span className={`font-bold ${
                          emg.status === 'ACTIVE' ? 'text-rose-400' :
                          emg.status === 'ASSIGNED' ? 'text-sky-400' :
                          emg.status === 'RESCUE IN PROGRESS' ? 'text-amber-400' :
                          'text-emerald-400'
                        }`}>
                          {emg.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmergency(emg);
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10.5px] font-bold cursor-pointer"
                        >
                          {t('view')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Incident Drawer / Operations Console (5 cols) */}
        {selectedEmergency && (
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-rose-400 font-bold text-xs">{selectedEmergency.id}</span>
                <h3 className="text-lg font-bold text-white leading-tight mt-0.5">
                  {selectedEmergency.type} Emergency
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  {selectedEmergency.location.address}
                </p>
              </div>

              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-rose-400 font-mono font-bold text-xs">
                {selectedEmergency.severity}
              </span>
            </div>

            {/* Interactive Timeline */}
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block text-center mb-1">
                Incident Lifecycle Timeline
              </span>
              <StatusTimeline
                currentStatus={selectedEmergency.status}
                allowInteractive={true}
                onStatusChange={(newStatus) => handleStatusTransition(selectedEmergency, newStatus)}
              />
            </div>

            {/* Situation details */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">
                Field Briefing &amp; Casualty Record
              </span>
              <p className="text-slate-200 leading-relaxed text-[11.5px]">
                {selectedEmergency.description}
              </p>
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block">Civilians Affected</span>
                  <span className="text-white font-bold">{selectedEmergency.peopleAffected || 1}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Injured Count</span>
                  <span className="text-rose-400 font-bold">{selectedEmergency.injuredCount || 0}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Assigned Squad</span>
                  <span className="text-sky-400 font-bold">{selectedEmergency.assignedTeam || 'None Assigned'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Contact Phone</span>
                  <span className="text-slate-300 font-bold">{selectedEmergency.contactNumber}</span>
                </div>
              </div>
            </div>

            {/* Operations Action Stepper Buttons: ACCEPT, ASSIGN, UPDATE, RESOLVE */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">
                Command Dispatch Transitions:
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleStatusTransition(selectedEmergency, 'ACKNOWLEDGED')}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  {t('accept')} (Acknowledge)
                </button>

                <button
                  onClick={() => handleStatusTransition(selectedEmergency, 'ASSIGNED', 'NDRF Rapid Response Squad 3')}
                  className="py-2.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  {t('assign')} (Task Squad)
                </button>

                <button
                  onClick={() => handleStatusTransition(selectedEmergency, 'RESCUE IN PROGRESS')}
                  className="py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  {t('update')} (In Progress)
                </button>

                <button
                  onClick={() => handleStatusTransition(selectedEmergency, 'RESOLVED')}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  {t('resolve')} (Close Case)
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
