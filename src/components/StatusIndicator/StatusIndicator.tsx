import type { HTMLAttributes } from "react";
import clsx from "clsx";

export type StatusIndicatorStatus = "success" | "warning" | "error" | "info" | "neutral";

export interface StatusIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
	status: StatusIndicatorStatus;
	label: string;
	showLabel?: boolean;
	size?: "sm" | "md";
}

const STATUS_COLORS: Record<StatusIndicatorStatus, string> = {
	success: "bg-[var(--ds-color-success)]",
	warning: "bg-[var(--ds-color-warning)]",
	error: "bg-[var(--ds-color-error)]",
	info: "bg-[var(--ds-color-info)]",
	neutral: "bg-[var(--ds-color-text-secondary)]",
};

/** A status dot with a visible or accessible text label. */
export function StatusIndicator({
	status,
	label,
	showLabel = true,
	size = "md",
	className,
	role,
	"aria-label": ariaLabel,
	...props
}: Readonly<StatusIndicatorProps>) {
	return (
		<span
			role={role ?? (showLabel ? undefined : "img")}
			aria-label={showLabel ? ariaLabel : (ariaLabel ?? label)}
			data-status={status}
			className={clsx(
				"inline-flex max-w-full min-w-0 items-center gap-2 font-ui text-[var(--ds-color-text-primary)]",
				size === "sm"
					? "text-[length:var(--ds-font-size-12)]"
					: "text-[length:var(--ds-font-size-14)]",
				className,
			)}
			{...props}
		>
			<span
				aria-hidden="true"
				className={clsx(
					"inline-block shrink-0 rounded-full",
					size === "sm" ? "size-2" : "size-3",
					STATUS_COLORS[status],
				)}
			/>
			{showLabel && <span className="min-w-0 break-words">{label}</span>}
		</span>
	);
}
