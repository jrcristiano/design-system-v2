import React from "react";
import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";
import { TOAST_ICONS, renderToastContent } from "./Toast.utils";

interface ToastLinkConfig {
	text: string;
	href: string;
}

// ---------------------------------------------------------------------------
// Ícones padrão por variante (brancos e weight light)
// ---------------------------------------------------------------------------

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
	const content = renderToastContent(message, linkConfig && renderLink(linkConfig));

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
	const content = renderToastContent(message, linkConfig && renderLink(linkConfig));

	return toast.success(content, { icon: TOAST_ICONS.success, ...options });
};

/**
 * Renderiza um Toast de erro com um link branco, itálico e com underline
 */
export const toastErrorWithLink = (
	message: string | React.ReactNode,
	linkConfig?: ToastLinkConfig,
	options?: ToastOptions,
) => {
	const content = renderToastContent(message, linkConfig && renderLink(linkConfig));

	return toast.error(content, { icon: TOAST_ICONS.error, ...options });
};

/**
 * Renderiza um Toast de aviso com um link branco, itálico e com underline
 */
export const toastWarningWithLink = (
	message: string | React.ReactNode,
	linkConfig?: ToastLinkConfig,
	options?: ToastOptions,
) => {
	const content = renderToastContent(message, linkConfig && renderLink(linkConfig));

	return toast.warning(content, { icon: TOAST_ICONS.warning, ...options });
};

/**
 * Renderiza um Toast de informação com um link branco, itálico e com underline
 */
export const toastInfoWithLink = (
	message: string | React.ReactNode,
	linkConfig?: ToastLinkConfig,
	options?: ToastOptions,
) => {
	const content = renderToastContent(message, linkConfig && renderLink(linkConfig));

	return toast.info(content, { icon: TOAST_ICONS.info, ...options });
};
