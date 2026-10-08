import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { CircleNotchIcon, XIcon } from "@phosphor-icons/react";
import type { IModalAction, IModalProps } from "./Modal.interface";
import type { ModalVariant } from "./Modal.type";
import type { Size } from "../../types/Commons.type";
import { Button } from "../Button/Button";
import { acquireBodyScrollLock } from "../shared/bodyScrollLock";
import "./Modal.css";
import "./Modal.inline.css";

const focusableSelector =
	'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

const sizeStyles: Record<Size, string> = {
	sm: "max-w-[var(--ds-breakpoint-sm)]",
	md: "max-w-[var(--ds-breakpoint-md)]",
	lg: "max-w-[var(--ds-breakpoint-lg)]",
};

const variantAccentStyles: Record<ModalVariant, string> = {
	default: "text-[var(--ds-color-blue-50)]",
	confirmation: "text-[var(--ds-color-green-30)]",
	warning: "text-[var(--ds-color-orange-50)]",
	destructive: "text-[var(--ds-color-red-50)]",
	fullscreen: "text-[var(--ds-color-neutral-10)]",
	form: "text-[var(--ds-color-blue-50)]",
};

const variantIconBgStyles: Record<ModalVariant, string> = {
	default: "bg-[var(--ds-color-blue-95)]",
	confirmation: "bg-[var(--ds-color-green-95)]",
	warning: "bg-[var(--ds-color-orange-95)]",
	destructive: "bg-[var(--ds-color-red-95)]",
	fullscreen: "bg-[var(--ds-color-neutral-95)]",
	form: "bg-[var(--ds-color-blue-95)]",
};

export const Modal: React.FC<IModalProps> = React.memo(
	({
		isOpen,
		onOpenChange,
		title,
		description,
		ariaLabel,
		size = "md",
		variant = "default",
		verticalPosition = "center",
		state = "default",
		actions,
		icon,
		closeOnOverlayClick = true,
		closeOnEsc = true,
		showCloseButton = true,
		isContentScrollable = false,
		isTitleIconColorSynced = false,
		initialFocusRef,
		returnFocusRef,
		loadingLabel,
		className,
		children,
		...props
	}) => {
		const dialogRef = useRef<HTMLDialogElement>(null);
		const lastActiveRef = useRef<HTMLElement | null>(null);
		const isNativeModalRef = useRef(false);
		const isBlocking = state === "loading";
		const titleId = React.useId();
		const descriptionId = React.useId();

		const handleClose = useCallback(() => {
			onOpenChange?.(false);
		}, [onOpenChange]);

		const handleOverlayClick = useCallback(
			(event: React.MouseEvent<HTMLElement>) => {
				if (isBlocking) return;
				if (!closeOnOverlayClick) return;
				if (event.target === event.currentTarget) {
					handleClose();
				}
			},
			[closeOnOverlayClick, handleClose, isBlocking],
		);

		const trapFocus = useCallback(
			(event: { key: string; shiftKey: boolean; preventDefault: () => void }) => {
				if (event.key !== "Tab") return;
				const container = dialogRef.current;
				if (!container) return;
				const focusable = Array.from(
					container.querySelectorAll<HTMLElement>(focusableSelector),
				).filter((el) => !el.hasAttribute("disabled"));
				if (focusable.length === 0) {
					event.preventDefault();
					return;
				}
				const first = focusable[0];
				const last = focusable.at(-1);
				const active = document.activeElement as HTMLElement | null;
				if (event.shiftKey) {
					if (active === first && last) {
						event.preventDefault();
						last.focus();
					}
					return;
				}
				if (active === last && last) {
					event.preventDefault();
					first.focus();
				}
			},
			[],
		);

		const handleDocumentKeyDown = useCallback(
			(event: KeyboardEvent) => {
				if (event.key === "Escape" && isNativeModalRef.current) return;
				if (event.key === "Escape" && closeOnEsc && !isBlocking) {
					event.preventDefault();
					event.stopPropagation();
					handleClose();
					return;
				}
				trapFocus(event);
			},
			[closeOnEsc, handleClose, isBlocking, trapFocus],
		);

		useEffect(() => {
			if (!isOpen) return undefined;
			const dialog = dialogRef.current;
			if (!dialog) return undefined;

			lastActiveRef.current = document.activeElement as HTMLElement | null;
			const returnFocusNode = returnFocusRef?.current ?? lastActiveRef.current;
			let openedNatively = false;
			try {
				if (!dialog.open && typeof dialog.showModal === "function") {
					dialog.showModal();
					openedNatively = true;
				}
			} catch {
				// Keep the existing focus trap available in DOMs without dialog support.
			}
			if (!dialog.open) dialog.setAttribute("open", "");
			isNativeModalRef.current = openedNatively;

			const focusTarget =
				initialFocusRef?.current ?? dialog.querySelector<HTMLElement>(focusableSelector);
			const fallback = dialog;
			(focusTarget ?? fallback)?.focus();
			const releaseBodyScrollLock = acquireBodyScrollLock();
			document.addEventListener("keydown", handleDocumentKeyDown);
			return () => {
				document.removeEventListener("keydown", handleDocumentKeyDown);
				if (dialog.open) {
					if (openedNatively) dialog.close();
					else dialog.removeAttribute("open");
				}
				isNativeModalRef.current = false;
				releaseBodyScrollLock();
				returnFocusNode?.focus();
			};
		}, [isOpen, initialFocusRef, returnFocusRef, handleDocumentKeyDown]);

		const handleCancel = useCallback(
			(event: React.SyntheticEvent<HTMLDialogElement>) => {
				event.preventDefault();
				if (closeOnEsc && !isBlocking) handleClose();
			},
			[closeOnEsc, handleClose, isBlocking],
		);

		const handleNativeBackdropClick = useCallback(
			(event: React.MouseEvent<HTMLDialogElement>) => {
				if (event.target !== event.currentTarget || !isNativeModalRef.current) return;
				const bounds = event.currentTarget.getBoundingClientRect();
				const outside =
					event.clientX < bounds.left ||
					event.clientX > bounds.right ||
					event.clientY < bounds.top ||
					event.clientY > bounds.bottom;
				if (outside) handleClose();
			},
			[handleClose],
		);

		const modalClasses = useMemo(() => {
			const base =
				"relative w-full bg-[var(--ds-surface)] text-[var(--ds-color-neutral-10)] shadow-[var(--ds-shadow-effect-6)]";
			const shape = "rounded-[var(--ds-radius-xl)]";
			const layout = "flex flex-col gap-[var(--ds-pad-app)] p-[var(--ds-pad-modal)]";
			const sizing = sizeStyles[size];
			if (variant === "fullscreen") {
				return clsx(
					base,
					"rounded-none h-full max-h-full max-w-none",
					"sm:rounded-[var(--ds-radius-lg)] sm:h-auto sm:max-h-[calc(100vh-2*var(--ds-pad-modal))]",
					layout,
					className,
				);
			}
			return clsx(base, shape, layout, sizing, className);
		}, [className, size, variant]);

		const headerClasses = useMemo(
			() => "flex items-start justify-between gap-[var(--ds-pad-card)]",
			[],
		);

		const titleClasses = useMemo(
			() =>
				clsx(
					"leading-[var(--ds-line-30)] font-[var(--ds-font-weight-semibold)]",
					isTitleIconColorSynced
						? variantAccentStyles[variant]
						: "text-[var(--ds-color-neutral-10)]",
				),
			[isTitleIconColorSynced, variant],
		);

		const descriptionClasses = useMemo(() => "text-[var(--ds-color-neutral-40)]", []);

		const contentClasses = useMemo(
			() =>
				clsx(
					"flex-1 text-[var(--ds-color-neutral-10)]",
					isContentScrollable && "min-h-0 overflow-auto",
				),
			[isContentScrollable],
		);

		const footerClasses = useMemo(
			() =>
				clsx("flex flex-col-reverse sm:flex-row sm:justify-end", "gap-[var(--ds-pad-button-sm-x)]"),
			[],
		);

		const statusAreaClasses = useMemo(
			() =>
				clsx(
					"flex items-center justify-end gap-[var(--ds-pad-button-sm-x)]",
					"text-body-4 text-[var(--ds-color-neutral-40)]",
				),
			[],
		);

		const isActionConfig = useCallback(
			(action?: IModalAction | React.ReactNode): action is IModalAction =>
				!!action &&
				!React.isValidElement(action) &&
				typeof action === "object" &&
				"label" in action,
			[],
		);

		const isActionLoading = useMemo(() => {
			const hasLoading = (action?: IModalAction | React.ReactNode) =>
				isActionConfig(action) ? Boolean(action.isLoading) : false;
			return hasLoading(actions?.primary) || hasLoading(actions?.secondary);
		}, [actions, isActionConfig]);

		const renderAction = useCallback(
			(action?: IModalAction | React.ReactNode) => {
				if (!action) return null;
				if (React.isValidElement(action)) return action;
				if (!isActionConfig(action)) return action;
				const {
					label,
					onClick,
					variant: actionVariant,
					size: actionSize,
					disabled,
					isLoading,
					iconLeft,
					iconRight,
					iconWeight,
					type,
				} = action;
				return (
					<Button
						variant={actionVariant}
						size={actionSize}
						disabled={disabled || isBlocking || isActionLoading}
						isLoading={isLoading}
						iconLeft={iconLeft}
						iconRight={iconRight}
						iconWeight={iconWeight}
						onClick={onClick}
						type={type}
					>
						{label}
					</Button>
				);
			},
			[isActionConfig, isActionLoading, isBlocking],
		);

		const labelledBy = title ? titleId : undefined;
		const describedBy = description ? descriptionId : undefined;
		const shouldRenderActions = Boolean(actions?.primary) || Boolean(actions?.secondary);
		const shouldRenderFooter = shouldRenderActions || state === "loading";
		const portalTarget = typeof document === "undefined" ? null : document.body;
		if (portalTarget && isOpen) {
			return createPortal(
				<div className="fixed inset-0 z-[var(--ds-z-modal)] flex items-center justify-center p-[var(--ds-pad-modal)]">
					<button
						type="button"
						aria-hidden="true"
						tabIndex={-1}
						className="absolute inset-0 modal-inline-1"

						onClick={handleOverlayClick}
						onKeyDown={(event) => {
							if (event.key === "Enter" || event.key === " ") {
								event.preventDefault();
								handleOverlayClick(event as unknown as React.MouseEvent<HTMLButtonElement>);
							}
						}}
					/>
					<dialog
						ref={dialogRef}
						aria-modal="true"
						aria-labelledby={labelledBy}
						aria-describedby={describedBy}
						aria-label={labelledBy ? undefined : ariaLabel}
						aria-busy={state === "loading"}
						data-state={state}
						data-variant={variant}
						tabIndex={-1}
						className={clsx("modal-dialog", `modal-dialog--${verticalPosition}`, modalClasses)}
						{...props}
						open={false}
						onCancel={handleCancel}
						onClick={handleNativeBackdropClick}
					>
						<div className={headerClasses}>
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-[var(--ds-pad-card)]">
									{icon && (
										<div
											className={clsx(
												"flex h-10 w-10 items-center justify-center rounded-full",
												variantIconBgStyles[variant],
												variantAccentStyles[variant],
											)}
										>
											{icon}
										</div>
									)}
									{title && (
										<h2 id={titleId} className={clsx(titleClasses, "modal-inline-2")}>
											{title}
										</h2>
									)}
								</div>
								{description && (
									<p id={descriptionId} className={descriptionClasses}>
										{description}
									</p>
								)}
							</div>
							{showCloseButton && (
								<Button
									variant="text"
									size="sm"
									circle
									iconLeft={XIcon}
									onClick={handleClose}
									disabled={isBlocking}
									aria-label="Fechar modal"
								/>
							)}
						</div>

						{children ? <div className={contentClasses}>{children}</div> : null}

						{shouldRenderFooter && (
							<div className={footerClasses}>
								{state === "loading" ? (
									<div className={statusAreaClasses}>
										<CircleNotchIcon size={18} weight="bold" className="animate-spin" />
										{loadingLabel && <span>{loadingLabel}</span>}
									</div>
								) : (
									<>
										{renderAction(actions?.secondary)}
										{renderAction(actions?.primary)}
									</>
								)}
							</div>
						)}
					</dialog>
				</div>,
				portalTarget,
			);
		}

		return null;
	},
);

Modal.displayName = "Modal";
