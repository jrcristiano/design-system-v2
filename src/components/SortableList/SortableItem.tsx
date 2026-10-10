import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ISortableItemProps } from "./SortableList.interface";

export const SortableItem: React.FC<ISortableItemProps> = ({ id, children, className }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={[
				className,
				isDragging &&
					"opacity-40 dark:opacity-100 dark:outline-2 dark:outline-offset-2 dark:outline-[var(--ds-color-focus-ring)]",
				"dark:focus-visible:outline-2 dark:focus-visible:outline-offset-2 dark:focus-visible:outline-[var(--ds-color-focus-ring)]",
			]
				.filter(Boolean)
				.join(" ")}
			{...attributes}
			{...listeners}
		>
			{children}
		</div>
	);
};
