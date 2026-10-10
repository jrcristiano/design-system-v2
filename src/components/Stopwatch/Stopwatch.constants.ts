/**
 * Constantes do componente Stopwatch
 * @module Stopwatch.constants
 */

import type { StopwatchValue, StopwatchState } from "./Stopwatch.types";

export const DEFAULT_STOPWATCH_VALUE: StopwatchValue = {
	hours: 0,
	minutes: 0,
	seconds: 0,
} as const;

export const TIMER_INTERVAL_MS = 1000 as const;

export const MAX_VALID_VALUES: StopwatchValue = {
	hours: 99,
	minutes: 59,
	seconds: 59,
} as const;

export const STOPWATCH_STATES: Record<Uppercase<StopwatchState>, StopwatchState> = {
	IDLE: "idle",
	RUNNING: "running",
	PAUSED: "paused",
	LIMIT_REACHED: "limit_reached",
} as const;

export const CONTROL_LABELS = {
	play: "Iniciar",
	pause: "Pausar",
	reset: "Redefinir",
} as const;

export const TIME_FORMATS = {
	"HH:MM:SS": "HH:MM:SS",
	"MM:SS": "MM:SS",
	"HH:MM": "HH:MM",
} as const;

export const STOPWATCH_COLORS = {
	background: {
		idle: "bg-[var(--ds-color-surface)] outline outline-1 outline-offset-[-1px] outline-[var(--ds-color-neutral-50)]",
		running:
			"bg-[var(--ds-color-surface)] outline outline-1 outline-offset-[-1px] outline-[var(--ds-color-blue-40)]",
		paused:
			"bg-[var(--ds-color-blue-90)] outline outline-1 outline-offset-[-1px] outline-[var(--ds-color-blue-10)]",
		disabled:
			"bg-[var(--ds-color-neutral-80)] outline outline-1 outline-offset-[-1px] outline-[var(--ds-color-neutral-80)] cursor-not-allowed",
	},
	text: {
		primary: "text-[var(--ds-color-neutral-10)]",
		secondary: "text-[var(--ds-color-blue-30)]",
		disabled: "text-[var(--ds-color-neutral-40)]",
	},
	button: {
		enabled:
			"text-[var(--ds-color-neutral-10)] hover:text-[var(--ds-color-blue-30)] cursor-pointer",
		disabled: "text-[var(--ds-color-neutral-40)] cursor-not-allowed",
	},
} as const;

export const ERROR_CODES = {
	INVALID_VALUE: "INVALID_VALUE",
	TIMER_OVERFLOW: "TIMER_OVERFLOW",
	LIMIT_EXCEEDED: "LIMIT_EXCEEDED",
} as const;
