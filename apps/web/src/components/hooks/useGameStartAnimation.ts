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

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    let killed = false;
    ensureGsap().then(() => {
      if (killed) return;
      const gsap = (window as unknown as { gsap: typeof import('gsap').gsap }).gsap;

      // 初期状態（アンビル: 上下からブラー付きで滑り込み）
      gsap.set(containerRef.current, { opacity: 0 });
      gsap.set(playerRef.current, {
        y: '-60vh',
        filter: 'blur(16px)',
        opacity: 0.2,
        skewY: -8
      });
      gsap.set(cpuRef.current, {
        y: '60vh',
        filter: 'blur(16px)',
        opacity: 0.2,
        skewY: 8
      });

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete: () => {
          setShowSmoke(false);
          setVisible(false);
          onComplete();
        }
      });

      tl
        // 背景フェードイン（薄い黒幕）
        .to(containerRef.current, { opacity: 1, duration: 0.22 }, 0)
        // 両者アンビルイン（ブラー解除しながら）
        .to(
          playerRef.current,
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            skewY: 0,
            duration: 1,
            ease: 'power2.in'
          },
          0
        )
        .to(
          cpuRef.current,
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            skewY: 0,
            duration: 1,
            ease: 'power2.in'
          },
          0
        )
        // 着地タイミングでスモーク
        .add(() => setShowSmoke(true), 1)
        // 着地バウンド（スケール+シェイク）
        .addLabel('impact', 1)
        .to(
          [playerRef.current, cpuRef.current],
          { y: '+=16', scaleY: 0.9, duration: 0.09, ease: 'power2.out' },
          'impact'
        )
        .to(
          [playerRef.current, cpuRef.current],
          { y: '-=16', scaleY: 1, duration: 0.12, ease: 'back.out(4)' },
          'impact+=0.09'
        )
        .to(
          containerRef.current,
          { y: '+=6', yoyo: true, repeat: 3, duration: 0.05, ease: 'power1.inOut' },
          'impact'
        )
        // 余韻（少し見せてからフェードアウト）
        .to(
          containerRef.current,
          { opacity: 0, duration: 0.45, ease: 'power2.in' },
          'impact+=0.45'
        );
    });
    return () => {
      killed = true;
    };
  }, [onComplete, playerRef, cpuRef, setShowSmoke]);

  return { visible, containerRef };
}
