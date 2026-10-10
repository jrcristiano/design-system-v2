export const DEFAULT_THEME_STORAGE_KEY = "ds-theme";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = Exclude<ThemePreference, "system">;

export const isThemePreference = (value: unknown): value is ThemePreference =>
	value === "light" || value === "dark" || value === "system";

export const getSystemTheme = (): ResolvedTheme => {
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
		return "light";
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const resolveTheme = (
	theme: ThemePreference,
	systemTheme: ResolvedTheme = getSystemTheme(),
): ResolvedTheme => (theme === "system" ? systemTheme : theme);

export const readStoredTheme = (storageKey = DEFAULT_THEME_STORAGE_KEY): ThemePreference | null => {
	if (typeof window === "undefined") return null;

	try {
		const storedTheme = window.localStorage.getItem(storageKey);
		return isThemePreference(storedTheme) ? storedTheme : null;
	} catch {
		return null;
	}
};

export const storeTheme = (
	theme: ThemePreference,
	storageKey = DEFAULT_THEME_STORAGE_KEY,
): void => {
	if (typeof window === "undefined") return;

	try {
		window.localStorage.setItem(storageKey, theme);
	} catch {
		// Storage may be unavailable in private browsing or restricted embeds.
	}
};

export const applyTheme = (
	theme: ThemePreference,
	root: HTMLElement | null = typeof document === "undefined" ? null : document.documentElement,
): ResolvedTheme => {
	const resolvedTheme = resolveTheme(theme);

	if (root) {
		root.dataset.theme = resolvedTheme;
		root.dataset.themePreference = theme;
		root.style.colorScheme = resolvedTheme;
	}

	return resolvedTheme;
};

export const getThemeInitScript = (
	storageKey = DEFAULT_THEME_STORAGE_KEY,
	fallbackTheme: ThemePreference = "system",
): string => {
	const serializedStorageKey = JSON.stringify(storageKey);
	const serializedFallback = JSON.stringify(fallbackTheme);

	return `(function(){try{var k=${serializedStorageKey};var f=${serializedFallback};var s=localStorage.getItem(k);var t=s==='light'||s==='dark'||s==='system'?s:f;var r=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;var e=document.documentElement;e.dataset.theme=r;e.dataset.themePreference=t;e.style.colorScheme=r;}catch(_){document.documentElement.dataset.theme='light';document.documentElement.dataset.themePreference='light';document.documentElement.style.colorScheme='light';}})();`;
};
