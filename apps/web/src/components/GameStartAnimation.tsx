/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Text, VStack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useGameStartAnimation } from './hooks/useGameStartAnimation';
import SmokeEffect from './effects/SmokeEffect';

type Props = {
  onComplete: () => void;
  playerName?: string;
  cpuName?: string;
};

export default function GameStartAnimation({ onComplete, playerName = 'プレイヤー', cpuName = 'CPU' }: Props) {
  const playerRef = useRef<HTMLParagraphElement>(null);
  const cpuRef = useRef<HTMLParagraphElement>(null);
  const [showSmoke, setShowSmoke] = useState(false);
  const { visible, containerRef } = useGameStartAnimation(
    onComplete,
    playerRef as unknown as RefObject<HTMLElement>,
    cpuRef as unknown as RefObject<HTMLElement>,
    setShowSmoke
  );

  if (!visible) return null;

  return (
    <Box position='fixed' inset={0} bg='rgba(0,0,0,1)' color='white' zIndex={10000} display='grid' placeItems='center' ref={containerRef as any}>
      <VStack gap={{ base: 2, md: 3 }} textAlign='center'>
        <Text ref={playerRef} fontWeight='black' fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}>{playerName}</Text>
        <Text fontWeight='extrabold' fontSize={{ base: 'clamp(16px, 5vw, 24px)', md: '24px' }} opacity={0.9}>vs</Text>
        <Text ref={cpuRef} fontWeight='black' fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}>{cpuName}</Text>
      </VStack>
      {showSmoke && <SmokeEffect />}
    </Box>
  );
}
