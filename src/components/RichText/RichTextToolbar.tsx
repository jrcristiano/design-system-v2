import React, { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import styles from "./RichText.module.css";
import "./RichTextToolbar.inline.css";

type ToolbarButtonProps = {
	onClick: () => void;
	isActive?: boolean;
	children: React.ReactNode;
	title: string;
	disabled?: boolean;
	tabIndex: number;
	onFocus: () => void;
};

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
	onClick,
	isActive,
	children,
	title,
	disabled = false,
	tabIndex,
	onFocus,
}) => (
	<button
		type="button"
		onMouseDown={(event) => event.preventDefault()}
		onClick={onClick}
		disabled={disabled}
		title={title}
		aria-label={title}
		tabIndex={tabIndex}
		onFocus={onFocus}
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
	const [activeButtonIndex, setActiveButtonIndex] = useState(0);

	const handleToolbarKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const buttons = Array.from(
			event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
		);
		const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
		let nextIndex: number;
		switch (event.key) {
			case "ArrowRight":
				nextIndex = (currentIndex + 1 + buttons.length) % buttons.length;
				break;
			case "ArrowLeft":
				nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
				break;
			case "Home":
				nextIndex = 0;
				break;
			case "End":
				nextIndex = buttons.length - 1;
				break;
			default:
				return;
		}
		if (!buttons.length) return;
		event.preventDefault();
		buttons[nextIndex]?.focus();
	};

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
			role="toolbar"
			aria-label="Ferramentas de formatação"
			onKeyDown={handleToolbarKeyDown}
			className="richtexttoolbar-inline-1"
			data-editor-tick={editorTick}
		>
			<ToolbarButton
				onClick={() => editor?.chain().focus().toggleBold().run()}
				isActive={editor?.isActive("bold")}
				title="Negrito"
				tabIndex={activeButtonIndex === 0 ? 0 : -1}
				onFocus={() => setActiveButtonIndex(0)}
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
				tabIndex={activeButtonIndex === 1 ? 0 : -1}
				onFocus={() => setActiveButtonIndex(1)}
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
				tabIndex={activeButtonIndex === 2 ? 0 : -1}
				onFocus={() => setActiveButtonIndex(2)}
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
				tabIndex={activeButtonIndex === 3 ? 0 : -1}
				onFocus={() => setActiveButtonIndex(3)}
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
				tabIndex={activeButtonIndex === 4 ? 0 : -1}
				onFocus={() => setActiveButtonIndex(4)}
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
