"use client";

import { createContext, useContext } from "react";

export interface DropdownContextValue {
	open: boolean;
	toggle: (trigger?: HTMLElement | null) => void;
	close: () => void;

	searchQuery: string;
	setSearchQuery: (value: string) => void;

	direction: "top" | "left" | "down" | "right";

	/** foca o input de busca, usado pelo DropdownItem e Checkbox */
	focusSearch?: () => void;

	/** usado no DropdownSearch para registrar sua ref */
	setSearchRef?: (ref: HTMLInputElement | null) => void;
}

export const DropdownContext = createContext<DropdownContextValue | null>(null);

export function useDropdown() {
	const ctx = useContext(DropdownContext);
	if (!ctx) {
		throw new Error("Dropdown components must be used inside <Dropdown>");
	}
	return ctx;
}
