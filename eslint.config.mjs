import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginReactNative from "eslint-plugin-react-native";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js, eslintPluginReactNative, typescriptEslintPlugin },
    extends: ["js/recommended"],
    rules: {
      // "react-native/no-unused-styles": "warn",
      // "react-native/split-platform-components": "warn",
      "react-native/no-inline-styles": "off",
      "react-native/no-color-literals": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
  js.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
]);
