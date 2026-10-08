import React from "react";
import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";
import type { IChipProps } from "../Chip/Chip.interface";
import { Chip } from "../Chip/Chip";
import { renderToastContent, renderToastLink, showToastVariant } from "./Toast.utils";
import type { ToastLinkConfig } from "./Toast.utils";

interface ToastWithChipOptions extends ToastOptions {
	chip?: IChipProps;
}

const createToastWithChipContent = (message: string | React.ReactNode, chipProps?: IChipProps) =>
	renderToastContent(message, chipProps && <Chip {...chipProps} />);

const createLinkedToastContent = (message: string | React.ReactNode, link: ToastLinkConfig) =>
	renderToastContent(message, renderToastLink(link));

// ---------------------------------------------------------------------------
// WithChip
// ---------------------------------------------------------------------------

/**
 * Renderiza um Toast genérico com um Chip
 * @example
 * toastWithChip("Atualização concluída", { variant: "success", children: "Salvo" })
 */
export const toastWithChip = (
	message: string | React.ReactNode,
	chipProps?: IChipProps,
	options?: ToastWithChipOptions,
) => {
	const { chip, ...toastOptions } = options || {};
	const finalChipProps = chipProps || chip;

	return toast(createToastWithChipContent(message, finalChipProps), toastOptions);
};

export const toastInfoWithChip = (
	message: string | React.ReactNode,
	chipProps?: IChipProps,
	options?: ToastOptions,
) => {
	return showToastVariant("info", createToastWithChipContent(message, chipProps), options);
};

export const toastSuccessWithChip = (
	message: string | React.ReactNode,
	chipProps?: IChipProps,
	options?: ToastOptions,
) => {
	return showToastVariant("success", createToastWithChipContent(message, chipProps), options);
};

export const toastWarningWithChip = (
	message: string | React.ReactNode,
	chipProps?: IChipProps,
	options?: ToastOptions,
) => {
	return showToastVariant("warning", createToastWithChipContent(message, chipProps), options);
};

export const toastErrorWithChip = (
	message: string | React.ReactNode,
	chipProps?: IChipProps,
	options?: ToastOptions,
) => {
	return showToastVariant("error", createToastWithChipContent(message, chipProps), options);
};

// ---------------------------------------------------------------------------
// WithLink
// ---------------------------------------------------------------------------

/**
 * Renderiza um Toast com link branco, itálico e com underline
 * @example
 * toastInfoWithLink("Mensagem", { text: "Saiba mais", href: "https://example.com" })
 */
export const toastInfoWithLink = (
	message: string | React.ReactNode,
	link: ToastLinkConfig,
	options?: ToastOptions,
) => {
	return showToastVariant("info", createLinkedToastContent(message, link), options);
};

export const toastSuccessWithLink = (
	message: string | React.ReactNode,
	link: ToastLinkConfig,
	options?: ToastOptions,
) => {
	return showToastVariant("success", createLinkedToastContent(message, link), options);
};

export const toastWarningWithLink = (
	message: string | React.ReactNode,
	link: ToastLinkConfig,
	options?: ToastOptions,
) => {
	return showToastVariant("warning", createLinkedToastContent(message, link), options);
};

export const toastErrorWithLink = (
	message: string | React.ReactNode,
	link: ToastLinkConfig,
	options?: ToastOptions,
) => {
	return showToastVariant("error", createLinkedToastContent(message, link), options);
};

// ---------------------------------------------------------------------------
// WithChip + WithLink (combinado)
// ---------------------------------------------------------------------------

export const toastLinkWithChip = (
	linkText: string,
	linkHref: string,
	chipProps?: IChipProps,
	options?: ToastOptions,
) => {
	const content = (
		<div className="flex items-center gap-3">
			{renderToastLink({ text: linkText, href: linkHref })}
			{chipProps && <Chip {...chipProps} />}
		</div>
	);

	return toast(content, options);
};
