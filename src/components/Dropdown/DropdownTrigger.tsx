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

	// Native buttons already turn Enter and Space into click events.
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			const target = e.target;
			if (
				(e.key === "Enter" || e.key === " ") &&
				target instanceof HTMLElement &&
				!target.matches("button, a, input, select, textarea") &&
				!target.isContentEditable
			) {
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
				onClick={(event) => toggle(event.currentTarget)}
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
		role?: string;
		tabIndex?: number;
	};
	const childTag = typeof children.type === "string" ? children.type : undefined;
	const needsButtonSemantics =
		childTag !== undefined && !["button", "a", "input", "select", "textarea"].includes(childTag);

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
		role?: string;
		tabIndex?: number;
	} = {
		onClick: (e: React.MouseEvent) => {
			childProps.onClick?.(e);
			toggle(e.currentTarget as HTMLElement);
		},
		onKeyDown: (e: React.KeyboardEvent) => {
			childProps.onKeyDown?.(e);
			if (needsButtonSemantics) handleKeyDown(e);
		},
		className: `${styles.trigger} ${applyOpenCloseColors ? styles.triggerStateColors : ""} ${
			childProps.className ?? ""
		}`.trim(),
		"data-open": open,
		"aria-expanded": open,
		"aria-haspopup": "menu",
		...(needsButtonSemantics
			? { role: childProps.role ?? "button", tabIndex: childProps.tabIndex ?? 0 }
			: {}),
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
