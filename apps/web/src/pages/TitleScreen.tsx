import { Box, VStack, Button, Text, HStack, Badge, Card } from "@chakra-ui/react";
import { useState } from "react";
import type { GameRule } from "@/models";
import { useAppTheme } from "@/theme/colorMode";
import RoundOverlay from "@/components/RoundOverlay";
import GameStartAnimation from "@/components/GameStartAnimation";

type Props = {
  rule: GameRule;
  onChangeRule: (r: GameRule) => void;
  onStart: () => void;
  onOptions: () => void;
  onHelp: () => void;
  lang: Lang;
};

type Lang = 'ja' | 'en';

export default function TitleScreen({ rule, onChangeRule, onStart, onOptions, onHelp, lang }: Props) {
  const [ruleHint, setRuleHint] = useState<string | null>(null);
  const { isDark } = useAppTheme();
  const [debugOpen, setDebugOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState<'vs' | 'round' | 'slot' | false>(false);
  const [debugRound, setDebugRound] = useState(0);

  // 言語の永続化は App 側で実施


  const t = lang === 'ja'
    ? {
        title: '満腹ジャンケン',
        sub: '満腹ジャンケン',
        catch1: '勝てばポイント、負ければ食事。',
        catch2: '胃袋の限界バトルが今、始まる。',
        start: 'スタート',
        options: 'オプション',
        help: 'ヘルプ',
        rule: 'ルール',
        original: '原作準拠',
        simple: '簡易',
        hintOriginal: '原作準拠: 勝てばポイント、負けた側に満腹度加算。満腹上限に達しても決着。',
        hintSimple: '簡易: 勝ちで+1点。先に目標ポイントに到達した方が勝ち。',
        langToggle: 'EN',
      }
    : {
        title: 'Calorie Clash',
        sub: 'Stomach Janken',
        catch1: 'Win points if you win, eat if you lose.',
        catch2: 'The ultimate stomach battle begins now.',
        start: 'Start',
        options: 'Options',
        help: 'Help',
        rule: 'Rules',
        original: 'Original',
        simple: 'Simple',
        hintOriginal: 'Original: Winner gains points, loser gains satiety. Reaches satiety limit ends the game.',
        hintSimple: 'Simple: +1 point for a win. First to target points wins.',
        langToggle: '日本語',
      };
  return (
    <>
    <Box minH="100dvh" display="flex" flexDir="column" px={{ base: 3, md: 6 }} py={{ base: 4, md: 6 }} color={isDark ? 'whiteAlpha.900' : 'gray.900'}>
      {/* 右上のボタンは App 側で共通表示 */}
      {/* ヒーロー（見出し＋キャッチ） */}
      <Box flex="1" display="grid" placeItems="center" textAlign="center">
        <Box maxW={{ base: '92vw', md: '900px', lg: '1100px' }} px={{ base: 2, md: 4 }}>
          <VStack gap={{ base: 2, md: 3 }} align="center">
          <Text
            as="h2"
            fontSize={{
              base: 'clamp(39px, 11.5vw, 59px)',
              sm: 'clamp(39px, 10vw, 59px)',
              md: '43px',
              lg: '51px',
              xl: '59px',
            }}
            fontWeight="bold"
            letterSpacing={{ base: '0.06em', md: '0.12em' }}
            lineHeight={1.1}
            textAlign="center"
            opacity={0.95}
            textTransform="uppercase"
            color={isDark ? 'white' : 'black'}
          >
            {t.title}
          </Text>
          <Text
            as="h2"
            fontSize={{ base: 'clamp(16px, 4.8vw, 20px)', md: '16px', lg: '18px' }}
            fontWeight="semibold"
            letterSpacing="0.12em"
            lineHeight={1.2}
            textAlign="center"
            opacity={0.9}
            color={isDark ? 'whiteAlpha.900' : 'black'}
            textTransform="uppercase"
            mt={{ base: -1, md: -2 }}
            >
              {t.sub}<br />✊✌️🖐️
          </Text>
          {/* 大見出しは視覚的に干渉するため一時的に非表示 */}
          <VStack gap={{ base: 2, md: 3 }} maxW="900px" px={{ base: 2, md: 0 }}>
            <Text fontSize={{ base: 'sm', md: 'md' }} lineHeight={1.6} textAlign="center" opacity={0.95} color={isDark ? 'whiteAlpha.900' : 'black'}>
              {t.catch1}<br />
              {t.catch2}
            </Text>
          </VStack>
          </VStack>
        </Box>
      </Box>

      {/* デバッグメニュー（開発補助） */}
      <Box position="fixed" bottom={{ base: 4, md: 6 }} left={{ base: 4, md: 6 }} zIndex={20}>
        <Card.Root p={3} borderRadius='md' bg='surface' borderWidth='1px' borderColor='border'>
          <HStack gap={2}>
            <Button size='sm' variant='outline' onClick={() => setDebugOpen(v => !v)}>デバッグ</Button>
            {debugOpen && (
              <HStack gap={2}>
                <Button size='sm' onClick={() => { setDebugRound(r => r + 1); setShowOverlay('vs'); }}>VS</Button>
                <Button size='sm' onClick={() => { setDebugRound(r => r + 1); setShowOverlay('round'); }}>ROUND</Button>
                <Button size='sm' onClick={() => { setDebugRound(r => r + 1); setShowOverlay('slot'); }}>SLOT</Button>
              </HStack>
            )}
          </HStack>
        </Card.Root>
      </Box>

      {/* ボタン群（安全に下部寄せ） */}
      <Box as="nav" mt={{ base: 4, md: 6 }}>
        <VStack gap={{ base: 3, md: 4 }} w="min(360px, 92vw)" mx="auto">
          <Button
            size="lg" h={{ base: '56px', md: '64px' }} w="100%" borderRadius="12px"
            onClick={onStart}
            bg={isDark ? 'teal.300' : 'teal.500'}
            color={isDark ? 'gray.900' : 'white'}
            _hover={{ bg: isDark ? 'teal.200' : 'teal.400' }}
            _active={{ bg: isDark ? 'teal.100' : 'teal.600' }}
          >{t.start}</Button>
          <Button
            size="lg" h={{ base: '56px', md: '64px' }} w="100%" borderRadius="12px"
            variant="outline"
            color={isDark ? 'white' : 'gray.900'}
            borderColor={isDark ? 'whiteAlpha.700' : 'gray.400'}
            _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.50' }}
            _active={{ bg: isDark ? 'whiteAlpha.300' : 'blackAlpha.100' }}
            onClick={onOptions}
          >{t.options}</Button>
          <Button
            size="lg" h={{ base: '56px', md: '64px' }} w="100%" borderRadius="12px"
            variant="ghost"
            color={isDark ? 'whiteAlpha.900' : 'gray.700'}
            _hover={{ bg: isDark ? 'whiteAlpha.100' : 'blackAlpha.50' }}
            _active={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
            onClick={onHelp}
          >{t.help}</Button>
        </VStack>

        {/* ルール切り替え（ボタン群の下） */}
        <Box position="relative" display="inline-block" mt={{ base: 6, md: 8 }} w="100%">
          <HStack gap="12px" align="center" justify="center">
            <Badge colorScheme="purple">{t.rule}</Badge>
            <HStack gap="8px">
              <Button
                size="sm"
                variant={rule.mode === 'original' ? 'solid' : 'outline'}
                onClick={() => onChangeRule({ ...rule, mode: 'original' })}
                onMouseEnter={() => setRuleHint(t.hintOriginal)}
                onMouseLeave={() => setRuleHint(null)}
                onFocus={() => setRuleHint(t.hintOriginal)}
                onBlur={() => setRuleHint(null)}
                title={t.hintOriginal}
              >
                {t.original}
              </Button>
              <Button
                size="sm"
                variant={rule.mode === 'simple' ? 'solid' : 'outline'}
                onClick={() => onChangeRule({ ...rule, mode: 'simple' })}
                onMouseEnter={() => setRuleHint(t.hintSimple)}
                onMouseLeave={() => setRuleHint(null)}
                onFocus={() => setRuleHint(t.hintSimple)}
                onBlur={() => setRuleHint(null)}
                title={t.hintSimple}
              >
                {t.simple}
              </Button>
            </HStack>
          </HStack>
          {/* キャプション（重なり防止のため、発生位置も少し下げる） */}
          <Box
            position="absolute"
            left="50%"
            top="calc(100% + 12px)"
            transform={ruleHint ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0.98)"}
            opacity={ruleHint ? 1 : 0}
            transition="opacity 0.15s ease, transform 0.15s ease"
            pointerEvents="none"
            bg={isDark ? 'blackAlpha.700' : 'whiteAlpha.900'}
            color={isDark ? 'white' : 'gray.900'}
            borderRadius="10px"
            px="14px"
            py="8px"
            w="80vw"
            maxW="560px"
            zIndex={1}
          >
            <Text fontSize="sm" textAlign="center" whiteSpace="normal" wordBreak="break-word">{ruleHint ?? ''}</Text>
            <Box
              position="absolute"
              left="50%"
              top="-6px"
              transform="translateX(-50%) rotate(45deg)"
              w="10px"
              h="10px"
              bg={isDark ? 'blackAlpha.700' : 'whiteAlpha.900'}
            />
          </Box>
        </Box>

        <VStack gap="4px" mt="20px" w="100%" align="center">
          <Text fontSize="sm" opacity={0.75}>© {new Date().getFullYear()} Team CC — v0.1.0</Text>
          <Text fontSize="xs" opacity={0.7}>Inspired by Wednesday  downtown.</Text>
          <Text fontSize="xs" opacity={0.8}>
            <a
              href="https://duckduckgo.com/?q=%E6%BA%80%E8%85%B9%E3%82%B8%E3%83%A3%E3%83%B3%E3%82%B1%E3%83%B3"
              target="_blank"
              rel="noreferrer noopener"
              style={{ textDecoration: 'underline' }}
            >
              https://www.tbs.co.jp/suiyobinodowntown/
            </a>
          </Text>
        </VStack>
      </Box>
    </Box>
    {showOverlay === 'vs' && (
      <GameStartAnimation onComplete={() => setShowOverlay('round')} />
    )}
    {(showOverlay === 'round' || showOverlay === 'slot') && (
      <RoundOverlay
        mode='pvc'
        round={debugRound}
        debugStep={showOverlay === 'round' ? 2 : 3}
        onComplete={() => setShowOverlay(false)}
        playerName='プレイヤー'
        cpuName='CPU'
      />
    )}
    </>
  );
}
