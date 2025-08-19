import { Box, Button, Card, Dialog, HStack, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';

type Props = { onBack: () => void; onConfirm: (mode: 'pvc'|'pvp') => void };

export default function PlayerSelectScreen({ onBack, onConfirm }: Props) {
  const [mode, setMode] = useState<'pvc' | 'pvp'>('pvc');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm(mode);
    setConfirmOpen(false);
  };

  return (
    <Box px={{ base: 4, md: 8 }} py={{ base: 6, md: 8 }} minH='100dvh' display='flex' flexDir='column'>
      <Heading as='h1' size='lg' textAlign='center' mb={{ base: 4, md: 6 }}>プレイヤー選択</Heading>

      <Card.Root p={6} borderRadius='lg' maxW={{ base: '100%', md: '480px' }} mx='auto' w={{ base: 'min(100%, 480px)' }}>
        <Card.Header>
          <Card.Title>対戦形式</Card.Title>
          <Card.Description>人数を選択してください</Card.Description>
        </Card.Header>
        <Card.Body>
          <HStack gap={3} justify='center'>
            <Button
              variant={mode === 'pvc' ? 'solid' : 'outline'}
              colorPalette='teal'
              onClick={() => setMode('pvc')}
            >
              1人（プレイヤー vs CPU）
            </Button>
            <Button
              variant={mode === 'pvp' ? 'solid' : 'outline'}
              colorPalette='teal'
              onClick={() => setMode('pvp')}
            >
              2人（PvP）
            </Button>
          </HStack>
        </Card.Body>
      </Card.Root>

      <HStack mt='auto' justify='center' gap={3} py={{ base: 4, md: 6 }}>
        <Button variant='outline' onClick={onBack}>戻る</Button>
        <Button colorPalette='teal' onClick={() => setConfirmOpen(true)}>次へ</Button>
      </HStack>

      <Dialog.Root open={confirmOpen} onOpenChange={(e) => setConfirmOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg='white' _dark={{ bg: 'gray.800' }}>
            <Dialog.Header>
              <Dialog.Title>確認</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>{mode === 'pvc' ? '1人で開始しますか？' : '2人で開始しますか？'}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant='outline' onClick={() => setConfirmOpen(false)}>キャンセル</Button>
              <Button colorPalette='teal' onClick={handleConfirm}>開始</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      <Text textAlign='center' color='fg.muted' fontSize='xs'>v0.1.0</Text>
    </Box>
  );
}
