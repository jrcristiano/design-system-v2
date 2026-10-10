import React from "react";
import clsx from "clsx";
import type { IRadioProps } from "./Radio.interface";
import { useInteractionState } from "../../hooks/useInteractionState";

export const Radio: React.FC<IRadioProps> = ({
	label,
	disabled = false,
	className,
	fontLabelStyle = {},
	...props
}) => {
	const {
		isFocused,
		isHovered,
		state: interactionState,
		handlers,
	} = useInteractionState({ disabled });

	const baseStyles = `
    w-5 h-5 rounded-full border-[1px] transition-all duration-150
    appearance-none cursor-pointer relative flex items-center justify-center
  `;

	const stateStyles = {
		default:
			"border-[var(--ds-color-neutral-50)] bg-transparent checked:border-none checked:bg-[var(--ds-color-blue-40)]",
		hover:
			"border-[var(--ds-color-neutral-30)] bg-transparent checked:border-none checked:bg-[var(--ds-color-blue-20)]",
		pressed:
			"border-[var(--ds-color-neutral-40)] bg-transparent checked:border-none checked:bg-[var(--ds-color-blue-10)]",
		focused:
			"border-[var(--ds-color-neutral-50)] bg-transparent checked:border-none checked:bg-[var(--ds-color-blue-30)]",
		disabled:
			"border-[var(--ds-color-neutral-50)] bg-transparent checked:border-none checked:bg-[var(--ds-color-neutral-80)] cursor-not-allowed",
	};

	const getLabelStyles = () => {
		if (disabled && props.checked) return "text-[var(--ds-color-neutral-40)] cursor-not-allowed";
		if (disabled) return "text-[var(--ds-color-text-disabled)] cursor-not-allowed";
		return "text-[var(--ds-color-neutral-10)]";
	};

	const labelStyles = `text-[var(--ds-font-size-16)] font-body font-normal leading-[15px] ${getLabelStyles()}`;

	const finalState = interactionState === "selected" ? "default" : interactionState;

	return (
		<label
			className="inline-flex items-center gap-3 cursor-pointer"
			onMouseEnter={handlers.onMouseEnter}
			onMouseLeave={handlers.onMouseLeave}
		>
			<div className="w-[44px] h-[44px] rounded-full inline-flex justify-center items-center">
				<div
					className={clsx(
						"w-10 h-10 rounded-full relative inline-flex justify-center items-center transition-all duration-150",
						isHovered && !disabled && "bg-[var(--ds-color-neutral-90)]",
					)}
				>
					<div
						className={clsx(
							"rounded-full inline-flex justify-center items-center transition-all duration-150 relative",
							isFocused &&
								!disabled &&
								!props.checked &&
								"p-1 outline outline-2 outline-[var(--ds-color-blue-10)] outline-offset-[-2px]",
							isFocused &&
								!disabled &&
								props.checked &&
								"p-[2px] shadow-[0px_0px_0px_2px_var(--ds-color-blue-10)]",
						)}
					>
						<input
							type="radio"
							disabled={disabled}
							onFocus={handlers.onFocus}
							onBlur={handlers.onBlur}
							className={clsx(baseStyles, "peer", stateStyles[finalState], className)}
							{...props}
						/>

						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--ds-color-neutral-white)] pointer-events-none opacity-0 peer-checked:opacity-100" />
					</div>
				</div>
			</div>

			{label && (
				<span style={fontLabelStyle} className={labelStyles}>
					{label}
				</span>
			)}
		</label>
	);
};
