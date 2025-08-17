import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./theme";
import App from "@/App";
import { AppThemeProvider } from "@/theme/colorMode";
import 'swiper/css';
import 'swiper/css/navigation';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <AppThemeProvider>
        <App />
      </AppThemeProvider>
    </ChakraProvider>
  </React.StrictMode>
);
