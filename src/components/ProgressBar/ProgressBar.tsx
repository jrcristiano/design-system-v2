import React, { cloneElement, isValidElement } from "react";
import { FolderIcon, XIcon } from "@phosphor-icons/react";
import type {
	ProgressBarProps,
	ProgressBarStatus,
	ProgressBarVariant,
} from "./ProgressBar.interface";

const VARIANT_COLORS: Record<ProgressBarVariant, string> = {
	primary: "var(--ds-color-blue-40)",
	success: "var(--ds-color-green-30)",
	warning: "var(--ds-color-orange-50)",
	danger: "var(--ds-color-red-40)",
};

const STATUS_LABELS: Record<Exclude<ProgressBarStatus, "in-progress">, string> = {
	success: "Sucesso",
	error: "Erro",
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
	progress,
	variant = "primary",
	status = "in-progress",
	fileName = "",
	message,
	icon,
}) => {
	const clampedProgress = Math.max(0, Math.min(100, progress));
	const completedStatus = status === "in-progress" ? null : status;
	const resolvedColor = VARIANT_COLORS[variant];
	const resolvedIcon = (() => {
		if (icon) {
			if (isValidElement(icon)) {
				const iconElement = icon as React.ReactElement<any>;
				const iconStyle = iconElement.props.style;
				return cloneElement(iconElement, {
					size: 16,
					weight: "regular",
					style: iconStyle ? { color: resolvedColor, ...iconStyle } : { color: resolvedColor },
					className: iconElement.props.className,
				});
			}
			return icon;
		}
		if (completedStatus === "error") {
			return <XIcon size={16} weight="regular" style={{ color: resolvedColor }} />;
		}
		return <FolderIcon size={16} weight="regular" style={{ color: resolvedColor }} />;
	})();

	return (
		<div className="w-full flex flex-col">
			{fileName && (
				<div className="flex items-center justify-start gap-2 mb-1">
					<span data-testid="progressbar-icon" className="inline-flex items-center">
						{resolvedIcon}
					</span>
					<span className="text-[var(--ds-color-neutral-10)] text-sm font-[var(--ds-font-family-body)] font-normal">
						{fileName}
					</span>
				</div>
			)}

			<div className="w-full flex items-center gap-2">
				<div className="flex-1 h-2 bg-[var(--ds-color-neutral-white)] rounded-full overflow-hidden">
					<div
						data-testid="progressbar-fill"
						className="h-full rounded-full transition-[width] duration-300 ease-out"
						style={{ width: `${clampedProgress}%`, backgroundColor: resolvedColor }}
					/>
				</div>
				<span className="text-[var(--ds-font-size-12)] font-[var(--ds-font-family-body)] text-[var(--ds-color-neutral-10)]">
					{Math.round(clampedProgress)}%
				</span>
			</div>

			{(message || completedStatus) && (
				<span
					className="mt-1 text-[var(--ds-font-size-12)] font-[var(--ds-font-family-body)] font-normal"
					style={{ color: resolvedColor }}
				>
					{message ?? STATUS_LABELS[completedStatus ?? "success"]}
				</span>
			)}
		</div>
	);
};
