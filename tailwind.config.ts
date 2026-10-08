import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./.storybook/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--ds-font-family-base)"],
			},
			spacing: {
				gutter: "var(--ds-gutter)",
				margin: "var(--ds-margin)",
			},
			maxWidth: {
				container: "var(--ds-maxwidth-container)",
			},
			screens: {
				xs: "var(--ds-breakpoint-xs)", // 0px
				sm: "var(--ds-breakpoint-sm)", // 480px
				md: "var(--ds-breakpoint-md)", // 768px
				lg: "var(--ds-breakpoint-lg)", // 1024px
				xl: "var(--ds-breakpoint-xl)", // 1280px
				"2xl": "var(--ds-breakpoint-2xl)", // 1536px
			},
		},
	},
	plugins: [],
};

export default config;
