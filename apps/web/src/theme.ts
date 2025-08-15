import { extendTheme, ThemeConfig } from "@chakra-ui/react";
const config: ThemeConfig = { initialColorMode: "dark", useSystemColorMode: false };
export const theme = extendTheme({
  config,
  fonts: { heading: "Inter, system-ui, sans-serif", body: "Inter, system-ui, sans-serif" },
  colors: { brand: { 500: "#00D1B2" } }
});
