"use client";

import { CaretDownIcon, CaretRightIcon, CircleIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { useTreeView } from "./TreeViewContext";
import { Checkbox } from "../Checkbox/Checkbox";
import type { TreeViewItemProps } from "./TreeView.type";

export function TreeViewItem({ node, level = 0 }: Readonly<TreeViewItemProps>) {
	const { expandedIds, selectedIds, toggleExpanded, toggleSelected, selectMultiple, withCheckbox } =
		useTreeView();

	const hasChildren = Boolean(node.children?.length);
	const isExpanded = expandedIds.has(node.id);
	const isSelected = selectedIds.has(node.id);

	const performNavigationOrSelect = () => {
		if (node.onClick) {
			node.onClick(node);
			return;
		}

		if (node.href) {
			globalThis.location.href = node.href;
			return;
		}

		toggleSelected(node.id);
	};

	const handleAction = () => {
		if (node.disabled) return;

		if (withCheckbox) {
			selectMultiple(node.id, !isSelected);
			return;
		}

		performNavigationOrSelect();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (node.disabled) return;

		switch (e.key) {
			case "Enter":
			case " ":
				e.preventDefault();
				handleAction();
				break;

			case "ArrowRight":
				if (hasChildren && !isExpanded) {
					e.preventDefault();
					toggleExpanded(node.id);
				}
				break;

			case "ArrowLeft":
				if (hasChildren && isExpanded) {
					e.preventDefault();
					toggleExpanded(node.id);
				}
				break;
		}
	};

	const indentStyle = { paddingLeft: `${level * 24 + 4}px` };

	return (
		<li className="list-none">
			<div
				role="treeitem"
				aria-expanded={hasChildren ? isExpanded : undefined}
				aria-selected={isSelected}
				aria-disabled={node.disabled}
				tabIndex={node.disabled ? -1 : 0}
				className={clsx(
					"flex items-center h-11 cursor-pointer outline-none",
					isSelected && !withCheckbox ? "bg-[#E3E5E8]" : "bg-transparent",
					"hover:bg-[#E3E5E8] transition-colors duration-150",
					node.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
				)}
				style={indentStyle}
				onClick={(e) => {
					e.stopPropagation();
					handleAction();
				}}
				onDoubleClick={node.onDoubleClick ? () => node.onDoubleClick(node) : undefined}
				onKeyDown={handleKeyDown}
			>
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						if (hasChildren) toggleExpanded(node.id);
					}}
					className={clsx(
						"w-6 h-6 flex items-center justify-center mr-1 rounded-md transition-colors",
						!hasChildren && "invisible",
						hasChildren && !isSelected && "hover:bg-[var(--ds-color-neutral-80)]",
					)}
					aria-label={isExpanded ? "Recolher" : "Expandir"}
					tabIndex={-1}
				>
					{hasChildren && (
						<span className="text-[var(--ds-color-neutral-30)]">
							{isExpanded ? (
								<CaretDownIcon size={16} weight="bold" />
							) : (
								<CaretRightIcon size={16} weight="bold" />
							)}
						</span>
					)}
				</button>

				<span
					className="w-6 h-6 flex items-center justify-center mr-2 text-[var(--ds-color-neutral-30)]"
					aria-hidden="true"
				>
					{node.icon || <CircleIcon size={8} weight="fill" />}
				</span>

				{withCheckbox && (
					<span className="mr-2">
						<Checkbox
							checked={isSelected}
							disabled={node.disabled}
							fontLabelStyle={{
								fontSize: "var(--ds-font-size-14)",
								fontWeight: "var(--ds-font-weight-medium)",
							}}
						/>
					</span>
				)}

				<div className="flex-1 px-2.5 py-2 rounded-md overflow-hidden">
					<span
						className="transition-colors duration-150"
						style={{
							fontSize: "var(--ds-font-size-14)",
							fontWeight: "var(--ds-font-weight-medium)",
							lineHeight: "20px",
							color: node.disabled ? "var(--ds-color-neutral-40)" : "#17191C",
						}}
					>
						{node.label}
					</span>
				</div>
			</div>

			{hasChildren && isExpanded && (
				<ul className="list-none p-0 m-0">
					{node.children?.map((child) => (
						<TreeViewItem key={child.id} node={child} level={level + 1} />
					))}
				</ul>
			)}
		</li>
	);
}
