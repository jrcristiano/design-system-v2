export interface IconProps {
	/** Nome do ícone a ser renderizado */
	name: string;
	/** Tamanho do ícone */
	size?: number;
	/** Cor do ícone */
	color?: string;
	/** Peso do ícone */
	weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
	/** ClassName adicional */
	className?: string;
}

export type { IconProps as default };
