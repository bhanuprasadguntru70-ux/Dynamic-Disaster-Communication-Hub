import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  LifeBuoy, 
  FileText, 
  MapPin, 
  AlertTriangle, 
  Building2, 
  Tent, 
  Flame, 
  Users, 
  Package, 
  Bell, 
  User, 
  Settings, 
  BarChart3,
  X,
  ShieldCheck
} from 'lucide-react';
import { Language, translations } from '../data/i18n';

interface SidebarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  activeEmergenciesCount: number;
  criticalAlertsCount: number;
  unreadNotifsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  isOpen,
  onClose,
  lang,
  activeEmergenciesCount,
  criticalAlertsCount,
  unreadNotifsCount,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const NAV_ITEMS = [
    { id: 'home', label: t('home'), icon: Home, badge: null },
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, badge: null },
    { id: 'sos', label: t('sos'), icon: LifeBuoy, badge: 'SOS', badgeColor: 'bg-rose-950 text-rose-300 border-rose-800' },
    { id: 'report', label: t('reportEmergency'), icon: FileText, badge: null },
    { id: 'map', label: t('liveMap'), icon: MapPin, badge: 'LIVE' },
    { id: 'alerts', label: t('alerts'), icon: AlertTriangle, badge: criticalAlertsCount > 0 ? String(criticalAlertsCount) : null, badgeColor: 'bg-amber-950 text-amber-300 border-amber-800' },
    { id: 'hospitals', label: t('hospitals'), icon: Building2, badge: null },
    { id: 'shelters', label: t('shelters'), icon: Tent, badge: null },
    { id: 'rescue', label: t('rescue'), icon: Flame, badge: activeEmergenciesCount > 0 ? String(activeEmergenciesCount) : null, badgeColor: 'bg-rose-950 text-rose-300 border-rose-800' },
    { id: 'volunteers', label: t('volunteers'), icon: Users, badge: null },
    { id: 'resources', label: t('resources'), icon: Package, badge: null },
    { id: 'admin', label: t('admin'), icon: BarChart3, badge: null },
    { id: 'notifications', label: t('notifications'), icon: Bell, badge: unreadNotifsCount > 0 ? String(unreadNotifsCount) : null, badgeColor: 'bg-sky-950 text-sky-300 border-sky-800' },
    { id: 'profile', label: t('profile'), icon: User, badge: null },
    { id: 'settings', label: t('settings'), icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header inside sidebar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-bold text-white text-xs tracking-wider uppercase">
              Operational Hub
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-none text-xs">
          {NAV_ITEMS.map((item) => {
            const isActive = currentSection === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-rose-600/15 border border-rose-500/40 text-rose-300 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border tabular-nums ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom system status indicator */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Network Active</span>
            </span>
            <span className="font-mono text-slate-500">v2.4-hub</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Disaster Communication Network · Local Demo
          </p>
        </div>

      </aside>
    </>
  );
};
