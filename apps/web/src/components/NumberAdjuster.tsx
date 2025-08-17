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
      w='auto'
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
          minW={{ base: '180px', md: '220px' }}
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
      gap={{ base: 2, md: 4 }}
    >
      {children({ adjust: onAdjust, input })}
    </Stack>
  );
}
