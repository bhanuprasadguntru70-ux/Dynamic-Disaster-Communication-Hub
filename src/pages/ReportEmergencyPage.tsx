import React, { useState } from 'react';
import { 
  FileText, 
  MapPin, 
  CheckCircle2, 
  Users, 
  HeartPulse, 
  Phone, 
  Send, 
  ShieldAlert, 
  ArrowRight,
  ArrowLeft,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { EmergencyCategory, SeverityLevel, EmergencyRecord } from '../models/emergency';
import { emergencyService } from '../services/emergencyService';
import { LocationCard } from '../components/LocationCard';
import { SeverityBadge } from '../components/SeverityBadge';
import { StatusTimeline } from '../components/StatusTimeline';
import { soundManager } from '../utils/audio';
import { GeolocationResult } from '../services/locationService';

interface ReportEmergencyPageProps {
  onNavigate: (section: string) => void;
  onViewEmergencyStatus: (id: string) => void;
  lang: Language;
  onEmergencyCreated: (record: EmergencyRecord) => void;
}

export const ReportEmergencyPage: React.FC<ReportEmergencyPageProps> = ({
  onNavigate,
  onViewEmergencyStatus,
  lang,
  onEmergencyCreated,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const [type, setType] = useState<EmergencyCategory>('Flood');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [peopleAffected, setPeopleAffected] = useState<number | string>(5);
  const [injuredCount, setInjuredCount] = useState<number | string>(0);
  const [contactNumber, setContactNumber] = useState('');
  const [reportedBy, setReportedBy] = useState('');

  // Location
  const [locationResult, setLocationResult] = useState<GeolocationResult | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [isManualLocation, setIsManualLocation] = useState(true);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<EmergencyRecord | null>(null);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!type) errs.type = 'Please select an emergency type.';
    if (!description.trim()) errs.description = 'Please enter an emergency description.';
    if (!severity) errs.severity = 'Please select severity.';
    if (isManualLocation && !manualAddress.trim()) {
      errs.location = 'Please enter the incident location.';
    }
    if (!contactNumber.trim()) errs.contact = 'Please enter a contact number.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      let lat = locationResult && !locationResult.error ? locationResult.latitude : 16.5062;
      let lng = locationResult && !locationResult.error ? locationResult.longitude : 80.6480;
      let accuracy = locationResult?.accuracy || 20;
      let address = manualAddress.trim() || 
        (locationResult && !locationResult.error 
          ? `GPS: ${lat}°N, ${lng}°E` 
          : 'Vijayawada Lowlands');

      const created = emergencyService.createEmergency({
        type,
        description: description.trim(),
        severity,
        location: {
          latitude: lat,
          longitude: lng,
          accuracy,
          address,
          source: isManualLocation ? 'MANUAL' : 'GPS',
        },
        peopleAffected: Number(peopleAffected) || 1,
        injuredCount: Number(injuredCount) || 0,
        contactNumber: contactNumber.trim(),
        reportedBy: reportedBy.trim() || 'Citizen Reporter',
        isSOS: false,
      });

      soundManager.playDispatchChime();
      onEmergencyCreated(created);
      setSubmittedRecord(created);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-bold font-mono tracking-wider">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>OFFICIAL INCIDENT REPORTING</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          📝 REPORT EMERGENCY
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Submit detailed disaster observations, civilian casualty counts, and local infrastructure hazards to emergency coordinators.
        </p>
      </div>

      {submittedRecord ? (
        <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center text-center space-y-2 pb-4 border-b border-slate-800">
            <div className="w-16 h-16 rounded-full bg-emerald-600/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">
              Emergency Report Logged
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Incident has been assigned official tracking identifier <strong className="text-rose-400 font-mono">{submittedRecord.id}</strong>.
            </p>
            <div className="p-2.5 bg-amber-950/60 border border-amber-800 rounded-xl text-amber-300 text-xs font-semibold mt-2">
              ⚠️ DEMO MODE: Emergency request has been persisted in localStorage.
            </div>
          </div>

          <div className="space-y-1 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block text-center mb-1">
              Incident Status Timeline
            </span>
            <StatusTimeline
              currentStatus={submittedRecord.status}
              allowInteractive={true}
              onStatusChange={(newStatus) => {
                const updated = emergencyService.updateStatus(submittedRecord.id, newStatus);
                if (updated) setSubmittedRecord(updated);
              }}
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono space-y-2.5 tabular-nums">
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Emergency ID:</span>
              <span className="text-rose-400 font-bold">{submittedRecord.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Classification:</span>
              <span className="text-white font-bold">{submittedRecord.type}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Severity:</span>
              <SeverityBadge severity={submittedRecord.severity} />
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Reported Location:</span>
              <span className="text-slate-200">{submittedRecord.location.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">People Impacted:</span>
              <span className="text-amber-400 font-bold">{submittedRecord.peopleAffected} (Injured: {submittedRecord.injuredCount})</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onViewEmergencyStatus(submittedRecord.id)}
              className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-rose-950 flex items-center justify-center gap-2"
            >
              <span>[VIEW STATUS]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>[BACK TO DASHBOARD]</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 text-xs shadow-xl">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-1.5">
                Emergency Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EmergencyCategory)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-rose-500 font-semibold"
              >
                <option value="Flood">Flood</option>
                <option value="Fire">Fire</option>
                <option value="Medical">Medical</option>
                <option value="Accident">Accident</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Cyclone">Cyclone</option>
                <option value="Landslide">Landslide</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-1.5">
                Severity *
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-rose-500 font-semibold font-mono"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              placeholder="State what occurred, rising water speeds, trapped vehicles, electrical power wire hazards, etc."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors(prev => ({ ...prev, description: '' }));
              }}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 resize-none"
            />
            {errors.description && (
              <p className="text-rose-400 text-xs mt-1 font-semibold">{errors.description}</p>
            )}
          </div>

          {/* Location Field with LocationCard */}
          <LocationCard
            location={locationResult}
            onLocationChange={setLocationResult}
            manualAddress={manualAddress}
            onManualAddressChange={(addr) => {
              setManualAddress(addr);
              setErrors(prev => ({ ...prev, location: '' }));
            }}
            isManual={isManualLocation}
            onToggleManual={setIsManualLocation}
          />
          {errors.location && (
            <p className="text-rose-400 text-xs font-semibold">{errors.location}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-1.5">
                People Affected
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  min="1"
                  value={peopleAffected}
                  onChange={(e) => setPeopleAffected(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-1.5">
                Injured People
              </label>
              <div className="relative">
                <HeartPulse className="w-4 h-4 text-rose-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  min="0"
                  value={injuredCount}
                  onChange={(e) => setInjuredCount(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-1.5">
                Contact Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="+91 98480 00000"
                  value={contactNumber}
                  onChange={(e) => {
                    setContactNumber(e.target.value);
                    setErrors(prev => ({ ...prev, contact: '' }));
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              {errors.contact && (
                <p className="text-rose-400 text-xs mt-1 font-semibold">{errors.contact}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-1.5">
                Reported By (Your Name)
              </label>
              <input
                type="text"
                placeholder="e.g. Anand Varma"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-black text-sm tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-950 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'SUBMITTING REPORT...' : 'REPORT EMERGENCY'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
