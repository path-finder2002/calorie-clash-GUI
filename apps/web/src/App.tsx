import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import TitleScreen from "./TitleScreen";
import GameScreen from "./GameScreen";
import SettingsScreen from "./SettingsScreen";
import HelpScreen from "./HelpScreen";
import type { GameRule } from "./models";
import { defaultRule } from "./models";
import { loadRule, saveRule } from "./storage";

type Screen = "title" | "game" | "help" | "settings";

export default function App() {
  const [screen, setScreen] = useState<Screen>("title");
  const [rule, setRule] = useState<GameRule>(() => loadRule() ?? defaultRule);
  const [returnTo, setReturnTo] = useState<Exclude<Screen, "settings">>("title");
  

  useEffect(() => { saveRule(rule); }, [rule]);

  const startGame = () => setScreen("game");
  const openOptions = () => { setReturnTo(screen === "settings" ? returnTo : (screen as Exclude<Screen, "settings">)); setScreen("settings"); };
  const openHelp = () => setScreen("help");
  const goTitle = () => setScreen("title");
  const closeSettings = () => setScreen(returnTo);

  return (
    <Box minH="100dvh">
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
