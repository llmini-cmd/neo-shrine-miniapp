
import React, { useState } from 'react';
import { CyberButton } from './CyberButton';
import { Box } from 'lucide-react';
import { CyberTorii } from './CyberTorii';
import { COPY } from '../constants';

interface ScreenGateProps {
  onEnter: () => void;
  onViewArena: () => void;
  lang: 'JP' | 'EN';
}

export const ScreenGate: React.FC<ScreenGateProps> = ({ onEnter, onViewArena, lang }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full relative z-10 p-6 overflow-hidden">
      {/* Symmetrical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      
      {/* Shifted the whole content block up by reducing bottom padding/margin and using a negative translate */}
      <div className="flex flex-col items-center scale-95 md:scale-100 mt-6">
        <div className="mb-10 text-center relative z-20 group cursor-default">
          {/* Logo Container - Symmetrical */}
          <div className="relative flex justify-center mb-6">
            <CyberTorii 
              className={`text-lime-400 transition-all duration-300 ${isHovering ? 'drop-shadow-[0_0_50px_#ccff00] scale-105' : 'drop-shadow-[0_0_20px_rgba(204,255,0,0.2)]'}`} 
              size={90} 
            />
          </div>
          
          {/* NEO SHRINE Branding - Full Glitch */}
          <div className="relative">
            <h1 
              className="text-7xl md:text-8xl font-black italic tracking-tighter leading-[0.85] select-none glitch-text"
              data-text="NEO"
              style={{ textShadow: '0 0 30px rgba(204, 255, 0, 0.4)' }}
            >
              NEO
            </h1>
            <h1 
              className="text-7xl md:text-8xl font-black italic tracking-tighter leading-[0.85] select-none glitch-text"
              data-text="SHRINE"
              style={{ textShadow: '0 0 30px rgba(204, 255, 0, 0.4)' }}
            >
              SHRINE
            </h1>
          </div>
          
          {/* Blinking Protocol Text */}
          <div className="flex items-center justify-center mt-6 animate-pulse">
            <div className="bg-lime-900/30 border border-lime-500/30 text-lime-400 text-[12px] font-bold px-6 py-1.5 tracking-[0.2em] uppercase">
              SELECT // THROW // PLAY // RECEIVE
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs relative z-30">
          <div 
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <CyberButton onClick={onEnter} className="w-full text-xl py-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] border-4 border-lime-400">
              <span className={`${isHovering ? 'animate-pulse text-black' : ''}`}>{COPY[lang].start}</span>
            </CyberButton>
          </div>

          <button 
            onClick={onViewArena}
            className="w-full py-4 mt-2 bg-transparent border-2 border-gray-700 text-gray-500 hover:text-white hover:border-white transition-all font-black tracking-widest text-sm flex items-center justify-center gap-2 uppercase clip-corner"
          >
            <Box size={18} />
            <span>COLLECTION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
