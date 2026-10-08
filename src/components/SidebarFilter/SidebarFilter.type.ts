export interface FilterValue {
	[key: string]: unknown;
}

export interface SidebarFilterContextValue {
	isOpen: boolean;
	position: "left" | "right";
	open: (trigger?: HTMLElement | null) => void;
	close: () => void;
	toggle: (trigger?: HTMLElement | null) => void;
	filters: FilterValue;
	setFilter: (key: string, value: unknown) => void;
	clearFilters: () => void;
	applyFilters: (filters: FilterValue) => void;
}
