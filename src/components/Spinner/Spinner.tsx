import React, { useEffect, useState } from "react";
import { CircleDashedIcon } from "@phosphor-icons/react";
import type { SpinnerProps, SpinnerSize } from "./Spinner.interface";
import "./Spinner.inline.css";

const SIZE_PRESETS: Record<SpinnerSize, number> = {
	xs: 18,
	sm: 32,
	md: 52,
	lg: 84,
	xl: 120,
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
			className="inline-flex flex-col items-center gap-2 spinner-inline"
			data-variant={variant}
		>
			<CircleDashedIcon
				size={resolvedSize}
				weight="thin"
				className="animate-spin spinner-inline__icon"
				style={{ "--spinner-speed": `${speed}s` } as React.CSSProperties}
			/>
			<span className="text-[var(--ds-font-size-12)] font-[var(--ds-font-family-ui)] text-[var(--ds-color-neutral-10)]">
				{displayProgress}%
			</span>
		</output>
	);
};
