import { Box, VStack, Heading, Button, Text, HStack, Badge } from "@chakra-ui/react";
import { GameRule } from "./models";

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
      <VStack spacing="36px">
        <Heading as="h1" size="3xl" textAlign="center" maxW="70vw" letterSpacing="0.02em" textShadow="0 8px 24px rgba(0,0,0,0.35)"
          bgGradient="linear(180deg, #EFFFFF, #B6F7FF 50%, #7AE3FF)" bgClip="text">
          Calorie Clash
        </Heading>

        <HStack spacing="12px" align="center">
          <Badge colorScheme="purple">ルール</Badge>
          <HStack spacing="8px">
            <Button size="sm" variant={rule.mode === 'original' ? 'solid' : 'outline'} onClick={() => onChangeRule({ ...rule, mode: 'original' })}>原作準拠</Button>
            <Button size="sm" variant={rule.mode === 'simple' ? 'solid' : 'outline'} onClick={() => onChangeRule({ ...rule, mode: 'simple' })}>簡易</Button>
          </HStack>
        </HStack>

        <VStack spacing="24px" w="360px" maxW="90vw">
          <Button size="lg" h="64px" w="100%" borderRadius="12px" colorScheme="teal" onClick={onStart}>スタート</Button>
          <Button size="lg" h="64px" w="100%" borderRadius="12px" variant="outline" onClick={onOptions}>オプション</Button>
          <Button size="lg" h="64px" w="100%" borderRadius="12px" variant="ghost" onClick={onHelp}>ヘルプ</Button>
        </VStack>

        <Text fontSize="sm" opacity={0.75} mt="8px">© {new Date().getFullYear()} Team CC — v0.1.0</Text>
      </VStack>
    </Box>
  );
}
