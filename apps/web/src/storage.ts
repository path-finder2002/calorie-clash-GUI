import type { GameRule, GameScore } from './models';

const RULE_KEY = 'calorieClash.rule';
const SCORE_KEY = 'calorieClash.score';

export function loadRule(): GameRule | null {
  try {
    const raw = localStorage.getItem(RULE_KEY);
    return raw ? JSON.parse(raw) as GameRule : null;
  } catch {
    return null;
  }
}

export function saveRule(rule: GameRule) {
  try { localStorage.setItem(RULE_KEY, JSON.stringify(rule)); } catch { /* ignore */ }
}

export function loadScore(): GameScore {
  try {
    const raw = localStorage.getItem(SCORE_KEY);
    return raw ? JSON.parse(raw) as GameScore : { bestPoints: 0 };
  } catch {
    return { bestPoints: 0 };
  }
}

export function saveScore(score: GameScore) {
  try { localStorage.setItem(SCORE_KEY, JSON.stringify(score)); } catch { /* ignore */ }
}
