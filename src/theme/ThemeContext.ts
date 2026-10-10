import { createContext, useContext } from "react";
import type { ResolvedTheme, ThemePreference } from "./theme";

export interface ThemeContextValue {
	/** Preference selected by the user. */
	theme: ThemePreference;
	/** Theme currently applied after resolving `system`. */
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useTheme must be used within a ThemeProvider");
	return context;
};
