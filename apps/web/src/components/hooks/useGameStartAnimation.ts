/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { ensureGsap } from '@/lib';

export function useGameStartAnimation(onComplete: () => void) {
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

      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            setVisible(false);
            onComplete();
          }, 400);
        }
      });

      tl.to(containerRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' })
        .to(containerRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' }, '>+=0.4');
    });
    return () => { killed = true; };
  }, [onComplete]);

  return { visible, containerRef };
}
