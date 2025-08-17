import { Box, Field, NativeSelect } from '@chakra-ui/react';
import LeftAligned from '@/ui/LeftAligned';
import type { GameRule } from '@/models';

type Props = {
  value: GameRule['tieRule'];
  onChange: (next: GameRule['tieRule']) => void;
};

export default function TieRuleSelect({ value, onChange }: Props) {
  return (
    <Field.Root>
      <LeftAligned px={{ base: 2, md: 3 }} py={{ base: 2, md: 3 }}>
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
              value={value}
              onChange={(e) => onChange(e.target.value as GameRule['tieRule'])}
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
      </LeftAligned>
    </Field.Root>
  );
}
