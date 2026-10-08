import type { IconWeight } from "@phosphor-icons/react";
import type { Size, State, Variant } from "../../types/Commons.type";
export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
	size?: Size;
	state?: State;
	iconLeft?: React.ElementType<any>;
	iconRight?: React.ElementType<any>;
	onIconLeftClick?: () => void;
	onIconRightClick?: () => void;
	children?: React.ReactNode;
	isLoading?: boolean;
	disabled?: boolean;
	circle?: boolean;
	floatingOn?: FabPosition;
	iconWeight?: IconWeight;
	gapBetweenTextAndIcon?: boolean;
}

export type FabPosition =
	"bottom-right" | "bottom-left" | "bottom-center" | "top-right" | "relative" | "contextual";
