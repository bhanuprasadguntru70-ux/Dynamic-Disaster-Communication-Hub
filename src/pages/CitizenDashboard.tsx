import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  MapPin, 
  ShieldAlert, 
  AlertTriangle, 
  Building2, 
  Tent, 
  Users, 
  Navigation, 
  RefreshCw,
  Flame,
  ArrowRight,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { EmergencyRecord } from '../models/emergency';
import { Hospital, Shelter, DisasterAlert } from '../models/entities';
import { emergencyService } from '../services/emergencyService';
import { locationService, GeolocationResult } from '../services/locationService';
import { EmergencyCard } from '../components/EmergencyCard';
import { SOSButton } from '../components/SOSButton';

interface CitizenDashboardProps {
  onNavigate: (section: string) => void;
  onViewEmergencyStatus: (id: string) => void;
  lang: Language;
  emergencies: EmergencyRecord[];
  hospitals: Hospital[];
  shelters: Shelter[];
  alerts: DisasterAlert[];
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onNavigate,
  onViewEmergencyStatus,
  lang,
  emergencies,
  hospitals,
  shelters,
  alerts,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const [location, setLocation] = useState<GeolocationResult | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [myEmergencies, setMyEmergencies] = useState<EmergencyRecord[]>([]);

  useEffect(() => {
    refreshLocation();
    setMyEmergencies(emergencyService.getMyEmergencies());
  }, [emergencies]);

  const refreshLocation = async () => {
    setIsLocating(true);
    const loc = await locationService.getCurrentPosition();
    setLocation(loc);
    setIsLocating(false);
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');
  const activeEmergencies = emergencies.filter(e => e.status !== 'RESOLVED');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome Banner & System Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-white tracking-tight">
              Welcome, Citizen
            </span>
            <span className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Emergency Services Online</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dynamic Disaster Citizen Command
          </h2>
          <p className="text-xs text-slate-400">
            Rapid emergency SOS dispatch, local hazard alerts, trauma hospital beds, and shelter occupancy.
          </p>
        </div>

        {/* Current Location Display Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5 shrink-0 min-w-[280px]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{t('currentLocation')}</span>
            </span>
            <button
              onClick={refreshLocation}
              disabled={isLocating}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Refresh GPS Location"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-rose-400' : 'text-slate-500'}`} />
            </button>
          </div>

          {location?.error ? (
            <div className="text-rose-400 text-[11px] font-medium leading-tight">
              {location.error}
              <button
                onClick={() => onNavigate('sos')}
                className="underline block text-[10px] text-slate-400 mt-1 hover:text-slate-200 cursor-pointer"
              >
                {t('enterLocationManually')}
              </button>
            </div>
          ) : location ? (
            <div className="font-mono text-slate-200 text-[11.5px] space-y-0.5 tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-500">Coordinates:</span>
                <span className="text-emerald-400 font-bold">{location.latitude}°N, {location.longitude}°E</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Accuracy: ±{location.accuracy}m</span>
                <span>Updated: {location.timestamp}</span>
              </div>
            </div>
          ) : (
            <span className="text-slate-500 text-[11px]">Acquiring browser GPS...</span>
          )}
        </div>
      </div>

      {/* Large Primary SEND SOS Trigger Box */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900/60 to-slate-900 border-2 border-rose-600 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl shadow-rose-950/50">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono font-bold text-[10px] tracking-wider uppercase">
            🚨 RAPID ASSISTANCE
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Are You In An Emergency?
          </h3>
          <p className="text-xs sm:text-sm text-rose-200 max-w-xl leading-relaxed">
            Broadcast immediate GPS coordinates, entrapment status, and required rescue equipment to active emergency response teams.
          </p>
        </div>

        <SOSButton
          onClick={() => onNavigate('sos')}
          size="large"
          label={t('sendSosBtn')}
        />
      </div>

      {/* 5 Feature Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Disaster Alerts */}
        <div
          onClick={() => onNavigate('alerts')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xl">🌪️</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
          </div>
          <div>
            <h4 className="font-bold text-white text-xs sm:text-sm">Disaster Alerts</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{alerts.length} Active Warnings</p>
          </div>
        </div>

        {/* Emergency Map */}
        <div
          onClick={() => onNavigate('map')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-2xl transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xl">🗺️</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div>
            <h4 className="font-bold text-white text-xs sm:text-sm">Emergency Map</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Live Sector Grid</p>
          </div>
        </div>

        {/* Nearby Hospitals */}
        <div
          onClick={() => onNavigate('hospitals')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-sky-500/60 rounded-2xl transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-sky-400 mb-2">
            <span className="text-xl">🏥</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 transition-colors" />
          </div>
          <div>
            <h4 className="font-bold text-white text-xs sm:text-sm">Nearby Hospitals</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{hospitals.length} Trauma Centers</p>
          </div>
        </div>

        {/* Safe Shelters */}
        <div
          onClick={() => onNavigate('shelters')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-2xl transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xl">🏠</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div>
            <h4 className="font-bold text-white text-xs sm:text-sm">Safe Shelters</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{shelters.length} Evac Hubs</p>
          </div>
        </div>

        {/* Rescue Requests */}
        <div
          onClick={() => onNavigate('rescue')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-rose-500/60 rounded-2xl transition-all cursor-pointer group shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-rose-500 mb-2">
            <span className="text-xl">🚒</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-rose-500 transition-colors" />
          </div>
          <div>
            <h4 className="font-bold text-white text-xs sm:text-sm">Rescue Requests</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{activeEmergencies.length} Operational</p>
          </div>
        </div>

      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10.5px] font-mono font-bold uppercase text-rose-400 block">Active Emergencies</span>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-white">{activeEmergencies.length}</div>
          <span className="text-[10px] text-slate-500">Dispatch in progress</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10.5px] font-mono font-bold uppercase text-amber-400 block">Critical Alerts</span>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-amber-400">{criticalAlerts.length}</div>
          <span className="text-[10px] text-slate-500">High severity bulletins</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10.5px] font-mono font-bold uppercase text-emerald-400 block">Nearby Shelters</span>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-emerald-400">{shelters.filter(s => s.status !== 'FULL').length}</div>
          <span className="text-[10px] text-slate-500">Facilities ready for intake</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10.5px] font-mono font-bold uppercase text-sky-400 block">Nearby Hospitals</span>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-sky-400">{hospitals.filter(h => h.status === 'OPEN').length}</div>
          <span className="text-[10px] text-slate-500">Trauma wards operational</span>
        </div>
      </div>

      {/* Section 8: MY EMERGENCY REQUESTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>My Emergency Requests</span>
          </h3>
          <span className="text-xs text-slate-400">
            Recorded in current browser session
          </span>
        </div>

        {myEmergencies.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs space-y-2">
            <p>You have not logged any emergency requests in this browser session.</p>
            <button
              onClick={() => onNavigate('sos')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Broadcast Test SOS</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myEmergencies.map((emg) => (
              <EmergencyCard
                key={emg.id}
                emergency={emg}
                onViewDetails={(id) => onViewEmergencyStatus(id)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
