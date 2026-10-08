export type SkeletonVariant = "line" | "rectangle" | "circle";
export type SkeletonAnimation = "shimmer" | "pulse" | "none";

// Usando HTMLOutputElement para refletir o elemento semântico correto (<output>)
export interface ISkeletonProps extends React.OutputHTMLAttributes<HTMLOutputElement> {
	/**
	 * Variante visual do skeleton (linha, retângulo ou círculo)
	 * @default "line"
	 */
	variant?: SkeletonVariant;

	/**
	 * Largura do skeleton
	 * Pode ser número (px) ou string (%, rem, etc)
	 */
	width?: number | string;

	/**
	 * Altura do skeleton
	 * Pode ser número (px) ou string (%, rem, etc)
	 */
	height?: number | string;

	/**
	 * Tipo de animação (shimmer para efeito wave, pulse ou nenhuma)
	 * @default "shimmer"
	 */
	animation?: SkeletonAnimation;

	/**
	 * Quantidade de linhas (para variant "line")
	 * @default 1
	 */
	lines?: number;

	/**
	 * Espaçamento entre linhas quando lines > 1
	 * @default "0.5rem"
	 */
	gap?: string;

	/**
	 * Classes CSS adicionais
	 */
	className?: string;

	/**
	 * Label para leitores de tela
	 * @default "Carregando..."
	 */
	ariaLabel?: string;
}
