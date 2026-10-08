// Suppress noisy React warnings/errors emitted in tests (React 19 ref deprecation, act() and controlled inputs)
const originalWarn = console.warn;
const originalError = console.error;

const isSuppressed = (args: any[]) => {
	if (!args || args.length === 0) return false;
	const msg = String(args[0]);
	return (
		msg.includes("Accessing element.ref was removed in React 19") ||
		msg.includes("was not wrapped in act") ||
		msg.includes("You provided a `checked` prop to a form field without an `onChange` handler")
	);
};

console.warn = (...args: any[]) => {
	if (isSuppressed(args)) return;
	originalWarn(...args);
};

console.error = (...args: any[]) => {
	if (isSuppressed(args)) return;
	originalError(...args);
};

import "@testing-library/jest-dom/vitest";
