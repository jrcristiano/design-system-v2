"use client";

import { useState, useRef, useCallback, type ReactNode, useEffect, useMemo } from "react";
import { DropdownContext } from "./DropdownContext";

interface DropdownProps {
	children: ReactNode;
	direction?: "top" | "left" | "down" | "right";
}

export function Dropdown({ children, direction = "down" }: Readonly<DropdownProps>) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const containerRef = useRef<HTMLDivElement | null>(null);

	// Hooks combinados para menos funções recreadas
	const close = useCallback(() => {
		setOpen(false);
		setSearchQuery("");
	}, []);

	const toggle = useCallback(() => {
		setOpen((prev) => !prev);
	}, []);

	// Centraliza todos os eventos fora do DOM
	const handleClickOutside = useCallback(
		(event: MouseEvent) => {
			if (!containerRef.current) return;
			if (!containerRef.current.contains(event.target as Node)) {
				close();
			}
		},
		[close],
	);

	const handleEscape = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Escape") close();
		},
		[close],
	);

	// Adiciona e remove listeners de forma eficiente
	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);
		const handleResize = () => close();
		window.addEventListener("resize", handleResize);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
			window.removeEventListener("resize", handleResize);
		};
	}, [handleClickOutside, handleEscape, close]);

	useEffect(() => {
		if (!open) return;
		const handleScroll = () => close();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [open, close]);

	// Memoize o valor do contexto para evitar recriações desnecessárias
	const contextValue = useMemo(
		() => ({
			open,
			toggle,
			close,
			searchQuery,
			setSearchQuery,
			direction,
		}),
		[open, toggle, close, searchQuery, setSearchQuery, direction],
	);

	return (
		<DropdownContext.Provider value={contextValue}>
			<div ref={containerRef} className="relative inline-block w-full sm:w-auto">
				{children}
			</div>
		</DropdownContext.Provider>
	);
}
