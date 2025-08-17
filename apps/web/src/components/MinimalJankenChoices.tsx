import { HStack, VStack, Box, Text } from '@chakra-ui/react';
import type { FoodCard, Hand } from '@/models';
import { HAND_EMOJI, HAND_LABEL } from '@/models';

type Props = {
  cards: Partial<Record<Hand, FoodCard>>;
  onSelect: (hand: Hand) => void;
};

const ORDER: Hand[] = ['rock', 'scissors', 'paper'];

export default function MinimalJankenChoices({ cards, onSelect }: Props) {
  return (
    <HStack gap={{ base: 3, md: 5 }} justify='center'>
      {ORDER.map((h) => {
        const c = cards[h];
        const disabled = !c;
        return (
          <Box
            key={h}
            role='button'
            aria-disabled={disabled}
            onClick={() => { if (!disabled) onSelect(h); }}
            cursor={disabled ? 'not-allowed' : 'pointer'}
            userSelect='none'
            px={{ base: 4, md: 5 }}
            py={{ base: 4, md: 5 }}
            border='1px solid'
            borderColor='rgba(255,255,255,0.16)'
            borderRadius='lg'
            bg='rgba(255,255,255,0.04)'
            _hover={!disabled ? { transform: 'translateY(-2px)', bg: 'rgba(255,255,255,0.07)' } : {}}
            transition='all .15s ease'
            minW='160px'
            textAlign='center'
          >
            <VStack gap={1}>
              <Text fontSize={{ base: '44px', md: '56px' }} lineHeight={1}>{HAND_EMOJI[h]}</Text>
              <Text fontWeight='bold'>{HAND_LABEL[h]}</Text>
              {c ? (
                <VStack gap={0} fontSize='sm' opacity={0.95}>
                  <Text fontWeight='semibold'>{c.name}</Text>
                  <Text>+{c.points}pt / 満腹+{c.satiety}</Text>
                </VStack>
              ) : (
                <Text fontSize='sm' opacity={0.7}>抽選中…</Text>
              )}
            </VStack>
          </Box>
        );
      })}
    </HStack>
  );
}

