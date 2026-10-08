/**
 * Componente de label do Stopwatch
 * @module Stopwatch.Label
 */

import React, { useContext } from "react";
import clsx from "clsx";
import { StopwatchContext } from "./Stopwatch.types";
import { STOPWATCH_COLORS } from "./Stopwatch.constants";
import type { StopwatchLabelProps } from "./Stopwatch.types";

export const StopwatchLabel: React.FC<StopwatchLabelProps> = ({
	children,
	className,
	position = "bottom",
}) => {
	const context = useContext(StopwatchContext);

	if (!context) {
		throw new Error("Stopwatch.Label must be used within Stopwatch.Root");
	}

	const { disabled } = context;

	const positionClasses = {
		top: "mb-1",
		bottom: "mt-1",
		left: "mr-2",
		right: "ml-2",
	};

	return (
		<span
			className={clsx(
				"text-xs font-normal leading-[18px]",
				disabled ? STOPWATCH_COLORS.text.disabled : STOPWATCH_COLORS.text.primary,
				positionClasses[position],
				className,
			)}
		>
			{children}
		</span>
	);
};

StopwatchLabel.displayName = "Stopwatch.Label";
