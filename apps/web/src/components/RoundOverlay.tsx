import { Box, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type Props = {
  mode: 'pvc' | 'pvp';
  round?: number;
  onComplete: () => void;
};

export default function RoundOverlay({ mode, round = 1, onComplete }: Props) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // シーケンス: MODE -> ROUND
    setStep(1);
    const t1 = setTimeout(() => setStep(2), 1200);
    const t2 = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [mode, round, onComplete]);

  const label = step === 1 ? 'MODE' : 'ROUND';
  const main = step === 1 ? (mode === 'pvc' ? 'プレイヤー vs CPU' : '2人（PvP）') : String(round);
  const sub  = step === 1 ? 'Game Mode' : 'Get Ready';

  if (!visible) return null;

  return (
    <Box position='fixed' inset={0} bg='rgba(0,0,0,1)' color='white' zIndex={10000} display='grid' placeItems='center'>
      <VStack gap={2} textAlign='center'>
        <Text fontWeight='extrabold' letterSpacing='.2em' opacity={0.9} fontSize={{ base: '18px', md: '24px' }}>{label}</Text>
        <Text fontWeight='black' lineHeight={1} textShadow='0 0 24px rgba(255,255,255,.25)'
          fontSize={{ base: '72px', md: '120px', lg: '200px' }}>
          {main}
        </Text>
        <Text mt={1} opacity={0.7} fontSize={{ base: '12px', md: '14px' }}>{sub}</Text>
      </VStack>
    </Box>
  );
}

