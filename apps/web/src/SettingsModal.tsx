import { ChangeEvent, useMemo, useState } from 'react';
import { Button, FormControl, FormHelperText, FormLabel, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Switch } from '@chakra-ui/react';
import { GameRule, defaultRule } from './models';

type Props = { isOpen: boolean; onClose: () => void; rule: GameRule; onChangeRule: (r: GameRule) => void };

export default function SettingsModal({ isOpen, onClose, rule, onChangeRule }: Props) {
  const [draft, setDraft] = useState<GameRule>(rule);

  // 開くたびにロード
  function handleOnOpen() { setDraft(rule); }

  function apply() { onChangeRule(draft); onClose(); }
  function cancel() { setDraft(rule); onClose(); }
  function defaults() { setDraft(defaultRule); }

  function update<K extends keyof GameRule>(key: K, value: GameRule[K]) {
    setDraft(prev => ({ ...prev, [key]: value }));
  }

  return (
    <Modal isOpen={isOpen} onClose={cancel} onCloseComplete={() => setDraft(rule)} onOverlayClick={cancel} onEsc={cancel} isCentered onOpen={handleOnOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>オプション</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>勝利ポイント</FormLabel>
              <Select value={draft.targetPoints} onChange={(e: ChangeEvent<HTMLSelectElement>) => update('targetPoints', Number(e.target.value) as GameRule['targetPoints'])}>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>満腹上限</FormLabel>
              <Select value={draft.physique} onChange={(e: ChangeEvent<HTMLSelectElement>) => update('physique', Number(e.target.value) as GameRule['physique'])}>
                <option value={800}>800</option>
                <option value={1000}>1000</option>
                <option value={1300}>1300</option>
              </Select>
              <FormHelperText>原作準拠モードのみ使用</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>あいこ処理</FormLabel>
              <Select value={draft.tieRule} onChange={(e) => update('tieRule', e.target.value as GameRule['tieRule'])}>
                <option value='no_count'>増分なし</option>
                <option value='satiety_plus_both'>双方に満腹加算</option>
              </Select>
            </FormControl>
            <FormControl display='flex' alignItems='center' justifyContent='space-between'>
              <FormLabel m={0}>アニメーション</FormLabel>
              <Switch isChecked={draft.animation} onChange={(e) => update('animation', e.target.checked)} />
            </FormControl>
            <FormControl display='flex' alignItems='center' justifyContent='space-between'>
              <FormLabel m={0}>サウンド</FormLabel>
              <Switch isChecked={draft.sound} onChange={(e) => update('sound', e.target.checked)} />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button variant='ghost' onClick={defaults}>既定値</Button>
            <Button variant='outline' onClick={cancel}>キャンセル</Button>
            <Button colorScheme='teal' onClick={apply}>適用</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

