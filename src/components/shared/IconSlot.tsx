import React, { type ReactNode, type KeyboardEvent, type HTMLAttributes } from "react";
import clsx from "clsx";

type DataAttributes = {
	[key: `data-${string}`]: string | undefined;
};

export type IconSlotProps = {
	children: ReactNode;
	className?: string;
	onClick?: () => void;
	onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
	as?: "button" | "span";
	role?: string;
	tabIndex?: number;
} & DataAttributes;

/**
 * IconSlot - A shared component for rendering icon containers.
 *
 * Renders a span when no onClick is provided (static icon display).
 * Renders a button by default when onClick is provided (interactive icon),
 * but can be forced to render as a span using the `as` prop.
 *
 * When interactive (onClick provided):
 * - Handles Enter and Space key presses to trigger onClick
 * - Uses type="button" to prevent form submission when rendered as a button
 *
 * Supports data-* attributes for event delegation patterns.
 */
export const IconSlot: React.FC<IconSlotProps> = ({
	children,
	className,
	onClick,
	onKeyDown,
	as,
	role,
	tabIndex,
	...rest
}) => {
	const dataAttributes = Object.fromEntries(
		Object.entries(rest).filter(([key]) => key.startsWith("data-")),
	) as Record<string, string | undefined>;

	const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onClick?.();
		}
		onKeyDown?.(event);
	};

	const Element = as || (onClick ? "button" : "span");

	const commonProps: HTMLAttributes<HTMLElement> & { role?: string; tabIndex?: number } = {
		className: clsx(
			"flex-shrink-0",
			onClick && "cursor-pointer p-0 bg-transparent inline-flex items-center justify-center",
			className,
		),
		onClick,
		onKeyDown: onClick ? handleKeyDown : onKeyDown,
		role,
		tabIndex,
		...dataAttributes,
	};

	if (Element === "button") {
		return (
			<button type="button" {...commonProps}>
				{children}
			</button>
		);
	}

	return <span {...commonProps}>{children}</span>;
};

IconSlot.displayName = "IconSlot";
