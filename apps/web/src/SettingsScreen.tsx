import { Box, Button, Heading, HStack, Stack, Text, Card, NativeSelect, Switch } from '@chakra-ui/react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { GameRule } from './models';
import { defaultRule } from './models';

type Props = { onClose: () => void; rule: GameRule; onChangeRule: (r: GameRule) => void };

export default function SettingsScreen({ onClose, rule, onChangeRule }: Props) {
  const [draft, setDraft] = useState<GameRule>(rule);

  function update<K extends keyof GameRule>(key: K, value: GameRule[K]) {
    setDraft(prev => ({ ...prev, [key]: value }));
  }

  function apply() { onChangeRule(draft); onClose(); }
  function cancel() { setDraft(rule); onClose(); }
  function defaults() { setDraft(defaultRule); }

  return (
    <Box px={{ base: 4, md: 8 }} py={6}>
      <Heading size='lg' mb={4}>オプション</Heading>
      <Stack gap={5} maxW='720px'>
        <Card.Root bg='blackAlpha.300' p={4} borderRadius='lg'>
          <Card.Header>
            <Card.Title>ゲームルール</Card.Title>
            <Card.Description>ポイント・満腹上限・あいこ処理を選択</Card.Description>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <Box>
                <Text mb={1} fontWeight='semibold'>勝利ポイント</Text>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={String(draft.targetPoints)}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => update('targetPoints', Number(e.target.value) as GameRule['targetPoints'])}
                  >
                    <option value='30'>30</option>
                    <option value='40'>40</option>
                    <option value='50'>50</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>

              <Box>
                <Text mb={1} fontWeight='semibold'>満腹上限（原作準拠のみ）</Text>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={String(draft.physique)}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => update('physique', Number(e.target.value) as GameRule['physique'])}
                  >
                    <option value='800'>800</option>
                    <option value='1000'>1000</option>
                    <option value='1300'>1300</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>

              <Box>
                <Text mb={1} fontWeight='semibold'>あいこ処理</Text>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={draft.tieRule}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => update('tieRule', e.target.value as GameRule['tieRule'])}
                  >
                    <option value='no_count'>増分なし</option>
                    <option value='satiety_plus_both'>双方に満腹加算</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>

        <Card.Root bg='blackAlpha.300' p={4} borderRadius='lg'>
          <Card.Header>
            <Card.Title>表示・演出</Card.Title>
            <Card.Description>操作感の好みに合わせて切り替え</Card.Description>
          </Card.Header>
          <Card.Body>
            <Stack gap={3}>
              <HStack justify='space-between'>
                <Text m={0}>アニメーション</Text>
                <Switch.Root checked={draft.animation} onCheckedChange={(d) => update('animation', !!d.checked)}>
                  <Switch.Label srOnly>アニメーション</Switch.Label>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
              </HStack>
              <HStack justify='space-between'>
                <Text m={0}>サウンド</Text>
                <Switch.Root checked={draft.sound} onCheckedChange={(d) => update('sound', !!d.checked)}>
                  <Switch.Label srOnly>サウンド</Switch.Label>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
              </HStack>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Stack>

      <HStack mt={6} gap={3}>
        <Button variant='ghost' onClick={defaults}>既定値</Button>
        <Button variant='outline' onClick={cancel}>キャンセル</Button>
        <Button colorScheme='teal' onClick={apply}>適用</Button>
      </HStack>
    </Box>
  );
}
