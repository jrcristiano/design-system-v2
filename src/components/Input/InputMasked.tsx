import React, { useCallback, useRef, useMemo } from "react";
import { Input } from "./Input";
import { useMask } from "../../hooks/useMask";
import type { InputProps } from "./Input.interface";

export const InputMasked: React.FC<InputProps> = React.memo(
	({ mask = "", onChangeRaw, onChange, value, ...props }) => {
		const { applyMask, stripMask } = useMask();
		const previousRawRef = useRef<string>("");
		const isControlled = value !== undefined;

		const maskUtils = useMemo(
			() => ({
				applyMask: (val: string) => applyMask(val, mask),
				stripMask: (val: string) => stripMask(val, mask),
			}),
			[mask, applyMask, stripMask],
		);

		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const inputValue = e.target.value;
				const rawValue = maskUtils.stripMask(inputValue);

				if (rawValue === previousRawRef.current) return;

				previousRawRef.current = rawValue;
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
			[maskUtils, onChangeRaw, onChange],
		);

		const displayValue = useMemo(() => {
			if (!isControlled) {
				return previousRawRef.current ? maskUtils.applyMask(previousRawRef.current) : "";
			}

			if (value == null) return "";

			const rawValue = maskUtils.stripMask(String(value));
			previousRawRef.current = rawValue;
			return maskUtils.applyMask(rawValue);
		}, [value, isControlled, maskUtils]);

		return <Input {...props} value={displayValue} onChange={handleChange} />;
	},
);

InputMasked.displayName = "InputMasked";
