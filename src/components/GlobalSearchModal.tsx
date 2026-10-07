import React, { useState } from 'react';
import { Search, X, ShieldAlert, Building2, Home, AlertTriangle, MapPin, ArrowRight } from 'lucide-react';
import { emergencyService } from '../services/emergencyService';
import { hospitalService, shelterService, alertService } from '../services/dataService';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string, filterId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const emergencies = emergencyService.getAll().filter(e => 
    e.id.toLowerCase().includes(query.toLowerCase()) ||
    e.type.toLowerCase().includes(query.toLowerCase()) ||
    e.description.toLowerCase().includes(query.toLowerCase()) ||
    (e.location.address && e.location.address.toLowerCase().includes(query.toLowerCase()))
  );

  const hospitals = hospitalService.getAll().filter(h =>
    h.name.toLowerCase().includes(query.toLowerCase()) ||
    h.location.toLowerCase().includes(query.toLowerCase()) ||
    h.services.some(s => s.toLowerCase().includes(query.toLowerCase()))
  );

  const shelters = shelterService.getAll().filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.location.toLowerCase().includes(query.toLowerCase())
  );

  const alerts = alertService.getAll().filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.location.toLowerCase().includes(query.toLowerCase())
  );

  const hasResults = query.trim() && (emergencies.length > 0 || hospitals.length > 0 || shelters.length > 0 || alerts.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 text-xs text-slate-200">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-800 pb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            autoFocus
            placeholder="Search Emergency ID (EMG-DEMO-0001), Hospital, Shelter, Alert, Location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
          />
          <button
            onClick={onClose}
            className="absolute right-3 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-96 overflow-y-auto mt-3 space-y-4">
          {!query.trim() && (
            <div className="py-8 text-center text-slate-500 text-xs">
              Type keywords, Emergency IDs (e.g. &quot;EMG-DEMO&quot;), cities, hospitals, or shelter names to find resources.
            </div>
          )}

          {query.trim() && !hasResults && (
            <div className="py-8 text-center text-slate-500 text-xs">
              No matching records found for &quot;{query}&quot;. Try searching for &quot;Flood&quot;, &quot;Vijayawada&quot;, or &quot;Apollo&quot;.
            </div>
          )}

          {/* Emergencies */}
          {emergencies.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-rose-400 tracking-wider block mb-1.5">
                Active Emergencies ({emergencies.length})
              </span>
              <div className="space-y-1.5">
                {emergencies.slice(0, 4).map(e => (
                  <div
                    key={e.id}
                    onClick={() => {
                      onNavigate('rescue', e.id);
                      onClose();
                    }}
                    className="p-2.5 bg-slate-950/70 hover:bg-slate-800/80 rounded-lg border border-slate-800/80 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="font-mono font-bold text-white text-xs">{e.id}</span>
                      <span className="text-slate-400 text-xs">·</span>
                      <span className="text-slate-300 text-xs font-semibold">{e.type}</span>
                      <span className="text-slate-500 text-xs truncate max-w-xs">{e.description}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800 shrink-0">
                      {e.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hospitals */}
          {hospitals.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-sky-400 tracking-wider block mb-1.5">
                Hospitals &amp; Medical Facilities ({hospitals.length})
              </span>
              <div className="space-y-1.5">
                {hospitals.slice(0, 3).map(h => (
                  <div
                    key={h.id}
                    onClick={() => {
                      onNavigate('hospitals');
                      onClose();
                    }}
                    className="p-2.5 bg-slate-950/70 hover:bg-slate-800/80 rounded-lg border border-slate-800/80 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                      <div>
                        <span className="font-bold text-white text-xs block">{h.name}</span>
                        <span className="text-slate-400 text-[11px]">{h.location}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 tabular-nums">
                      {h.availableGeneral} Beds Available
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shelters */}
          {shelters.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider block mb-1.5">
                Evacuation Shelters ({shelters.length})
              </span>
              <div className="space-y-1.5">
                {shelters.slice(0, 3).map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onNavigate('shelters');
                      onClose();
                    }}
                    className="p-2.5 bg-slate-950/70 hover:bg-slate-800/80 rounded-lg border border-slate-800/80 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold text-white text-xs block">{s.name}</span>
                        <span className="text-slate-400 text-[11px]">{s.location}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 tabular-nums">
                      {s.availableSpaces} spaces open
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts */}
          {alerts.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider block mb-1.5">
                Active Disaster Alerts ({alerts.length})
              </span>
              <div className="space-y-1.5">
                {alerts.slice(0, 3).map(a => (
                  <div
                    key={a.id}
                    onClick={() => {
                      onNavigate('alerts');
                      onClose();
                    }}
                    className="p-2.5 bg-slate-950/70 hover:bg-slate-800/80 rounded-lg border border-slate-800/80 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-bold text-white text-xs block">{a.title}</span>
                        <span className="text-slate-400 text-[11px]">{a.location}</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                      {a.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
