import React from "react";
import "./RichTextFooter.inline.css";

type RichTextFooterProps = {
	error?: string;
	showMinLengthError: boolean;
	minLength: number;
	maxLength: number;
	charCount: number;
	disabled?: boolean;
};

export const RichTextFooter: React.FC<RichTextFooterProps> = ({
	error,
	showMinLengthError,
	minLength,
	maxLength,
	charCount,
	disabled = false,
}) => (
	<div
		className={`richtextfooter ${error || showMinLengthError ? "richtextfooter--has-message" : ""}`}
	>
		{(error || showMinLengthError) && (
			<span className="richtextfooter-inline-1">
				{error || `O texto deve ter no mínimo ${minLength} caracteres.`}
			</span>
		)}

		<span
			className={`richtextfooter-count ${disabled && !showMinLengthError ? "richtextfooter-count--disabled" : ""}`}
		>
			[{charCount}] caracteres (mínimo: {minLength}) / {maxLength}
		</span>
	</div>
);
