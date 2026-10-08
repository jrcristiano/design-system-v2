import React from "react";
import { EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import "./RichTextEditor.inline.css";

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
	<div className="richtexteditor-shell" style={{ backgroundColor }}>
		<div className="richtexteditor-inline-1">
			{editor && (
				<EditorContent
					editor={editor}
					className={`richtexteditor-content ${disabled ? "richtexteditor-content--disabled" : ""}`}
				/>
			)}

			{!editor?.getText() && <div className="richtexteditor-inline-2">{placeholder}</div>}
		</div>
	</div>
);
