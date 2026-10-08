export interface ISortableListProps<T = any> {
	items: ISortableItem<T>[];
	onChange: (items: ISortableItem<T>[]) => void;
	renderItem: (item: ISortableItem<T>) => React.ReactNode;
	className?: string;
}

export interface ISortableItem<T = any> {
	id: string | number;
	data: T;
}

export interface ISortableItemProps {
	id: string | number;
	children: React.ReactNode;
	className?: string;
}
