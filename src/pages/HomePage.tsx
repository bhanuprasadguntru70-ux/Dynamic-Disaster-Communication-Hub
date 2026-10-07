import React from 'react';
import { 
  LifeBuoy, 
  FileText, 
  MapPin, 
  Flame, 
  Waves, 
  Wind, 
  Activity, 
  Mountain, 
  Ambulance, 
  Car, 
  ShieldCheck, 
  Radio, 
  ArrowRight,
  Clock,
  Building2,
  Users,
  CheckCircle2
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { EmergencyRecord } from '../models/emergency';
import { Hospital, Shelter } from '../models/entities';

interface HomePageProps {
  onNavigate: (section: string) => void;
  lang: Language;
  emergencies: EmergencyRecord[];
  hospitals: Hospital[];
  shelters: Shelter[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  lang,
  emergencies,
  hospitals,
  shelters,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const categories = [
    { name: t('flood'), icon: Waves, color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800' },
    { name: t('cyclone'), icon: Wind, color: 'text-violet-400 bg-violet-950/40 border-violet-800' },
    { name: t('fire'), icon: Flame, color: 'text-orange-400 bg-orange-950/40 border-orange-800' },
    { name: t('earthquake'), icon: Activity, color: 'text-pink-400 bg-pink-950/40 border-pink-800' },
    { name: t('landslide'), icon: Mountain, color: 'text-amber-400 bg-amber-950/40 border-amber-800' },
    { name: t('medical'), icon: Ambulance, color: 'text-rose-400 bg-rose-950/40 border-rose-800' },
    { name: t('accident'), icon: Car, color: 'text-blue-400 bg-blue-950/40 border-blue-800' },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Section */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-rose-950/40 border border-slate-800 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          
          {/* Status indicators cluster */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('systemOnline')}</span>
            </span>

            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('rescueNetworkActive')}</span>
            </span>

            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('communicationActive')}</span>
            </span>
          </div>

          {/* Headline & Subtitle */}
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {t('appTitle')}
            </h1>
            <p className="text-base sm:text-xl text-slate-300 font-medium mt-3 leading-relaxed">
              {t('appSubtitle')}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('sos')}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm tracking-wider flex items-center gap-2 shadow-lg shadow-rose-950 transition-all cursor-pointer animate-pulse hover:animate-none"
            >
              <LifeBuoy className="w-5 h-5" />
              <span>{t('sendSosBtn')}</span>
            </button>

            <button
              onClick={() => onNavigate('report')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-xl font-semibold text-sm tracking-wide flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-5 h-5 text-amber-400" />
              <span>{t('reportEmergencyBtn')}</span>
            </button>

            <button
              onClick={() => onNavigate('map')}
              className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl font-semibold text-sm tracking-wide flex items-center gap-2 transition-all cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>{t('viewLiveMapBtn')}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Emergency Categories Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500" />
            <span>{t('emergencyCategories')}</span>
          </h2>
          <span className="text-xs text-slate-400">Rapid Triage Categories</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigate('report')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all hover:scale-105 hover:shadow-md ${cat.color}`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-bold">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Operational Metrics Triad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Active Emergencies Card */}
        <div 
          onClick={() => onNavigate('rescue')}
          className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              {t('activeEmergencies')}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-white">
            {emergencies.filter(e => e.status !== 'RESOLVED').length}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time rescue incidents logged across districts. Click to view dispatch status.
          </p>
        </div>

        {/* Medical Hospital Readiness */}
        <div 
          onClick={() => onNavigate('hospitals')}
          className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              {t('nearbyHospitals')}
            </span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-white">
            {hospitals.reduce((acc, h) => acc + h.availableGeneral, 0)} <span className="text-sm font-normal text-slate-400">Beds</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Trauma wards, ICU availability, and ambulance readiness in network.
          </p>
        </div>

        {/* Shelters & Safe Zones */}
        <div 
          onClick={() => onNavigate('shelters')}
          className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {t('nearbyShelters')}
            </span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono tabular-nums text-white">
            {shelters.reduce((acc, s) => acc + s.availableSpaces, 0)} <span className="text-sm font-normal text-slate-400">Available</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Civilian evacuation stadiums, food rations, and clean water supplies ready.
          </p>
        </div>

      </div>

      {/* Recent Dispatches Stream Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Latest Emergency Reports &amp; Dispatch Status</span>
          </h3>
          <button 
            onClick={() => onNavigate('rescue')}
            className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
          >
            {t('viewAll')} →
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {emergencies.slice(0, 3).map((e) => (
            <div key={e.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 truncate">
                <span className={`w-2 h-2 rounded-full ${
                  e.severity === 'CRITICAL' ? 'bg-rose-500 animate-ping' :
                  e.severity === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500'
                }`} />
                <span className="font-mono font-bold text-white">{e.id}</span>
                <span className="text-slate-400">·</span>
                <span className="font-semibold text-slate-200">{e.type}</span>
                <span className="text-slate-500 truncate hidden sm:inline max-w-sm">{e.description}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                e.status === 'ACTIVE' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                e.status === 'ASSIGNED' ? 'bg-sky-950 text-sky-300 border border-sky-800' :
                e.status === 'RESCUE IN PROGRESS' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {e.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
