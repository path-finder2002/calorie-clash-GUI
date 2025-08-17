import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useAppTheme } from '@/theme/colorMode';

export default function HelpScreen({ onBack }: { onBack: () => void }) {
  const { isDark } = useAppTheme();
  return (
    <Box px={{ base: 4, md: 8 }} py={6} color={isDark ? 'whiteAlpha.900' : 'gray.900'}>
      <Heading size='lg' mb={4}>ヘルプ</Heading>
      <Text mb={2}>満腹じゃんけん（Calorie Clash）の遊び方（MVP）</Text>
      <Box as='ul' pl={5} style={{ listStyle: 'disc' }}>
        <Box as='li' mb={1}>タイトルで「原作準拠/簡易」を選んでスタート。</Box>
        <Box as='li' mb={1}>ゲーム画面で「グー/チョキ/パー」を選択。</Box>
        <Box as='li' mb={1}>原作準拠: 勝つと自分にポイント、負けた側は満腹度が増えます。</Box>
        <Box as='li' mb={1}>簡易: 勝つと+1点。先に目標ポイントに到達で勝利。</Box>
        <Box as='li' mb={1}>設定から満腹上限やあいこ処理を調整可能。</Box>
      </Box>
      <Button mt={6} onClick={onBack} variant='outline'>戻る</Button>
    </Box>
  );
}
