import { Box, Button, Heading, ListItem, Text, UnorderedList } from '@chakra-ui/react';

export default function HelpScreen({ onBack }: { onBack: () => void }) {
  return (
    <Box px={{ base: 4, md: 8 }} py={6}>
      <Heading size='lg' mb={4}>ヘルプ</Heading>
      <Text mb={2}>満腹じゃんけん（Calorie Clash）の遊び方（MVP）</Text>
      <UnorderedList spacing={1}>
        <ListItem>タイトルで「原作準拠/簡易」を選んでスタート。</ListItem>
        <ListItem>ゲーム画面で「グー/チョキ/パー」を選択。</ListItem>
        <ListItem>原作準拠: 勝つと自分にポイント、負けた側は満腹度が増えます。</ListItem>
        <ListItem>簡易: 勝つと+1点。先に目標ポイントに到達で勝利。</ListItem>
        <ListItem>設定から勝利ポイントや満腹上限、あいこ処理を調整可能。</ListItem>
      </UnorderedList>
      <Button mt={6} onClick={onBack} variant='outline'>戻る</Button>
    </Box>
  );
}

