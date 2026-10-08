import type { ReactNode } from "react";

export interface IMenuProps extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	size?: "sm" | "md";
	isCollapsed?: boolean;
	onCollapse?: (collapsed: boolean) => void;
	showSearch?: boolean;
	searchPlaceholder?: string;
	onSearchChange?: (value: string) => void;
	logo?: ReactNode;
	logoCollapsed?: ReactNode;
	avatarSrc?: string;
	userName?: string;
	userRole?: string;
}

export interface IMenuItemProps extends React.HTMLAttributes<HTMLButtonElement> {
	label: string;
	leftIcon?: React.ElementType;
	rightIcon?: React.ElementType;
	isActive?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	href?: string;
	children?: ReactNode;
	isSubmenuItem?: boolean;
}
