import React from 'react';
import { LifeBuoy } from 'lucide-react';

interface SOSButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'normal' | 'large';
  label?: string;
}

export const SOSButton: React.FC<SOSButtonProps> = ({
  onClick,
  className = '',
  size = 'normal',
  label = 'SEND SOS',
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-extrabold tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-rose-950 transition-all cursor-pointer animate-pulse hover:animate-none ${
        size === 'large'
          ? 'px-8 py-4 text-base sm:text-lg'
          : 'px-4 py-2.5 text-xs sm:text-sm'
      } ${className}`}
    >
      <LifeBuoy className={size === 'large' ? 'w-6 h-6' : 'w-4 h-4'} />
      <span>{label}</span>
    </button>
  );
};
