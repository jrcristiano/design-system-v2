"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { SidebarFilterContext } from "./SidebarFilterContext";
import type { SidebarFilterProps } from "./SidebarFilter.interface";
import type { FilterValue } from "./SidebarFilter.type";
import { acquireBodyScrollLock } from "../shared/bodyScrollLock";

export function SidebarFilter({
	children,
	onApply,
	defaultFilters = {},
	filters: controlledFilters,
	onFiltersChange,
	position = "right",
}: Readonly<SidebarFilterProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const [internalFilters, setInternalFilters] = useState<FilterValue>(defaultFilters);
	const triggerRef = useRef<HTMLElement | null>(null);

	// Filtros controlados ou não controlados
	const isControlled = controlledFilters !== undefined;
	const filters = isControlled ? controlledFilters : internalFilters;

	const open = useCallback((trigger?: HTMLElement | null) => {
		triggerRef.current = trigger ?? (document.activeElement as HTMLElement);
		setIsOpen(true);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
		triggerRef.current?.focus();
	}, []);

	const toggle = useCallback(
		(trigger?: HTMLElement | null) => {
			if (isOpen) {
				close();
				return;
			}
			open(trigger);
		},
		[close, isOpen, open],
	);

	const setFilter = useCallback(
		(key: string, value: unknown) => {
			const newFilters = { ...filters, [key]: value };
			if (isControlled) {
				onFiltersChange?.(newFilters);
			} else {
				setInternalFilters(newFilters);
			}
		},
		[filters, isControlled, onFiltersChange],
	);

	const clearFilters = useCallback(() => {
		if (isControlled) {
			onFiltersChange?.(defaultFilters);
		} else {
			setInternalFilters(defaultFilters);
		}
	}, [defaultFilters, isControlled, onFiltersChange]);

	const applyFilters = useCallback(
		(currentFilters: FilterValue) => {
			onApply?.(currentFilters);
			close();
		},
		[onApply, close],
	);

	// Fecha ao pressionar Escape
	useEffect(() => {
		if (!isOpen) return undefined;

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				close();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, close]);

	// Share the page scroll lock with other modal overlays.
	useEffect(() => {
		if (!isOpen) return undefined;
		return acquireBodyScrollLock();
	}, [isOpen]);

	const contextValue = useMemo(
		() => ({
			isOpen,
			position,
			open,
			close,
			toggle,
			filters,
			setFilter,
			clearFilters,
			applyFilters,
		}),
		[isOpen, position, open, close, toggle, filters, setFilter, clearFilters, applyFilters],
	);

	return (
		<SidebarFilterContext.Provider value={contextValue}>
			<div data-position={position}>{children}</div>
		</SidebarFilterContext.Provider>
	);
}
