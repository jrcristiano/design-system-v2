"use client";

import type { SidebarFilterContentProps } from "./SidebarFilter.interface";
import styles from "./SidebarFilterContent.module.css";
import clsx from "clsx";
import "./SidebarFilterContent.inline.css";

export function SidebarFilterContent({ children }: Readonly<SidebarFilterContentProps>) {
	return (
		<div
			className={clsx(
				clsx("flex-1 px-4 pt-4", styles.customScroll),
				"sidebarfiltercontent-inline-1",
			)}
		>
			<div className="flex flex-col pb-4 sidebarfiltercontent-inline-2">{children}</div>
		</div>
	);
}
