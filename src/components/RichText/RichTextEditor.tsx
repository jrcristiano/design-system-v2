import React from "react";
import { EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";

type RichTextEditorProps = {
	editor: Editor | null;
	disabled?: boolean;
	placeholder: string;
	backgroundColor: string;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
	editor,
	disabled = false,
	placeholder,
	backgroundColor,
}) => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			borderRadius: "8px",
			outline: "1px solid var(--ds-color-neutral-50)",
			outlineOffset: "-1px",
			backgroundColor,
			overflow: "hidden",
		}}
	>
		<div
			style={{
				minHeight: "120px",
				position: "relative",
			}}
		>
			{editor && (
				<EditorContent
					editor={editor}
					style={{
						color: disabled ? "var(--ds-color-neutral-40)" : "var(--ds-color-neutral-10)",
						fontSize: "14px",
						fontFamily: "Inter, sans-serif",
						fontWeight: 400,
						lineHeight: "17.6px",
					}}
				/>
			)}

			{!editor?.getText() && (
				<div
					style={{
						position: "absolute",
						top: "10px",
						left: "10px",
						color: "var(--ds-color-neutral-40)",
						fontSize: "14px",
						fontFamily: "Poppins, sans-serif",
						fontWeight: 400,
						lineHeight: "20px",
						pointerEvents: "none",
					}}
				>
					{placeholder}
				</div>
			)}
		</div>
	</div>
);
