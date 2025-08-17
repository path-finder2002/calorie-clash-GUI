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
  rock: ['唐揚げ', '餃子', 'グミ'],
  scissors: ['サラダ', '寿司', 'そば'],
  paper: ['パン', 'パスタ', 'プリン'],
} as const;
const pingpong = (arr: readonly string[]) => [...arr, ...arr.slice(1, -1).reverse()];
const PP = {
  rock: pingpong(slotFoods.rock),
  scissors: pingpong(slotFoods.scissors),
  paper: pingpong(slotFoods.paper),
};
const repeats = 3;
const seqRock = Array.from({ length: repeats }).flatMap(() => PP.rock);
const seqScis = Array.from({ length: repeats }).flatMap(() => PP.scissors);
const seqPap  = Array.from({ length: repeats }).flatMap(() => PP.paper);

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
        const itemH = 40;
        // それぞれの停止ターゲット（例: 餃子 / 寿司 / パン）
        const targets = { rock: '餃子', scissors: '寿司', paper: 'パン' } as const;
        // 最後に現れるインデックス（長めに回してから止める）
        const lastIndexOf = (arr: string[], val: string) => {
          for (let i = arr.length - 1; i >= 0; i--) if (arr[i] === val) return i;
          return arr.length - 2; // fallback
        };
        const idxR = lastIndexOf(seqRock, targets.rock);
        const idxS = lastIndexOf(seqScis, targets.scissors);
        const idxP = lastIndexOf(seqPap,  targets.paper);
        // 中央（2行目）に揃えるため、中心は index 1 相当
        const yR = -itemH * (idxR - 1);
        const yS = -itemH * (idxS - 1);
        const yP = -itemH * (idxP - 1);

        // 初期化
        gsap.set([slotInner1.current, slotInner2.current, slotInner3.current], { y: 0 });

        // 縦回転 → 停止ポップ（scale yoyo）
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        tl.to(slotInner1.current, { y: yR, duration: 1.8 })
          .to(slotBox1.current, { scale: 1.06, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, '>-0.02')
          .to(slotInner2.current, { y: yS, duration: 2.0 }, '-=1.3')
          .to(slotBox2.current, { scale: 1.06, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, '>-0.02')
          .to(slotInner3.current, { y: yP, duration: 2.2 }, '-=1.3')
          .to(slotBox3.current, { scale: 1.06, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, '>-0.02')
          .add(() => { setVisible(false); onComplete(); });
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
        // SLOT: ✊✌️🖐️ の縦スクロール演出
        <VStack gap={{ base: 3, md: 4 }}>
          <Text fontWeight='extrabold' letterSpacing='.2em' opacity={0.9} textAlign='center' fontSize={{ base: '16px', md: '18px' }}>SLOT</Text>
          <Box position='relative'>
          <HStack gap={{ base: 2, md: 3 }}>
            {/* ✊ */}
            <VStack gap={2}>
              <Text fontSize={{ base: '20px', md: '22px' }}>✊</Text>
              <Box ref={slotBox1 as any} w='90px' h='120px' overflow='hidden' border={slotBorder} borderRadius='md' bg='rgba(255,255,255,0.05)'>
                <VStack ref={slotInner1 as any} gap={0}>
                  {seqRock.map((f, i) => (
                    <Box key={`r-${i}`} h='40px' w='full' display='grid' placeItems='center'>{f}</Box>
                  ))}
                </VStack>
              </Box>
            </VStack>
            {/* ✌️ */}
            <VStack gap={2}>
              <Text fontSize={{ base: '20px', md: '22px' }}>✌️</Text>
              <Box ref={slotBox2 as any} w='90px' h='120px' overflow='hidden' border={slotBorder} borderRadius='md' bg='rgba(255,255,255,0.05)'>
                <VStack ref={slotInner2 as any} gap={0}>
                  {seqScis.map((f, i) => (
                    <Box key={`s-${i}`} h='40px' w='full' display='grid' placeItems='center'>{f}</Box>
                  ))}
                </VStack>
              </Box>
            </VStack>
            {/* 🖐️ */}
            <VStack gap={2}>
              <Text fontSize={{ base: '20px', md: '22px' }}>🖐️</Text>
              <Box ref={slotBox3 as any} w='90px' h='120px' overflow='hidden' border={slotBorder} borderRadius='md' bg='rgba(255,255,255,0.05)'>
                <VStack ref={slotInner3 as any} gap={0}>
                  {seqPap.map((f, i) => (
                    <Box key={`p-${i}`} h='40px' w='full' display='grid' placeItems='center'>{f}</Box>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </HStack>
          <Box position='absolute' left='-8px' right='-8px' top='60px' height='0' borderTop='2px dashed rgba(255,255,255,0.4)' pointerEvents='none' />
          </Box>
        </VStack>
      )}
    </Box>
  );
}
