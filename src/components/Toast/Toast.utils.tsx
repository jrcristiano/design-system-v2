import type { ReactNode } from "react";
import {
	InfoIcon,
	CheckCircleIcon,
	WarningCircleIcon,
	WarningOctagonIcon,
} from "@phosphor-icons/react";
import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";

export interface ToastLinkConfig {
	text: string;
	href: string;
}

export const TOAST_ICONS = {
	info: <InfoIcon size={20} color="white" weight="light" />,
	success: <CheckCircleIcon size={20} color="white" weight="light" />,
	warning: <WarningCircleIcon size={20} color="white" weight="light" />,
	error: <WarningOctagonIcon size={20} color="white" weight="light" />,
};

export type ToastVariant = keyof typeof TOAST_ICONS;

export const showToastVariant = (
	variant: ToastVariant,
	content: ReactNode,
	options?: ToastOptions,
) => toast[variant](content, { icon: TOAST_ICONS[variant], ...options });

export const renderToastContent = (message: ReactNode, accessory?: ReactNode) => (
	<div className="flex items-center gap-3">
		<div className="flex-1">{message}</div>
		{accessory}
	</div>
);

export const renderToastLink = (
	link: ToastLinkConfig,
	{ preventWrapping = false }: { preventWrapping?: boolean } = {},
) => (
	<a
		href={link.href}
		target="_blank"
		rel="noopener noreferrer"
		style={{
			color: "#fff",
			fontStyle: "italic",
			textDecoration: "underline",
			...(preventWrapping && { whiteSpace: "nowrap" as const }),
		}}
		className="hover:opacity-80 transition-opacity"
	>
		{link.text}
	</a>
);
