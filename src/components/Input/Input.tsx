import { EyeSlashIcon, WarningCircleIcon } from "@phosphor-icons/react";
import {
	cloneElement,
	isValidElement,
	useId,
	useState,
	useCallback,
	type ReactNode,
	type ChangeEvent,
	useEffect,
	useMemo,
} from "react";
import type { InputProps } from "./Input.interface";
import type { InputSize } from "./Input.type";
import { useMask } from "../../hooks/useMask";

const getMaskedValue = (
	value: string,
	mask: string,
	applyMask: (value: string, mask: string) => string,
) => {
	if (!mask || mask.trim() === "") return value;
	return applyMask(value, mask);
};

const getPlaceholderClasses = (disabled: boolean, state: string) => {
	if (disabled) return "placeholder:text-[var(--ds-color-neutral-40)]";
	if (state === "error") return "placeholder:text-[var(--ds-color-red-30)]";
	return "placeholder:text-[var(--ds-color-neutral-30)]";
};

const shouldShowRequiredMarker = (required: boolean) => required;

const getMessageToneClass = (disabled: boolean, state: string) =>
	!disabled && state === "error"
		? "text-[var(--ds-color-red-30)]"
		: "text-[var(--ds-color-neutral-40)]";

const resolveIconToneClass = (
	disabled: boolean,
	state: string,
	iconClassName: string | undefined,
	defaultClass: string,
) => {
	if (disabled) return "text-[var(--ds-color-neutral-40)]";
	if (state === "error") return "text-[var(--ds-color-red-30)]";
	return iconClassName || defaultClass;
};

const renderInputIcon = (icon: ReactNode, size: number, classes: string) => {
	if (!isValidElement(icon)) return icon;

	type IconElementProps = {
		className?: string;
		size?: number;
	};

	const iconElement = icon as React.ReactElement<IconElementProps>;
	const existingClassName = iconElement.props.className || "";

	if (typeof iconElement.type === "string" && iconElement.type === "button") {
		return cloneElement(iconElement, {
			className: [
				"flex items-center justify-center h-full p-0 m-0 border-0 bg-transparent leading-none",
				existingClassName,
				classes,
			]
				.filter(Boolean)
				.join(" "),
		});
	}

	return cloneElement(iconElement, {
		size,
		className: [existingClassName, classes].filter(Boolean).join(" "),
	});
};

type IconSlotProps = {
	className?: string;
	onMouseDown?: (event: React.MouseEvent) => void;
	onClick?: () => void;
	children: ReactNode;
};

const IconSlot: React.FC<IconSlotProps> = ({ className, onMouseDown, onClick, children }) => {
	if (!onClick) {
		return (
			<span className={className} onMouseDown={onMouseDown} aria-hidden="true">
				{children}
			</span>
		);
	}

	return (
		<button type="button" className={className} onMouseDown={onMouseDown} onClick={onClick}>
			{children}
		</button>
	);
};

const usePasswordToggle = (type: string, iconRight: ReactNode) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const isPasswordToggle = type === "password" && !!iconRight;

	useEffect(() => {
		if (type !== "password" && isPasswordVisible) {
			setIsPasswordVisible(false);
		}
	}, [type, isPasswordVisible]);

	const handlePasswordToggle = () => {
		if (isPasswordToggle) {
			setIsPasswordVisible((visible) => !visible);
		}
	};

	const resolvedType = isPasswordToggle && isPasswordVisible ? "text" : type;
	const passwordToggleIcon = isPasswordToggle && isPasswordVisible ? <EyeSlashIcon /> : iconRight;

	return {
		isPasswordToggle,
		resolvedType,
		passwordToggleIcon,
		handlePasswordToggle,
		isPasswordVisible,
	};
};

const InputLabel: React.FC<
	Pick<InputProps, "label" | "required" | "disabled"> & {
		finalId: string;
		labelClasses: string;
	}
> = ({ finalId, label, required, disabled, labelClasses }) => {
	if (!label) return null;

	return (
		<label
			htmlFor={finalId}
			className={`flex items-center gap-1 font-body ${labelClasses} font-[var(--ds-label-1-weight)] ${disabled ? "cursor-default" : "cursor-pointer"}`}
		>
			{label}
			{shouldShowRequiredMarker(required ?? false) && (
				<span
					aria-hidden="true"
					className={disabled ? "text-[var(--ds-color-red-90)]" : "text-[var(--ds-color-red-40)]"}
				>
					*
				</span>
			)}
		</label>
	);
};

export const InputMessage: React.FC<
	Pick<InputProps, "message" | "disabled" | "state" | "size"> & {
		id?: string;
		iconSizes: Record<InputSize, number>;
	}
> = ({ id, message, disabled, state, iconSizes, size = "md" }) => {
	if (!message) return null;

	return (
		<div
			id={id}
			className={`flex items-center gap-1 mt-[2px] text-[var(--ds-font-size-12)] ${getMessageToneClass(
				disabled ?? false,
				state ?? "default",
			)}`}
		>
			{state === "error" && <WarningCircleIcon weight="fill" size={iconSizes[size]} />}
			<span>{message}</span>
		</div>
	);
};

const RightIcon: React.FC<{
	iconRight?: ReactNode;
	isPasswordToggle?: boolean;
	iconRightIsNativeButton?: boolean;
	isPasswordVisible?: boolean;
	disabled?: boolean;
	handleIconRightClick?: () => void;
	hasRightIconAction?: boolean;
	renderIcon: (icon: ReactNode) => ReactNode;
	passwordToggleIcon?: ReactNode;
}> = ({
	iconRight,
	isPasswordToggle,
	iconRightIsNativeButton,
	isPasswordVisible,
	disabled,
	handleIconRightClick,
	hasRightIconAction,
	renderIcon,
	passwordToggleIcon,
}) => {
	if (!iconRight) {
		return null;
	}

	// When iconRight is a native button, render it as-is without wrapping
	if (iconRightIsNativeButton) {
		return <>{iconRight}</>;
	}

	if (isPasswordToggle) {
		return (
			<button
				type="button"
				aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
				aria-pressed={isPasswordVisible}
				disabled={disabled}
				onMouseDown={(event) => event.preventDefault()}
				onClick={handleIconRightClick}
				className="flex items-center justify-center shrink-0 h-full p-0 m-0 border-0 bg-transparent leading-none"
			>
				{renderIcon(passwordToggleIcon)}
			</button>
		);
	}

	return (
		<IconSlot
			className="flex items-center justify-center shrink-0"
			onMouseDown={hasRightIconAction ? (event) => event.preventDefault() : undefined}
			onClick={hasRightIconAction ? handleIconRightClick : undefined}
		>
			{renderIcon(iconRight)}
		</IconSlot>
	);
};

export const Input: React.FC<InputProps> = ({
	autoComplete = "off",
	label = "Label",
	message,
	required = false,
	iconLeft,
	iconRight,
	onIconLeftClick,
	onIconRightClick,
	iconClassName,
	disabled = false,
	state = "default",
	size = "md",
	id,
	mask = "",
	onChange,
	style = {},
	type = "text",
	value: controlledValue,
	defaultValue,
	onChangeRaw,
	...props
}) => {
	const inputId = useId();
	const messageId = useId();
	const finalId = id || inputId;
	const { applyMask, stripMask } = useMask();
	const [value, setValue] = useState(controlledValue ?? defaultValue ?? "");

	const {
		isPasswordToggle,
		resolvedType,
		passwordToggleIcon,
		handlePasswordToggle,
		isPasswordVisible,
	} = usePasswordToggle(type, iconRight);

	const iconSizes = useMemo((): Record<InputSize, number> => ({ sm: 14, md: 20, lg: 24 }), []);

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const rawValue = stripMask(e.target.value, mask);
			const maskedValue = getMaskedValue(rawValue, mask, applyMask);
			if (controlledValue === undefined) setValue(maskedValue);
			if (onChange) {
				const syntheticEvent = {
					...e,
					target: { ...e.target, value: maskedValue, rawValue },
				};
				onChange(syntheticEvent as ChangeEvent<HTMLInputElement>);
			}
			onChangeRaw?.(rawValue);
		},
		[mask, applyMask, stripMask, controlledValue, onChange, onChangeRaw],
	);

	const handleIconLeftClick = useCallback(() => {
		if (!disabled) onIconLeftClick?.();
	}, [disabled, onIconLeftClick]);

	const handleIconRightClick = useCallback(() => {
		if (disabled) return;
		handlePasswordToggle();
		onIconRightClick?.();
	}, [disabled, handlePasswordToggle, onIconRightClick]);

	const sizeStyles: Record<InputSize, string> = {
		sm: "h-[var(--ds-control-height-sm)] px-3",
		md: "h-[var(--ds-control-height-md)] px-4",
		lg: "h-[var(--ds-control-height-lg)] px-5",
	};
	const inputTextStyles: Record<InputSize, string> = {
		sm: "text-[var(--ds-body-4-size)]",
		md: "text-[var(--ds-body-3-size)]",
		lg: "text-[var(--ds-body-2-size)]",
	};
	const states = {
		default:
			"border-[var(--ds-color-neutral-50,#737D8C)] hover:[&:not(:focus-within)]:border-[var(--ds-color-neutral-50,#737D8C)] focus-within:border-[var(--ds-color-blue-10)] focus-within:ring-1 focus-within:ring-[var(--ds-color-blue-10)] placeholder:text-ds-color-neutral-30",
		error:
			"bg-[var(--ds-color-red-90)] text-[var(--ds-color-red-10)] border-[var(--ds-color-red-10)] focus-within:border-[var(--ds-color-red-10)] focus-within:ring-1 focus-within:ring-[var(--ds-color-red-10)]",
		disabled:
			"bg-[var(--ds-color-neutral-80)] border-[var(--ds-color-neutral-80)] hover:border-[var(--ds-color-neutral-80)] text-ds-color-neutral-40 placeholder:text-ds-color-neutral-40 cursor-not-allowed",
	};

	const baseStyles =
		"w-full flex items-center gap-2 rounded-full border-[1px] transition-all duration-150 font-body text-ds-color-neutral-10";
	const wrapperClasses = `relative ${baseStyles} ${sizeStyles[size]} ${
		disabled ? states.disabled : states[state]
	}`;
	const placeholderClasses = getPlaceholderClasses(disabled, state);
	const labelClasses = disabled
		? "text-[var(--ds-color-neutral-40)]"
		: "text-[var(--ds-color-neutral-10)]";

	const renderIcon = useCallback(
		(icon: ReactNode, classes = "text-[var(--ds-color-neutral-10)]") => {
			const iconSize = iconSizes[size];
			const resolvedClasses = resolveIconToneClass(disabled, state, iconClassName, classes);
			return renderInputIcon(icon, iconSize, resolvedClasses);
		},
		[disabled, state, iconClassName, size, iconSizes],
	);

	const iconRightIsNativeButton = isValidElement(iconRight) && iconRight.type === "button";
	const hasRightIconAction = isPasswordToggle || !!onIconRightClick || iconRightIsNativeButton;
	const describedBy =
		[props["aria-describedby"], message ? messageId : undefined].filter(Boolean).join(" ") ||
		undefined;
	const ariaInvalid = props["aria-invalid"] ?? (state === "error" ? true : undefined);
	const ariaErrorMessage = state === "error" && message ? messageId : props["aria-errormessage"];

	return (
		<div className="flex flex-col gap-[2px]">
			<InputLabel
				finalId={finalId}
				label={label}
				required={required}
				disabled={disabled}
				labelClasses={labelClasses}
			/>

			<div className={wrapperClasses}>
				{iconLeft && (
					<IconSlot
						className="flex items-center justify-center shrink-0"
						onMouseDown={handleIconLeftClick ? (event) => event.preventDefault() : undefined}
						onClick={handleIconLeftClick}
					>
						{renderIcon(iconLeft)}
					</IconSlot>
				)}
				<input
					{...props}
					id={finalId}
					required={required}
					aria-required={required ? true : props["aria-required"]}
					aria-invalid={ariaInvalid}
					aria-describedby={describedBy}
					aria-errormessage={ariaErrorMessage}
					value={controlledValue ?? value}
					onChange={handleChange}
					autoComplete={autoComplete}
					disabled={disabled}
					style={style}
					type={resolvedType}
					className={`flex-1 min-w-0 h-full bg-transparent outline-none font-ds-body-3-weight leading-none ${
						inputTextStyles[size]
					} ${disabled ? "cursor-not-allowed bg-[var(--ds-color-neutral-80)]" : ""} ${placeholderClasses}`}
				/>
				<RightIcon
					iconRight={iconRight}
					isPasswordToggle={isPasswordToggle}
					isPasswordVisible={isPasswordVisible}
					disabled={disabled}
					handleIconRightClick={handleIconRightClick}
					hasRightIconAction={hasRightIconAction}
					iconRightIsNativeButton={iconRightIsNativeButton}
					renderIcon={renderIcon}
					passwordToggleIcon={passwordToggleIcon}
				/>
			</div>

			<InputMessage
				id={messageId}
				message={message}
				disabled={disabled}
				state={state}
				iconSizes={iconSizes}
				size={size}
			/>
		</div>
	);
};
