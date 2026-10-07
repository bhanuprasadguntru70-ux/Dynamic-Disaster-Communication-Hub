import React, { useState } from 'react';
import { MapPin, RefreshCw, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';
import { locationService, GeolocationResult } from '../services/locationService';

interface LocationCardProps {
  location: GeolocationResult | null;
  onLocationChange: (loc: GeolocationResult) => void;
  manualAddress: string;
  onManualAddressChange: (addr: string) => void;
  isManual: boolean;
  onToggleManual: (manual: boolean) => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onLocationChange,
  manualAddress,
  onManualAddressChange,
  isManual,
  onToggleManual,
}) => {
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = async () => {
    setIsLocating(true);
    const result = await locationService.getCurrentPosition();
    onLocationChange(result);
    setIsLocating(false);
    if (result.error) {
      onToggleManual(true);
    } else {
      onToggleManual(false);
    }
  };

  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-200 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>Incident Location &amp; Coordinates</span>
        </span>

        {/* 📍 GET MY LOCATION Button */}
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={isLocating}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Detecting GPS...' : '📍 GET MY LOCATION'}</span>
        </button>
      </div>

      {/* Permission Denied or Error Display */}
      {location?.error && (
        <div className="p-2.5 bg-rose-950/40 border border-rose-900 rounded-lg text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">{location.error}</span>
            <span className="text-[11px] text-slate-400">
              Please enter your physical address or landmarks manually below.
            </span>
          </div>
        </div>
      )}

      {/* Display GPS Telemetry if acquired */}
      {!isManual && location && !location.error && (
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg font-mono text-slate-200 space-y-1 text-xs tabular-nums">
          <div className="flex justify-between">
            <span className="text-slate-400">Latitude:</span>
            <span className="text-emerald-400 font-bold">{location.latitude}° N</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Longitude:</span>
            <span className="text-emerald-400 font-bold">{location.longitude}° E</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Accuracy:</span>
            <span className="text-slate-300">±{location.accuracy} meters</span>
          </div>
          <div className="flex justify-between text-[10.5px] text-slate-500 pt-1 border-t border-slate-800">
            <span>Last Updated:</span>
            <span>{location.timestamp}</span>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => onToggleManual(true)}
              className="text-sky-400 hover:text-sky-300 underline font-sans text-xs flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>[ENTER LOCATION MANUALLY]</span>
            </button>
          </div>
        </div>
      )}

      {/* Manual Location Form Field */}
      {isManual && (
        <div className="space-y-1.5 pt-1">
          <label className="text-slate-300 font-semibold block text-[11px]">
            Physical Street Address / Landmark / Village:
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 42 Krishna Canal Road, Ward 9, Near Water Tank"
            value={manualAddress}
            onChange={(e) => onManualAddressChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500"
          />
          {location && !location.error && (
            <button
              type="button"
              onClick={() => onToggleManual(false)}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline"
            >
              ← Revert to browser GPS coordinates
            </button>
          )}
        </div>
      )}
    </div>
  );
};
