
import React, { useState } from 'react';
import { GameState, OfferingOption, Language, OmikujiResult, GameStats } from './types';
import { OFFERINGS } from './constants';
import { ScreenGate } from './components/ScreenGate';
import { ScreenOffering } from './components/ScreenOffering';
import { ScreenGame } from './components/ScreenGame';
import { ScreenResult } from './components/ScreenResult';
import { ScreenArena } from './components/ScreenArena';
import { Battery, Wifi, Globe } from 'lucide-react';

export default function App() {
  const [currentState, setCurrentState] = useState<GameState>(GameState.GATE);
  const [selectedOffering, setSelectedOffering] = useState<OfferingOption>(OFFERINGS[0]);
  const [lastStats, setLastStats] = useState<GameStats>({ score: 0, maxCombo: 0, misses: 0, stability: 0 });
  const [language, setLanguage] = useState<Language>('EN');
  const [arenaSelectedId, setArenaSelectedId] = useState<string | null>(null);
  
  // Inventory State
  const [myItems, setMyItems] = useState<OmikujiResult[]>([]);

  const transitionTo = (state: GameState) => {
    setCurrentState(state);
  };

  const handleSaveItem = (item: OmikujiResult) => {
    setMyItems(prev => [item, ...prev]);
  };

  return (
    <div className="relative w-full h-screen bg-[#0B0D10] text-white overflow-hidden flex flex-col items-center justify-center">
      
      {/* Global CSS Effects */}
      <div className="scanlines"></div>
      <div className="noise"></div>

      {/* Main Container */}
      <div className="relative w-full h-full max-w-md bg-[#0f1115] shadow-2xl overflow-hidden flex flex-col border-x border-gray-900">
        
        {/* Status Bar */}
        <div className="h-8 bg-black/80 flex items-center justify-between px-4 z-50 border-b border-gray-800 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-mono text-gray-400">OMIKUJI MODE</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
             <button onClick={() => setLanguage(prev => prev === 'EN' ? 'JP' : 'EN')} className="hover:text-white transition-colors">
                <Globe size={12} />
             </button>
             <Wifi size={12} />
             <Battery size={12} />
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 relative overflow-hidden">
          {currentState === GameState.GATE && (
            <ScreenGate 
              onEnter={() => transitionTo(GameState.OFFERING)} 
              onViewArena={() => {
                setArenaSelectedId(null);
                transitionTo(GameState.ARENA);
              }}
              lang={language} 
            />
          )}
          {currentState === GameState.OFFERING && (
            <ScreenOffering 
              onSelect={(opt) => {
                setSelectedOffering(opt);
                transitionTo(GameState.GAME);
              }} 
              onBack={() => transitionTo(GameState.GATE)}
              lang={language}
            />
          )}
          {currentState === GameState.GAME && (
            <ScreenGame 
              offering={selectedOffering} 
              onComplete={(stats) => {
                setLastStats(stats);
                transitionTo(GameState.RESULT);
              }}
              onBack={() => transitionTo(GameState.OFFERING)}
              lang={language}
            />
          )}
          {currentState === GameState.RESULT && (
            <ScreenResult 
              stats={lastStats} 
              offering={selectedOffering} 
              onReset={() => transitionTo(GameState.GATE)}
              onSave={handleSaveItem}
              lang={language}
              onNavigateArena={(selectedId) => {
                setArenaSelectedId(selectedId ?? null);
                transitionTo(GameState.ARENA);
              }}
            />
          )}
          {currentState === GameState.ARENA && (
            <ScreenArena 
              onBack={() => transitionTo(GameState.GATE)} 
              lang={language} 
              myItems={myItems}
              onUpdateItems={setMyItems}
              initialSelectedId={arenaSelectedId ?? undefined}
            />
          )}
        </div>

      </div>
    </div>
  );
}
