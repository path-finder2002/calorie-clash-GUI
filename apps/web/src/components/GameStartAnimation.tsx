/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Text, VStack, Button } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useGameStartAnimation } from './hooks/useGameStartAnimation';
import ImpactSmoke from './effects/ImpactSmoke';

type Props = {
  onComplete: () => void;
  playerName?: string;
  cpuName?: string;
};

export default function GameStartAnimation({ onComplete, playerName = 'プレイヤー', cpuName = 'CPU' }: Props) {
  const playerRef = useRef<HTMLParagraphElement>(null);
  const cpuRef = useRef<HTMLParagraphElement>(null);
  const [showSmoke, setShowSmoke] = useState(false);
  const { visible, containerRef, skipAnimation } = useGameStartAnimation(
    onComplete,
    playerRef as unknown as RefObject<HTMLElement>,
    cpuRef as unknown as RefObject<HTMLElement>,
    setShowSmoke
  );

  if (!visible) return null;

  return (
    <Box position='fixed' inset={0} bg='rgba(0,0,0,1)' color='white' zIndex={10000} display='grid' placeItems='center' ref={containerRef as any}>
      {/* 衝突時の画面フラッシュ */}
      <Box data-flash position='absolute' inset={0} bg='white' opacity={0} pointerEvents='none' />
      <VStack gap={{ base: 2, md: 3 }} textAlign='center'>
        {/* 上: プレイヤー名, 下: CPU 名の順序を維持 */}
        <Text ref={playerRef} fontWeight='black' fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}>{playerName}</Text>
        <Text fontWeight='extrabold' fontSize={{ base: 'clamp(16px, 5vw, 24px)', md: '24px' }} opacity={0.9}>vs</Text>
        <Text ref={cpuRef} fontWeight='black' fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}>{cpuName}</Text>
      </VStack>
      {showSmoke && <ImpactSmoke />}
      <Box position='absolute' bottom={{ base: 6, md: 8 }} left='50%' transform='translateX(-50%)'>
        <Button bg='white' color='black' size='lg' onClick={skipAnimation} _hover={{ bg: 'gray.100' }}>
          次へ
        </Button>
      </Box>
    </Box>
  );
}
