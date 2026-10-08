import type { IconWeight } from "@phosphor-icons/react";
import type { TabType, TabState } from "./Tab.type";

export interface ITabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
	type?: TabType;
	state?: TabState;
	iconLeft?: React.ElementType;
	iconRight?: React.ElementType;
	onIconLeftClick?: () => void;
	onIconRightClick?: () => void;
	iconWeight?: IconWeight;
	label: React.ReactNode;
	selected?: boolean;
	onSelect?: () => void;
}
