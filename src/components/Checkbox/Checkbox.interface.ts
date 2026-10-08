import type { MouseEvent } from "react";

export interface ICheckboxProps {
	label?: string;
	checked?: boolean;
	defaultChecked?: boolean;
	indeterminate?: boolean;
	disabled?: boolean;
	state?: "default" | "hover" | "pressed" | "focused" | "disabled";
	className?: string;
	tabIndex?: number;
	fontLabelStyle?: React.CSSProperties;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onLabelClick?: (event: MouseEvent<HTMLButtonElement | HTMLSpanElement>) => void;
}
