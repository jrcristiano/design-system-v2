import React, { useState, useCallback, useMemo } from "react";
import clsx from "clsx";
import { XIcon } from "@phosphor-icons/react";
import type { ITagProps, TagState } from "./Tag.interface";
import { useInteractionState } from "../../hooks/useInteractionState";
import { IconSlot } from "../shared/IconSlot";

const DISABLED_STATE = {
	border: "var(--semantic-outline-outline, #737D8C)",
	text: "var(--semantic-outline-outline, #737D8C)",
	bg: "var(--semantic-info-on-info, #FFF)",
} as const;

const WHITE_BG = "var(--ds-color-neutral-white, #FFF)";

const colorState = (color: string, bg: string = WHITE_BG) => ({
	border: color,
	text: color,
	bg,
});

interface VariantConfig {
	default: string;
	hover: string;
	pressed: string;
	selected: string;
	selectedBg: string;
	focusedBg: string;
	defaultBg?: string;
}

const createVariantStates = (config: VariantConfig) => {
	const bg = config.defaultBg || WHITE_BG;
	return {
		default: colorState(config.default, bg),
		hover: colorState(config.hover, bg),
		pressed: colorState(config.pressed, bg),
		selected: colorState(config.selected, config.selectedBg),
		focused: colorState(config.default, config.focusedBg),
		disabled: DISABLED_STATE,
	};
};

const variantColors = {
	success: createVariantStates({
		default: "var(--semantic-success-success, #338618)",
		hover: "var(--semantic-success-success-hover, #296C13)",
		pressed: "var(--semantic-success-success-pressed, #19410C)",
		selected: "var(--semantic-success-on-success-container, #296C13)",
		selectedBg: WHITE_BG,
		focusedBg: "var(--ds-color-green-90, #ddf7d4)",
	}),
	primary: createVariantStates({
		default: "var(--ds-color-blue-40, #004ECC)",
		hover: "var(--ds-color-blue-20, #002766)",
		pressed: "var(--ds-color-blue-10, #001E4D)",
		selected: "var(--ds-color-blue-30, #003B99)",
		selectedBg: "var(--ds-color-blue-90, #cce0ff)",
		focusedBg: "var(--ds-color-blue-90, #cce0ff)",
	}),
	info: createVariantStates({
		default: "var(--semantic-info-info, #017DA2)",
		hover: "var(--semantic-info-info-hover, #014E65)",
		pressed: "var(--semantic-info-info-pressed, #013A4C)",
		selected: "var(--semantic-info-on-info-container, #014E65)",
		selectedBg: "var(--semantic-info-info-container, #CCF3FF)",
		focusedBg: "var(--ds-color-sky-90, #CCF3FF)",
		defaultBg: "var(--semantic-info-on-info, #FFF)",
	}),
	warning: createVariantStates({
		default: "var(--semantic-warning-warning, #B36205)",
		hover: "var(--semantic-warning-warning-hover, #633603)",
		pressed: "var(--semantic-warning-warning-pressed, #4A2902)",
		selected: "var(--semantic-warning-on-warning-container, #955104)",
		selectedBg: "var(--semantic-highlight-yellow-highlight-yellow-container, #FFF5CC)",
		focusedBg: "var(--ds-color-yellow-90, #FFF)",
		defaultBg: "var(--semantic-warning-on-warning, #FFF)",
	}),
	danger: createVariantStates({
		default: "var(--semantic-error-error, #C1290B)",
		hover: "var(--semantic-error-error-hover, #611405)",
		pressed: "var(--semantic-error-error-pressed, #480F05)",
		selected: "var(--semantic-error-on-error-container, #911F08)",
		selectedBg: "var(--semantic-error-error-container, #FCD6CF)",
		focusedBg: "var(--ds-color-red-90, #FFF)",
	}),
	inactive: {
		default: colorState("var(--semantic-outline-outline, #737D8C)"),
		hover: colorState("var(--semantic-outline-outline, #737D8C)"),
		pressed: colorState("var(--semantic-outline-outline, #737D8C)"),
		selected: colorState(
			"var(--semantic-outline-outline, #737D8C)",
			"var(--semantic-secondary-secondary-container, #E3E5E8)",
		),
		focused: colorState("var(--semantic-outline-outline, #737D8C)"),
		disabled: DISABLED_STATE,
	},
};

const resolveCurrentState = (
	state: TagState,
	disabled: boolean,
	isFocused: boolean,
	isPressed: boolean,
	isHovered: boolean,
): TagState => {
	if (state !== "default") return state;
	if (disabled) return "disabled";
	if (isFocused) return "focused";
	if (isPressed) return "pressed";
	if (isHovered) return "hover";
	return "default";
};

const buildTagStyles = (
	variant: ITagProps["variant"],
	currentState: TagState,
	disabled: boolean,
	pill: boolean,
	circle: boolean,
	size: "sm" | "md",
	hoverBorderOnly: boolean,
) => {
	const effectiveState = disabled ? "disabled" : currentState;
	const currentVariant = variantColors[variant || "primary"];
	const colors = currentVariant?.[effectiveState] || currentVariant.default;
	const showBorder = !hoverBorderOnly || effectiveState === "hover" || effectiveState === "pressed";

	const baseStyles = {
		border: `1px solid ${showBorder ? colors.border : "transparent"}`,
		borderRadius: pill || circle ? "var(--ds-radius-full, 9999px)" : "var(--ds-radius-md, 8px)",
		backgroundColor: colors.bg,
		color: colors.text,
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		gap: circle ? "0" : "var(--ds-pad-chip-y, 4px)",
		cursor: disabled ? "not-allowed" : "pointer",
	};

	const sizeStyles = {
		sm: {
			height: "28px",
			width: circle ? "28px" : "auto",
			minWidth: circle ? "28px" : "auto",
			padding: circle ? "0" : "var(--ds-pad-chip-y, 4px) var(--ds-pad-chip-x, 8px)",
			fontSize: "var(--ds-font-size-12, 12px)",
			fontFamily: "var(--ds-font-family-ui, var(--ds-font-family-poppins, Poppins))",
			fontStyle: "normal",
			fontWeight: "var(--ds-label-1-weight, var(--ds-font-weight-medium, 500))",
			textAlign: "center" as const,
		},
		md: {
			height: "34px",
			width: circle ? "34px" : "auto",
			minWidth: circle ? "34px" : "auto",
			padding: circle ? "0" : "var(--ds-pad-chip-y, 4px) var(--ds-pad-chip-x, 8px)",
			fontSize: "var(--ds-font-size-14, 14px)",
			fontFamily: "var(--ds-font-family-ui, var(--ds-font-family-poppins, Poppins))",
			fontStyle: "normal",
			fontWeight: "var(--ds-label-1-weight, var(--ds-font-weight-medium, 500))",
			lineHeight: "var(--ds-label-1-line, 20px)",
			letterSpacing: "var(--font-letter-spacing-default, 0)",
			textAlign: "center" as const,
		},
	};

	return { ...baseStyles, ...sizeStyles[size] };
};

export const Tag: React.FC<ITagProps> = React.memo(
	({
		variant = "primary",
		state = "default",
		pill = false,
		circle = false,
		iconLeft: IconLeft,
		iconRight: IconRight,
		onIconLeftClick,
		onIconRightClick,
		count,
		disabled = false,
		closable = false,
		onClose,
		children,
		size = "md",
		iconWeight = "light",
		hoverBorderOnly = false,
	}) => {
		const [isClosed, setIsClosed] = useState(false);
		const { isFocused, isHovered, isPressed, handlers } = useInteractionState({ disabled });

		const currentState = useMemo(
			() => resolveCurrentState(state, disabled, isFocused, isPressed, isHovered),
			[state, disabled, isFocused, isPressed, isHovered],
		);

		const handleClose = useCallback(
			(e: React.SyntheticEvent) => {
				e.stopPropagation();
				setIsClosed(true);
				onClose?.();
			},
			[onClose],
		);

		const handleIconLeftClick = useCallback(() => {
			if (!disabled) {
				onIconLeftClick?.();
			}
		}, [disabled, onIconLeftClick]);

		const handleIconRightClick = useCallback(
			(e: React.SyntheticEvent) => {
				if (disabled) return;
				onIconRightClick?.();
				if (closable) {
					handleClose(e);
				}
			},
			[disabled, onIconRightClick, closable, handleClose],
		);

		const handleButtonClick = useCallback(
			(event: React.MouseEvent<HTMLButtonElement>) => {
				if (disabled) return;

				const target = event.target as HTMLElement;
				const iconTarget = target.closest("[data-tag-icon]");

				if (!iconTarget || !(iconTarget instanceof HTMLElement)) return;

				if (iconTarget.dataset.tagIcon === "left") {
					handleIconLeftClick();
				} else if (iconTarget.dataset.tagIcon === "right") {
					handleIconRightClick(event);
				}
			},
			[disabled, handleIconLeftClick, handleIconRightClick],
		);

		const styles = useMemo(
			() => buildTagStyles(variant, currentState, disabled, pill, circle, size, hoverBorderOnly),
			[variant, currentState, disabled, pill, circle, size, hoverBorderOnly],
		);

		if (isClosed) return null;

		const shouldShowText = !circle && children;
		const RightIconComponent = closable ? XIcon : IconRight;

		return (
			<button
				type="button"
				style={styles}
				onMouseEnter={handlers.onMouseEnter}
				onMouseLeave={handlers.onMouseLeave}
				onMouseDown={handlers.onMouseDown}
				onMouseUp={handlers.onMouseUp}
				onFocus={handlers.onFocus}
				onBlur={handlers.onBlur}
				onClick={handleButtonClick}
				disabled={disabled}
			>
				{IconLeft && (
					<IconSlot data-tag-icon="left">
						<IconLeft weight={iconWeight} size={16} />
					</IconSlot>
				)}

				{count !== null && count !== undefined && !circle && <span>{count}</span>}

				{shouldShowText && <span>{children}</span>}

				{RightIconComponent && !circle && (
					<IconSlot
						className={clsx((closable || onIconRightClick) && !disabled && "cursor-pointer")}
						data-tag-icon="right"
					>
						<RightIconComponent weight={iconWeight} size={16} />
					</IconSlot>
				)}
			</button>
		);
	},
);

Tag.displayName = "Tag";
