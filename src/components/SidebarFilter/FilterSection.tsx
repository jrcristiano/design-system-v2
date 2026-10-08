"use client";

import type { FilterSectionProps } from "./SidebarFilter.interface";
import "./FilterSection.inline.css";

export function FilterSection({ title, required = false, children }: Readonly<FilterSectionProps>) {
	return (
		<div className="w-full flex flex-col gap-2">
			<div className="flex items-center gap-1">
				<span className="filtersection-inline-1">{title}</span>
				{required && <span className="filtersection-inline-2">*</span>}
			</div>
			<div className="flex flex-col gap-2">{children}</div>
		</div>
	);
}
