import React, { useState } from 'react';
import { 
  Flame, 
  Waves, 
  Activity, 
  Biohazard, 
  Home, 
  LifeBuoy, 
  ShieldAlert, 
  Wind, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Users, 
  Ambulance, 
  Truck, 
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { DisasterIncident, SOSBeacon, Shelter } from '../types/disaster';
import { soundManager } from '../utils/audio';

interface SituationMapProps {
  incidents: DisasterIncident[];
  beacons: SOSBeacon[];
  shelters: Shelter[];
  onSelectIncident: (incident: DisasterIncident) => void;
  onSelectBeacon: (beacon: SOSBeacon) => void;
  onSelectShelter: (shelter: Shelter) => void;
  onDispatchToIncident: (incidentId: string, unitType: 'sarTeams' | 'fireEngines' | 'medicalUnits' | 'helicopters') => void;
}

export const SituationMap: React.FC<SituationMapProps> = ({
  incidents,
  beacons,
  shelters,
  onSelectIncident,
  onSelectBeacon,
  onSelectShelter,
  onDispatchToIncident,
}) => {
  // Layer toggles
  const [showHazards, setShowHazards] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showSOS, setShowSOS] = useState(true);
  const [showEvacRoutes, setShowEvacRoutes] = useState(true);
  const [showWindVectors, setShowWindVectors] = useState(true);

  // Selected item on map
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(incidents[0]?.id || null);
  const [selectedBeaconId, setSelectedBeaconId] = useState<string | null>(null);
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const activeIncident = incidents.find(i => i.id === selectedIncidentId);
  const activeBeacon = beacons.find(b => b.id === selectedBeaconId);
  const activeShelter = shelters.find(s => s.id === selectedShelterId);

  const handleIncidentClick = (incident: DisasterIncident) => {
    setSelectedIncidentId(incident.id);
    setSelectedBeaconId(null);
    setSelectedShelterId(null);
    onSelectIncident(incident);
  };

  const handleBeaconClick = (beacon: SOSBeacon) => {
    setSelectedBeaconId(beacon.id);
    setSelectedIncidentId(null);
    setSelectedShelterId(null);
    onSelectBeacon(beacon);
  };

  const handleShelterClick = (shelter: Shelter) => {
    setSelectedShelterId(shelter.id);
    setSelectedIncidentId(null);
    setSelectedBeaconId(null);
    onSelectShelter(shelter);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6rem)] min-h-[640px]">
      
      {/* Map Main Canvas Area */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative shadow-lg">
        
        {/* Top Control Bar over Map */}
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          
          {/* Layer toggles */}
          <div className="pointer-events-auto flex items-center gap-1.5 p-1 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-lg text-xs shadow-md">
            <span className="text-slate-400 font-semibold px-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </span>
            <button
              onClick={() => setShowHazards(!showHazards)}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                showHazards ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-rose-400" />
              <span>Hazards</span>
            </button>
            <button
              onClick={() => setShowShelters(!showShelters)}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                showShelters ? 'bg-sky-950/80 text-sky-300 border border-sky-800/80 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3 h-3 text-sky-400" />
              <span>Shelters</span>
            </button>
            <button
              onClick={() => setShowSOS(!showSOS)}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                showSOS ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LifeBuoy className="w-3 h-3 text-amber-400" />
              <span>SOS ({beacons.filter(b => b.status === 'pending').length})</span>
            </button>
            <button
              onClick={() => setShowEvacRoutes(!showEvacRoutes)}
              className={`hidden sm:flex px-2 py-1 rounded transition-colors items-center gap-1 cursor-pointer ${
                showEvacRoutes ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Evac Routes</span>
            </button>
            <button
              onClick={() => setShowWindVectors(!showWindVectors)}
              className={`hidden md:flex px-2 py-1 rounded transition-colors items-center gap-1 cursor-pointer ${
                showWindVectors ? 'bg-violet-950/80 text-violet-300 border border-violet-800/80 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wind className="w-3 h-3 text-violet-400" />
              <span>Wind 68 km/h</span>
            </button>
          </div>

          {/* Zoom & View Controls */}
          <div className="pointer-events-auto flex items-center gap-1 p-1 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-lg text-xs shadow-md">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="px-2 text-slate-400 font-mono tabular-nums text-[11px] border-l border-slate-800">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>

        </div>

        {/* Tactical Map Viewport */}
        <div className="relative w-full h-full bg-[#0a0f1d] overflow-hidden select-none cursor-crosshair">
          
          <svg 
            viewBox="0 0 1000 700" 
            className="w-full h-full transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: 'center center'
            }}
          >
            <defs>
              {/* Tactical grid pattern */}
              <pattern id="tactical-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="1" fill="rgba(148, 163, 184, 0.25)" />
              </pattern>

              {/* Sub-grid pattern */}
              <pattern id="sub-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(30, 41, 59, 0.3)" strokeWidth="0.3" />
              </pattern>

              {/* Fire gradient */}
              <radialGradient id="fire-gradient">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#f97316" stopOpacity="0.45" />
                <stop offset="85%" stopColor="#eab308" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
              </radialGradient>

              {/* Flood gradient */}
              <radialGradient id="flood-gradient">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#0284c7" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
              </radialGradient>

              {/* Quake wave gradient */}
              <radialGradient id="quake-gradient">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7e22ce" stopOpacity="0" />
              </radialGradient>

              {/* Hazmat plume */}
              <radialGradient id="hazmat-gradient">
                <stop offset="0%" stopColor="#84cc16" stopOpacity="0.85" />
                <stop offset="55%" stopColor="#65a30d" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#4d7c0f" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background grids */}
            <rect width="1000" height="700" fill="#0b1120" />
            <rect width="1000" height="700" fill="url(#sub-grid)" />
            <rect width="1000" height="700" fill="url(#tactical-grid)" />

            {/* Simulated Coastline and Topography contour lines */}
            <g stroke="#1e293b" strokeWidth="1.5" fill="none" opacity="0.6">
              <path d="M 0,220 Q 180,240 320,180 T 600,260 T 1000,190" strokeDasharray="3 3" />
              <path d="M 0,390 Q 240,420 480,360 T 820,440 T 1000,380" strokeDasharray="4 4" />
              <path d="M 120,700 Q 220,540 280,420 T 360,180 T 400,0" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.45" />
              <path d="M 520,700 Q 600,560 680,480 T 840,320 T 960,0" stroke="#0ea5e9" strokeWidth="1.8" opacity="0.35" />
            </g>

            {/* Sector Boundary Lines */}
            <g stroke="rgba(71, 85, 105, 0.4)" strokeWidth="1" strokeDasharray="6 6">
              <line x1="333" y1="0" x2="333" y2="700" />
              <line x1="666" y1="0" x2="666" y2="700" />
              <line x1="0" y1="350" x2="1000" y2="350" />
            </g>

            {/* Sector Labels */}
            <text x="25" y="45" fill="#475569" fontSize="13" fontFamily="monospace" fontWeight="600">SECTOR ALPHA (ZONE 1)</text>
            <text x="355" y="45" fill="#475569" fontSize="13" fontFamily="monospace" fontWeight="600">SECTOR BRAVO (ZONE 2)</text>
            <text x="685" y="45" fill="#475569" fontSize="13" fontFamily="monospace" fontWeight="600">SECTOR CHARLIE (ZONE 3)</text>
            <text x="25" y="380" fill="#475569" fontSize="13" fontFamily="monospace" fontWeight="600">SECTOR DELTA (ZONE 4)</text>
            <text x="355" y="380" fill="#475569" fontSize="13" fontFamily="monospace" fontWeight="600">SECTOR ECHO (ZONE 5)</text>
            <text x="685" y="380" fill="#475569" fontSize="13" fontFamily="monospace" fontWeight="600">SECTOR FOXTROT (ZONE 6)</text>

            {/* Evacuation Corridors */}
            {showEvacRoutes && (
              <g className="evacuation-corridors">
                {/* Highway 50 Eastbound Corridor */}
                <path
                  d="M 280,220 L 480,240 L 720,290 L 980,260"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  opacity="0.8"
                />
                <text x="540" y="275" fill="#34d399" fontSize="11" fontFamily="sans-serif" fontWeight="600">
                  EVAC CORRIDOR HWY-50 EASTBOUND &gt;&gt;&gt;
                </text>

                {/* Highway 12 Delta Bypass */}
                <path
                  d="M 480,480 L 620,440 L 800,430 L 960,520"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                  opacity="0.75"
                />
                <text x="730" y="420" fill="#34d399" fontSize="11" fontFamily="sans-serif" fontWeight="600">
                  SOUTH EVAC ARTERY 12 &gt;&gt;&gt;
                </text>
              </g>
            )}

            {/* Wind Vector Arrows */}
            {showWindVectors && (
              <g stroke="#8b5cf6" strokeWidth="1.2" opacity="0.45" fill="none">
                {[
                  { x: 150, y: 150 }, { x: 300, y: 120 }, { x: 450, y: 160 },
                  { x: 250, y: 320 }, { x: 550, y: 280 }, { x: 750, y: 240 },
                  { x: 350, y: 520 }, { x: 650, y: 540 }, { x: 850, y: 480 }
                ].map((pt, i) => (
                  <g key={i} transform={`translate(${pt.x}, ${pt.y}) rotate(35)`}>
                    <line x1="-20" y1="0" x2="20" y2="0" />
                    <polyline points="12,-4 20,0 12,4" />
                  </g>
                ))}
              </g>
            )}

            {/* Hazard Impact Perimeter Polygons & Radars */}
            {showHazards && incidents.map((incident) => {
              const cx = (incident.coordinates.x / 100) * 1000;
              const cy = (incident.coordinates.y / 100) * 700;
              const radius = incident.telemetry.radiusKm * 3.5;
              const isSelected = selectedIncidentId === incident.id;

              let gradientId = 'fire-gradient';
              let strokeColor = '#ef4444';

              if (incident.type === 'flood') {
                gradientId = 'flood-gradient';
                strokeColor = '#06b6d4';
              } else if (incident.type === 'earthquake') {
                gradientId = 'quake-gradient';
                strokeColor = '#ec4899';
              } else if (incident.type === 'chemical_leak') {
                gradientId = 'hazmat-gradient';
                strokeColor = '#84cc16';
              }

              return (
                <g key={incident.id} className="cursor-pointer" onClick={() => handleIncidentClick(incident)}>
                  {/* Outer danger buffer ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={`url(#${gradientId})`}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? '2.5' : '1.2'}
                    strokeDasharray={isSelected ? 'none' : '4 3'}
                    opacity="0.8"
                  />

                  {/* Pulsing warning shockwave */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius * 0.65}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-ping"
                    style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: '3.5s' }}
                  />

                  {/* Incident Center Marker */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? '14' : '11'}
                    fill={strokeColor}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="shadow-md"
                  />

                  {/* Incident Icon Glyph */}
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                  >
                    !
                  </text>

                  {/* Callout Title Label */}
                  <g transform={`translate(${cx + 18}, ${cy - 12})`}>
                    <rect
                      x="0"
                      y="-14"
                      width={incident.title.length * 7 + 24}
                      height="22"
                      rx="4"
                      fill="#0f172a"
                      stroke={strokeColor}
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      x="8"
                      y="1"
                      fill="#f8fafc"
                      fontSize="10.5"
                      fontFamily="sans-serif"
                      fontWeight="600"
                    >
                      {incident.title}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Evacuation Shelters Markers */}
            {showShelters && shelters.map((shelter) => {
              const cx = (shelter.x / 100) * 1000;
              const cy = (shelter.y / 100) * 700;
              const isSelected = selectedShelterId === shelter.id;
              const occupancyPct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);

              let badgeColor = '#10b981'; // Green: under 75%
              if (occupancyPct >= 90) badgeColor = '#ef4444'; // Red: >= 90%
              else if (occupancyPct >= 75) badgeColor = '#f59e0b'; // Amber

              return (
                <g key={shelter.id} className="cursor-pointer" onClick={() => handleShelterClick(shelter)}>
                  {/* Pin Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? '12' : '9'}
                    fill="#0284c7"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#ffffff"
                  />
                  {/* Shelter Tag */}
                  <g transform={`translate(${cx + 14}, ${cy - 8})`}>
                    <rect
                      x="0"
                      y="-12"
                      width="120"
                      height="18"
                      rx="3"
                      fill="#0369a1"
                      stroke="#38bdf8"
                      strokeWidth="0.8"
                    />
                    <text
                      x="6"
                      y="1"
                      fill="#ffffff"
                      fontSize="9.5"
                      fontFamily="sans-serif"
                      fontWeight="500"
                    >
                      {shelter.name.slice(0, 14)}... ({occupancyPct}%)
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Citizen Distress Beacons (SOS) */}
            {showSOS && beacons.map((beacon) => {
              if (beacon.status === 'rescued') return null;
              const cx = (beacon.x / 100) * 1000;
              const cy = (beacon.y / 100) * 700;
              const isSelected = selectedBeaconId === beacon.id;
              const isCritical = beacon.priority === 'Critical';

              return (
                <g key={beacon.id} className="cursor-pointer" onClick={() => handleBeaconClick(beacon)}>
                  {/* SOS Ping Pulse */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="18"
                    fill="none"
                    stroke={isCritical ? '#f43f5e' : '#f59e0b'}
                    strokeWidth="1.5"
                    className="animate-ping"
                    style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: '2s' }}
                  />

                  {/* Diamond SOS glyph */}
                  <polygon
                    points={`${cx},${cy - 8} ${cx + 8},${cy} ${cx},${cy + 8} ${cx - 8},${cy}`}
                    fill={isCritical ? '#e11d48' : '#d97706'}
                    stroke="#ffffff"
                    strokeWidth="1.8"
                  />

                  <text
                    x={cx}
                    y={cy + 3}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    SOS
                  </text>

                  {/* Label */}
                  {isSelected && (
                    <g transform={`translate(${cx + 12}, ${cy + 12})`}>
                      <rect x="0" y="-12" width="105" height="18" rx="3" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="1" />
                      <text x="6" y="1" fill="#fda4af" fontSize="9.5" fontFamily="sans-serif" fontWeight="600">
                        {beacon.citizenName} ({beacon.peopleCount}p)
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

          </svg>

          {/* Bottom Coordinates & Scale Status Bar inside map */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-md text-[11px] font-mono text-slate-400">
            <span>GRID: 38°53&apos;N, 120°43&apos;W</span>
            <span className="text-slate-600">|</span>
            <span>DATUM: WGS84</span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE TELEMETRY FEED
            </span>
          </div>

        </div>

      </div>

      {/* Right / Side Tactical Inspector Pane */}
      <div className="w-full lg:w-96 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between overflow-y-auto shadow-md">
        
        {/* If Active Incident Selected */}
        {activeIncident && !activeBeacon && !activeShelter && (
          <div className="space-y-4">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-mono text-slate-400">{activeIncident.id}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                  activeIncident.severity === 'Catastrophic' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  activeIncident.severity === 'Severe' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-sky-950 text-sky-300 border border-sky-800'
                }`}>
                  {activeIncident.severity}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {activeIncident.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {activeIncident.region}
              </p>
            </div>

            {/* Evacuation Alert Banner */}
            <div className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
              activeIncident.evacuationStatus === 'Mandatory Evacuation'
                ? 'bg-rose-950/60 border-rose-800 text-rose-200'
                : 'bg-amber-950/60 border-amber-800 text-amber-200'
            }`}>
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <div>
                <span className="font-semibold block">{activeIncident.evacuationStatus}</span>
                <span className="text-[11px] opacity-80">Immediate compliance requested by Incident Command</span>
              </div>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Radius &amp; Area</span>
                <span className="text-sm font-bold text-white font-mono tabular-nums">
                  {activeIncident.telemetry.radiusKm} km
                </span>
              </div>

              {activeIncident.telemetry.windSpeedKmH && (
                <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Wind Gusts</span>
                  <span className="text-sm font-bold text-white font-mono tabular-nums">
                    {activeIncident.telemetry.windSpeedKmH} km/h
                  </span>
                </div>
              )}

              {activeIncident.telemetry.waterLevelM && (
                <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Flood Inundation</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono tabular-nums">
                    +{activeIncident.telemetry.waterLevelM} meters
                  </span>
                </div>
              )}

              {activeIncident.telemetry.magnitudeRichter && (
                <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Richter Scale</span>
                  <span className="text-sm font-bold text-pink-400 font-mono tabular-nums">
                    M {activeIncident.telemetry.magnitudeRichter}
                  </span>
                </div>
              )}

              {activeIncident.telemetry.airQualityAqi && (
                <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Air Quality (AQI)</span>
                  <span className="text-sm font-bold text-amber-400 font-mono tabular-nums">
                    {activeIncident.telemetry.airQualityAqi} AQI
                  </span>
                </div>
              )}

              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Displaced Persons</span>
                <span className="text-sm font-bold text-white font-mono tabular-nums">
                  {activeIncident.displacedPersons.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Incident Commander Note */}
            <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg text-xs space-y-1">
              <span className="text-slate-400 text-[11px] block">Incident Lead</span>
              <p className="font-semibold text-slate-200">{activeIncident.incidentCommander}</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">{activeIncident.description}</p>
            </div>

            {/* Quick Dispatch Controls */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Deploy Reinforcements to Sector
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    soundManager.playDispatchChime();
                    onDispatchToIncident(activeIncident.id, 'sarTeams');
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>+1 SAR Team</span>
                  </span>
                  <span className="font-mono tabular-nums text-slate-400">
                    {activeIncident.dispatchedUnits.sarTeams}
                  </span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playDispatchChime();
                    onDispatchToIncident(activeIncident.id, 'medicalUnits');
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Ambulance className="w-3.5 h-3.5 text-rose-400" />
                    <span>+1 Medical</span>
                  </span>
                  <span className="font-mono tabular-nums text-slate-400">
                    {activeIncident.dispatchedUnits.medicalUnits}
                  </span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playDispatchChime();
                    onDispatchToIncident(activeIncident.id, 'fireEngines');
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-orange-400" />
                    <span>+1 Engine</span>
                  </span>
                  <span className="font-mono tabular-nums text-slate-400">
                    {activeIncident.dispatchedUnits.fireEngines}
                  </span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playDispatchChime();
                    onDispatchToIncident(activeIncident.id, 'helicopters');
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-sky-400" />
                    <span>+1 Air Ops</span>
                  </span>
                  <span className="font-mono tabular-nums text-slate-400">
                    {activeIncident.dispatchedUnits.helicopters}
                  </span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* If Active SOS Beacon Selected */}
        {activeBeacon && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-rose-400 font-bold">{activeBeacon.id}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                  {activeBeacon.priority} DISTRESS
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {activeBeacon.citizenName}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {activeBeacon.locationText}
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Persons Trapped:</span>
                <span className="font-bold text-white font-mono tabular-nums">{activeBeacon.peopleCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Medical Urgency:</span>
                <span className={activeBeacon.hasMedicalNeed ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                  {activeBeacon.hasMedicalNeed ? 'Immediate Care Needed' : 'None Reported'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Direct Contact:</span>
                <span className="font-mono text-slate-200">{activeBeacon.contact}</span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-slate-300 leading-relaxed text-[11px]">
                {activeBeacon.notes}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  soundManager.playSOSMorseBeacon();
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
                <span>Play Acoustic Morse Beacon</span>
              </button>
            </div>
          </div>
        )}

        {/* If Active Shelter Selected */}
        {activeShelter && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-sky-400 font-bold">{activeShelter.id}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-950 text-sky-300 border border-sky-800">
                  SHELTER HUB
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {activeShelter.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {activeShelter.address}
              </p>
            </div>

            {/* Occupancy meter */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Capacity Utilization:</span>
                <span className="font-bold text-white font-mono tabular-nums">
                  {activeShelter.currentOccupancy} / {activeShelter.capacity} (
                  {Math.round((activeShelter.currentOccupancy / activeShelter.capacity) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    (activeShelter.currentOccupancy / activeShelter.capacity) >= 0.9 ? 'bg-rose-500' :
                    (activeShelter.currentOccupancy / activeShelter.capacity) >= 0.75 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (activeShelter.currentOccupancy / activeShelter.capacity) * 100)}%` }}
                />
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Medical Clinic</span>
                  <span className="text-white font-medium">{activeShelter.hasMedicalStaff ? 'Staffed 24/7' : 'None'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Power Supply</span>
                  <span className="text-white font-medium">{activeShelter.powerStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Supplies Buffer</span>
                  <span className="text-white font-medium">{activeShelter.suppliesDaysRemaining} Days on-site</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Companion Animals</span>
                  <span className="text-white font-medium">{activeShelter.isPetFriendly ? 'Pets Permitted' : 'No Pets'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer selector fallback if nothing active */}
        {!activeIncident && !activeBeacon && !activeShelter && (
          <div className="text-center py-12 text-slate-500 text-xs">
            Click on any hazard zone, shelter pin, or SOS beacon on the tactical map to inspect real-time situational details.
          </div>
        )}

        {/* Bottom Quick Switcher between Incidents */}
        <div className="pt-4 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
            Active Hazard Focus
          </span>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {incidents.map(inc => (
              <button
                key={inc.id}
                onClick={() => handleIncidentClick(inc)}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedIncidentId === inc.id
                    ? 'bg-rose-600 text-white font-medium shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {inc.type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
