import React, { useState, useId } from "react";
import clsx from "clsx";
import type { InputTimeProps, TimeValue } from "./InputTime.interface";

const padZero = (num: number): string => String(num).padStart(2, "0");

export const InputTime: React.FC<InputTimeProps> = ({
	label,
	hint,
	timeUnitLabel,
	timeUnitIcon,
	format = "HH:MM",
	value,
	defaultValue = { hours: 0, minutes: 0, seconds: 0 },
	onChange,
	state = "default",
	disabled = false,
	required = false,
	className,
}) => {
	const [internalValue, setInternalValue] = useState<TimeValue>(value ?? defaultValue);
	const [isFocused, setIsFocused] = useState(false);

	const currentValue = value ?? internalValue;
	const currentState = isFocused ? "focus" : state;

	const inputId = useId();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const timeValue = e.target.value;

		if (!timeValue) {
			const newValue: TimeValue = { hours: 0, minutes: 0, seconds: 0 };

			if (value === undefined) {
				setInternalValue(newValue);
			}

			onChange?.(newValue);
			return;
		}

		const parts = timeValue.split(":");
		const newValue: TimeValue = { hours: 0, minutes: 0, seconds: 0 };

		if (format === "HH:MM:SS") {
			newValue.hours = Number.parseInt(parts[0] ?? "0", 10);
			newValue.minutes = Number.parseInt(parts[1] ?? "0", 10);
			newValue.seconds = Number.parseInt(parts[2] ?? "0", 10);
		} else if (format === "HH:MM") {
			newValue.hours = Number.parseInt(parts[0] ?? "0", 10);
			newValue.minutes = Number.parseInt(parts[1] ?? "0", 10);
		} else {
			newValue.minutes = Number.parseInt(parts[0] ?? "0", 10);
			newValue.seconds = Number.parseInt(parts[1] ?? "0", 10);
		}

		if (value === undefined) {
			setInternalValue(newValue);
		}

		onChange?.(newValue);
	};

	const getTimeValue = (): string => {
		if (format === "HH:MM:SS") {
			return `${padZero(currentValue.hours)}:${padZero(
				currentValue.minutes,
			)}:${padZero(currentValue.seconds)}`;
		}

		if (format === "HH:MM") {
			return `${padZero(currentValue.hours)}:${padZero(currentValue.minutes)}`;
		}

		return `${padZero(currentValue.minutes)}:${padZero(currentValue.seconds)}`;
	};

	return (
		<div className={clsx("w-full max-w-[320px] rounded-2xl bg-white p-3", className)}>
			<div className="flex flex-col gap-1">
				<div className="flex flex-col gap-1.5">
					{label && (
						<label
							htmlFor={inputId}
							className={clsx("text-sm font-medium leading-5 text-[var(--ds-color-neutral-10)]", {
								"opacity-50": disabled,
							})}
						>
							{label}
							{required && <span className="ml-1 text-[var(--ds-color-red-40)]">*</span>}
						</label>
					)}

					<div
						className={clsx(
							"flex h-10 items-center gap-2 rounded-3xl px-3 py-2",
							"shadow-[0px_1px_2px_rgba(10,13,18,0.05)]",
							"outline outline-1 outline-offset-[-1px]",
							{
								"bg-white outline-[var(--ds-color-neutral-50)]":
									currentState === "default" && !disabled,
								"bg-white outline-[3px] outline-[var(--ds-color-blue-10)]":
									currentState === "focus" && !disabled,
								"bg-[var(--ds-color-neutral-80)] outline-[var(--ds-color-neutral-80)]": disabled,
							},
						)}
					>
						<input
							id={inputId}
							type="time"
							value={getTimeValue()}
							onChange={handleInputChange}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							disabled={disabled}
							required={required}
							step={format === "HH:MM:SS" ? "1" : undefined}
							className={clsx(
								"flex-1 border-0 bg-transparent font-poppins text-base font-normal",
								"leading-[15px] outline-none focus:ring-0",
								{
									"text-[var(--ds-color-secondary-on-secondary-container)]": !disabled,
									"text-[var(--ds-color-neutral-40)]": disabled,
									"placeholder:text-[var(--ds-color-neutral-50)]": true,
								},
							)}
						/>
					</div>
				</div>

				{hint && (
					<span
						className={clsx("text-xs font-normal leading-5", {
							"text-[var(--ds-color-neutral-50)]": !disabled,
							"text-[var(--ds-color-neutral-40)]": disabled,
						})}
					>
						{hint}
					</span>
				)}
			</div>

			{timeUnitLabel && (
				<div className="mt-1 flex items-center gap-1.5">
					{timeUnitIcon && (
						<div
							className={clsx("flex h-4 w-4 items-center justify-center", {
								"text-[var(--ds-color-neutral-10)]": !disabled,
								"text-[var(--ds-color-neutral-30)]": disabled,
							})}
						>
							{React.createElement(timeUnitIcon, { size: 16 })}
						</div>
					)}
					<span
						className={clsx("text-xs font-normal leading-[18px]", {
							"text-[var(--ds-color-neutral-10)]": !disabled,
							"text-[var(--ds-color-neutral-30)]": disabled,
						})}
					>
						{timeUnitLabel}
					</span>
				</div>
			)}
		</div>
	);
};

InputTime.displayName = "InputTime";
