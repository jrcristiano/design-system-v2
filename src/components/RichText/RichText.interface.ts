export interface RichTextProps {
	/**
	 * Label do campo
	 */
	label?: string;

	/**
	 * Indica se o campo é obrigatório
	 * @default false
	 */
	required?: boolean;

	/**
	 * Placeholder quando o campo está vazio
	 */
	placeholder?: string;

	/**
	 * Conteúdo inicial do editor
	 */
	value?: string;

	/**
	 * Callback chamado quando o conteúdo muda
	 */
	onChange?: (content: string) => void;

	/**
	 * Mensagem de erro a ser exibida
	 */
	error?: string;

	/**
	 * Indica se o campo está desabilitado
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Número mínimo de caracteres
	 */
	minLength?: number;

	/**
	 * Número máximo de caracteres
	 * @default 1000
	 */
	maxLength?: number;

	/**
	 * Nome do campo para formulários
	 */
	name?: string;

	/**
	 * Classe CSS adicional
	 */
	className?: string;
}
