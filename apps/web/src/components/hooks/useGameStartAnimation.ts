/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject, useEffect, useRef, useState } from 'react';
import { ensureGsap } from '@/lib';

export function useGameStartAnimation(
  onComplete: () => void,
  playerRef: RefObject<HTMLElement>,
  cpuRef: RefObject<HTMLElement>,
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
      const gsap: any = (window as any).gsap;

      gsap.set(containerRef.current, { opacity: 0 });
      gsap.set(playerRef.current, { y: '-60vh', rotate: 15 });
      gsap.set(cpuRef.current, { y: '60vh', rotate: -15 });

      gsap
        .timeline({
          onComplete: () => {
            setVisible(false);
            onComplete();
          }
        })
        .to(containerRef.current, { opacity: 1, duration: 0.2, ease: 'power2.out' })
        .to(
          playerRef.current,
          { y: 0, rotate: 0, ease: 'bounce.out', duration: 0.9 },
          0
        )
        .to(
          cpuRef.current,
          { y: 0, rotate: 0, ease: 'bounce.out', duration: 0.9 },
          0
        )
        .to(
          [playerRef.current, cpuRef.current],
          { y: '+=16', scaleY: 0.9, duration: 0.1, ease: 'power1.in' }
        )
        .to(
          [playerRef.current, cpuRef.current],
          { y: '-=16', scaleY: 1, duration: 0.2, ease: 'bounce.out' }
        )
        .add(() => setShowSmoke(true))
        .to(containerRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' }, '>+=0.4')
        .add(() => setShowSmoke(false));
    });
    return () => {
      killed = true;
    };
  }, [onComplete, playerRef, cpuRef, setShowSmoke]);

  return { visible, containerRef };
}
