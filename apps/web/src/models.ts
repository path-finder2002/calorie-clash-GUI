export type Hand = 'rock' | 'paper' | 'scissors';

export interface FoodCard {
  id: string;
  hand: Hand;
  name: string;
  points: number; // 文字数など
  satiety: number; // 満腹加算
}

export interface GameRule {
  targetPoints: 30 | 40 | 50;
  physique: 800 | 1000 | 1300;
  tieRule: 'no_count' | 'satiety_plus_both';
  animation: boolean;
  sound: boolean;
  deck: FoodCard[];
  mode: 'original' | 'simple';
}

export interface GameScore {
  bestPoints: number;
}

export const defaultDeck: FoodCard[] = [
  { id: 'r1', hand: 'rock', name: 'グミ', points: 2, satiety: 60 },
  { id: 'r2', hand: 'rock', name: '餃子', points: 2, satiety: 120 },
  { id: 'r3', hand: 'rock', name: '唐揚げ', points: 3, satiety: 180 },
  { id: 's1', hand: 'scissors', name: 'サラダ', points: 3, satiety: 80 },
  { id: 's2', hand: 'scissors', name: '寿司', points: 2, satiety: 150 },
  { id: 's3', hand: 'scissors', name: 'そば', points: 2, satiety: 110 },
  { id: 'p1', hand: 'paper', name: 'パン', points: 1, satiety: 100 },
  { id: 'p2', hand: 'paper', name: 'パスタ', points: 3, satiety: 190 },
  { id: 'p3', hand: 'paper', name: 'プリン', points: 3, satiety: 140 },
];

export const defaultRule: GameRule = {
  targetPoints: 50,
  physique: 1000,
  tieRule: 'no_count',
  animation: false,
  sound: false,
  deck: defaultDeck,
  mode: 'original',
};

export const HAND_LABEL: Record<Hand, string> = {
  rock: 'グー',
  paper: 'パー',
  scissors: 'チョキ',
};

export const HAND_EMOJI: Record<Hand, string> = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
};

export function judge(a: Hand, b: Hand): 'win' | 'lose' | 'draw' {
  if (a === b) return 'draw';
  if (
    (a === 'rock' && b === 'scissors') ||
    (a === 'scissors' && b === 'paper') ||
    (a === 'paper' && b === 'rock')
  ) return 'win';
  return 'lose';
}

export function randomHand(): Hand {
  const h: Hand[] = ['rock', 'paper', 'scissors'];
  return h[Math.floor(Math.random() * h.length)];
}

export function randomCardFor(hand: Hand, deck: FoodCard[]): FoodCard {
  const pool = deck.filter(c => c.hand === hand);
  return pool[Math.floor(Math.random() * pool.length)] ?? deck[0];
}

