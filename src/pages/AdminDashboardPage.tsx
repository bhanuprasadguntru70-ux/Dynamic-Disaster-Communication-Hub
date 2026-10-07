import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldAlert, 
  Building2, 
  Tent, 
  Users, 
  Flame, 
  CheckCircle2, 
  Activity,
  Layers
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { EmergencyRecord } from '../models/emergency';
import { Hospital, Shelter, Volunteer, ResourceItem, DisasterAlert } from '../models/entities';

interface AdminDashboardPageProps {
  lang: Language;
  emergencies: EmergencyRecord[];
  hospitals: Hospital[];
  shelters: Shelter[];
  volunteers: Volunteer[];
  resources: ResourceItem[];
  alerts: DisasterAlert[];
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  lang,
  emergencies,
  hospitals,
  shelters,
  volunteers,
  resources,
  alerts,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const totalEmergencies = emergencies.length;
  const activeEmergencies = emergencies.filter(e => e.status !== 'RESOLVED').length;
  const criticalEmergencies = emergencies.filter(e => e.severity === 'CRITICAL').length;
  const totalBeds = hospitals.reduce((acc, h) => acc + h.availableGeneral, 0);
  const totalShelterSpaces = shelters.reduce((acc, s) => acc + s.availableSpaces, 0);

  // Group by category
  const typeCounts: Record<string, number> = {};
  emergencies.forEach(e => {
    typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
  });

  // Group by severity
  const severityCounts = {
    CRITICAL: emergencies.filter(e => e.severity === 'CRITICAL').length,
    HIGH: emergencies.filter(e => e.severity === 'HIGH').length,
    MEDIUM: emergencies.filter(e => e.severity === 'MEDIUM').length,
    LOW: emergencies.filter(e => e.severity === 'LOW').length,
  };

  // Group by status
  const statusCounts = {
    ACTIVE: emergencies.filter(e => e.status === 'ACTIVE').length,
    ACKNOWLEDGED: emergencies.filter(e => e.status === 'ACKNOWLEDGED').length,
    ASSIGNED: emergencies.filter(e => e.status === 'ASSIGNED').length,
    'IN PROGRESS': emergencies.filter(e => e.status === 'RESCUE IN PROGRESS').length,
    RESOLVED: emergencies.filter(e => e.status === 'RESOLVED').length,
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs font-semibold text-rose-500 uppercase tracking-widest block mb-1">
            Executive Operations Metrics
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-rose-500" />
            <span>State Disaster Analytics &amp; Admin Command</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-departmental disaster intelligence, hospital utilization, shelter ratios, and rescue velocity.
          </p>
        </div>

        <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ANALYTICS ENGINE OPERATIONAL</span>
        </div>
      </div>

      {/* 6 Top Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">TOTAL EMERGENCIES</span>
          <div className="text-2xl font-black font-mono text-white tabular-nums">{totalEmergencies}</div>
          <span className="text-[10px] text-slate-500">Cumulative incidents</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-rose-400 block">ACTIVE CASES</span>
          <div className="text-2xl font-black font-mono text-rose-400 tabular-nums">{activeEmergencies}</div>
          <span className="text-[10px] text-slate-500">Pending resolution</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-red-500 block">CRITICAL PRIORITY</span>
          <div className="text-2xl font-black font-mono text-red-500 tabular-nums">{criticalEmergencies}</div>
          <span className="text-[10px] text-slate-500">Life-threat status</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-sky-400 block">HOSPITALS</span>
          <div className="text-2xl font-black font-mono text-sky-400 tabular-nums">{hospitals.length}</div>
          <span className="text-[10px] text-slate-500">{totalBeds} beds open</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 block">SHELTERS</span>
          <div className="text-2xl font-black font-mono text-emerald-400 tabular-nums">{shelters.length}</div>
          <span className="text-[10px] text-slate-500">{totalShelterSpaces} cots free</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-purple-400 block">VOLUNTEERS</span>
          <div className="text-2xl font-black font-mono text-purple-400 tabular-nums">{volunteers.length}</div>
          <span className="text-[10px] text-slate-500">Enrolled responders</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Chart 1: Emergencies by Category */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-500" />
              <span>Emergencies by Disaster Classification</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Category Distribution</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(typeCounts).map(([type, count]) => {
              const pct = Math.round((count / Math.max(1, totalEmergencies)) * 100);
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-slate-300 font-semibold">{type}</span>
                    <span className="text-rose-400 font-bold tabular-nums">{count} incidents ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-rose-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Emergencies by Severity */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Emergencies by Threat Severity</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Triage Ranking</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-rose-400 font-bold">CRITICAL</span>
                <span className="text-rose-400 font-bold tabular-nums">{severityCounts.CRITICAL}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-rose-600" style={{ width: `${(severityCounts.CRITICAL / totalEmergencies) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-orange-400 font-bold">HIGH</span>
                <span className="text-orange-400 font-bold tabular-nums">{severityCounts.HIGH}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-orange-500" style={{ width: `${(severityCounts.HIGH / totalEmergencies) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-amber-400 font-bold">MEDIUM</span>
                <span className="text-amber-400 font-bold tabular-nums">{severityCounts.MEDIUM}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-amber-500" style={{ width: `${(severityCounts.MEDIUM / totalEmergencies) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-emerald-400 font-bold">LOW</span>
                <span className="text-emerald-400 font-bold tabular-nums">{severityCounts.LOW}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-emerald-500" style={{ width: `${(severityCounts.LOW / totalEmergencies) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Emergency Status Pipeline */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Response Lifecycle Status Pipeline</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Pipeline Stages</span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center pt-2 font-mono">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[9.5px] text-slate-400 uppercase font-bold block truncate">{status}</span>
                <span className="text-lg font-black text-white tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: 7-Day Trend Telemetry */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Daily Incident Volume &amp; Resolution Trend</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">7-Day Trajectory</span>
          </div>

          {/* SVG Bar / Trend Chart */}
          <div className="pt-2">
            <div className="h-32 flex items-end justify-between gap-3 px-2 border-b border-slate-800 pb-2">
              {[
                { day: 'Mon', reports: 12, resolved: 10 },
                { day: 'Tue', reports: 18, resolved: 14 },
                { day: 'Wed', reports: 25, resolved: 20 },
                { day: 'Thu', reports: 34, resolved: 28 },
                { day: 'Fri', reports: 42, resolved: 35 },
                { day: 'Sat', reports: 29, resolved: 26 },
                { day: 'Sun', reports: 19, resolved: 18 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <div 
                      className="w-3 bg-rose-500 rounded-t-sm transition-all"
                      style={{ height: `${(item.reports / 45) * 100}%` }}
                      title={`Reports: ${item.reports}`}
                    />
                    <div 
                      className="w-3 bg-emerald-500 rounded-t-sm transition-all"
                      style={{ height: `${(item.resolved / 45) * 100}%` }}
                      title={`Resolved: ${item.resolved}`}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 text-[11px] pt-3 text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                <span>Incident Calls</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span>Successful Rescues</span>
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
