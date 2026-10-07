import React from 'react';
import { 
  Settings, 
  Globe, 
  Volume2, 
  VolumeX, 
  MapPin, 
  RotateCcw, 
  ShieldCheck, 
  Radio, 
  Info 
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { resetAllServices } from '../services/dataService';

interface SettingsPageProps {
  lang: Language;
  onSetLang: (lang: Language) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetAllData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  lang,
  onSetLang,
  isMuted,
  onToggleMute,
  onResetAllData,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const handleReset = () => {
    if (confirm('Reset entire Dynamic Disaster Communication Hub data to factory demo baseline?')) {
      resetAllServices();
      onResetAllData();
      alert('Demo data successfully restored to initial baseline.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
            System Preferences
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" />
            <span>{t('settings')} &amp; Platform Controls</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Language selection, acoustic distress sirens, GPS telemetry parameters, and demo state reset.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400">
          PREFERENCES
        </div>
      </div>

      <div className="space-y-4">
        
        {/* Language Selection Setting */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Language Preference / భాష ఎంపిక</span>
            </h4>
            <p className="text-slate-400">
              Switch between English and Telugu (తెలుగు) across all dashboards and disaster advisories.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono font-bold">
            <button
              onClick={() => onSetLang('en')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                lang === 'en' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              English (EN)
            </button>
            <button
              onClick={() => onSetLang('te')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                lang === 'te' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              తెలుగు (TE)
            </button>
          </div>
        </div>

        {/* Audio Siren Setting */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>Emergency Audio &amp; Synthesized Siren Sound</span>
            </h4>
            <p className="text-slate-400">
              Web Audio API synthesized 853/960 Hz dual-tone broadcast siren and Morse code SOS beepers.
            </p>
          </div>

          <button
            onClick={onToggleMute}
            className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
              isMuted
                ? 'bg-slate-800 text-slate-400 hover:text-white'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {isMuted ? 'Muted (Audio Off)' : 'Active (Audio On)'}
          </button>
        </div>

        {/* Demo Data Reset */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-500" />
              <span>Reset Demo Simulation State</span>
            </h4>
            <p className="text-slate-400">
              Clear all temporary local storage records and revert to standard hackathon seed incidents.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            Reset to Factory Seed
          </button>
        </div>

        {/* System Architecture Dossier */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
          <h4 className="font-bold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400" />
            <span>Architecture &amp; Connectivity Standard</span>
          </h4>
          <p className="text-slate-400 leading-relaxed text-[11.5px]">
            Dynamic Disaster Communication Hub is architected with clear decoupling across 
            <code className="text-rose-400 mx-1">models/</code>, 
            <code className="text-sky-400 mx-1">services/</code>, 
            <code className="text-emerald-400 mx-1">data/</code>, and 
            <code className="text-purple-400 mx-1">pages/</code>. 
            The service layer allows instantaneous transition from <strong className="text-slate-200">localStorage</strong> to live <strong className="text-slate-200">Firebase Firestore / Cloud SQL</strong> without restructuring UI components.
          </p>
        </div>

      </div>

    </div>
  );
};
