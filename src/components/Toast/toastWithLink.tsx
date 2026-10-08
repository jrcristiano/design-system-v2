import React from "react";
import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";
import {
	InfoIcon,
	CheckCircleIcon,
	WarningCircleIcon,
	WarningOctagonIcon,
} from "@phosphor-icons/react";

interface ToastLinkConfig {
	text: string;
	href: string;
}

// ---------------------------------------------------------------------------
// Ícones padrão por variante (brancos e weight light)
// ---------------------------------------------------------------------------

const ICONS = {
	info: <InfoIcon size={20} color="white" weight="light" />,
	success: <CheckCircleIcon size={20} color="white" weight="light" />,
	warning: <WarningCircleIcon size={20} color="white" weight="light" />,
	error: <WarningOctagonIcon size={20} color="white" weight="light" />,
};

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

const renderLink = (linkConfig: ToastLinkConfig) => (
	<a
		href={linkConfig.href}
		target="_blank"
		rel="noopener noreferrer"
		style={{
			color: "#fff",
			fontStyle: "italic",
			textDecoration: "underline",
			whiteSpace: "nowrap",
		}}
		className="hover:opacity-80 transition-opacity"
	>
		{linkConfig.text}
	</a>
);

// ---------------------------------------------------------------------------
// WithLink
// ---------------------------------------------------------------------------

/**
 * Renderiza um Toast com um link branco, itálico e com underline
 * @param message - Mensagem principal do toast
 * @param linkConfig - Configuração do link (text e href)
 * @param options - Opções do toast (variant, position, etc)
 * @example
 * toastWithLink("Para saber mais", { text: "clique aqui", href: "https://example.com" })
 */
export const toastWithLink = (
	message: string | React.ReactNode,
	linkConfig?: ToastLinkConfig,
	options?: ToastOptions,
) => {
	const content = (
		<div className="flex items-center gap-3">
			<div className="flex-1">{message}</div>
			{linkConfig && renderLink(linkConfig)}
		</div>
	);

	return toast(content, options);
};

/**
 * Renderiza um Toast de sucesso com um link branco, itálico e com underline
 */
export const toastSuccessWithLink = (
	message: string | React.ReactNode,
	linkConfig?: ToastLinkConfig,
	options?: ToastOptions,
) => {
	const content = (
		<div className="flex items-center gap-3">
			<div className="flex-1">{message}</div>
			{linkConfig && renderLink(linkConfig)}
		</div>
	);

	return toast.success(content, { icon: ICONS.success, ...options });
};

/**
 * Renderiza um Toast de erro com um link branco, itálico e com underline
 */
export const toastErrorWithLink = (
	message: string | React.ReactNode,
	linkConfig?: ToastLinkConfig,
	options?: ToastOptions,
) => {
	const content = (
		<div className="flex items-center gap-3">
			<div className="flex-1">{message}</div>
			{linkConfig && renderLink(linkConfig)}
		</div>
	);

	return toast.error(content, { icon: ICONS.error, ...options });
};

/**
 * Renderiza um Toast de aviso com um link branco, itálico e com underline
 */
export const toastWarningWithLink = (
	message: string | React.ReactNode,
	linkConfig?: ToastLinkConfig,
	options?: ToastOptions,
) => {
	const content = (
		<div className="flex items-center gap-3">
			<div className="flex-1">{message}</div>
			{linkConfig && renderLink(linkConfig)}
		</div>
	);

	return toast.warning(content, { icon: ICONS.warning, ...options });
};

/**
 * Renderiza um Toast de informação com um link branco, itálico e com underline
 */
export const toastInfoWithLink = (
	message: string | React.ReactNode,
	linkConfig?: ToastLinkConfig,
	options?: ToastOptions,
) => {
	const content = (
		<div className="flex items-center gap-3">
			<div className="flex-1">{message}</div>
			{linkConfig && renderLink(linkConfig)}
		</div>
	);

	return toast.info(content, { icon: ICONS.info, ...options });
};
