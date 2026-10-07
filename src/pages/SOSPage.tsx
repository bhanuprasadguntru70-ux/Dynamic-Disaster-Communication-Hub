import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Ambulance, 
  Flame, 
  Waves, 
  Car, 
  Home, 
  UserX, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { EmergencyCategory, SeverityLevel, EmergencyRecord } from '../models/emergency';
import { emergencyService } from '../services/emergencyService';
import { GeolocationResult } from '../services/locationService';
import { LocationCard } from '../components/LocationCard';
import { SeverityBadge } from '../components/SeverityBadge';
import { StatusTimeline } from '../components/StatusTimeline';
import { soundManager } from '../utils/audio';

interface SOSPageProps {
  onNavigate: (section: string) => void;
  onViewEmergencyStatus: (id: string) => void;
  lang: Language;
  onEmergencyCreated: (record: EmergencyRecord) => void;
}

export const SOSPage: React.FC<SOSPageProps> = ({
  onNavigate,
  onViewEmergencyStatus,
  lang,
  onEmergencyCreated,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const [selectedType, setSelectedType] = useState<EmergencyCategory | null>('Medical');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel | null>('HIGH');
  
  // Location
  const [locationResult, setLocationResult] = useState<GeolocationResult | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [isManualLocation, setIsManualLocation] = useState(false);

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<{
    type?: string;
    description?: string;
    severity?: string;
    location?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<EmergencyRecord | null>(null);

  const emergencyTypes: { type: EmergencyCategory; label: string; icon: string }[] = [
    { type: 'Medical', label: 'Medical', icon: '🚑' },
    { type: 'Fire', label: 'Fire', icon: '🔥' },
    { type: 'Flood', label: 'Flood', icon: '🌊' },
    { type: 'Accident', label: 'Accident', icon: '🚗' },
    { type: 'Trapped', label: 'Trapped', icon: '🏚️' },
    { type: 'Missing Person', label: 'Missing Person', icon: '👤' },
    { type: 'Other', label: 'Other', icon: '⚠️' },
  ];

  const validate = (): boolean => {
    const errors: typeof validationErrors = {};
    if (!selectedType) {
      errors.type = 'Please select an emergency type.';
    }
    if (!description.trim()) {
      errors.description = 'Please enter an emergency description.';
    }
    if (!severity) {
      errors.severity = 'Please select severity.';
    }
    if (isManualLocation && !manualAddress.trim()) {
      errors.location = 'Please enter your street address or landmark.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmAndSendSOS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      let lat = locationResult && !locationResult.error ? locationResult.latitude : 16.5062;
      let lng = locationResult && !locationResult.error ? locationResult.longitude : 80.6480;
      let accuracy = locationResult?.accuracy || 15;
      let address = manualAddress.trim() || 
        (locationResult && !locationResult.error 
          ? `GPS: ${lat}°N, ${lng}°E (±${accuracy}m)` 
          : 'Vijayawada Emergency Zone');

      const created = emergencyService.createEmergency({
        type: selectedType!,
        description: description.trim(),
        severity: severity!,
        location: {
          latitude: lat,
          longitude: lng,
          accuracy,
          address,
          source: isManualLocation ? 'MANUAL' : (locationResult && !locationResult.error ? 'GPS' : 'DEFAULT'),
        },
        peopleAffected: 1,
        injuredCount: selectedType === 'Medical' ? 1 : 0,
        contactNumber: '+91 99999 00000',
        isSOS: true,
      });

      soundManager.playSOSMorseBeacon();
      onEmergencyCreated(created);
      setSubmittedRecord(created);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Title & Question Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold font-mono tracking-wider">
          <LifeBuoy className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>CIVIL DISTRESS CHANNEL</span>
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Emergency SOS
        </h2>
        <p className="text-base sm:text-lg text-rose-300 font-semibold max-w-xl mx-auto">
          Are you in an emergency?
        </p>
      </div>

      {/* CONFIRMATION PAGE: Section 5 */}
      {submittedRecord ? (
        <div className="bg-slate-900 border-2 border-rose-500 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-rose-950/60 animate-in zoom-in-95 duration-200">
          
          <div className="flex flex-col items-center text-center space-y-2 pb-4 border-b border-slate-800">
            <div className="w-16 h-16 rounded-full bg-rose-600/20 border-2 border-rose-500 flex items-center justify-center text-rose-500 animate-pulse">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            {/* Title exact: 🚨 SOS REQUEST SENT */}
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>🚨 SOS REQUEST SENT</span>
            </h3>

            {/* Clearly show DEMO MODE notice */}
            <p className="text-xs sm:text-sm text-rose-200 font-semibold max-w-md pt-1">
              &quot;Your emergency request has been recorded in DEMO MODE.&quot;
            </p>
            <div className="p-2.5 bg-amber-950/70 border border-amber-800 rounded-xl text-amber-300 text-xs font-semibold mt-2">
              ⚠️ DEMO MODE: Emergency request has been persisted in localStorage. In an actual crisis, call 112 / 911 immediately.
            </div>
          </div>

          {/* Emergency Details Dossier */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-xs font-mono space-y-2.5 tabular-nums">
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Emergency ID:</span>
              <span className="text-rose-400 font-bold text-base">{submittedRecord.id}</span>
            </div>

            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Type:</span>
              <span className="text-white font-bold">{submittedRecord.type}</span>
            </div>

            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Severity:</span>
              <SeverityBadge severity={submittedRecord.severity} />
            </div>

            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Location:</span>
              <span className="text-emerald-400 font-bold truncate max-w-xs text-right">
                {submittedRecord.location.address || `${submittedRecord.location.latitude}°N, ${submittedRecord.location.longitude}°E`}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Time:</span>
              <span className="text-slate-300">{submittedRecord.createdAt}</span>
            </div>

            <div className="flex justify-between pt-1 items-center">
              <span className="text-slate-400">Status:</span>
              <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-400 border border-rose-800 font-extrabold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>🔴 ACTIVE</span>
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-1 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block text-center mb-1">
              Emergency Lifecycle Status Timeline
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

          {/* Buttons: [VIEW STATUS] and [BACK TO DASHBOARD] */}
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
        /* SOS FORM: Section 2 & 4 */
        <form onSubmit={handleConfirmAndSendSOS} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 space-y-6 shadow-xl text-xs">
          
          {/* Emergency Types Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              1. Emergency Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {emergencyTypes.map((item) => {
                const isSelected = selectedType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      setSelectedType(item.type);
                      setValidationErrors(prev => ({ ...prev, type: undefined }));
                    }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white border-white shadow-md shadow-rose-950 font-bold scale-[1.02]'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
            {validationErrors.type && (
              <p className="text-rose-400 text-xs font-semibold">{validationErrors.type}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              2. Description of Emergency *
            </label>
            <textarea
              rows={3}
              placeholder="State what is happening, number of people trapped, injuries, fire intensity, water height..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setValidationErrors(prev => ({ ...prev, description: undefined }));
              }}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs leading-relaxed resize-none"
            />
            {validationErrors.description && (
              <p className="text-rose-400 text-xs font-semibold">{validationErrors.description}</p>
            )}
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              3. Severity *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as SeverityLevel[]).map((level) => {
                const isSelected = severity === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      setSeverity(level);
                      setValidationErrors(prev => ({ ...prev, severity: undefined }));
                    }}
                    className={`py-2.5 px-3 rounded-lg border font-mono font-bold text-xs transition-all cursor-pointer text-center ${
                      isSelected
                        ? level === 'CRITICAL'
                          ? 'bg-rose-600 text-white border-white ring-2 ring-rose-500/50'
                          : level === 'HIGH'
                          ? 'bg-orange-600 text-white border-white'
                          : level === 'MEDIUM'
                          ? 'bg-amber-600 text-white border-white'
                          : 'bg-emerald-600 text-white border-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
            {validationErrors.severity && (
              <p className="text-rose-400 text-xs font-semibold">{validationErrors.severity}</p>
            )}
          </div>

          {/* Browser Location Section: Section 3 */}
          <LocationCard
            location={locationResult}
            onLocationChange={(loc) => {
              setLocationResult(loc);
              setValidationErrors(prev => ({ ...prev, location: undefined }));
            }}
            manualAddress={manualAddress}
            onManualAddressChange={(addr) => {
              setManualAddress(addr);
              setValidationErrors(prev => ({ ...prev, location: undefined }));
            }}
            isManual={isManualLocation}
            onToggleManual={setIsManualLocation}
          />
          {validationErrors.location && (
            <p className="text-rose-400 text-xs font-semibold">{validationErrors.location}</p>
          )}

          {/* Submit Button: 🚨 CONFIRM & SEND SOS */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:opacity-60 text-white font-black text-base sm:text-lg tracking-wider uppercase rounded-xl flex items-center justify-center gap-2.5 shadow-xl shadow-rose-950 transition-all cursor-pointer animate-pulse hover:animate-none"
            >
              <LifeBuoy className="w-5 h-5" />
              <span>{isSubmitting ? 'PROCESSING BROADCAST...' : '🚨 CONFIRM & SEND SOS'}</span>
            </button>
            <p className="text-center text-[10.5px] text-slate-500 mt-2 font-mono">
              Generates unique ID (EMG-DEMO-XXXX) · Saved to localStorage
            </p>
          </div>

        </form>
      )}

    </div>
  );
};
