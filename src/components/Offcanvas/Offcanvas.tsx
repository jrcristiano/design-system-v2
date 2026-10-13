"use client";

import {
	createContext,
	useContext,
	useEffect,
	useEffectEvent,
	useId,
	useRef,
	useState,
	type HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { XIcon } from "@phosphor-icons/react";
import { Button } from "../Button/Button";
import { acquireBodyScrollLock } from "../shared/bodyScrollLock";
import type { IOffcanvasProps } from "./Offcanvas.interface";
import "./Offcanvas.css";

const OffcanvasContext = createContext<{
	titleId: string;
	descriptionId: string;
	setTitle: (id: string | undefined) => void;
	setDescription: (id: string | undefined) => void;
} | null>(null);

/** Controlled native modal. Requires browser support for HTMLDialogElement.showModal. */
export function Offcanvas({
	open,
	onOpenChange,
	side = "right",
	size = "md",
	closeOnOverlayClick = true,
	closeOnEsc = true,
	showCloseButton = true,
	closeLabel = "Fechar painel",
	initialFocusRef,
	returnFocusRef,
	className,
	children,
	onClick,
	onKeyDown,
	onPointerDown,
	...props
}: IOffcanvasProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const restoreRef = useRef<HTMLElement | null>(null);
	const releaseRef = useRef<(() => void) | null>(null);
	const requestedRef = useRef(false);
	const backdropStartRef = useRef(false);
	const [mounted, setMounted] = useState(false);
	const [title, setTitle] = useState<string>();
	const [description, setDescription] = useState<string>();
	const titleId = useId();
	const descriptionId = useId();
	const requestClose = () => {
		if (!open || requestedRef.current) return;
		requestedRef.current = true;
		onOpenChange(false);
		// Coalesce one gesture while allowing a later attempt if the owner keeps it open.
		queueMicrotask(() => {
			requestedRef.current = false;
		});
	};
	const finishClose = useEffectEvent(() => {
		const dialog = dialogRef.current;
		if (dialog?.open) dialog.close();
		releaseRef.current?.();
		releaseRef.current = null;
		if (restoreRef.current?.isConnected) restoreRef.current.focus({ preventScroll: true });
		restoreRef.current = null;
	});
	const focusInitial = useEffectEvent(() => {
		const target = initialFocusRef?.current;
		if (target && dialogRef.current?.contains(target)) target.focus({ preventScroll: true });
	});
	const captureFocus = useEffectEvent(() => {
		restoreRef.current =
			returnFocusRef?.current ??
			(document.activeElement instanceof HTMLElement ? document.activeElement : null);
	});

	useEffect(() => {
		setMounted(true);
		return () => finishClose();
	}, []);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!mounted || !dialog) return;
		requestedRef.current = false;
		if (open) {
			if (!dialog.open) {
				captureFocus();
				dialog.showModal();
				releaseRef.current = acquireBodyScrollLock();
				focusInitial();
			}
			dialog.dataset.state = "open";
			return;
		}
		if (!dialog.open) return;
		dialog.dataset.state = "closing";
		// Read the actual scoped CSS duration, including reduced motion and overrides.
		const style = getComputedStyle(dialog);
		const toMs = (value: string) =>
			parseFloat(value) * (value.trim().endsWith("ms") ? 1 : 1000) || 0;
		const delays = style.transitionDelay.split(",").map(toMs);
		const duration = Math.max(
			0,
			...style.transitionDuration
				.split(",")
				.map((value, i) => toMs(value) + delays[i % delays.length]),
		);
		if (!duration) {
			finishClose();
			return;
		}
		const timer = window.setTimeout(() => finishClose(), duration);
		return () => window.clearTimeout(timer);
	}, [open, mounted]);

	if (!mounted) return null;
	const isOutside = (event: { clientX: number; clientY: number }, dialog: HTMLDialogElement) => {
		const bounds = dialog.getBoundingClientRect();
		return (
			event.clientX < bounds.left ||
			event.clientX > bounds.right ||
			event.clientY < bounds.top ||
			event.clientY > bounds.bottom
		);
	};
	return createPortal(
		<OffcanvasContext.Provider value={{ titleId, descriptionId, setTitle, setDescription }}>
			<dialog
				{...props}
				ref={dialogRef}
				aria-modal="true"
				aria-labelledby={props["aria-labelledby"] ?? title}
				aria-describedby={props["aria-describedby"] ?? description}
				tabIndex={-1}
				className={clsx("ds-offcanvas", className)}
				data-side={side}
				data-size={size}
				onCancel={(event) => {
					event.preventDefault();
					event.stopPropagation();
					if (closeOnEsc) requestClose();
				}}
				onKeyDown={(event) => {
					onKeyDown?.(event);
					if (event.defaultPrevented || event.key !== "Escape" || !closeOnEsc) return;
					event.preventDefault();
					requestClose();
				}}
				onPointerDown={(event) => {
					onPointerDown?.(event);
					event.stopPropagation();
					backdropStartRef.current =
						!event.defaultPrevented &&
						event.target === event.currentTarget &&
						isOutside(event, event.currentTarget);
				}}
				onClick={(event) => {
					onClick?.(event);
					event.stopPropagation();
					if (
						!event.defaultPrevented &&
						closeOnOverlayClick &&
						backdropStartRef.current &&
						event.target === event.currentTarget &&
						isOutside(event, event.currentTarget)
					)
						requestClose();
					backdropStartRef.current = false;
				}}
			>
				{showCloseButton && (
					<div className="ds-offcanvas-close">
						<Button
							variant="text"
							size="sm"
							circle
							iconLeft={XIcon}
							aria-label={closeLabel}
							onClick={requestClose}
						/>
					</div>
				)}
				{children}
			</dialog>
		</OffcanvasContext.Provider>,
		document.body,
	);
}

export function OffcanvasHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div {...props} className={clsx("ds-offcanvas-header", className)} />;
}
export function OffcanvasBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div {...props} className={clsx("ds-offcanvas-body", className)} />;
}
export function OffcanvasFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div {...props} className={clsx("ds-offcanvas-footer", className)} />;
}
export function OffcanvasTitle({ id, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
	const context = useContext(OffcanvasContext);
	const resolvedId = id ?? context?.titleId;
	const register = context?.setTitle;
	useEffect(() => {
		register?.(resolvedId);
		return () => register?.(undefined);
	}, [register, resolvedId]);
	return <h2 {...props} id={resolvedId} className={clsx("ds-offcanvas-title", className)} />;
}
export function OffcanvasDescription({
	id,
	className,
	...props
}: HTMLAttributes<HTMLParagraphElement>) {
	const context = useContext(OffcanvasContext);
	const resolvedId = id ?? context?.descriptionId;
	const register = context?.setDescription;
	useEffect(() => {
		register?.(resolvedId);
		return () => register?.(undefined);
	}, [register, resolvedId]);
	return <p {...props} id={resolvedId} className={clsx("ds-offcanvas-description", className)} />;
}
