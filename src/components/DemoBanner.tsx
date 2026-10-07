import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Translations } from '../data/i18n';

interface DemoBannerProps {
  t: (key: keyof Translations) => string;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ t }) => {
  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-200 px-4 py-2 text-xs flex items-center justify-between">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold">
            {t('demoModeNotice')}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-amber-300/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local Storage Demo Persisted</span>
        </div>
      </div>
    </div>
  );
};
