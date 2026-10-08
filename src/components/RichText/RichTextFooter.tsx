import React from "react";

type RichTextFooterProps = {
	error?: string;
	showMinLengthError: boolean;
	minLength: number;
	maxLength: number;
	charCount: number;
	disabled?: boolean;
};

const getCharCountColor = (showMinLengthError: boolean, disabled: boolean): string => {
	if (showMinLengthError) return "var(--ds-color-cherry-50)";
	if (disabled) return "var(--ds-color-cherry-90)";
	return "var(--ds-color-cherry-50)";
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
		style={{
			display: "flex",
			justifyContent: error || showMinLengthError ? "space-between" : "flex-end",
			alignItems: "center",
			padding: "8px 12px",
			borderTop: "1px solid var(--ds-color-neutral-50)",
			borderRadius: "0px",
			gap: "10px",
		}}
	>
		{(error || showMinLengthError) && (
			<span
				style={{
					color: "var(--ds-color-red-40)",
					fontSize: "12px",
					fontFamily: "Inter, sans-serif",
					fontWeight: 400,
					lineHeight: "13.6px",
				}}
			>
				{error || `O texto deve ter no mínimo ${minLength} caracteres.`}
			</span>
		)}

		<span
			style={{
				color: getCharCountColor(showMinLengthError, disabled),
				fontSize: "12px",
				fontFamily: "Poppins, sans-serif",
				fontWeight: 400,
				lineHeight: "13.6px",
			}}
		>
			[{charCount}] caracteres (mínimo: {minLength}) / {maxLength}
		</span>
	</div>
);
