import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import storybook from "eslint-plugin-storybook";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		ignores: ["dist/**", "node_modules/**", "storybook-static/**", "build/**"],
	},
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			storybook,
		},
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			storybook.configs["flat/recommended"],
		],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
		},
	},
]);
