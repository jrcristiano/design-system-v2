import React from "react";
import * as PhosphorIcons from "@phosphor-icons/react";
import type { IconProps } from "./Icon.interface";

export const Icon: React.FC<IconProps> = ({
	name,
	size = 24,
	color = "currentColor",
	weight = "regular",
	className = "",
}) => {
	// Converte o nome do ícone para o formato do Phosphor Icons
	const IconComponent = (PhosphorIcons as any)[name];

	if (!IconComponent) {
		console.warn(`Ícone "${name}" não encontrado`);
		return null;
	}

	return <IconComponent size={size} color={color} weight={weight} className={className} />;
};
