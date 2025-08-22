import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const rise = keyframes`
  0% { transform: translateY(0) scale(0.8); opacity: 0.2; filter: blur(6px); }
  50% { opacity: 0.5; }
  100% { transform: translateY(-120%) scale(1.6); opacity: 0; filter: blur(10px); }
`;

const particles = Array.from({ length: 12 }).map((_, i) => ({
  left: [5, 12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92][i % 12],
  size: [10, 14, 18, 12, 16, 20, 12, 18, 14, 16, 12, 10][i % 12],
  delay: (i % 6) * 0.6,
  duration: 5 + (i % 5),
}));

export default function SmokeScene() {
  return (
    <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none">
      {particles.map((p, idx) => (
        <Box
          key={idx}
          position="absolute"
          bottom="-10%"
          left={`${p.left}%`
          }
          width={`${p.size}px`}
          height={`${p.size}px`}
          borderRadius="full"
          bg="whiteAlpha.500"
          boxShadow="0 0 24px rgba(255,255,255,0.25)"
          opacity={0}
          style={{
            animation: `${rise} ${p.duration}s ease-in ${p.delay}s infinite`,
          }}
        />
      ))}
    </Box>
  );
}

