import React from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  LifeBuoy, 
  FileText, 
  Flame, 
  AlertTriangle, 
  Info,
  Clock
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { AppNotification } from '../models/entities';
import { notificationService } from '../services/dataService';

interface NotificationsPageProps {
  lang: Language;
  notifications: AppNotification[];
  onNotificationsChanged: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  lang,
  notifications,
  onNotificationsChanged,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const handleMarkAllRead = () => {
    notificationService.markAllRead();
    onNotificationsChanged();
  };

  const handleClearAll = () => {
    notificationService.clearAll();
    onNotificationsChanged();
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'sos': return <LifeBuoy className="w-5 h-5 text-rose-500" />;
      case 'emergency': return <FileText className="w-5 h-5 text-amber-500" />;
      case 'rescue': return <Flame className="w-5 h-5 text-sky-500" />;
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest block mb-1">
            Dispatch Queue Log
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-500" />
            <span>{t('notifications')} Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail of SOS requests, status updates, team assignments, and public alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            disabled={notifications.length === 0}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All Read</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Log</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
            No notification logs recorded in this session.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 text-xs ${
                notif.isRead
                  ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                  : 'bg-slate-900 border-slate-700 text-slate-200 ring-1 ring-rose-500/20 shadow-md'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm leading-snug">{notif.title}</h4>
                  <span className="font-mono text-[10.5px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{notif.timestamp}</span>
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11.5px]">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
