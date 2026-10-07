import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  UserCheck, 
  ShieldCheck, 
  Send 
} from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { Volunteer } from '../models/entities';
import { volunteerService } from '../services/dataService';

interface VolunteersPageProps {
  lang: Language;
  volunteers: Volunteer[];
  onVolunteerRegistered: (volunteer: Volunteer) => void;
  onVolunteerUpdated: (volunteer: Volunteer) => void;
}

export const VolunteersPage: React.FC<VolunteersPageProps> = ({
  lang,
  volunteers,
  onVolunteerRegistered,
  onVolunteerUpdated,
}) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const [search, setSearch] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('Trauma First Aid, CPR, Swimmer');
  const [location, setLocation] = useState('Vijayawada Central');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !location.trim()) return;

    const registered = volunteerService.register({
      name: name.trim(),
      phone: phone.trim(),
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      location: location.trim(),
      availability: 'AVAILABLE',
      assignedZone: 'Sector 3 Standby Hub',
    });

    onVolunteerRegistered(registered);
    setShowRegisterForm(false);
    setName('');
    setPhone('');
  };

  const handleToggleAvailability = (v: Volunteer) => {
    const nextState = v.availability === 'AVAILABLE' ? 'BUSY' : v.availability === 'BUSY' ? 'OFFLINE' : 'AVAILABLE';
    const updated = volunteerService.updateAvailability(v.id, nextState);
    if (updated) {
      onVolunteerUpdated(updated);
    }
  };

  const filtered = volunteers.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.location.toLowerCase().includes(search.toLowerCase()) ||
    v.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest block mb-1">
            Community Emergency Response Corps
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Volunteer Mobilization &amp; First Responders</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Registered doctors, boat navigators, translators, and relief distribution volunteers.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-950"
        >
          <Plus className="w-4 h-4" />
          <span>{t('registerVolunteer')}</span>
        </button>
      </div>

      {/* Registration Form Modal */}
      {showRegisterForm && (
        <form onSubmit={handleRegister} className="bg-slate-900 border border-purple-500 rounded-2xl p-6 space-y-4 text-xs shadow-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-400" />
              <span>Enroll as Civil Defense Volunteer</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Volunteer Roster</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Rajesh Verma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Phone Number (Call/WhatsApp) *</label>
              <input
                type="text"
                required
                placeholder="+91 98480 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Base District / Sector *</label>
              <input
                type="text"
                required
                placeholder="e.g. Visakhapatnam Beach Ward"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Skills &amp; Certifications (Comma separated) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Paramedic, Boat Driving, Drone Pilot, Cook"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowRegisterForm(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Register to Roster</span>
            </button>
          </div>
        </form>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Filter by volunteer name, location, or skills (e.g. Medical, Driver)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Volunteer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((volunteer) => {
          const isAvail = volunteer.availability === 'AVAILABLE';
          const isBusy = volunteer.availability === 'BUSY';

          return (
            <div
              key={volunteer.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 text-xs shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-purple-400 font-bold text-[11px]">{volunteer.id}</span>
                  
                  {/* Clickable availability switcher */}
                  <button
                    onClick={() => handleToggleAvailability(volunteer)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                      isAvail ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      isBusy ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                    title="Click to toggle availability"
                  >
                    <span className={`w-2 h-2 rounded-full ${isAvail ? 'bg-emerald-400' : isBusy ? 'bg-amber-400' : 'bg-slate-500'}`} />
                    <span>{volunteer.availability}</span>
                  </button>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{volunteer.name}</h3>
                <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{volunteer.location}</span>
                </p>

                <div className="my-3 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                    Certified Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {volunteer.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10.5px]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-[11px] font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Direct Phone:</span>
                    <span className="text-white font-bold">{volunteer.phone}</span>
                  </div>
                  {volunteer.assignedZone && (
                    <div className="flex justify-between">
                      <span>Deployment:</span>
                      <span className="text-purple-300 font-bold">{volunteer.assignedZone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">Registered: {volunteer.registeredDate}</span>
                <button
                  onClick={() => handleToggleAvailability(volunteer)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Toggle State
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
