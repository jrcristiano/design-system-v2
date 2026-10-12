import { readFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";
import { describe, expect, it } from "vitest";

type ThemeMode = "light" | "dark";
type ColorTokens = Record<string, string>;

const colorScale = readFileSync(resolvePath(process.cwd(), "src/tokens/colors.css"), "utf8");
const themeStyles = readFileSync(resolvePath(process.cwd(), "src/tokens/theme.css"), "utf8");

const parseTokens = (source: string): ColorTokens =>
	Object.fromEntries(
		[...source.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((match) => [
			match[1],
			match[2].replace(/!important/g, "").trim(),
		]),
	);

const getThemeBlock = (mode: ThemeMode): string => {
	const selector =
		mode === "light"
			? /:root,\s*:root\[data-theme="light"\]\s*\{([\s\S]*?)\}/
			: /:root\[data-theme="dark"\]\s*\{([\s\S]*?)\}/;
	const block = themeStyles.match(selector)?.[1];

	if (!block) throw new Error(`Missing ${mode} theme token block`);
	return block;
};

const resolveToken = (tokens: ColorTokens, name: string, seen = new Set<string>()): string => {
	if (seen.has(name)) throw new Error(`Circular color token reference: ${name}`);
	seen.add(name);

	const value = tokens[name];
	if (!value) throw new Error(`Missing color token: ${name}`);

	const reference = value.match(/var\((--[\w-]+)/)?.[1];
	return reference ? resolveToken(tokens, reference, seen) : value;
};

const getRgb = (color: string): [number, number, number] => {
	const hex = color.match(/^#([\da-f]{6}|[\da-f]{3})$/i)?.[1];
	if (!hex) throw new Error(`Expected a hexadecimal color, received: ${color}`);

	const normalized = hex.length === 3 ? [...hex].map((digit) => digit + digit).join("") : hex;
	return [0, 2, 4].map((index) => Number.parseInt(normalized.slice(index, index + 2), 16)) as [
		number,
		number,
		number,
	];
};

const getLuminance = (color: string): number => {
	const channels = getRgb(color).map((channel) => channel / 255);
	const linear = channels.map((channel) =>
		channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
	);
	return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
};

const getContrastRatio = (mode: ThemeMode, foreground: string, background: string): number => {
	const tokens = {
		...parseTokens(colorScale),
		...parseTokens(getThemeBlock("light")),
		...parseTokens(getThemeBlock(mode)),
	};
	const foregroundLuminance = getLuminance(resolveToken(tokens, foreground));
	const backgroundLuminance = getLuminance(resolveToken(tokens, background));
	const lighter = Math.max(foregroundLuminance, backgroundLuminance);
	const darker = Math.min(foregroundLuminance, backgroundLuminance);

	return (lighter + 0.05) / (darker + 0.05);
};

describe("theme color contrast", () => {
	it.each(["light", "dark"] as const)("keeps muted text readable in %s mode", (mode) => {
		expect(
			getContrastRatio(mode, "--ds-color-text-muted", "--ds-color-surface"),
		).toBeGreaterThanOrEqual(4.5);
	});

	it.each(["light", "dark"] as const)(
		"keeps primary container labels readable in %s mode",
		(mode) => {
			expect(
				getContrastRatio(mode, "--ds-color-on-primary-container", "--ds-color-primary-container"),
			).toBeGreaterThanOrEqual(4.5);
		},
	);
});
