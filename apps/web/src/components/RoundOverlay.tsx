/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Text, VStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  mode: 'pvc' | 'pvp';
  round?: number;
  onComplete: () => void;
  playerName?: string;
  cpuName?: string;
};

function ensureGsap(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).gsap) return resolve();
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    s.async = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

export default function RoundOverlay({ mode, round = 1, onComplete, playerName = 'プレイヤー', cpuName = 'CPU' }: Props) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [visible, setVisible] = useState(true);
  const playerRef = useRef<HTMLDivElement>(null);
  const vsRef = useRef<HTMLDivElement>(null);
  const cpuRef = useRef<HTMLDivElement>(null);
  const roundLabelRef = useRef<HTMLDivElement>(null);
  const roundNumRef = useRef<HTMLDivElement>(null);
  const roundSubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // シーケンス: MODE(=名前表示) -> ROUND
    setStep(1);
    const t1 = setTimeout(() => setStep(2), 1400);
    const t2 = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [mode, round, onComplete]);

  useEffect(() => {
    let killed = false;
    ensureGsap().then(() => {
      if (killed) return;
      const gsap: any = (window as any).gsap;

      if (step === 1) {
        // 初期化
        gsap.set(playerRef.current, { opacity: 0, x: -40, scale: 0.96 });
        gsap.set(cpuRef.current, { opacity: 0, x: 40, scale: 0.96 });
        gsap.set(vsRef.current, { opacity: 0 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to(playerRef.current, { opacity: 1, x: 0, duration: 0.5 })
          .to(playerRef.current, { scale: 1.04, duration: 0.18, ease: 'bounce.out' }, '>-0.12')
          .to(playerRef.current, { scale: 1.0, duration: 0.14 }, '>-0.04');
        tl.to(vsRef.current, { opacity: 1, duration: 0.2 }, '-=0.3');
        tl.to(cpuRef.current, { opacity: 1, x: 0, duration: 0.5 }, '-=0.15')
          .to(cpuRef.current, { scale: 1.04, duration: 0.18, ease: 'bounce.out' }, '>-0.12')
          .to(cpuRef.current, { scale: 1.0, duration: 0.14 }, '>-0.04');
      }

      if (step === 2) {
        gsap.set(roundLabelRef.current, { opacity: 0, letterSpacing: '0.6em' });
        gsap.set(roundNumRef.current, { opacity: 0, y: 10, scale: 0.86 });
        gsap.set(roundSubRef.current, { opacity: 0, y: 6 });
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to(roundLabelRef.current, { opacity: 1, duration: 0.3 }, 0)
          .to(roundLabelRef.current, { letterSpacing: '0.2em', duration: 0.3 }, 0)
          .to(roundNumRef.current, { opacity: 1, y: 0, scale: 1.12, duration: 0.38 }, 0.22)
          .to(roundNumRef.current, { scale: 1.0, duration: 0.22 }, '>-0.02')
          .to(roundSubRef.current, { opacity: 1, y: 0, duration: 0.22 }, '>-0.16');
      }
    });
    return () => { killed = true; };
  }, [step]);

  if (!visible) return null;

  return (
    <Box position='fixed' inset={0} bg='rgba(0,0,0,1)' color='white' zIndex={10000} display='grid' placeItems='center'>
      {step === 1 ? (
        // MODE: {player} vs {cpu}
        <VStack gap={{ base: 2, md: 3 }} textAlign='center'>
          <Text ref={playerRef as any} fontWeight='black' fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}>{playerName}</Text>
          <Text ref={vsRef as any} fontWeight='extrabold' fontSize={{ base: 'clamp(16px, 5vw, 24px)', md: '24px' }} opacity={0.9}>vs</Text>
          <Text ref={cpuRef as any} fontWeight='black' fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}>{cpuName}</Text>
        </VStack>
      ) : (
        // ROUND N
        <VStack gap={2} textAlign='center'>
          <Text ref={roundLabelRef as any} fontWeight='extrabold' letterSpacing='.2em' opacity={0.9} fontSize={{ base: '18px', md: '24px' }}>ROUND</Text>
          <Text ref={roundNumRef as any} fontWeight='black' lineHeight={1} textShadow='0 0 24px rgba(255,255,255,.25)'
            fontSize={{ base: '72px', md: '120px', lg: '200px' }}>
            {round}
          </Text>
          <Text ref={roundSubRef as any} mt={1} opacity={0.7} fontSize={{ base: '12px', md: '14px' }}>Get Ready</Text>
        </VStack>
      )}
    </Box>
  );
}
