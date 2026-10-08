import React, { useMemo, useId } from "react";
import clsx from "clsx";
import type { ISkeletonProps } from "./Skeleton.interface";

export const Skeleton: React.FC<ISkeletonProps> = React.memo(
	({
		variant = "line",
		width,
		height,
		animation = "shimmer",
		lines = 1,
		gap = "0.5rem",
		className,
		style,
		ariaLabel = "Carregando...",
		...props
	}) => {
		// Gera ID único e estável para as keys (SSR-safe)
		const uniqueId = useId();
		const baseStyles = "bg-[var(--ds-color-neutral-40)]";

		// Animações
		const animationStyles = useMemo(() => {
			const animations = {
				shimmer:
					"relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[var(--ds-color-neutral-50)] before:to-transparent",
				pulse: "animate-pulse",
				none: "",
			};
			return animations[animation];
		}, [animation]);

		// Variantes
		const variantStyles = useMemo(() => {
			const variants = {
				line: "rounded-[12px] h-4",
				circle: "rounded-full aspect-square",
				rectangle: "rounded-[12px]",
			};
			return variants[variant];
		}, [variant]);

		// Estilos de dimensão
		const dimensionStyles = useMemo(() => {
			const styles: React.CSSProperties = { ...style };

			if (width !== undefined) {
				styles.width = typeof width === "number" ? `${width}px` : width;
			}

			if (height !== undefined) {
				styles.height = typeof height === "number" ? `${height}px` : height;
			}

			return styles;
		}, [width, height, style]);

		// Renderização de múltiplas linhas
		if (variant === "line" && lines > 1) {
			return (
				<output
					className={clsx("flex flex-col", className)}
					style={{ gap }}
					aria-live="polite"
					aria-label={ariaLabel}
					{...props}
				>
					{Array.from({ length: lines }).map((_, index) => {
						const isLastLine = index === lines - 1;
						const lineWidth = isLastLine && !width ? "80%" : width;

						let lineHeight: string | undefined;
						if (height !== undefined) {
							lineHeight = typeof height === "number" ? `${height}px` : height;
						}

						return (
							<div
								key={`${uniqueId}-skeleton-line-${index}`}
								className={clsx(baseStyles, animationStyles, variantStyles)}
								style={{
									width: typeof lineWidth === "number" ? `${lineWidth}px` : lineWidth,
									height: lineHeight,
								}}
								aria-hidden="true"
							/>
						);
					})}
				</output>
			);
		}

		// Renderização única
		return (
			<output
				className={clsx(baseStyles, animationStyles, variantStyles, className)}
				style={dimensionStyles}
				aria-live="polite"
				aria-label={ariaLabel}
				{...props}
			/>
		);
	},
);

Skeleton.displayName = "Skeleton";
