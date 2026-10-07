import React from 'react';
import { 
  Radio, 
  Search, 
  Bell, 
  Menu, 
  X, 
  LifeBuoy, 
  Volume2, 
  VolumeX, 
  Globe,
  ShieldCheck
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  lang: Language;
  onToggleLang: () => void;
  unreadCount: number;
  activeEmergenciesCount: number;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleNotificationPanel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onNavigate,
  lang,
  onToggleLang,
  unreadCount,
  activeEmergenciesCount,
  isSidebarOpen,
  onToggleSidebar,
  onOpenSearch,
  isMuted,
  onToggleMute,
  onToggleNotificationPanel,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-500 shadow-sm shadow-rose-950">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-white tracking-tight leading-none group-hover:text-rose-400 transition-colors">
                {t('appTitle')}
              </h1>
              <span className="text-[10px] text-emerald-400 font-mono tracking-widest font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CENTRAL COMMAND ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Launcher */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-400 text-xs transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{t('searchPlaceholder')}</span>
            </span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono">
              /
            </kbd>
          </button>
        </div>

        {/* Right: Controls & SOS Action */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Switch: EN | తెలుగు */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Switch Language: English / Telugu"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono">{lang === 'en' ? 'తెలుగు' : 'EN'}</span>
          </button>

          {/* Siren Audio Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Emergency Siren' : 'Mute Emergency Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Notifications Launcher */}
          <button
            onClick={() => onToggleNotificationPanel ? onToggleNotificationPanel() : onNavigate('notifications')}
            className="relative p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Notifications Center"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Primary SOS Button */}
          <button
            onClick={() => {
              soundManager.playDispatchChime();
              onNavigate('sos');
            }}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-rose-950 cursor-pointer animate-pulse hover:animate-none whitespace-nowrap"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>{t('sos')}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
