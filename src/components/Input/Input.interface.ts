import type { InputHTMLAttributes, ReactNode } from "react";
import type { InputSize, InputState } from "./Input.type";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	label?: string;
	message?: string;
	required?: boolean;
	iconLeft?: ReactNode;
	iconRight?: ReactNode;
	onIconLeftClick?: () => void;
	onIconRightClick?: () => void;
	iconClassName?: string;
	disabled?: boolean;
	state?: InputState;
	size?: InputSize;
	mask?: string;
	onChangeRaw?: (rawValue: string) => void;
}
