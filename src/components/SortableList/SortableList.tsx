import React from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ISortableListProps } from "./SortableList.interface";
import { SortableItem } from "./SortableItem";
import clsx from "clsx";

export const SortableList = <T,>({
	items,
	onChange,
	renderItem,
	className,
}: ISortableListProps<T>): React.ReactElement => {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over.id);

			const newItems = arrayMove(items, oldIndex, newIndex);
			onChange(newItems);
		}
	};

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
				<div className={clsx("flex flex-col gap-3", className)}>
					{items.map((item) => (
						<SortableItem key={item.id} id={item.id}>
							{renderItem(item)}
						</SortableItem>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
};
