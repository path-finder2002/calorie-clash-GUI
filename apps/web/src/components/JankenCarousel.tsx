import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Box, Card, CardBody, Heading, Text, VStack } from '@chakra-ui/react';
import type { FoodCard, Hand } from '@/models';
import { HAND_LABEL, HAND_EMOJI } from '@/models';

type Props = {
  onSelect: (hand: Hand) => void;
  cards: Partial<Record<Hand, FoodCard>>;
};

const handOrder: Hand[] = ['rock', 'scissors', 'paper'];

const handColors: Record<Hand, { bg: string; color: string }> = {
  rock: { bg: 'red.500', color: 'white' },
  scissors: { bg: 'blue.500', color: 'white' },
  paper: { bg: 'green.500', color: 'white' },
};

export default function JankenCarousel({ onSelect, cards }: Props) {
  return (
    <Box w="full" maxW={{ base: '300px', md: '700px' }} mx="auto" py={4}>
      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        centeredSlides={true}
        breakpoints={{
          768: {
            slidesPerView: 3,
            spaceBetween: 40,
            centeredSlides: false,
          },
        }}
        style={{
          // @ts-expect-error Custom properties
          '--swiper-navigation-color': '#FFFFFF',
          '--swiper-pagination-color': '#FFFFFF',
        }}
      >
        {handOrder.map((hand) => {
          const card = cards[hand];
          const colorScheme = handColors[hand];

          return (
            <SwiperSlide key={hand}>
              <Card
                as="button"
                onClick={() => onSelect(hand)}
                w="full"
                h="240px"
                bg={colorScheme.bg}
                color={colorScheme.color}
                textAlign="center"
                transition="all 0.2s"
                _hover={{ transform: 'scale(1.05)', shadow: 'xl' }}
                overflow="hidden"
              >
                <CardBody as={VStack} justify="center" spacing={2}>
                  <Text fontSize="6xl">{HAND_EMOJI[hand]}</Text>
                  <Heading size="md">{HAND_LABEL[hand]}</Heading>
                  {card ? (
                    <VStack spacing={0} mt={2}>
                      <Text fontWeight="bold" fontSize="lg">{card.name}</Text>
                      <Text fontSize="sm" opacity={0.9}>
                        {card.points}pt / 満腹{card.satiety}
                      </Text>
                    </VStack>
                  ) : (
                    <Text mt={2} fontSize="lg" fontWeight="bold">???</Text>
                  )}
                </CardBody>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
}
