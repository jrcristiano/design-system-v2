/**
 * Stopwatch Component - Public API
 *
 * @example
 * ```tsx
 * <Stopwatch.Root defaultValue={{ hours: 0, minutes: 0, seconds: 0 }}>
 *   <Stopwatch.Label>Timer</Stopwatch.Label>
 *   <Stopwatch.Display />
 *   <Stopwatch.Controls />
 * </Stopwatch.Root>
 * ```
 */

import { StopwatchRoot } from "./Stopwatch.root";
import { StopwatchDisplay } from "./Stopwatch.display";
import { StopwatchControls } from "./Stopwatch.controls";
import { StopwatchLabel } from "./Stopwatch.label";

export const Stopwatch = {
	Root: StopwatchRoot,
	Display: StopwatchDisplay,
	Controls: StopwatchControls,
	Label: StopwatchLabel,
};

// Re-export types
export type {
	StopwatchValue,
	StopwatchState,
	StopwatchError,
	TimeFormat,
	StopwatchRootProps,
	StopwatchDisplayProps,
	StopwatchControlsProps,
	StopwatchLabelProps,
	StopwatchButtonProps,
	StopwatchContextValue,
} from "./Stopwatch.types";

// Re-export utilities
export {
	durationToSeconds,
	secondsToDuration,
	formatDuration,
	isValidStopwatchValue,
	addSecond,
	compareDurations,
	hasReachedLimit,
	createStopwatchError,
} from "./Stopwatch.utils";

// Re-export constants
export {
	DEFAULT_STOPWATCH_VALUE,
	TIMER_INTERVAL_MS,
	MAX_VALID_VALUES,
	STOPWATCH_STATES,
	CONTROL_LABELS,
	STOPWATCH_COLORS,
} from "./Stopwatch.constants";
