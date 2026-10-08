import type { IconWeight } from "@phosphor-icons/react";
import type { State } from "../../types/Commons.type";

export type TagVariant = "primary" | "success" | "info" | "warning" | "danger" | "inactive";
export type TagState = State | "selected";

export interface ITagProps {
	variant?: TagVariant;
	state?: TagState;
	pill?: boolean;
	circle?: boolean;
	iconLeft?: React.ElementType<any>;
	iconRight?: React.ElementType<any>;
	onIconLeftClick?: () => void;
	onIconRightClick?: () => void;
	count?: number;
	disabled?: boolean;
	closable?: boolean;
	onClose?: () => void;
	children?: React.ReactNode;
	size?: "sm" | "md";
	iconWeight?: IconWeight;
	hoverBorderOnly?: boolean;
}
