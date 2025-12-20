
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
  <div className="h-full w-full min-w-0 overflow-x-hidden bg-black">
    {/* Safe viewport container: prevents overlap and allows fallback scroll on tiny devices */}
    <div
      className="
        mx-auto
        h-full
        w-full
        max-w-md
        min-w-0
        overflow-hidden
        px-4
        pt-4
        pb-4
        flex
        flex-col
      "
    >
      {/* Header (fixed height) */}
      <header className="shrink-0">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white text-xs mb-2"
        >
          &larr; {COPY[lang].back}
        </button>

        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
          {COPY[lang].offeringTitle}
        </h2>

        <p className="text-lime-300/80 text-xs font-jp mt-1">
          {COPY[lang].offeringSub}
        </p>
      </header>

      {/* Content area: can shrink, and scrolls only if absolutely needed */}
      <div
        className="
          mt-4
          min-h-0
          flex-1
          flex
          flex-col
          gap-4
          overflow-y-auto
          overflow-x-hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          pr-1
        "
      >
        {/* Options list */}
        <div className="min-h-0 flex flex-col gap-3">
          {OFFERINGS.map((option) => {
            const theme = getTierColors(option.colorClass);

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                className={[
                  "group relative w-full text-left rounded-2xl border p-4 transition",
                  "bg-black/40 hover:bg-black/55 active:scale-[0.99]",
                  "min-w-0 overflow-hidden",
                  theme.border,
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <div className="min-w-0">
                    <h3
                      className={[
                        "text-2xl font-black italic tracking-tight",
                        theme.text,
                        "group-hover:text-white transition-colors",
                      ].join(" ")}
                    >
                      {option.label}
                    </h3>
                    <p className="text-sm font-bold font-jp text-gray-300 group-hover:text-white/90 transition-colors">
                      {option.subLabel}
                    </p>
                  </div>

                  <div className="shrink-0 text-right pl-2">
                    <Coins
                      className={[
                        "w-8 h-8",
                        theme.text,
                        "group-hover:text-white transition-colors",
                      ].join(" ")}
                    />
                  </div>
                </div>

                <div
                  className={[
                    "mt-3 flex items-center justify-between gap-2 border-t pt-3",
                    theme.border,
                  ].join(" ")}
                >
                  <span
                    className={[
                      "text-xs font-bold font-mono tracking-wide",
                      theme.text,
                      "group-hover:text-white transition-colors",
                    ].join(" ")}
                  >
                    PROBABILITY UP ×{option.multiplier}
                  </span>
                  <ChevronRight
                    className={[
                      "w-5 h-5",
                      theme.text,
                      "group-hover:text-white transition-colors",
                    ].join(" ")}
                  />
                </div>

                {/* Local coin animation overlay */}
                {animatingId === option.id && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="animate-toss-coin-center">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,255,180,0.35)]">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-[4px] bg-black/40" />
                      </div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom spacer to avoid last item touching the bottom on tiny screens */}
        <div className="h-2 shrink-0" />
      </div>

      {/* Styles (kept local) */}
      <style>{`
        @keyframes toss-coin-center {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          40% { transform: scale(1.6) rotate(180deg); opacity: 1; filter: brightness(1.5); }
          100% { transform: scale(0.4) rotate(720deg) translateY(-30px); opacity: 0; }
        }
        .animate-toss-coin-center {
          animation: toss-coin-center 0.85s cubic-bezier(0.17, 0.67, 0.33, 0.92) forwards;
        }
      `}</style>
    </div>
  </div>
);
 };
export default ScreenOffering;
