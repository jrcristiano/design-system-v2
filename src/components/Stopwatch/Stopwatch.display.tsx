/**
 * Componente de display do Stopwatch (Presentational)
 * @module Stopwatch.Display
 */

import React, { useContext } from "react";
import clsx from "clsx";
import { StopwatchContext } from "./Stopwatch.types";
import { formatDuration } from "./Stopwatch.utils";
import { STOPWATCH_COLORS } from "./Stopwatch.constants";
import type { StopwatchDisplayProps } from "./Stopwatch.types";

export const StopwatchDisplay: React.FC<StopwatchDisplayProps> = ({
	className,
	format = "HH:MM:SS",
}) => {
	const context = useContext(StopwatchContext);

	if (!context) {
		throw new Error("Stopwatch.Display must be used within Stopwatch.Root");
	}

	const { value, isRunning, isPaused, isLimitReached, disabled } = context;

	// Determina cor de fundo baseada no estado
	const getBackgroundColor = (): string => {
		if (disabled) return STOPWATCH_COLORS.background.disabled;
		if (isRunning) return STOPWATCH_COLORS.background.running;
		if (isPaused || isLimitReached) return STOPWATCH_COLORS.background.paused;
		return STOPWATCH_COLORS.background.idle;
	};

	// Determina cor do texto baseada no estado
	const getTextColor = (): string => {
		if (disabled) return STOPWATCH_COLORS.text.disabled;
		if (isRunning || isPaused || isLimitReached) {
			return STOPWATCH_COLORS.text.secondary;
		}
		return STOPWATCH_COLORS.text.primary;
	};

	const formattedTime = formatDuration(value, format);

	return (
		<div
			className={clsx(
				"inline-flex items-center justify-center rounded-xl p-4",
				getBackgroundColor(),
				className,
			)}
		>
			<span
				className={clsx("font-poppins text-base font-medium leading-none", getTextColor())}
				aria-live="polite"
				aria-atomic="true"
			>
				{formattedTime}
			</span>
		</div>
	);
};

StopwatchDisplay.displayName = "Stopwatch.Display";
