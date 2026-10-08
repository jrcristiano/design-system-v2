"use client";

import { useState, useEffect } from "react";
import { useDropdown } from "./DropdownContext";
import { Input } from "../Input/Input";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

export function DropdownSearch() {
	const { setSearchQuery } = useDropdown();
	const [value, setValue] = useState("");

	// Atualiza searchQuery sempre que value muda
	useEffect(() => {
		// Mantém lowercase para filtragem consistente
		setSearchQuery(value.toLowerCase());
	}, [value, setSearchQuery]);

	return (
		<div className="px-2 pb-2">
			<Input
				type="text"
				placeholder="Buscar"
				iconRight={<MagnifyingGlassIcon />}
				value={value}
				label={null} // label acessível para leitores de tela
				onChange={(e) => setValue(e.target.value)}
				size="sm"
			/>
		</div>
	);
}
