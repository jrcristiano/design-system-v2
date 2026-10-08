"use client";

import clsx from "clsx";
import type { ReactNode, MouseEvent } from "react";
import { useCallback, useMemo } from "react";
import { useDropdown } from "./DropdownContext";
import "./DropdownItem.inline.css";

export type DropdownItemVariant =
	| "default"
	| "checkbox"
	| "icon"
	| "shortcut"
	| "icon-shortcut"
	| "checkbox-shortcut"
	| "checkbox-only"
	| "label-only";

interface DropdownItemProps {
	disabled?: boolean;
	checked?: boolean;
	icon?: ReactNode;
	shortcut?: string;
	children?: ReactNode;
	onSelect?: (val?: boolean) => void;
	variant?: DropdownItemVariant;
}

export function DropdownItem({
	disabled = false,
	checked = false,
	icon,
	shortcut,
	children,
	onSelect,
	variant = "default",
}: Readonly<DropdownItemProps>) {
	const { searchQuery, focusSearch } = useDropdown();

	// Todos os hooks antes do return condicional
	const labelText = useMemo(
		() => (typeof children === "string" ? children.toLowerCase() : ""),
		[children],
	);

	const isCheckboxVariant = useMemo(
		() => ["checkbox", "checkbox-shortcut", "checkbox-only"].includes(variant),
		[variant],
	);

	const showIcon = useMemo(
		() => icon !== undefined && variant !== "checkbox-only",
		[icon, variant],
	);
	const showShortcut = useMemo(
		() => ["shortcut", "icon-shortcut", "checkbox-shortcut"].includes(variant),
		[variant],
	);

	const fontStyle = useMemo(
		() => ({
			fontSize: "var(--ds-font-size-14)",
			fontWeight: "var(--ds-font-weight-regular)" as const,
			color: disabled ? "var(--ds-color-neutral-40)" : undefined,
			backgroundColor: disabled ? "var(--ds-color-neutral-80)" : undefined,
		}),
		[disabled],
	);

	const handleSelect = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			if (disabled) return;
			e.stopPropagation();
			onSelect?.(!checked);
			focusSearch?.();
		},
		[disabled, onSelect, checked, focusSearch],
	);

	// Render condicional após todos os hooks
	if (searchQuery && !labelText.includes(searchQuery)) return null;

	return (
		<button
			type="button"
			role={isCheckboxVariant ? "menuitemcheckbox" : "menuitem"}
			aria-checked={isCheckboxVariant ? checked : undefined}
			tabIndex={-1}
			disabled={disabled}
			onClick={handleSelect}
			className={clsx(
				"px-2 py-2 w-full flex items-center gap-3 rounded-md",
				"text-[var(--ds-color-neutral-10)] text-left bg-transparent border-none",
				"focus-visible:ring-2 focus-visible:ring-[var(--ds-color-blue-10)] focus-visible:outline-none",
				!disabled && "cursor-pointer hover:bg-[var(--ds-color-neutral-90)]",
				disabled && "opacity-50 cursor-not-allowed",
			)}
			style={fontStyle}
		>
			{isCheckboxVariant && (
				<span
					className="w-[44px] h-[44px] inline-flex justify-center items-center"
					aria-hidden="true"
				>
					<span
						className={clsx(
							"w-10 h-10 rounded-full relative inline-flex justify-center items-center transition-all duration-150 group",
							!disabled && "group-hover:bg-[var(--ds-color-neutral-90)]",
						)}
					>
						<span className="rounded-[6px] inline-flex justify-center items-center transition-all duration-150 relative">
							<span
								className={clsx(
									"rounded-[4px] border-[1px] transition-all duration-150 appearance-none relative flex items-center justify-center w-5 h-5",
									checked
										? disabled
											? "bg-[var(--ds-color-neutral-80)] border-[var(--ds-color-neutral-80)]"
											: "bg-[var(--ds-color-blue-40)] border-[var(--ds-color-blue-40)]"
										: disabled
											? "bg-transparent border-[var(--ds-color-neutral-80)]"
											: "bg-transparent border-[var(--ds-color-neutral-50)]",
								)}
							>
								{checked && (
									<svg
										className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
										width="10"
										height="8"
										viewBox="0 0 10 8"
										fill="none"
									>
										<path
											d="M1.25 4L3.75 6.5L8.75 1.5"
											stroke="var(--ds-color-neutral-white)"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								)}
							</span>
						</span>
					</span>
				</span>
			)}

			{isCheckboxVariant && children && (
				<span className="select-none" style={fontStyle}>
					{children}
				</span>
			)}

			{showIcon && <span className="flex items-center dropdownitem-inline-1">{icon}</span>}

			{!isCheckboxVariant && children && <span style={fontStyle}>{children}</span>}

			{showShortcut && shortcut && (
				<span
					className={clsx(
						"ml-auto p-1 rounded-[var(--ds-radius-md)] border text-xs",
						disabled
							? "text-[var(--ds-color-neutral-40)] border-[var(--ds-color-neutral-50)]"
							: "text-[var(--ds-color-sky-20)] border-[var(--ds-color-neutral-50)]",
					)}
				>
					{shortcut}
				</span>
			)}
		</button>
	);
}
