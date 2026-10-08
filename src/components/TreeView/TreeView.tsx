"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { TreeViewContext } from "./TreeViewContext";
import { TreeViewItem } from "./TreeViewItem";
import type { TreeViewProps } from "./TreeView.type";

export function TreeView({
	data,
	multiSelect = false,
	withCheckbox = false,
	defaultExpandedIds = [],
	defaultSelectedIds = [],
	onSelectionChange,
	onExpandChange,
}: Readonly<TreeViewProps>) {
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds));
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(defaultSelectedIds));
	const expandedIdsRef = useRef(expandedIds);
	const selectedIdsRef = useRef(selectedIds);
	const [focusedId, setFocusedId] = useState<string | null>(
		data.find((node) => !node.disabled)?.id ?? null,
	);

	const toggleExpanded = useCallback(
		(id: string) => {
			const next = new Set(expandedIdsRef.current);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			expandedIdsRef.current = next;
			setExpandedIds(next);
			onExpandChange?.(Array.from(next));
		},
		[onExpandChange],
	);

	const toggleSelected = useCallback(
		(id: string) => {
			const previous = selectedIdsRef.current;
			const next = new Set(multiSelect ? previous : []);
			if (previous.has(id)) next.delete(id);
			else next.add(id);
			selectedIdsRef.current = next;
			setSelectedIds(next);
			onSelectionChange?.(Array.from(next));
		},
		[multiSelect, onSelectionChange],
	);

	const selectMultiple = useCallback(
		(id: string, checked: boolean) => {
			const next = new Set(selectedIdsRef.current);
			if (checked) next.add(id);
			else next.delete(id);
			selectedIdsRef.current = next;
			setSelectedIds(next);
			onSelectionChange?.(Array.from(next));
		},
		[onSelectionChange],
	);

	const contextValue = useMemo(
		() => ({
			expandedIds,
			selectedIds,
			toggleExpanded,
			toggleSelected,
			selectMultiple,
			focusedId,
			setFocusedId,
			multiSelect,
			withCheckbox,
		}),
		[
			expandedIds,
			selectedIds,
			toggleExpanded,
			toggleSelected,
			selectMultiple,
			focusedId,
			setFocusedId,
			multiSelect,
			withCheckbox,
		],
	);

	return (
		<TreeViewContext.Provider value={contextValue}>
			<ul
				className="w-full list-none p-0 m-0"
				role="tree"
				aria-multiselectable={multiSelect || withCheckbox ? true : undefined}
			>
				{data.map((node) => (
					<TreeViewItem key={node.id} node={node} level={0} />
				))}
			</ul>
		</TreeViewContext.Provider>
	);
}
