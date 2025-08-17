import { Box, Button, Card, HStack, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';

type Props = { onBack: () => void; onConfirm: (mode: 'pvc'|'pvp') => void };

export default function PlayerSelectScreen({ onBack, onConfirm }: Props) {
  const [mode, setMode] = useState<'pvc' | 'pvp'>('pvc');

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
        <Button colorPalette='teal' onClick={() => onConfirm(mode)}>次へ</Button>
      </HStack>

      <Text textAlign='center' color='fg.muted' fontSize='xs'>v0.1.0</Text>
    </Box>
  );
}
