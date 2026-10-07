import React, { useState } from 'react';
import { 
  Tent, 
  MapPin, 
  Users, 
  Droplet, 
  Utensils, 
  Activity, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Navigation, 
  Phone 
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { Shelter } from '../models/entities';
import { shelterService } from '../services/dataService';

interface SheltersPageProps {
  onNavigate: (section: string) => void;
  lang: Language;
  shelters: Shelter[];
  onShelterUpdated: (shelter: Shelter) => void;
}

export const SheltersPage: React.FC<SheltersPageProps> = ({
  onNavigate,
  lang,
  shelters,
  onShelterUpdated,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const handleAdjustOccupancy = (shelter: Shelter, delta: number) => {
    const updated = shelterService.updateOccupancy(shelter.id, shelter.currentOccupancy + delta);
    if (updated) {
      onShelterUpdated(updated);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block mb-1">
            Civilian Refuge &amp; Evacuation Infrastructure
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Tent className="w-6 h-6 text-emerald-400" />
            <span>{t('nearbyShelters')} &amp; Ingress Hubs</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Safe assembly grounds, stadium complexes, community halls with potable water and food rations.
          </p>
        </div>

        <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono">
          <span className="text-emerald-400 font-bold">LIVE CAPACITY CONTROLS</span>
        </div>
      </div>

      {/* Shelter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shelters.map((shelter) => {
          const occupancyRate = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
          const isFull = shelter.status === 'FULL';
          const isLimited = shelter.status === 'LIMITED';

          return (
            <div
              key={shelter.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-xs shadow-md"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-emerald-400 font-bold text-[11px] block">{shelter.id}</span>
                  <h3 className="text-base font-bold text-white leading-snug">{shelter.name}</h3>
                  <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{shelter.location}</span>
                  </p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
                  isFull ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  isLimited ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isFull ? 'bg-rose-500' : isLimited ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span>{shelter.status}</span>
                </span>
              </div>

              {/* Progress Bar & Capacity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Current Occupancy:</span>
                  <span className="text-white font-bold tabular-nums">
                    {shelter.currentOccupancy} / {shelter.capacity} ({occupancyRate}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isFull ? 'bg-rose-500' : isLimited ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, occupancyRate)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>Available Spaces: <strong className="text-emerald-400">{shelter.availableSpaces}</strong></span>
                  <span>Contact: {shelter.contact}</span>
                </div>
              </div>

              {/* Badges for food, water, medical */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1 mb-0.5">
                    <Utensils className="w-3 h-3 text-amber-400" />
                    <span>Food</span>
                  </span>
                  <span className="text-xs font-bold text-white tabular-nums">{shelter.foodSupplyDays} Days</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1 mb-0.5">
                    <Droplet className="w-3 h-3 text-cyan-400" />
                    <span>Water</span>
                  </span>
                  <span className="text-xs font-bold text-white tabular-nums">{shelter.waterSupplyDays} Days</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1 mb-0.5">
                    <Activity className="w-3 h-3 text-rose-400" />
                    <span>Medical</span>
                  </span>
                  <span className={`text-xs font-bold ${shelter.hasMedicalSupport ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {shelter.hasMedicalSupport ? 'Stationed' : 'None'}
                  </span>
                </div>
              </div>

              {/* Intake Adjustment Steppers */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Intake Adjustment (Demo):</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <button
                    onClick={() => handleAdjustOccupancy(shelter, -10)}
                    disabled={shelter.currentOccupancy <= 0}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => handleAdjustOccupancy(shelter, -1)}
                    disabled={shelter.currentOccupancy <= 0}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => handleAdjustOccupancy(shelter, 1)}
                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleAdjustOccupancy(shelter, 10)}
                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    +10
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
