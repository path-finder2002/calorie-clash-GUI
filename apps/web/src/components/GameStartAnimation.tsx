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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let killed = false;
    ensureGsap().then(() => {
      if (killed) return;
      const gsap: any = (window as any).gsap;

      // 初期化: 全体を透明に
      gsap.set(containerRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          // 完了後、少し待ってからコールバック実行
          setTimeout(() => {
            setVisible(false);
            onComplete();
          }, 400);
        }
      });
      // フェードインし、少し待ってからフェードアウト
      tl.to(containerRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' })
        .to(containerRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' }, '>+=0.4');
    });
    return () => { killed = true; };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <Box position='fixed' inset={0} bg='rgba(0,0,0,1)' color='white' zIndex={10000} display='grid' placeItems='center' ref={containerRef as any}>
      <VStack gap={{ base: 2, md: 3 }} textAlign='center'>
        <Text fontWeight='black' fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}>{playerName}</Text>
        <Text fontWeight='extrabold' fontSize={{ base: 'clamp(16px, 5vw, 24px)', md: '24px' }} opacity={0.9}>vs</Text>
        <Text fontWeight='black' fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}>{cpuName}</Text>
      </VStack>
    </Box>
  );
}
