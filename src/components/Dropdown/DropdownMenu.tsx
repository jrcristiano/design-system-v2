"use client";

import type { ReactNode, CSSProperties } from "react";
import { useEffect, useMemo, useRef } from "react";
import { useDropdown } from "./DropdownContext";
import clsx from "clsx";
import styles from "./DropdownMenu.module.css";

interface DropdownMenuProps {
	children: ReactNode;
	scrollable?: boolean;
	maxHeight?: string;
	height?: string;
	width?: string;
	maxWidth?: string;
	style?: CSSProperties;
	bordered?: boolean;
}

export function DropdownMenu({
	children,
	scrollable = false,
	maxHeight,
	height,
	width,
	maxWidth,
	style = {},
	bordered = true,
}: Readonly<DropdownMenuProps>) {
	const { open, direction } = useDropdown();
	const menuRef = useRef<HTMLDivElement>(null);

	// **Todos os Hooks antes de qualquer return condicional**
	const directionClass = useMemo(() => {
		const map: Record<string, string> = {
			down: "left-0 mt-2 top-full",
			top: "left-0 mb-2 bottom-full",
			right: "top-0 ml-2 left-full",
			left: "top-0 mr-2 right-full",
		};
		return map[direction];
	}, [direction]);

	const mergedStyle = useMemo<CSSProperties>(() => {
		return {
			height,
			width: scrollable ? undefined : width,
			maxHeight: scrollable ? maxHeight : undefined,
			maxWidth,
			overflowY: scrollable ? "auto" : undefined,
			...style,
		};
	}, [height, width, maxHeight, maxWidth, scrollable, style]);

	useEffect(() => {
		if (!open) return;
		menuRef.current
			?.querySelector<HTMLElement>('input:not([disabled]), [role^="menuitem"]:not([disabled])')
			?.focus();
	}, [open]);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const items = Array.from(
			menuRef.current?.querySelectorAll<HTMLElement>(
				'[role^="menuitem"]:not([disabled]):not([aria-disabled="true"])',
			) ?? [],
		);
		if (!items.length) return;

		const activeIndex = items.indexOf(document.activeElement as HTMLElement);
		let nextIndex: number;
		switch (event.key) {
			case "ArrowDown":
				nextIndex = (activeIndex + 1) % items.length;
				break;
			case "ArrowUp":
				nextIndex = (activeIndex - 1 + items.length) % items.length;
				break;
			case "Home":
				nextIndex = 0;
				break;
			case "End":
				nextIndex = items.length - 1;
				break;
			default:
				return;
		}
		event.preventDefault();
		items[nextIndex]?.focus();
	};

	// **Early return após todos os Hooks**
	if (!open) return null;

	return (
		<div
			ref={menuRef}
			role="menu" // Semântico para leitores de tela
			tabIndex={-1} // Permite foco programático
			onKeyDown={handleKeyDown}
			className={clsx(
				styles.menuItemList,
				"absolute rounded-[var(--ds-radius-md)] shadow-lg py-2 px-2 z-50 animate-fadeIn bg-[var(--ds-color-surface-raised)]",
				directionClass,
				{
					"border border-[var(--ds-color-neutral-50)]": bordered,
					"border-none": !bordered,
					[styles.customScroll]: scrollable,
				},
			)}
			style={mergedStyle}
		>
			{children}
		</div>
	);
}
