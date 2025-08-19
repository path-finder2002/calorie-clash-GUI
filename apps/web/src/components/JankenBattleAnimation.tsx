/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import type { Hand } from '@/models';
import { ensureGsap } from '@/lib';

const HAND_EMOJI: Record<Hand, string> = { rock: '✊', scissors: '✌️', paper: '🖐️' };

type Props = {
  player: Hand;
  cpu: Hand;
  onComplete: () => void;
};

export default function JankenBattleAnimation({ player, cpu, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const cpuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let killed = false;
    ensureGsap().then(() => {
      if (killed) return;
      const gsap: any = (window as any).gsap;
      gsap.set(containerRef.current, { opacity: 0 });
      gsap.set(playerRef.current, { x: '-100%' });
      gsap.set(cpuRef.current, { x: '100%' });
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        }
      });
      tl.to(containerRef.current, { opacity: 1, duration: 0.2 })
        .to(playerRef.current, { x: 0, duration: 0.3, ease: 'power2.out' }, 0)
        .to(cpuRef.current, { x: 0, duration: 0.3, ease: 'power2.out' }, 0)
        .to([playerRef.current, cpuRef.current], { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' });
    });
    return () => { killed = true; };
  }, [player, cpu, onComplete]);

  return (
    <Box ref={containerRef} position='fixed' inset={0} bg='rgba(0,0,0,0.8)' color='white' zIndex={10000} display='grid' placeItems='center'>
      <Box display='flex' gap={16} fontSize={{ base: '80px', md: '120px' }}>
        <Box ref={playerRef}>{HAND_EMOJI[player]}</Box>
        <Box ref={cpuRef}>{HAND_EMOJI[cpu]}</Box>
      </Box>
    </Box>
  );
}
