import { useEffect, useState } from 'react';
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

import type { Hand, FoodCard } from '@/models';
import { HAND_EMOJI, HAND_LABEL } from '@/models';

type Props = {
  onSelect: (hand: Hand) => void;
  cards?: Partial<Record<Hand, FoodCard>>;
};

const HANDS: Hand[] = ['rock', 'scissors', 'paper'];

export default function JankenSwiper({ onSelect, cards }: Props) {
  const [active, setActive] = useState<Hand>('rock');
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  // 初期位置は中央（scissors）
  useEffect(() => {
    if (swiper) swiper.slideTo(1, 0);
  }, [swiper]);

  return (
    <VStack gap={4} w='full' maxW='720px'>
      <Text fontWeight='bold'>スワイプして手を選択</Text>
      <Box w='full'>
        <Swiper
          modules={[EffectCoverflow]}
          onSwiper={setSwiper}
          slidesPerView={'auto'}
          centeredSlides
          effect='coverflow'
          coverflowEffect={{ rotate: 0, stretch: 40, depth: 160, modifier: 1, slideShadows: false }}
          onSlideChange={(s) => setActive(HANDS[s.realIndex % HANDS.length])}
          style={{ padding: '20px 0' }}
          loop
        >
          {HANDS.map((h) => (
            <SwiperSlide key={h} style={{ width: 220 }}>
              <VStack
                h='200px'
                border='1px solid rgba(255,255,255,0.18)'
                borderRadius='lg'
                bg='rgba(255,255,255,0.06)'
                backdropFilter='blur(2px)'
                justify='center'
                userSelect='none'
              >
                <Text fontSize='56px' lineHeight={1}>{HAND_EMOJI[h]}</Text>
                <Text fontSize='lg' fontWeight='bold'>{HAND_LABEL[h]}</Text>
                {cards?.[h] && (
                  <VStack gap={0} fontSize='sm' opacity={0.9}>
                    <Text fontWeight='semibold'>{cards[h]!.name}</Text>
                    <Text>+{cards[h]!.points}pt / 満腹+{cards[h]!.satiety}</Text>
                  </VStack>
                )}
              </VStack>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      <HStack gap={3}>
        <Button onClick={() => onSelect(active)} colorScheme='teal' size='lg'>この手で勝負</Button>
      </HStack>
    </VStack>
  );
}
