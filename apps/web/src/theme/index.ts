// Chakra UI v3: ダークモード向けのセマンティックトークンと System を定義
import {
  createSystem,
  defaultConfig,
  defineSemanticTokens,
  defineSlotRecipe,
} from "@chakra-ui/react";

// 明暗に応じて切り替わるセマンティックカラー
export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: { value: { base: "{colors.white}", _dark: "{colors.gray.950}" } },
    surface: { value: { base: "{colors.gray.50}", _dark: "{colors.gray.900}" } },
    elevated: { value: { base: "{colors.white}", _dark: "{colors.gray.800}" } },
    border: { value: { base: "{colors.gray.200}", _dark: "{colors.whiteAlpha.300}" } },
    fg: { value: { base: "{colors.gray.900}", _dark: "{colors.whiteAlpha.900}" } },
    "fg.muted": { value: { base: "{colors.gray.600}", _dark: "{colors.whiteAlpha.700}" } },
    accent: { value: { base: "{colors.teal.600}", _dark: "{colors.teal.300}" } },
    "accent.fg": { value: { base: "{colors.white}", _dark: "{colors.gray.900}" } },
  },
});

// NumberInput の入力テキストを全体で中央揃え（v3 slot recipe）
const numberInputRecipe = defineSlotRecipe({
  slots: ["root", "input", "control", "incrementTrigger", "decrementTrigger"],
  base: {
    input: { textAlign: "left" },
  },
});

// System を作成（defaultConfig をベース）
export const system = createSystem(defaultConfig, {
  theme: {
    semanticTokens,
    // Chakra v3 のレシピに上書きを適用
    recipes: {
      numberInput: numberInputRecipe,
    },
  },
});

export type AppSystem = typeof system;
