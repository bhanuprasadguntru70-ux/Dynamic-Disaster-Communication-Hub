import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  MapPin, 
  Plus, 
  Truck, 
  Ambulance, 
  Waves, 
  Droplet, 
  Utensils, 
  ShieldCheck, 
  ArrowRight,
  Send
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { ResourceItem } from '../models/entities';
import { resourceService } from '../services/dataService';
import { soundManager } from '../utils/audio';

interface ResourcesPageProps {
  lang: Language;
  resources: ResourceItem[];
  onResourceUpdated: (resource: ResourceItem) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({
  lang,
  resources,
  onResourceUpdated,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const [search, setSearch] = useState('');
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [allocQuantity, setAllocQuantity] = useState(2);

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource || allocQuantity <= 0) return;

    const updated = resourceService.allocate(selectedResource.id, allocQuantity);
    if (updated) {
      soundManager.playDispatchChime();
      onResourceUpdated(updated);
      setSelectedResource(null);
    }
  };

  const filtered = resources.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase()) ||
    r.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block mb-1">
            Logistics &amp; Supply Chain Inventory
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-400" />
            <span>Emergency Fleet &amp; Relief Stockpiles</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ambulances, motorized rescue boats, fire engines, emergency food rations, and medical kits.
          </p>
        </div>

        <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono">
          <span className="text-emerald-400 font-bold">CENTRAL CIVIL DEPOT</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Filter resources (e.g. Boats, Ambulances, Water, Food)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const availPct = Math.round((item.available / item.total) * 100);

          return (
            <div
              key={item.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 text-xs shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] mb-1.5">
                  <span className="text-emerald-400 font-bold">{item.id}</span>
                  <span className="text-slate-500">{item.category}</span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{item.name}</h3>
                <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{item.location}</span>
                </p>

                {/* Progress bar */}
                <div className="my-3 space-y-1.5">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-slate-400">{t('available')}:</span>
                    <span className="text-emerald-400 font-bold tabular-nums">
                      {item.available} / {item.total}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${availPct < 25 ? 'bg-rose-500' : availPct < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${availPct}%` }}
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('inUse')}:</span>
                    <span className="text-amber-400 font-bold">{item.inUse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fleet Status:</span>
                    <span className="text-slate-300 font-bold">{item.condition}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setSelectedResource(item)}
                  disabled={item.available <= 0}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Dispatch Resource</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Allocation Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <form onSubmit={handleAllocate} className="w-full max-w-sm bg-slate-900 border border-emerald-500 rounded-2xl shadow-2xl p-6 text-xs text-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="font-mono text-emerald-400 font-bold text-xs">{selectedResource.id}</span>
                <h3 className="text-base font-bold text-white leading-snug">{selectedResource.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedResource(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Quantity to Dispatch (Available: {selectedResource.available}):
              </label>
              <input
                type="number"
                min="1"
                max={selectedResource.available}
                value={allocQuantity}
                onChange={(e) => setAllocQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedResource(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm Dispatch</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
