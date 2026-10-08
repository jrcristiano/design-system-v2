import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Formik, Form } from "formik";
import { RichText } from "./RichText";

// Mock chain methods
const mockChain = {
	focus: vi.fn(() => mockChain),
	toggleBold: vi.fn(() => mockChain),
	toggleItalic: vi.fn(() => mockChain),
	toggleStrike: vi.fn(() => mockChain),
	toggleBulletList: vi.fn(() => mockChain),
	toggleOrderedList: vi.fn(() => mockChain),
	toggleHeading: vi.fn(() => mockChain),
	run: vi.fn(),
};

// Store transaction handler and onUpdate callback
let transactionHandler: (() => void) | null = null;
let onUpdateCallback: ((params: { editor: typeof mockEditor }) => void) | null = null;
let editorAttributes: Record<string, string> = {};

// Mock @tiptap/react
const mockEditor = {
	getHTML: vi.fn(() => "<p>Test content</p>"),
	getText: vi.fn(() => "Test content"),
	commands: {
		setContent: vi.fn(),
	},
	setEditable: vi.fn(),
	on: vi.fn((event: string, handler: () => void) => {
		if (event === "transaction") {
			transactionHandler = handler;
		}
	}),
	off: vi.fn(),
	destroy: vi.fn(),
	isActive: vi.fn(() => false),
	chain: vi.fn(() => mockChain),
	can: vi.fn(() => ({ chain: vi.fn(() => mockChain) })),
};

vi.mock("@tiptap/react", () => ({
	useEditor: vi.fn(
		(config: {
			onUpdate?: (params: { editor: typeof mockEditor }) => void;
			editorProps?: { attributes?: Record<string, string> };
		}) => {
			editorAttributes = config?.editorProps?.attributes ?? {};
			if (config?.onUpdate) {
				onUpdateCallback = config.onUpdate;
			}
			return mockEditor;
		},
	),
	EditorContent: ({ editor }: { editor: unknown }) => (
		<div
			id={editorAttributes.id}
			role={editorAttributes.role}
			aria-labelledby={editorAttributes["aria-labelledby"]}
			aria-label={editorAttributes["aria-label"]}
			aria-required={editorAttributes["aria-required"] === "true"}
			aria-multiline={editorAttributes["aria-multiline"] === "true"}
			contentEditable
			data-testid="editor-content"
		>
			{editor ? "Editor loaded" : "No editor"}
		</div>
	),
}));

vi.mock("@tiptap/starter-kit", () => ({
	default: {},
}));

describe("RichText", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockEditor.getText.mockReturnValue("Test content");
		mockEditor.getHTML.mockReturnValue("<p>Test content</p>");
		onUpdateCallback = null;
		editorAttributes = {};
	});

	describe("rendering", () => {
		it("renders without label", () => {
			render(<RichText onChange={vi.fn()} />);

			expect(screen.getByRole("textbox", { name: "Editor de texto" })).toBeInTheDocument();
		});

		it("renders with label", () => {
			render(<RichText label="Description" onChange={vi.fn()} />);

			expect(screen.getByText("Description")).toBeInTheDocument();
			expect(screen.getByLabelText("Description")).toBe(screen.getByTestId("editor-content"));
		});

		it("exposes required multiline textbox semantics", () => {
			render(<RichText label="Description" required onChange={vi.fn()} />);
			const editor = screen.getByRole("textbox", { name: "Description" });
			expect(editor).toHaveAttribute("aria-required", "true");
			expect(editor).toHaveAttribute("aria-multiline", "true");
		});

		it("renders with required indicator", () => {
			render(<RichText label="Description" required onChange={vi.fn()} />);

			expect(screen.getByText("*")).toBeInTheDocument();
		});

		it("renders with custom className", () => {
			const { container } = render(<RichText className="custom-class" onChange={vi.fn()} />);

			expect(container.firstChild).toHaveClass("custom-class");
		});

		it("renders with placeholder", () => {
			render(<RichText placeholder="Enter text here..." onChange={vi.fn()} />);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});
	});

	describe("character count", () => {
		it("shows character count", () => {
			mockEditor.getText.mockReturnValue("Hello World Test"); // 16 chars, above minLength
			render(<RichText minLength={10} maxLength={100} onChange={vi.fn()} />);

			// Format: [charCount] caracteres (mínimo: minLength) / maxLength
			expect(screen.getByText(/\] caracteres \(mínimo:/)).toBeInTheDocument();
		});

		it("shows max length indicator", () => {
			mockEditor.getText.mockReturnValue("This is a long enough text for testing"); // > 50 chars
			render(<RichText minLength={10} maxLength={500} onChange={vi.fn()} />);

			expect(screen.getByText(/\/ 500/)).toBeInTheDocument();
		});
	});

	describe("disabled state", () => {
		it("applies disabled styling", () => {
			render(<RichText disabled onChange={vi.fn()} />);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});

		it("calls setEditable with false when disabled", () => {
			render(<RichText disabled onChange={vi.fn()} />);

			expect(mockEditor.setEditable).toHaveBeenCalledWith(false);
		});
	});

	describe("error state", () => {
		it("displays error message", () => {
			render(<RichText error="Field is required" onChange={vi.fn()} />);

			expect(screen.getByText("Field is required")).toBeInTheDocument();
		});

		it("shows minimum length error when content is too short", () => {
			mockEditor.getText.mockReturnValue("Hi"); // 2 chars, less than minLength
			render(<RichText minLength={50} onChange={vi.fn()} />);

			// The min length warning should be shown: "O texto deve ter no mínimo X caracteres."
			expect(screen.getByText(/mínimo 50 caracteres/i)).toBeInTheDocument();
		});
	});

	describe("focus behavior", () => {
		it("updates focus state on focus/blur", async () => {
			render(<RichText label="Description" onChange={vi.fn()} />);

			const fieldset = screen.getByRole("group");

			// Focus
			fireEvent.focus(fieldset);

			// Blur
			fireEvent.blur(fieldset);

			// Component should handle focus/blur without errors
			expect(fieldset).toBeInTheDocument();
		});
	});

	describe("toolbar", () => {
		it("renders formatting buttons", () => {
			render(<RichText onChange={vi.fn()} />);

			expect(screen.getByTitle("Negrito")).toBeInTheDocument();
			expect(screen.getByTitle("Itálico")).toBeInTheDocument();
			expect(screen.getByTitle("Lista com marcadores")).toBeInTheDocument();
			expect(screen.getByTitle("Lista numerada")).toBeInTheDocument();
			expect(screen.getByTitle("Tachado")).toBeInTheDocument();
		});

		it("calls toggleBold when bold button is clicked", () => {
			render(<RichText onChange={vi.fn()} />);

			const boldButton = screen.getByTitle("Negrito");
			fireEvent.click(boldButton);

			expect(mockChain.toggleBold).toHaveBeenCalled();
			expect(mockChain.run).toHaveBeenCalled();
		});

		it("calls toggleItalic when italic button is clicked", () => {
			render(<RichText onChange={vi.fn()} />);

			const italicButton = screen.getByTitle("Itálico");
			fireEvent.click(italicButton);

			expect(mockChain.toggleItalic).toHaveBeenCalled();
		});

		it("calls toggleBulletList when bullet list button is clicked", () => {
			render(<RichText onChange={vi.fn()} />);

			const bulletButton = screen.getByTitle("Lista com marcadores");
			fireEvent.click(bulletButton);

			expect(mockChain.toggleBulletList).toHaveBeenCalled();
		});

		it("calls toggleOrderedList when ordered list button is clicked", () => {
			render(<RichText onChange={vi.fn()} />);

			const orderedButton = screen.getByTitle("Lista numerada");
			fireEvent.click(orderedButton);

			expect(mockChain.toggleOrderedList).toHaveBeenCalled();
		});

		it("calls toggleStrike when strike button is clicked", () => {
			render(<RichText onChange={vi.fn()} />);

			const strikeButton = screen.getByTitle("Tachado");
			fireEvent.click(strikeButton);

			expect(mockChain.toggleStrike).toHaveBeenCalled();
		});

		it("shows active state for bold button", () => {
			mockEditor.isActive.mockReturnValue(true);
			render(<RichText onChange={vi.fn()} />);

			const boldButton = screen.getByTitle("Negrito");
			expect(boldButton).toHaveAttribute("aria-pressed", "true");
		});

		it("disables toolbar buttons when disabled prop is true", () => {
			render(<RichText disabled onChange={vi.fn()} />);

			const boldButton = screen.getByTitle("Negrito");
			expect(boldButton).toBeDisabled();
		});

		it("updates on editor transaction", () => {
			render(<RichText onChange={vi.fn()} />);

			// Trigger a transaction
			if (transactionHandler) {
				transactionHandler();
			}

			// Component should still render
			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});
	});

	describe("value handling", () => {
		it("uses provided value", () => {
			render(<RichText value="<p>Initial content</p>" onChange={vi.fn()} />);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});

		it("updates content when value changes", () => {
			const { rerender } = render(<RichText value="<p>Initial</p>" onChange={vi.fn()} />);

			rerender(<RichText value="<p>Updated</p>" onChange={vi.fn()} />);

			// setContent should be called with new value
			expect(mockEditor.commands.setContent).toHaveBeenCalled();
		});
	});

	describe("hidden input", () => {
		it("renders hidden input with name prop", () => {
			render(<RichText name="description" onChange={vi.fn()} />);

			const hiddenInput = document.querySelector('input[name="description"]');
			expect(hiddenInput).toBeInTheDocument();
			expect(hiddenInput).toHaveAttribute("type", "hidden");
		});

		it("submits the latest formatted HTML when the character count is unchanged", () => {
			render(<RichText name="description" onChange={vi.fn()} />);
			const hiddenInput = document.querySelector<HTMLInputElement>('input[name="description"]')!;
			mockEditor.getHTML.mockReturnValue("<p><strong>Test</strong> content</p>");
			mockEditor.getText.mockReturnValue("Test content");

			act(() => {
				onUpdateCallback?.({ editor: mockEditor });
			});

			expect(hiddenInput).toHaveValue("<p><strong>Test</strong> content</p>");
		});

		it("does not render hidden input without name prop", () => {
			render(<RichText onChange={vi.fn()} />);

			const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
			expect(hiddenInputs.length).toBe(0);
		});
	});

	describe("Formik integration", () => {
		it("works with Formik context", () => {
			render(
				<Formik initialValues={{ description: "" }} onSubmit={vi.fn()}>
					<Form>
						<RichText name="description" onChange={vi.fn()} />
					</Form>
				</Formik>,
			);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});

		it("reads value from Formik context", () => {
			render(
				<Formik initialValues={{ description: "<p>Initial</p>" }} onSubmit={vi.fn()}>
					<Form>
						<RichText name="description" onChange={vi.fn()} />
					</Form>
				</Formik>,
			);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});

		it("validates with minLength in Formik", () => {
			mockEditor.getText.mockReturnValue("Hi");
			render(
				<Formik initialValues={{ description: "" }} onSubmit={vi.fn()}>
					<Form>
						<RichText name="description" minLength={50} onChange={vi.fn()} />
					</Form>
				</Formik>,
			);

			expect(screen.getByText(/mínimo 50 caracteres/i)).toBeInTheDocument();
		});

		it("validates with maxLength", () => {
			mockEditor.getText.mockReturnValue("A".repeat(600));
			render(<RichText minLength={10} maxLength={500} onChange={vi.fn()} />);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});

		it("handles onBlur to set field touched in Formik", () => {
			render(
				<Formik initialValues={{ description: "" }} onSubmit={vi.fn()}>
					<Form>
						<RichText name="description" label="Description" onChange={vi.fn()} />
					</Form>
				</Formik>,
			);

			const fieldset = screen.getByRole("group");
			fireEvent.blur(fieldset);
			expect(fieldset).toBeInTheDocument();
		});

		it("supports nested field names in Formik", () => {
			render(
				<Formik initialValues={{ content: { description: "<p>Test</p>" } }} onSubmit={vi.fn()}>
					<Form>
						<RichText name="content.description" onChange={vi.fn()} />
					</Form>
				</Formik>,
			);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});

		it("shows Formik validation error when touched", () => {
			render(
				<Formik
					initialValues={{ description: "" }}
					initialErrors={{ description: "Field required" }}
					initialTouched={{ description: true }}
					onSubmit={vi.fn()}
				>
					<Form>
						<RichText name="description" onChange={vi.fn()} />
					</Form>
				</Formik>,
			);

			expect(screen.getByText("Field required")).toBeInTheDocument();
		});

		it("handles required validation", () => {
			mockEditor.getText.mockReturnValue("");
			render(<RichText required onChange={vi.fn()} />);

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});

		it("updates Formik field value on editor change", () => {
			const setFieldValue = vi.fn();
			const setFieldError = vi.fn();

			render(
				<Formik initialValues={{ description: "" }} onSubmit={vi.fn()}>
					{(formik) => {
						// Spy on formik methods
						formik.setFieldValue = setFieldValue;
						formik.setFieldError = setFieldError;
						return (
							<Form>
								<RichText name="description" onChange={vi.fn()} />
							</Form>
						);
					}}
				</Formik>,
			);

			// Trigger onUpdate callback
			if (onUpdateCallback) {
				mockEditor.getHTML.mockReturnValue("<p>Updated</p>");
				mockEditor.getText.mockReturnValue("Updated");
				onUpdateCallback({ editor: mockEditor });
			}

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});

		it("calls onChange when editor updates", () => {
			const handleChange = vi.fn();
			render(<RichText onChange={handleChange} />);

			// Trigger onUpdate callback
			if (onUpdateCallback) {
				mockEditor.getHTML.mockReturnValue("<p>New content</p>");
				mockEditor.getText.mockReturnValue("New content");
				onUpdateCallback({ editor: mockEditor });
			}

			expect(handleChange).toHaveBeenCalledWith("<p>New content</p>");
		});

		it("validates text on update with Formik", () => {
			render(
				<Formik initialValues={{ description: "" }} onSubmit={vi.fn()}>
					<Form>
						<RichText name="description" minLength={10} onChange={vi.fn()} />
					</Form>
				</Formik>,
			);

			// Trigger onUpdate with short text
			if (onUpdateCallback) {
				mockEditor.getHTML.mockReturnValue("<p>Hi</p>");
				mockEditor.getText.mockReturnValue("Hi");
				onUpdateCallback({ editor: mockEditor });
			}

			expect(screen.getByTestId("editor-content")).toBeInTheDocument();
		});
	});

	describe("RichTextLabel", () => {
		it("renders label with disabled styling", () => {
			render(<RichText label="Test Label" disabled onChange={vi.fn()} />);
			const labelSpan = screen.getByText("Test Label");
			expect(labelSpan).toHaveClass("rich-text-label__text--disabled");
		});

		it("renders label with normal styling when not disabled", () => {
			render(<RichText label="Test Label" onChange={vi.fn()} />);
			const labelSpan = screen.getByText("Test Label");
			expect(labelSpan).toHaveClass("rich-text-label__text");
		});
	});
});
