import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Navigation, 
  Ambulance, 
  CheckCircle2, 
  AlertCircle, 
  Bed, 
  Activity, 
  Search, 
  Info 
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { Hospital } from '../models/entities';

interface HospitalsPageProps {
  onNavigate: (section: string) => void;
  lang: Language;
  hospitals: Hospital[];
}

export const HospitalsPage: React.FC<HospitalsPageProps> = ({
  onNavigate,
  lang,
  hospitals,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const [search, setSearch] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [callingNumber, setCallingNumber] = useState<string | null>(null);

  const filtered = hospitals.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase()) ||
    h.services.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest block mb-1">
            Emergency Medical Infrastructure
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-400" />
            <span>{t('nearbyHospitals')} &amp; Trauma Centers</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified ICU beds, trauma triage availability, blood bank status, and ambulance deployment.
          </p>
        </div>

        <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
          <span className="text-sky-400 font-bold font-mono">DEMO HEALTHCARE REGISTRY</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Filter hospitals by name, city, services (e.g. Apollo, Trauma, ICU)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((hospital) => {
          const isOpen = hospital.status === 'OPEN';
          const isFull = hospital.emergencyAvailability === 'Full';
          const isHigh = hospital.emergencyAvailability === 'High Occupancy';

          return (
            <div
              key={hospital.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 text-xs shadow-md hover:border-slate-700 transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-sky-400 font-bold text-[11px]">{hospital.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isFull ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    isHigh ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {hospital.emergencyAvailability}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {hospital.name}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">{hospital.location}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 my-3 p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-center tabular-nums">
                  <div>
                    <span className="text-[10px] text-slate-500 block">General Beds</span>
                    <span className="text-sm font-bold text-emerald-400">{hospital.availableGeneral}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">ICU Beds</span>
                    <span className="text-sm font-bold text-sky-400">{hospital.availableICU}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Ambulances</span>
                    <span className="text-sm font-bold text-white">{hospital.ambulanceAvailable}</span>
                  </div>
                </div>

                {/* Services list */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                    Specialized Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {hospital.services.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10.5px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: VIEW, CALL, DIRECTIONS */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setSelectedHospital(hospital)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  {t('view')}
                </button>

                <button
                  onClick={() => setCallingNumber(hospital.contact)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3 h-3" />
                  <span>{t('call')}</span>
                </button>

                <button
                  onClick={() => onNavigate('map')}
                  className="flex-1 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3 h-3" />
                  <span>{t('directions')}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Hospital View Details Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-xs text-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-sky-400 font-bold text-xs">{selectedHospital.id}</span>
                <h3 className="text-lg font-bold text-white">{selectedHospital.name}</h3>
                <p className="text-xs text-slate-400">{selectedHospital.location}</p>
              </div>
              <button
                onClick={() => setSelectedHospital(null)}
                className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono space-y-1.5 tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Bed Capacity:</span>
                <span className="text-white font-bold">{selectedHospital.totalBeds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Available General Beds:</span>
                <span className="text-emerald-400 font-bold">{selectedHospital.availableGeneral}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Available ICU Units:</span>
                <span className="text-sky-400 font-bold">{selectedHospital.availableICU}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency Contact:</span>
                <span className="text-emerald-400 font-bold">{selectedHospital.contact}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setCallingNumber(selectedHospital.contact)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Emergency Desk</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Call Modal */}
      {callingNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-slate-900 border border-emerald-500 rounded-2xl shadow-2xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                DIALING EMERGENCY LINE
              </span>
              <h3 className="text-xl font-bold font-mono text-white mt-1">
                {callingNumber}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct connection to trauma casualty coordinator.
              </p>
            </div>
            <button
              onClick={() => setCallingNumber(null)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              End Simulation Call
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
