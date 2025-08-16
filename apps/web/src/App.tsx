import { useEffect, useState } from "react";
import { Box, useDisclosure } from "@chakra-ui/react";
import TitleScreen from "./TitleScreen";
import GameScreen from "./GameScreen";
import SettingsModal from "./SettingsModal";
import HelpScreen from "./HelpScreen";
import { GameRule, defaultRule } from "./models";
import { loadRule, saveRule } from "./storage";

type Screen = "title" | "game" | "help";

export default function App() {
  const [screen, setScreen] = useState<Screen>("title");
  const [rule, setRule] = useState<GameRule>(() => loadRule() ?? defaultRule);
  const settings = useDisclosure();
  

  useEffect(() => { saveRule(rule); }, [rule]);

  const startGame = () => setScreen("game");
  const openOptions = () => settings.onOpen();
  const openHelp = () => setScreen("help");
  const goTitle = () => setScreen("title");

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
      <SettingsModal isOpen={settings.isOpen} onClose={settings.onClose} rule={rule} onChangeRule={setRule} />
    </Box>
  );
}
