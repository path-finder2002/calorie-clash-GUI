import { useState } from 'react';
import { Box, Button, HStack, Heading, Spacer, Stack, Text, Badge } from '@chakra-ui/react';
import { useAppTheme } from '@/theme/colorMode';
import TopHeader from '@/ui/TopHeader';
import type { FoodCard, GameRule, Hand } from '@/models';
import { HAND_LABEL, judge, randomCardFor, randomHand } from '@/models';
import { loadScore, saveScore } from '@/lib';
import JankenSwiper from '@/components/JankenSwiper';
import RoundOverlay from '@/components/RoundOverlay';

type Props = { rule: GameRule; onExit: () => void; onOptions: () => void; lang: 'ja' | 'en'; onToggleLang: () => void };

type RoundResult = {
  outcome: 'win' | 'lose' | 'draw' | null;
  myHand?: Hand;
  cpuHand?: Hand;
  myCard?: FoodCard;
  cpuCard?: FoodCard;
  deltaMyPoints?: number;
  deltaCpuSatiety?: number;
};

export default function GameScreen({ rule, onExit, onOptions, lang, onToggleLang }: Props) {
  const { isDark } = useAppTheme();
  const [myPoints, setMyPoints] = useState(0);
  const [cpuPoints, setCpuPoints] = useState(0);
  const [mySat, setMySat] = useState(0);
  const [cpuSat, setCpuSat] = useState(0);
  const [round, setRound] = useState(1);
  const [result, setResult] = useState<RoundResult>({ outcome: null });
  const [finished, setFinished] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Partial<Record<Hand, FoodCard>>>({});
  const [showDraw, setShowDraw] = useState(true);

  const percentMy = Math.min(100, Math.round((mySat / rule.physique) * 100));
  const percentCpu = Math.min(100, Math.round((cpuSat / rule.physique) * 100));

  function nextRound() {
    setRound(r => r + 1);
    setResult({ outcome: null });
    setAssigned({});
    setShowDraw(true);
  }

  function handleSelect(hand: Hand) {
    const cpu = randomHand();
    const outcome = judge(hand, cpu);
    if (rule.mode === 'simple') {
      if (outcome === 'win') setMyPoints(p => p + 1);
      if (outcome === 'lose') setCpuPoints(p => p + 1);
      const done = checkFinish({ nextMy: outcome === 'win' ? myPoints + 1 : myPoints, nextCpu: outcome === 'lose' ? cpuPoints + 1 : cpuPoints, nextMySat: mySat, nextCpuSat: cpuSat });
      if (!done) setResult({ outcome, myHand: hand, cpuHand: cpu });
    } else {
      const myCard = assigned[hand] ?? randomCardFor(hand, rule.deck);
      const cpuCard = randomCardFor(cpu, rule.deck);
      if (outcome === 'win') {
        const np = myPoints + myCard.points;
        const nsCpu = cpuSat + cpuCard.satiety; // 敗者は自身カードの満腹値を加算
        setMyPoints(np);
        setCpuSat(nsCpu);
        const done = checkFinish({ nextMy: np, nextCpu: cpuPoints, nextMySat: mySat, nextCpuSat: nsCpu });
        if (!done) setResult({ outcome, myHand: hand, cpuHand: cpu, myCard, cpuCard, deltaMyPoints: myCard.points, deltaCpuSatiety: cpuCard.satiety });
      } else if (outcome === 'lose') {
        const npCpu = cpuPoints + cpuCard.points;
        const nsMy = mySat + myCard.satiety;
        setCpuPoints(npCpu);
        setMySat(nsMy);
        const done = checkFinish({ nextMy: myPoints, nextCpu: npCpu, nextMySat: nsMy, nextCpuSat: cpuSat });
        if (!done) setResult({ outcome, myHand: hand, cpuHand: cpu, myCard, cpuCard });
      } else {
        if (rule.tieRule === 'satiety_plus_both') {
          const nsMy = mySat + myCard.satiety;
          const nsCpu = cpuSat + cpuCard.satiety;
          setMySat(nsMy); setCpuSat(nsCpu);
          const done = checkFinish({ nextMy: myPoints, nextCpu: cpuPoints, nextMySat: nsMy, nextCpuSat: nsCpu });
          if (!done) setResult({ outcome, myHand: hand, cpuHand: cpu, myCard, cpuCard });
        } else {
          setResult({ outcome, myHand: hand, cpuHand: cpu, myCard, cpuCard });
        }
      }
    }
  }

  function checkFinish({ nextMy, nextCpu, nextMySat, nextCpuSat }: { nextMy: number; nextCpu: number; nextMySat: number; nextCpuSat: number; }): boolean {
    const goal = rule.targetPoints;
    if (nextMy >= goal || nextCpu >= goal) {
      endGame(nextMy >= goal ? 'あなたの勝ち！' : 'CPUの勝ち…');
      return true;
    }
    if (rule.mode === 'original' && (nextMySat >= rule.physique || nextCpuSat >= rule.physique)) {
      endGame(nextCpuSat >= rule.physique ? 'あなたの勝ち！（相手満腹）' : 'CPUの勝ち…（満腹）');
      return true;
    }
    return false;
  }

  function endGame(message: string) {
    setFinished(message);
    // ベスト記録保存
    const s = loadScore();
    if (myPoints > s.bestPoints) saveScore({ bestPoints: myPoints });
  }

  function resetAll() {
    setMyPoints(0); setCpuPoints(0); setMySat(0); setCpuSat(0); setRound(1); setResult({ outcome: null }); setFinished(null);
  }

  const choiceSwiper = (
    <JankenSwiper onSelect={(h) => handleSelect(h)} cards={assigned} />
  );

  // 抽選結果をデッキにマップ
  function findCard(hand: Hand, name: string): FoodCard | null {
    return rule.deck.find(c => c.hand === hand && c.name === name) || null;
  }

  return (
    <Box px={{ base: 0, md: 0 }} py={0} color={isDark ? 'whiteAlpha.900' : 'gray.900'}>
      <TopHeader lang={lang} onToggleLang={onToggleLang} />
      <Box px={{ base: 4, md: 8 }} py={6}>
      <HStack>
        <Heading size='md'>ラウンド {round}</Heading>
        <Badge ml={2} colorScheme='teal'>{rule.mode === 'original' ? '原作準拠' : '簡易'}</Badge>
        <Spacer />
        <Button onClick={onOptions} variant='ghost'>オプション</Button>
        <Button onClick={onExit} colorScheme='gray' variant='outline'>タイトルへ</Button>
      </HStack>

      <HStack mt={6} align='start' gap={8}>
        <Box>
          <Text fontSize='sm' opacity={0.8}>あなたのスコア</Text>
          <Text fontSize='3xl' fontWeight='bold'>{myPoints}</Text>
          {rule.mode === 'original' && (
            <Box mt={2}>
              <Box mt={1} w='240px' maxW='70vw' h='8px' bg='gray.700' borderRadius='md' overflow='hidden'>
                <Box h='100%' w={`${percentMy}%`} bg='teal.400' />
              </Box>
            </Box>
          )}
        </Box>
        <Box>
          <Text fontSize='sm' opacity={0.8}>CPUスコア</Text>
          <Text fontSize='3xl' fontWeight='bold'>{cpuPoints}</Text>
          {rule.mode === 'original' && (
            <Box mt={2}>
              <Box mt={1} w='240px' maxW='70vw' h='8px' bg='gray.700' borderRadius='md' overflow='hidden'>
                <Box h='100%' w={`${percentCpu}%`} bg='red.400' />
              </Box>
            </Box>
          )}
        </Box>
      </HStack>

      {!finished && (
        <Box mt={8} borderWidth='1px' borderRadius='md' p={6} bg={isDark ? 'blackAlpha.400' : 'blackAlpha.50'}>
          <Stack gap={4} align='center'>
              <Heading size='sm'>手を選んでください</Heading>
              {!showDraw ? choiceSwiper : <Text>抽選中...</Text>}
              {result.outcome && (
                <Box textAlign='center' mt={2}>
                  <Text fontSize='lg'>結果: {result.outcome === 'win' ? 'WIN' : result.outcome === 'lose' ? 'LOSE' : 'DRAW'}</Text>
                  <Text mt={1} opacity={0.8}>
                    あなた: {result.myHand && HAND_LABEL[result.myHand]} {result.myCard?.name ? `（${result.myCard.name}）` : ''} / CPU: {result.cpuHand && HAND_LABEL[result.cpuHand]} {result.cpuCard?.name ? `（${result.cpuCard.name}）` : ''}
                  </Text>
                  <Button mt={4} onClick={nextRound} colorScheme='teal'>次へ</Button>
                </Box>
              )}
          </Stack>
        </Box>
      )}

      {finished && (
        <Box mt={8} borderWidth='1px' borderRadius='md' p={6} textAlign='center' bg={isDark ? 'blackAlpha.400' : 'blackAlpha.50'}>
          <Heading size='md' mb={2}>ゲーム終了</Heading>
          <Text>{finished}</Text>
          <HStack mt={6} justify='center' gap={3}>
            <Button colorScheme='teal' onClick={resetAll}>もう一度</Button>
            <Button variant='outline' onClick={onExit}>タイトルへ</Button>
          </HStack>
        </Box>
      )}
      </Box>
      {showDraw && (
        <RoundOverlay
          mode='pvc'
          round={round}
          playerName='あなた'
          cpuName='CPU'
          onResult={(names) => {
            const next: Partial<Record<Hand, FoodCard>> = {};
            (['rock','scissors','paper'] as Hand[]).forEach((h) => {
              const n = (names as Record<Hand, string>)[h];
              if (n) {
                const c = findCard(h, n);
                if (c) next[h] = c;
              }
            });
            setAssigned(next);
          }}
          onComplete={() => setShowDraw(false)}
        />
      )}
    </Box>
  );
}
