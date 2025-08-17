import { Card } from '@chakra-ui/react';
import type { ComponentProps, ReactNode } from 'react';

type Props = ComponentProps<typeof Card.Root> & { children: ReactNode };

// 共通のセクション用カード: サイズ/配置を統一
export default function SectionCard({ children, ...rest }: Props) {
  return (
    <Card.Root
      p={6}
      borderRadius='lg'
      w={{ base: 'min(100%, 480px)' }}
      mx='auto'
      {...rest}
    >
      {children}
    </Card.Root>
  );
}
