import React from "react";

type RichTextLabelProps = {
	label?: string;
	id?: string;
	htmlFor?: string;
	required?: boolean;
	disabled?: boolean;
};

export const RichTextLabel: React.FC<RichTextLabelProps> = ({
	label,
	id,
	htmlFor,
	required = false,
	disabled = false,
}) => {
	if (!label) return null;

	const labelClasses = disabled ? "cursor-default" : "cursor-pointer";
	const labelColor = disabled ? "var(--ds-color-neutral-40)" : "var(--ds-color-neutral-10)";
	const requiredColor = "var(--ds-color-red-40)";

	return (
		<label
			id={id}
			htmlFor={htmlFor}
			className={`flex items-center gap-1 font-body font-[var(--ds-label-1-weight)] ${labelClasses}`}
		>
			<span style={{ color: labelColor }}>{label}</span>
			{required && (
				<span aria-hidden="true" style={{ color: requiredColor }}>
					*
				</span>
			)}
		</label>
	);
};
