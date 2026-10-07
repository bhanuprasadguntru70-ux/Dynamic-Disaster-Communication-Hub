import React from 'react';
import { AppNotification } from '../models/entities';
import { Bell, X, CheckCheck, Trash2, LifeBuoy, FileText, Flame, AlertTriangle } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onNavigate: (section: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 text-xs text-slate-200 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-500" />
            <h3 className="font-bold text-white text-sm">Notifications</h3>
            <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-mono text-[10px] border border-rose-800">
              {notifications.filter(n => !n.isRead).length} new
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action controls */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <button
            onClick={onMarkAllRead}
            disabled={notifications.length === 0}
            className="hover:text-emerald-400 flex items-center gap-1 cursor-pointer disabled:opacity-40"
          >
            <CheckCheck className="w-3 h-3" />
            <span>Mark read</span>
          </button>
          <button
            onClick={onClearAll}
            disabled={notifications.length === 0}
            className="hover:text-rose-400 flex items-center gap-1 cursor-pointer disabled:opacity-40"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>

        {/* Notification Stream */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No notifications recorded yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border transition-all text-xs space-y-1 ${
                  n.isRead
                    ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                    : 'bg-slate-950 border-slate-700 text-slate-200 ring-1 ring-rose-500/20'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white leading-tight">{n.title}</span>
                  <span className="font-mono text-[10px] text-slate-500">{n.timestamp}</span>
                </div>
                <p className="text-[11.5px] text-slate-300 leading-relaxed">{n.message}</p>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => {
            onNavigate('notifications');
            onClose();
          }}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-center font-bold text-xs cursor-pointer"
        >
          View Full Notifications Center →
        </button>
      </div>
    </div>
  );
};
