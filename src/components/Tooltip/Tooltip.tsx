import React, { memo, useMemo, forwardRef, useRef } from "react";
import Tippy from "@tippyjs/react";
import type { Placement } from "tippy.js";
import clsx from "clsx";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
import styles from "./Tooltip.module.css";
import type { TooltipProps } from "./Tooltip.interface";

const TooltipWrapper = forwardRef<HTMLSpanElement, { children: React.ReactNode }>(
	({ children }, ref) => (
		<span ref={ref} style={{ display: "inline" }}>
			{children}
		</span>
	),
);
TooltipWrapper.displayName = "TooltipWrapper";

export const Tooltip: React.FC<TooltipProps> = memo(
	({
		title,
		content,
		children,
		delay = 100,
		placement = "default",
		disabled = false,
		trigger = "mouseenter focus",
		className,
		theme = "ds",
		animation = "shift-away",
		...props
	}) => {
		const tooltipClassName = useMemo(() => clsx(styles.tooltip, className), [className]);

		const tooltipContent = useMemo(
			() => (
				<div className={tooltipClassName}>
					{title && <span className={styles.title}>{title}</span>}
					<span className={styles.content}>{content}</span>
				</div>
			),
			[tooltipClassName, title, content],
		);

		const isDefault = useMemo(() => placement === "default", [placement]);

		const finalPlacement = useMemo<Placement>(
			() => (isDefault ? "top" : (placement as Placement)),
			[isDefault, placement],
		);

		const showArrow = useMemo(() => !isDefault, [isDefault]);

		// Provide a real ref to the child element when possible so Tippy can use it
		const targetRef = useRef<HTMLElement | null>(null);

		const childrenWithRef = React.useMemo(() => {
			if (!React.isValidElement(children)) return children;

			// If child is a DOM element (type is string), clone and inject ref
			if (typeof children.type === "string") {
				return React.cloneElement(
					children as React.ReactElement<React.RefAttributes<HTMLElement>>,
					{ ref: targetRef },
				);
			}

			// Otherwise, wrap in TooltipWrapper which forwards the ref
			return <TooltipWrapper ref={targetRef}>{children}</TooltipWrapper>;
		}, [children]);

		return (
			<Tippy
				content={tooltipContent}
				delay={delay}
				placement={finalPlacement}
				disabled={disabled}
				trigger={trigger}
				animation={animation}
				theme={theme}
				arrow={showArrow}
				{...props}
			>
				{childrenWithRef}
			</Tippy>
		);
	},
);
