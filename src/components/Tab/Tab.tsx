import React, { useMemo, useCallback } from "react";
import clsx from "clsx";
import type { ITabProps } from "./Tab.interface";
import type { TabType, TabState } from "./Tab.type";
import { useInteractionState } from "../../hooks/useInteractionState";
import { IconSlot } from "../shared/IconSlot";

const BASE_STYLES: Record<TabType, string> = {
	simple: "px-2 py-[6px] overflow-hidden",
	"horizontal-indicator": "px-2 pt-3 pb-1 overflow-hidden flex-col gap-1",
	"vertical-indicator": "pl-[19px] pr-4 min-h-[44px] overflow-hidden rounded-tr-3xl rounded-br-3xl",
	contained: "px-4 py-3 h-10 overflow-hidden rounded-3xl",
};

const STATE_STYLES: Record<TabType, Record<TabState, string>> = {
	simple: {
		default: "text-[var(--ds-color-neutral-10)]",
		hover: "text-[var(--ds-color-neutral-10)]",
		pressed: "text-[var(--ds-color-neutral-10)]",
		selected: "text-[var(--ds-color-neutral-10)]",
		disabled: "text-[var(--ds-color-neutral-40)] cursor-not-allowed",
	},
	"horizontal-indicator": {
		default:
			"text-[var(--ds-color-neutral-10)] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-[var(--ds-color-neutral-50)] after:rounded-t-lg after:backface-hidden",
		hover:
			"text-[var(--ds-color-neutral-10)] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-[var(--ds-color-neutral-50)] after:rounded-t-lg after:backface-hidden",
		pressed:
			"text-[var(--ds-color-neutral-10)] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-[var(--ds-color-blue-10)] after:rounded-t-lg after:backface-hidden",
		selected:
			"text-[var(--ds-color-neutral-10)] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-[var(--ds-color-blue-40)] after:rounded-t-lg after:backface-hidden",
		disabled:
			"text-[var(--ds-color-neutral-40)] cursor-not-allowed relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-[var(--ds-color-neutral-80)] after:rounded-t-lg after:backface-hidden",
	},
	"vertical-indicator": {
		default:
			"text-[var(--ds-color-neutral-10)] relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[9px] before:bg-[var(--ds-color-neutral-50)] before:rounded-tr-lg before:rounded-br-lg before:backface-hidden",
		hover:
			"text-[var(--ds-color-neutral-10)] relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[9px] before:bg-[var(--ds-color-neutral-50)] before:rounded-tr-lg before:rounded-br-lg before:backface-hidden",
		pressed:
			"text-[var(--ds-color-neutral-10)] relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[9px] before:bg-[var(--ds-color-blue-10)] before:rounded-tr-lg before:rounded-br-lg before:backface-hidden",
		selected:
			"text-[var(--ds-color-neutral-10)] relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[9px] before:bg-[var(--ds-color-blue-40)] before:rounded-tr-lg before:rounded-br-lg before:backface-hidden",
		disabled:
			"text-[var(--ds-color-neutral-40)] cursor-not-allowed relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[9px] before:bg-[var(--ds-color-neutral-80)] before:rounded-tr-lg before:rounded-br-lg before:backface-hidden",
	},
	contained: {
		default: "bg-[var(--ds-color-blue-40)] text-[var(--ds-color-neutral-white)]",
		hover: "bg-[var(--ds-color-blue-20)] text-[var(--ds-color-neutral-white)]",
		pressed: "bg-[var(--ds-color-blue-10)] text-[var(--ds-color-neutral-white)]",
		selected: "bg-[var(--ds-color-blue-30)] text-[var(--ds-color-neutral-white)]",
		disabled:
			"bg-[var(--ds-color-neutral-40)] text-[var(--ds-color-neutral-80)] cursor-not-allowed",
	},
};

export const Tab: React.FC<ITabProps> = React.memo(
	({
		type = "simple",
		state = "default",
		iconLeft: IconLeft,
		iconRight: IconRight,
		onIconLeftClick,
		onIconRightClick,
		iconWeight = "regular",
		label,
		selected = false,
		disabled = false,
		onSelect,
		className,
		...props
	}) => {
		const { isHovered, isPressed, handlers } = useInteractionState({ disabled, selected });

		const currentState = useMemo((): TabState => {
			if (disabled) return "disabled";
			if (selected) return "selected";
			if (isPressed) return "pressed";
			if (isHovered) return "hover";
			return state;
		}, [disabled, selected, isPressed, isHovered, state]);

		const isHorizontalIndicator = type === "horizontal-indicator";

		const finalClasses = clsx(
			"cursor-pointer inline-flex items-center justify-center transition-all duration-150 focus:outline-none",
			BASE_STYLES[type],
			STATE_STYLES[type][currentState],
			isHorizontalIndicator && "flex-col",
			className,
		);

		const contentClasses = clsx(
			"flex items-center justify-center gap-4",
			isHorizontalIndicator && "flex-row",
		);

		const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
			if (!disabled) {
				onSelect?.();
				props.onClick?.(e);
			}
		};

		const handleIconLeftClick = useCallback(() => {
			if (!disabled) {
				onIconLeftClick?.();
			}
		}, [disabled, onIconLeftClick]);

		const handleIconRightClick = useCallback(() => {
			if (!disabled) {
				onIconRightClick?.();
			}
		}, [disabled, onIconRightClick]);

		const interactionHandlers = disabled
			? {}
			: {
					onMouseEnter: handlers.onMouseEnter,
					onMouseLeave: handlers.onMouseLeave,
					onMouseDown: handlers.onMouseDown,
					onMouseUp: handlers.onMouseUp,
				};

		return (
			<button
				{...props}
				className={finalClasses}
				disabled={disabled}
				onClick={handleClick}
				{...interactionHandlers}
				aria-selected={selected}
				role="tab"
			>
				<div className={contentClasses}>
					{IconLeft && (
						<IconSlot onClick={onIconLeftClick ? handleIconLeftClick : undefined} as="span">
							<IconLeft size={16} weight={iconWeight} className="flex-shrink-0" />
						</IconSlot>
					)}
					<span className="truncate max-w-full text-[var(--ds-font-size-16)] font-poppins font-normal leading-[20px] break-words">
						{label}
					</span>
					{IconRight && (
						<IconSlot onClick={onIconRightClick ? handleIconRightClick : undefined} as="span">
							<IconRight size={16} weight={iconWeight} className="flex-shrink-0" />
						</IconSlot>
					)}
				</div>
			</button>
		);
	},
);

Tab.displayName = "Tab";
