import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { ensureGsap } from '@/lib';

export function useGameStartAnimation<T extends HTMLElement, U extends HTMLElement>(
  onComplete: () => void,
  playerRef: RefObject<T>,
  cpuRef: RefObject<U>,
  setShowSmoke: (v: boolean) => void
) {
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);
  const tlRef = useRef<any>(null);
  const killedRef = useRef(false);
  const [canProceed, setCanProceed] = useState(false);

  const skipAnimation = useCallback(() => {
    try { tlRef.current?.kill?.(); } catch { /* ignore */ }
    killedRef.current = true;
    setShowSmoke(false);
    setVisible(false);
    onComplete();
  }, [onComplete, setShowSmoke]);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    setCanProceed(false);
    ensureGsap().then((loaded) => {
      if (killedRef.current) return;
      if (!loaded) { skipAnimation(); return; }
      const gsap = (window as unknown as { gsap: typeof import('gsap').gsap }).gsap;

      // 初期状態（アンビル: 上下からブラー付きで滑り込み）
      gsap.set(containerRef.current, { opacity: 0 });
      gsap.set(playerRef.current, {
        y: '-60vh',
        filter: 'blur(18px)',
        opacity: 0,
        rotate: 6,
        transformOrigin: '50% 50%'
      });
      gsap.set(cpuRef.current, {
        y: '60vh',
        filter: 'blur(18px)',
        opacity: 0,
        rotate: -6,
        transformOrigin: '50% 50%'
      });
      const flashEl = (containerRef.current?.querySelector('[data-flash]') ?? null) as HTMLElement | null;
      if (flashEl) gsap.set(flashEl, { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: skipAnimation,
      });
      tlRef.current = tl;

      tl
        // 背景フェードイン（薄い黒幕）
        .to(containerRef.current, { opacity: 1, duration: 0.2 }, 0)
        // 両者アンビルイン（ブラー解除・回転戻し）
        .to(
          playerRef.current,
          { y: 0, opacity: 1, filter: 'blur(0px)', rotate: 0, duration: 0.65, ease: 'expo.out' },
          0.02
        )
        .to(
          cpuRef.current,
          { y: 0, opacity: 1, filter: 'blur(0px)', rotate: 0, duration: 0.65, ease: 'expo.out' },
          0.02
        )
        // インパクト
        .addLabel('impact', '+=0.02')
        .add(() => setShowSmoke(true), 'impact')
        .to(flashEl, { opacity: 0.9, duration: 0.06, ease: 'power1.out' }, 'impact')
        .to(flashEl, { opacity: 0, duration: 0.18, ease: 'power1.in' }, 'impact+=0.06')
        .to(
          [playerRef.current, cpuRef.current],
          { y: '+=14', scaleY: 0.88, duration: 0.09, ease: 'power3.out' },
          'impact'
        )
        .to(
          [playerRef.current, cpuRef.current],
          { y: '-=14', scaleY: 1, duration: 0.12, ease: 'back.out(3)' },
          'impact+=0.09'
        )
        .to(
          containerRef.current,
          { x: '+=10', yoyo: true, repeat: 5, duration: 0.035, ease: 'power1.inOut' },
          'impact'
        )
        .add(() => setShowSmoke(false), 'impact+=0.35')
        // ユーザー操作可（次へボタン表示）
        .add(() => setCanProceed(true), 'impact+=0.20')
        // 余韻（少し見せてからフェードアウト）
        .to(
          containerRef.current,
          { opacity: 0, duration: 0.45, ease: 'power2.in' },
          'impact+=0.45'
        );
    }).catch(() => { skipAnimation(); });
    return () => {
      killedRef.current = true;
      try { tlRef.current?.kill?.(); } catch { /* ignore */ }
      tlRef.current = null;
    };
  }, [playerRef, cpuRef, setShowSmoke, skipAnimation]);

  return { visible, containerRef, skipAnimation, canProceed };
}
