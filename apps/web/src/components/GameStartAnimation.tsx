/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Text, VStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

type Props = {
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

export default function GameStartAnimation({ onComplete, playerName = 'プレイヤー', cpuName = 'CPU' }: Props) {
  const [visible, setVisible] = useState(true);
  const playerRef = useRef<HTMLDivElement>(null);
  const vsRef = useRef<HTMLDivElement>(null);
  const cpuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let killed = false;
    ensureGsap().then(() => {
      if (killed) return;
      const gsap: any = (window as any).gsap;

      // 初期化
      gsap.set(playerRef.current, { opacity: 0, x: -40, scale: 0.96 });
      gsap.set(cpuRef.current, { opacity: 0, x: 40, scale: 0.96 });
      gsap.set(vsRef.current, { opacity: 0 });

      const tl = gsap.timeline({ 
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          setTimeout(() => {
            setVisible(false);
            onComplete();
          }, 400);
        }
      });
      tl.to(playerRef.current, { opacity: 1, x: 0, duration: 0.5 })
        .to(playerRef.current, { scale: 1.04, duration: 0.18, ease: 'bounce.out' }, '>-0.12')
        .to(playerRef.current, { scale: 1.0, duration: 0.14 }, '>-0.04');
      tl.to(vsRef.current, { opacity: 1, duration: 0.2 }, '-=0.3');
      tl.to(cpuRef.current, { opacity: 1, x: 0, duration: 0.5 }, '-=0.15')
        .to(cpuRef.current, { scale: 1.04, duration: 0.18, ease: 'bounce.out' }, '>-0.12')
        .to(cpuRef.current, { scale: 1.0, duration: 0.14 }, '>-0.04');
    });
    return () => { killed = true; };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <Box position='fixed' inset={0} bg='rgba(0,0,0,1)' color='white' zIndex={10000} display='grid' placeItems='center'>
      <VStack gap={{ base: 2, md: 3 }} textAlign='center'>
        <Text ref={playerRef as any} fontWeight='black' fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}>{playerName}</Text>
        <Text ref={vsRef as any} fontWeight='extrabold' fontSize={{ base: 'clamp(16px, 5vw, 24px)', md: '24px' }} opacity={0.9}>vs</Text>
        <Text ref={cpuRef as any} fontWeight='black' fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}>{cpuName}</Text>
      </VStack>
    </Box>
  );
}
