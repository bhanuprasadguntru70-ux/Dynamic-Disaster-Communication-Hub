import React, { useState } from 'react';
import { 
  Bell, 
  Radio, 
  Volume2, 
  AlertTriangle, 
  Check, 
  ShieldAlert, 
  Send, 
  Flame, 
  Waves, 
  Activity, 
  Biohazard,
  CheckCircle2,
  Users
} from 'lucide-react';
import { EmergencyBroadcast, DisasterType } from '../types/disaster';
import { soundManager } from '../utils/audio';

interface AlertCenterProps {
  broadcasts: EmergencyBroadcast[];
  onIssueBroadcast: (broadcast: EmergencyBroadcast) => void;
  onAcknowledgeBroadcast: (id: string) => void;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({
  broadcasts,
  onIssueBroadcast,
  onAcknowledgeBroadcast,
}) => {
  const [isPlayingEAS, setIsPlayingEAS] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // New Alert Form state
  const [headline, setHeadline] = useState('');
  const [disasterType, setDisasterType] = useState<DisasterType>('wildfire');
  const [severity, setSeverity] = useState<'Catastrophic' | 'Severe' | 'Advisory'>('Catastrophic');
  const [targetCounties, setTargetCounties] = useState('Zone 4, Placer County, River Corridor');
  const [mandatoryInstructions, setMandatoryInstructions] = useState('');
  const [activeChannels, setActiveChannels] = useState<('Cell Broadcast' | 'NOAA Radio' | 'Sirens' | 'Digital Signs')[]>([
    'Cell Broadcast',
    'Sirens',
    'NOAA Radio',
  ]);

  const handleTestEASTone = () => {
    setIsPlayingEAS(true);
    soundManager.playEASTone(3);
    setTimeout(() => {
      setIsPlayingEAS(false);
    }, 3200);
  };

  const handleToggleChannel = (channel: 'Cell Broadcast' | 'NOAA Radio' | 'Sirens' | 'Digital Signs') => {
    if (activeChannels.includes(channel)) {
      setActiveChannels(activeChannels.filter(c => c !== channel));
    } else {
      setActiveChannels([...activeChannels, channel]);
    }
  };

  const handleSubmitBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !mandatoryInstructions.trim()) return;

    const newBroadcast: EmergencyBroadcast = {
      id: `EAS-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      headline: headline.trim(),
      disasterType,
      severity,
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' PDT',
      expiresAt: 'In 12 hours',
      targetCounties: targetCounties.split(',').map(s => s.trim()).filter(Boolean),
      mandatoryInstructions: mandatoryInstructions.trim(),
      activeChannels,
      acknowledgedCount: 1,
    };

    soundManager.playEASTone(2);
    onIssueBroadcast(newBroadcast);
    setShowForm(false);
    setHeadline('');
    setMandatoryInstructions('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <span>Emergency Alert System (EAS) &amp; Public Warning Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Omni-channel warning broadcasts sent via wireless emergency alerts (WEA), civil defense sirens, and NOAA weather radio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* EAS Dual-Tone Sound Tester */}
          <button
            onClick={handleTestEASTone}
            disabled={isPlayingEAS}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isPlayingEAS
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4 text-rose-400" />
            <span>{isPlayingEAS ? 'Broadcasting 853/960 Hz Tone...' : 'Test Dual-Tone EAS Siren'}</span>
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3.5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            {showForm ? 'Cancel Transmission' : '+ Issue Civil Warning'}
          </button>
        </div>
      </div>

      {/* Warning Formulation Modal/Form */}
      {showForm && (
        <form onSubmit={handleSubmitBroadcast} className="bg-slate-900 border border-rose-500/50 rounded-xl p-5 space-y-4 text-xs shadow-lg ring-1 ring-rose-500/20">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Broadcast Official Emergency Warning</span>
            </h3>
            <span className="text-[11px] text-slate-400">Civil Defense Protocol Section 4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Hazard Type:
              </label>
              <select
                value={disasterType}
                onChange={(e) => setDisasterType(e.target.value as DisasterType)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="wildfire">Wildfire / Canyon Firestorm</option>
                <option value="flood">Flash Flood / Dam Breach</option>
                <option value="earthquake">Major Earthquake / Tsunami</option>
                <option value="chemical_leak">Hazardous Materials Incident</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Alert Severity Level:
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as 'Catastrophic' | 'Severe' | 'Advisory')}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Catastrophic">Catastrophic (Immediate Threat to Life)</option>
                <option value="Severe">Severe (Urgent Preparedness Required)</option>
                <option value="Advisory">Advisory (Situational Awareness)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Targeted Counties / Sectors:
              </label>
              <input
                type="text"
                value={targetCounties}
                onChange={(e) => setTargetCounties(e.target.value)}
                placeholder="e.g. Zone 4, Placer County"
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Broadcast Alert Headline (All-Caps Teletext):
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. MANDATORY EVACUATION: RESIDENTS IN ZONE 4 LEAVE IMMEDIATELY"
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono text-xs focus:outline-none focus:border-rose-500 uppercase"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Mandatory Protective Instructions for Civilians:
            </label>
            <textarea
              rows={3}
              value={mandatoryInstructions}
              onChange={(e) => setMandatoryInstructions(e.target.value)}
              placeholder="Provide explicit survival instructions: escape route highway, shelter location, do not stop to gather personal items..."
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          {/* Channels Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              Simulcast Distribution Channels:
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Cell Broadcast', 'NOAA Radio', 'Sirens', 'Digital Signs'] as const).map((channel) => {
                const active = activeChannels.includes(channel);
                return (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => handleToggleChannel(channel)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-rose-950/80 border-rose-800 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-rose-400' : 'bg-slate-600'}`} />
                    <span>{channel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit EAS Warning System</span>
            </button>
          </div>
        </form>
      )}

      {/* Active Broadcasts List */}
      <div className="space-y-4">
        {broadcasts.map((broadcast) => {
          const isCatastrophic = broadcast.severity === 'Catastrophic';
          return (
            <div
              key={broadcast.id}
              className={`p-5 rounded-xl border space-y-3 ${
                isCatastrophic
                  ? 'bg-slate-900 border-rose-600/70 shadow-lg ring-1 ring-rose-500/20'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-rose-400 font-bold">{broadcast.id}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Issued at {broadcast.issuedAt}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Expires: {broadcast.expiresAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    isCatastrophic
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {broadcast.severity}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white tracking-wide leading-tight">
                {broadcast.headline}
              </h3>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-rose-100/90 leading-relaxed font-sans">
                <span className="font-bold text-rose-400 block mb-1 uppercase tracking-wider text-[11px]">
                  Directive &amp; Action Plan:
                </span>
                {broadcast.mandatoryInstructions}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[11px]">Active Transmitters:</span>
                  <div className="flex gap-1.5">
                    {broadcast.activeChannels.map((ch, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10.5px]">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono tabular-nums text-slate-200 font-bold">
                      {broadcast.acknowledgedCount.toLocaleString()}
                    </span> receipts logged
                  </span>

                  <button
                    onClick={() => {
                      soundManager.playAllClearChime();
                      onAcknowledgeBroadcast(broadcast.id);
                    }}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Acknowledge Receipt</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
