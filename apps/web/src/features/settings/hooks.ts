import { useState } from 'react';
import type { GameRule } from '@/models';
import { defaultRule } from '@/models';

export function useSettings(rule: GameRule, onChangeRule: (r: GameRule) => void, onClose: () => void) {
  const [draft, setDraft] = useState<GameRule>(rule);
  const [tpText, setTpText] = useState(String(rule.targetPoints));
  const [physText, setPhysText] = useState(String(rule.physique));
  const tpInvalid = tpText !== '' && !/^\d+$/.test(tpText);
  const physInvalid = physText !== '' && !/^\d+$/.test(physText);

  function update<K extends keyof GameRule>(key: K, value: GameRule[K]) {
    setDraft(prev => ({ ...prev, [key]: value }));
  }

  function apply() { onChangeRule(draft); onClose(); }
  function cancel() { setDraft(rule); onClose(); }
  function defaults() { setDraft(defaultRule); }

  function getSafeNumber(text: string, fallback: number) {
    return /^\d+$/.test(text) ? Number(text) : fallback;
  }

  function adjustTargetPoints(delta: number) {
    const cur = getSafeNumber(tpText, draft.targetPoints);
    const next = Math.max(1, cur + delta);
    setTpText(String(next));
    update('targetPoints', next as GameRule['targetPoints']);
  }

  function adjustPhysique(delta: number) {
    const cur = getSafeNumber(physText, draft.physique);
    const next = Math.max(100, cur + delta);
    setPhysText(String(next));
    update('physique', next as GameRule['physique']);
  }

  return {
    draft,
    tpText,
    physText,
    tpInvalid,
    physInvalid,
    update,
    apply,
    cancel,
    defaults,
    adjustTargetPoints,
    adjustPhysique,
    setTpText,
    setPhysText,
  };
}
