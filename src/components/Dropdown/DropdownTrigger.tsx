"use client";

import { cloneElement, isValidElement, type ElementType, type ReactNode, useCallback } from "react";
import { useDropdown } from "./DropdownContext";
import styles from "./DropdownTrigger.module.css";

interface DropdownTriggerProps {
	children: ReactNode;
	iconOpen?: ElementType;
	iconClosed?: ElementType;
	applyOpenCloseColors?: boolean;
}

export function DropdownTrigger({
	children,
	iconOpen,
	iconClosed,
	applyOpenCloseColors = false,
}: Readonly<DropdownTriggerProps>) {
	const { toggle, open } = useDropdown();

	// Determina o ícone correto
	const resolvedIcon = open ? iconOpen : iconClosed;

	// Handler de teclado unificado para Enter e Space
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				toggle();
			}
		},
		[toggle],
	);

	// Caso children não seja um elemento React válido, renderiza botão simples
	if (!isValidElement(children)) {
		return (
			<button
				type="button"
				onClick={toggle}
				onKeyDown={handleKeyDown}
				className={`${styles.trigger} ${
					applyOpenCloseColors ? styles.triggerStateColors : ""
				} cursor-pointer select-none bg-transparent border-0 p-0 m-0 text-left`}
				aria-expanded={open} // acessibilidade
				aria-haspopup="menu"
				data-open={open}
			>
				{children}
			</button>
		);
	}

	// Props do filho original
	const childProps = children.props as {
		iconRight?: ElementType;
		iconLeft?: ElementType;
		onClick?: (e: React.MouseEvent) => void;
		onKeyDown?: (e: React.KeyboardEvent) => void;
		className?: string;
	};

	// Novas props injetadas no filho
	const nextProps: {
		iconRight?: ElementType;
		iconLeft?: ElementType;
		onClick: (e: React.MouseEvent) => void;
		onKeyDown: (e: React.KeyboardEvent) => void;
		className: string;
		"data-open": boolean;
		"aria-expanded": boolean;
		"aria-haspopup": string;
	} = {
		onClick: (e: React.MouseEvent) => {
			childProps.onClick?.(e);
			toggle();
		},
		onKeyDown: (e: React.KeyboardEvent) => {
			childProps.onKeyDown?.(e);
			handleKeyDown(e);
		},
		className: `${styles.trigger} ${applyOpenCloseColors ? styles.triggerStateColors : ""} ${
			childProps.className ?? ""
		}`.trim(),
		"data-open": open,
		"aria-expanded": open,
		"aria-haspopup": "menu",
	};

	// Adiciona ícones corretamente
	if (resolvedIcon) {
		if ("iconRight" in childProps) {
			nextProps.iconRight = resolvedIcon;
		} else if ("iconLeft" in childProps) {
			nextProps.iconLeft = resolvedIcon;
		} else {
			nextProps.iconRight = resolvedIcon;
		}
	}

	return cloneElement(children, nextProps);
}
