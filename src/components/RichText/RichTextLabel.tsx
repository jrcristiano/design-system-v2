import React from "react";
import "./RichTextLabel.css";

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
	const labelColorClass = disabled ? "rich-text-label__text--disabled" : "rich-text-label__text";

	return (
		<label
			id={id}
			htmlFor={htmlFor}
			className={`flex items-center gap-1 font-body font-[var(--ds-label-1-weight)] ${labelClasses}`}
		>
			<span className={labelColorClass}>{label}</span>
			{required && (
				<span aria-hidden="true" className="rich-text-label__required">
					*
				</span>
			)}
		</label>
	);
};
