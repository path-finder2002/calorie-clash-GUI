import { Box, VStack, Button, Text, HStack, Badge, Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { GameRule } from "@/models";

type Props = {
  rule: GameRule;
  onChangeRule: (r: GameRule) => void;
  onStart: () => void;
  onOptions: () => void;
  onHelp: () => void;
};

type Lang = 'ja' | 'en';

export default function TitleScreen({ rule, onChangeRule, onStart, onOptions, onHelp }: Props) {
  const [ruleHint, setRuleHint] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('calorieClash.lang') as Lang) || 'ja');

  useEffect(() => {
    try { localStorage.setItem('calorieClash.lang', lang); } catch { /* ignore */ }
  }, [lang]);

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
    <Box h="100dvh" overflow="hidden" bgGradient={isDark ? "radial(#121820 0%, #0b0f14 70%)" : "radial(#f2f4f7 0%, #e9edf2 70%)"} position="relative" px="24px">
      {/* 右上 GitHub ボタン */}
      <HStack position="absolute" top={{ base: '10px', md: '14px' }} right={{ base: '10px', md: '16px' }} zIndex={3} gap={2}>
        <Link href="https://github.com/path-finder2002/calorie-clash-GUI" target="_blank" rel="noreferrer noopener">
          <Button size="sm" variant="outline" colorScheme="teal">GitHub</Button>
        </Link>
        <Button size="sm" onClick={() => setLang(l => (l === 'ja' ? 'en' : 'ja'))} variant="outline">
          {t.langToggle}
        </Button>
        <Button size="sm" onClick={() => setIsDark(d => !d)} variant="ghost">
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </HStack>
      {/* 中央オーバーレイ（見出し＋キャッチ） */}
      <Box
        position="absolute"
        top={{ base: '30%', sm: '34%', md: '72px', lg: '96px' }}
        left={0}
        right={0}
        display="grid"
        placeItems="center"
        zIndex={2}
        pointerEvents="none"
        transform={{ base: 'translateY(-50%)', md: 'none' }}
      >
        <Box maxW={{ base: '92vw', md: '900px', lg: '1100px' }} px={{ base: 2, md: 4 }}>
          <VStack gap="8px" align="center">
          <Text
            as="h2"
            fontSize={{ base: '45px', sm: '45px', md: '36px', lg: '52px', xl: '64px' }}
            fontWeight="bold"
            letterSpacing="0.12em"
            lineHeight={1.1}
            textAlign="center"
            opacity={0.95}
            textTransform="uppercase"
          >
            {t.title}
          </Text>
          <Text
            as="h2"
            fontSize={{ base: '12px', sm: '14px', md: '16px', lg: '18px' }}
            fontWeight="semibold"
            letterSpacing="0.12em"
            lineHeight={1.2}
            textAlign="center"
            opacity={0.9}
            color={isDark ? 'whiteAlpha.900' : 'black'}
            textTransform="uppercase"
            transform={{ base: 'translateY(-6px)', md: 'translateY(-10px)' }}
            >
              {t.sub}<br />✊✌️🖐️
          </Text>
          {/* 大見出しは視覚的に干渉するため一時的に非表示 */}
          <VStack gap="12px" maxW="900px" px={{ base: 2, md: 0 }}>
            <Text fontSize={{ base: 'sm', md: 'md' }} lineHeight={1.7} textAlign="center" opacity={0.95} color={isDark ? 'whiteAlpha.900' : 'black'}>
              {t.catch1}<br />
              {t.catch2}
            </Text>
          </VStack>
          </VStack>
        </Box>
      </Box>

      {/* そのほかのUI（ボタン等）を下部に固定 */}
      <Box position="absolute" left={0} right={0} bottom={{ base: '2vh', md: '3vh', lg: '4vh' }}>
        <VStack gap="32px" w="360px" maxW="90vw" mx="auto">
          <Button size="lg" h="64px" w="100%" borderRadius="12px" colorScheme="teal" onClick={onStart}>{t.start}</Button>
          <Button size="lg" h="64px" w="100%" borderRadius="12px" variant="outline" onClick={onOptions}>{t.options}</Button>
          <Button size="lg" h="64px" w="100%" borderRadius="12px" variant="ghost" onClick={onHelp}>{t.help}</Button>
        </VStack>

        {/* ルール切り替え（ボタン群の下） */}
        <Box position="relative" display="inline-block" mt={{ base: 8, md: 10 }} w="100%">
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
            bg="blackAlpha.700"
            color="white"
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
              bg="blackAlpha.700"
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
  );
}
