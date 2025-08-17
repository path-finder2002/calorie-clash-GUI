import { HStack, type StackProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type Props = StackProps & {
  children: ReactNode;
};

// 共通: 左揃えの行ラッパー（レスポンシブ余白も受け取れる）
export default function LeftAligned({ children, ...rest }: Props) {
  return (
    <HStack w='full' justify='flex-start' align='center' {...rest}>
      {children}
    </HStack>
  );
}

