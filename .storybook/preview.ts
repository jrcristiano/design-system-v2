import "../src/styles/globals.css";
import { createElement, useLayoutEffect, type ReactNode } from "react";
import { ThemeProvider, useTheme, type ThemePreference } from "../src/theme";

const StoryThemeSync = ({ children, theme }: { children: ReactNode; theme: ThemePreference }) => {
	const { setTheme } = useTheme();
	useLayoutEffect(() => setTheme(theme), [setTheme, theme]);
	return children;
};

export const globalTypes = {
	theme: {
		description: "Tema global do Design System",
		defaultValue: "system",
		toolbar: {
			icon: "mirror",
			items: [
				{ value: "light", title: "Light" },
				{ value: "dark", title: "Dark" },
				{ value: "system", title: "System" },
			],
		},
	},
};

export const decorators = [
	(Story: () => ReactNode, context: { globals: { theme?: ThemePreference } }) => {
		const theme = context.globals.theme ?? "system";
		return createElement(
			ThemeProvider,
			{ defaultTheme: theme },
			createElement(StoryThemeSync, { theme }, createElement(Story)),
		);
	},
];

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: { expanded: true },
	layout: "centered",
	backgrounds: { disable: true },

	a11y: {
		test: "error",
	},
};
