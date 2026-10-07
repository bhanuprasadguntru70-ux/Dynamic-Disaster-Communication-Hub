import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckSquare, 
  Square, 
  Printer, 
  Flame, 
  Waves, 
  Activity, 
  Wind, 
  Biohazard, 
  ShieldCheck, 
  AlertOctagon, 
  Heart,
  Droplet,
  Radio,
  FileText
} from 'lucide-react';
import { DisasterType } from '../types/disaster';

interface GoBagItem {
  id: string;
  name: string;
  category: 'Water & Sustenance' | 'Tools & Light' | 'Medical & Hygiene' | 'Documents & Cash';
  recommendedQty: string;
}

const DEFAULT_ITEMS: GoBagItem[] = [
  { id: '1', name: 'Potable Drinking Water (1 Gallon / person / day)', category: 'Water & Sustenance', recommendedQty: '3 Days minimum' },
  { id: '2', name: 'Non-Perishable Canned Food & High-Calorie Rations', category: 'Water & Sustenance', recommendedQty: '3-Day supply' },
  { id: '3', name: 'Hand-Crank NOAA Weather Radio & Extra Batteries', category: 'Tools & Light', recommendedQty: '1 unit' },
  { id: '4', name: 'High-Lumen LED Flashlight & Headlamp', category: 'Tools & Light', recommendedQty: '2 units' },
  { id: '5', name: 'First Aid Trauma Kit (Tourniquet, Gauze, Antiseptic)', category: 'Medical & Hygiene', recommendedQty: '1 comprehensive kit' },
  { id: '6', name: 'Prescription Medications & Medical Devices', category: 'Medical & Hygiene', recommendedQty: '7-Day supply' },
  { id: '7', name: 'Multi-Tool / Swiss Pocket Knife & Duct Tape', category: 'Tools & Light', recommendedQty: '1 set' },
  { id: '8', name: 'N95 Particulate Respirator Face Masks', category: 'Medical & Hygiene', recommendedQty: '4 per person' },
  { id: '9', name: 'Copies of ID, Insurance Policies, Bank Passports (in waterproof bag)', category: 'Documents & Cash', recommendedQty: '1 waterproof pouch' },
  { id: '10', name: 'Cash in Small Denominations ($1, $5, $10, $20)', category: 'Documents & Cash', recommendedQty: '$200 - $400' },
  { id: '11', name: 'Emergency Mylar Thermal Foil Blankets', category: 'Tools & Light', recommendedQty: '1 per person' },
  { id: '12', name: 'Whistle to Signal for Rescuers', category: 'Tools & Light', recommendedQty: '1 unit' },
];

export const PreparednessGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DisasterType>('earthquake');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showPrintView, setShowPrintView] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('aegis_gobag_v1');
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleCheck = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    try {
      localStorage.setItem('aegis_gobag_v1', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const readinessPct = Math.round((completedCount / DEFAULT_ITEMS.length) * 100);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <span>Civilian Preparedness Protocols &amp; Survival Action Guides</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified emergency measures, 72-hour Go-Bag checklist, and printable offline readiness protocols.
          </p>
        </div>

        <button
          onClick={() => setShowPrintView(!showPrintView)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          <Printer className="w-4 h-4 text-sky-400" />
          <span>{showPrintView ? 'Close Pocket Card' : 'Printable Pocket Guide'}</span>
        </button>
      </div>

      {/* Offline Printable Card Mode */}
      {showPrintView && (
        <div className="p-6 bg-slate-950 border-2 border-dashed border-slate-700 rounded-xl space-y-4 text-xs font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">EMERGENCY POCKET CARD</span>
              <h3 className="text-lg font-bold text-white">FAMILY CRISIS RENDEZVOUS &amp; MEDICAL DOSSIER</h3>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-semibold text-xs cursor-pointer"
            >
              Print Document
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1.5">
              <span className="font-bold text-white block text-[11px] uppercase">Rendezvous Points</span>
              <p><strong className="text-slate-400">Neighborhood:</strong> Big Oak Park West Bench</p>
              <p><strong className="text-slate-400">Out-of-Area:</strong> St. Jude Community Center</p>
              <p><strong className="text-slate-400">Radio Freq:</strong> NOAA 162.400 MHz (Ch 2)</p>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1.5">
              <span className="font-bold text-white block text-[11px] uppercase">Emergency Contacts</span>
              <p><strong className="text-slate-400">Out-of-State Relative:</strong> (555) 892-1002</p>
              <p><strong className="text-slate-400">Disaster Dispatch:</strong> (800) 621-3362</p>
              <p><strong className="text-slate-400">Local Fire Station:</strong> (555) 490-0010</p>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1.5">
              <span className="font-bold text-white block text-[11px] uppercase">Immediate Rules</span>
              <p>• Shut main gas valve ONLY if smell gas or hear hissing.</p>
              <p>• Do not drink tap water until official boil advisory lifted.</p>
              <p>• Text instead of calling to keep cellular bands open for 911.</p>
            </div>
          </div>
        </div>
      )}

      {/* 72-Hour Emergency Go-Bag Checklist Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>72-Hour Rapid Evacuation Go-Bag Checklist</span>
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Essential gear required to sustain your household for at least 3 days during sudden displacement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-mono tabular-nums">
              <strong className="text-emerald-400 font-bold">{completedCount}</strong> / {DEFAULT_ITEMS.length} Packed ({readinessPct}%)
            </span>
            <div className="w-28 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  readinessPct === 100 ? 'bg-emerald-400' : readinessPct >= 60 ? 'bg-amber-400' : 'bg-rose-500'
                }`}
                style={{ width: `${readinessPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {DEFAULT_ITEMS.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-800/60 text-slate-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 focus:outline-none"
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600" />
                  )}
                </button>
                <div className="flex-1">
                  <span className={`font-medium block leading-tight ${isChecked ? 'text-white line-through opacity-85' : 'text-slate-200'}`}>
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                    {item.recommendedQty} · {item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain Survival Protocols Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Hazard Action Protocols</span>
          </h3>
          <span className="text-[11px] text-slate-400">Select disaster scenario to view life-saving steps</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('earthquake')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'earthquake' ? 'bg-slate-800 text-pink-300 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-pink-400" />
            <span>Earthquake</span>
          </button>
          <button
            onClick={() => setActiveTab('wildfire')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'wildfire' ? 'bg-slate-800 text-orange-300 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Wildfire</span>
          </button>
          <button
            onClick={() => setActiveTab('flood')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'flood' ? 'bg-slate-800 text-cyan-300 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span>Flood</span>
          </button>
          <button
            onClick={() => setActiveTab('hurricane')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hurricane' ? 'bg-slate-800 text-violet-300 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-violet-400" />
            <span>Hurricane</span>
          </button>
          <button
            onClick={() => setActiveTab('chemical_leak')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chemical_leak' ? 'bg-slate-800 text-lime-300 font-semibold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Biohazard className="w-3.5 h-3.5 text-lime-400" />
            <span>Hazmat / Toxic</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'earthquake' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-pink-400 block text-xs">1. DURING THE SHAKING</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                <strong>DROP, COVER, AND HOLD ON.</strong> Drop onto your hands and knees. Cover your head and neck beneath a sturdy desk or table. If no shelter, drop next to an interior wall and cover your head with your arms.
              </p>
              <p className="text-slate-400 text-[10.5px]">
                Do NOT run outside while shaking is active—falling architectural facade bricks and shattered glass cause the majority of injuries.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-pink-400 block text-xs">2. IMMEDIATELY AFTER</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                Check for gas leaks: if you smell natural gas or hear a hissing pipe, immediately shut off the main gas meter with a wrench and open windows. Do NOT turn on light switches or candles.
              </p>
              <p className="text-slate-400 text-[10.5px]">
                Wear thick-soled shoes immediately to protect against broken glass shards.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-pink-400 block text-xs">3. AFTERSHOCKS</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                Expect aftershocks within minutes to days. Stay out of visibly compromised masonry structures. Keep your Go-Bag within arm&apos;s reach by the door.
              </p>
              <p className="text-slate-400 text-[10.5px]">
                Tune to local emergency station on your battery-powered radio for structural bridge clearances.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'wildfire' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-orange-400 block text-xs">1. EVACUATION NOTICE</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                Do not wait for mandatory orders if you feel unsafe or have reduced mobility. Put your Go-Bag in the vehicle, back the car into your driveway facing outward, and keep car windows rolled up.
              </p>
              <p className="text-slate-400 text-[10.5px]">
                Dress in cotton/wool clothing: long sleeves, heavy denim, leather gloves, and an N95 mask. Avoid synthetic nylon fabrics that melt.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-orange-400 block text-xs">2. HOME HARDENING IF TIME PERMITS</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                Shut all interior and exterior windows and doors to prevent drafts. Move lightweight patio furniture, door mats, and propane BBQ tanks away from the home structure.
              </p>
              <p className="text-slate-400 text-[10.5px]">
                Leave porch and interior lights ON so your home is visible through dense fire smoke to emergency crews.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-orange-400 block text-xs">3. TRAPPED IN VEHICLE</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                Park behind an embankment or rock wall away from heavy brush. Turn on headlights, roll up windows, close air vents, and turn off air conditioning.
              </p>
              <p className="text-slate-400 text-[10.5px]">
                Lie on the vehicle floorboards covered with a wool blanket until the intense thermal flame front passes.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'flood' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-cyan-400 block text-xs">1. TURN AROUND, DON&apos;T DROWN</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                Never attempt to drive through water-covered roadways. Just 30cm (12 inches) of rushing water will float most passenger sedans, and 60cm will sweep away trucks.
              </p>
              <p className="text-slate-400 text-[10.5px]">
                Roadbeds beneath floodwater are frequently washed out completely without warning.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-cyan-400 block text-xs">2. HOME INUNDATION</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                If water rises into your residence, move to the highest level. Only move to the roof if trapped, and bring an axe to break through attic roof decking—never get trapped in an attic without an egress tool.
              </p>
              <p className="text-slate-400 text-[10.5px]">
                Disconnect the main electrical breaker ONLY if the electrical panel is in a dry area. Never step into standing water near electrical panels.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-cyan-400 block text-xs">3. WATER DISINFECTION</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                Floodwaters are contaminated with raw sewage, motor fuels, and bacteria. Boil tap water vigorously for 1 full minute prior to cooking or consumption.
              </p>
              <p className="text-slate-400 text-[10.5px]">
                Alternative: 8 drops of unscented household bleach (6% sodium hypochlorite) per gallon of clear water; let stand 30 minutes before drinking.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'hurricane' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-violet-400 block text-xs">1. SHELTER-IN-PLACE INTERIOR ROOM</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                Stay in a small interior room, hallway, or closet on the lowest non-flooded floor without exterior windows. Cover yourself with a mattress.
              </p>
              <p className="text-slate-400 text-[10.5px]">
                Taping windows with masking tape does NOT prevent shattering and produces larger, more hazardous shards. Use 5/8-inch exterior plywood or shutters.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-violet-400 block text-xs">2. THE EYE OF THE STORM</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                If the storm suddenly goes calm, the eye of the hurricane is directly overhead. Winds will rapidly re-engage from the opposite direction with severe destructive force. Remain in shelter.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-violet-400 block text-xs">3. GENERATOR CARBON MONOXIDE</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                NEVER operate portable gas generators indoors, in garages, or near open windows or air intakes. Position at least 20 feet (6 meters) away from any structure.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'chemical_leak' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-lime-400 block text-xs">1. SEAL THE ROOM</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                Go inside an interior above-ground room with the fewest exterior doors. Turn off air conditioners, heating units, fans, and close fireplace dampers immediately.
              </p>
              <p className="text-slate-400 text-[10.5px]">
                Seal doorframes and window edges with plastic sheeting and duct tape.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-lime-400 block text-xs">2. RESPIRATORY PROTECTION</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                If toxic vapors enter the room, breathe through a wet towel or cloth folded several times over your mouth and nose to filter soluble fumes.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-bold text-lime-400 block text-xs">3. ALL-CLEAR DECONTAMINATION</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                When the all-clear is issued, open windows and doors to thoroughly ventilate the room. Remove exposed outerwear, place in sealed plastic bags, and shower thoroughly.
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
