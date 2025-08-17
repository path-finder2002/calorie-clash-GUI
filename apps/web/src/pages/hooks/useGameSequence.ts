import { useState, useEffect, useCallback } from 'react';

export function useGameSequence() {
  const [showGameStart, setShowGameStart] = useState(true);
  const [showDraw, setShowDraw] = useState(false);

  useEffect(() => {
    // ゲーム開始アニメーションが終わったら、抽選アニメーションを開始する
    if (!showGameStart) {
      setShowDraw(true);
    }
  }, [showGameStart]);

  const handleGameStartComplete = useCallback(() => {
    setShowGameStart(false);
  }, []);

  const handleDrawComplete = useCallback(() => {
    setShowDraw(false);
  }, []);

  const resetSequence = useCallback(() => {
    setShowGameStart(true);
    setShowDraw(false);
  }, []);

  // 抽選アニメーションを再表示する必要がある場合（例：次のラウンド）
  const triggerDraw = useCallback(() => {
    setShowDraw(true);
  }, []);

  return {
    showGameStart,
    showDraw,
    handleGameStartComplete,
    handleDrawComplete,
    resetSequence,
    triggerDraw,
  };
}
