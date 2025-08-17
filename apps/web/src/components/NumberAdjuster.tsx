import { NumberInput, Stack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type NumberAdjusterProps = {
  value: string;
  min: number;
  step: number;
  onValueChange: (v: string | { value: string }) => void;
  onAdjust: (delta: number) => void;
  children: (helpers: {
    adjust: (delta: number) => void;
    input: ReactNode;
  }) => ReactNode;
};

export function NumberAdjuster({ value, min, step, onValueChange, onAdjust, children }: NumberAdjusterProps) {
  const input = (
    <NumberInput.Root
      value={value}
      min={min}
      step={step}
      size='lg'
      w='100%'
      onValueChange={onValueChange}
    >
      <NumberInput.Control>
        <NumberInput.Input
          inputMode='numeric'
          pattern='[0-9]*'
          textAlign='center'
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight='bold'
          fontVariantNumeric='tabular-nums'
          w='100%'
          maxW={{ base: 'min(90vw, 390px)', md: 'min(70vw, 570px)' }}
          bg='surface'
          color='fg'
          borderWidth='2px'
          borderColor='accent'
          borderRadius='lg'
          boxShadow='sm'
          px={4}
          py={3}
          style={{ boxSizing: 'border-box' }}
          _focus={{ borderColor: 'accent', boxShadow: '0 0 0 3px rgba(45,212,191,0.35)' }}
        />
      </NumberInput.Control>
    </NumberInput.Root>
  );

  return (
    <Stack
      w='100%'
      direction='column'
      justify='center'
      align='center'
      gap={0}
    >
      {children({ adjust: onAdjust, input })}
    </Stack>
  );
}
