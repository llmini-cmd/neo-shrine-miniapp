
import React from 'react';
import { OfferingOption, Rarity, OmikujiResult } from './types';

// CLEARED COLLECTION: Initial state is now empty as requested
export const MOCK_COLLECTION: OmikujiResult[] = [];

export const OFFERINGS: OfferingOption[] = [
  {
    id: 'beginner',
    label: 'BEGINNER MODE',
    subLabel: 'ビギナーモード',
    cost: 0.000000001,
    multiplier: 1.0,
    color: 'border-gray-500'
  },
  {
    id: 'normal',
    label: 'NORMAL MODE',
    subLabel: 'ノーマルモード',
    cost: 0.0000001,
    multiplier: 5.0,
    color: 'border-lime-400'
  },
  {
    id: 'god',
    label: 'GOD MODE',
    subLabel: 'ゴッドーモード',
    cost: 0.000001,
    multiplier: 50.0,
    color: 'border-cyan-400'
  }
];

export const RARITY_COLORS: Record<Rarity, string> = {
  [Rarity.COMMON]: 'neo-rarity-common',
  [Rarity.RARE]: 'neo-rarity-rare',
  [Rarity.LEGENDARY]: 'neo-rarity-legendary'
};

export type OracleCardId =
  | 'MOON'
  | 'MUSUBI'
  | 'WHALE'
  | 'PUMP'
  | 'HODL'
  | 'L2'
  | 'WAGMI'
  | 'REKT';

export interface OracleCardDefinition {
  id: OracleCardId;
  rarity: Rarity;
  resultEn: string;
  resultJa: string;
  titleJa: string;
  description: string;
  imageUrl: string;
}

export const ORACLE_CARDS: OracleCardDefinition[] = [
  {
    id: 'MOON',
    rarity: Rarity.LEGENDARY,
    resultEn: 'GREAT FORTUNE',
    resultJa: '大吉',
    titleJa: '大吉 (MOON)',
    description:
      '親戚のおじさんが「ビットコインってまだあるのか？」と聞いた瞬間、あなたのポートフォリオが最高値を更新します。',
    imageUrl: '/assets/phase1/neo_shrine_phase1_moon_legendary_01.png'
  },
  {
    id: 'MUSUBI',
    rarity: Rarity.LEGENDARY,
    resultEn: 'LATE FORTUNE',
    resultJa: '末吉',
    titleJa: '末吉 (MUSUBI)',
    description:
      '書初めで「億り人」と書こうとしたら、インク切れで「億り…火」になってしまいました。ご先祖様がアップを始めました。',
    imageUrl: '/assets/phase1/neo_shrine_phase1_mint_legendary_01.png'
  },
  {
    id: 'WHALE',
    rarity: Rarity.RARE,
    resultEn: 'EXTREME FORTUNE',
    resultJa: '極吉',
    titleJa: '極吉 (WHALE)',
    description:
      '寝ぼけてスマホをタップしたら、間違って国の予算規模の買い注文を出してしまいました。あなたは今日から相場の神です。',
    imageUrl: '/assets/phase1/neo_shrine_phase1_whale_rare_01.png'
  },
  {
    id: 'REKT',
    rarity: Rarity.RARE,
    resultEn: 'CURSE',
    resultJa: '凶',
    titleJa: '凶 (REKT)',
    description:
      '除夜の鐘を108回突くごとに、保有している草コインが1つずつ上場廃止になっていきます。煩悩と共に資産も消滅。',
    imageUrl: '/assets/phase1/neo_shrine_phase1_rekt_rare_01.png'
  },
  {
    id: 'HODL',
    rarity: Rarity.COMMON,
    resultEn: 'SMALL FORTUNE',
    resultJa: '小吉',
    titleJa: '小吉 (HODL)',
    description:
      '初詣の願い事が「ガス代無料」だったため、神様がプロトコル違反と判断し、あなたの願いはpending状態になりました。',
    imageUrl: '/assets/phase1/neo_shrine_phase1_hodl_common_01.png'
  },
  {
    id: 'PUMP',
    rarity: Rarity.COMMON,
    resultEn: 'MIDDLE FORTUNE',
    resultJa: '中吉',
    titleJa: '中吉 (PUMP)',
    description:
      'お年玉袋を開けたら、中には現金ではなく「秘密鍵」が入っていました。残高はガス代にも満たない額でした。',
    imageUrl: '/assets/phase1/neo_shrine_phase1_pump_common_01.png'
  },
  {
    id: 'L2',
    rarity: Rarity.COMMON,
    resultEn: 'LIGHT',
    resultJa: '光',
    titleJa: '光 (L2)',
    description:
      'Baseチェーンが快適すぎて、イーサリアムメインネットに戻った瞬間、ガス代の高さに失神しました。',
    imageUrl: '/assets/phase1/neo_shrine_phase1_l2_common_01.png'
  },
  {
    id: 'WAGMI',
    rarity: Rarity.COMMON,
    resultEn: 'FORTUNE',
    resultJa: '吉',
    titleJa: '吉 (WAGMI)',
    description:
      'サイバー鏡餅を飾ろうとしたら、一番上のみかんがNFTで、所有権がないため「右クリック保存」で代用しました。',
    imageUrl: '/assets/phase1/neo_shrine_phase1_wagmi_common_01.png'
  }
];

export const COPY = {
  JP: {
    start: "ENTER SHRINE",
    offeringTitle: "SELECT TRIBUTE",
    offeringSub: "俗世の資産を投げ入れ、デジタル神楽を舞え",
    tapToSync: "賽銭奉納 // OFFER TRIBUTE",
    score: "奉納点",
    mint: "おみくじ確定 // CONFIRM",
    back: "辞退 // LEAVE",
    rules: "教義 // PROTOCOLS",
    arena: "奉納コレクション // COLLECTION",
    fortune: "神託 // ORACLE",
    luckyItem: "ラッキーアイテム",
    tieFortune: "おみくじ確定 // CONFIRM",
    viewArena: "COLLECTION",
    synthesis: "御霊合わせ // SYNTHESIS",
    sell: "電子売却 // LIQUIDATE"
  },
  EN: {
    start: "ENTER SHRINE",
    offeringTitle: "SELECT TRIBUTE",
    offeringSub: "Throw in assets, Initiate the Ritual Dance",
    tapToSync: "OFFER TRIBUTE // PRAY",
    score: "RITUAL SCORE",
    mint: "CONFIRM // OMIKUJI",
    back: "LEAVE // DECLINE",
    rules: "PROTOCOLS",
    arena: "THE COLLECTION",
    fortune: "ORACLE SAYS",
    luckyItem: "LUCKY ITEM",
    tieFortune: "CONFIRM // OMIKUJI",
    viewArena: "COLLECTION",
    synthesis: "FUSION // SYNTHESIS",
    sell: "LIQUIDATE // SELL"
  }
};
