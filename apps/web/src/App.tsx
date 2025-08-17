import { useEffect, useState } from "react";
import { Box, Button, HStack, Link } from "@chakra-ui/react";
import TitleScreen from "@/pages/TitleScreen";
import GameScreen from "@/pages/GameScreen";
import SettingsScreen from "@/features/settings/SettingsScreen";
import HelpScreen from "@/pages/HelpScreen";
import type { GameRule } from "@/models";
import { defaultRule } from "@/models";
import { loadRule, saveRule } from "@/lib";
import { useAppTheme } from "@/theme/colorMode";

type Screen = "title" | "game" | "help" | "settings";

export default function App() {
  const { isDark, toggleTheme } = useAppTheme();
  const [screen, setScreen] = useState<Screen>("title");
  const [rule, setRule] = useState<GameRule>(() => loadRule() ?? defaultRule);
  const [returnTo, setReturnTo] = useState<Exclude<Screen, "settings">>("title");
  type Lang = 'ja' | 'en';
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('calorieClash.lang') as Lang) || 'ja');
  useEffect(() => { try { localStorage.setItem('calorieClash.lang', lang); } catch { /* ignore */ } }, [lang]);
  

  useEffect(() => { saveRule(rule); }, [rule]);

  const startGame = () => setScreen("game");
  const openOptions = () => { setReturnTo(screen === "settings" ? returnTo : (screen as Exclude<Screen, "settings">)); setScreen("settings"); };
  const openHelp = () => setScreen("help");
  const goTitle = () => setScreen("title");
  const closeSettings = () => setScreen(returnTo);

  const gradientStart = isDark ? '#000000' : '#f2f4f7';
  const gradientEnd = isDark ? '#0a0a0a' : '#e9edf2';

  return (
    <Box
      minH="100dvh"
      w="100%"
      color={isDark ? 'whiteAlpha.900' : 'gray.900'}
      style={{
        backgroundColor: isDark ? '#000' : '#fff',
        backgroundImage: `radial-gradient(circle at 50% 50%, ${gradientStart} 0%, ${gradientEnd} 70%)`,
        backgroundAttachment: 'fixed',
      }}
      position="relative"
    >
      {/* タイトル/ヘルプ/設定では従来通り右上固定バー、ゲーム画面はヘッダー内に配置 */}
      {screen !== 'game' && (
        <HStack position="fixed" top={{ base: '10px', md: '14px' }} right={{ base: '10px', md: '16px' }} zIndex={10} gap={2}>
          {(() => {
            const commonBtn = {
              size: 'sm' as const,
              variant: 'outline' as const,
              color: isDark ? 'white' : 'gray.800',
              borderColor: isDark ? 'whiteAlpha.700' : 'gray.400',
            };
            return (
              <>
                <Link href="https://github.com/path-finder2002/calorie-clash-GUI" target="_blank" rel="noreferrer noopener">
                  <Button {...commonBtn}>GitHub</Button>
                </Link>
                <Button {...commonBtn} onClick={() => setLang(l => (l === 'ja' ? 'en' : 'ja'))}>
                  {lang === 'ja' ? 'EN' : '日本語'}
                </Button>
                <Button size="sm" variant="ghost" onClick={toggleTheme}>
                  {isDark ? '☀️ Light' : '🌙 Dark'}
                </Button>
              </>
            );
          })()}
        </HStack>
      )}
      {screen === "title" && (
        <TitleScreen
          lang={lang}
          rule={rule}
          onChangeRule={setRule}
          onStart={startGame}
          onOptions={openOptions}
          onHelp={openHelp}
        />
      )}
      {screen === "game" && (
        <GameScreen
          lang={lang}
          onToggleLang={() => setLang(l => (l === 'ja' ? 'en' : 'ja'))}
          rule={rule}
          onExit={goTitle}
          onOptions={openOptions}
        />
      )}
      {screen === "help" && <HelpScreen onBack={goTitle} />}
      {screen === "settings" && (
        <SettingsScreen onClose={closeSettings} rule={rule} onChangeRule={setRule} />
      )}
    </Box>
  );
}
