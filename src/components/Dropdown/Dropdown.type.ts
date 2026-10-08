import type { ReactNode } from "react";

export type DropdownItemVariant =
	| "default"
	| "checkbox"
	| "icon"
	| "shortcut"
	| "divisor"
	| "checkbox-only"
	| "label-only"
	| "icon-only";

export interface DropdownContextType {
	open: boolean;
	toggle: () => void;
	close: () => void;
}

export interface DropdownItemProps {
	disabled?: boolean;
	checked?: boolean;
	icon?: ReactNode;
	shortcut?: string;
	children?: ReactNode;
	onSelect?: () => void;
	variant?: DropdownItemVariant;
}
