/* eslint-disable @typescript-eslint/no-explicit-any */
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
      const gsap: any = (window as any).gsap;

      gsap.set(containerRef.current, { opacity: 0 });
      gsap.set(playerRef.current, { x: '-50vw' });
      gsap.set(cpuRef.current, { x: '50vw' });

      gsap
        .timeline({
          onComplete: () => {
            setVisible(false);
            onComplete();
          }
        })
        .to(containerRef.current, { opacity: 1, duration: 0.2, ease: 'power2.out' })
        .to(playerRef.current, { x: 0, duration: 0.8, ease: 'back.out(1.7)' }, 0)
        .to(cpuRef.current, { x: 0, duration: 0.8, ease: 'back.out(1.7)' }, 0)
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
