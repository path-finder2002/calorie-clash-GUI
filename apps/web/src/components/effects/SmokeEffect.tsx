import { Box } from '@chakra-ui/react';
import SmokeScene from './SmokeScene';

interface Props {
  width?: number | string;
  height?: number | string;
  top?: number | string;
  left?: number | string;
}

export default function SmokeEffect({ width = '200px', height = '200px', top = '50%', left = '50%' }: Props) {
  return (
    <Box
      position='absolute'
      top={top}
      left={left}
      width={width}
      height={height}
      transform='translate(-50%, -50%)'
      pointerEvents='none'
      overflow='hidden'
    >
      <SmokeScene />
    </Box>
  );
}
