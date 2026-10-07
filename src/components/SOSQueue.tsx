import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Phone, 
  MapPin, 
  Users, 
  Volume2, 
  ShieldAlert, 
  Ambulance, 
  Clock,
  Plus
} from 'lucide-react';
import { SOSBeacon } from '../types/disaster';
import { soundManager } from '../utils/audio';

interface SOSQueueProps {
  beacons: SOSBeacon[];
  onUpdateBeacon: (beacon: SOSBeacon) => void;
  onOpenSOSModal: () => void;
}

export const SOSQueue: React.FC<SOSQueueProps> = ({
  beacons,
  onUpdateBeacon,
  onOpenSOSModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBeacon, setSelectedBeacon] = useState<SOSBeacon | null>(beacons[0] || null);

  const filteredBeacons = beacons.filter(b => {
    const matchesSearch = b.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.locationText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || b.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleDispatch = (beacon: SOSBeacon) => {
    const updated: SOSBeacon = {
      ...beacon,
      status: 'responding',
      assignedSquad: 'Rapid SAR Team Delta',
    };
    soundManager.playDispatchChime();
    onUpdateBeacon(updated);
    if (selectedBeacon?.id === beacon.id) {
      setSelectedBeacon(updated);
    }
  };

  const handleMarkRescued = (beacon: SOSBeacon) => {
    const updated: SOSBeacon = {
      ...beacon,
      status: 'rescued',
    };
    soundManager.playAllClearChime();
    onUpdateBeacon(updated);
    if (selectedBeacon?.id === beacon.id) {
      setSelectedBeacon(updated);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Citizen Emergency SOS Beacon Queue</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time distress broadcasts logged by civilians in danger zones. Priority triage based on entrapment &amp; trauma.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => soundManager.playSOSMorseBeacon()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Acoustic Morse Code Distress Test"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Play SOS Audio Beacon</span>
          </button>

          <button
            onClick={onOpenSOSModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast Distress SOS</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-lg text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by citizen name, street address, keywords (e.g. trapped, roof)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs"
            />
          </div>
        </div>

        {/* Priority & Status dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-300 focus:outline-none focus:border-rose-500 text-xs"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical Priority</option>
            <option value="Urgent">Urgent</option>
            <option value="Standard">Standard</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-300 focus:outline-none focus:border-rose-500 text-xs"
          >
            <option value="all">All States</option>
            <option value="pending">Pending Rescue</option>
            <option value="responding">Unit Responding</option>
            <option value="rescued">Safe / Rescued</option>
          </select>
        </div>
      </div>

      {/* Grid of Distress Beacon Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredBeacons.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500 text-xs">
            No distress beacons matching your query.
          </div>
        ) : (
          filteredBeacons.map((beacon) => {
            const isCritical = beacon.priority === 'Critical';
            return (
              <div
                key={beacon.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all text-xs ${
                  beacon.status === 'rescued'
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-70'
                    : isCritical
                    ? 'bg-rose-950/20 border-rose-900/60 ring-1 ring-rose-500/20 shadow-md'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-slate-400 font-semibold">{beacon.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        beacon.priority === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        beacon.priority === 'Urgent' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {beacon.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        beacon.status === 'pending' ? 'bg-amber-950 text-amber-300' :
                        beacon.status === 'responding' ? 'bg-sky-950 text-sky-300' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {beacon.status}
                      </span>
                    </div>
                  </div>

                  {/* Citizen Title & Location */}
                  <h3 className="text-base font-bold text-white mb-1">
                    {beacon.citizenName}
                  </h3>

                  <div className="flex items-start gap-1.5 text-slate-300 mb-2.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-[11.5px] leading-snug">{beacon.locationText}</span>
                  </div>

                  {/* Badges for Trapped / Medical */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1 text-[11px]">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span className="font-mono tabular-nums">{beacon.peopleCount}</span> Persons
                    </span>

                    {beacon.isTrapped && (
                      <span className="px-2 py-0.5 rounded bg-rose-950/70 border border-rose-800 text-rose-300 flex items-center gap-1 text-[11px] font-semibold">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        Entrapped
                      </span>
                    )}

                    {beacon.hasMedicalNeed && (
                      <span className="px-2 py-0.5 rounded bg-rose-950/70 border border-rose-800 text-rose-300 flex items-center gap-1 text-[11px] font-semibold">
                        <Ambulance className="w-3 h-3 text-rose-400" />
                        Medical Emergency
                      </span>
                    )}
                  </div>

                  {/* Distress Description Notes */}
                  <p className="text-slate-300 text-[11.5px] leading-relaxed bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 mb-3">
                    &quot;{beacon.notes}&quot;
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span className="font-mono">{beacon.contact}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{beacon.timestamp}</span>
                    </span>
                  </div>

                  {beacon.assignedSquad && (
                    <div className="p-2 mb-3 bg-sky-950/40 border border-sky-800 rounded text-[11px] text-sky-200">
                      Dispatched: <span className="font-semibold">{beacon.assignedSquad}</span>
                    </div>
                  )}
                </div>

                {/* Operations Action Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex gap-2">
                  {beacon.status !== 'rescued' && (
                    <>
                      {beacon.status === 'pending' && (
                        <button
                          onClick={() => handleDispatch(beacon)}
                          className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                        >
                          Dispatch SAR Team
                        </button>
                      )}
                      <button
                        onClick={() => handleMarkRescued(beacon)}
                        className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        Confirm Rescued
                      </button>
                    </>
                  )}
                  {beacon.status === 'rescued' && (
                    <div className="w-full py-1 text-center text-emerald-400 font-semibold flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Civilian Evacuated Safely</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
