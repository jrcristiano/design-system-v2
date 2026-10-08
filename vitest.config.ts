import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname =
	typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		include: ["src/**/*.{test,spec}.{ts,tsx}"],
		exclude: ["node_modules", "dist", ".storybook"],
		coverage: {
			enabled: false,
			provider: "v8",
			reporter: ["text", "lcov"],
			reportsDirectory: "./coverage",
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"src/**/*.test.{ts,tsx}",
				"src/**/*.stories.{ts,tsx}",
				"src/**/*.d.ts",
				"src/**/*.interface.ts",
				"src/**/*.type.ts",
				"src/**/*Icon.tsx",
				"src/**/index.ts",
				"src/App.tsx",
				"src/main.tsx",
				"src/validators/**",
				"src/types/**",
				"src/utils/mask.util.ts",
			],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(dirname, "./src"),
		},
	},
});
