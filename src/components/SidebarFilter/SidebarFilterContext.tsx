"use client";

import { createContext, useContext } from "react";
import type { SidebarFilterContextValue } from "./SidebarFilter.type";

export const SidebarFilterContext = createContext<SidebarFilterContextValue | null>(null);

export function useSidebarFilter() {
	const ctx = useContext(SidebarFilterContext);
	if (!ctx) {
		throw new Error("SidebarFilter components must be used inside <SidebarFilter>");
	}
	return ctx;
}
