import React from "react";

export interface AlertInterface {
	variant: "success" | "warning" | "error" | "info";
	title?: string;
	message?: string;
	icon?: React.ReactNode;
	hideIcon?: boolean;
	closable?: boolean;
	onClose?: () => void;
	action?: React.ReactNode;
	className?: string;
	radius?: "sm" | "md" | "lg" | "full";
}
