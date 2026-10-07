import React, { useState } from 'react';
import { X, ShieldAlert, Plus, MapPin } from 'lucide-react';
import { DisasterIncident, DisasterType, SeverityLevel, EvacuationOrder } from '../types/disaster';
import { soundManager } from '../utils/audio';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: DisasterIncident) => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<DisasterType>('wildfire');
  const [severity, setSeverity] = useState<SeverityLevel>('Severe');
  const [region, setRegion] = useState('Sector Bravo / Zone 2');
  const [evacuationStatus, setEvacuationStatus] = useState<EvacuationOrder>('Mandatory Evacuation');
  const [affectedPopulation, setAffectedPopulation] = useState(25000);
  const [radiusKm, setRadiusKm] = useState(18);
  const [windSpeedKmH, setWindSpeedKmH] = useState(45);
  const [incidentCommander, setIncidentCommander] = useState('Deputy Chief James Miller');
  const [description, setDescription] = useState('');
  const [sectorPreset, setSectorPreset] = useState<'alpha' | 'bravo' | 'charlie' | 'delta'>('bravo');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    // Coordinate map based on sector
    let x = 45;
    let y = 35;
    if (sectorPreset === 'alpha') { x = 25; y = 25; }
    else if (sectorPreset === 'bravo') { x = 50; y = 30; }
    else if (sectorPreset === 'charlie') { x = 75; y = 35; }
    else if (sectorPreset === 'delta') { x = 30; y = 60; }

    const newIncident: DisasterIncident = {
      id: `INC-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      title: title.trim(),
      type,
      severity,
      status: 'active',
      region: region.trim(),
      coordinates: {
        lat: 38.5 + (Math.random() - 0.5),
        lng: -121.0 + (Math.random() - 0.5),
        x,
        y,
      },
      affectedPopulation: Number(affectedPopulation) || 5000,
      displacedPersons: Math.round(Number(affectedPopulation) * 0.25),
      casualties: {
        injured: 4,
        missing: 0,
        confirmedSafe: Math.round(Number(affectedPopulation) * 0.24),
      },
      evacuationStatus,
      telemetry: {
        radiusKm: Number(radiusKm) || 10,
        windSpeedKmH: Number(windSpeedKmH) || 20,
        airQualityAqi: type === 'wildfire' ? 240 : 45,
      },
      dispatchedUnits: {
        sarTeams: 6,
        fireEngines: 12,
        medicalUnits: 5,
        helicopters: 2,
        amphibiousVehicles: type === 'flood' ? 8 : 0,
      },
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
      lastUpdate: 'Just now',
      description: description.trim(),
      incidentCommander: incidentCommander.trim(),
      actionLog: [
        {
          id: Date.now().toString(),
          time: 'Just now',
          message: 'Crisis event established in command system. Initial dispatch authorized.',
          author: incidentCommander.trim(),
        },
      ],
    };

    soundManager.playDispatchChime();
    onSubmit(newIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 text-xs text-slate-200 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <h3 className="text-base font-bold text-white">Log Crisis Disaster Incident</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Incident Designation / Title:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Granite Ridge Mountain Wildfire"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Disaster Classification:
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DisasterType)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="wildfire">Wildfire / Canyon Fire</option>
                <option value="flood">Flash Flood / Inundation</option>
                <option value="earthquake">Earthquake Seism</option>
                <option value="chemical_leak">Industrial Chemical / Hazmat</option>
                <option value="hurricane">Severe Hurricane / Cyclone</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Threat Severity:
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Catastrophic">Catastrophic</option>
                <option value="Severe">Severe</option>
                <option value="Moderate">Moderate</option>
                <option value="Advisory">Advisory</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Target Sector / Location:
              </label>
              <input
                type="text"
                required
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. North Ridge Corridor"
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Civil Evacuation Level:
              </label>
              <select
                value={evacuationStatus}
                onChange={(e) => setEvacuationStatus(e.target.value as EvacuationOrder)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Mandatory Evacuation">Mandatory Evacuation</option>
                <option value="Voluntary Evacuation">Voluntary Evacuation</option>
                <option value="Shelter-in-Place">Shelter-in-Place</option>
                <option value="Normal / Standby">Normal / Standby</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Population at Risk:
              </label>
              <input
                type="number"
                min="100"
                value={affectedPopulation}
                onChange={(e) => setAffectedPopulation(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Hazard Radius (km):
              </label>
              <input
                type="number"
                min="1"
                value={radiusKm}
                onChange={(e) => setRadiusKm(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Wind Speed (km/h):
              </label>
              <input
                type="number"
                min="0"
                value={windSpeedKmH}
                onChange={(e) => setWindSpeedKmH(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Incident Commander Lead:
            </label>
            <input
              type="text"
              required
              value={incidentCommander}
              onChange={(e) => setIncidentCommander(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Field Situation Briefing:
            </label>
            <textarea
              rows={3}
              required
              placeholder="Detail fire behavior, levee breaches, structural collapse, or hazmat plume status..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Log Incident to Command</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
