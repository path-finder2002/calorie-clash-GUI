/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  mode: 'pvc' | 'pvp';
  round?: number;
  onComplete: () => void;
  playerName?: string;
  cpuName?: string;
  debugStep?: 1 | 2 | 3; // デバッグ用: 特定ステップのみ
};

// SLOT 表示用の定数はコンポーネント外で安定化
const slotBorder = '2px solid rgba(255,255,255,0.2)';
const slotFoods = {
  rock: ['唐揚げ', '餃子', 'グミ', 'カツ丼', 'ラーメン', '親子丼'],
  scissors: ['サラダ', '寿司', 'そば', '天ぷら', 'うどん', '焼きそば'],
  paper: ['パン', 'パスタ', 'プリン', 'カレー', 'オムライス', 'ハンバーガー'],
} as const;
// 横スクロール用: ベース配列をそのまま連結
const cycles = 6;
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

export default function RoundOverlay({ mode, round = 1, onComplete, playerName = 'プレイヤー', cpuName = 'CPU', debugStep }: Props) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [visible, setVisible] = useState(true);
  const [resultFoods, setResultFoods] = useState<string[] | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const vsRef = useRef<HTMLDivElement>(null);
  const cpuRef = useRef<HTMLDivElement>(null);
  const roundLabelRef = useRef<HTMLDivElement>(null);
  const roundNumRef = useRef<HTMLDivElement>(null);
  const roundSubRef = useRef<HTMLDivElement>(null);
  const slotInner1 = useRef<HTMLDivElement>(null);
  const slotInner2 = useRef<HTMLDivElement>(null);
  const slotInner3 = useRef<HTMLDivElement>(null);
  const slotBox1 = useRef<HTMLDivElement>(null);
  const slotBox2 = useRef<HTMLDivElement>(null);
  const slotBox3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // デバッグ用：特定ステップのみ表示
    if (debugStep) {
      setStep(debugStep);
      if (debugStep === 3) {
        // SLOT はタイムライン完了まで待つ
        return () => {};
      }
      const timeout = 1600; // VS/ROUND は一定時間で閉じる
      const t = setTimeout(() => { setVisible(false); onComplete(); }, timeout);
      return () => clearTimeout(t);
    }
    // 通常シーケンス: MODE(=名前表示) -> ROUND -> SLOT
    setStep(1);
    const t1 = setTimeout(() => setStep(2), 1400);
    const t2 = setTimeout(() => setStep(3), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [mode, round, onComplete, debugStep]);

  useEffect(() => {
    let killed = false;
    ensureGsap().then(() => {
      if (killed) return;
      const gsap: any = (window as any).gsap;

      if (step === 1) {
        // 初期化
        gsap.set(playerRef.current, { opacity: 0, x: -40, scale: 0.96 });
        gsap.set(cpuRef.current, { opacity: 0, x: 40, scale: 0.96 });
        gsap.set(vsRef.current, { opacity: 0 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to(playerRef.current, { opacity: 1, x: 0, duration: 0.5 })
          .to(playerRef.current, { scale: 1.04, duration: 0.18, ease: 'bounce.out' }, '>-0.12')
          .to(playerRef.current, { scale: 1.0, duration: 0.14 }, '>-0.04');
        tl.to(vsRef.current, { opacity: 1, duration: 0.2 }, '-=0.3');
        tl.to(cpuRef.current, { opacity: 1, x: 0, duration: 0.5 }, '-=0.15')
          .to(cpuRef.current, { scale: 1.04, duration: 0.18, ease: 'bounce.out' }, '>-0.12')
          .to(cpuRef.current, { scale: 1.0, duration: 0.14 }, '>-0.04');
      }

      if (step === 2) {
        gsap.set(roundLabelRef.current, { opacity: 0, letterSpacing: '0.6em' });
        gsap.set(roundNumRef.current, { opacity: 0, y: 10, scale: 0.86 });
        gsap.set(roundSubRef.current, { opacity: 0, y: 6 });
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to(roundLabelRef.current, { opacity: 1, duration: 0.3 }, 0)
          .to(roundLabelRef.current, { letterSpacing: '0.2em', duration: 0.3 }, 0)
          .to(roundNumRef.current, { opacity: 1, y: 0, scale: 1.12, duration: 0.38 }, 0.22)
          .to(roundNumRef.current, { scale: 1.0, duration: 0.22 }, '>-0.02')
          .to(roundSubRef.current, { opacity: 1, y: 0, duration: 0.22 }, '>-0.16');
      }

      if (step === 3) {
        const animateRail = (boxEl: HTMLDivElement | null, railEl: HTMLDivElement | null): Promise<string> => {
          return new Promise((resolve) => {
            if (!boxEl || !railEl) return resolve('');
            // 初期化
            gsap.set(railEl, { x: 0 });

            // 計測
            const viewport = boxEl.getBoundingClientRect();
            const centerX = viewport.left + viewport.width / 2;
            const children = Array.from(railEl.children) as HTMLElement[];
            const centers = children.map((el) => el.getBoundingClientRect().left + el.clientWidth / 2);
            // 遠目の範囲から選ぶ（減速の見せ場確保）
            const start = Math.floor(centers.length * 0.55);
            const end = Math.floor(centers.length * 0.90);
            const idx = Math.max(0, Math.min(centers.length - 1, Math.floor(start + Math.random() * (end - start))));
            const targetCenter = centers[idx];
            const targetTranslate = centerX - targetCenter;
            const overShoot = targetTranslate + 24; // 少し行き過ぎ → 戻し

            // 選択アニメーション
            const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
            tl.to(railEl, { x: overShoot, duration: 1.6 + Math.random() * 0.6 })
              .to(railEl, { x: targetTranslate, duration: 0.28, ease: 'power1.out',
                onComplete: () => {
                  const el = children[idx];
                  el?.setAttribute('aria-selected', 'true');
                  gsap.to(el, { scale: 1.08, duration: 0.12, yoyo: true, repeat: 1 });
                  resolve(el?.getAttribute('data-food') || el?.textContent || '');
                }
              });
          });
        };

        Promise.all([
          animateRail(slotBox1.current, slotInner1.current),
          animateRail(slotBox2.current, slotInner2.current),
          animateRail(slotBox3.current, slotInner3.current),
        ]).then((names) => {
          setResultFoods(names);
          setTimeout(() => { setVisible(false); onComplete(); }, 1600);
        });
      }
    });
    return () => { killed = true; };
  }, [step, onComplete]);

  useEffect(() => {
    let killed = false;
    ensureGsap().then(() => {
      if (killed) return;
      const gsap: any = (window as any).gsap;

      if (step === 1) {
        // 初期化
        gsap.set(playerRef.current, { opacity: 0, x: -40, scale: 0.96 });
        gsap.set(cpuRef.current, { opacity: 0, x: 40, scale: 0.96 });
        gsap.set(vsRef.current, { opacity: 0 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to(playerRef.current, { opacity: 1, x: 0, duration: 0.5 })
          .to(playerRef.current, { scale: 1.04, duration: 0.18, ease: 'bounce.out' }, '>-0.12')
          .to(playerRef.current, { scale: 1.0, duration: 0.14 }, '>-0.04');
        tl.to(vsRef.current, { opacity: 1, duration: 0.2 }, '-=0.3');
        tl.to(cpuRef.current, { opacity: 1, x: 0, duration: 0.5 }, '-=0.15')
          .to(cpuRef.current, { scale: 1.04, duration: 0.18, ease: 'bounce.out' }, '>-0.12')
          .to(cpuRef.current, { scale: 1.0, duration: 0.14 }, '>-0.04');
      }

      if (step === 2) {
        gsap.set(roundLabelRef.current, { opacity: 0, letterSpacing: '0.6em' });
        gsap.set(roundNumRef.current, { opacity: 0, y: 10, scale: 0.86 });
        gsap.set(roundSubRef.current, { opacity: 0, y: 6 });
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to(roundLabelRef.current, { opacity: 1, duration: 0.3 }, 0)
          .to(roundLabelRef.current, { letterSpacing: '0.2em', duration: 0.3 }, 0)
          .to(roundNumRef.current, { opacity: 1, y: 0, scale: 1.12, duration: 0.38 }, 0.22)
          .to(roundNumRef.current, { scale: 1.0, duration: 0.22 }, '>-0.02')
          .to(roundSubRef.current, { opacity: 1, y: 0, duration: 0.22 }, '>-0.16');
      }
    });
    return () => { killed = true; };
  }, [step]);

  if (!visible) return null;

  return (
    <Box position='fixed' inset={0} bg='rgba(0,0,0,1)' color='white' zIndex={10000} display='grid' placeItems='center'>
      {step === 1 ? (
        // MODE: {player} vs {cpu}
        <VStack gap={{ base: 2, md: 3 }} textAlign='center'>
          <Text ref={playerRef as any} fontWeight='black' fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}>{playerName}</Text>
          <Text ref={vsRef as any} fontWeight='extrabold' fontSize={{ base: 'clamp(16px, 5vw, 24px)', md: '24px' }} opacity={0.9}>vs</Text>
          <Text ref={cpuRef as any} fontWeight='black' fontSize={{ base: 'clamp(24px, 7vw, 36px)', md: '40px' }}>{cpuName}</Text>
        </VStack>
      ) : step === 2 ? (
        // ROUND N
        <VStack gap={2} textAlign='center'>
          <Text ref={roundLabelRef as any} fontWeight='extrabold' letterSpacing='.2em' opacity={0.9} fontSize={{ base: '18px', md: '24px' }}>ROUND</Text>
          <Text ref={roundNumRef as any} fontWeight='black' lineHeight={1} textShadow='0 0 24px rgba(255,255,255,.25)'
            fontSize={{ base: '72px', md: '120px', lg: '200px' }}>
            {round}
          </Text>
          <Text ref={roundSubRef as any} mt={1} opacity={0.7} fontSize={{ base: '12px', md: '14px' }}>Get Ready</Text>
        </VStack>
      ) : (
        // SLOT: 横スクロールのカードレール × 3 段
        <VStack gap={{ base: 4, md: 6 }} w='full' maxW='960px'>
          <Text fontWeight='extrabold' letterSpacing='.2em' opacity={0.9} textAlign='center' fontSize={{ base: '16px', md: '18px' }}>SLOT</Text>

          {/* 1段目（✊） */}
          <HStack w='full' gap={3} align='center' justify='center'>
            <Text w='40px' textAlign='center' fontSize={{ base: '20px', md: '22px' }}>✊</Text>
            <Box ref={slotBox1 as any} position='relative' w='92vw' maxW='860px' h='120px' overflow='hidden' border={slotBorder} borderRadius='lg' bg='rgba(255,255,255,0.05)'>
              <Box position='absolute' top={0} bottom={0} left='50%' w='2px' bg='teal.300' opacity={0.9} pointerEvents='none' />
              <Box ref={slotInner1 as any} display='flex' alignItems='center' gap={4} px={6} h='full'>
                {seqRock.map((f, i) => (
                  <Box key={`r-${i}`} data-food={f} flex='0 0 220px' h='100%' border='1px solid rgba(255,255,255,0.14)'
                    borderRadius='md' bg='rgba(255,255,255,0.05)' display='grid' gridTemplateRows='auto 1fr' p={3} aria-selected='false'>
                    <Text className='name' fontWeight='extrabold' fontSize='22px'>{f}</Text>
                    <Text className='meta' fontSize='13px' opacity={0.8}>候補</Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </HStack>

          {/* 2段目（✌️） */}
          <HStack w='full' gap={3} align='center' justify='center'>
            <Text w='40px' textAlign='center' fontSize={{ base: '20px', md: '22px' }}>✌️</Text>
            <Box ref={slotBox2 as any} position='relative' w='92vw' maxW='860px' h='120px' overflow='hidden' border={slotBorder} borderRadius='lg' bg='rgba(255,255,255,0.05)'>
              <Box position='absolute' top={0} bottom={0} left='50%' w='2px' bg='teal.300' opacity={0.9} pointerEvents='none' />
              <Box ref={slotInner2 as any} display='flex' alignItems='center' gap={4} px={6} h='full'>
                {seqScis.map((f, i) => (
                  <Box key={`s-${i}`} data-food={f} flex='0 0 220px' h='100%' border='1px solid rgba(255,255,255,0.14)'
                    borderRadius='md' bg='rgba(255,255,255,0.05)' display='grid' gridTemplateRows='auto 1fr' p={3} aria-selected='false'>
                    <Text className='name' fontWeight='extrabold' fontSize='22px'>{f}</Text>
                    <Text className='meta' fontSize='13px' opacity={0.8}>候補</Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </HStack>

          {/* 3段目（🖐️） */}
          <HStack w='full' gap={3} align='center' justify='center'>
            <Text w='40px' textAlign='center' fontSize={{ base: '20px', md: '22px' }}>🖐️</Text>
            <Box ref={slotBox3 as any} position='relative' w='92vw' maxW='860px' h='120px' overflow='hidden' border={slotBorder} borderRadius='lg' bg='rgba(255,255,255,0.05)'>
              <Box position='absolute' top={0} bottom={0} left='50%' w='2px' bg='teal.300' opacity={0.9} pointerEvents='none' />
              <Box ref={slotInner3 as any} display='flex' alignItems='center' gap={4} px={6} h='full'>
                {seqPap.map((f, i) => (
                  <Box key={`p-${i}`} data-food={f} flex='0 0 220px' h='100%' border='1px solid rgba(255,255,255,0.14)'
                    borderRadius='md' bg='rgba(255,255,255,0.05)' display='grid' gridTemplateRows='auto 1fr' p={3} aria-selected='false'>
                    <Text className='name' fontWeight='extrabold' fontSize='22px'>{f}</Text>
                    <Text className='meta' fontSize='13px' opacity={0.8}>候補</Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </HStack>

          {resultFoods && (
            <Text mt={2} fontWeight='bold' fontSize={{ base: '16px', md: '18px' }} textAlign='center'>
              選ばれた食べ物は{resultFoods.join('・')}でした！
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
}
