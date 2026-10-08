import type React from "react";

export type ChipVariant = "primary" | "success" | "danger";
export type ChipState = "default" | "pressed" | "focused" | "outline";

export interface IChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ChipVariant;
	state?: ChipState;
	pill?: boolean;
	iconLeft?: React.ElementType;
	iconRight?: React.ElementType;
	onIconLeftClick?: () => void;
	onIconRightClick?: () => void;
	children?: React.ReactNode;
}
