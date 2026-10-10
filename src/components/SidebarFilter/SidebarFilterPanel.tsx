"use client";

import { useEffect, useRef, useCallback, useState, type ReactNode, useId } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { useSidebarFilter } from "./SidebarFilterContext";
import styles from "./SidebarFilterPanel.module.css";

interface SidebarFilterPanelProps {
	children: ReactNode;
	position?: "left" | "right";
}

export function SidebarFilterPanel({ children, position }: Readonly<SidebarFilterPanelProps>) {
	const { isOpen, close, position: sidebarPosition } = useSidebarFilter();
	const panelPosition = position ?? sidebarPosition;

	// CORREÇÃO 1: HTMLDialogElement para compatibilidade de tipos
	const panelRef = useRef<HTMLDialogElement>(null);

	const headerId = useId();

	const [isClosing, setIsClosing] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);

	// Gerencia estado de montagem/desmontagem com animação
	useEffect(() => {
		if (isOpen) {
			setShouldRender(true);
			setIsClosing(false);
		}
		// CORREÇÃO 3: Else if direto para evitar 'If' aninhado único
		else if (shouldRender) {
			setIsClosing(true);
			const timer = setTimeout(() => {
				setShouldRender(false);
				setIsClosing(false);
			}, 300); // Duração da animação
			return () => clearTimeout(timer);
		}
	}, [isOpen, shouldRender]);

	// Focus trap
	useEffect(() => {
		if (isOpen && shouldRender && panelRef.current) {
			const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
			);
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			const focusTimer = setTimeout(() => firstElement?.focus(), 50);

			const handleTab = (e: KeyboardEvent) => {
				if (e.key !== "Tab") return;

				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement?.focus();
					}
				} else if (document.activeElement === lastElement) {
					e.preventDefault();
					firstElement?.focus();
				}
			};

			document.addEventListener("keydown", handleTab);
			return () => {
				clearTimeout(focusTimer);
				document.removeEventListener("keydown", handleTab);
			};
		}
	}, [isOpen, shouldRender]);

	const handleOverlayClick = useCallback(() => {
		close();
	}, [close]);

	const handleOverlayKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				close();
			}
		},
		[close],
	);

	if (!shouldRender) return null;

	const portalTarget = typeof document === "undefined" ? null : document.body;

	if (!portalTarget) return null;

	return createPortal(
		<>
			{/* CORREÇÃO 4: Removido role="presentation" (aria-hidden="true" é suficiente para o overlay) */}
			<div
				className={clsx(
					"fixed inset-0 bg-[var(--ds-color-overlay)] z-[998]",
					isClosing ? styles.fadeOut : styles.fadeIn,
				)}
				onClick={handleOverlayClick}
				onKeyDown={handleOverlayKeyDown}
				aria-hidden="true"
			/>

			{/* CORREÇÃO 5: Uso da tag semântica <dialog> em vez de <div role="dialog"> */}
			<dialog
				ref={panelRef}
				open
				aria-modal={isOpen}
				aria-hidden={!isOpen}
				inert={!isOpen}
				aria-labelledby={headerId}
				className={clsx(
					"fixed inset-y-0 w-[360px] z-[999] p-0 border-none bg-[var(--ds-color-surface)]",
					"flex flex-col",
					isClosing ? styles.slideOut : styles.slideIn,
				)}
				data-position={panelPosition}
			>
				<div id={headerId} className="sr-only">
					Painel de Filtros
				</div>
				{children}
			</dialog>
		</>,
		portalTarget,
	);
}
