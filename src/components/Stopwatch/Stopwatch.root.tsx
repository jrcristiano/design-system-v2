/**
 * Root component do Stopwatch (Container)
 * @module Stopwatch.Root
 */

import React, { useMemo } from "react";
import { StopwatchContext } from "./Stopwatch.types";
import { useStopwatchState } from "./hooks/useStopwatchState";
import { useStopwatchTimer } from "./hooks/useStopwatchTimer";
import type { StopwatchRootProps, StopwatchContextValue } from "./Stopwatch.types";

export const StopwatchRoot: React.FC<StopwatchRootProps> = ({
	children,
	defaultValue,
	value,
	onChange,
	onStateChange,
	onError,
	disabled = false,
	autoStart = false,
	timeLimit,
	className,
}) => {
	// Gerencia estado
	const {
		value: currentValue,
		state,
		isRunning,
		isPaused,
		isLimitReached,
		error,
		handlers,
	} = useStopwatchState({
		value,
		defaultValue,
		onChange,
		onStateChange,
		onError,
		disabled,
		autoStart,
		timeLimit,
	});

	// Gerencia timer
	useStopwatchTimer({
		isRunning,
		disabled,
		onTick: handlers.tick,
		onError: (err) =>
			onError?.({
				code: "TIMER_OVERFLOW",
				message: err.message,
				timestamp: Date.now(),
			}),
	});

	// Context value memoizado
	const contextValue: StopwatchContextValue = useMemo(
		() => ({
			value: currentValue,
			state,
			isRunning,
			isPaused,
			isLimitReached,
			disabled,
			timeLimit,
			handlers: {
				onPlay: handlers.play,
				onPause: handlers.pause,
				onReset: handlers.reset,
			},
		}),
		[
			currentValue,
			state,
			isRunning,
			isPaused,
			isLimitReached,
			disabled,
			timeLimit,
			handlers.play,
			handlers.pause,
			handlers.reset,
		],
	);

	// Render error state se necessário
	if (error) {
		return (
			<div role="alert" className={className}>
				<p>Erro no cronômetro: {error.message}</p>
				<button onClick={handlers.reset}>Reiniciar</button>
			</div>
		);
	}

	return (
		<StopwatchContext.Provider value={contextValue}>
			<div className={className}>{children}</div>
		</StopwatchContext.Provider>
	);
};

StopwatchRoot.displayName = "Stopwatch.Root";
