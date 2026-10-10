import type { TextareaHTMLAttributes } from "react";
import type { InputState } from "../Input/Input.type";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	message?: string;
	state?: InputState;
}
