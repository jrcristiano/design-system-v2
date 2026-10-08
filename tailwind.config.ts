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
				// Keep these static values synchronized with src/tokens/breakpoints.css.
				xs: "0px",
				sm: "480px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
				"2xl": "1536px",
			},
		},
	},
	plugins: [],
};

export default config;
