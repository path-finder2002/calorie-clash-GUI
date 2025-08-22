/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Text, VStack } from '@chakra-ui/react';
import { useGameStartAnimation } from './hooks/useGameStartAnimation';

type Props = {
  onComplete: () => void;
  playerName?: string;
  cpuName?: string;
  debug?: boolean;
};

export default function GameStartAnimation({ onComplete, playerName = 'プレイヤー', cpuName = 'CPU', debug = false }: Props) {
  const { visible, containerRef } = useGameStartAnimation(onComplete, debug);

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
