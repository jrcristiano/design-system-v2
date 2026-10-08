"use client";

import { cloneElement, isValidElement } from "react";
import { useSidebarFilter } from "./SidebarFilterContext";
import type { SidebarFilterTriggerProps } from "./SidebarFilter.interface";

export function SidebarFilterTrigger({ children }: Readonly<SidebarFilterTriggerProps>) {
	const { toggle } = useSidebarFilter();

	const handleKeyDown = (e: React.KeyboardEvent) => {
		const target = e.target;
		if (
			(target instanceof HTMLElement &&
				(target.matches("button, a, input, select, textarea") || target.isContentEditable)) ||
			(e.key !== "Enter" && e.key !== " ")
		)
			return;
		e.preventDefault();
		toggle(e.currentTarget as HTMLElement);
	};

	if (!isValidElement(children)) {
		return (
			<button
				type="button"
				onClick={(event) => toggle(event.currentTarget)}
				onKeyDown={handleKeyDown}
				className="cursor-pointer"
				aria-label="Abrir filtros"
			>
				{children}
			</button>
		);
	}

	const childProps = children.props as {
		onClick?: (e: React.MouseEvent) => void;
		onKeyDown?: (e: React.KeyboardEvent) => void;
	};

	const nextProps = {
		onClick: (e: React.MouseEvent) => {
			childProps.onClick?.(e);
			toggle(e.currentTarget as HTMLElement);
		},
		onKeyDown: (e: React.KeyboardEvent) => {
			childProps.onKeyDown?.(e);
			handleKeyDown(e);
		},
	};

	return cloneElement(children, nextProps);
}
