/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Text, VStack, HStack, Button } from '@chakra-ui/react';
import type { Hand } from '@/models';
import { useEffect, useRef, useState } from 'react';

type Props = {
  round?: number;
  onComplete: () => void;
  debugStep?: 2 | 3; // デバッグ用: 特定ステップのみ
  onResult?: (names: Record<Hand, string>) => void; // 選ばれた食品名（手ごと）
};

// SLOT 表示用の定数はコンポーネント外で安定化
const slotBorder = '2px solid rgba(255,255,255,0.2)';
const slotFoods = {
  rock: ['唐揚げ', '餃子', 'グミ'],
  scissors: ['サラダ', '寿司', 'そば'],
  paper: ['パン', 'パスタ', 'プリン'],
} as const;
// 横スクロール用: ベース配列をそのまま連結
const cycles = 4; // サイクル数を減らしてDOM要素を削減
const seqRock = Array.from({ length: cycles }).flatMap(() => slotFoods.rock);
const seqScis = Array.from({ length: cycles }).flatMap(() => slotFoods.scissors);
const seqPap  = Array.from({ length: cycles }).flatMap(() => slotFoods.paper);

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

export default function RoundOverlay({ round = 1, onComplete, onResult }: Props) {
  const [step, setStep] = useState<0 | 2 | 3>(0);
  const [visible, setVisible] = useState(true);
  const [resultFoods, setResultFoods] = useState<string[] | null>(null);
  const [showNext, setShowNext] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slotInner1 = useRef<HTMLDivElement>(null);
  const slotInner2 = useRef<HTMLDivElement>(null);
  const slotInner3 = useRef<HTMLDivElement>(null);
  const slotBox1 = useRef<HTMLDivElement>(null);
  const slotBox2 = useRef<HTMLDivElement>(null);
  const slotBox3 = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const lastRound = useRef<number | undefined>();
  const lastStep = useRef<0 | 2 | 3 | null>(null);

  useEffect(() => {
    if (lastRound.current === round) return;
    lastRound.current = round;
    hasAnimated.current = false;
    // 通常シーケンス: ROUND -> SLOT
    setStep(2);
    setShowNext(false);
    const t2 = setTimeout(() => setShowNext(true), 1000); // ROUND表示時間を短縮
    return () => {
      hasAnimated.current = false;
      clearTimeout(t2);
    };
  }, [round]);

  useEffect(() => {
    if (lastStep.current === step) return;
    lastStep.current = step;
    let killed = false;
    ensureGsap().then(() => {
      if (killed) return;
      const gsap: any = (window as any).gsap;

      if (step === 2) {
        gsap.set(containerRef.current, { opacity: 0 });
        gsap.to(containerRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      }

      if (step === 3) {
        if (hasAnimated.current) {
          console.error('RoundOverlay: アニメーションが多重に呼び出されました');
          return;
        }
        hasAnimated.current = true;
        const animateRail = (boxEl: HTMLDivElement | null, railEl: HTMLDivElement | null): Promise<string> => {
          return new Promise((resolve) => {
            if (!boxEl || !railEl) return resolve('');
            gsap.set(railEl, { x: 0 });

            const viewport = boxEl.getBoundingClientRect();
            const centerX = viewport.left + viewport.width / 2;
            const children = Array.from(railEl.children) as HTMLElement[];
            const centers = children.map((el) => el.getBoundingClientRect().left + el.clientWidth / 2);

            const start = Math.floor(centers.length * 0.45);
            const end = Math.floor(centers.length * 0.85);
            const idx = Math.max(0, Math.min(centers.length - 1, Math.floor(start + Math.random() * (end - start))));
            const targetCenter = centers[idx];
            const targetTranslate = centerX - targetCenter;

            // 選択アニメーション（簡略版）
            gsap.to(railEl, {
              x: targetTranslate,
              duration: 1.2 + Math.random() * 0.4, // 回転時間を短縮
              ease: 'power2.out', // シンプルなイージング
              onComplete: () => {
                const el = children[idx];
                el?.setAttribute('aria-selected', 'true');
                gsap.to(el, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 });
                resolve(el?.getAttribute('data-food') || el?.textContent || '');
              }
            });
          });
        };

        (async () => {
          try {
            const names = await Promise.all([
              animateRail(slotBox1.current, slotInner1.current),
              animateRail(slotBox2.current, slotInner2.current),
              animateRail(slotBox3.current, slotInner3.current),
            ]);
            setResultFoods(names);
            const byHand: Record<Hand, string> = { rock: names[0] || '', scissors: names[1] || '', paper: names[2] || '' };
            onResult?.(byHand);
            setShowNext(true); // 結果表示後にボタンを表示
          } catch (e) {
            console.error('RoundOverlay: スロットアニメーションでエラーが発生しました', e);
            hasAnimated.current = false;
            setVisible(false);
            onComplete();
          }
        })();
      }
    });
    return () => { killed = true; };
  }, [step, onComplete, onResult]);

  function handleNext() {
    if (step === 2) {
      setShowNext(false);
      setStep(3);
    } else if (step === 3) {
      setShowNext(false);
      setVisible(false);
      onComplete();
    }
  }

  if (!visible) return null;

  return (
    <Box position='fixed' inset={0} bg='rgba(0,0,0,0.96)' color='white' zIndex={10000} display='grid' placeItems='center' ref={containerRef as any}>
      {step === 2 ? (
        // ROUND N (簡略版)
        <VStack gap={2} textAlign='center'>
          <Text fontWeight='extrabold' letterSpacing='.1em' opacity={0.9} fontSize={{ base: '18px', md: '24px' }}>ROUND</Text>
          <Text fontWeight='black' lineHeight={1} textShadow='0 0 12px rgba(255,255,255,.2)'
            fontSize={{ base: '72px', md: '120px', lg: '200px' }}>
            {round}
          </Text>
        </VStack>
      ) : (
        // SLOT (簡略版)
        <VStack gap={{ base: 4, md: 6 }} w='full' maxW='960px'>
          <Text fontWeight='extrabold' letterSpacing='.1em' opacity={0.9} textAlign='center' fontSize={{ base: '16px', md: '18px' }}>SLOT</Text>

          <HStack w='full' gap={3} align='center' justify='center'>
            <Text w='40px' textAlign='center' fontSize={{ base: '20px', md: '22px' }}>✊</Text>
            <Box ref={slotBox1 as any} position='relative' w='92vw' maxW='860px' h='100px' overflow='hidden' border={slotBorder} borderRadius='lg' bg='rgba(255,255,255,0.05)'>
              <Box position='absolute' top={0} bottom={0} left='50%' w='2px' bg='teal.300' opacity={0.9} pointerEvents='none' />
              <Box ref={slotInner1 as any} display='flex' alignItems='center' gap={3} px={4} h='full'>
                {seqRock.map((f, i) => (
                  <Box key={`r-${i}`} data-food={f} flex='0 0 180px' h='88%' border='1px solid rgba(255,255,255,0.1)' borderRadius='md' bg='rgba(255,255,255,0.05)' display='grid' placeContent='center' p={3} aria-selected='false'>
                    <Text className='name' fontWeight='extrabold' fontSize='20px' textAlign='center'>{f}</Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </HStack>

          <HStack w='full' gap={3} align='center' justify='center'>
            <Text w='40px' textAlign='center' fontSize={{ base: '20px', md: '22px' }}>✌️</Text>
            <Box ref={slotBox2 as any} position='relative' w='92vw' maxW='860px' h='100px' overflow='hidden' border={slotBorder} borderRadius='lg' bg='rgba(255,255,255,0.05)'>
              <Box position='absolute' top={0} bottom={0} left='50%' w='2px' bg='teal.300' opacity={0.9} pointerEvents='none' />
              <Box ref={slotInner2 as any} display='flex' alignItems='center' gap={3} px={4} h='full'>
                {seqScis.map((f, i) => (
                  <Box key={`s-${i}`} data-food={f} flex='0 0 180px' h='88%' border='1px solid rgba(255,255,255,0.1)' borderRadius='md' bg='rgba(255,255,255,0.05)' display='grid' placeContent='center' p={3} aria-selected='false'>
                    <Text className='name' fontWeight='extrabold' fontSize='20px' textAlign='center'>{f}</Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </HStack>

          <HStack w='full' gap={3} align='center' justify='center'>
            <Text w='40px' textAlign='center' fontSize={{ base: '20px', md: '22px' }}>🖐️</Text>
            <Box ref={slotBox3 as any} position='relative' w='92vw' maxW='860px' h='100px' overflow='hidden' border={slotBorder} borderRadius='lg' bg='rgba(255,255,255,0.05)'>
              <Box position='absolute' top={0} bottom={0} left='50%' w='2px' bg='teal.300' opacity={0.9} pointerEvents='none' />
              <Box ref={slotInner3 as any} display='flex' alignItems='center' gap={3} px={4} h='full'>
                {seqPap.map((f, i) => (
                  <Box key={`p-${i}`} data-food={f} flex='0 0 180px' h='88%' border='1px solid rgba(255,255,255,0.1)' borderRadius='md' bg='rgba(255,255,255,0.05)' display='grid' placeContent='center' p={3} aria-selected='false'>
                    <Text className='name' fontWeight='extrabold' fontSize='20px' textAlign='center'>{f}</Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </HStack>

          {resultFoods && (
            <Text mt={2} fontWeight='bold' fontSize={{ base: '16px', md: '18px' }} textAlign='center'>
              選ばれた食べ物は {resultFoods.join('・')} でした！
            </Text>
          )}
        </VStack>
      )}
      {showNext && (
        <Box position='absolute' bottom={{ base: 6, md: 8 }} left='50%' transform='translateX(-50%)'>
          <Button colorScheme='teal' size='lg' onClick={handleNext}>次へ</Button>
        </Box>
      )}
    </Box>
  );
}
