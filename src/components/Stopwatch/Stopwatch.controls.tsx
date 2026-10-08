/**
 * Componente de controles do Stopwatch
 * @module Stopwatch.Controls
 */

import React, { useContext } from "react";
import clsx from "clsx";
import { PlayCircleIcon, PauseCircleIcon, ClockClockwiseIcon } from "@phosphor-icons/react";
import {
	StopwatchContext,
	type StopwatchButtonProps,
	type StopwatchControlsProps,
} from "./Stopwatch.types";
import { STOPWATCH_COLORS, CONTROL_LABELS } from "./Stopwatch.constants";

// Tipo para os controles retornados
type ControlItem = {
	type: "play" | "pause" | "reset";
	onClick: () => void;
	label: string;
};

// Componente interno do botão
const ControlButton: React.FC<StopwatchButtonProps> = ({
	type,
	disabled,
	onClick,
	label,
	className,
}) => {
	const Icon = {
		play: PlayCircleIcon,
		pause: PauseCircleIcon,
		reset: ClockClockwiseIcon,
	}[type];

	const iconProps = {
		play: { weight: "fill" as const },
		pause: { weight: "fill" as const },
		reset: { weight: "bold" as const },
	}[type];

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={clsx(
				"inline-flex items-center justify-center p-0 transition-colors bg-transparent border-0",
				disabled ? STOPWATCH_COLORS.button.disabled : STOPWATCH_COLORS.button.enabled,
				className,
			)}
			aria-label={label || CONTROL_LABELS[type]}
			aria-disabled={disabled}
		>
			<Icon size={20} {...iconProps} />
		</button>
	);
};

// Componente principal de controles
export const StopwatchControls: React.FC<StopwatchControlsProps> = ({
	className,
	orientation = "horizontal",
	showLabels = true,
}) => {
	const context = useContext(StopwatchContext);

	if (!context) {
		throw new Error("Stopwatch.Controls must be used within Stopwatch.Root");
	}

	const { isRunning, isPaused, isLimitReached, disabled, handlers } = context;

	// Determina quais controles mostrar baseado no estado - com tipo de retorno explícito
	const getControls = (): ControlItem[] => {
		if (isLimitReached) {
			return [{ type: "reset", onClick: handlers.onReset, label: "Redefinir" }];
		}

		if (isRunning) {
			return [{ type: "pause", onClick: handlers.onPause, label: "Pausar" }];
		}

		if (isPaused) {
			return [
				{ type: "play", onClick: handlers.onPlay, label: "Iniciar" },
				{ type: "reset", onClick: handlers.onReset, label: "Redefinir" },
			];
		}

		// Estado inicial (idle)
		return [{ type: "play", onClick: handlers.onPlay, label: "Iniciar" }];
	};

	const controls = getControls();
	const isVertical = orientation === "vertical";

	return (
		<div
			className={clsx(
				"flex",
				isVertical ? "flex-col" : "flex-row",
				"items-center",
				isVertical ? "gap-1.5" : "gap-3",
				className,
			)}
		>
			{controls.map((control: ControlItem) => (
				<div
					key={control.type}
					className={clsx(
						"flex",
						isVertical ? "flex-col" : "flex-row",
						"items-center",
						isVertical ? "gap-0.5" : "gap-1.5",
					)}
				>
					<ControlButton type={control.type} onClick={control.onClick} disabled={disabled} />

					{showLabels && (
						<span
							className={clsx(
								"text-xs font-normal leading-[18px]",
								disabled ? STOPWATCH_COLORS.text.disabled : STOPWATCH_COLORS.text.primary,
							)}
						>
							{control.label}
						</span>
					)}
				</div>
			))}
		</div>
	);
};

StopwatchControls.displayName = "Stopwatch.Controls";
