import { type FC, memo, useMemo, useCallback, type ReactNode, type KeyboardEvent } from "react";
import clsx from "clsx";
import { CheckIcon } from "@phosphor-icons/react";
import type { StepStatus } from "./Step.interface";
import "./Step.inline.css";

interface StepProps {
	stepKey: string | number;
	href?: string;
	disabled?: boolean;
	children: ReactNode;
	isLast?: boolean;
	status?: StepStatus;
	onClick?: (key: string | number) => void;
}

const BASE_CIRCLE_CLASSES =
	"flex items-center justify-center w-[40px] h-[40px] rounded-full text-center font-medium text-[var(--ds-font-size-14)]";

const CIRCLE_STATUS_CLASSES: Record<StepStatus | "pressed", string> = {
	default: "bg-[var(--ds-color-neutral-80)]",
	focused: "bg-[var(--ds-color-blue-10)]",
	pressed: "bg-[var(--ds-color-blue-10)]",
	active: "bg-[var(--ds-color-blue-30)]",
	completed: "bg-[var(--ds-color-neutral-10)]",
};

const LABEL_CLASSES = "text-[var(--ds-font-size-14)] font-medium";

const getNumberColor = (status: StepStatus, disabled: boolean): string => {
	if (disabled) return "var(--ds-color-neutral-40)";
	if (status === "completed") return "var(--ds-color-text-inverse)";
	if (status === "default") return "var(--ds-color-neutral-40)";
	return "var(--ds-color-neutral-white)";
};

export const Step: FC<StepProps> = memo(
	({ stepKey, href, disabled = false, children, isLast = false, status = "default", onClick }) => {
		const circleClasses = useMemo(
			() => clsx(BASE_CIRCLE_CLASSES, CIRCLE_STATUS_CLASSES[status]),
			[status],
		);

		const numberColor = useMemo(() => getNumberColor(status, disabled), [status, disabled]);

		const wrapperClassName = useMemo(
			() =>
				clsx(
					"flex items-center gap-3 select-none rounded-[var(--ds-radius-lg)] py-[8px] px-[16px] transition-all w-full md:flex-1",
					disabled ? "cursor-not-allowed" : "cursor-pointer",
					status === "active" && "ring-[1.5px] ring-[var(--ds-color-blue-30)] ring-offset-0",
				),
			[disabled, status],
		);

		const handleClick = useCallback(() => {
			if (disabled) return;
			onClick?.(stepKey);
		}, [disabled, onClick, stepKey]);

		const handleKeyDown = useCallback(
			(e: KeyboardEvent) => {
				if ((e.key === "Enter" || e.key === " ") && !disabled) {
					e.preventDefault();
					onClick?.(stepKey);
				}
			},
			[disabled, onClick, stepKey],
		);

		return (
			<div className="flex w-full flex-col md:flex-row md:items-center md:flex-1">
				{href ? (
					<a
						href={disabled ? undefined : href}
						className={clsx(
							`${wrapperClassName} bg-transparent border-0 p-0 m-0 text-left`,
							"step-inline-1",
						)}

						aria-disabled={disabled || undefined}
						aria-current={status === "active" ? "step" : undefined}
						tabIndex={disabled ? -1 : undefined}
						onClick={(event) => {
							if (disabled) {
								event.preventDefault();
								return;
							}
							handleClick();
						}}
					>
						<StepContent
							stepKey={stepKey}
							status={status}
							disabled={disabled}
							circleClasses={circleClasses}
							numberColor={numberColor}
						>
							{children}
						</StepContent>
					</a>
				) : (
					<button
						type="button"
						className={clsx(
							`${wrapperClassName} bg-transparent border-0 p-0 m-0 text-left`,
							"step-inline-2",
						)}

						disabled={disabled}
						aria-current={status === "active" ? "step" : undefined}
						onClick={handleClick}
						onKeyDown={handleKeyDown}
					>
						<StepContent
							stepKey={stepKey}
							status={status}
							disabled={disabled}
							circleClasses={circleClasses}
							numberColor={numberColor}
						>
							{children}
						</StepContent>
					</button>
				)}

				{!isLast && (
					<>
						<div className="hidden md:block flex-1 min-w-0 rounded-full border-[1.5px] border-dashed border-[var(--ds-color-neutral-50)] mx-3" />
						<div className="md:hidden ml-[20px] mt-2 h-[24px] border-l-[1.5px] border-dashed border-[var(--ds-color-neutral-50)]" />
					</>
				)}
			</div>
		);
	},
);

Step.displayName = "Step";

const StepContent: FC<{
	stepKey: string | number;
	status: StepStatus;
	disabled: boolean;
	circleClasses: string;
	numberColor: string;
	children: ReactNode;
}> = ({ stepKey, status, disabled, circleClasses, numberColor, children }) => (
	<>
		<div className={circleClasses}>
			{status === "completed" ? (
				<CheckIcon size={22} weight="bold" color={numberColor} />
			) : (
				<span className="step-number-color" data-status={status} data-disabled={disabled}>
					{stepKey}
				</span>
			)}
		</div>
		<span
			className={`${LABEL_CLASSES} step-label-color`}
			data-status={status}
			data-disabled={disabled}
		>
			{children}
		</span>
	</>
);
