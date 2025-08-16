import { Box, Button, Heading, HStack, Stack, Text, Card, NativeSelect, Switch, NumberInput, Field } from '@chakra-ui/react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { GameRule } from './models';
import { defaultRule } from './models';

type Props = { onClose: () => void; rule: GameRule; onChangeRule: (r: GameRule) => void };

export default function SettingsScreen({ onClose, rule, onChangeRule }: Props) {
  const [draft, setDraft] = useState<GameRule>(rule);
  const [tpText, setTpText] = useState(String(rule.targetPoints));
  const [physText, setPhysText] = useState(String(rule.physique));
  const tpInvalid = tpText !== '' && !/^\d+$/.test(tpText);
  const physInvalid = physText !== '' && !/^\d+$/.test(physText);

  function update<K extends keyof GameRule>(key: K, value: GameRule[K]) {
    setDraft(prev => ({ ...prev, [key]: value }));
  }

  function apply() { onChangeRule(draft); onClose(); }
  function cancel() { setDraft(rule); onClose(); }
  function defaults() { setDraft(defaultRule); }

  function getSafeNumber(text: string, fallback: number) {
    return /^\d+$/.test(text) ? Number(text) : fallback;
  }

  function adjustTargetPoints(delta: number) {
    const cur = getSafeNumber(tpText, draft.targetPoints);
    const next = Math.max(1, cur + delta);
    setTpText(String(next));
    update('targetPoints', next as GameRule['targetPoints']);
  }

  function adjustPhysique(delta: number) {
    const cur = getSafeNumber(physText, draft.physique);
    const next = Math.max(100, cur + delta);
    setPhysText(String(next));
    update('physique', next as GameRule['physique']);
  }

  return (
    <Box px={{ base: 4, md: 8 }} py={6} color='gray.700'>
      <Heading
        as='h2'
        fontSize={{ base: '2xl', md: '3xl' }}
        fontWeight='bold'
        mb={6}
        textAlign='center'
        color='gray.800'
      >
        オプション
      </Heading>
      <Stack gap={6} maxW='720px' mx='auto'>
        <Card.Root bg='blackAlpha.300' p={6} borderRadius='lg'>
          <Card.Header>
            <Card.Title>ゲームルール</Card.Title>
            <Card.Description>ポイント・満腹上限・あいこ処理を選択</Card.Description>
          </Card.Header>
          <Card.Body>
            <Stack gap={5}>
              <Field.Root invalid={tpInvalid}>
                <Stack gap={2} px={{ base: 2, md: 3 }} py={{ base: 2, md: 3 }}>
                  <Field.Label m={0} fontWeight='semibold'>勝利ポイント</Field.Label>
                  <Box
                    display='grid'
                    gridTemplateColumns='1fr auto 1fr'
                    alignItems='center'
                    columnGap={{ base: 2, md: 4 }}
                    w='100%'
                    overflowX='auto'
                    whiteSpace='nowrap'
                    px={{ base: 1, md: 0 }}
                  >
                    <HStack gap={2} justify='flex-end'>
                      <Button size='sm' minW={{ base: '56px', md: '64px' }} onClick={() => adjustTargetPoints(-10)}>-10</Button>
                      <Button size='sm' minW={{ base: '56px', md: '64px' }} onClick={() => adjustTargetPoints(-5)}>-5</Button>
                      <Button size='sm' minW={{ base: '56px', md: '64px' }} onClick={() => adjustTargetPoints(-1)}>-1</Button>
                    </HStack>
                    <NumberInput.Root
                      value={tpText}
                      min={1}
                      step={1}
                      size='lg'
                      w='auto'
                      justifySelf='center'
                      onValueChange={(v: any) => {
                        const next = String(v?.value ?? '');
                        setTpText(next);
                        if (/^\d+$/.test(next)) update('targetPoints', Number(next) as GameRule['targetPoints']);
                      }}
                    >
                      <NumberInput.Control>
                        <NumberInput.Input
                          inputMode='numeric'
                          pattern='[0-9]*'
                          textAlign='center'
                          fontSize={{ base: 'xl', md: '2xl' }}
                          fontWeight='bold'
                          fontVariantNumeric='tabular-nums'
                          minW={{ base: '180px', md: '220px' }}
                        />
                      </NumberInput.Control>
                    </NumberInput.Root>
                    <HStack gap={2} justify='flex-end'>
                      <Button size='sm' minW={{ base: '56px', md: '64px' }} colorScheme='teal' onClick={() => adjustTargetPoints(+1)}>+1</Button>
                      <Button size='sm' minW={{ base: '56px', md: '64px' }} colorScheme='teal' onClick={() => adjustTargetPoints(+5)}>+5</Button>
                      <Button size='sm' minW={{ base: '56px', md: '64px' }} colorScheme='teal' onClick={() => adjustTargetPoints(+10)}>+10</Button>
                    </HStack>
                  </Box>
                </Stack>
                {tpInvalid && (<Field.ErrorText mt={1}>数字のみを入力してください</Field.ErrorText>)}
              </Field.Root>
              <Box h='1px' bg='blackAlpha.300' mx={{ base: 2, md: 3 }} my={1} />

              <Field.Root invalid={physInvalid}>
                <Stack gap={2} px={{ base: 2, md: 3 }} py={{ base: 2, md: 3 }}>
                  <Field.Label m={0} fontWeight='semibold'>満腹上限（原作準拠のみ）</Field.Label>
                  <Box
                    display='grid'
                    gridTemplateColumns='1fr auto 1fr'
                    alignItems='center'
                    columnGap={{ base: 2, md: 4 }}
                    w='100%'
                    overflowX='auto'
                    whiteSpace='nowrap'
                    px={{ base: 1, md: 0 }}
                  >
                    <HStack gap={2} justify='flex-end'>
                      <Button size='sm' minW={{ base: '56px', md: '64px' }} onClick={() => adjustPhysique(-10)}>-10</Button>
                      <Button size='sm' minW={{ base: '56px', md: '64px' }} onClick={() => adjustPhysique(-5)}>-5</Button>
                      <Button size='sm' minW={{ base: '56px', md: '64px' }} onClick={() => adjustPhysique(-1)}>-1</Button>
                    </HStack>
                    <NumberInput.Root
                      value={physText}
                      min={100}
                      step={10}
                      size='lg'
                      w='auto'
                      justifySelf='center'
                      onValueChange={(v: any) => {
                        const next = String(v?.value ?? '');
                        setPhysText(next);
                        if (/^\d+$/.test(next)) update('physique', Number(next) as GameRule['physique']);
                      }}
                    >
                      <NumberInput.Control>
                        <NumberInput.Input
                          inputMode='numeric'
                          pattern='[0-9]*'
                          textAlign='center'
                          fontSize={{ base: 'xl', md: '2xl' }}
                          fontWeight='bold'
                          fontVariantNumeric='tabular-nums'
                          minW={{ base: '180px', md: '220px' }}
                        />
                      </NumberInput.Control>
                    </NumberInput.Root>
                    <HStack gap={2} justify='flex-end'>
                      <Button size='sm' minW={{ base: '56px', md: '64px' }} colorScheme='teal' onClick={() => adjustPhysique(+1)}>+1</Button>
                      <Button size='sm' minW={{ base: '56px', md: '64px' }} colorScheme='teal' onClick={() => adjustPhysique(+5)}>+5</Button>
                      <Button size='sm' minW={{ base: '56px', md: '64px' }} colorScheme='teal' onClick={() => adjustPhysique(+10)}>+10</Button>
                    </HStack>
                  </Box>
                </Stack>
                {physInvalid && (<Field.ErrorText mt={1}>数字のみを入力してください</Field.ErrorText>)}
              </Field.Root>

              <Field.Root>
                <HStack
                  justify='space-between'
                  gap={{ base: 3, md: 6 }}
                  px={{ base: 2, md: 3 }}
                  py={{ base: 2, md: 3 }}
                >
                  <Text fontWeight='semibold'>あいこ処理</Text>
                  <NativeSelect.Root
                    w={{ base: '100%', md: '320px' }}
                    size='lg'
                  >
                    <NativeSelect.Field
                      value={draft.tieRule}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => update('tieRule', e.target.value as GameRule['tieRule'])}
                    >
                      <option value='no_count'>増分なし</option>
                      <option value='satiety_plus_both'>双方に満腹加算</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </HStack>
              </Field.Root>
            </Stack>
          </Card.Body>
        </Card.Root>

        <Card.Root bg='blackAlpha.300' p={6} borderRadius='lg'>
          <Card.Header>
            <Card.Title>表示・演出</Card.Title>
            <Card.Description>操作感の好みに合わせて切り替え</Card.Description>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <HStack
                justify='space-between'
                gap={{ base: 3, md: 6 }}
                px={{ base: 2, md: 3 }}
                py={{ base: 2, md: 3 }}
              >
                <Text m={0}>アニメーション</Text>
                <Switch.Root checked={draft.animation} onCheckedChange={(d) => update('animation', !!d.checked)}>
                  <Switch.Label srOnly>アニメーション</Switch.Label>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
              </HStack>
              <HStack
                justify='space-between'
                gap={{ base: 3, md: 6 }}
                px={{ base: 2, md: 3 }}
                py={{ base: 2, md: 3 }}
              >
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

      <HStack mt={6} gap={3} justify='center' w='100%'>
        <Button variant='ghost' onClick={defaults}>既定値</Button>
        <Button variant='outline' onClick={cancel}>キャンセル</Button>
        <Button colorScheme='teal' onClick={apply}>適用</Button>
      </HStack>
    </Box>
  );
}
