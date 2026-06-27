export type BiomeType = 'grassland' | 'desert' | 'cave' | 'ocean' | 'nether' | 'snow' | 'flower' | 'sky' | 'night' | 'end';

export type Level = {
  id: number;
  title: string;
  biome: BiomeType;
  emoji: string;
  // Indices into the BOPOMOFO array (up to 4 per level)
  symbolIndices: number[];
  unlockRequirement: number; // 0 = always available
  colors: {
    bg: string;
    panel: string;
    blockPrimary: string;
    blockSecondary: string;
    accent: string;
  };
};

export const LEVELS: Level[] = [
  {
    id: 1,
    title: '草地村莊',
    biome: 'grassland',
    emoji: '🌿',
    symbolIndices: [0, 1, 2, 3], // ㄅㄆㄇㄈ
    unlockRequirement: 0,
    colors: {
      bg: '#2A3828',
      panel: '#3A4E35',
      blockPrimary: '#6B9E4A',
      blockSecondary: '#A07850',
      accent: '#E8C547',
    },
  },
  {
    id: 2,
    title: '麥田農場',
    biome: 'grassland',
    emoji: '🌾',
    symbolIndices: [4, 5, 6, 7], // ㄉㄊㄋㄌ
    unlockRequirement: 1,
    colors: {
      bg: '#2E2E20',
      panel: '#48442A',
      blockPrimary: '#C4A840',
      blockSecondary: '#6B9E4A',
      accent: '#D9935A',
    },
  },
  {
    id: 3,
    title: '橡木森林',
    biome: 'cave',
    emoji: '🪨',
    symbolIndices: [8, 9, 10, 11], // ㄍㄎㄏㄐ (4 symbols)
    unlockRequirement: 2,
    colors: {
      bg: '#252520',
      panel: '#383830',
      blockPrimary: '#7A7060',
      blockSecondary: '#5A9A5A',
      accent: '#9AD45A',
    },
  },
  {
    id: 4,
    title: '沙漠神廟',
    biome: 'desert',
    emoji: '🏜',
    symbolIndices: [12, 13, 14, 15], // ㄑㄒㄓㄔ
    unlockRequirement: 3,
    colors: {
      bg: '#2E2815',
      panel: '#48401E',
      blockPrimary: '#C4A040',
      blockSecondary: '#D9935A',
      accent: '#E8C547',
    },
  },
  {
    id: 5,
    title: '沙漠金字塔',
    biome: 'desert',
    emoji: '🔺',
    symbolIndices: [16, 17, 18, 19], // ㄕㄖㄗㄘ
    unlockRequirement: 4,
    colors: {
      bg: '#2E2210',
      panel: '#483818',
      blockPrimary: '#C09040',
      blockSecondary: '#C06040',
      accent: '#E8A040',
    },
  },
  {
    id: 6,
    title: '冰雪村莊',
    biome: 'snow',
    emoji: '❄️',
    symbolIndices: [20, 21, 22, 23], // ㄙㄧㄨㄩ
    unlockRequirement: 5,
    colors: {
      bg: '#1E2838',
      panel: '#2A3848',
      blockPrimary: '#7090B8',
      blockSecondary: '#9AB8D4',
      accent: '#6BBFD4',
    },
  },
  {
    id: 7,
    title: '花園世界',
    biome: 'flower',
    emoji: '🌸',
    symbolIndices: [24, 25, 26, 27], // ㄚㄛㄜㄝ
    unlockRequirement: 6,
    colors: {
      bg: '#28202E',
      panel: '#3A2A42',
      blockPrimary: '#A06890',
      blockSecondary: '#7A9A60',
      accent: '#D498B8',
    },
  },
  {
    id: 8,
    title: '地獄要塞',
    biome: 'nether',
    emoji: '🌋',
    symbolIndices: [28, 29, 30, 31], // ㄞㄟㄠㄡ
    unlockRequirement: 7,
    colors: {
      bg: '#2A1818',
      panel: '#401C1C',
      blockPrimary: '#A84030',
      blockSecondary: '#C06840',
      accent: '#E8804A',
    },
  },
  {
    id: 9,
    title: '海底世界',
    biome: 'ocean',
    emoji: '🌊',
    symbolIndices: [32, 33, 34, 35], // ㄢㄣㄤㄥ
    unlockRequirement: 8,
    colors: {
      bg: '#151E2E',
      panel: '#1C2C42',
      blockPrimary: '#2868A0',
      blockSecondary: '#40A080',
      accent: '#6BBFD4',
    },
  },
  {
    id: 10,
    title: '終界之塔',
    biome: 'end',
    emoji: '💎',
    symbolIndices: [36, 21, 22, 23], // ㄦㄧㄨㄩ (ㄦ + medial review)
    unlockRequirement: 9,
    colors: {
      bg: '#18151E',
      panel: '#242030',
      blockPrimary: '#6848A0',
      blockSecondary: '#4840A0',
      accent: '#A870D8',
    },
  },
];

export function getLevelById(id: number): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}
