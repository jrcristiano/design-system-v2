"use client";

import type { ReactNode, CSSProperties } from "react";
import { useMemo } from "react";
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

	// **Early return após todos os Hooks**
	if (!open) return null;

	return (
		<div
			role="menu" // Semântico para leitores de tela
			tabIndex={-1} // Permite foco programático
			className={clsx(
				styles.menuItemList,
				"absolute rounded-[var(--ds-radius-md)] shadow-lg py-2 px-2 z-50 animate-fadeIn bg-[var(--ds-color-neutral-white)]",
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
