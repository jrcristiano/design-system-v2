"use client";

import { CaretDownIcon, CaretRightIcon, CircleIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { useTreeView } from "./TreeViewContext";
import { Checkbox } from "../Checkbox/Checkbox";
import type { TreeViewItemProps } from "./TreeView.type";

export function TreeViewItem({ node, level = 0 }: Readonly<TreeViewItemProps>) {
	const context = useTreeView();
	const { expandedIds, selectedIds, toggleExpanded, toggleSelected, selectMultiple, withCheckbox } =
		context;
	const focusedId = context.focusedId ?? null;
	const setFocusedId = context.setFocusedId ?? (() => {});

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
		const handledKeys = [
			"Enter",
			" ",
			"ArrowRight",
			"ArrowLeft",
			"ArrowDown",
			"ArrowUp",
			"Home",
			"End",
		];
		if (!handledKeys.includes(e.key)) return;
		e.stopPropagation();
		if (node.disabled) return;
		const tree = e.currentTarget.closest('[role="tree"]');
		const visibleItems = Array.from(
			tree?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? [],
		).filter((item) => item.getAttribute("aria-disabled") !== "true");
		const currentIndex = visibleItems.indexOf(e.currentTarget as HTMLElement);
		const focusItem = (item?: HTMLElement | null) => {
			if (!item) return;
			const id = item.dataset.treeId;
			if (id) setFocusedId(id);
			item.focus();
		};

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
				} else if (hasChildren) {
					e.preventDefault();
					focusItem(
						e.currentTarget.querySelector<HTMLElement>(':scope > [role="group"] [role="treeitem"]'),
					);
				}
				break;

			case "ArrowLeft":
				if (hasChildren && isExpanded) {
					e.preventDefault();
					toggleExpanded(node.id);
				} else {
					const parent = e.currentTarget.closest('[role="group"]')?.parentElement;
					if (parent) {
						e.preventDefault();
						focusItem(parent);
					}
				}
				break;
			case "ArrowDown":
				e.preventDefault();
				focusItem(visibleItems[currentIndex + 1] ?? visibleItems[0]);
				break;
			case "ArrowUp":
				e.preventDefault();
				focusItem(visibleItems[currentIndex - 1] ?? visibleItems.at(-1));
				break;
			case "Home":
				e.preventDefault();
				focusItem(visibleItems[0]);
				break;
			case "End":
				e.preventDefault();
				focusItem(visibleItems.at(-1));
				break;
		}
	};

	const indentStyle = { paddingLeft: `${level * 24 + 4}px` };

	return (
		<li role="none" className="list-none">
			<div
				role="treeitem"
				data-tree-id={node.id}
				aria-level={level + 1}
				aria-expanded={hasChildren ? isExpanded : undefined}
				aria-selected={isSelected}
				aria-disabled={node.disabled || undefined}
				tabIndex={!node.disabled && focusedId === node.id ? 0 : -1}
				className="w-full"
				onKeyDown={handleKeyDown}
				onFocus={() => setFocusedId(node.id)}
				onClick={(e) => {
					e.stopPropagation();
					setFocusedId(node.id);
					e.currentTarget.focus();
					handleAction();
				}}
			>
				<div
					className={clsx(
						"flex items-center h-11 cursor-pointer outline-none",
						isSelected && !withCheckbox ? "bg-[#E3E5E8]" : "bg-transparent",
						"hover:bg-[#E3E5E8] transition-colors duration-150",
						node.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
					)}
					style={indentStyle}
					onDoubleClick={node.onDoubleClick ? () => node.onDoubleClick(node) : undefined}
				>
					<span
						onClick={(e) => {
							e.stopPropagation();
							if (hasChildren) {
								setFocusedId(node.id);
								(e.currentTarget.closest('[role="treeitem"]') as HTMLElement | null)?.focus();
								toggleExpanded(node.id);
							}
						}}
						className={clsx(
							"w-6 h-6 flex items-center justify-center mr-1 rounded-md transition-colors",
							!hasChildren && "invisible",
							hasChildren && !isSelected && "hover:bg-[var(--ds-color-neutral-80)]",
						)}
						aria-hidden="true"
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
					</span>

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
								tabIndex={-1}
								aria-label={`Selecionar ${node.label}`}
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
					<ul role="group" className="list-none p-0 m-0">
						{node.children?.map((child) => (
							<TreeViewItem key={child.id} node={child} level={level + 1} />
						))}
					</ul>
				)}
			</div>
		</li>
	);
}
