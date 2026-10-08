import { memo, useCallback, useMemo, type ReactNode } from "react";
import { WarningIcon, XCircleIcon, InfoIcon, CheckCircleIcon, XIcon } from "@phosphor-icons/react";
import type { AlertProps, AlertVariant } from "./alert.types";
import { Chip } from "../Chip/Chip";

/**
 * Configuração de estilos por variante
 */
const variantStyles: Record<
	AlertVariant,
	{
		bg: string;
		border: string;
		text: string;
		icon: string;
		action: string;
	}
> = {
	success: {
		bg: "bg-[var(--ds-color-green-30)]",
		border: "border-[var(--ds-color-green-30)]",
		text: "text-[var(--ds-surface)]",
		icon: "text-[var(--ds-surface)]",
		action: "text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100",
	},
	warning: {
		bg: "bg-[var(--ds-color-orange-40)]",
		border: "border-[var(--ds-color-orange-40)]",
		text: "text-[var(--ds-surface)]",
		icon: "text-[var(--ds-surface)]",
		action: "text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100",
	},
	error: {
		bg: "bg-[var(--ds-color-red-40)]",
		border: "border-[var(--ds-color-red-40)]",
		text: "text-[var(--ds-surface)]",
		icon: "text-[var(--ds-surface)]",
		action: "text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100",
	},
	info: {
		bg: "bg-[var(--ds-color-sky-30)]",
		border: "border-[var(--ds-color-sky-30)]",
		text: "text-[var(--ds-surface)]",
		icon: "text-[var(--ds-surface)]",
		action: "text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100",
	},
};

/**
 * Ícones padrão por variante
 */
const defaultIcons: Record<AlertVariant, ReactNode> = {
	success: <CheckCircleIcon size={20} weight="light" aria-hidden="true" />,
	warning: <WarningIcon size={20} weight="light" aria-hidden="true" />,
	error: <XCircleIcon size={20} weight="light" aria-hidden="true" />,
	info: <InfoIcon size={20} weight="light" aria-hidden="true" />,
};

/**
 * Handler acessível de teclado
 * Extraído para evitar recriação por render
 */
const handleKeyboardActivation = (event: React.KeyboardEvent, callback: () => void): void => {
	if (event.key === "Enter" || event.key === " ") {
		event.preventDefault();
		callback();
	}
};

/**
 * Componente Alert
 */
export const Alert = memo<AlertProps>(
	({ variant, title, message, icon, dismissible = false, onDismiss, action, className = "" }) => {
		const styles = variantStyles[variant];
		const isError = variant === "error";

		/**
		 * Resolve ícone com tipagem correta para React
		 */
		const resolvedIcon = useMemo<ReactNode>(() => {
			if (icon === null) {
				return null;
			}

			if (icon !== undefined) {
				return icon;
			}

			return defaultIcons[variant];
		}, [icon, variant]);

		/**
		 * Callback estável para dismiss
		 */
		const handleDismiss = useCallback((): void => {
			if (onDismiss) {
				onDismiss();
			}
		}, [onDismiss]);

		return (
			<section
				role={isError ? "alert" : "status"}
				aria-live={isError ? undefined : "polite"}
				className={`
					${styles.bg}
					${styles.border}
					rounded-xl
					border
					${message ? "p-3 md:p-4" : "px-3 py-1"}
					${className}
				`}
			>
				<div className="flex items-center gap-3">
					{/* Ícone */}
					{resolvedIcon && <div className={`flex-shrink-0 ${styles.icon}`}>{resolvedIcon}</div>}

					{/* Conteúdo */}
					<div className="flex-1 min-w-0">
						<h3 className={`text-sm ${styles.text}`}>{title}</h3>

						{message && <p className={`text-sm mt-1 ${styles.text} opacity-90`}>{message}</p>}
					</div>

					{/* Action */}
					{action && (
						<Chip
							iconLeft={action.iconLeft}
							iconRight={action.iconRight}
							onClick={action.onClick}
							variant={action.variant || "primary"}
							onKeyDown={(e) => handleKeyboardActivation(e, action.onClick)}
						>
							{action.label}
						</Chip>
					)}

					{/* Dismissible */}
					{dismissible && onDismiss && (
						<button
							type="button"
							onClick={handleDismiss}
							onKeyDown={(e) => handleKeyboardActivation(e, handleDismiss)}
							aria-label="Fechar alerta"
							className={`
								cursor-pointer
								flex-shrink-0
								${styles.icon}
								hover:opacity-70
								focus:outline-none
								focus:ring-current
								rounded
								transition-opacity
							`}
						>
							<XIcon size={20} weight="bold" aria-hidden="true" />
						</button>
					)}
				</div>
			</section>
		);
	},
);

Alert.displayName = "Alert";
