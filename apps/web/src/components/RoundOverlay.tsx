import { Box, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  mode: 'pvc' | 'pvp';
  round?: number;
  onComplete: () => void;
  playerName?: string;
  cpuName?: string;
};

const MotionText = motion(Text);

export default function RoundOverlay({ mode, round = 1, onComplete, playerName = 'プレイヤー', cpuName = 'CPU' }: Props) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [visible, setVisible] = useState(true);

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

  if (!visible) return null;

  return (
    <Box position='fixed' inset={0} bg='rgba(0,0,0,1)' color='white' zIndex={10000} display='grid' placeItems='center'>
      {step === 1 ? (
        // MODE: {player} vs {cpu}
        <VStack gap={{ base: 2, md: 3 }} textAlign='center'>
          <MotionText
            fontWeight='black'
            fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          >
            {playerName}
          </MotionText>
          <Text fontWeight='extrabold' fontSize={{ base: 'clamp(16px, 5vw, 24px)', md: '24px' }} opacity={0.9}>vs</Text>
          <MotionText
            fontWeight='black'
            fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.4, delay: 0.05 }}
          >
            {cpuName}
          </MotionText>
        </VStack>
      ) : (
        // ROUND N
        <VStack gap={2} textAlign='center'>
          <Text fontWeight='extrabold' letterSpacing='.2em' opacity={0.9} fontSize={{ base: '18px', md: '24px' }}>ROUND</Text>
          <Text fontWeight='black' lineHeight={1} textShadow='0 0 24px rgba(255,255,255,.25)'
            fontSize={{ base: '72px', md: '120px', lg: '200px' }}>
            {round}
          </Text>
          <Text mt={1} opacity={0.7} fontSize={{ base: '12px', md: '14px' }}>Get Ready</Text>
        </VStack>
      )}
    </Box>
  );
}
