"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { SidebarFilterContext } from "./SidebarFilterContext";
import type { SidebarFilterProps } from "./SidebarFilter.interface";
import type { FilterValue } from "./SidebarFilter.type";

// Contador global de modals abertos para gerenciar scroll lock
let openModalsCount = 0;
const originalBodyOverflow = typeof document === "undefined" ? "" : document.body.style.overflow;

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
	const containerRef = useRef<HTMLDivElement | null>(null);
	const triggerRef = useRef<HTMLElement | null>(null);

	// Filtros controlados ou não controlados
	const isControlled = controlledFilters !== undefined;
	const filters = isControlled ? controlledFilters : internalFilters;

	const open = useCallback(() => {
		// Salva referência ao elemento ativo antes de abrir
		triggerRef.current = document.activeElement as HTMLElement;
		setIsOpen(true);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
		// Retorna foco ao trigger após fechar
		setTimeout(() => {
			triggerRef.current?.focus();
		}, 100);
	}, []);

	const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

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
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isOpen) {
				close();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, close]);

	// Previne scroll do body quando aberto - com contador para múltiplos modals
	useEffect(() => {
		if (isOpen) {
			openModalsCount++;
			if (openModalsCount === 1) {
				// Primeiro modal abrindo - salva e bloqueia scroll
				document.body.style.overflow = "hidden";
			}
			return () => {
				openModalsCount--;
				if (openModalsCount === 0) {
					// Último modal fechando - restaura scroll
					document.body.style.overflow = originalBodyOverflow;
				}
			};
		}
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
			<div ref={containerRef} data-position={position}>
				{children}
			</div>
		</SidebarFilterContext.Provider>
	);
}
