"use client";

import { useEffect, useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import { useSidebarFilter } from "./SidebarFilterContext";
import type { SidebarFilterHeaderProps } from "./SidebarFilter.interface";

export function SidebarFilterHeader({
	title = "Filtros",
	onClose,
}: Readonly<SidebarFilterHeaderProps>) {
	const { close } = useSidebarFilter();
	const [headerId, setHeaderId] = useState<string>("");

	useEffect(() => {
		// Seleciona o elemento como HTMLElement para acessar a propriedade .dataset
		const dialog = document.querySelector<HTMLElement>('[role="dialog"]');

		// O SonarQube prefere .dataset.headerId em vez de getAttribute('data-header-id')
		// O mapeamento é automático: data-header-id -> headerId
		const id = dialog?.dataset.headerId;

		if (id) {
			setHeaderId(id);
		}
	}, []);

	const handleClose = () => {
		onClose?.();
		close();
	};

	return (
		<div
			className="px-4 flex items-center justify-between border-b border-[var(--ds-color-neutral-50)]"
			style={{
				height: "64.8px",
				borderBottomWidth: "0.80px",
				flexShrink: 0,
			}}
		>
			<h2
				id={headerId}
				style={{
					fontSize: "var(--ds-font-size-20)",
					fontWeight: "var(--ds-font-weight-medium)",
					lineHeight: "30px",
					color: "var(--ds-color-neutral-10)",
				}}
			>
				{title}
			</h2>
			<button
				type="button"
				onClick={handleClose}
				className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--ds-color-blue-10)] rounded"
				aria-label="Fechar filtros"
			>
				<XIcon size={20} weight="bold" color="var(--ds-color-neutral-10)" />
			</button>
		</div>
	);
}
