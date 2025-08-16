import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, defaultSystem, ColorModeScript } from "@chakra-ui/react";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ColorModeScript />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
