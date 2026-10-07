import React, { useState } from 'react';
import { 
  Home, 
  Package, 
  Users, 
  Activity, 
  Zap, 
  Calendar, 
  Phone, 
  MapPin, 
  Plus, 
  Minus, 
  ArrowRight, 
  Check, 
  AlertTriangle,
  HeartHandshake,
  Droplets
} from 'lucide-react';
import { Shelter, ReliefItem } from '../types/disaster';
import { soundManager } from '../utils/audio';

interface ShelterLogisticsProps {
  shelters: Shelter[];
  reliefItems: ReliefItem[];
  onUpdateShelter: (shelter: Shelter) => void;
  onUpdateReliefItem: (item: ReliefItem) => void;
}

export const ShelterLogistics: React.FC<ShelterLogisticsProps> = ({
  shelters,
  reliefItems,
  onUpdateShelter,
  onUpdateReliefItem,
}) => {
  const [selectedShelterForDispatch, setSelectedShelterForDispatch] = useState<string>(shelters[0]?.id || '');
  const [selectedReliefItemId, setSelectedReliefItemId] = useState<string>(reliefItems[0]?.id || '');
  const [dispatchQuantity, setDispatchQuantity] = useState<number>(100);
  const [showDispatchSuccess, setShowDispatchSuccess] = useState<boolean>(false);

  const handleAdjustOccupancy = (shelter: Shelter, delta: number) => {
    const newOccupancy = Math.max(0, Math.min(shelter.capacity + 200, shelter.currentOccupancy + delta));
    const updated: Shelter = {
      ...shelter,
      currentOccupancy: newOccupancy,
    };
    onUpdateShelter(updated);
  };

  const handleDispatchSupplies = (e: React.FormEvent) => {
    e.preventDefault();
    const item = reliefItems.find(r => r.id === selectedReliefItemId);
    const targetShelter = shelters.find(s => s.id === selectedShelterForDispatch);
    if (!item || !targetShelter || dispatchQuantity <= 0) return;

    if (item.inStock < dispatchQuantity) {
      alert(`Cannot dispatch ${dispatchQuantity}: only ${item.inStock} ${item.unit} in depot stock.`);
      return;
    }

    // Decrement stock
    const updatedItem: ReliefItem = {
      ...item,
      inStock: item.inStock - dispatchQuantity,
    };
    onUpdateReliefItem(updatedItem);

    // Increase shelter supplies buffer
    const updatedShelter: Shelter = {
      ...targetShelter,
      suppliesDaysRemaining: targetShelter.suppliesDaysRemaining + Math.max(1, Math.floor(dispatchQuantity / 300)),
    };
    onUpdateShelter(updatedShelter);

    soundManager.playDispatchChime();
    setShowDispatchSuccess(true);
    setTimeout(() => setShowDispatchSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Home className="w-5 h-5 text-sky-400" />
          <span>Evacuation Shelters &amp; Strategic Relief Logistics</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time occupancy management for civilian reception centers, backup power status, and regional relief depots.
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 block text-[11px]">Total Safe Cots</span>
          <span className="text-xl font-bold font-mono tabular-nums text-white">
            {shelters.reduce((acc, s) => acc + s.capacity, 0).toLocaleString()}
          </span>
          <span className="text-slate-500 text-[10px] block mt-0.5">Across {shelters.length} regional sectors</span>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 block text-[11px]">Current Civilians Sheltered</span>
          <span className="text-xl font-bold font-mono tabular-nums text-sky-400">
            {shelters.reduce((acc, s) => acc + s.currentOccupancy, 0).toLocaleString()}
          </span>
          <span className="text-slate-500 text-[10px] block mt-0.5">
            {Math.round((shelters.reduce((acc, s) => acc + s.currentOccupancy, 0) / shelters.reduce((acc, s) => acc + s.capacity, 1)) * 100)}% overall utilization
          </span>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 block text-[11px]">Available Empty Cots</span>
          <span className="text-xl font-bold font-mono tabular-nums text-emerald-400">
            {Math.max(0, shelters.reduce((acc, s) => acc + s.capacity - s.currentOccupancy, 0)).toLocaleString()}
          </span>
          <span className="text-slate-500 text-[10px] block mt-0.5">Ready for incoming evacuees</span>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 block text-[11px]">Potable Water Reserves</span>
          <span className="text-xl font-bold font-mono tabular-nums text-cyan-400">
            {(reliefItems.find(r => r.category === 'Water')?.inStock || 0).toLocaleString()} L
          </span>
          <span className="text-slate-500 text-[10px] block mt-0.5">Immediate disaster supply ready</span>
        </div>
      </div>

      {/* Evacuation Shelters Section */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            <span>Evacuation Facilities &amp; Ingress Controls</span>
          </span>
          <span className="text-xs text-slate-400 font-normal">
            Use (+/-) controls to record live intake and departures
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shelters.map((shelter) => {
            const occupancyPct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
            const isFull = occupancyPct >= 100;
            const isHigh = occupancyPct >= 85;

            return (
              <div
                key={shelter.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-xs"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-0.5">
                      <span className="font-mono text-sky-400 font-bold">{shelter.id}</span>
                      <span>·</span>
                      <span>Managed by {shelter.managerName}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">
                      {shelter.name}
                    </h4>
                    <p className="text-slate-400 text-[11.5px] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{shelter.address}</span>
                    </p>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    isFull ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    isHigh ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {occupancyPct}% FULL
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Civilian Occupancy:</span>
                    <span className="font-mono font-bold text-white tabular-nums">
                      {shelter.currentOccupancy} / {shelter.capacity} Cots
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFull ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, occupancyPct)}%` }}
                    />
                  </div>
                </div>

                {/* Facilities Badges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Activity className={`w-3.5 h-3.5 ${shelter.hasMedicalStaff ? 'text-rose-400' : 'text-slate-600'}`} />
                    <span>{shelter.hasMedicalStaff ? 'Medical Triage Onsite' : 'No Medical Clinic'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{shelter.powerStatus}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-mono tabular-nums">{shelter.suppliesDaysRemaining} Days Food/Water</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
                    <span>{shelter.isPetFriendly ? 'Pets Welcome' : 'No Animals Allowed'}</span>
                  </div>
                </div>

                {/* Shelter Intake Stepper Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400">Intake / Check-In Counter:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAdjustOccupancy(shelter, -10)}
                      disabled={shelter.currentOccupancy <= 0}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded font-mono text-[11px] cursor-pointer"
                    >
                      -10
                    </button>
                    <button
                      onClick={() => handleAdjustOccupancy(shelter, -1)}
                      disabled={shelter.currentOccupancy <= 0}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded font-mono text-[11px] cursor-pointer"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleAdjustOccupancy(shelter, 1)}
                      className="px-2 py-1 bg-sky-700 hover:bg-sky-600 text-white rounded font-mono text-[11px] font-semibold cursor-pointer"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleAdjustOccupancy(shelter, 10)}
                      className="px-2 py-1 bg-sky-700 hover:bg-sky-600 text-white rounded font-mono text-[11px] font-semibold cursor-pointer"
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

      {/* Strategic Relief Supplies & Depot Dispatch Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
        
        {/* Supplies Stockpile Grid (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" />
            <span>Emergency Relief Stockpile &amp; Central Depots</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2 px-3">Item Classification</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3 text-right">Depot Stock</th>
                  <th className="py-2 px-3 text-right">Threshold</th>
                  <th className="py-2 px-3">Primary Sector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {reliefItems.map((item) => {
                  const isLow = item.inStock <= item.criticalThreshold;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-sans text-slate-200 font-medium">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">
                        {item.category}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold tabular-nums">
                        <span className={isLow ? 'text-rose-400' : 'text-emerald-400'}>
                          {item.inStock.toLocaleString()} {item.unit}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-400 tabular-nums text-[11px]">
                        {item.criticalThreshold.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-300 text-[11px]">
                        {item.assignedSector}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispatch Supply Form (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
          <h3 className="text-base font-bold text-white flex items-center gap-1.5">
            <ArrowRight className="w-4 h-4 text-rose-500" />
            <span>Dispatch Depot Cargo</span>
          </h3>
          <p className="text-slate-400 text-[11px]">
            Route humanitarian supplies directly from strategic storage to a forward evacuation shelter.
          </p>

          <form onSubmit={handleDispatchSupplies} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Select Relief Commodity:
              </label>
              <select
                value={selectedReliefItemId}
                onChange={(e) => setSelectedReliefItemId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              >
                {reliefItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.inStock.toLocaleString()} {item.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Destination Evacuation Shelter:
              </label>
              <select
                value={selectedShelterForDispatch}
                onChange={(e) => setSelectedShelterForDispatch(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-rose-500"
              >
                {shelters.map((shelter) => (
                  <option key={shelter.id} value={shelter.id}>
                    {shelter.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Transfer Units Quantity:
              </label>
              <input
                type="number"
                min="1"
                step="10"
                value={dispatchQuantity}
                onChange={(e) => setDispatchQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            {showDispatchSuccess && (
              <div className="p-2 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded text-[11px] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Cargo convoy dispatched successfully!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Authorize &amp; Dispatch Cargo Convoy</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
