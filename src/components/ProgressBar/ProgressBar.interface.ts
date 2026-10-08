export type ProgressBarVariant = "primary" | "success" | "warning" | "danger";

export type ProgressBarStatus = "in-progress" | "success" | "error";

export interface ProgressBarProps {
	progress: number;
	ariaLabel?: string;
	variant?: ProgressBarVariant;
	status?: ProgressBarStatus;
	fileName?: string;
	message?: string;
	icon?: ReactNode;
}
import type { ReactNode } from "react";
