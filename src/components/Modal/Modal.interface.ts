import type React from "react";
import type { IconWeight } from "@phosphor-icons/react";
import type { Size, Variant } from "../../types/Commons.type";
import type { ModalState, ModalVariant } from "./Modal.type";

export interface IModalAction {
	label: string;
	onClick?: () => void;
	variant?: Variant;
	size?: Size;
	disabled?: boolean;
	isLoading?: boolean;
	iconLeft?: React.ElementType;
	iconRight?: React.ElementType;
	iconWeight?: IconWeight;
	type?: "button" | "submit" | "reset";
}

export interface IModalActions {
	primary?: IModalAction | React.ReactNode;
	secondary?: IModalAction | React.ReactNode;
}

export interface IModalProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
	isOpen: boolean;
	onOpenChange?: (open: boolean) => void;
	title?: string;
	description?: string;
	ariaLabel?: string;
	size?: Size;
	variant?: ModalVariant;
	state?: ModalState;
	actions?: IModalActions;
	icon?: React.ReactNode;
	closeOnOverlayClick?: boolean;
	closeOnEsc?: boolean;
	showCloseButton?: boolean;
	isContentScrollable?: boolean;
	isTitleIconColorSynced?: boolean;
	initialFocusRef?: React.RefObject<HTMLElement>;
	returnFocusRef?: React.RefObject<HTMLElement>;
	loadingLabel?: string;
}
