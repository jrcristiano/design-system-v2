import type { ReactNode } from "react";
import type { ChipVariant } from "../Chip/Chip.interface";
import type { IconWeight } from "@phosphor-icons/react";
import type { AlertInterface } from "./Alert.interface";

export type AlertVariant = "success" | "warning" | "error" | "info";

export interface AlertAction {
	label: string;
	variant?: ChipVariant;
	iconWeight?: IconWeight;
	iconLeft?: React.ElementType;
	iconRight?: React.ElementType;
	onClick: () => void;
}

export interface AlertProps extends Omit<AlertInterface, "action" | "icon"> {
	/**
	 * Variante visual do alerta que define cor, ícone e hierarquia
	 */
	variant: AlertVariant;

	/**
	 * Título principal do alerta (obrigatório)
	 */
	title?: string;

	/**
	 * Mensagem complementar opcional
	 */
	message?: string;

	/**
	 * Ícone customizado. Use `null` para remover o ícone padrão
	 * @default Ícone padrão baseado na variante
	 */
	icon?: ReactNode | null;
	hideIcon?: boolean;

	/**
	 * Habilita botão de fechar (X)
	 * @default false
	 */
	dismissible?: boolean;

	/**
	 * Callback executado ao fechar o alerta
	 */
	onDismiss?: () => void;
	/** @deprecated Use `dismissible` and `onDismiss`. */
	closable?: boolean;
	/** @deprecated Use `onDismiss`. */
	onClose?: () => void;

	/**
	 * Botão de ação secundária
	 */
	action?: AlertAction | ReactNode;

	/**
	 * Classes Tailwind customizadas
	 */
	className?: string;
}
