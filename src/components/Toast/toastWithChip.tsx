import React from "react";
import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";
import type { IChipProps } from "../Chip/Chip.interface";
import { Chip } from "../Chip/Chip";
import { TOAST_ICONS, renderToastContent, renderToastLink } from "./Toast.utils";
import type { ToastLinkConfig } from "./Toast.utils";

interface ToastWithChipOptions extends ToastOptions {
	chip?: IChipProps;
}

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

	const content = renderToastContent(message, finalChipProps && <Chip {...finalChipProps} />);

	return toast(content, toastOptions);
};

export const toastInfoWithChip = (
	message: string | React.ReactNode,
	chipProps?: IChipProps,
	options?: ToastOptions,
) => {
	const content = renderToastContent(message, chipProps && <Chip {...chipProps} />);

	return toast.info(content, { icon: TOAST_ICONS.info, ...options });
};

export const toastSuccessWithChip = (
	message: string | React.ReactNode,
	chipProps?: IChipProps,
	options?: ToastOptions,
) => {
	const content = renderToastContent(message, chipProps && <Chip {...chipProps} />);

	return toast.success(content, { icon: TOAST_ICONS.success, ...options });
};

export const toastWarningWithChip = (
	message: string | React.ReactNode,
	chipProps?: IChipProps,
	options?: ToastOptions,
) => {
	const content = renderToastContent(message, chipProps && <Chip {...chipProps} />);

	return toast.warning(content, { icon: TOAST_ICONS.warning, ...options });
};

export const toastErrorWithChip = (
	message: string | React.ReactNode,
	chipProps?: IChipProps,
	options?: ToastOptions,
) => {
	const content = renderToastContent(message, chipProps && <Chip {...chipProps} />);

	return toast.error(content, { icon: TOAST_ICONS.error, ...options });
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
	const content = renderToastContent(message, renderToastLink(link));

	return toast.info(content, { icon: TOAST_ICONS.info, ...options });
};

export const toastSuccessWithLink = (
	message: string | React.ReactNode,
	link: ToastLinkConfig,
	options?: ToastOptions,
) => {
	const content = renderToastContent(message, renderToastLink(link));

	return toast.success(content, { icon: TOAST_ICONS.success, ...options });
};

export const toastWarningWithLink = (
	message: string | React.ReactNode,
	link: ToastLinkConfig,
	options?: ToastOptions,
) => {
	const content = renderToastContent(message, renderToastLink(link));

	return toast.warning(content, { icon: TOAST_ICONS.warning, ...options });
};

export const toastErrorWithLink = (
	message: string | React.ReactNode,
	link: ToastLinkConfig,
	options?: ToastOptions,
) => {
	const content = renderToastContent(message, renderToastLink(link));

	return toast.error(content, { icon: TOAST_ICONS.error, ...options });
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
