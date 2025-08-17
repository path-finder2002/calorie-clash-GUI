import { useEffect, useState } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper/types';

import type { Hand, FoodCard } from '@/models';
import { HAND_EMOJI, HAND_LABEL } from '@/models';

type Props = {
  onSelect: (hand: Hand) => void;
  cards?: Partial<Record<Hand, FoodCard>>;
};

const HANDS: Hand[] = ['rock', 'scissors', 'paper'];

const handColors: Record<Hand, { bg: string; color: string }> = {
  rock: { bg: 'red.500', color: 'white' },
  scissors: { bg: 'blue.500', color: 'white' },
  paper: { bg: 'green.500', color: 'white' },
};

export default function JankenSwiper({ onSelect, cards }: Props) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (swiper) swiper.slideTo(1, 0);
  }, [swiper]);

  return (
    <VStack gap={4} w='full' maxW='720px'>
      <Box w='full' position="relative" px="12">
        <Swiper
          modules={[Navigation]}
          onSwiper={setSwiper}
          slidesPerView={1}
          spaceBetween={30}
          navigation
        >
          {HANDS.map((h) => {
            const colorScheme = handColors[h];
            return (
              <SwiperSlide key={h} onClick={() => onSelect(h)}>
                <VStack
                  h='200px'
                  borderRadius='lg'
                  bg={colorScheme.bg}
                  color={colorScheme.color}
                  justify='center'
                  userSelect='none'
                  transition="all 0.2s"
                  _hover={{ transform: 'scale(1.05)', shadow: 'xl' }}
                  cursor='pointer'
                >
                  <Text fontSize='56px' lineHeight={1}>{HAND_EMOJI[h]}</Text>
                  <Text fontSize='lg' fontWeight='bold'>{HAND_LABEL[h]}</Text>
                  {cards?.[h] ? (
                    <VStack gap={0} fontSize='sm' opacity={0.9}>
                      <Text fontWeight='semibold'>{cards[h]!.name}</Text>
                      <Text>+{cards[h]!.points}pt / 満腹+{cards[h]!.satiety}</Text>
                    </VStack>
                  ) : (
                    <Text mt={2} fontSize="lg" fontWeight="bold">???</Text>
                  )}
                </VStack>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>
    </VStack>
  );
}
