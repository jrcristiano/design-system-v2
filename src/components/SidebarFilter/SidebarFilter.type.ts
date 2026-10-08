export interface FilterValue {
	[key: string]: unknown;
}

export interface SidebarFilterContextValue {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
	filters: FilterValue;
	setFilter: (key: string, value: unknown) => void;
	clearFilters: () => void;
	applyFilters: (filters: FilterValue) => void;
}
