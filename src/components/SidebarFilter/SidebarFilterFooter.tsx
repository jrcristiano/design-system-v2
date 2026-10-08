"use client";

import { useSidebarFilter } from "./SidebarFilterContext";
import { Button } from "../Button/Button";
import type { SidebarFilterFooterProps } from "./SidebarFilter.interface";

export function SidebarFilterFooter({
	onClear,
	onApply,
	clearLabel = "Limpar",
	applyLabel = "Aplicar",
}: Readonly<SidebarFilterFooterProps>) {
	const { clearFilters, applyFilters, filters } = useSidebarFilter();

	const handleClear = () => {
		clearFilters();
		onClear?.();
	};

	const handleApply = () => {
		applyFilters(filters);
		onApply?.();
	};

	return (
		<div
			className="px-4 flex items-center justify-end gap-4"
			style={{ height: "64.8px", flexShrink: 0 }}
		>
			<Button variant="text" size="md" onClick={handleClear}>
				{clearLabel}
			</Button>
			<Button variant="primary" size="md" onClick={handleApply}>
				{applyLabel}
			</Button>
		</div>
	);
}
