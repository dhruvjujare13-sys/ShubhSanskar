export type LetterCard = { letter: string; word: string; meaning: string; emoji: string };

export const letterCards: LetterCard[] = [
  { letter: "अ", word: "अनार", meaning: "Anaar (Pomegranate)", emoji: "🍎" },
  { letter: "आ", word: "आम", meaning: "Aam (Mango)", emoji: "🥭" },
  { letter: "इ", word: "इमली", meaning: "Imli (Tamarind)", emoji: "🌰" },
  { letter: "ई", word: "ईख", meaning: "Eekh (Sugarcane)", emoji: "🎋" },
  { letter: "उ", word: "उल्लू", meaning: "Ullu (Owl)", emoji: "🦉" },
  { letter: "ऊ", word: "ऊंट", meaning: "Oont (Camel)", emoji: "🐫" },
  { letter: "ए", word: "एक", meaning: "Ek (One)", emoji: "1️⃣" },
  { letter: "ऐ", word: "ऐनक", meaning: "Ainak (Glasses)", emoji: "👓" },
  { letter: "ओ", word: "ओम", meaning: "Om", emoji: "🕉️" },
  { letter: "औ", word: "औजार", meaning: "Auzaar (Tool)", emoji: "🔧" },
];

export type CountingQuestion = { emoji: string; count: number; options: number[] };

export const countingQuestions: CountingQuestion[] = [
  { emoji: "🍓", count: 3, options: [2, 3, 4] },
  { emoji: "⭐", count: 5, options: [4, 5, 6] },
  { emoji: "🎈", count: 2, options: [1, 2, 3] },
  { emoji: "🐶", count: 4, options: [3, 4, 5] },
  { emoji: "🌸", count: 6, options: [5, 6, 7] },
  { emoji: "🚗", count: 1, options: [1, 2, 3] },
];
