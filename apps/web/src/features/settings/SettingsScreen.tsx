import { Box, Button, Heading, HStack, Stack, Text, Card, Field, Switch } from '@chakra-ui/react';
import LeftAligned from '@/ui/LeftAligned';
import SectionCard from '@/ui/SectionCard';
import { useAppTheme } from '@/theme/colorMode';
import { useSettings } from '@/features/settings/hooks';
import { NumberAdjuster } from '@/components/NumberAdjuster';
import TieRuleSelect from '@/features/settings/components/TieRuleSelect';
import type { SettingsScreenProps } from '@/features/settings/types';
import type { GameRule } from '@/models';

export default function SettingsScreen({ onClose, rule, onChangeRule }: SettingsScreenProps) {
  const { isDark } = useAppTheme();
  const { draft, tpText, tpInvalid, physText, physInvalid, update, apply, cancel, defaults, setTpText, setPhysText } = useSettings(
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
        <SectionCard bg={isDark ? 'blackAlpha.300' : 'blackAlpha.50'}>
          <Card.Header>
            <Card.Title>勝利ポイント</Card.Title>
            <Card.Description>勝利条件となるポイント数を設定</Card.Description>
          </Card.Header>
          <Card.Body>
            <Field.Root invalid={tpInvalid}>
              <LeftAligned px={{ base: 2, md: 3 }}>
                <Box minW='150px' w='150px'>
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
              </LeftAligned>
              {tpInvalid && (<Field.ErrorText mt={2}>数字のみを入力してください</Field.ErrorText>)}
            </Field.Root>
          </Card.Body>
        </SectionCard>
        <SectionCard bg={isDark ? 'blackAlpha.300' : 'blackAlpha.50'}>
          <Card.Header>
            <Card.Title>ゲームルール</Card.Title>
            <Card.Description>あいこ処理を選択</Card.Description>
          </Card.Header>
          <Card.Body>
            <Stack gap={5}>
              {/* 数値フィールド（満腹上限）セクションは削除 */}
              <TieRuleSelect value={draft.tieRule} onChange={(val) => update('tieRule', val)} />
            </Stack>
          </Card.Body>
        </SectionCard>

        {/* 満腹上限（新しいセクション） */}
        <SectionCard bg={isDark ? 'blackAlpha.300' : 'blackAlpha.50'}>
          <Card.Header>
            <Card.Title>満腹上限</Card.Title>
            <Card.Description>原作準拠モード時の最大満腹度（kcal相当）</Card.Description>
          </Card.Header>
          <Card.Body>
            <Field.Root invalid={physInvalid}>
              <LeftAligned px={{ base: 2, md: 3 }}>
                <Box minW='150px' w='150px'>
                  <NumberAdjuster
                    value={physText}
                    min={100}
                    step={10}
                    onAdjust={() => { /* no adjust buttons */ }}
                    onValueChange={(v) => {
                      const next = typeof v === 'string' ? v : v?.value ?? '';
                      setPhysText(next);
                      if (/^\\d+$/.test(next)) update('physique', Number(next) as GameRule['physique']);
                    }}
                  >
                    {({ input }) => (
                      <Box display='block' my={{ base: 2, md: 3 }}>
                        {input}
                      </Box>
                    )}
                  </NumberAdjuster>
                </Box>
              </LeftAligned>
              {physInvalid && (<Field.ErrorText mt={2}>数字のみを入力してください</Field.ErrorText>)}
            </Field.Root>
          </Card.Body>
        </SectionCard>

        <SectionCard bg={isDark ? 'blackAlpha.300' : 'blackAlpha.50'}>
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
                <Text m={0} fontWeight='semibold'>アニメーション</Text>
                <Box bg='surface' borderWidth='2px' borderColor='accent' borderRadius='lg' p={1}>
                  <Switch.Root
                    checked={draft.animation}
                    onCheckedChange={(d) => update('animation', !!d.checked)}
                    size='lg'
                    colorPalette='teal'
                  >
                    <Switch.Label srOnly>アニメーション</Switch.Label>
                    <Switch.Control w='64px' h='34px' bg='blackAlpha.300' _checked={{ bg: 'accent' }} borderRadius='full'>
                      <Switch.Thumb boxSize='26px' bg='white' boxShadow='sm' />
                    </Switch.Control>
                  </Switch.Root>
                </Box>
              </HStack>
              <HStack
                justify='space-between'
                gap={{ base: 3, md: 6 }}
                px={{ base: 2, md: 3 }}
                py={{ base: 2, md: 3 }}
              >
                <Text m={0} fontWeight='semibold'>サウンド</Text>
                <Box bg='surface' borderWidth='2px' borderColor='accent' borderRadius='lg' p={1}>
                  <Switch.Root
                    checked={draft.sound}
                    onCheckedChange={(d) => update('sound', !!d.checked)}
                    size='lg'
                    colorPalette='teal'
                  >
                    <Switch.Label srOnly>サウンド</Switch.Label>
                    <Switch.Control w='64px' h='34px' bg='blackAlpha.300' _checked={{ bg: 'accent' }} borderRadius='full'>
                      <Switch.Thumb boxSize='26px' bg='white' boxShadow='sm' />
                    </Switch.Control>
                  </Switch.Root>
                </Box>
              </HStack>
            </Stack>
          </Card.Body>
        </SectionCard>
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
