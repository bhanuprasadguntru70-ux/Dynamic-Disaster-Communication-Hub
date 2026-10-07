import React from 'react';
import { X, PhoneCall, Radio, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

interface EmergencyHotlinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HOTLINES = [
  {
    name: 'National Emergency Response & Dispatch',
    number: '911',
    description: 'Immediate life-safety dispatch for police, fire suppression, and emergency medical services.',
    category: 'Universal Dispatch',
  },
  {
    name: 'FEMA Disaster Assistance & Housing',
    number: '1-800-621-3362 (FEMA)',
    description: 'Federal individual disaster assistance, temporary displacement lodging, and emergency grants.',
    category: 'Civilian Aid',
  },
  {
    name: 'Disaster Distress Helpline (SAMHSA)',
    number: '1-800-985-5990 or Text 66746',
    description: '24/7, 365-day crisis counseling for people experiencing emotional distress related to natural disasters.',
    category: 'Mental Health & Trauma',
  },
  {
    name: 'American Red Cross Crisis Logistics',
    number: '1-800-733-2767 (RED-CROSS)',
    description: 'Family reunification tracing, shelter locations, food rations, and blood bank coordination.',
    category: 'Humanitarian & Shelters',
  },
  {
    name: 'National Poison Control & Hazmat Center',
    number: '1-800-222-1222',
    description: 'Toxic chemical plumes, smoke inhalation toxicity, contaminated water consumption triage.',
    category: 'Hazmat & Toxicology',
  },
  {
    name: 'US Coast Guard Search & Rescue Rescue Coordination',
    number: '1-800-323-7233',
    description: 'Maritime rescue, inland waterway flood extraction, and helicopter hoist operations.',
    category: 'Water Search & Rescue',
  },
];

const RADIO_FREQUENCIES = [
  { channel: 'NOAA Weather Radio 1', freq: '162.400 MHz', role: 'Continuous weather hazard broadcasts & EAS activation' },
  { channel: 'NOAA Weather Radio 2', freq: '162.425 MHz', role: 'Secondary regional transmitter' },
  { channel: 'NOAA Weather Radio 3', freq: '162.450 MHz', role: 'Regional flood & severe storm telemetry' },
  { channel: 'VHF Marine Ch 16', freq: '156.800 MHz', role: 'International distress, safety, and calling channel' },
  { channel: 'Aviation Emergency', freq: '121.500 MHz', role: 'Civil aircraft emergency frequency (Guard)' },
];

export const EmergencyHotlinesModal: React.FC<EmergencyHotlinesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 text-xs text-slate-200 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-bold text-white">Emergency Direct Hotlines &amp; Radio Channels</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 mt-3">
          
          {/* Hotlines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {HOTLINES.map((h, i) => (
              <div key={i} className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-sky-400 uppercase font-semibold">{h.category}</span>
                </div>
                <h4 className="font-bold text-white text-xs">{h.name}</h4>
                <div className="p-1.5 bg-slate-900 border border-slate-800 rounded text-center my-1">
                  <span className="text-sm font-bold font-mono text-emerald-400 select-all tracking-wider">
                    {h.number}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{h.description}</p>
              </div>
            ))}
          </div>

          {/* Radio Frequencies Table */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Civil Defense Emergency Radio Frequencies</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-1.5 px-2">Channel / Service</th>
                    <th className="py-1.5 px-2 font-mono">Frequency</th>
                    <th className="py-1.5 px-2">Operational Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {RADIO_FREQUENCIES.map((rf, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2 px-2 font-sans text-slate-200 font-medium">{rf.channel}</td>
                      <td className="py-2 px-2 text-sky-400 font-bold tabular-nums">{rf.freq}</td>
                      <td className="py-2 px-2 font-sans text-slate-400 text-[11px]">{rf.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div className="pt-4 mt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-xs cursor-pointer"
          >
            Close Directory
          </button>
        </div>

      </div>
    </div>
  );
};
