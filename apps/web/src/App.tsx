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

  const gradient = isDark ? "radial(#000000 0%, #0a0a0a 70%)" : "radial(#f2f4f7 0%, #e9edf2 70%)";

  return (
    <Box minH="100dvh" bgGradient={gradient} color={isDark ? 'whiteAlpha.900' : 'gray.900'} position="relative">
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
