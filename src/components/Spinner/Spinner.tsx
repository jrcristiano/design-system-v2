import React, { useEffect, useState } from "react";
import { CircleDashedIcon } from "@phosphor-icons/react";
import type { SpinnerProps, SpinnerSize, SpinnerVariant } from "./Spinner.interface";

const SIZE_PRESETS: Record<SpinnerSize, number> = {
	xs: 18,
	sm: 32,
	md: 52,
	lg: 84,
	xl: 120,
};

const COLOR_VARIANTS: Record<SpinnerVariant, string> = {
	primary: "var(--ds-color-blue-40)",
	neutral: "var(--ds-color-neutral-40)",
	success: "var(--ds-color-green-30)",
	warning: "var(--ds-color-orange-50)",
	danger: "var(--ds-color-red-40)",
};

export const Spinner: React.FC<SpinnerProps> = ({
	size = "md",
	variant = "primary",
	speed = 1.5,
	ariaLabel = "Carregando...",
	progress,
}) => {
	const [animatedProgress, setAnimatedProgress] = useState(0);
	const resolvedSize = typeof size === "number" ? size : SIZE_PRESETS[size];
	const shouldAnimateProgress = progress === undefined;
	const clampedProgress = Math.max(0, Math.min(100, Math.round(progress ?? 0)));
	const displayProgress = shouldAnimateProgress ? animatedProgress : clampedProgress;

	useEffect(() => {
		if (!shouldAnimateProgress) return;

		const step = 25;
		const intervalMs = 3000 / (100 / step);
		setAnimatedProgress(0);

		const intervalId = globalThis.setInterval(() => {
			setAnimatedProgress((current) => {
				const nextValue = current + step;
				if (nextValue >= 100) {
					globalThis.clearInterval(intervalId);
					return 100;
				}
				return nextValue;
			});
		}, intervalMs);

		return () => globalThis.clearInterval(intervalId);
	}, [shouldAnimateProgress]);

	return (
		<output
			aria-busy="true"
			aria-label={ariaLabel}
			className="inline-flex flex-col items-center gap-2"
			style={{ opacity: 1, color: COLOR_VARIANTS[variant] }}
		>
			<CircleDashedIcon
				size={resolvedSize}
				weight="thin"
				className="animate-spin"
				style={{ animationDuration: `${speed}s`, opacity: 1 }}
			/>
			<span className="text-[var(--ds-font-size-12)] font-[var(--ds-font-family-ui)] text-[var(--ds-color-neutral-10)]">
				{displayProgress}%
			</span>
		</output>
	);
};
