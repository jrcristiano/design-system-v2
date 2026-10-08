import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	stories: ["../src/storybook/**/*.mdx", "../src/storybook/**/*.stories.@(js|jsx|ts|tsx)"],
	addons: ["@storybook/addon-a11y"],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	viteFinal: async (viteConfig) => {
		viteConfig.server = viteConfig.server || {};
		viteConfig.server.allowedHosts = true;
		return viteConfig;
	},
};

export default config;
