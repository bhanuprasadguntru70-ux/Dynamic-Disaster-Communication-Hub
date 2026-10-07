import React from 'react';
import { 
  Radio, 
  MapPin, 
  ShieldAlert, 
  LifeBuoy, 
  Home, 
  Bell, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  PhoneCall,
  Plus
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export type NavView = 'map' | 'incidents' | 'sos' | 'shelters' | 'alerts' | 'preparedness';

interface NavbarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  activeIncidentsCount: number;
  pendingSOSCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSOSModal: () => void;
  onOpenHotlinesModal: () => void;
  onOpenNewIncidentModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  activeIncidentsCount,
  pendingSOSCount,
  isMuted,
  onToggleMute,
  onOpenSOSModal,
  onOpenHotlinesModal,
  onOpenNewIncidentModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element Brand Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-500 shadow-sm shadow-rose-950">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <button 
            onClick={() => onSelectView('map')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-rose-400 transition-colors">
              Aegis Disaster Operations
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single line, clean text with indicators) */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => onSelectView('map')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentView === 'map'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Situation Map</span>
          </button>

          <button
            onClick={() => onSelectView('incidents')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentView === 'incidents'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Incidents</span>
            {activeIncidentsCount > 0 && (
              <span className="ml-1 text-xs px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono tabular-nums">
                {activeIncidentsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectView('sos')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentView === 'sos'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <LifeBuoy className="w-4 h-4 text-amber-400" />
            <span>Distress SOS</span>
            {pendingSOSCount > 0 && (
              <span className="ml-1 text-xs px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono tabular-nums">
                {pendingSOSCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectView('shelters')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentView === 'shelters'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Home className="w-4 h-4 text-sky-400" />
            <span>Shelters & Logistics</span>
          </button>

          <button
            onClick={() => onSelectView('alerts')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentView === 'alerts'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Bell className="w-4 h-4 text-violet-400" />
            <span>Public EAS</span>
          </button>

          <button
            onClick={() => onSelectView('preparedness')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentView === 'preparedness'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>Survival Guide</span>
          </button>
        </nav>

        {/* Zone 3: Primary Operational Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mute Audio Siren Switch */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Emergency Siren Audio' : 'Mute Emergency Audio'}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle siren sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Quick-dial hotlines */}
          <button
            onClick={onOpenHotlinesModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
            <span>Hotlines</span>
          </button>

          {/* Log Incident */}
          <button
            onClick={onOpenNewIncidentModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-slate-300" />
            <span>Log Incident</span>
          </button>

          {/* Broadcast Citizen SOS */}
          <button
            onClick={() => {
              soundManager.playDispatchChime();
              onOpenSOSModal();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-sm shadow-rose-950 cursor-pointer whitespace-nowrap"
          >
            <LifeBuoy className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Broadcast SOS</span>
          </button>
        </div>

      </div>

      {/* Mobile Navigation Sub-bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 gap-1.5 scrollbar-none text-xs">
        <button
          onClick={() => onSelectView('map')}
          className={`px-2.5 py-1 rounded transition-colors shrink-0 ${
            currentView === 'map' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Situation Map
        </button>
        <button
          onClick={() => onSelectView('incidents')}
          className={`px-2.5 py-1 rounded transition-colors shrink-0 flex items-center gap-1 ${
            currentView === 'incidents' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Incidents ({activeIncidentsCount})
        </button>
        <button
          onClick={() => onSelectView('sos')}
          className={`px-2.5 py-1 rounded transition-colors shrink-0 flex items-center gap-1 ${
            currentView === 'sos' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          SOS Queue ({pendingSOSCount})
        </button>
        <button
          onClick={() => onSelectView('shelters')}
          className={`px-2.5 py-1 rounded transition-colors shrink-0 ${
            currentView === 'shelters' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Shelters & Cargo
        </button>
        <button
          onClick={() => onSelectView('alerts')}
          className={`px-2.5 py-1 rounded transition-colors shrink-0 ${
            currentView === 'alerts' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Public EAS
        </button>
        <button
          onClick={() => onSelectView('preparedness')}
          className={`px-2.5 py-1 rounded transition-colors shrink-0 ${
            currentView === 'preparedness' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Survival
        </button>
        <button
          onClick={onOpenHotlinesModal}
          className="px-2.5 py-1 rounded text-sky-400 bg-sky-950/40 border border-sky-900 shrink-0"
        >
          Hotlines
        </button>
      </div>
    </header>
  );
};
