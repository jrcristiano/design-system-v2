import React, { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import styles from "./RichText.module.css";

type ToolbarButtonProps = {
	onClick: () => void;
	isActive?: boolean;
	children: React.ReactNode;
	title: string;
	disabled?: boolean;
};

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
	onClick,
	isActive,
	children,
	title,
	disabled = false,
}) => (
	<button
		type="button"
		onMouseDown={(e) => {
			e.preventDefault();
			onClick();
		}}
		disabled={disabled}
		title={title}
		tabIndex={-1}
		aria-pressed={isActive}
		className={`${styles.toolbarButton} ${
			isActive ? styles.toolbarButtonActive : ""
		} ${disabled ? styles.toolbarButtonDisabled : ""}`}
	>
		{children}
	</button>
);

type RichTextToolbarProps = {
	editor: Editor | null;
	disabled?: boolean;
};

export const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ editor, disabled = false }) => {
	const [editorTick, setEditorTick] = useState(0);

	useEffect(() => {
		if (!editor) return;

		const handleTransaction = () => {
			setEditorTick((current) => current + 1);
		};

		editor.on("transaction", handleTransaction);

		return () => {
			editor.off("transaction", handleTransaction);
		};
	}, [editor]);

	return (
		<div
			style={{
				display: "flex",
				gap: "12px",
				padding: "8px",
				background: "var(--ds-color-neutral-95)",
				borderRadius: "8px",
				outline: "1px solid var(--ds-color-neutral-50)",
				outlineOffset: "-1px",
			}}
			data-editor-tick={editorTick}
		>
			<ToolbarButton
				onClick={() => editor?.chain().focus().toggleBold().run()}
				isActive={editor?.isActive("bold")}
				title="Negrito"
				disabled={disabled}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M4.5 2.5v11M4.5 2.5h4.25c1.519 0 2.75 1.231 2.75 2.75s-1.231 2.75-2.75 2.75M4.5 2.5h3.75M4.5 13.5h4.75c1.519 0 2.75-1.231 2.75-2.75s-1.231-2.75-2.75-2.75M4.5 13.5h3.75M8.75 8h.75M4.5 8h4.25"
						stroke="var(--ds-color-neutral-40)"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</ToolbarButton>

			<ToolbarButton
				onClick={() => editor?.chain().focus().toggleItalic().run()}
				isActive={editor?.isActive("italic")}
				title="Itálico"
				disabled={disabled}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M6 3h6M4 13h6M10 3l-4 10"
						stroke="var(--ds-color-neutral-40)"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</ToolbarButton>

			<ToolbarButton
				onClick={() => editor?.chain().focus().toggleBulletList().run()}
				isActive={editor?.isActive("bulletList")}
				title="Lista com marcadores"
				disabled={disabled}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M6 4h8M6 8h8M6 12h8M3 4h.01M3 8h.01M3 12h.01"
						stroke="var(--ds-color-neutral-40)"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</ToolbarButton>

			<ToolbarButton
				onClick={() => editor?.chain().focus().toggleOrderedList().run()}
				isActive={editor?.isActive("orderedList")}
				title="Lista numerada"
				disabled={disabled}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M6 4h8M6 8h8M6 12h8M2 3.5v3M2 6.5h1.5M2 9.5v3l2 -2"
						stroke="var(--ds-color-neutral-40)"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</ToolbarButton>

			<ToolbarButton
				onClick={() => editor?.chain().focus().toggleStrike().run()}
				isActive={editor?.isActive("strike")}
				title="Tachado"
				disabled={disabled}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M2 8h12M6 3.5c0-.828.672-1.5 1.5-1.5h1c.828 0 1.5.672 1.5 1.5 0 .828-.672 1.5-1.5 1.5h-1c-.828 0-1.5.672-1.5 1.5v3c0 .828.672 1.5 1.5 1.5h1c.828 0 1.5-.672 1.5-1.5"
						stroke="var(--ds-color-neutral-40)"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</ToolbarButton>
		</div>
	);
};
