import { useEffect, useState } from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
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
      {/* 全画面共通: 右上トグル */}
      <HStack position="fixed" top={{ base: '10px', md: '14px' }} right={{ base: '10px', md: '16px' }} zIndex={10}>
        <Button size="sm" variant="ghost" onClick={toggleTheme}>
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </HStack>
      {screen === "title" && (
        <TitleScreen
          rule={rule}
          onChangeRule={setRule}
          onStart={startGame}
          onOptions={openOptions}
          onHelp={openHelp}
        />
      )}
      {screen === "game" && (
        <GameScreen rule={rule} onExit={goTitle} onOptions={openOptions} />
      )}
      {screen === "help" && <HelpScreen onBack={goTitle} />}
      {screen === "settings" && (
        <SettingsScreen onClose={closeSettings} rule={rule} onChangeRule={setRule} />
      )}
    </Box>
  );
}
