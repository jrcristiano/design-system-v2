import type { TippyProps } from "@tippyjs/react";

export interface TooltipProps extends Omit<TippyProps, "content" | "placement"> {
	title?: string;
	content: React.ReactNode;
	delay?: number;
	placement?: TippyProps["placement"] | "default";
	disabled?: boolean;
	trigger?: string;
	className?: string;
	theme?: string;
	animation?: string;
	children: React.ReactElement;
}
