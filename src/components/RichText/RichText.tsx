import React, { useCallback, useContext, useEffect, useId, useMemo, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FormikContext } from "formik";
import * as Yup from "yup";
import type { RichTextProps } from "./RichText.interface";
import styles from "./RichText.module.css";
import { RichTextLabel } from "./RichTextLabel";
import { RichTextToolbar } from "./RichTextToolbar";
import { RichTextEditor } from "./RichTextEditor";
import { RichTextFooter } from "./RichTextFooter";
import "./RichText.inline.css";
import clsx from "clsx";

export const RichText: React.FC<RichTextProps> = ({
	label,
	required = false,
	placeholder = "Digite sua descrição aqui...",
	value = "",
	onChange,
	error,
	disabled = false,
	minLength = 50,
	maxLength = 1000,
	name,
	className = "",
}) => {
	const labelId = useId();
	const editorId = useId();
	const [isFocused, setIsFocused] = useState(false);
	const [charCount, setCharCount] = useState(0);
	const formik = useContext(FormikContext);
	const hasFormik = Boolean(formik && name);

	const validationSchema = useMemo(() => {
		let schema = Yup.string();

		if (required) {
			schema = schema.required("Campo obrigatório");
		}
		if (minLength) {
			schema = schema.min(minLength, `O texto deve ter no mínimo ${minLength} caracteres.`);
		}
		if (maxLength) {
			schema = schema.max(maxLength, `O texto deve ter no máximo ${maxLength} caracteres.`);
		}

		return schema;
	}, [required, minLength, maxLength]);

	const getFormikValue = useCallback((values: unknown, path: string) => {
		return path.split(".").reduce<unknown>((acc, key) => {
			if (acc && typeof acc === "object") {
				return (acc as Record<string, unknown>)[key];
			}
			return undefined;
		}, values);
	}, []);

	const validateWithYup = useCallback(
		(text: string) => {
			try {
				validationSchema.validateSync(text);
				return undefined;
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					return err.message;
				}
				return "Campo inválido";
			}
		},
		[validationSchema],
	);

	const formikValue =
		hasFormik && name ? (getFormikValue(formik.values, name) as string | undefined) : undefined;
	const resolvedValue = typeof formikValue === "string" ? formikValue : value;
	const [htmlValue, setHtmlValue] = useState(resolvedValue);

	const editor = useEditor({
		extensions: [StarterKit],
		content: resolvedValue,
		editable: !disabled,
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			const text = editor.getText();
			setHtmlValue(html);
			setCharCount(text.length);
			onChange?.(html);
			if (hasFormik && name) {
				formik.setFieldValue(name, html, false);
				formik.setFieldError(name, validateWithYup(text) as any);
			}
		},
		editorProps: {
			attributes: {
				id: editorId,
				role: "textbox",
				...(label ? { "aria-labelledby": labelId } : { "aria-label": "Editor de texto" }),
				...(required ? { "aria-required": "true" } : {}),
				"aria-multiline": "true",
				class: styles.editor,
				style: "min-height: 120px; padding: 10px; outline: none;",
			},
		},
	});

	useEffect(() => {
		if (editor && resolvedValue !== editor.getHTML()) {
			editor.commands.setContent(resolvedValue);
		}
		setHtmlValue(resolvedValue);
	}, [resolvedValue, editor]);

	useEffect(() => {
		if (editor) {
			editor.setEditable(!disabled);
		}
	}, [disabled, editor]);

	useEffect(() => {
		if (editor) {
			const text = editor.getText();
			setCharCount(text.length);
		}
	}, [editor]);

	const formikError = hasFormik && name ? getFormikValue(formik.errors, name) : undefined;
	const formikTouched = hasFormik && name ? getFormikValue(formik.touched, name) : undefined;
	const validationError = formikTouched ? (formikError as string | undefined) : undefined;
	const showMinLengthError = charCount > 0 && charCount < minLength;
	const hasError = Boolean(validationError || error || showMinLengthError);

	const getBackgroundColor = () => {
		if (disabled) return "var(--ds-color-neutral-95)";
		return "white";
	};

	return (
		<div className={clsx(className, "richtext-inline-1")}>
			<fieldset
				className={clsx(
					"richtext-fieldset",
					(hasError || showMinLengthError) && "richtext-fieldset--error",
					!hasError &&
						!showMinLengthError &&
						isFocused &&
						!disabled &&
						"richtext-fieldset--focused",
				)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => {
					setIsFocused(false);
					if (hasFormik && name) {
						formik.setFieldTouched(name, true, false);
						const text = editor?.getText() ?? "";
						formik.setFieldError(name, validateWithYup(text) as any);
					}
				}}
			>
				<RichTextLabel
					id={labelId}
					htmlFor={editorId}
					label={label}
					required={required}
					disabled={disabled}
				/>
				<RichTextToolbar editor={editor} disabled={disabled} />
				<RichTextEditor
					editor={editor}
					disabled={disabled}
					placeholder={placeholder}
					backgroundColor={getBackgroundColor()}
				/>
				<RichTextFooter
					error={validationError || error}
					showMinLengthError={showMinLengthError}
					minLength={minLength}
					maxLength={maxLength}
					charCount={charCount}
					disabled={disabled}
				/>
			</fieldset>

			{/* Hidden input for form submission */}
			{name && <input type="hidden" name={name} value={htmlValue} />}
		</div>
	);
};
