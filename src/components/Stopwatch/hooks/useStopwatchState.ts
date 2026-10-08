/**
 * Hook para gerenciar estado do Stopwatch
 * @module useStopwatchState
 */

import {
	DEFAULT_STOPWATCH_VALUE,
	STOPWATCH_STATES,
	MAX_VALID_VALUES,
} from "../Stopwatch.constants";

import { useState, useCallback, useMemo, useEffect } from "react";
import type {
	StopwatchValue,
	StopwatchState,
	StopwatchError,
	StopwatchHookProps,
} from "../Stopwatch.types";

import {
	isValidStopwatchValue,
	compareDurations,
	hasReachedLimit,
	createStopwatchError,
	addSecond,
} from "../Stopwatch.utils";

interface UseStopwatchStateReturn {
	value: StopwatchValue;
	state: StopwatchState;
	isRunning: boolean;
	isPaused: boolean;
	isLimitReached: boolean;
	error: StopwatchError | null;
	handlers: {
		play: () => void;
		pause: () => void;
		reset: () => void;
		tick: () => void;
	};
}

export const useStopwatchState = ({
	value: controlledValue,
	defaultValue = DEFAULT_STOPWATCH_VALUE,
	onChange,
	onStateChange,
	onError,
	disabled = false,
	autoStart = false,
	timeLimit,
}: StopwatchHookProps): UseStopwatchStateReturn => {
	const [internalValue, setInternalValue] = useState<StopwatchValue>(() => {
		if (!isValidStopwatchValue(defaultValue)) {
			onError?.(createStopwatchError("INVALID_VALUE", "Invalid defaultValue provided"));
			return DEFAULT_STOPWATCH_VALUE;
		}
		return defaultValue;
	});

	const [state, setState] = useState<StopwatchState>(
		autoStart ? STOPWATCH_STATES.RUNNING : STOPWATCH_STATES.IDLE,
	);
	const [error, setError] = useState<StopwatchError | null>(null);

	const isControlled = controlledValue !== undefined;
	const currentValue = isControlled ? controlledValue : internalValue;

	useEffect(() => {
		if (isControlled && controlledValue && !isValidStopwatchValue(controlledValue)) {
			const error = createStopwatchError("INVALID_VALUE", "Invalid controlled value provided");
			setError(error);
			onError?.(error);
		}
	}, [isControlled, controlledValue, onError]);

	const isRunning = state === STOPWATCH_STATES.RUNNING;
	const isPaused = state === STOPWATCH_STATES.PAUSED;
	const isLimitReached = useMemo(
		() => hasReachedLimit(currentValue, timeLimit),
		[currentValue, timeLimit],
	);

	useEffect(() => {
		if (autoStart && !disabled && state === STOPWATCH_STATES.IDLE) {
			setState(STOPWATCH_STATES.RUNNING);
			onStateChange?.(STOPWATCH_STATES.RUNNING);
		}
	}, [autoStart, disabled, state, onStateChange]);

	useEffect(() => {
		if (isLimitReached && isRunning) {
			setState(STOPWATCH_STATES.LIMIT_REACHED);
			onStateChange?.(STOPWATCH_STATES.LIMIT_REACHED);
		}
	}, [isLimitReached, isRunning, onStateChange]);

	const handlePlay = useCallback(() => {
		if (disabled || isRunning || isLimitReached) return;
		setState(STOPWATCH_STATES.RUNNING);
		onStateChange?.(STOPWATCH_STATES.RUNNING);
	}, [disabled, isRunning, isLimitReached, onStateChange]);

	const handlePause = useCallback(() => {
		if (disabled || !isRunning) return;
		setState(STOPWATCH_STATES.PAUSED);
		onStateChange?.(STOPWATCH_STATES.PAUSED);
	}, [disabled, isRunning, onStateChange]);

	const handleReset = useCallback(() => {
		if (disabled) return;
		const resetValue = DEFAULT_STOPWATCH_VALUE;

		if (!isControlled) {
			setInternalValue(resetValue);
		}

		setState(STOPWATCH_STATES.IDLE);
		onStateChange?.(STOPWATCH_STATES.IDLE);
		onChange?.(resetValue);
	}, [disabled, isControlled, onChange, onStateChange]);

	const handleTick = useCallback(() => {
		if (disabled || !isRunning || isLimitReached) return;

		try {
			const newValue = addSecond(currentValue);

			if (compareDurations(newValue, MAX_VALID_VALUES) > 0) {
				throw createStopwatchError("TIMER_OVERFLOW", "Timer exceeded maximum value");
			}

			if (!isControlled) {
				setInternalValue(newValue);
			}

			onChange?.(newValue);
		} catch (err) {
			const error =
				err instanceof Error
					? createStopwatchError("TIMER_OVERFLOW", err.message)
					: createStopwatchError("TIMER_OVERFLOW", "Unknown timer error");

			setError(error);
			onError?.(error);
			setState(STOPWATCH_STATES.IDLE);
		}
	}, [disabled, isRunning, isLimitReached, currentValue, isControlled, onChange, onError]);

	return {
		value: currentValue,
		state,
		isRunning,
		isPaused,
		isLimitReached,
		error,
		handlers: {
			play: handlePlay,
			pause: handlePause,
			reset: handleReset,
			tick: handleTick,
		},
	};
};
