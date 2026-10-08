import React, { useEffect, useRef, useId } from "react";
import clsx from "clsx";
import type { ICheckboxProps } from "./Checkbox.interface";
import { useInteractionState } from "../../hooks/useInteractionState";
import "./Checkbox.inline.css";

export const Checkbox: React.FC<ICheckboxProps> = ({
	label,
	checked,
	defaultChecked = false,
	indeterminate = false,
	disabled = false,
	state = "default",
	className,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onLabelClick,
	fontLabelStyle = {},
	onChange,
	...props
}) => {
	const { isFocused, handlers } = useInteractionState({ disabled });
	const checkboxRef = useRef<HTMLInputElement>(null);
	const labelId = useId();
	const isControlled = checked !== undefined;
	const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
	const currentChecked = isControlled ? checked : internalChecked;
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!isControlled) setInternalChecked(event.target.checked);
		onChange?.(event);
	};

	useEffect(() => {
		if (checkboxRef.current) {
			checkboxRef.current.indeterminate = indeterminate;
		}
	}, [indeterminate]);

	const baseStyles = `
    rounded-[4px] border-[1px] transition-all duration-150
    appearance-none cursor-pointer relative flex items-center justify-center
    w-5 h-5
  `;

	const iconSizes = { width: 10, height: 8, strokeWidth: 1.5 };

	const stateStyles = {
		default: `
      ${
				currentChecked || indeterminate
					? "bg-[var(--ds-color-blue-40)] border-[var(--ds-color-blue-40)]"
					: "bg-transparent border-[var(--ds-color-neutral-50)]"
			}
    `,
		hover: `
      ${
				currentChecked || indeterminate
					? "bg-[var(--ds-color-blue-20)] border-[var(--ds-color-blue-20)]"
					: "bg-transparent border-[var(--ds-color-neutral-30)]"
			}
    `,
		pressed: `
      ${
				currentChecked || indeterminate
					? "bg-[var(--ds-color-blue-10)] border-[var(--ds-color-blue-10)]"
					: "bg-transparent border-[var(--ds-color-neutral-40)]"
			}
    `,
		focused: `
      ${
				currentChecked || indeterminate
					? "bg-[var(--ds-color-blue-30)] border-[var(--ds-color-blue-30)]"
					: "bg-transparent border-[var(--ds-color-neutral-50)]"
			}
    `,
		disabled: `
      ${
				currentChecked || indeterminate
					? "bg-[var(--ds-color-neutral-80)] border-[var(--ds-color-neutral-80)]"
					: "bg-transparent border-[var(--ds-color-neutral-80)]"
			}
      cursor-not-allowed
    `,
	};

	const labelStyles = `
    text-[var(--ds-font-size-16)] font-body font-normal leading-[15px]
    ${disabled ? "text-[var(--ds-color-neutral-80)] cursor-not-allowed" : "text-[var(--ds-color-neutral-10)]"}
  `;

	const getFinalState = (): string => {
		if (disabled) return "disabled";
		if (isFocused) return "focused";
		return state;
	};
	const finalState = getFinalState();

	return (
		<label
			htmlFor={labelId}
			className={clsx("inline-flex items-center cursor-pointer", className, {
				"cursor-not-allowed": disabled,
			})}
		>
			<div className="w-[44px] h-[44px] rounded-full inline-flex justify-center items-center group">
				<div
					className={clsx(
						"w-10 h-10 rounded-full relative inline-flex justify-center items-center transition-all duration-150",
						!disabled && "group-hover:bg-[var(--ds-color-neutral-90)]",
					)}
				>
					<div
						className={clsx(
							"rounded-[6px] inline-flex justify-center items-center transition-all duration-150 relative",
							isFocused && !disabled && "p-[2px] shadow-[0px_0px_0px_2px_var(--ds-color-blue-10)]",
						)}
					>
						<input
							ref={checkboxRef}
							id={labelId}
							type="checkbox"
							checked={currentChecked}
							disabled={disabled}
							onChange={handleChange}
							onFocus={handlers.onFocus}
							onBlur={handlers.onBlur}
							className={clsx(clsx(baseStyles, stateStyles[finalState]), "checkbox-inline-1")}

							{...props}
						/>

						{currentChecked && !indeterminate && (
							<svg
								className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
								width={iconSizes.width}
								height={iconSizes.height}
								viewBox="0 0 10 8"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M1.25 4L3.75 6.5L8.75 1.5"
									stroke="var(--ds-color-neutral-white)"
									strokeWidth={iconSizes.strokeWidth}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						)}

						{indeterminate && (
							<svg
								className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
								width={iconSizes.width}
								height="2"
								viewBox="0 0 10 2"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M1.25 1H8.75"
									stroke="var(--ds-color-neutral-white)"
									strokeWidth={iconSizes.strokeWidth}
									strokeLinecap="round"
								/>
							</svg>
						)}
					</div>
				</div>
			</div>

			{label && (
				<span style={fontLabelStyle} className={labelStyles}>
					{label}
				</span>
			)}
		</label>
	);
};
