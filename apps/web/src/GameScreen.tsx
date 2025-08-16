import { useMemo, useState } from 'react';
import { Box, Button, ButtonGroup, Card, CardBody, Flex, HStack, Heading, Progress, Spacer, Stack, Stat, StatGroup, StatHelpText, StatLabel, StatNumber, Tag, Text } from '@chakra-ui/react';
import { FoodCard, GameRule, HAND_EMOJI, HAND_LABEL, Hand, judge, randomCardFor, randomHand } from './models';
import { loadScore, saveScore } from './storage';

type Props = { rule: GameRule; onExit: () => void; onOptions: () => void };

type RoundResult = {
  outcome: 'win' | 'lose' | 'draw' | null;
  myHand?: Hand;
  cpuHand?: Hand;
  myCard?: FoodCard;
  cpuCard?: FoodCard;
  deltaMyPoints?: number;
  deltaCpuSatiety?: number;
};

export default function GameScreen({ rule, onExit, onOptions }: Props) {
  const [myPoints, setMyPoints] = useState(0);
  const [cpuPoints, setCpuPoints] = useState(0);
  const [mySat, setMySat] = useState(0);
  const [cpuSat, setCpuSat] = useState(0);
  const [round, setRound] = useState(1);
  const [result, setResult] = useState<RoundResult>({ outcome: null });
  const [finished, setFinished] = useState<string | null>(null);

  const percentMy = Math.min(100, Math.round((mySat / rule.physique) * 100));
  const percentCpu = Math.min(100, Math.round((cpuSat / rule.physique) * 100));

  function nextRound() {
    setRound(r => r + 1);
    setResult({ outcome: null });
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
      const myCard = randomCardFor(hand, rule.deck);
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

  const choiceButtons = (
    <ButtonGroup isAttached variant='outline' size='lg'>
      {(['rock','scissors','paper'] as Hand[]).map(h => (
        <Button key={h} onClick={() => handleSelect(h)}>{HAND_EMOJI[h]} {HAND_LABEL[h]}</Button>
      ))}
    </ButtonGroup>
  );

  return (
    <Box px={{ base: 4, md: 8 }} py={6}>
      <HStack>
        <Heading size='md'>ラウンド {round}</Heading>
        <Tag ml={2} colorScheme='teal'>{rule.mode === 'original' ? '原作準拠' : '簡易'}</Tag>
        <Spacer />
        <Button onClick={onOptions} variant='ghost'>オプション</Button>
        <Button onClick={onExit} colorScheme='gray' variant='outline'>タイトルへ</Button>
      </HStack>

      <StatGroup mt={6}>
        <Stat>
          <StatLabel>あなたのスコア</StatLabel>
          <StatNumber>{myPoints}</StatNumber>
          {rule.mode === 'original' && (
            <StatHelpText>
              満腹度
              <Progress mt={2} borderRadius='md' value={percentMy} />
            </StatHelpText>
          )}
        </Stat>
        <Stat>
          <StatLabel>CPUスコア</StatLabel>
          <StatNumber>{cpuPoints}</StatNumber>
          {rule.mode === 'original' && (
            <StatHelpText>
              満腹度
              <Progress mt={2} borderRadius='md' value={percentCpu} colorScheme='red' />
            </StatHelpText>
          )}
        </Stat>
      </StatGroup>

      {!finished && (
        <Card mt={8}>
          <CardBody>
            <Stack spacing={4} align='center'>
              <Heading size='sm'>手を選んでください</Heading>
              {choiceButtons}
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
          </CardBody>
        </Card>
      )}

      {finished && (
        <Card mt={8}>
          <CardBody textAlign='center'>
            <Heading size='md' mb={2}>ゲーム終了</Heading>
            <Text>{finished}</Text>
            <HStack mt={6} justify='center'>
              <Button colorScheme='teal' onClick={resetAll}>もう一度</Button>
              <Button variant='outline' onClick={onExit}>タイトルへ</Button>
            </HStack>
          </CardBody>
        </Card>
      )}
    </Box>
  );
}

