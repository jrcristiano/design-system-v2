import type { InputHTMLAttributes } from "react";

export interface IRadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	label?: string;
	disabled?: boolean;
	fontLabelStyle?: object;
}
