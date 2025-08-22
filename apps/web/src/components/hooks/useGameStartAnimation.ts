import { useEffect, useRef, useState } from 'react';
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
  const [token, setToken] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - 型を緩く扱う（実行時に gsap を参照）
  type G = typeof import('gsap').gsap;

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    let killed = false;
    ensureGsap().then(() => {
      if (killed) return;
      const gsap = (window as unknown as { gsap: G }).gsap;

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
        onComplete: () => {
          setShowSmoke(false);
          setVisible(false);
          onComplete();
        }
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
        .to(containerRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' }, 'impact+=0.48');
    });
    return () => {
      killed = true;
      try { tlRef.current?.kill(); } catch { /* ignore */ }
      tlRef.current = null;
    };
  }, [onComplete, playerRef, cpuRef, setShowSmoke, token]);

  const replay = () => {
    // 既存TLを止め、初期化してから再度 effect を走らせる
    try { tlRef.current?.kill(); } catch { /* ignore */ }
    tlRef.current = null;
    hasRun.current = false;
    setShowSmoke(false);
    setVisible(true);
    // トークンを更新して useEffect を再実行
    setToken((t) => t + 1);
  };

  const playImpact = () => {
    const tl = tlRef.current as any;
    if (!tl) return;
    try { tl.play('impact'); } catch { /* ignore */ }
  };

  return { visible, containerRef, replay, playImpact, canProceed };
}
