export interface FilterValue {
	[key: string]: unknown;
}

export interface SidebarFilterContextValue {
	isOpen: boolean;
	position: "left" | "right";
	open: () => void;
	close: () => void;
	toggle: () => void;
	filters: FilterValue;
	setFilter: (key: string, value: unknown) => void;
	clearFilters: () => void;
	applyFilters: (filters: FilterValue) => void;
}
