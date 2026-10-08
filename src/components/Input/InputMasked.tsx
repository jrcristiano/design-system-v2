import React, { useCallback, useEffect, useRef, useMemo, useState } from "react";
import { Input } from "./Input";
import { useMask } from "../../hooks/useMask";
import type { InputProps } from "./Input.interface";

export const InputMasked: React.FC<InputProps> = React.memo(
	({ mask = "", onChangeRaw, onChange, value, defaultValue, ...props }) => {
		const { applyMask, stripMask } = useMask();
		const maskUtils = useMemo(
			() => ({
				applyMask: (val: string) => applyMask(val, mask),
				stripMask: (val: string) => stripMask(val, mask),
			}),
			[mask, applyMask, stripMask],
		);
		const isControlled = value !== undefined;
		const [uncontrolledRawValue, setUncontrolledRawValue] = useState(() =>
			maskUtils.stripMask(String(value ?? defaultValue ?? "")),
		);
		const currentRawValue = isControlled
			? maskUtils.stripMask(String(value ?? ""))
			: uncontrolledRawValue;
		const previousRawRef = useRef(currentRawValue);

		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const inputValue = e.target.value;
				const rawValue = maskUtils.stripMask(inputValue);

				if (rawValue === previousRawRef.current) return;

				previousRawRef.current = rawValue;
				if (!isControlled) setUncontrolledRawValue(rawValue);
				const formattedValue = maskUtils.applyMask(rawValue);

				onChangeRaw?.(rawValue);

				if (onChange) {
					const syntheticEvent = {
						...e,
						target: {
							...e.target,
							value: formattedValue,
							rawValue: rawValue,
						},
						currentTarget: {
							...e.currentTarget,
							value: formattedValue,
							rawValue: rawValue,
						},
					} as React.ChangeEvent<HTMLInputElement>;

					onChange(syntheticEvent);
				}
			},
			[isControlled, maskUtils, onChangeRaw, onChange],
		);

		useEffect(() => {
			if (isControlled) previousRawRef.current = currentRawValue;
		}, [currentRawValue, isControlled, maskUtils]);

		const displayValue = maskUtils.applyMask(currentRawValue);

		return <Input {...props} value={displayValue} onChange={handleChange} />;
	},
);

InputMasked.displayName = "InputMasked";
