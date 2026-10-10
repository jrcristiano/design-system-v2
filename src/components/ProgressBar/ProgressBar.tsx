import React, { cloneElement, isValidElement, useId } from "react";
import { FolderIcon, XIcon } from "@phosphor-icons/react";
import type {
	ProgressBarProps,
	ProgressBarStatus,
	ProgressBarVariant,
} from "./ProgressBar.interface";

type IconCloneProps = {
	className?: string;
	size?: number;
	style?: React.CSSProperties;
	weight?: string;
};

const VARIANT_COLORS: Record<ProgressBarVariant, string> = {
	primary: "var(--ds-color-blue-40)",
	success: "var(--ds-color-green-30)",
	warning: "var(--ds-color-orange-50)",
	danger: "var(--ds-color-red-40)",
};

const VARIANT_TEXT_COLORS: Record<ProgressBarVariant, string> = {
	primary: "var(--ds-color-primary)",
	success: "var(--ds-color-success-text)",
	warning: "var(--ds-color-warning-text)",
	danger: "var(--ds-color-error-text)",
};

const STATUS_LABELS: Record<Exclude<ProgressBarStatus, "in-progress">, string> = {
	success: "Sucesso",
	error: "Erro",
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
	progress,
	ariaLabel,
	variant = "primary",
	status = "in-progress",
	fileName = "",
	message,
	icon,
}) => {
	const fileNameId = useId();
	const clampedProgress = Math.max(0, Math.min(100, progress));
	const completedStatus = status === "in-progress" ? null : status;
	const resolvedColor = VARIANT_COLORS[variant];
	const resolvedTextColor = VARIANT_TEXT_COLORS[variant];
	const resolvedIcon = (() => {
		if (icon) {
			if (isValidElement<IconCloneProps>(icon)) {
				const iconStyle = icon.props.style;
				return cloneElement(icon, {
					size: 16,
					weight: "regular",
					style: iconStyle ? { color: resolvedColor, ...iconStyle } : { color: resolvedColor },
					className: icon.props.className,
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
					<span
						id={fileNameId}
						className="text-[var(--ds-color-neutral-10)] text-sm font-[var(--ds-font-family-body)] font-normal"
					>
						{fileName}
					</span>
				</div>
			)}

			<div
				role="progressbar"
				aria-label={!fileName ? ariaLabel || "Progresso" : undefined}
				aria-labelledby={fileName ? fileNameId : undefined}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={clampedProgress}
				aria-valuetext={`${Math.round(clampedProgress)}%`}
				className="w-full flex items-center gap-2"
			>
				<div className="flex-1 h-2 bg-[var(--ds-color-surface-raised)] rounded-full overflow-hidden">
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
					style={{ color: resolvedTextColor }}
				>
					{message ?? STATUS_LABELS[completedStatus ?? "success"]}
				</span>
			)}
		</div>
	);
};
