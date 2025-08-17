import { Button, HStack, Link, Box } from "@chakra-ui/react";
import { useAppTheme } from "@/theme/colorMode";

type Props = {
  lang: 'ja' | 'en';
  onToggleLang: () => void;
};

export default function TopHeader({ lang, onToggleLang }: Props) {
  const { isDark, toggleTheme } = useAppTheme();
  const commonBtn = {
    size: 'sm' as const,
    variant: 'outline' as const,
    color: isDark ? 'white' : 'gray.800',
    borderColor: isDark ? 'whiteAlpha.700' : 'gray.400',
  };

  const glassBg = isDark ? 'rgba(17,19,25,0.55)' : 'rgba(255,255,255,0.6)';
  const glassBorder = isDark ? 'whiteAlpha.300' : 'blackAlpha.200';

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={1000}
      w="100%"
      px={{ base: 3, md: 4 }}
      py={{ base: 2, md: 3 }}
      bg={glassBg}
      backdropFilter="saturate(180%) blur(12px)"
      borderBottomWidth="1px"
      borderColor={glassBorder}
      boxShadow={isDark ? '0 4px 16px rgba(0,0,0,0.35)' : '0 4px 16px rgba(0,0,0,0.1)'}
      style={{ WebkitBackdropFilter: 'saturate(180%) blur(12px)' }}
    >
      <HStack justify="flex-end" gap={2}>
        <Link href="https://github.com/path-finder2002/calorie-clash-GUI" target="_blank" rel="noreferrer noopener">
          <Button {...commonBtn}>GitHub</Button>
        </Link>
        <Button {...commonBtn} onClick={onToggleLang}>{lang === 'ja' ? 'EN' : '日本語'}</Button>
        <Button size="sm" variant="ghost" onClick={toggleTheme}>
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </HStack>
    </Box>
  );
}
