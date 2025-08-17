import { Box, Button, Heading, HStack, Stack, Text, Card, NativeSelect, Field, Switch } from '@chakra-ui/react';
import { useAppTheme } from '@/theme/colorMode';
import type { ChangeEvent } from 'react';
import { NumberAdjuster } from '@/components/NumberAdjuster';
import { useSettings } from '@/features/settings/hooks';
import type { SettingsScreenProps } from '@/features/settings/types';
import type { GameRule } from '@/models';

export default function SettingsScreen({ onClose, rule, onChangeRule }: SettingsScreenProps) {
  const { isDark } = useAppTheme();
  const {
    draft,
    tpText,
    physText,
    tpInvalid,
    physInvalid,
    update,
    apply,
    cancel,
    defaults,
    adjustTargetPoints,
    adjustPhysique,
    setTpText,
    setPhysText,
  } = useSettings(rule, onChangeRule, onClose);

  return (
    <Box
      px={{ base: 4, md: 8 }}
      py={6}
      pt={{ base: '64px', md: '80px' }}
      color={isDark ? 'whiteAlpha.900' : 'gray.900'}
    >
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
      <Stack gap={6} maxW={{ base: '100%', md: '960px' }} mx='auto'>
        <Card.Root bg={isDark ? 'blackAlpha.300' : 'blackAlpha.50'} p={6} borderRadius='lg'>
          <Card.Header>
            <Card.Title>ゲームルール</Card.Title>
            <Card.Description>ポイント・満腹上限・あいこ処理を選択</Card.Description>
          </Card.Header>
          <Card.Body>
            <Stack gap={5}>
              <Field.Root invalid={tpInvalid}>
                <Stack gap={4} align="center" px={{ base: 2, md: 3 }} py={{ base: 2, md: 3 }}>
                  <Field.Label m={0} fontWeight='semibold'>勝利点数</Field.Label>
                  <NumberAdjuster
                    value={tpText}
                    min={1}
                    step={1}
                    onAdjust={adjustTargetPoints}
                    onValueChange={(v) => {
                      const next = typeof v === 'string' ? v : v?.value ?? '';
                      setTpText(next);
                      if (/^\d+$/.test(next)) update('targetPoints', Number(next) as GameRule['targetPoints']);
                    }}
                  >
                    {({ adjust, input }) => (
                      <>
                        <Box>{input}</Box>
                        <HStack gap={2} justify='center' mt={{ base: '96px', md: '50px' }} flexWrap='wrap' rowGap={2}>
                          <Button size='sm' minW={{ base: '48px', md: '64px' }} bg='black' color='white' borderRadius='md' onClick={() => adjust(+10)}>+10</Button>
                          <Button size='sm' minW={{ base: '48px', md: '64px' }} bg='black' color='white' borderRadius='md' onClick={() => adjust(+5)}>+5</Button>
                          <Button size='sm' minW={{ base: '48px', md: '64px' }} bg='black' color='white' borderRadius='md' onClick={() => adjust(-5)}>-5</Button>
                          <Button size='sm' minW={{ base: '48px', md: '64px' }} bg='black' color='white' borderRadius='md' onClick={() => adjust(-10)}>-10</Button>
                        </HStack>
                      </>
                    )}
                  </NumberAdjuster>
                </Stack>
                {tpInvalid && (<Field.ErrorText mt={1}>数字のみを入力してください</Field.ErrorText>)}
              </Field.Root>
              <Box h='1px' bg={isDark ? 'whiteAlpha.300' : 'blackAlpha.200'} mx={{ base: 2, md: 3 }} my={1} />

              <Field.Root invalid={physInvalid}>
                <Stack gap={2} px={{ base: 2, md: 3 }} py={{ base: 2, md: 3 }}>
                  <Field.Label m={0} fontWeight='semibold'>満腹上限（原作準拠のみ）</Field.Label>
                  <NumberAdjuster
                    value={physText}
                    min={100}
                    step={10}
                    onAdjust={adjustPhysique}
                    onValueChange={(v) => {
                      const next = typeof v === 'string' ? v : v?.value ?? '';
                      setPhysText(next);
                      if (/^\d+$/.test(next)) update('physique', Number(next) as GameRule['physique']);
                    }}
                  >
                    {({ adjust, input }) => (
                      <>
                        <Box>{input}</Box>
                        <HStack gap={2} justify='center' mt={{ base: '96px', md: '50px' }} flexWrap='wrap' rowGap={2}>
                          <Button size='sm' minW={{ base: '48px', md: '64px' }} bg='black' color='white' borderRadius='md' onClick={() => adjust(+10)}>+10</Button>
                          <Button size='sm' minW={{ base: '48px', md: '64px' }} bg='black' color='white' borderRadius='md' onClick={() => adjust(+5)}>+5</Button>
                        </HStack>
                        <HStack gap={2} justify='center' mt={{ base: '8px', md: '12px' }} flexWrap='wrap' rowGap={2}>
                          <Button size='sm' minW={{ base: '48px', md: '64px' }} bg='black' color='white' borderRadius='md' onClick={() => adjust(-5)}>-5</Button>
                          <Button size='sm' minW={{ base: '48px', md: '64px' }} bg='black' color='white' borderRadius='md' onClick={() => adjust(-10)}>-10</Button>
                        </HStack>
                      </>
                    )}
                  </NumberAdjuster>
                </Stack>
                {physInvalid && (<Field.ErrorText mt={1}>数字のみを入力してください</Field.ErrorText>)}
              </Field.Root>

              <Box h='1px' bg={isDark ? 'whiteAlpha.300' : 'blackAlpha.200'} mx={{ base: 2, md: 3 }} my={1} />

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

        <Card.Root bg={isDark ? 'blackAlpha.300' : 'blackAlpha.50'} p={6} borderRadius='lg'>
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
