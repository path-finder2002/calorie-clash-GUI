import { useState, useEffect, useCallback } from 'react';

export function useGameSequence(enabled = true) {
  const [showGameStart, setShowGameStart] = useState(enabled);
  const [showDraw, setShowDraw] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    // ゲーム開始アニメーションが終わったら、抽選アニメーションを開始する
    if (!showGameStart) {
      setShowDraw(true);
    }
  }, [enabled, showGameStart]);

  const handleGameStartComplete = useCallback(() => {
    if (!enabled) return;
    setShowGameStart(false);
  }, [enabled]);

  const handleDrawComplete = useCallback(() => {
    if (!enabled) return;
    setShowDraw(false);
  }, [enabled]);

  const resetSequence = useCallback(() => {
    if (!enabled) return;
    setShowGameStart(true);
    setShowDraw(false);
  }, [enabled]);

  // 抽選アニメーションを再表示する必要がある場合（例：次のラウンド）
  const triggerDraw = useCallback(() => {
    if (!enabled) return;
    setShowDraw(true);
  }, [enabled]);

  return {
    showGameStart,
    showDraw,
    handleGameStartComplete,
    handleDrawComplete,
    resetSequence,
    triggerDraw,
  };
}
