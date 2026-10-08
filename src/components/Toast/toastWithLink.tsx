import React from "react";
import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";
import { renderToastContent, renderToastLink, showToastVariant } from "./Toast.utils";
import type { ToastLinkConfig } from "./Toast.utils";

// ---------------------------------------------------------------------------
// WithLink
// ---------------------------------------------------------------------------

const createLinkedToastContent = (
	message: string | React.ReactNode,
	linkConfig?: ToastLinkConfig,
) =>
	renderToastContent(message, linkConfig && renderToastLink(linkConfig, { preventWrapping: true }));

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
	return toast(createLinkedToastContent(message, linkConfig), options);
};

/**
 * Renderiza um Toast de sucesso com um link branco, itálico e com underline
 */
export const toastSuccessWithLink = (
	message: string | React.ReactNode,
	linkConfig?: ToastLinkConfig,
	options?: ToastOptions,
) => {
	return showToastVariant("success", createLinkedToastContent(message, linkConfig), options);
};

/**
 * Renderiza um Toast de erro com um link branco, itálico e com underline
 */
export const toastErrorWithLink = (
	message: string | React.ReactNode,
	linkConfig?: ToastLinkConfig,
	options?: ToastOptions,
) => {
	return showToastVariant("error", createLinkedToastContent(message, linkConfig), options);
};

/**
 * Renderiza um Toast de aviso com um link branco, itálico e com underline
 */
export const toastWarningWithLink = (
	message: string | React.ReactNode,
	linkConfig?: ToastLinkConfig,
	options?: ToastOptions,
) => {
	return showToastVariant("warning", createLinkedToastContent(message, linkConfig), options);
};

/**
 * Renderiza um Toast de informação com um link branco, itálico e com underline
 */
export const toastInfoWithLink = (
	message: string | React.ReactNode,
	linkConfig?: ToastLinkConfig,
	options?: ToastOptions,
) => {
	return showToastVariant("info", createLinkedToastContent(message, linkConfig), options);
};
