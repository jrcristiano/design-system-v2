import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "./ThemeProvider";
import { useTheme } from "./ThemeContext";
import { DEFAULT_THEME_STORAGE_KEY, getThemeInitScript, resolveTheme } from "./theme";

type ChangeListener = (event: MediaQueryListEvent) => void;

const createMatchMedia = (initiallyDark = false) => {
	let isDark = initiallyDark;
	const listeners = new Set<ChangeListener>();
	const mediaQueryList = {
		media: "(prefers-color-scheme: dark)",
		get matches() {
			return isDark;
		},
		onchange: null,
		addEventListener: (_type: string, listener: ChangeListener) => listeners.add(listener),
		removeEventListener: (_type: string, listener: ChangeListener) => listeners.delete(listener),
		addListener: (listener: ChangeListener) => listeners.add(listener),
		removeListener: (listener: ChangeListener) => listeners.delete(listener),
		dispatchEvent: () => true,
	};

	Object.defineProperty(window, "matchMedia", {
		configurable: true,
		value: vi.fn(() => mediaQueryList),
	});

	return {
		setDark(nextValue: boolean) {
			isDark = nextValue;
			const event = { matches: nextValue, media: mediaQueryList.media } as MediaQueryListEvent;
			listeners.forEach((listener) => listener(event));
		},
	};
};

const ThemeConsumer = () => {
	const { resolvedTheme, setTheme, theme } = useTheme();
	return (
		<>
			<output data-testid="theme">{`${theme}:${resolvedTheme}`}</output>
			<button type="button" onClick={() => setTheme("dark")}>
				Dark
			</button>
		</>
	);
};

describe("ThemeProvider", () => {
	beforeEach(() => {
		window.localStorage.clear();
		delete document.documentElement.dataset.theme;
		delete document.documentElement.dataset.themePreference;
		document.documentElement.style.colorScheme = "";
		createMatchMedia(false);
	});

	it("applies light mode and exposes the selected and resolved themes", () => {
		render(
			<ThemeProvider defaultTheme="light">
				<ThemeConsumer />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("theme")).toHaveTextContent("light:light");
		expect(document.documentElement).toHaveAttribute("data-theme", "light");
		expect(document.documentElement.style.colorScheme).toBe("light");
	});

	it("persists and applies an explicit dark preference", () => {
		render(
			<ThemeProvider defaultTheme="light">
				<ThemeConsumer />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Dark" }));

		expect(screen.getByTestId("theme")).toHaveTextContent("dark:dark");
		expect(window.localStorage.getItem(DEFAULT_THEME_STORAGE_KEY)).toBe("dark");
		expect(document.documentElement).toHaveAttribute("data-theme", "dark");
	});

	it("restores a persisted preference", () => {
		window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, "dark");

		render(
			<ThemeProvider defaultTheme="system">
				<ThemeConsumer />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("theme")).toHaveTextContent("dark:dark");
	});

	it("tracks operating-system changes only while system is selected", () => {
		const media = createMatchMedia(false);
		render(
			<ThemeProvider defaultTheme="system">
				<ThemeConsumer />
			</ThemeProvider>,
		);

		expect(screen.getByTestId("theme")).toHaveTextContent("system:light");

		act(() => media.setDark(true));

		expect(screen.getByTestId("theme")).toHaveTextContent("system:dark");
		expect(document.documentElement).toHaveAttribute("data-theme", "dark");
	});

	it("keeps light as the server-safe fallback", () => {
		expect(resolveTheme("system", "light")).toBe("light");
		expect(getThemeInitScript()).toContain("prefers-color-scheme: dark");
	});
});
