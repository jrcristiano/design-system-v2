import type { ReactNode, SelectHTMLAttributes } from "react";
import type { InputSize, InputState } from "../Input/Input.type";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
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
}
