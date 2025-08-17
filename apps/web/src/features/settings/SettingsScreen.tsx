import { Box, Button, Heading, HStack, Stack, Text, Card, NativeSelect, Field, Switch } from '@chakra-ui/react';
import { useAppTheme } from '@/theme/colorMode';
import type { ChangeEvent } from 'react';
import { useSettings } from '@/features/settings/hooks';
import { NumberAdjuster } from '@/components/NumberAdjuster';
// NumberAdjuster は未使用（数値入力は非表示）
import type { SettingsScreenProps } from '@/features/settings/types';
import type { GameRule } from '@/models';

export default function SettingsScreen({ onClose, rule, onChangeRule }: SettingsScreenProps) {
  const { isDark } = useAppTheme();
  const { draft, tpText, tpInvalid, update, apply, cancel, defaults, setTpText } = useSettings(
    rule,
    onChangeRule,
    onClose,
  );

  return (
    <Box
      px={{ base: 4, md: 8 }}
      py={6}
      pt={{ base: '64px', md: '80px' }}
      pb={{ base: '96px', md: '112px' }}
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
        {/* 勝利ポイント（新規セクション） */}
        <Card.Root bg={isDark ? 'blackAlpha.300' : 'blackAlpha.50'} p={6} borderRadius='lg'>
          <Card.Header>
            <Card.Title>勝利ポイント</Card.Title>
            <Card.Description>勝利条件となるポイント数を設定</Card.Description>
          </Card.Header>
          <Card.Body>
            <Field.Root invalid={tpInvalid}>
              <Box minW='150px' w='150px' mx='auto'>
                <NumberAdjuster
                  value={tpText}
                  min={1}
                  step={1}
                  onAdjust={() => { /* no adjust buttons */ }}
                  onValueChange={(v) => {
                    const next = typeof v === 'string' ? v : v?.value ?? '';
                    setTpText(next);
                    if (/^\\d+$/.test(next)) update('targetPoints', Number(next) as GameRule['targetPoints']);
                  }}
                >
                  {({ input }) => (
                    <Box display='block' my={{ base: 2, md: 3 }}>
                      {input}
                    </Box>
                  )}
                </NumberAdjuster>
              </Box>
              {tpInvalid && (<Field.ErrorText mt={2}>数字のみを入力してください</Field.ErrorText>)}
            </Field.Root>
          </Card.Body>
        </Card.Root>
        <Card.Root bg={isDark ? 'blackAlpha.300' : 'blackAlpha.50'} p={6} borderRadius='lg'>
          <Card.Header>
            <Card.Title>ゲームルール</Card.Title>
            <Card.Description>あいこ処理を選択</Card.Description>
          </Card.Header>
          <Card.Body>
            <Stack gap={5}>
              {/* 数値フィールド（満腹上限）セクションは削除 */}

              <Field.Root>
                <HStack justify='center' px={{ base: 2, md: 3 }} py={{ base: 2, md: 3 }}>
                  <Box
                    w={{ base: '100%', md: '380px' }}
                    bg='surface'
                    borderWidth='2px'
                    borderColor='accent'
                    borderRadius='lg'
                    boxShadow='sm'
                    p={1}
                  >
                    <NativeSelect.Root w='100%' size='lg'>
                      <NativeSelect.Field
                        value={draft.tieRule}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => update('tieRule', e.target.value as GameRule['tieRule'])}
                        bg='surface'
                        color='fg'
                        fontWeight='semibold'
                        border='none'
                        _focusVisible={{ boxShadow: '0 0 0 3px rgba(45,212,191,0.35)' }}
                      >
                        <option value='no_count'>増分なし</option>
                        <option value='satiety_plus_both'>双方に満腹加算</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator color='accent' />
                    </NativeSelect.Root>
                  </Box>
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

      <Box
        as='footer'
        position='fixed'
        left={0}
        right={0}
        bottom={0}
        zIndex={900}
        bg={isDark ? 'rgba(17,19,25,0.55)' : 'rgba(255,255,255,0.7)'}
        backdropFilter='saturate(180%) blur(10px)'
        borderTopWidth='1px'
        borderColor={isDark ? 'whiteAlpha.300' : 'blackAlpha.200'}
        boxShadow={isDark ? '0 -4px 16px rgba(0,0,0,0.35)' : '0 -4px 16px rgba(0,0,0,0.08)'}
        style={{ WebkitBackdropFilter: 'saturate(180%) blur(10px)' }}
      >
        <HStack
          maxW={{ base: '100%', md: '960px' }}
          mx='auto'
          px={{ base: 4, md: 8 }}
          py={{ base: 3, md: 4 }}
          gap={3}
          justify='center'
          w='100%'
        >
          <Button variant='ghost' onClick={defaults}>既定値</Button>
          <Button variant='outline' onClick={cancel}>キャンセル</Button>
          <Button colorScheme='teal' onClick={apply}>適用</Button>
        </HStack>
        <Box h='env(safe-area-inset-bottom)' />
      </Box>
    </Box>
  );
}
