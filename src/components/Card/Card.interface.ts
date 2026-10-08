import type React from "react";

export type CardVariant = "simple" | "type1" | "type2";

export interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Variante do card
	 * @default "simple"
	 */
	variant?: CardVariant;

	/**
	 * Título principal do card
	 */
	title: string;
}

export interface SimpleCardProps extends BaseCardProps {
	variant: "simple";

	/**
	 * Label exibido abaixo do título
	 */
	label: string;

	/**
	 * Label do chip exibido ao lado do título (opcional)
	 */
	chipLabel?: string;

	/**
	 * Exibe a barra colorida na lateral esquerda
	 * @default true
	 */
	showLeftBorder?: boolean;

	/**
	 * Cor da barra lateral esquerda (CSS color value)
	 * @default "var(--ds-color-blue-40, #017DA2)"
	 */
	leftBorderColor?: string;
}

export interface ComplexCardProps extends BaseCardProps {
	variant: "type1" | "type2";

	/**
	 * Label do chip exibido ao lado do título
	 */
	chipLabel: string;

	/**
	 * Subtítulo do card
	 */
	subtitle: string;

	/**
	 * Valor do progresso (0-100)
	 */
	progress: number;

	/**
	 * Ícone da barra de progresso
	 */
	progressIcon?: React.ElementType;

	/**
	 * Texto do botão principal (type1 e type2)
	 */
	primaryButtonText: string;

	/**
	 * Callback do botão principal
	 */
	onPrimaryButtonClick?: () => void;

	/**
	 * Texto do botão secundário (apenas type2)
	 */
	secondaryButtonText?: string;

	/**
	 * Callback do botão secundário (apenas type2)
	 */
	onSecondaryButtonClick?: () => void;
}

export type ICardProps =
	| SimpleCardProps
	| ComplexCardProps
	| (BaseCardProps & {
			variant?: "simple";
			label: string;
			chipLabel?: string;
			showLeftBorder?: boolean;
			leftBorderColor?: string;
	  });
