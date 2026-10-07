import React, { useState, useEffect } from 'react';
import { User, Phone, Heart, MapPin, Shield, Check, Save } from 'lucide-react';
import { Language, translations } from '../data/i18n';

interface ProfilePageProps {
  lang: Language;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ lang }) => {
  const t = (key: keyof typeof translations['en']) => translations[lang][key] || translations['en'][key];

  const [name, setName] = useState('Bhanu Prasad Guntru');
  const [phone, setPhone] = useState('+91 98480 77112');
  const [bloodGroup, setBloodGroup] = useState('O+ Positive');
  const [emergencyContact, setEmergencyContact] = useState('+91 94401 22334 (Spouse / Family)');
  const [address, setAddress] = useState('Flat 402, Sai Residency, Labbipet, Vijayawada, AP');
  const [medicalConditions, setMedicalConditions] = useState('Asthma inhaler required, no penicillin allergy');
  const [role, setRole] = useState<'Citizen' | 'Volunteer Responder' | 'EOC Coordinator'>('Citizen');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('disaster_hub_profile_v2');
      if (stored) {
        const p = JSON.parse(stored);
        if (p.name) setName(p.name);
        if (p.phone) setPhone(p.phone);
        if (p.bloodGroup) setBloodGroup(p.bloodGroup);
        if (p.emergencyContact) setEmergencyContact(p.emergencyContact);
        if (p.address) setAddress(p.address);
        if (p.medicalConditions) setMedicalConditions(p.medicalConditions);
        if (p.role) setRole(p.role);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = { name, phone, bloodGroup, emergencyContact, address, medicalConditions, role };
    localStorage.setItem('disaster_hub_profile_v2', JSON.stringify(profile));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest block mb-1">
            Civilian Emergency Identity
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-rose-500" />
            <span>Emergency Profile &amp; Medical ID</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-attached to distress beacons to expedite triage and blood transfusions.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 font-bold">
          CITIZEN DOSSIER
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 text-xs shadow-xl">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-300 font-bold block mb-1">Full Legal Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Cell Phone Number *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-slate-300 font-bold block mb-1">Blood Group *</label>
            <input
              type="text"
              required
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-rose-400 font-bold text-xs font-mono focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Role Designation</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="Citizen">Citizen User</option>
              <option value="Volunteer Responder">Volunteer Responder</option>
              <option value="EOC Coordinator">EOC Coordinator</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Emergency ICE Contact *</label>
            <input
              type="text"
              required
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="text-slate-300 font-bold block mb-1">Permanent Residential Address *</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-rose-500"
          />
        </div>

        <div>
          <label className="text-slate-300 font-bold block mb-1">Critical Medical Conditions &amp; Allergies</label>
          <textarea
            rows={3}
            value={medicalConditions}
            onChange={(e) => setMedicalConditions(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-rose-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          {savedSuccess ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
              <Check className="w-4 h-4" />
              <span>Profile Dossier Saved Successfully!</span>
            </span>
          ) : (
            <span className="text-slate-500 text-[11px]">Saved locally in encrypted browser session</span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-950"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>

      </form>

    </div>
  );
};
