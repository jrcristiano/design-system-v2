"use client";

import type { FilterSectionProps } from "./SidebarFilter.interface";

export function FilterSection({ title, required = false, children }: Readonly<FilterSectionProps>) {
	return (
		<div className="w-full flex flex-col gap-2">
			<div className="flex items-center gap-1">
				<span
					style={{
						fontSize: "var(--ds-font-size-14)",
						fontWeight: "var(--ds-font-weight-medium)",
						lineHeight: "21px",
						color: "var(--ds-color-neutral-10)",
					}}
				>
					{title}
				</span>
				{required && (
					<span
						style={{
							fontSize: "var(--ds-font-size-14)",
							fontWeight: "var(--ds-font-weight-medium)",
							lineHeight: "20px",
							color: "var(--ds-color-red-40)",
						}}
					>
						*
					</span>
				)}
			</div>
			<div className="flex flex-col gap-2">{children}</div>
		</div>
	);
}
