"use client";

import type { SidebarFilterContentProps } from "./SidebarFilter.interface";
import styles from "./SidebarFilterContent.module.css";
import clsx from "clsx";

export function SidebarFilterContent({ children }: Readonly<SidebarFilterContentProps>) {
	return (
		<div
			className={clsx("flex-1 px-4 pt-4", styles.customScroll)}
			style={{
				minHeight: 0,
				overflowY: "auto",
			}}
		>
			<div className="flex flex-col pb-4" style={{ gap: "12px" }}>
				{children}
			</div>
		</div>
	);
}
