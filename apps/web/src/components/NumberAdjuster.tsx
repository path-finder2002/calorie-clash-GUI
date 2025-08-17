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
      size='md'
      w='auto'
      onValueChange={onValueChange}
    >
      <NumberInput.Control>
        <NumberInput.Input
          inputMode='numeric'
          pattern='[0-9]*'
          textAlign='center'
          fontSize='xl'
          fontWeight='bold'
          fontVariantNumeric='tabular-nums'
          w='150px'
          h='50px'
          lineHeight='50px'
          bg='surface'
          color='fg'
          borderWidth='2px'
          borderColor='accent'
          borderRadius='lg'
          boxShadow='sm'
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
