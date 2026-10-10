import {
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type PropsWithChildren,
	type ReactElement,
} from "react";
import {
	applyTheme,
	DEFAULT_THEME_STORAGE_KEY,
	getSystemTheme,
	getThemeInitScript,
	isThemePreference,
	readStoredTheme,
	resolveTheme,
	storeTheme,
	type ResolvedTheme,
	type ThemePreference,
} from "./theme";
import { ThemeContext } from "./ThemeContext";

export interface ThemeProviderProps extends PropsWithChildren {
	defaultTheme?: ThemePreference;
	storageKey?: string;
}

export const ThemeProvider = ({
	children,
	defaultTheme = "system",
	storageKey = DEFAULT_THEME_STORAGE_KEY,
}: ThemeProviderProps): ReactElement => {
	const [theme, setThemeState] = useState<ThemePreference>(defaultTheme);
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
		resolveTheme(defaultTheme, "light"),
	);
	const initialized = useRef(false);

	useLayoutEffect(() => {
		let activeTheme = theme;

		if (!initialized.current) {
			initialized.current = true;
			const attributeTheme = document.documentElement.dataset.themePreference;
			activeTheme =
				readStoredTheme(storageKey) ??
				(isThemePreference(attributeTheme) ? attributeTheme : null) ??
				defaultTheme;

			if (activeTheme !== theme) setThemeState(activeTheme);
		}

		const nextResolvedTheme = applyTheme(activeTheme);
		setResolvedTheme((currentTheme) =>
			currentTheme === nextResolvedTheme ? currentTheme : nextResolvedTheme,
		);
	}, [defaultTheme, storageKey, theme]);

	useLayoutEffect(() => {
		if (theme !== "system" || typeof window.matchMedia !== "function") return undefined;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleSystemThemeChange = () => {
			const nextResolvedTheme = getSystemTheme();
			applyTheme("system");
			setResolvedTheme((currentTheme) =>
				currentTheme === nextResolvedTheme ? currentTheme : nextResolvedTheme,
			);
		};

		mediaQuery.addEventListener("change", handleSystemThemeChange);
		return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
	}, [theme]);

	useLayoutEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === storageKey && isThemePreference(event.newValue)) {
				setThemeState(event.newValue);
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, [storageKey]);

	const setTheme = useCallback(
		(nextTheme: ThemePreference) => {
			storeTheme(nextTheme, storageKey);
			const nextResolvedTheme = applyTheme(nextTheme);
			setThemeState(nextTheme);
			setResolvedTheme((currentTheme) =>
				currentTheme === nextResolvedTheme ? currentTheme : nextResolvedTheme,
			);
		},
		[storageKey],
	);

	const contextValue = useMemo(
		() => ({ theme, resolvedTheme, setTheme }),
		[resolvedTheme, setTheme, theme],
	);

	return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export interface ThemeScriptProps {
	defaultTheme?: ThemePreference;
	nonce?: string;
	storageKey?: string;
}

/** Place this component in the document head of SSR applications. */
export const ThemeScript = ({
	defaultTheme = "system",
	nonce,
	storageKey = DEFAULT_THEME_STORAGE_KEY,
}: ThemeScriptProps): ReactElement => (
	<script
		nonce={nonce}
		suppressHydrationWarning
		dangerouslySetInnerHTML={{ __html: getThemeInitScript(storageKey, defaultTheme) }}
	/>
);
