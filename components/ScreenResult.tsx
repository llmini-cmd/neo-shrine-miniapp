
import React, { useState, useEffect } from 'react';
import { CyberButton } from './CyberButton';
import { Rarity, OmikujiResult, OfferingOption, Language, GameStats } from '../types';
import { ORACLE_CARDS } from '../constants';
import { Check, Wallet, Box, Share } from 'lucide-react';

interface ScreenResultProps {
  stats: GameStats;
  offering: OfferingOption;
  onReset: () => void;
  onSave: (result: OmikujiResult) => void;
  lang: Language;
  onNavigateArena?: (selectedId?: string) => void;
}

export const ScreenResult: React.FC<ScreenResultProps> = ({ stats, offering, onReset, onSave, lang, onNavigateArena }) => {
  const [result, setResult] = useState<OmikujiResult | null>(null);
  const [stage, setStage] = useState<'OMIKUJI' | 'REVEALED' | 'DONE'>('OMIKUJI');
  const [isShaking, setIsShaking] = useState(false);
  const [stickOut, setStickOut] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const generated = generateResult(stats, offering);
    setResult(generated);
    setImageFailed(false);
  }, [stats, offering]);

  const handleOmikujiAction = () => {
    if (isShaking || stickOut) return;
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setStickOut(true);
      setTimeout(() => {
        setStage('REVEALED');
      }, 1600);
    }, 800);
  };
  
  const tieTheKnot = () => {
    setStage('DONE');
    if (result) onSave(result);
  };

  const handleFarcasterShare = () => {
    if (!result) return;
    const appLink = window.location.origin;
    const text =
      `I played Neo Shrine🎮⛩️\n` +
      `FORTUNE RESULT: ${result.resultEn}（${result.resultJa}）\n\n` +
      `Try the game👇\n` +
      `${appLink}`;
    window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`, '_blank');
  };

  const hexPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

  if (stage === 'OMIKUJI') {
    // Enhanced Glow Levels using drop-shadow to bypass clip-path clipping
    const glowLevel = stats.score > 30000 
      ? 'drop-shadow-[0_0_45px_rgba(255,255,255,0.8)]' 
      : stats.score > 15000 
        ? 'drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]' 
        : 'drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]';
    
    const auraIntensity = stats.score > 20000 ? 'animate-aura-fast' : 'animate-aura-slow';

    return (
      <div className="h-full bg-black flex flex-col items-center justify-center relative overflow-hidden" onClick={handleOmikujiAction}>
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
         
         <div className="relative flex flex-col items-center justify-center z-10 w-full px-4 mb-28">
            {/* Wrapper for the Glow Filter - This ensures the glow is not clipped by the box's clip-path */}
            <div className={`relative transition-all duration-500 ${isShaking ? 'animate-shake' : ''} ${glowLevel} w-full max-w-xs`}>
               <div
                 className="neo-border-common p-[3px] clip-corner"
                 style={{ backgroundImage: 'linear-gradient(90deg, var(--neo-lime), var(--neo-cyan))' }}
               >
                 <div className="w-full aspect-[2/3] p-2 relative bg-black clip-corner">
                   <div className="w-full h-full relative overflow-hidden bg-gray-900 clip-corner">
                      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] ${auraIntensity}`}></div>

                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-32 h-44 translate-y-1">
                          <svg viewBox="0 0 100 160" className="w-full h-full text-white overflow-visible">
                            <defs>
                              <linearGradient id="omikuji-gradient" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="var(--neo-lime)" />
                                <stop offset="100%" stopColor="var(--neo-cyan)" />
                              </linearGradient>
                            </defs>
                            {stickOut && (
                              <g className="animate-stick-up">
                                 <rect x="47.5" y="5" width="5" height="40" fill="url(#omikuji-gradient)" filter="drop-shadow(0 0 8px #ffffff)" />
                                 <rect x="44.5" y="0" width="11" height="11" fill="url(#omikuji-gradient)" className="animate-pulse" />
                              </g>
                            )}
                            <path d="M50 20 L85 35 L85 135 L50 150 L15 135 L15 35 Z" fill="url(#omikuji-gradient)" className="opacity-95" />
                            <ellipse cx="50" cy="38" rx="8" ry="4" fill="black" />
                            <path d="M15 35 L15 135 L50 150 L85 135 L85 35" fill="none" stroke="currentColor" strokeWidth="2.8" className="opacity-90" />
                            <path d="M15 35 L50 20 L85 35" fill="none" stroke="currentColor" strokeWidth="2.8" className="opacity-90" />
                          </svg>
                        </div>
                      </div>
                   </div>
                 </div>
               </div>
            </div>

            <div className="mt-14 flex flex-col items-center">
               <div className="relative">
                  <p className="text-2xl font-black tracking-[0.35em] uppercase select-none text-center neo-gradient-text neo-gradient-text--common animate-pulse-fast">
                    TAP TO UNLOCK THE FORTUNE
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-5">
                    <div
                      className="h-[4px] w-20 neo-border-common opacity-80"
                      style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)' }}
                    ></div>
                    <div className="w-4 h-4 neo-border-common opacity-90" style={{ clipPath: hexPath }}></div>
                    <div
                      className="h-[4px] w-20 neo-border-common opacity-80"
                      style={{ clipPath: 'polygon(100% 50%, 0 0, 0 100%)' }}
                    ></div>
                  </div>
               </div>
            </div>
         </div>
            
            <div className="flex items-center justify-center gap-3">
               <div className="text-6xl md:text-8xl font-[900] italic text-white tracking-tighter tabular-nums drop-shadow-[0_0_35px_rgba(204,255,0,0.3)]">
                  {stats.score.toLocaleString()}
               </div>
               <div className="text-lime-400 font-black text-2xl italic tracking-tighter self-end pb-2 md:pb-3">
                  PTS
               </div>
            </div>
         </div>
    );
  }

  if (stage === 'REVEALED' && result) {
    const rarityClass =
      result.rarity === Rarity.LEGENDARY ? 'neo-border-legendary' : result.rarity === Rarity.RARE ? 'neo-border-rare' : 'neo-border-common';
    const resultTextClass =
      result.rarity === Rarity.LEGENDARY ? 'neo-gradient-text--legendary' : result.rarity === Rarity.RARE ? 'neo-gradient-text--rare' : 'neo-gradient-text--common';
    const luckMatch = /^(.+?)\s*\(([^)]+)\)\s*$/.exec(result.luck);
    const luckMain = (luckMatch?.[1] ?? result.luck).trim();
    const luckTag = (luckMatch?.[2] ?? '').trim();

    return (
      <div className="h-full bg-black flex flex-col p-6 relative overflow-y-auto">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

         <div className="flex-1 flex flex-col items-center justify-center relative z-10 my-4">
            <div className="w-full max-w-sm relative animate-flip-in overflow-visible">
              <div className={`absolute -top-5 -right-5 px-6 py-2 text-black font-black italic text-2xl z-[9999] transform rotate-3 border-4 border-black pointer-events-none ${result.rarity === Rarity.LEGENDARY ? 'bg-fuchsia-500' : result.rarity === Rarity.RARE ? 'bg-cyan-400' : 'bg-white'}`}>
                 {result.rarity}
              </div>

              <div className={`${rarityClass} p-[3px] clip-corner`}>
                <div className="w-full aspect-[3/4] p-3 relative bg-black clip-corner">
                  <div className="w-full h-full relative overflow-hidden bg-gray-900 border-2 border-white/50 clip-corner">
                    {imageFailed ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                        <div className={`text-sm font-black tracking-[0.35em] uppercase neo-gradient-text ${resultTextClass}`}>
                          ORACLE CARD
                        </div>
                      </div>
                    ) : (
                      <img
                        src={result.imageUrl}
                        className="w-full h-full object-cover"
                        alt="Oracle Card"
                        onError={() => setImageFailed(true)}
                      />
                    )}
                  
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-b from-transparent via-black/85 to-black pt-16 pb-5 px-5">
                      <h2 className={`text-2xl font-black italic leading-none mb-1.5 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] uppercase tracking-tighter neo-gradient-text ${resultTextClass}`}>
                        {luckMain}
                        {luckTag ? ` (${luckTag})` : ''}
                      </h2>
                      <p className="text-[11px] leading-snug text-gray-200 font-jp opacity-95 line-clamp-3">
                        {result.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         </div>
    );
  }           

         <div className="mt-6 flex flex-col gap-4 relative z-20 pb-6">
            <CyberButton onClick={tieTheKnot} className="w-full py-5 bg-lime-400 text-black hover:bg-white hover:text-black hover:shadow-[0_0_35px_#ccff00] border-none">
               <div className="flex items-center justify-center gap-2">
                  <Wallet size={24} className="stroke-[3]" />
                  <span className="text-xl">OMIKUJI COMPLETE</span>
               </div>
            </CyberButton>
            <button onClick={onReset} className="w-full py-3 text-sm text-gray-500 hover:text-red-500 font-black tracking-[0.3em] transition-colors flex items-center justify-center gap-3 uppercase">
               <span className="mr-1">&lt;</span> LEAVE // DECLINE
            </button>
         </div>
      </div>
    );
  }

  if (stage === 'DONE' && result) {
    return (
      <div className="h-full bg-black flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
         {/* Ambient Background */}
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img src={result.imageUrl} className="w-full h-full object-cover blur-3xl grayscale" onError={() => setImageFailed(true)} />
            <div className="absolute inset-0 bg-black/80"></div>
         </div>

         {/* Compact Center Content Area - Increased bottom margin significantly to push elements lower */}
         <div className="relative z-10 flex flex-col items-center mb-24">
            {/* Bounce & Pulse Checkmark with Enhanced Motion */}
            <div className="w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(204,255,0,0.4)] animate-check-intro">
               <Check size={40} className="text-black stroke-[7] animate-check-pulse" />
            </div>

            {/* Reduced size CONFIRMED! Text */}
            <h2 className="text-5xl font-black italic text-white tracking-tighter uppercase select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
               CONFIRMED!
            </h2>
         </div>

         <div className="w-full max-w-[300px] flex flex-col gap-4 relative z-10">
            <button 
               onClick={() => onNavigateArena?.(result.id)}
               className="group w-full py-3.5 px-6 bg-transparent border-2 border-lime-400 text-lime-400 flex items-center justify-center font-bold tracking-widest uppercase hover:bg-lime-400/10 transition-all clip-corner shadow-[0_4px_0_rgba(163,230,53,0.2)]"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Box size={20} className="transition-transform group-hover:scale-110" />
                <span className="text-lg">VIEW ORACLE RESULT</span>
              </span>
            </button>

            {/* RETURN TO SHRINE - Pushed further down with mt-12 and pt-10 */}
            <button 
               onClick={onReset} 
               className="w-full py-2 mt-12 text-gray-500 hover:text-white font-black tracking-[0.4em] uppercase text-[11px] transition-colors flex items-center justify-center gap-2 border-t border-gray-900 pt-10"
            >
               <span className="mr-1">&lt;</span> RETURN TO SHRINE
            </button>
         </div>

         <style>{`
            @keyframes check-intro {
               0% { transform: scale(0) rotate(-20deg) translateY(20px); opacity: 0; }
               70% { transform: scale(1.15) rotate(5deg) translateY(-5px); opacity: 1; }
               100% { transform: scale(1) rotate(0deg) translateY(0); opacity: 1; }
            }
            .animate-check-intro { animation: check-intro 0.65s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
            
            @keyframes check-pulse {
               0%, 100% { transform: scale(1); filter: brightness(1); }
               50% { transform: scale(1.1); filter: brightness(1.3); }
            }
            .animate-check-pulse { animation: check-pulse 1.8s ease-in-out infinite; }
         `}</style>
      </div>
    );
  }

  return null;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const generateResult = (stats: GameStats, offering: OfferingOption): OmikujiResult => {
  const tierBoost = offering.id === 'god' ? 0.14 : offering.id === 'normal' ? 0.07 : 0;
  const scoreNorm = clamp01(stats.score / 40000);
  const comboNorm = clamp01(stats.maxCombo / 30);
  const missPenalty = clamp01(stats.misses / 20);
  const stabilityNorm = clamp01(stats.stability);

  const performance =
    (scoreNorm * 0.45) +
    (comboNorm * 0.25) +
    (stabilityNorm * 0.2) +
    tierBoost -
    (missPenalty * 0.25);

  const randomness = (Math.random() * 0.22) - 0.11;
  const luckScore = clamp01(performance + randomness);

  const legendaryRate = clamp01((luckScore - 0.78) * 1.6);
  const rareRate = clamp01(0.25 + (luckScore * 0.5)) * (1 - legendaryRate);

  const roll = Math.random();
  const rarity = roll < legendaryRate ? Rarity.LEGENDARY : roll < legendaryRate + rareRate ? Rarity.RARE : Rarity.COMMON;

  const candidates = ORACLE_CARDS.filter(c => c.rarity === rarity);
  const picked = candidates[Math.floor(Math.random() * candidates.length)] ?? ORACLE_CARDS[0];

  return {
    id: `NEO-${Math.floor(Math.random() * 9999)}`,
    characterName: `ORACLE // ${picked.id}`,
    rarity,
    luck: picked.titleJa,
    resultEn: picked.resultEn,
    resultJa: picked.resultJa,
    description: picked.description,
    timestamp: Date.now(),
    imageUrl: picked.imageUrl,
    tierId: offering.id,
    isNew: true
  };
};
