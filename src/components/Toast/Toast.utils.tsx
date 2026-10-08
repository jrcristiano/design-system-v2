import type { ReactNode } from "react";
import {
	InfoIcon,
	CheckCircleIcon,
	WarningCircleIcon,
	WarningOctagonIcon,
} from "@phosphor-icons/react";

export const TOAST_ICONS = {
	info: <InfoIcon size={20} color="white" weight="light" />,
	success: <CheckCircleIcon size={20} color="white" weight="light" />,
	warning: <WarningCircleIcon size={20} color="white" weight="light" />,
	error: <WarningOctagonIcon size={20} color="white" weight="light" />,
};

export const renderToastContent = (message: ReactNode, accessory?: ReactNode) => (
	<div className="flex items-center gap-3">
		<div className="flex-1">{message}</div>
		{accessory}
	</div>
);
