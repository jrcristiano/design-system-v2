import { useId } from "react";
import clsx from "clsx";
import type { TextareaProps } from "./Textarea.interface";

/** A native multiline text field styled with the Input component's form conventions. */
export function Textarea({
	label = "Label",
	message,
	required = false,
	disabled = false,
	state = "default",
	id,
	className,
	"aria-describedby": ariaDescribedBy,
	"aria-errormessage": ariaErrorMessage,
	"aria-invalid": ariaInvalid,
	"aria-required": ariaRequired,
	...props
}: Readonly<TextareaProps>) {
	const generatedId = useId();
	const messageId = useId();
	const textareaId = id ?? generatedId;
	const describedBy = [ariaDescribedBy, message ? messageId : undefined].filter(Boolean).join(" ");
	const invalid = ariaInvalid ?? (state === "error" ? true : undefined);
	const errorMessage = ariaErrorMessage ?? (state === "error" && message ? messageId : undefined);

	const textareaClassName = clsx(
		"block min-h-24 w-full resize-y rounded-[var(--ds-radius-xl)] border bg-[var(--ds-color-surface)]",
		"px-[var(--ds-pad-textarea-x)] py-[var(--ds-pad-textarea-y)] font-body",
		"text-[length:var(--ds-body-3-size)] text-[var(--ds-color-text-primary)]",
		"placeholder:text-[var(--ds-color-text-muted)] transition-colors",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-color-surface)]",
		"disabled:cursor-not-allowed disabled:bg-[var(--ds-color-surface-disabled)] disabled:text-[var(--ds-color-text-disabled)] disabled:placeholder:text-[var(--ds-color-text-disabled)]",
		disabled
			? "border-[var(--ds-color-border-subtle)]"
			: state === "error"
				? "border-[var(--ds-color-error)] focus-visible:ring-[var(--ds-color-error)]"
				: "border-[var(--ds-color-border)] hover:border-[var(--ds-color-text-secondary)]",
		className,
	);

	const labelClassName = clsx(
		"flex items-center gap-1 font-ui text-[length:var(--ds-label-1-size)] font-[var(--ds-label-1-weight)]",
		disabled ? "text-[var(--ds-color-text-disabled)]" : "text-[var(--ds-color-text-primary)]",
	);

	return (
		<div className="flex w-full flex-col gap-[2px]">
			{label && (
				<label htmlFor={textareaId} className={labelClassName}>
					{label}
					{required && (
						<span aria-hidden="true" className="text-[var(--ds-color-error)]">
							*
						</span>
					)}
				</label>
			)}

			<textarea
				{...props}
				id={textareaId}
				required={required}
				aria-required={required ? true : ariaRequired}
				aria-invalid={invalid}
				aria-describedby={describedBy || undefined}
				aria-errormessage={errorMessage}
				disabled={disabled}
				className={textareaClassName}
			/>

			{message && (
				<p
					id={messageId}
					className={clsx(
						"text-[length:var(--ds-font-size-12)]",
						disabled
							? "text-[var(--ds-color-text-disabled)]"
							: state === "error"
								? "text-[var(--ds-color-error)]"
								: "text-[var(--ds-color-text-secondary)]",
					)}
				>
					{message}
				</p>
			)}
		</div>
	);
}
