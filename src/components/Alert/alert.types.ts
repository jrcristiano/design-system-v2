import type { ReactNode } from "react";
import type { ChipVariant } from "../Chip/Chip.interface";
import type { IconWeight } from "@phosphor-icons/react";

export type AlertVariant = "success" | "warning" | "error" | "info";

export interface AlertAction {
	label: string;
	variant?: ChipVariant;
	iconWeight?: IconWeight;
	iconLeft?: React.ElementType<any>;
	iconRight?: React.ElementType<any>;
	onClick: () => void;
}

export interface AlertProps {
	/**
	 * Variante visual do alerta que define cor, ícone e hierarquia
	 */
	variant: AlertVariant;

	/**
	 * Título principal do alerta (obrigatório)
	 */
	title: string;

	/**
	 * Mensagem complementar opcional
	 */
	message?: string;

	/**
	 * Ícone customizado. Use `null` para remover o ícone padrão
	 * @default Ícone padrão baseado na variante
	 */
	icon?: ReactNode | null;

	/**
	 * Habilita botão de fechar (X)
	 * @default false
	 */
	dismissible?: boolean;

	/**
	 * Callback executado ao fechar o alerta
	 */
	onDismiss?: () => void;

	/**
	 * Botão de ação secundária
	 */
	action?: AlertAction;

	/**
	 * Classes Tailwind customizadas
	 */
	className?: string;
}
