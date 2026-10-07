import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Flame, 
  Waves, 
  Activity, 
  Biohazard, 
  Users, 
  Ambulance, 
  Truck, 
  Wind, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  MessageSquare, 
  Send
} from 'lucide-react';
import { DisasterIncident, DisasterType, SeverityLevel, EvacuationOrder } from '../types/disaster';
import { soundManager } from '../utils/audio';

interface IncidentsManagerProps {
  incidents: DisasterIncident[];
  onUpdateIncident: (incident: DisasterIncident) => void;
  onOpenNewIncidentModal: () => void;
}

export const IncidentsManager: React.FC<IncidentsManagerProps> = ({
  incidents,
  onUpdateIncident,
  onOpenNewIncidentModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [newLogMessage, setNewLogMessage] = useState('');

  const activeIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || inc.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' || inc.severity === selectedSeverity;
    return matchesSearch && matchesType && matchesSeverity;
  });

  const handleDispatchChange = (unit: 'sarTeams' | 'fireEngines' | 'medicalUnits' | 'helicopters' | 'amphibiousVehicles', delta: number) => {
    if (!activeIncident) return;
    const currentVal = activeIncident.dispatchedUnits[unit] || 0;
    const newVal = Math.max(0, currentVal + delta);
    
    const updated: DisasterIncident = {
      ...activeIncident,
      dispatchedUnits: {
        ...activeIncident.dispatchedUnits,
        [unit]: newVal,
      },
      lastUpdate: 'Just now',
    };
    soundManager.playDispatchChime();
    onUpdateIncident(updated);
  };

  const handleEvacStatusChange = (status: EvacuationOrder) => {
    if (!activeIncident) return;
    const updated: DisasterIncident = {
      ...activeIncident,
      evacuationStatus: status,
      lastUpdate: 'Just now',
      actionLog: [
        {
          id: Date.now().toString(),
          time: 'Just now',
          message: `Evacuation order updated to: ${status}`,
          author: 'Incident Command Desk',
        },
        ...activeIncident.actionLog,
      ],
    };
    soundManager.playDispatchChime();
    onUpdateIncident(updated);
  };

  const handleStatusChange = (status: 'active' | 'contained' | 'resolved') => {
    if (!activeIncident) return;
    const updated: DisasterIncident = {
      ...activeIncident,
      status,
      lastUpdate: 'Just now',
      actionLog: [
        {
          id: Date.now().toString(),
          time: 'Just now',
          message: `Incident state changed to: ${status.toUpperCase()}`,
          author: 'EOC Operations Supervisor',
        },
        ...activeIncident.actionLog,
      ],
    };
    if (status === 'resolved' || status === 'contained') {
      soundManager.playAllClearChime();
    } else {
      soundManager.playDispatchChime();
    }
    onUpdateIncident(updated);
  };

  const handleAddActionLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogMessage.trim() || !activeIncident) return;
    const updated: DisasterIncident = {
      ...activeIncident,
      lastUpdate: 'Just now',
      actionLog: [
        {
          id: Date.now().toString(),
          time: 'Just now',
          message: newLogMessage.trim(),
          author: 'Watch Officer',
        },
        ...activeIncident.actionLog,
      ],
    };
    onUpdateIncident(updated);
    setNewLogMessage('');
  };

  const getTypeIcon = (type: DisasterType) => {
    switch (type) {
      case 'wildfire': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'flood': return <Waves className="w-4 h-4 text-cyan-400" />;
      case 'earthquake': return <Activity className="w-4 h-4 text-pink-400" />;
      case 'chemical_leak': return <Biohazard className="w-4 h-4 text-lime-400" />;
      default: return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>Incident Command &amp; Crisis Triage</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active hazard telemetry, casualty records, and asset deployment across all operational sectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewIncidentModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Crisis Incident</span>
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
              placeholder="Filter by title, sector, code (e.g. INC-2026)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs"
            />
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-md border border-slate-800">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedType === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('wildfire')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedType === 'wildfire' ? 'bg-orange-950 text-orange-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Wildfire
            </button>
            <button
              onClick={() => setSelectedType('flood')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedType === 'flood' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Flood
            </button>
            <button
              onClick={() => setSelectedType('earthquake')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedType === 'earthquake' ? 'bg-pink-950 text-pink-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Quake
            </button>
            <button
              onClick={() => setSelectedType('chemical_leak')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedType === 'chemical_leak' ? 'bg-lime-950 text-lime-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hazmat
            </button>
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-300 focus:outline-none focus:border-rose-500 text-xs"
          >
            <option value="all">All Severities</option>
            <option value="Catastrophic">Catastrophic</option>
            <option value="Severe">Severe</option>
            <option value="Moderate">Moderate</option>
            <option value="Advisory">Advisory</option>
          </select>
        </div>
      </div>

      {/* Main Split Layout: Table/List on Left + Full Operations Console on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Incidents List (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          {filteredIncidents.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500 text-xs">
              No matching disaster incidents recorded for this filter query.
            </div>
          ) : (
            filteredIncidents.map((incident) => {
              const isSelected = activeIncident?.id === incident.id;
              return (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncidentId(incident.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-slate-900 border-rose-500/70 ring-1 ring-rose-500/30 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {getTypeIcon(incident.type)}
                      <span className="font-mono text-slate-400 font-semibold">{incident.id}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-300 font-medium capitalize">{incident.type}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase ${
                      incident.severity === 'Catastrophic' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      incident.severity === 'Severe' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-sky-950 text-sky-300 border border-sky-800'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    {incident.title}
                  </h4>
                  <p className="text-slate-400 text-[11px] truncate mb-2">
                    {incident.region}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/70 text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      <span className="font-mono tabular-nums">{incident.affectedPopulation.toLocaleString()}</span> at risk
                    </span>
                    <span className={`font-medium ${
                      incident.status === 'active' ? 'text-rose-400' :
                      incident.status === 'contained' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {incident.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Incident Detail Console (7 cols) */}
        {activeIncident && (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 shadow-lg">
            
            {/* Top Bar of Active Incident */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1 text-xs">
                  <span className="font-mono text-rose-400 font-semibold">{activeIncident.id}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-400">{activeIncident.region}</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {activeIncident.title}
                </h3>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => handleStatusChange('active')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    activeIncident.status === 'active' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => handleStatusChange('contained')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    activeIncident.status === 'contained' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Contained
                </button>
                <button
                  onClick={() => handleStatusChange('resolved')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    activeIncident.status === 'resolved' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>

            {/* Evacuation Control & Casualties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Evacuation Order Setting */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  Civil Evacuation Protocol
                </span>
                <select
                  value={activeIncident.evacuationStatus}
                  onChange={(e) => handleEvacStatusChange(e.target.value as EvacuationOrder)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-100 text-xs focus:outline-none focus:border-rose-500 font-semibold"
                >
                  <option value="Mandatory Evacuation">Mandatory Evacuation</option>
                  <option value="Voluntary Evacuation">Voluntary Evacuation</option>
                  <option value="Shelter-in-Place">Shelter-in-Place</option>
                  <option value="Normal / Standby">Normal / Standby</option>
                </select>
                <span className="text-[11px] text-slate-400 block">
                  Broadcasts automatically synchronized with local cell emergency alert system.
                </span>
              </div>

              {/* Casualties & Safe Verification */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  Civilian Casualty Accountability
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-center pt-1 font-mono tabular-nums">
                  <div className="p-1.5 bg-rose-950/30 border border-rose-900/40 rounded">
                    <span className="text-rose-400 font-bold text-sm block">{activeIncident.casualties.injured}</span>
                    <span className="text-[10px] text-slate-400">Injured</span>
                  </div>
                  <div className="p-1.5 bg-amber-950/30 border border-amber-900/40 rounded">
                    <span className="text-amber-400 font-bold text-sm block">{activeIncident.casualties.missing}</span>
                    <span className="text-[10px] text-slate-400">Missing</span>
                  </div>
                  <div className="p-1.5 bg-emerald-950/30 border border-emerald-900/40 rounded">
                    <span className="text-emerald-400 font-bold text-sm block">{activeIncident.casualties.confirmedSafe.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400">Safe/Evac</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Dispatched Field Units Stepper */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
                Emergency Response Force Deployment
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                
                {/* SAR Teams */}
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-medium text-[11px]">SAR Teams</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold font-mono tabular-nums text-white">
                      {activeIncident.dispatchedUnits.sarTeams}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDispatchChange('sarTeams', -1)}
                        className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center justify-center font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleDispatchChange('sarTeams', 1)}
                        className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center justify-center font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fire Engines */}
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Truck className="w-3.5 h-3.5 text-orange-400" />
                    <span className="font-medium text-[11px]">Fire Engines</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold font-mono tabular-nums text-white">
                      {activeIncident.dispatchedUnits.fireEngines}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDispatchChange('fireEngines', -1)}
                        className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center justify-center font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleDispatchChange('fireEngines', 1)}
                        className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center justify-center font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Medical Ambulances */}
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Ambulance className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-medium text-[11px]">Medical Units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold font-mono tabular-nums text-white">
                      {activeIncident.dispatchedUnits.medicalUnits}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDispatchChange('medicalUnits', -1)}
                        className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center justify-center font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleDispatchChange('medicalUnits', 1)}
                        className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center justify-center font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Helicopters */}
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Wind className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-medium text-[11px]">Air Ops / Helis</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold font-mono tabular-nums text-white">
                      {activeIncident.dispatchedUnits.helicopters}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDispatchChange('helicopters', -1)}
                        className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center justify-center font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleDispatchChange('helicopters', 1)}
                        className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center justify-center font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Operational Action Log & Live Situation Feeds */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                <span>Incident Action Log (EOC Communications)</span>
              </span>

              {/* Log message input */}
              <form onSubmit={handleAddActionLog} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Record tactical field update (e.g. Dozer unit completed eastern containment line)..."
                  value={newLogMessage}
                  onChange={(e) => setNewLogMessage(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs"
                />
                <button
                  type="submit"
                  disabled={!newLogMessage.trim()}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Log</span>
                </button>
              </form>

              {/* Entries list */}
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-xs">
                {activeIncident.actionLog.map((log) => (
                  <div key={log.id} className="p-2 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                      <span className="font-semibold text-slate-300">{log.author}</span>
                      <span className="font-mono text-slate-500">{log.time}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11.5px]">{log.message}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
