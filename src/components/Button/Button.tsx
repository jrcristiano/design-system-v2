import React, { useState, useCallback } from "react";
import clsx from "clsx";
import type { FabPosition, IButtonProps } from "./Button.interface";
import { CircleNotchIcon } from "@phosphor-icons/react";
import type { Size, State, Variant } from "../../types/Commons.type";
import { IconSlot } from "../shared/IconSlot";

// --- Constantes de Estilo ---
const STATE_STYLES: Record<Variant, Record<State, string>> = {
	primary: {
		default:
			"bg-[var(--ds-color-blue-40)] text-[var(--ds-color-neutral-white)] hover:bg-[var(--ds-color-blue-20)] active:bg-[var(--ds-color-blue-10)]",
		hover: "bg-[var(--ds-color-blue-20)] text-[var(--ds-color-neutral-white)]",
		pressed: "bg-[var(--ds-color-blue-10)] text-[var(--ds-color-neutral-white)]",
		focused:
			"bg-[var(--ds-color-blue-40)] text-[var(--ds-color-neutral-white)] ring-2 ring-offset-2 ring-[var(--ds-color-blue-10)] ring-offset-[var(--ds-bg-secondary)]",
		disabled:
			"bg-[var(--ds-color-neutral-80)] text-[var(--ds-color-neutral-40)] cursor-not-allowed",
	},
	secondary: {
		default:
			"bg-[var(--ds-color-neutral-10)] text-[var(--ds-color-neutral-white)] hover:bg-[var(--ds-color-neutral-30)] active:bg-[var(--ds-color-neutral-40)]",
		hover: "bg-[var(--ds-color-neutral-30)] text-[var(--ds-color-neutral-white)]",
		pressed: "bg-[var(--ds-color-neutral-50)] text-[var(--ds-color-neutral-white)]",
		focused:
			"bg-[var(--ds-color-neutral-10)] text-[var(--ds-color-neutral-white)] ring-2 ring-offset-2 ring-[var(--ds-color-neutral-40)] ring-offset-[var(--ds-bg-secondary)]",
		disabled:
			"bg-[var(--ds-color-neutral-80)] text-[var(--ds-color-neutral-40)] cursor-not-allowed",
	},
	text: {
		default:
			"text-[var(--ds-color-neutral-10)] hover:text-[var(--ds-color-neutral-30)] focus:text-[var(--ds-color-neutral-40)]",
		hover: "text-[var(--ds-color-neutral-30)]",
		pressed: "text-[var(--ds-color-neutral-40)]",
		focused:
			"ring-2 ring-offset-2 ring-[var(--ds-color-blue-10)] ring-offset-[var(--ds-bg-secondary)]",
		disabled: "text-[var(--ds-color-neutral-40)] cursor-not-allowed",
	},
	error: {
		default:
			"bg-[var(--ds-color-red-50)] text-white hover:bg-[var(--ds-color-red-20)] active:bg-[var(--ds-color-red-10)]",
		hover: "bg-[var(--ds-color-red-20)] text-white",
		pressed: "bg-[var(--ds-color-red-10)] text-white",
		focused:
			"bg-[var(--ds-color-red-50)] text-[var(--ds-color-neutral-white)] ring-2 ring-offset-2 ring-[var(--ds-color-red-10)] ring-offset-[var(--ds-bg-secondary)]",
		disabled:
			"bg-[var(--ds-color-neutral-80)] text-[var(--ds-color-neutral-40)] cursor-not-allowed",
	},
	outline: {
		default:
			"ring-2 bg-[var(--ds-color-neutral-white)] ring-[var(--ds-color-neutral-50)] text-[var(--ds-color-neutral-10)] hover:bg-[var(--ds-color-neutral-90)] hover:ring-[var(--ds-color-neutral-30)] active:ring-[var(--ds-color-blue-10)]",
		hover: "ring-2 bg-[var(--ds-color-neutral-90)] text-[var(--ds-color-neutral-30)]",
		pressed:
			"ring-2 ring-[var(--ds-color-neutral-50)] text-[var(--ds-color-neutral-40)] bg-[var(--ds-color-neutral-90)]",
		focused:
			"relative ring-2 ring-[var(--ds-color-blue-10)] bg-[var(--ds-color-neutral-90)] text-[var(--ds-color-neutral-10)] after:content-[''] after:absolute after:inset-[2px] after:rounded-[26px] after:border-[2px] after:border-[var(--ds-color-neutral-50)] focus:outline-none transition-all duration-150 ease-in-out",
		disabled:
			"bg-[var(--ds-color-neutral-white)] ring-2 ring-offset-2 ring-[var(--ds-color-neutral-80)] text-[var(--ds-color-neutral-80)] ring-offset-[var(--ds-bg-secondary)] cursor-not-allowed",
	},
};

const ICON_DIMENSIONS: Record<Size, number> = { sm: 14, md: 16, lg: 18 };

const FLOATING_POSITIONS: Record<FabPosition, string> = {
	"bottom-right": "!fixed bottom-6 right-6",
	"bottom-left": "!fixed bottom-6 left-6",
	"bottom-center": "!fixed bottom-6 left-1/2 -translate-x-1/2",
	"top-right": "!fixed top-6 right-6",
	relative: "relative",
	contextual: "",
};

const getResponsiveSizeClasses = (size: Size, isCircle: boolean): string => {
	const sizeMap: Record<Size, string> = {
		sm: isCircle
			? "h-[var(--ds-control-height-sm)] w-[var(--ds-control-height-sm)] text-xs sm:text-sm"
			: "h-[var(--ds-control-height-sm)] px-2 sm:px-3 text-xs sm:text-sm gap-1",
		md: isCircle
			? "h-[var(--ds-control-height-md)] w-[var(--ds-control-height-md)] text-sm sm:text-base"
			: "h-[var(--ds-control-height-md)] px-3 sm:px-4 text-sm sm:text-base gap-1 sm:gap-2",
		lg: isCircle
			? "h-[var(--ds-control-height-lg)] w-[var(--ds-control-height-lg)] text-base sm:text-lg"
			: "h-[var(--ds-control-height-lg)] px-4 sm:px-5 text-base sm:text-lg gap-2 sm:gap-3",
	};

	const base = sizeMap[size];

	if (!isCircle) {
		if (size === "md") return clsx(base, "px-2 sm:px-4");
		if (size === "lg") return clsx(base, "px-3 sm:px-5");
	}

	return base;
};

export const Button: React.FC<IButtonProps> = React.memo(
	({
		variant = "primary",
		size = "md",
		state = "default",
		iconLeft: IconLeft,
		iconRight: IconRight,
		onIconLeftClick,
		onIconRightClick,
		children,
		isLoading = false,
		disabled = false,
		circle,
		floatingOn,
		className,
		iconWeight = "regular",
		gapBetweenTextAndIcon = false,
		"aria-label": ariaLabel,
		...props
	}) => {
		const [isFocused, setIsFocused] = useState(false);

		const isFloating = Boolean(floatingOn);
		const isCircle = circle ?? isFloating;
		const iconDimensions = ICON_DIMENSIONS[size];
		const floatingPositionClass = floatingOn ? FLOATING_POSITIONS[floatingOn] : "";

		const finalClasses = clsx(
			"cursor-pointer inline-flex items-center justify-center text-body-3 transition-all duration-150 focus:outline-none min-w-0",
			getResponsiveSizeClasses(size, isCircle),
			isCircle ? "rounded-full" : "rounded-[26px]",
			disabled ? STATE_STYLES[variant].disabled : STATE_STYLES[variant][state],
			isFocused && !disabled && !isLoading && STATE_STYLES[variant].focused,
			isLoading && "cursor-wait",
			!isCircle && "whitespace-nowrap overflow-hidden text-ellipsis",
			isFloating && "z-[var(--ds-z-fixed)] shadow-[var(--ds-shadow-effect-4)]",
			floatingPositionClass,
			className,
		);

		const handleFocus = useCallback(() => {
			if (!disabled && !isLoading) setIsFocused(true);
		}, [disabled, isLoading]);

		const handleBlur = useCallback(() => {
			if (!disabled && !isLoading) setIsFocused(false);
		}, [disabled, isLoading]);

		// CORREÇÃO: O evento 'e' é opcional para satisfazer a interface do IconSlot,
		// mas usamos propagation se ele existir.
		const createIconHandler = (handler?: () => void) => (e?: React.MouseEvent<HTMLElement>) => {
			if (!disabled && !isLoading && handler) {
				// Optional chaining garante segurança se IconSlot não passar o evento
				e?.stopPropagation();
				handler();
			}
		};

		const shouldRenderGap = !isLoading && gapBetweenTextAndIcon && !isCircle;

		const renderIcon = (
			IconComponent: typeof IconLeft,
			onClickHandler?: () => void,
			extraClass = "",
		) => {
			if (!IconComponent) return null;

			const content = (
				<IconComponent size={iconDimensions} weight={iconWeight} className="shrink-0" />
			);

			if (onClickHandler) {
				return (
					<IconSlot
						as="span"
						onClick={createIconHandler(onClickHandler)}
						className={clsx("cursor-pointer", extraClass)}
					>
						{content}
					</IconSlot>
				);
			}

			return (
				<IconSlot as="span" className={extraClass}>
					{content}
				</IconSlot>
			);
		};

		const content = (() => {
			if (shouldRenderGap) {
				if (IconLeft) {
					return (
						<div className="grid w-full grid-cols-[auto,1fr,auto] items-center">
							{renderIcon(IconLeft, onIconLeftClick)}
							<span className="truncate max-w-full justify-self-center text-center px-1">
								{children}
							</span>
							{IconRight ? renderIcon(IconRight, onIconRightClick) : <span className="w-[1px]" />}
						</div>
					);
				}
				return (
					<div className="flex w-full items-center justify-between">
						<span className="truncate max-w-full text-left">{children}</span>
						{renderIcon(IconRight, onIconRightClick)}
					</div>
				);
			}

			return (
				<>
					{!isLoading && renderIcon(IconLeft, onIconLeftClick)}
					{!isCircle && <span className="truncate max-w-full">{children}</span>}
					{!isLoading && renderIcon(IconRight, onIconRightClick)}
				</>
			);
		})();

		return (
			<button
				type={props.type || "button"}
				onFocus={handleFocus}
				onBlur={handleBlur}
				className={finalClasses}
				disabled={disabled || isLoading}
				aria-busy={isLoading}
				aria-label={isCircle && !ariaLabel && typeof children === "string" ? children : ariaLabel}
				{...props}
			>
				{isLoading && (
					<CircleNotchIcon
						className="animate-spin text-current"
						size={iconDimensions}
						weight="bold"
						aria-hidden="true"
					/>
				)}
				{content}
			</button>
		);
	},
);

Button.displayName = "Button";
