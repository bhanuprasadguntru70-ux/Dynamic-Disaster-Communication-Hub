import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldAlert, 
  Building2, 
  Home, 
  Flame, 
  LifeBuoy, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Navigation,
  Compass
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { EmergencyRecord } from '../models/emergency';
import { Hospital, Shelter } from '../models/entities';

interface LiveMapPageProps {
  onNavigate: (section: string) => void;
  lang: Language;
  emergencies: EmergencyRecord[];
  hospitals: Hospital[];
  shelters: Shelter[];
}

export const LiveMapPage: React.FC<LiveMapPageProps> = ({
  onNavigate,
  lang,
  emergencies,
  hospitals,
  shelters,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const [showCritical, setShowCritical] = useState(true);
  const [showWarning, setShowWarning] = useState(true);
  const [showResolved, setShowResolved] = useState(false);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showRescue, setShowRescue] = useState(true);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'emergency' | 'hospital' | 'shelter' | 'rescue';
    data: any;
  } | null>({
    type: 'emergency',
    data: emergencies[0] || null,
  });

  return (
    <div className="space-y-4 pb-12">
      
      {/* Top Banner with External Map API notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>Interactive Tactical Geo-Tracker &amp; Sector Map</span>
          </h2>
          <p className="text-slate-400 mt-0.5">
            Vector coordinate simulation displaying emergency hotspots, field squads, trauma centers, and shelters.
          </p>
        </div>

        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive GIS Grid (Ready for Google Maps / Mapbox SDK)</span>
        </div>
      </div>

      {/* Main Map Box Layout */}
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-14rem)] min-h-[580px]">
        
        {/* Map Canvas */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative shadow-lg flex flex-col">
          
          {/* Top Layer & Filter Bar */}
          <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-1 p-1 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl text-xs shadow-md">
              <span className="text-slate-400 font-bold px-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Layers</span>
              </span>

              <button
                onClick={() => setShowCritical(!showCritical)}
                className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  showCritical ? 'bg-rose-950 text-rose-300 border border-rose-800 font-bold' : 'text-slate-500 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Critical ({emergencies.filter(e => e.severity === 'CRITICAL' && e.status !== 'RESOLVED').length})</span>
              </button>

              <button
                onClick={() => setShowWarning(!showWarning)}
                className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  showWarning ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold' : 'text-slate-500 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Warning</span>
              </button>

              <button
                onClick={() => setShowHospitals(!showHospitals)}
                className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  showHospitals ? 'bg-sky-950 text-sky-300 border border-sky-800 font-bold' : 'text-slate-500 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Hospitals</span>
              </button>

              <button
                onClick={() => setShowShelters(!showShelters)}
                className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  showShelters ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold' : 'text-slate-500 hover:text-white'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>Shelters</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="pointer-events-auto flex items-center gap-1 p-1 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl text-xs shadow-md">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2))}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span className="px-2 text-slate-400 font-mono text-[11px] border-l border-slate-800">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>
          </div>

          {/* SVG Tactical Map Canvas */}
          <div className="w-full h-full bg-[#070b14] relative overflow-hidden select-none cursor-crosshair">
            <svg
              viewBox="0 0 1000 650"
              className="w-full h-full transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            >
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.2)" strokeWidth="0.8" />
                </pattern>
                <pattern id="dots-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="0.8" fill="rgba(71, 85, 105, 0.3)" />
                </pattern>
              </defs>

              <rect width="1000" height="650" fill="#070b14" />
              <rect width="1000" height="650" fill="url(#dots-pattern)" />
              <rect width="1000" height="650" fill="url(#grid-pattern)" />

              {/* Simulated River Network (Krishna / Godavari Basin) */}
              <g stroke="#0284c7" strokeWidth="4" fill="none" opacity="0.35">
                <path d="M 0,260 Q 200,290 380,240 T 700,320 T 1000,280" />
                <path d="M 380,240 Q 520,380 620,520 T 780,650" strokeWidth="2.5" />
              </g>

              {/* Evacuation Arteries */}
              <g stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 4" fill="none" opacity="0.4">
                <path d="M 120,650 L 320,400 L 580,280 L 920,180" />
                <path d="M 400,0 L 520,240 L 750,450 L 980,540" />
              </g>

              {/* Sector Labels */}
              <text x="30" y="40" fill="#334155" fontSize="12" fontFamily="monospace" fontWeight="bold">DISTRICT NORTH · ZONE 1</text>
              <text x="750" y="40" fill="#334155" fontSize="12" fontFamily="monospace" fontWeight="bold">COASTAL HIGHWAY · ZONE 2</text>
              <text x="30" y="620" fill="#334155" fontSize="12" fontFamily="monospace" fontWeight="bold">DELTA BASIN · ZONE 3</text>
              <text x="750" y="620" fill="#334155" fontSize="12" fontFamily="monospace" fontWeight="bold">CENTRAL SECTOR · ZONE 4</text>

              {/* Emergency Markers */}
              {emergencies.map((emg, idx) => {
                if (emg.status === 'RESOLVED' && !showResolved) return null;
                if (emg.severity === 'CRITICAL' && !showCritical) return null;
                if ((emg.severity === 'HIGH' || emg.severity === 'MEDIUM') && !showWarning) return null;

                // Hash coordinates into 1000x650 bounds
                const cx = 150 + ((idx * 163) % 700);
                const cy = 120 + ((idx * 137) % 430);
                const isSelected = selectedEntity?.data?.id === emg.id;

                return (
                  <g 
                    key={emg.id} 
                    className="cursor-pointer"
                    onClick={() => setSelectedEntity({ type: 'emergency', data: emg })}
                  >
                    {/* Pulsing ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={emg.severity === 'CRITICAL' ? '24' : '18'}
                      fill="none"
                      stroke={emg.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b'}
                      strokeWidth="1.5"
                      className="animate-ping"
                      style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: '2.5s' }}
                    />

                    {/* Marker base */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? '12' : '9'}
                      fill={emg.severity === 'CRITICAL' ? '#e11d48' : '#d97706'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Marker tag */}
                    <g transform={`translate(${cx + 14}, ${cy - 8})`}>
                      <rect
                        x="0"
                        y="-10"
                        width="110"
                        height="18"
                        rx="3"
                        fill="#0f172a"
                        stroke={emg.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b'}
                        strokeWidth="1"
                        opacity="0.95"
                      />
                      <text x="6" y="2" fill="#ffffff" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                        {emg.id} · {emg.type}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Hospital Markers */}
              {showHospitals && hospitals.map((hosp, idx) => {
                const cx = 220 + ((idx * 180) % 650);
                const cy = 180 + ((idx * 110) % 400);
                const isSelected = selectedEntity?.data?.id === hosp.id;

                return (
                  <g 
                    key={hosp.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedEntity({ type: 'hospital', data: hosp })}
                  >
                    <rect
                      x={cx - 10}
                      y={cy - 10}
                      width="20"
                      height="20"
                      rx="4"
                      fill="#0284c7"
                      stroke="#ffffff"
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                    />
                    <text x={cx} y={cy + 4} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                      +
                    </text>
                    <g transform={`translate(${cx + 14}, ${cy - 8})`}>
                      <rect x="0" y="-10" width="130" height="18" rx="3" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="0.8" />
                      <text x="6" y="2" fill="#e0f2fe" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                        {hosp.name.slice(0, 16)}...
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Shelter Markers */}
              {showShelters && shelters.map((shl, idx) => {
                const cx = 180 + ((idx * 210) % 700);
                const cy = 250 + ((idx * 140) % 360);
                const isSelected = selectedEntity?.data?.id === shl.id;

                return (
                  <g 
                    key={shl.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedEntity({ type: 'shelter', data: shl })}
                  >
                    <polygon
                      points={`${cx},${cy - 10} ${cx + 10},${cy + 8} ${cx - 10},${cy + 8}`}
                      fill="#059669"
                      stroke="#ffffff"
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                    />
                    <g transform={`translate(${cx + 14}, ${cy - 8})`}>
                      <rect x="0" y="-10" width="125" height="18" rx="3" fill="#064e3b" stroke="#34d399" strokeWidth="0.8" />
                      <text x="6" y="2" fill="#d1fae5" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                        {shl.name.slice(0, 15)}...
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Scale & GPS Status */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg text-[10.5px] font-mono text-slate-400">
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                TELEMETRY LIVE
              </span>
              <span>·</span>
              <span>GRID: 16°30&apos;N, 80°38&apos;E</span>
              <span>·</span>
              <span>DATUM: WGS84</span>
            </div>
          </div>
        </div>

        {/* Right Side Inspector Pane */}
        <div className="w-full lg:w-96 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-md overflow-y-auto">
          {selectedEntity?.type === 'emergency' && selectedEntity.data && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
                  <span className="text-rose-400 font-bold">{selectedEntity.data.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    {selectedEntity.data.severity}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {selectedEntity.data.type} Emergency
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedEntity.data.location.address || `${selectedEntity.data.location.latitude}, ${selectedEntity.data.location.longitude}`}
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Incident Log Notes
                </span>
                <p className="text-slate-200 leading-relaxed text-[11.5px]">
                  {selectedEntity.data.description}
                </p>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-rose-400 font-bold">{selectedEntity.data.status}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">People At Risk:</span>
                  <span className="text-white font-bold">{selectedEntity.data.peopleAffected || 1}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('rescue')}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Open Rescue Command Console
              </button>
            </div>
          )}

          {selectedEntity?.type === 'hospital' && selectedEntity.data && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-sky-400 font-bold uppercase block mb-1">
                  MEDICAL HUB
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {selectedEntity.data.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{selectedEntity.data.location}</p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Available Beds:</span>
                  <span className="text-emerald-400 font-bold">{selectedEntity.data.availableGeneral}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ICU Units Open:</span>
                  <span className="text-sky-400 font-bold">{selectedEntity.data.availableICU}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ambulances Ready:</span>
                  <span className="text-white font-bold">{selectedEntity.data.ambulanceAvailable}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('hospitals')}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                View Hospital Directory
              </button>
            </div>
          )}

          {selectedEntity?.type === 'shelter' && selectedEntity.data && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase block mb-1">
                  EVACUATION SHELTER
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {selectedEntity.data.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{selectedEntity.data.location}</p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Capacity:</span>
                  <span className="text-white font-bold">{selectedEntity.data.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Available Cots:</span>
                  <span className="text-emerald-400 font-bold">{selectedEntity.data.availableSpaces}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Food/Water Buffer:</span>
                  <span className="text-sky-400 font-bold">{selectedEntity.data.foodSupplyDays} Days</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('shelters')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                View Shelter Evacuation Details
              </button>
            </div>
          )}

          {!selectedEntity && (
            <div className="text-center py-12 text-slate-500 text-xs">
              Click any map marker to inspect real-time situational telemetry.
            </div>
          )}

          {/* Bottom quick switchers */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-2">
              Quick Focus Jump
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {emergencies.slice(0, 3).map(e => (
                <button
                  key={e.id}
                  onClick={() => setSelectedEntity({ type: 'emergency', data: e })}
                  className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:text-white shrink-0 font-mono"
                >
                  {e.id}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
