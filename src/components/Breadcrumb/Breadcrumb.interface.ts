export interface BreadcrumbItem {
	id?: string;
	label: string;
	href?: string;
	onClick?: () => void;
	ariaLabel?: string;
}

export interface BreadcrumbItemProps {
	item: BreadcrumbItem;
	isLast: boolean;
	separator?: string;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	onIconLeftClick?: () => void;
	onIconRightClick?: () => void;
	separatorColor?: string;
	iconColor?: string;
	showSeparator?: boolean;
}

export interface BreadcrumbProps {
	items: BreadcrumbItem[];
	separator?: string;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	onIconLeftClick?: () => void;
	onIconRightClick?: () => void;
	separatorColor?: string;
	iconColor?: string;
	className?: string;
	maxItems?: number;
	ariaLabel?: string;
}
