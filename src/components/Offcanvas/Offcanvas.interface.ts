import type React from "react";
import type { Size } from "../../types/Commons.type";

export type OffcanvasSide = "left" | "right" | "top" | "bottom";

export interface IOffcanvasProps extends Omit<
	React.DialogHTMLAttributes<HTMLDialogElement>,
	"open" | "onClose" | "onCancel"
> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	side?: OffcanvasSide;
	size?: Size;
	closeOnOverlayClick?: boolean;
	closeOnEsc?: boolean;
	showCloseButton?: boolean;
	closeLabel?: string;
	initialFocusRef?: React.RefObject<HTMLElement | null>;
	returnFocusRef?: React.RefObject<HTMLElement | null>;
}
