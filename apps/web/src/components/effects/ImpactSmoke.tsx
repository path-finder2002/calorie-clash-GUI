import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import type { CSSProperties } from 'react';

// 放射状に一瞬だけ拡散する「衝突煙」
const puff = keyframes`
  0%   { transform: translate(0, 0) scale(0.6); opacity: 0.8; filter: blur(2px); }
  70%  { opacity: 0.5; }
  100% { transform: translate(var(--dx), var(--dy)) scale(1.3); opacity: 0; filter: blur(6px); }
`;

// 12方向の単位ベクトル（pxは後で乗算）
const vectors = Array.from({ length: 12 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 12;
  const r = 42; // 半径（px）
  return { dx: Math.cos(a) * r, dy: Math.sin(a) * r, size: 10 + ((i * 7) % 8) };
});

export default function ImpactSmoke() {
  return (
    <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" pointerEvents="none">
      {vectors.map((v, idx) => (
        <Box
          key={idx}
          position="absolute"
          top={0}
          left={0}
          width={`${v.size}px`}
          height={`${v.size}px`}
          borderRadius="full"
          bg="whiteAlpha.700"
          boxShadow="0 0 18px rgba(255,255,255,0.25)"
          style={{
            '--dx': `${v.dx}px`,
            '--dy': `${v.dy}px`,
            animation: `${puff} 0.55s ease-out 0s 1 both`,
          } as CSSProperties}
        />
      ))}
    </Box>
  );
}

