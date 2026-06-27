export type BopomofoSymbol = {
  symbol: string;
  romanization: string;
  type: 'consonant' | 'medial' | 'vowel';
  exampleWord: string;
  emoji: string;
  blockColor: string;
  ttsText: string;
};

export const BOPOMOFO: BopomofoSymbol[] = [
  // ── CONSONANTS ──────────────────────────────────────────────────
  {
    symbol: 'ㄅ', romanization: 'b', type: 'consonant',
    exampleWord: '爸爸', emoji: '👨',
    blockColor: '#5B8EC9',
    ttsText: 'ㄅ，爸爸的爸',
  },
  {
    symbol: 'ㄆ', romanization: 'p', type: 'consonant',
    exampleWord: '葡萄', emoji: '🍇',
    blockColor: '#8470C4',
    ttsText: 'ㄆ，葡萄的葡',
  },
  {
    symbol: 'ㄇ', romanization: 'm', type: 'consonant',
    exampleWord: '媽媽', emoji: '👩',
    blockColor: '#C4809A',
    ttsText: 'ㄇ，媽媽的媽',
  },
  {
    symbol: 'ㄈ', romanization: 'f', type: 'consonant',
    exampleWord: '飛機', emoji: '✈️',
    blockColor: '#7BA8C4',
    ttsText: 'ㄈ，飛機的飛',
  },
  // ─
  {
    symbol: 'ㄉ', romanization: 'd', type: 'consonant',
    exampleWord: '蛋糕', emoji: '🎂',
    blockColor: '#C49060',
    ttsText: 'ㄉ，蛋糕的蛋',
  },
  {
    symbol: 'ㄊ', romanization: 't', type: 'consonant',
    exampleWord: '兔子', emoji: '🐰',
    blockColor: '#B0B0C4',
    ttsText: 'ㄊ，兔子的兔',
  },
  {
    symbol: 'ㄋ', romanization: 'n', type: 'consonant',
    exampleWord: '牛奶', emoji: '🥛',
    blockColor: '#C4B87A',
    ttsText: 'ㄋ，牛奶的牛',
  },
  {
    symbol: 'ㄌ', romanization: 'l', type: 'consonant',
    exampleWord: '老虎', emoji: '🐯',
    blockColor: '#C49050',
    ttsText: 'ㄌ，老虎的老',
  },
  // ─
  {
    symbol: 'ㄍ', romanization: 'g', type: 'consonant',
    exampleWord: '狗狗', emoji: '🐶',
    blockColor: '#A07050',
    ttsText: 'ㄍ，狗狗的狗',
  },
  {
    symbol: 'ㄎ', romanization: 'k', type: 'consonant',
    exampleWord: '恐龍', emoji: '🦕',
    blockColor: '#5A9A5A',
    ttsText: 'ㄎ，恐龍的恐',
  },
  {
    symbol: 'ㄏ', romanization: 'h', type: 'consonant',
    exampleWord: '蝴蝶', emoji: '🦋',
    blockColor: '#C47090',
    ttsText: 'ㄏ，蝴蝶的蝴',
  },
  // ─
  {
    symbol: 'ㄐ', romanization: 'j', type: 'consonant',
    exampleWord: '雞蛋', emoji: '🥚',
    blockColor: '#C4AA40',
    ttsText: 'ㄐ，雞蛋的雞',
  },
  {
    symbol: 'ㄑ', romanization: 'q', type: 'consonant',
    exampleWord: '青蛙', emoji: '🐸',
    blockColor: '#5A9450',
    ttsText: 'ㄑ，青蛙的青',
  },
  {
    symbol: 'ㄒ', romanization: 'x', type: 'consonant',
    exampleWord: '西瓜', emoji: '🍉',
    blockColor: '#C4504A',
    ttsText: 'ㄒ，西瓜的西',
  },
  // ─
  {
    symbol: 'ㄓ', romanization: 'zh', type: 'consonant',
    exampleWord: '蜘蛛', emoji: '🕷️',
    blockColor: '#706870',
    ttsText: 'ㄓ，蜘蛛的蜘',
  },
  {
    symbol: 'ㄔ', romanization: 'ch', type: 'consonant',
    exampleWord: '車子', emoji: '🚗',
    blockColor: '#C45050',
    ttsText: 'ㄔ，車子的車',
  },
  {
    symbol: 'ㄕ', romanization: 'sh', type: 'consonant',
    exampleWord: '獅子', emoji: '🦁',
    blockColor: '#C0A040',
    ttsText: 'ㄕ，獅子的獅',
  },
  {
    symbol: 'ㄖ', romanization: 'r', type: 'consonant',
    exampleWord: '日出', emoji: '🌅',
    blockColor: '#C46040',
    ttsText: 'ㄖ，日出的日',
  },
  // ─
  {
    symbol: 'ㄗ', romanization: 'z', type: 'consonant',
    exampleWord: '字典', emoji: '📖',
    blockColor: '#5868C0',
    ttsText: 'ㄗ，字典的字',
  },
  {
    symbol: 'ㄘ', romanization: 'c', type: 'consonant',
    exampleWord: '草莓', emoji: '🍓',
    blockColor: '#C4507A',
    ttsText: 'ㄘ，草莓的草',
  },
  {
    symbol: 'ㄙ', romanization: 's', type: 'consonant',
    exampleWord: '松鼠', emoji: '🐿️',
    blockColor: '#8A6040',
    ttsText: 'ㄙ，松鼠的松',
  },
  // ── MEDIALS ─────────────────────────────────────────────────────
  {
    symbol: 'ㄧ', romanization: 'i', type: 'medial',
    exampleWord: '一', emoji: '1️⃣',
    blockColor: '#C4AA40',
    ttsText: 'ㄧ，一的ㄧ',
  },
  {
    symbol: 'ㄨ', romanization: 'u', type: 'medial',
    exampleWord: '烏龜', emoji: '🐢',
    blockColor: '#3C6060',
    ttsText: 'ㄨ，烏龜的烏',
  },
  {
    symbol: 'ㄩ', romanization: 'ü', type: 'medial',
    exampleWord: '魚', emoji: '🐟',
    blockColor: '#40A8B0',
    ttsText: 'ㄩ，魚的ㄩ',
  },
  // ── VOWELS ──────────────────────────────────────────────────────
  {
    symbol: 'ㄚ', romanization: 'a', type: 'vowel',
    exampleWord: '阿嬤', emoji: '👵',
    blockColor: '#C48040',
    ttsText: 'ㄚ，阿嬤的阿',
  },
  {
    symbol: 'ㄛ', romanization: 'o', type: 'vowel',
    exampleWord: '喔', emoji: '😮',
    blockColor: '#C05840',
    ttsText: 'ㄛ，喔喔喔',
  },
  {
    symbol: 'ㄜ', romanization: 'e', type: 'vowel',
    exampleWord: '鱷魚', emoji: '🐊',
    blockColor: '#506840',
    ttsText: 'ㄜ，鱷魚的鱷',
  },
  {
    symbol: 'ㄝ', romanization: 'ê', type: 'vowel',
    exampleWord: '耶', emoji: '🎉',
    blockColor: '#C068A0',
    ttsText: 'ㄝ，耶耶耶',
  },
  {
    symbol: 'ㄞ', romanization: 'ai', type: 'vowel',
    exampleWord: '愛心', emoji: '❤️',
    blockColor: '#C04870',
    ttsText: 'ㄞ，愛心的愛',
  },
  {
    symbol: 'ㄟ', romanization: 'ei', type: 'vowel',
    exampleWord: '黑色', emoji: '⬛',
    blockColor: '#404858',
    ttsText: 'ㄟ，黑色的黑',
  },
  {
    symbol: 'ㄠ', romanization: 'ao', type: 'vowel',
    exampleWord: '貓咪', emoji: '🐱',
    blockColor: '#C07840',
    ttsText: 'ㄠ，貓咪的貓',
  },
  {
    symbol: 'ㄡ', romanization: 'ou', type: 'vowel',
    exampleWord: '狗', emoji: '🐕',
    blockColor: '#805838',
    ttsText: 'ㄡ，狗的ㄡ',
  },
  {
    symbol: 'ㄢ', romanization: 'an', type: 'vowel',
    exampleWord: '山', emoji: '⛰️',
    blockColor: '#787878',
    ttsText: 'ㄢ，山的ㄢ',
  },
  {
    symbol: 'ㄣ', romanization: 'en', type: 'vowel',
    exampleWord: '門', emoji: '🚪',
    blockColor: '#806848',
    ttsText: 'ㄣ，門的ㄣ',
  },
  {
    symbol: 'ㄤ', romanization: 'ang', type: 'vowel',
    exampleWord: '糖果', emoji: '🍬',
    blockColor: '#C090A0',
    ttsText: 'ㄤ，糖果的糖',
  },
  {
    symbol: 'ㄥ', romanization: 'eng', type: 'vowel',
    exampleWord: '燈', emoji: '💡',
    blockColor: '#B0A040',
    ttsText: 'ㄥ，燈的ㄥ',
  },
  {
    symbol: 'ㄦ', romanization: 'er', type: 'vowel',
    exampleWord: '耳朵', emoji: '👂',
    blockColor: '#A08060',
    ttsText: 'ㄦ，耳朵的耳',
  },
];

export const BOPOMOFO_MAP: Record<string, BopomofoSymbol> = Object.fromEntries(
  BOPOMOFO.map((b) => [b.symbol, b])
);
