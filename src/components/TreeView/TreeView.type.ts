import type { ReactNode } from "react";

export interface TreeNode {
	id: string;
	label: string;
	icon?: ReactNode;
	children?: TreeNode[];
	disabled?: boolean;
	onClick?: (node: TreeNode) => void;
	onDoubleClick?: (node: TreeNode) => void;
	href?: string;
}

export interface TreeViewContextValue {
	expandedIds: Set<string>;
	selectedIds: Set<string>;
	toggleExpanded: (id: string) => void;
	toggleSelected: (id: string) => void;
	selectMultiple: (id: string, checked: boolean) => void;
	focusedId?: string | null;
	setFocusedId?: (id: string) => void;
	multiSelect: boolean;
	withCheckbox: boolean;
}

export interface TreeViewProps {
	data: TreeNode[];
	multiSelect?: boolean;
	withCheckbox?: boolean;
	defaultExpandedIds?: string[];
	defaultSelectedIds?: string[];
	onSelectionChange?: (selectedIds: string[]) => void;
	onExpandChange?: (expandedIds: string[]) => void;
}

export interface TreeViewItemProps {
	node: TreeNode;
	level?: number;
}
