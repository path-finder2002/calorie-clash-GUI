import { Box, VStack, Heading, Button, Text, HStack, Badge } from "@chakra-ui/react";
import type { GameRule } from "./models";

type Props = {
  rule: GameRule;
  onChangeRule: (r: GameRule) => void;
  onStart: () => void;
  onOptions: () => void;
  onHelp: () => void;
};

export default function TitleScreen({ rule, onChangeRule, onStart, onOptions, onHelp }: Props) {
  return (
    <Box minH="100dvh" bgGradient="radial(#121820 0%, #0b0f14 70%)" display="grid" placeItems="center" px="24px">
      <VStack gap="28px">
        <VStack gap="8px">
          <Heading as="h1" size="5xl" textAlign="center" maxW="80vw" letterSpacing="0.02em" textShadow="0 12px 28px rgba(0,0,0,0.45)"
            bgGradient="linear(180deg, #EFFFFF, #B6F7FF 50%, #7AE3FF)" bgClip="text">
            カロリークラッシュ
          </Heading>
          <Heading as="h1" size="4xl" textAlign="center" maxW="80vw" letterSpacing="0.02em" opacity={0.95}
            textShadow="0 8px 24px rgba(0,0,0,0.35)" bgGradient="linear(180deg, #EFFFFF, #CBEFFF 50%, #9FE6FF)" bgClip="text">
            Calorie Clash
          </Heading>
        </VStack>

        <VStack gap="6px" maxW="80vw">
          <Text fontSize={{ base: 'md', md: 'lg' }} textAlign="center" opacity={0.95}>
            勝てばポイント、負ければ食事。胃袋の限界バトルが今、始まる。
          </Text>
          <Text fontSize={{ base: 'sm', md: 'md' }} textAlign="center" opacity={0.85}>
            Win points if you win, eat if you lose. The ultimate stomach battle begins now.
          </Text>
        </VStack>

        <HStack gap="12px" align="center">
          <Badge colorScheme="purple">ルール</Badge>
          <HStack gap="8px">
            <Button size="sm" variant={rule.mode === 'original' ? 'solid' : 'outline'} onClick={() => onChangeRule({ ...rule, mode: 'original' })}>原作準拠</Button>
            <Button size="sm" variant={rule.mode === 'simple' ? 'solid' : 'outline'} onClick={() => onChangeRule({ ...rule, mode: 'simple' })}>簡易</Button>
          </HStack>
        </HStack>

        <VStack gap="24px" w="360px" maxW="90vw">
          <Button size="lg" h="64px" w="100%" borderRadius="12px" colorScheme="teal" onClick={onStart}>スタート</Button>
          <Button size="lg" h="64px" w="100%" borderRadius="12px" variant="outline" onClick={onOptions}>オプション</Button>
          <Button size="lg" h="64px" w="100%" borderRadius="12px" variant="ghost" onClick={onHelp}>ヘルプ</Button>
        </VStack>

        <VStack gap="2px" mt="8px">
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
      </VStack>
    </Box>
  );
}
