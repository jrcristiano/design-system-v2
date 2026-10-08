"use client";

import { cloneElement, isValidElement } from "react";
import { useSidebarFilter } from "./SidebarFilterContext";
import type { SidebarFilterTriggerProps } from "./SidebarFilter.interface";

export function SidebarFilterTrigger({ children }: Readonly<SidebarFilterTriggerProps>) {
	const { toggle } = useSidebarFilter();

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			toggle();
		}
	};

	if (!isValidElement(children)) {
		return (
			<button
				type="button"
				onClick={toggle}
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
			toggle();
		},
		onKeyDown: (e: React.KeyboardEvent) => {
			childProps.onKeyDown?.(e);
			handleKeyDown(e);
		},
	};

	return cloneElement(children, nextProps);
}
