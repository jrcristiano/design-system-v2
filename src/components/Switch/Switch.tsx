import React, { useState } from "react";
import styles from "./Switch.module.css";
import type { SwitchProps } from "./Switch.interface";

const Switch = ({
	disabled = false,
	defaultChecked = false,
	checked,
	onChange,
	className = "",
	...props
}: SwitchProps) => {
	const [isChecked, setIsChecked] = useState(defaultChecked);

	const isControlled = checked !== undefined;
	const currentChecked = isControlled ? checked : isChecked;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;

		if (!isControlled) {
			setIsChecked(e.target.checked);
		}

		onChange?.(e.target.checked, e);
	};

	return (
		<label
			className={`${styles.switch} ${className} ${disabled ? styles.disabled : ""} focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--ds-color-blue-10)] focus-within:rounded-full`}
			{...props}
		>
			<input
				type="checkbox"
				className={styles.input}
				checked={currentChecked}
				onChange={handleChange}
				disabled={disabled}
			/>
			<span className={styles.slider}></span>
		</label>
	);
};

export default Switch;
