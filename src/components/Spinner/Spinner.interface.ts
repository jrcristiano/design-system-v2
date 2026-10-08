export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export type SpinnerVariant = "primary" | "neutral" | "success" | "warning" | "danger";

export interface SpinnerProps {
	size?: SpinnerSize | number;
	variant?: SpinnerVariant;
	speed?: number;
	ariaLabel?: string;
	progress?: number;
}
