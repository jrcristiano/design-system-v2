import React, { useState } from "react";
import clsx from "clsx";
import type {
	InputDigitalTimeProps,
	DigitalTimeUnit,
	DigitalTimeUnitProps,
} from "./InputDigitalTime.interface";

const LABELS: Record<DigitalTimeUnit, string> = {
	hours: "Hora",
	minutes: "Minuto",
	seconds: "Segundo",
};

const MAX_VALUES: Record<DigitalTimeUnit, number> = {
	hours: 23,
	minutes: 59,
	seconds: 59,
};

const padZero = (num: number): string => String(num).padStart(2, "0");

const DigitalTimeUnitComponent: React.FC<DigitalTimeUnitProps> = ({
	type,
	value,
	onChange,
	disabled = false,
}) => {
	const [isFocused, setIsFocused] = React.useState(false);
	const [inputValue, setInputValue] = React.useState(padZero(value));

	React.useEffect(() => {
		if (!isFocused) {
			setInputValue(padZero(value));
		}
	}, [value, isFocused]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value.replaceAll(/\D/g, "");
		setInputValue(newValue);
	};

	const handleFocus = () => {
		setIsFocused(true);
		setTimeout(() => {
			const input = document.activeElement as HTMLInputElement;
			if (input) {
				input.select();
			}
		}, 0);
	};

	const handleBlur = () => {
		setIsFocused(false);
		const numValue = Number.parseInt(inputValue, 10);
		const finalValue = Number.isNaN(numValue) ? 0 : Math.min(numValue, MAX_VALUES[type]);
		onChange(finalValue);
		setInputValue(padZero(finalValue));
	};

	return (
		<div className="flex flex-col items-center gap-2">
			<div
				className={clsx(
					"inline-flex items-center justify-center rounded-xl p-3",
					"outline outline-1 outline-offset-[-1px]",
					{
						"bg-[var(--ds-color-surface)] outline-[var(--ds-color-neutral-50)]": !disabled,
						"bg-[var(--ds-color-neutral-80)] outline-[var(--ds-color-neutral-80)] cursor-not-allowed":
							disabled,
					},
				)}
			>
				<input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					disabled={disabled}
					className={clsx(
						"w-12 bg-transparent text-center font-poppins text-base font-medium leading-6",
						"border-0 outline-none focus:ring-0",
						{
							"text-[var(--ds-color-neutral-10)]": !disabled,
							"text-[var(--ds-color-neutral-40)] cursor-not-allowed": disabled,
						},
					)}
					maxLength={2}
					aria-label={LABELS[type]}
				/>
			</div>
		</div>
	);
};

export const InputDigitalTime: React.FC<InputDigitalTimeProps> = ({
	label,
	hint,
	timeUnitLabel,
	timeUnitIcon,
	unit,
	value,
	defaultValue = 0,
	onChange,
	disabled = false,
	required = false,
	className,
}) => {
	const [internalValue, setInternalValue] = useState<number>(defaultValue);

	const currentValue = value ?? internalValue;

	const handleValueChange = (newValue: number) => {
		if (value === undefined) {
			setInternalValue(newValue);
		}
		onChange?.(newValue);
	};

	return (
		<div className={clsx("flex flex-col items-center gap-2", className)}>
			{label && (
				<label
					className={clsx("text-sm font-normal leading-[21px] text-[var(--ds-color-neutral-10)]", {
						"opacity-50": disabled,
					})}
				>
					{label}
					{required && <span className="ml-1 text-[var(--ds-color-red-40)]">*</span>}
				</label>
			)}

			<div className="flex flex-col items-center gap-2">
				<DigitalTimeUnitComponent
					type={unit}
					value={currentValue}
					onChange={handleValueChange}
					disabled={disabled}
				/>

				{timeUnitLabel && (
					<div className="flex items-center gap-1.5">
						{timeUnitIcon && (
							<div className="flex h-4 w-4 items-center justify-center text-[var(--ds-color-neutral-10)]">
								{React.createElement(timeUnitIcon, { size: 16 })}
							</div>
						)}
						<span className="text-xs font-normal leading-[18px] text-[var(--ds-color-neutral-10)]">
							{timeUnitLabel}
						</span>
					</div>
				)}
			</div>

			{hint && (
				<span className="text-center text-xs font-normal leading-5 text-[var(--ds-color-neutral-50)]">
					{hint}
				</span>
			)}
		</div>
	);
};

InputDigitalTime.displayName = "InputDigitalTime";
