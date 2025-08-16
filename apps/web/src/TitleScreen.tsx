import { Box, VStack, Button, Text, HStack, Badge } from "@chakra-ui/react";
import { useState } from "react";
import type { GameRule } from "./models";

type Props = {
  rule: GameRule;
  onChangeRule: (r: GameRule) => void;
  onStart: () => void;
  onOptions: () => void;
  onHelp: () => void;
};

export default function TitleScreen({ rule, onChangeRule, onStart, onOptions, onHelp }: Props) {
  const [ruleHint, setRuleHint] = useState<string | null>(null);
  return (
    <Box h="100dvh" overflow="hidden" bgGradient="radial(#121820 0%, #0b0f14 70%)" position="relative" px="24px">
      {/* 中央オーバーレイ（見出し＋キャッチ） */}
      <Box
        position="absolute"
        top={{ base: '96px', md: '120px', lg: '140px' }}
        left={0}
        right={0}
        display="grid"
        placeItems="center"
        zIndex={2}
        pointerEvents="none"
      >
        <Box maxW={{ base: '92vw', md: '900px', lg: '1100px' }} px={{ base: 2, md: 4 }}>
          <VStack gap="8px" align="center">
          <Text
            as="h2"
            fontSize={{ base: '18px', sm: '22px', md: '30px', lg: '44px', xl: '52px' }}
            fontWeight="bold"
            letterSpacing="0.12em"
            lineHeight={1.1}
            textAlign="center"
            opacity={0.95}
            textTransform="uppercase"
          >
            満腹ジャンケン
          </Text>
          <Text
            as="h2"
            fontSize={{ base: '12px', sm: '14px', md: '16px', lg: '18px' }}
            fontWeight="semibold"
            letterSpacing="0.12em"
            lineHeight={1.2}
            textAlign="center"
            opacity={0.9}
            color="whiteAlpha.900"
            textTransform="uppercase"
          >
            Stomach Janken
          </Text>
          {/* 大見出しは視覚的に干渉するため一時的に非表示 */}
          <VStack gap="12px" maxW="900px" px={{ base: 2, md: 0 }}>
            <Text fontSize={{ base: 'sm', md: 'md' }} lineHeight={1.6} textAlign="center" opacity={0.95}>
              勝てばポイント、負ければ食事。<br />
              胃袋の限界バトルが今、始まる。
            </Text>
            <Text fontSize={{ base: 'sm', md: 'md' }} lineHeight={1.7} textAlign="center" opacity={0.95} color="whiteAlpha.900">
              Win points if you win, eat if you lose.<br />
              The ultimate stomach battle begins now.
            </Text>
          </VStack>
          </VStack>
        </Box>
      </Box>

      {/* そのほかのUI（ボタン等）を下部に固定 */}
      <Box position="absolute" left={0} right={0} bottom={{ base: '2vh', md: '3vh', lg: '4vh' }}>
        <VStack gap="32px" w="360px" maxW="90vw" mx="auto">
          <Button size="lg" h="64px" w="100%" borderRadius="12px" colorScheme="teal" onClick={onStart}>スタート</Button>
          <Button size="lg" h="64px" w="100%" borderRadius="12px" variant="outline" onClick={onOptions}>オプション</Button>
          <Button size="lg" h="64px" w="100%" borderRadius="12px" variant="ghost" onClick={onHelp}>ヘルプ</Button>
        </VStack>

        {/* ルール切り替え（ボタン群の下） */}
        <Box position="relative" display="inline-block" mt={{ base: 8, md: 10 }} w="100%">
          <HStack gap="12px" align="center" justify="center">
            <Badge colorScheme="purple">ルール</Badge>
            <HStack gap="8px">
              <Button
                size="sm"
                variant={rule.mode === 'original' ? 'solid' : 'outline'}
                onClick={() => onChangeRule({ ...rule, mode: 'original' })}
                onMouseEnter={() => setRuleHint('原作準拠: 勝てばポイント、負けた側に満腹度加算。満腹上限に達しても決着。')}
                onMouseLeave={() => setRuleHint(null)}
                onFocus={() => setRuleHint('原作準拠: 勝てばポイント、負けた側に満腹度加算。満腹上限に達しても決着。')}
                onBlur={() => setRuleHint(null)}
                title="原作準拠: 勝てばポイント、負けた側に満腹度加算。満腹上限に達しても決着。"
              >
                原作準拠
              </Button>
              <Button
                size="sm"
                variant={rule.mode === 'simple' ? 'solid' : 'outline'}
                onClick={() => onChangeRule({ ...rule, mode: 'simple' })}
                onMouseEnter={() => setRuleHint('簡易: 勝ちで+1点。先に目標ポイントに到達した方が勝ち。')}
                onMouseLeave={() => setRuleHint(null)}
                onFocus={() => setRuleHint('簡易: 勝ちで+1点。先に目標ポイントに到達した方が勝ち。')}
                onBlur={() => setRuleHint(null)}
                title="簡易: 勝ちで+1点。先に目標ポイントに到達した方が勝ち。"
              >
                簡易
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
