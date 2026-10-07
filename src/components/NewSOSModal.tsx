import React, { useState } from 'react';
import { X, LifeBuoy, AlertTriangle, Send, MapPin, Users, Phone } from 'lucide-react';
import { SOSBeacon } from '../types/disaster';
import { soundManager } from '../utils/audio';

interface NewSOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (beacon: SOSBeacon) => void;
}

export const NewSOSModal: React.FC<NewSOSModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [citizenName, setCitizenName] = useState('');
  const [contact, setContact] = useState('');
  const [locationText, setLocationText] = useState('');
  const [peopleCount, setPeopleCount] = useState(2);
  const [isTrapped, setIsTrapped] = useState(false);
  const [hasMedicalNeed, setHasMedicalNeed] = useState(false);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !locationText.trim() || !contact.trim()) return;

    const isCritical = isTrapped || hasMedicalNeed;

    const newBeacon: SOSBeacon = {
      id: `SOS-${String(Math.floor(Math.random() * 900) + 100)}`,
      citizenName: citizenName.trim(),
      contact: contact.trim(),
      locationText: locationText.trim(),
      x: 30 + Math.floor(Math.random() * 40),
      y: 30 + Math.floor(Math.random() * 40),
      priority: isCritical ? 'Critical' : 'Urgent',
      peopleCount: Number(peopleCount) || 1,
      hasMedicalNeed,
      isTrapped,
      notes: notes.trim() || 'Distress beacon activated. Immediate assistance requested.',
      timestamp: 'Just now',
      status: 'pending',
    };

    soundManager.playSOSMorseBeacon();
    onSubmit(newBeacon);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-rose-500/60 rounded-xl shadow-2xl p-5 text-xs text-slate-200 ring-1 ring-rose-500/30">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
            <div>
              <h3 className="text-base font-bold text-white">Broadcast Emergency SOS Beacon</h3>
              <p className="text-[11px] text-rose-400">Directly alerts Search &amp; Rescue triage commanders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-3">
          
          <div className="p-2.5 bg-rose-950/40 border border-rose-900/60 rounded-lg text-rose-200 text-[11px] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>
              If you or someone with you has immediate life-threatening physical trauma, call 911 if cellular voice is functional. Use this beacon if lines are busy or down.
            </span>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Your Full Name or Household Family Name:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Elena Rostova / The Miller Family"
              value={citizenName}
              onChange={(e) => setCitizenName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Cell / Satellite Phone:
              </label>
              <input
                type="text"
                required
                placeholder="(555) 000-0000"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Number of People:
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Precise Address / Physical Landmarks:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 742 Evergreen Terrace, 2nd floor, red roof house near creek"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Urgent Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <label className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center gap-2 cursor-pointer hover:border-rose-900 transition-colors">
              <input
                type="checkbox"
                checked={isTrapped}
                onChange={(e) => setIsTrapped(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
              />
              <span className="text-[11.5px] font-semibold text-slate-200">
                Entrapped / Cut Off (Flood/Fire)
              </span>
            </label>

            <label className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center gap-2 cursor-pointer hover:border-rose-900 transition-colors">
              <input
                type="checkbox"
                checked={hasMedicalNeed}
                onChange={(e) => setHasMedicalNeed(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
              />
              <span className="text-[11.5px] font-semibold text-slate-200">
                Urgent Medical Need / Oxygen
              </span>
            </label>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Emergency Situation Notes:
            </label>
            <textarea
              rows={3}
              placeholder="Describe hazards: rising water depth, smoke severity, special mobility needs..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-950"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast SOS to Command</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
