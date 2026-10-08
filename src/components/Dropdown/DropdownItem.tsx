"use client";

import clsx from "clsx";
import type { ReactNode, MouseEvent, KeyboardEvent } from "react";
import { useCallback, useMemo } from "react";
import { useDropdown } from "./DropdownContext";
import { Checkbox } from "../Checkbox/Checkbox";

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
		(e: MouseEvent | KeyboardEvent) => {
			if (disabled) return;
			e.stopPropagation();
			onSelect?.(!checked);
			focusSearch?.();
		},
		[disabled, onSelect, checked, focusSearch],
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				handleSelect(e);
			}
		},
		[handleSelect],
	);

	// Render condicional após todos os hooks
	if (searchQuery && !labelText.includes(searchQuery)) return null;

	return (
		<button
			type="button"
			role={isCheckboxVariant ? "menuitemcheckbox" : "menuitem"}
			aria-checked={isCheckboxVariant ? checked : undefined}
			disabled={disabled}
			onClick={handleSelect}
			onKeyDown={handleKeyDown}
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
				<Checkbox
					checked={checked}
					disabled={disabled}
					onChange={(e) => e.stopPropagation()}
					label={undefined}
				/>
			)}

			{isCheckboxVariant && children && (
				<span className="select-none" style={fontStyle}>
					{children}
				</span>
			)}

			{showIcon && (
				<span className="flex items-center" style={{ fontSize: "var(--ds-font-size-16)" }}>
					{icon}
				</span>
			)}

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
