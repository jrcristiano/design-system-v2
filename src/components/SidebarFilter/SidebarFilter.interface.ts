import type { ReactNode } from "react";
import type { FilterValue } from "./SidebarFilter.type";

export interface SidebarFilterProps {
	children: ReactNode;
	onApply?: (filters: FilterValue) => void;
	defaultFilters?: FilterValue;
	filters?: FilterValue; // Filtros controlados
	onFiltersChange?: (filters: FilterValue) => void; // Callback quando filtros mudam
	position?: "left" | "right";
}

export interface SidebarFilterTriggerProps {
	children: ReactNode;
}

export interface SidebarFilterHeaderProps {
	title?: string;
	onClose?: () => void;
}

export interface SidebarFilterContentProps {
	children: ReactNode;
}

export interface SidebarFilterFooterProps {
	onClear?: () => void;
	onApply?: () => void;
	clearLabel?: string;
	applyLabel?: string;
}

export interface FilterSectionProps {
	title: string;
	required?: boolean;
	children: ReactNode;
}

export interface FilterRangeProps {
	label: string;
	min: number;
	max: number;
	value: [number, number];
	onChange: (value: [number, number]) => void;
	step?: number;
	unit?: string;
}
