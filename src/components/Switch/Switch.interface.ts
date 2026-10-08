import type { ChangeEvent, LabelHTMLAttributes } from "react";

export interface SwitchProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
	disabled?: boolean;
	defaultChecked?: boolean;
	checked?: boolean;
	onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
}
