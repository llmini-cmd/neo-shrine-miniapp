
import React, { useState, useEffect } from 'react';
import { Language, OmikujiResult, Rarity } from '../types';
import { COPY, MOCK_COLLECTION } from '../constants';
// Added Box to the imports from lucide-react
import { Box, Trash2, X } from 'lucide-react';

interface ScreenArenaProps {
  onBack: () => void;
  lang: Language;
  myItems: OmikujiResult[];
  onUpdateItems: (items: OmikujiResult[]) => void;
  initialSelectedId?: string;
}

export const ScreenArena: React.FC<ScreenArenaProps> = ({ onBack, lang, myItems, onUpdateItems, initialSelectedId }) => {
  const [tab, setTab] = useState<'COLLECTION' | 'SYNTHESIS'>('COLLECTION');
  const [displayItems, setDisplayItems] = useState<OmikujiResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<OmikujiResult | null>(null);

  const selectedLuckMatch = selectedItem ? /^(.+?)\s*\(([^)]+)\)\s*$/.exec(selectedItem.luck) : null;
  const selectedLuckMain = (selectedLuckMatch?.[1] ?? selectedItem?.luck ?? '').trim();
  const selectedLuckTag = (selectedLuckMatch?.[2] ?? '').trim();
  const selectedLuckTextClass = !selectedItem
    ? ''
    : selectedItem.rarity === Rarity.LEGENDARY
      ? 'neo-gradient-text--legendary'
      : selectedItem.rarity === Rarity.RARE
        ? 'neo-gradient-text--rare'
        : 'neo-gradient-text--common';

  useEffect(() => {
     // Combine user items with mock collection (mock is empty now)
     setDisplayItems([...myItems, ...MOCK_COLLECTION]);
  }, [myItems]);

  useEffect(() => {
    if (!initialSelectedId) return;
    const item = displayItems.find(i => i.id === initialSelectedId);
    if (item) setSelectedItem(item);
  }, [initialSelectedId, displayItems]);

  const handleSell = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("LIQUIDATE ASSET? This cannot be undone.")) {
      onUpdateItems(myItems.filter(i => i.id !== id));
      alert("SOLD (Simulated)");
    }
  };

  return (
    <div className="flex flex-col h-full relative z-10 bg-black">
      {/* Header -> Keep original colors (LIME-400) */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/90 backdrop-blur sticky top-0 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <button onClick={onBack} className="text-gray-500 hover:text-white flex items-center gap-1 font-bold text-xs uppercase tracking-widest">
              &lt; BACK
           </button>
           <h2 className="text-2xl font-black italic tracking-tighter uppercase neo-gradient-text neo-gradient-text--common">
             {COPY[lang].arena}
           </h2>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setTab('COLLECTION')}
             className={`text-xs font-bold pb-1 border-b-2 transition-colors ${tab === 'COLLECTION' ? 'text-lime-400 border-lime-400' : 'text-gray-600 border-transparent'}`}
           >
             COLLECTION
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 relative bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000_100%)]">
        {displayItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-40">
            <Box size={48} className="mb-4 text-gray-500" />
            <p className="text-xs font-mono uppercase tracking-widest text-gray-500">Collection Empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-20">
               {displayItems.map((item) => (
                  /* NFT Grid item box -> WHITE border */
                  <div
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className={`p-[2px] relative group cursor-pointer hover:scale-[1.02] transition-transform clip-corner ${item.rarity === Rarity.LEGENDARY ? 'neo-border-legendary' : item.rarity === Rarity.RARE ? 'neo-border-rare' : 'neo-border-common'}`}
                  >
                     <div className="bg-gray-900 p-1 clip-corner">
                       <div className="aspect-[3/4] bg-black overflow-hidden relative clip-corner">
                          <img src={item.imageUrl} className="w-full h-full object-cover" alt="Oracle Card" />
                        
                          {/* Grid Item Gradient */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/40 to-transparent pt-6 pb-1.5 px-1.5">
                            <div
                              className={`text-[9px] font-bold uppercase truncate neo-gradient-text ${
                                item.rarity === Rarity.LEGENDARY
                                  ? 'neo-gradient-text--legendary'
                                  : item.rarity === Rarity.RARE
                                    ? 'neo-gradient-text--rare'
                                    : 'neo-gradient-text--common'
                              }`}
                            >
                              {item.luck}
                            </div>
                          </div>
                       </div>
                       <div className="flex justify-between mt-1 px-1">
                          <span className="text-[9px] text-gray-500 font-mono">#{item.id.split('-')[1]}</span>
                          {myItems.find(i => i.id === item.id) && (
                             <button onClick={(e) => handleSell(e, item.id)} className="text-[10px] text-red-500 hover:text-red-400"><Trash2 size={10} /></button>
                          )}
                       </div>
                     </div>
                  </div>
                ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col p-6 animate-fade-in overflow-y-auto">
           <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white z-50">
              <X size={28} />
           </button>
           
           <div className="mt-4 flex flex-col items-center">
              <div className={`w-full max-w-xs p-[3px] clip-corner ${selectedItem.rarity === Rarity.LEGENDARY ? 'neo-border-legendary' : selectedItem.rarity === Rarity.RARE ? 'neo-border-rare' : 'neo-border-common'}`}>
                <div className="bg-black p-1.5 clip-corner relative overflow-hidden">
                  <img src={selectedItem.imageUrl} className="w-full aspect-[3/4] object-cover clip-corner" alt="Oracle Card" />
                 
                  {/* Internal Gradient for consistency with revealed card */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-b from-transparent via-black/80 to-black pt-16 pb-4 px-5 pointer-events-none">
                     <h3 className={`text-lg font-black italic tracking-tighter uppercase mb-1 neo-gradient-text ${selectedLuckTextClass}`}>
                       {selectedLuckMain}
                       {selectedLuckTag ? ` (${selectedLuckTag})` : ''}
                     </h3>
                  </div>
                </div>
              </div>
              
              <div className="w-full max-w-xs mt-6 text-center">
                 <div className={`inline-block px-3 py-1 font-black italic text-[10px] text-black mb-4 uppercase ${selectedItem.rarity === Rarity.LEGENDARY ? 'bg-fuchsia-500' : selectedItem.rarity === Rarity.RARE ? 'bg-cyan-400' : 'bg-white'}`}>
                    {selectedItem.rarity}
                 </div>
                 
                 {/* Detail content with smaller font and fade background */}
                 <div className="bg-gradient-to-b from-transparent to-gray-900/20 p-4 rounded-b-xl border-t border-gray-800/30">
                    <p className="text-gray-300 font-jp text-[12px] leading-relaxed italic opacity-90">
                       {selectedItem.description}
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-6 text-left text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                    <div className="border-l border-gray-800 pl-2">
                       <div className="text-gray-700 mb-0.5">TOKEN ID</div>
                       <div className="text-gray-400">{selectedItem.id}</div>
                    </div>
                    <div className="border-l border-gray-800 pl-2">
                       <div className="text-gray-700 mb-0.5">CONFIRMED</div>
                       <div className="text-gray-400">{new Date(selectedItem.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div className="border-l border-gray-800 pl-2">
                       <div className="text-gray-700 mb-0.5">SERIES</div>
                       <div className="text-gray-400">{selectedItem.characterName.split(' ')[0]}</div>
                    </div>
                    <div className="border-l border-gray-800 pl-2">
                       <div className="text-gray-700 mb-0.5">NETWORK</div>
                       <div className="text-gray-400">NEO SHRINE</div>
                    </div>
                 </div>

              </div>
           </div>
        </div>
      )}
    </div>
  );
};
