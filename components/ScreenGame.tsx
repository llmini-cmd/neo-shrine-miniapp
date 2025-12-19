
import React, { useState, useEffect, useRef } from 'react';
import { OfferingOption, Language, GameStats } from '../types';
import { Hand, Zap } from 'lucide-react';

interface ScreenGameProps {
  offering: OfferingOption;
  onComplete: (stats: GameStats) => void;
  onBack: () => void;
  lang: Language;
}

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

const playTripleSuzuSound = () => {
  const ctx = initAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  [1200, 1600, 2200, 2800, 4000].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    [0, 0.45, 0.9].forEach(delay => {
      gain.gain.linearRampToValueAtTime(0.04 / (i + 1), now + delay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.3);
    });
    osc.start(now);
    osc.stop(now + 1.5);
  });
};

const playCoinSound = (multiplier: number, isFever: boolean) => {
  const ctx = initAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = isFever ? 'square' : 'sine';
  const baseFreq = multiplier === 5 ? 2600 : multiplier === 3 ? 2000 : 1600;
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq + (isFever ? 800 : 500), now + 0.04);
  gain.gain.setValueAtTime(isFever ? 0.05 : 0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  osc.start(now);
  osc.stop(now + 0.2);
};

interface Note {
  id: number;
  lane: 0 | 1 | 2;
  y: number; 
  hit: boolean;
  type: 'NORMAL' | 'BLUE' | 'RARE';
}

interface Judgment {
  id: number;
  lane: 0 | 1 | 2;
  text: string;
  type: 'PERFECT' | 'GREAT';
  isMultiplier: boolean;
}

export const ScreenGame: React.FC<ScreenGameProps> = ({ offering, onComplete, onBack, lang }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [introStep, setIntroStep] = useState(0); 
  const [isAscending, setIsAscending] = useState(false);
  const [scoreDisplay, setScoreDisplay] = useState(0); 
  const [timeLeft, setTimeLeft] = useState(25.00); 
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [misses, setMisses] = useState(0);
  const [hits, setHits] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [judgments, setJudgments] = useState<Judgment[]>([]);
  const [ropeAngle, setRopeAngle] = useState(0);
  const [isHolding, setIsHolding] = useState<0 | 1 | 2 | null>(null);
  
  const [comboBeat, setComboBeat] = useState(false);
  const [hitPulse, setHitPulse] = useState(false);

  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const notesRef = useRef<Note[]>([]);
  const currentScoreRef = useRef(0);
  const statsRef = useRef<{ maxCombo: number; misses: number; hits: number }>({ maxCombo: 0, misses: 0, hits: 0 });

  const isFever = combo >= 10;

  const finalizeToResult = () => {
    if (isAscending) return;
    setIsAscending(true);
    setTimeLeft(0);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    const totalAttempts = statsRef.current.hits + statsRef.current.misses;
    const stability = totalAttempts === 0 ? 0 : statsRef.current.hits / totalAttempts;
    onComplete({
      score: currentScoreRef.current,
      maxCombo: statsRef.current.maxCombo,
      misses: statsRef.current.misses,
      stability
    });
  };

  useEffect(() => {
    setMaxCombo(prev => {
      const next = combo > prev ? combo : prev;
      statsRef.current.maxCombo = next;
      return next;
    });
  }, [combo]);

  const triggerIntro = () => {
    initAudio();
    setIntroStep(1);
    setTimeout(() => {
        playTripleSuzuSound();
        setIntroStep(2);
        setRopeAngle(25);
        setTimeout(() => {
            setIntroStep(3);
            setRopeAngle(-25);
            setTimeout(() => {
                setIntroStep(4);
                setRopeAngle(0);
                setTimeout(() => {
                    setHasStarted(true);
                    lastTimeRef.current = performance.now();
                    requestRef.current = requestAnimationFrame(gameLoop);
                }, 700);
            }, 450);
        }, 450);
    }, 450);
  };

  const gameLoop = (time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    setTimeLeft(prev => {
      const newVal = prev - (deltaTime / 1000);
      if (newVal <= 0 && !isAscending) {
        setIsAscending(true);
        setTimeout(() => finalizeToResult(), 2000);
        return 0;
      }
      return newVal;
    });
    
    if (isAscending) return;

    spawnTimerRef.current += deltaTime;
    const spawnRate = isHolding !== null ? 70 : Math.max(120, 480 - (combo * 8)); 
    
    if (spawnTimerRef.current > spawnRate) {
      spawnTimerRef.current = 0;
      const lane = (isHolding !== null && Math.random() > 0.4) 
        ? isHolding 
        : Math.floor(Math.random() * 3) as 0 | 1 | 2;
        
      const rand = Math.random();
      const type = rand > 0.92 ? 'RARE' : rand > 0.7 ? 'BLUE' : 'NORMAL';

      notesRef.current.push({
        id: Math.random(),
        lane,
        y: -15,
        hit: false,
        type
      });
    }

    const baseSpeed = 0.095;
    const speedBoost = (combo * 0.001) + (isFever ? 0.05 : 0);
    
    notesRef.current = notesRef.current.map(n => ({
      ...n,
      y: n.y + ((baseSpeed + speedBoost) * deltaTime)
    })).filter(n => {
      if (n.y > 115 && !n.hit) {
        setMisses(prev => {
          const next = prev + 1;
          statsRef.current.misses = next;
          return next;
        });
        setCombo(0); 
        return false;
      }
      return n.y <= 115 && !n.hit;
    });

    setNotes([...notesRef.current]);

    if (hasStarted) {
        if (Math.abs(ropeAngle) > 0.5) setRopeAngle(prev => prev * 0.9);
        else setRopeAngle(0);
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const processHit = (note: Note, precision: 'PERFECT' | 'GREAT') => {
    note.hit = true;
    setHits(prev => {
      const next = prev + 1;
      statsRef.current.hits = next;
      return next;
    });
    const multMap = { 'NORMAL': 1, 'BLUE': 3, 'RARE': 5 };
    const coinMult = multMap[note.type];
    
    playCoinSound(coinMult, isFever);
    
    const basePoints = 100 * coinMult;
    const comboBonus = 1 + (Math.floor(combo / 5) * 0.2); 
    const feverBonus = isFever ? 2.5 : 1.0;
    const precisionBonus = precision === 'PERFECT' ? 1.2 : 1.0;
    const finalPoints = Math.floor(basePoints * offering.multiplier * comboBonus * feverBonus * precisionBonus);
    
    currentScoreRef.current += finalPoints;
    setScoreDisplay(currentScoreRef.current);
    
    setComboBeat(true);
    setHitPulse(true);
    setCombo(prev => prev + 1);
    
    setTimeout(() => {
      setComboBeat(false);
      setHitPulse(false);
    }, 120);

    const precisionText = precision === 'PERFECT' ? 'PERFECT!!' : 'GREAT!';
    const multiplierLabel = coinMult > 1 ? `X${coinMult} ` : '';

    const judgment: Judgment = {
      id: Math.random(),
      lane: note.lane,
      text: `${multiplierLabel}${precisionText}`,
      type: precision,
      isMultiplier: coinMult > 1
    };
    setJudgments(prev => [...prev, judgment]);

    setTimeout(() => {
      setJudgments(prev => prev.filter(j => j.id !== judgment.id));
    }, 800);
  };

  const handleInputStart = (lane: 0 | 1 | 2) => {
    if (!hasStarted || timeLeft <= 0) return;
    setIsHolding(lane);

    const hitZoneY = 85;
    const hitNoteIndex = notesRef.current.findIndex(n => n.lane === lane && !n.hit && Math.abs(n.y - hitZoneY) < 18);

    if (hitNoteIndex !== -1) {
       const note = notesRef.current[hitNoteIndex];
       const precision = Math.abs(note.y - hitZoneY) < 6 ? 'PERFECT' : 'GREAT';
       processHit(note, precision);
       notesRef.current.splice(hitNoteIndex, 1);
    }
  };

  const handleInputEnd = () => setIsHolding(null);

  useEffect(() => {
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, []);

  const ropeGradient = "repeating-linear-gradient(45deg, #b91c1c, #b91c1c 25px, #f8f8f8 25px, #f8f8f8 50px)";

  return (
    <div className={`relative w-full h-full bg-black overflow-hidden select-none touch-none transition-colors duration-500 ${isFever ? 'bg-red-950/20' : ''}`}>
      
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className={`absolute inset-0 transition-opacity duration-300 ${isFever ? 'bg-lime-400/5 opacity-100' : 'bg-transparent opacity-0'}`}></div>
         <div className={`scanlines transition-opacity ${isFever ? 'opacity-60' : 'opacity-30'}`}></div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#111_0%,#000_100%)]"></div>
      
      <div className={`absolute inset-0 transition-all duration-1000 pointer-events-none z-20 ${!hasStarted ? 'blur-lg opacity-40 scale-110' : 'blur-0 opacity-100 scale-100'}`}>
        <div className="absolute top-0 left-1/2" style={{ perspective: '1200px' }}>
          <div className={`origin-top transition-all duration-100 ease-out 
              ${hitPulse ? 'scale-[1.03] brightness-125' : 'scale-100 brightness-100'}`} 
              style={{ transform: `translateX(-50%) rotate(${ropeAngle}deg)` }}>
              <div className="w-10 h-[70vh] mx-auto relative flex flex-col items-center">
                <div className="w-full h-[65%] shadow-2xl relative overflow-hidden" style={{ background: ropeGradient }}>
                    {hitPulse && <div className="absolute inset-0 bg-white/20 animate-rope-pulse"></div>}
                </div>
                <div className="w-20 h-24 bg-[#4d1d0f] relative z-10 -mt-2 border-t border-amber-600/40 shadow-xl" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                    <div className="absolute inset-2 border border-amber-400/20" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500/30 font-black text-2xl">奉</div>
                </div>
                <div className="w-28 h-40 -mt-6 relative opacity-95">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-100 rounded-full shadow-inner border border-amber-300/20"></div>
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="absolute top-4 w-2 bg-amber-50/80 h-full origin-top" 
                          style={{ 
                            left: '50%', 
                            transform: `translateX(-50%) rotate(${(i - 9.5) * 5}deg)`,
                            height: `${80 + Math.random() * 25}%`
                          }}></div>
                    ))}
                </div>
              </div>
              <div className={`absolute top-[-40px] left-1/2 -translate-x-1/2 w-64 h-64 z-50 transition-transform duration-75 ${hitPulse ? 'scale-110' : 'scale-100'}`}>
                  <div className="w-full h-full bg-gradient-to-br from-[#ffd700] via-[#b8860b] to-[#4d1d0f] rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative flex items-center justify-center border-t border-white/25">
                    <div className="absolute top-8 left-14 w-16 h-16 bg-white/40 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-12 w-44 h-3 bg-black rounded-full shadow-inner"></div>
                    <div className="absolute bottom-9 left-10 w-10 h-10 bg-black rounded-full"></div>
                    <div className="absolute bottom-9 right-10 w-10 h-10 bg-black rounded-full"></div>
                    <div className="absolute bottom-12 left-14 w-14 h-3 bg-black"></div>
                    <div className="absolute bottom-12 right-14 w-14 h-3 bg-black"></div>
                    {hitPulse && <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping pointer-events-none"></div>}
                  </div>
              </div>
          </div>
        </div>
      </div>

      <div className={`absolute inset-0 flex items-end pb-8 px-2 z-10 transition-opacity duration-700 ${!hasStarted ? 'opacity-0' : 'opacity-100'}`}>
        {[0, 1, 2].map(lane => (
           <div key={lane}
             className="flex-1 h-full relative"
             onMouseDown={() => handleInputStart(lane as 0|1|2)}
             onMouseUp={handleInputEnd}
             onTouchStart={(e) => { e.preventDefault(); handleInputStart(lane as 0|1|2); }}
             onTouchEnd={handleInputEnd}
           >
             <div className={`absolute bottom-[10%] left-2 right-2 h-20 border-2 rounded-xl transition-all duration-100 
                ${isHolding === lane ? 'border-lime-400 bg-lime-400/40 scale-[1.08] shadow-[0_0_40px_rgba(204,255,0,0.6)]' : 'border-white/10 bg-white/5 opacity-40'}`}>
                {isHolding === lane && (
                    <>
                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 w-[4px] h-[85vh] origin-bottom 
                            bg-gradient-to-t from-lime-400 to-transparent animate-beam-up`}></div>
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-lime-400"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-lime-400"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-lime-400"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-lime-400"></div>
                    </>
                )}
             </div>
           </div>
        ))}
      </div>

      <div className={`absolute top-4 left-6 z-[60] transition-all ${isFever ? 'drop-shadow-[0_0_15px_#ccff00]' : ''}`}>
        <div className="text-left select-none">
          <div className={`text-[10px] font-black tracking-[0.2em] uppercase ${isFever ? 'text-lime-400 animate-pulse' : 'text-gray-500'}`}>
            <span onClick={onBack} className="cursor-pointer px-1">&lt;</span>{isFever ? 'FEVER_SCORE' : 'RITUAL_SCORE'}
          </div>
          <div className={`text-4xl font-black italic tabular-nums leading-none transition-colors ${isFever ? 'text-lime-400' : 'text-white'}`}>
             {scoreDisplay.toLocaleString()}
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-6 z-[60] text-right">
        <div className="text-right select-none">
          <div className="text-[10px] text-gray-500 font-black tracking-[0.2em] uppercase">
            SYNC_TIME<span onClick={finalizeToResult} className="cursor-pointer px-1">&gt;</span>
          </div>
          <div className={`text-3xl font-black tabular-nums leading-none ${timeLeft < 5 || isFever ? 'text-red-500 animate-pulse' : 'text-white'}`}>
             {timeLeft.toFixed(2)}
          </div>
        </div>
      </div>

      {combo > 3 && (
        <div className="absolute top-[35%] left-0 right-0 z-[50] pointer-events-none flex flex-col items-center">
           {comboBeat && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-lime-400 rounded-full animate-ritual-ring pointer-events-none opacity-0"></div>
           )}
           <div className="relative animate-gentle-float">
              {isFever && comboBeat && (
                  <div className="absolute inset-0 text-7xl md:text-8xl font-black italic text-lime-400 opacity-40 blur-sm animate-ping-once tracking-tighter">
                    {combo}
                  </div>
              )}
              <div className={`relative transition-all duration-100 ${comboBeat ? 'scale-[1.3] brightness-125' : 'scale-100'}`}>
                 <div className={`text-7xl md:text-8xl font-black italic text-white tracking-tighter leading-none select-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-all
                   ${isFever ? 'text-lime-400 drop-shadow-[0_0_35px_#ccff00] animate-ritual-glitch' : ''}`}>
                   {combo}
                 </div>
              </div>
           </div>
           <div className={`relative mt-3 px-8 py-2 border-4 overflow-hidden transition-all duration-300 animate-gentle-float
             ${isFever ? 'bg-lime-400 text-black border-white shadow-[0_0_25px_#ccff00] skew-x-[-12deg]' : 'bg-black text-lime-400 border-lime-400'}`}>
             <div className={`absolute top-0 right-0 w-3 h-3 translate-x-1/2 -translate-y-1/2 rotate-45 ${isFever ? 'bg-white' : 'bg-lime-400'}`}></div>
             <div className="text-xl md:text-2xl font-black italic tracking-[0.2em] uppercase leading-none">
               {isFever ? 'FEVER MODE' : 'COMBO'}
             </div>
           </div>
        </div>
      )}

      <div className={!hasStarted ? 'opacity-0' : 'opacity-100 transition-opacity'}>
        {notes.map(note => (
          <div key={note.id} className="absolute z-30 pointer-events-none"
                style={{ left: `${(note.lane * 33.33) + 16.66}%`, top: `${note.y}%`, transform: 'translate(-50%, -50%)' }}>
              <div className={`w-16 h-16 flex items-center justify-center transition-transform ${isFever ? 'scale-110' : ''}`}>
                <div className={`absolute inset-0 rounded-full border-[5px] shadow-[0_0_20px_currentColor] flex flex-col items-center justify-center overflow-hidden
                    ${note.type === 'RARE' ? 'border-cyan-400 bg-cyan-950 text-cyan-200' : 
                      note.type === 'BLUE' ? 'border-fuchsia-500 bg-fuchsia-950 text-fuchsia-200' : 
                      'border-yellow-400 bg-yellow-950 text-yellow-200'}`}>
                    
                    {/* Base Logo Cutout Line - Adjusted to be thinner (6% height) */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-[6%] bg-current shadow-[0_0_10px_currentColor]"></div>
                    {isFever && <Zap size={10} className="text-white mt-1 animate-pulse relative z-10" />}
                </div>
              </div>
          </div>
        ))}
      </div>

      {!hasStarted && !isAscending && (
        <div className="absolute inset-0 z-[250] bg-transparent flex flex-col items-center justify-center cursor-pointer" onClick={triggerIntro}>
           <div className={`absolute top-[45%] w-full flex justify-between pointer-events-none transition-all duration-700 
             ${introStep === 0 ? 'px-4 opacity-100' : 'px-24 opacity-100'}`}>
              <Hand className={`text-lime-400 drop-shadow-[0_0_20px_#ccff00] transition-all duration-400 
                ${introStep === 2 ? '-translate-y-12 rotate-12 scale-110' : introStep === 4 ? 'translate-y-8 scale-90' : ''}`} 
                size={100} />
              <Hand className={`text-lime-400 drop-shadow-[0_0_20px_#ccff00] transition-all duration-400 transform scale-x-[-1] 
                ${introStep === 3 ? '-translate-y-12 -rotate-12 scale-110' : introStep === 4 ? 'translate-y-8 scale-90' : ''}`} 
                size={100} />
           </div>
           <div className={`flex flex-col items-center transition-all duration-500 ${introStep > 0 ? 'opacity-0 scale-125' : 'opacity-100 scale-100'}`}>
              <div className="relative mb-6 inline-block">
                <h2 className="text-5xl font-black italic text-white tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]">GRAB ROPE</h2>
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-lime-400 shadow-[0_0_15px_#ccff00]"></div>
              </div>
              <p className="text-lime-400 text-sm font-black font-mono tracking-[0.3em] uppercase animate-pulse">TAP TO START</p>
           </div>
        </div>
      )}

      {isAscending && (
        <div className="absolute inset-0 z-[300] bg-black flex flex-col items-center justify-center animate-fade-in">
           <div className="text-lime-400 font-black italic text-4xl tracking-tighter animate-bounce px-6 py-2 bg-black border-4 border-lime-400 shadow-[0_0_30px_#ccff00]">SYNCHRONIZING...</div>
        </div>
      )}

      <div 
        id="game-overlay"
        className="absolute inset-0 pointer-events-none overflow-hidden" 
        style={{ zIndex: 99999, isolation: 'isolate' }}
      >
        {judgments.map(j => (
          <div 
            key={j.id} 
            className="absolute animate-judgment-pop flex flex-col items-center"
            style={{ 
               left: `${(j.lane * 33.33) + 16.66}%`, 
               bottom: '25%', 
               width: '33.33%'
            }}
          >
            <div 
                 className={`font-black italic tracking-tighter whitespace-nowrap transition-all text-3xl md:text-4xl ${j.isMultiplier ? 'drop-shadow-[0_0_20px_rgba(255,204,0,0.8)]' : ''}`}
                 style={{ 
                    color: j.type === 'PERFECT' ? '#ffcc00' : '#ffffff',
                    filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
                    opacity: 1
                 }}
            >
              {j.text}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes judgment-pop {
          0% { transform: translateX(-50%) scale(1.3) translateY(0); opacity: 0; }
          10% { transform: translateX(-50%) scale(1.3) translateY(0); opacity: 1; }
          25% { transform: translateX(-50%) scale(1) translateY(-20px); opacity: 1; }
          100% { transform: translateX(-50%) scale(1) translateY(-120px); opacity: 0; }
        }
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes ritual-glitch {
          0%, 100% { transform: translate(0); filter: drop-shadow(0 0 15px #ccff00); }
          15% { transform: translate(-2px, 1px) skewX(3deg); filter: drop-shadow(-2px 0 #ccff00) drop-shadow(2px 0 #ff0055); }
          30% { transform: translate(2px, -1px); }
          45% { transform: translate(-1px, -2px) skewX(-3deg); }
          60% { transform: translate(1px, 1px); }
          75% { transform: translate(-1px, 0px); }
        }
        @keyframes ritual-ring {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 1; border-width: 8px; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; border-width: 1px; }
        }
        @keyframes ping-once {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes rope-pulse {
            0% { transform: translateY(100%); opacity: 0.8; }
            100% { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes beam-up {
            0% { transform: scaleX(1) scaleY(0); opacity: 1; }
            100% { transform: scaleX(0.5) scaleY(1); opacity: 0; }
        }
        .animate-rope-pulse {
            animation: rope-pulse 0.3s ease-out forwards;
        }
        .animate-beam-up {
            animation: beam-up 0.4s ease-out forwards;
        }
        .animate-judgment-pop {
          animation: judgment-pop 0.85s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-gentle-float {
          animation: gentle-float 5s ease-in-out infinite;
        }
        .animate-ritual-glitch {
          animation: ritual-glitch 0.35s infinite alternate-reverse;
        }
        .animate-ritual-ring {
          animation: ritual-ring 0.35s cubic-bezier(0.1, 0.5, 0.5, 1) forwards;
        }
        .animate-ping-once {
          animation: ping-once 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
