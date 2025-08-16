import { Box, Button, Heading, HStack, Stack, Text } from '@chakra-ui/react';
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
      <Stack gap={4} maxW='520px'>
        <Box>
          <Text mb={1} fontWeight='semibold'>勝利ポイント</Text>
          <select value={draft.targetPoints} onChange={(e: ChangeEvent<HTMLSelectElement>) => update('targetPoints', Number(e.target.value) as GameRule['targetPoints'])}>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </select>
        </Box>
        <Box>
          <Text mb={1} fontWeight='semibold'>満腹上限（原作準拠のみ）</Text>
          <select value={draft.physique} onChange={(e: ChangeEvent<HTMLSelectElement>) => update('physique', Number(e.target.value) as GameRule['physique'])}>
            <option value={800}>800</option>
            <option value={1000}>1000</option>
            <option value={1300}>1300</option>
          </select>
        </Box>
        <Box>
          <Text mb={1} fontWeight='semibold'>あいこ処理</Text>
          <select value={draft.tieRule} onChange={(e: ChangeEvent<HTMLSelectElement>) => update('tieRule', e.target.value as GameRule['tieRule'])}>
            <option value='no_count'>増分なし</option>
            <option value='satiety_plus_both'>双方に満腹加算</option>
          </select>
        </Box>
        <HStack justify='space-between'>
          <Text m={0}>アニメーション</Text>
          <input type='checkbox' checked={draft.animation} onChange={(e: ChangeEvent<HTMLInputElement>) => update('animation', e.target.checked)} />
        </HStack>
        <HStack justify='space-between'>
          <Text m={0}>サウンド</Text>
          <input type='checkbox' checked={draft.sound} onChange={(e: ChangeEvent<HTMLInputElement>) => update('sound', e.target.checked)} />
        </HStack>
      </Stack>

      <HStack mt={6} gap={3}>
        <Button variant='ghost' onClick={defaults}>既定値</Button>
        <Button variant='outline' onClick={cancel}>キャンセル</Button>
        <Button colorScheme='teal' onClick={apply}>適用</Button>
      </HStack>
    </Box>
  );
}

