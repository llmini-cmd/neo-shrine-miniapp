
import React, { useState } from 'react';
import { OFFERINGS, COPY } from '../constants';
import { OfferingOption, Language } from '../types';
import { Coins, ChevronRight } from 'lucide-react';

interface ScreenOfferingProps {
  onSelect: (option: OfferingOption) => void;
  onBack: () => void;
  lang: Language;
}

export const ScreenOffering: React.FC<ScreenOfferingProps> = ({ onSelect, onBack, lang }) => {
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const handleSelect = (option: OfferingOption) => {
    setAnimatingId(option.id);
    setTimeout(() => {
      onSelect(option);
    }, 850);
  };

  // Helper to map border colors to their respective text and background variants
  const getTierColors = (colorClass: string) => {
    if (colorClass.includes('lime')) return { text: 'text-lime-400', border: 'border-lime-400', bg: 'bg-lime-400', glow: 'shadow-[0_0_15px_#a3e635]' };
    if (colorClass.includes('cyan')) return { text: 'text-cyan-400', border: 'border-cyan-400', bg: 'bg-cyan-400', glow: 'shadow-[0_0_15px_#22d3ee]' };
    return { text: 'text-gray-400', border: 'border-gray-500', bg: 'bg-gray-500', glow: 'shadow-none' };
  };

  return (
    <div className="flex flex-col h-full relative z-10 p-6 max-w-md mx-auto w-full">
      <header className="mb-8 border-b border-gray-800 pb-4">
        <button onClick={onBack} className="text-gray-500 hover:text-white text-xs mb-2">
          &lt; {COPY[lang].back}
        </button>
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
          {COPY[lang].offeringTitle}
        </h2>
        <p className="text-lime-400/60 text-xs font-jp mt-1">{COPY[lang].offeringSub}</p>
      </header>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-6 relative px-1">
        {OFFERINGS.map((option) => {
          const theme = getTierColors(option.color);
          
          return (
            <div 
              key={option.id}
              onClick={() => !animatingId && handleSelect(option)}
              className={`group relative cursor-pointer border-4 ${option.color} bg-black/80 p-6 clip-corner transition-all duration-200 hover:bg-white/5 hover:scale-[1.02] hover:${theme.glow} active:scale-95 ${animatingId === option.id ? 'z-50' : ''}`}
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="flex-1">
                  <h3 className={`text-2xl font-black italic tracking-tighter ${theme.text} mb-2 group-hover:text-white transition-colors`}>
                    {option.label}
                  </h3>
                  <p className={`text-sm font-bold font-jp group-hover:text-white transition-colors ${theme.text}`}>
                    {option.subLabel}
                  </p>
                </div>
                <div className="text-right pl-4">
                   <Coins className={`w-8 h-8 ${theme.text} group-hover:text-white transition-colors`} />
                </div>
              </div>
              
              {/* Divider line and probability line colored by tier */}
              <div className={`mt-4 flex items-center justify-between border-t-2 ${theme.border} pt-3 transition-colors relative z-10`}>
                <span className={`text-xs font-bold font-mono ${theme.text} group-hover:text-white transition-colors`}>
                  PROBABILITY UP x{option.multiplier}
                </span>
                <ChevronRight className={`w-5 h-5 ${theme.text} group-hover:text-white group-hover:translate-x-1 transition-all`} />
              </div>

              {/* Local Coin Animation */}
              {animatingId === option.id && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="animate-toss-coin-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.6)] border-2 border-white/40 relative overflow-hidden ${theme.bg}`}>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-[4px] bg-black"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toss-coin-center {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          40% { transform: scale(1.6) rotate(180deg); opacity: 1; filter: brightness(1.5); }
          100% { transform: scale(0.4) rotate(720deg) translateY(-80px); opacity: 0; }
        }
        .animate-toss-coin-center {
          animation: toss-coin-center 0.85s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;
        }
      `}</style>
    </div>
  );
};
