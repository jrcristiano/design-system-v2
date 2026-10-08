"use client";

import { useState, useMemo, useCallback } from "react";
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

	const toggleExpanded = useCallback(
		(id: string) => {
			setExpandedIds((prev) => {
				const next = new Set(prev);
				if (next.has(id)) {
					next.delete(id);
				} else {
					next.add(id);
				}

				if (onExpandChange) {
					onExpandChange(Array.from(next));
				}

				return next;
			});
		},
		[onExpandChange],
	);

	const toggleSelected = useCallback(
		(id: string) => {
			setSelectedIds((prev) => {
				const next = new Set(multiSelect ? prev : []);
				if (prev.has(id)) {
					next.delete(id);
				} else {
					next.add(id);
				}

				if (onSelectionChange) {
					onSelectionChange(Array.from(next));
				}

				return next;
			});
		},
		[multiSelect, onSelectionChange],
	);

	const selectMultiple = useCallback(
		(id: string, checked: boolean) => {
			setSelectedIds((prev) => {
				const next = new Set(prev);
				if (checked) {
					next.add(id);
				} else {
					next.delete(id);
				}

				if (onSelectionChange) {
					onSelectionChange(Array.from(next));
				}

				return next;
			});
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
			multiSelect,
			withCheckbox,
		}),
		[
			expandedIds,
			selectedIds,
			toggleExpanded,
			toggleSelected,
			selectMultiple,
			multiSelect,
			withCheckbox,
		],
	);

	return (
		<TreeViewContext.Provider value={contextValue}>
			<div className="w-full" role="tree">
				{data.map((node) => (
					<TreeViewItem key={node.id} node={node} level={0} />
				))}
			</div>
		</TreeViewContext.Provider>
	);
}
