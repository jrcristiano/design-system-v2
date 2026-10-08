"use client";

import { createContext, useContext } from "react";
import type { TreeViewContextValue } from "./TreeView.type";

export const TreeViewContext = createContext<TreeViewContextValue | null>(null);

export function useTreeView() {
	const ctx = useContext(TreeViewContext);
	if (!ctx) {
		throw new Error("TreeView components must be used inside <TreeView>");
	}
	return ctx;
}
