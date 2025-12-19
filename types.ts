export enum GameState {
  GATE = 'GATE',
  OFFERING = 'OFFERING',
  GAME = 'GAME',
  RESULT = 'RESULT',
  ARENA = 'ARENA'
}

export enum Rarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  LEGENDARY = 'LEGENDARY'
}

export interface GameStats {
  score: number;
  maxCombo: number;
  misses: number;
  stability: number; // 0..1
}

export interface OmikujiResult {
  id: string;
  characterName: string;
  rarity: Rarity;
  luck: string;
  resultEn: string;
  resultJa: string;
  description: string;
  timestamp: number;
  imageUrl: string;
  tierId: string;
  isNew?: boolean;
}

export interface OfferingOption {
  id: string;
  label: string;
  subLabel: string;
  cost: number; // in simulated ETH/Points
  multiplier: number;
  color: string;
}

export type Language = 'JP' | 'EN';
