import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
	title: string;
	description?: ReactNode;
	icon?: ReactNode;
	action?: ReactNode;
	size?: "sm" | "md";
}

/** A reusable message for empty search results, collections, and data views. */
export function EmptyState({
	title,
	description,
	icon,
	action,
	size = "md",
	className,
	role = "status",
	...props
}: Readonly<EmptyStateProps>) {
	return (
		<div
			role={role}
			className={clsx(
				"flex w-full min-w-0 flex-col items-center justify-center text-center font-body",
				size === "sm"
					? "gap-2 px-[var(--ds-pad-card)] py-[var(--ds-pad-section)]"
					: "gap-3 px-[var(--ds-pad-section)] py-[var(--ds-pad-app)]",
				className,
			)}
			{...props}
		>
			{icon && (
				<span aria-hidden="true" className="text-[var(--ds-color-text-secondary)]">
					{icon}
				</span>
			)}
			<p className="max-w-full text-[length:var(--ds-font-size-16)] font-[var(--ds-font-weight-semibold)] leading-[var(--ds-line-20)] break-words text-[var(--ds-color-text-primary)]">
				{title}
			</p>
			{description && (
				<div className="max-w-full text-[length:var(--ds-font-size-14)] leading-[var(--ds-line-20)] break-words text-[var(--ds-color-text-secondary)]">
					{description}
				</div>
			)}
			{action && <div className="flex max-w-full flex-wrap justify-center gap-2">{action}</div>}
		</div>
	);
}
