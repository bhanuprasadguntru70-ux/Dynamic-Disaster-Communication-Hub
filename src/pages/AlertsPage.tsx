import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Radio, 
  Volume2, 
  CheckCircle2, 
  Plus, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Send 
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { DisasterAlert, AlertSeverity } from '../models/entities';
import { alertService } from '../services/dataService';
import { soundManager } from '../utils/audio';

interface AlertsPageProps {
  lang: Language;
  alerts: DisasterAlert[];
  onAlertCreated: (alert: DisasterAlert) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  lang,
  alerts,
  onAlertCreated,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const [activeFilter, setActiveFilter] = useState<'ALL' | AlertSeverity>('ALL');
  const [isPlayingSiren, setIsPlayingSiren] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity>('CRITICAL');
  const [source, setSource] = useState('State Emergency Operations Center (EOC)');

  const handleTestSiren = () => {
    setIsPlayingSiren(true);
    soundManager.playEASTone(2.5);
    setTimeout(() => setIsPlayingSiren(false), 2600);
  };

  const handleIssueAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) return;

    const created = alertService.create({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      severity,
      source: source.trim(),
      targetCounties: ['Coastal Sector', 'River Basin'],
    });

    soundManager.playEASTone(2);
    onAlertCreated(created);
    setShowIssueModal(false);
    setTitle('');
    setDescription('');
    setLocation('');
  };

  const filteredAlerts = alerts.filter(a => activeFilter === 'ALL' || a.severity === activeFilter);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block mb-1">
            Civil Protection Transmissions
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Radio className="w-6 h-6 text-rose-500 animate-pulse" />
            <span>Emergency Alert Center &amp; Broadcasts</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified public safety warnings, flood advisories, and weather defense bulletins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestSiren}
            disabled={isPlayingSiren}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
              isPlayingSiren
                ? 'bg-rose-600 border-white text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            <Volume2 className="w-4 h-4 text-rose-400" />
            <span>{isPlayingSiren ? 'Broadcasting Siren...' : 'Test Emergency Siren'}</span>
          </button>

          <button
            onClick={() => setShowIssueModal(!showIssueModal)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-rose-950"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Official Alert</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-md text-xs">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeFilter === 'ALL' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({alerts.length})
        </button>
        <button
          onClick={() => setActiveFilter('CRITICAL')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeFilter === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          Critical ({alerts.filter(a => a.severity === 'CRITICAL').length})
        </button>
        <button
          onClick={() => setActiveFilter('WARNING')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeFilter === 'WARNING' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          Warning ({alerts.filter(a => a.severity === 'WARNING').length})
        </button>
        <button
          onClick={() => setActiveFilter('INFORMATION')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeFilter === 'INFORMATION' ? 'bg-sky-950 text-sky-300 border border-sky-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          Information ({alerts.filter(a => a.severity === 'INFORMATION').length})
        </button>
      </div>

      {/* Create Alert Modal Form */}
      {showIssueModal && (
        <form onSubmit={handleIssueAlert} className="bg-slate-900 border-2 border-rose-500 rounded-2xl p-6 space-y-4 text-xs shadow-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span>Broadcast New Emergency Alert Bulletin</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Official Transmitter</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Severity Category *</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono font-bold focus:outline-none focus:border-rose-500"
              >
                <option value="CRITICAL">CRITICAL (Immediate Life Threat)</option>
                <option value="WARNING">WARNING (Prepare Evacuation / Shelter)</option>
                <option value="INFORMATION">INFORMATION (Advisory / Health Notice)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Target Geographic Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Krishna & Guntur Lowlands, Ward 1-8"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Alert Headline / Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. RED ALERT: FLASH FLOOD INUNDATION EXPECTED WITHIN 2 HOURS"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs uppercase focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Full Advisory Directive &amp; Instructions *</label>
            <textarea
              rows={3}
              required
              placeholder="Specify mandatory actions, designated evacuation corridors, safe elevation points..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowIssueModal(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Bulletin</span>
            </button>
          </div>
        </form>
      )}

      {/* Alerts Stream */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
            No disaster alerts recorded under this category.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isWarning = alert.severity === 'WARNING';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border space-y-3 transition-all ${
                  isCritical
                    ? 'bg-rose-950/20 border-rose-600/70 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/20'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-600/70'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-400">{alert.id}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 font-semibold">{alert.source}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isCritical ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    isWarning ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-sky-950 text-sky-300 border border-sky-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                  {alert.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {alert.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{alert.location}</span>
                  </span>

                  <span className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{alert.time}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
