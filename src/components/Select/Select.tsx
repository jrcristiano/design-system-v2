import { CaretDownIcon } from "@phosphor-icons/react";
import { isValidElement, useId, type ReactNode } from "react";
import clsx from "clsx";
import type { InputSize } from "../Input/Input.type";
import type { SelectProps } from "./Select.interface";

const CONTROL_HEIGHTS: Record<InputSize, string> = {
	sm: "h-[var(--ds-control-height-sm)]",
	md: "h-[var(--ds-control-height-md)]",
	lg: "h-[var(--ds-control-height-lg)]",
};

const TEXT_SIZES: Record<InputSize, string> = {
	sm: "text-[length:var(--ds-body-4-size)]",
	md: "text-[length:var(--ds-body-3-size)]",
	lg: "text-[length:var(--ds-body-2-size)]",
};

const renderIcon = (
	icon: ReactNode,
	onClick: (() => void) | undefined,
	accessibleLabel: string | undefined,
	disabled: boolean,
	className: string,
) => {
	if (!icon) return null;

	// Preserve a supplied button's native behavior instead of nesting buttons.
	if (isValidElement(icon) && icon.type === "button") return icon;

	if (!onClick) {
		return (
			<span aria-hidden="true" className={className}>
				{icon}
			</span>
		);
	}

	return (
		<button
			type="button"
			aria-label={accessibleLabel ?? "Ação ao lado do seletor"}
			disabled={disabled}
			onMouseDown={(event) => event.preventDefault()}
			onClick={onClick}
			className={clsx("inline-flex shrink-0 items-center justify-center", className)}
		>
			{icon}
		</button>
	);
};

/** A native select with the same label, validation, and sizing conventions as Input. */
export function Select({
	label = "Label",
	message,
	required = false,
	iconLeft,
	iconRight,
	onIconLeftClick,
	onIconRightClick,
	iconLeftLabel,
	iconRightLabel,
	iconClassName,
	disabled = false,
	state = "default",
	size = "md",
	id,
	className,
	children,
	"aria-describedby": ariaDescribedBy,
	"aria-errormessage": ariaErrorMessage,
	"aria-invalid": ariaInvalid,
	"aria-required": ariaRequired,
	...props
}: Readonly<SelectProps>) {
	const generatedId = useId();
	const messageId = useId();
	const selectId = id ?? generatedId;
	const describedBy = [ariaDescribedBy, message ? messageId : undefined].filter(Boolean).join(" ");
	const invalid = ariaInvalid ?? (state === "error" ? true : undefined);
	const errorMessage = ariaErrorMessage ?? (state === "error" && message ? messageId : undefined);
	const hasIconRight = Boolean(iconRight || onIconRightClick);
	const resolvedRightIcon = iconRight ?? <CaretDownIcon size={16} weight="bold" />;

	const selectClasses = clsx(
		"h-full min-w-0 flex-1 appearance-none bg-transparent outline-none",
		"font-body text-[var(--ds-color-text-primary)]",
		"focus-visible:outline-none",
		"disabled:cursor-not-allowed disabled:text-[var(--ds-color-text-disabled)]",
		TEXT_SIZES[size],
		!iconLeft && "pl-[var(--ds-pad-input-x)]",
		!hasIconRight && "pr-[var(--ds-pad-input-x)]",
		className,
	);

	const wrapperClasses = clsx(
		"flex w-full items-center gap-2 rounded-full border bg-[var(--ds-color-surface)] transition-colors",
		CONTROL_HEIGHTS[size],
		disabled
			? "cursor-not-allowed border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-disabled)]"
			: state === "error"
				? "border-[var(--ds-color-error)] focus-within:ring-1 focus-within:ring-[var(--ds-color-error)]"
				: "border-[var(--ds-color-border)] hover:border-[var(--ds-color-text-secondary)] focus-within:border-[var(--ds-color-focus-ring)] focus-within:ring-1 focus-within:ring-[var(--ds-color-focus-ring)]",
	);

	const labelClassName = clsx(
		"flex items-center gap-1 font-ui text-[length:var(--ds-label-1-size)] font-[var(--ds-label-1-weight)]",
		disabled ? "text-[var(--ds-color-text-disabled)]" : "text-[var(--ds-color-text-primary)]",
	);

	return (
		<div className="flex w-full flex-col gap-[2px]">
			{label && (
				<label htmlFor={selectId} className={labelClassName}>
					{label}
					{required && (
						<span aria-hidden="true" className="text-[var(--ds-color-error)]">
							*
						</span>
					)}
				</label>
			)}

			<div className={wrapperClasses}>
				{iconLeft &&
					renderIcon(
						iconLeft,
						onIconLeftClick,
						iconLeftLabel,
						disabled,
						clsx("ml-[var(--ds-pad-input-x)] [&>svg]:size-4", iconClassName),
					)}
				<select
					{...props}
					id={selectId}
					required={required}
					aria-required={required ? true : ariaRequired}
					aria-invalid={invalid}
					aria-describedby={describedBy || undefined}
					aria-errormessage={errorMessage}
					disabled={disabled}
					className={selectClasses}
				>
					{children}
				</select>
				{renderIcon(
					resolvedRightIcon,
					onIconRightClick,
					iconRightLabel,
					disabled,
					clsx(
						"mr-[var(--ds-pad-input-x)] [&>svg]:size-4",
						iconClassName,
						!iconRight && "pointer-events-none",
					),
				)}
			</div>

			{message && (
				<p
					id={messageId}
					className={clsx(
						"text-[length:var(--ds-font-size-12)]",
						disabled
							? "text-[var(--ds-color-text-disabled)]"
							: state === "error"
								? "text-[var(--ds-color-error)]"
								: "text-[var(--ds-color-text-secondary)]",
					)}
				>
					{message}
				</p>
			)}
		</div>
	);
}
