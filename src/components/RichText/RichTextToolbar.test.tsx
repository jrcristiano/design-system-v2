import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RichTextToolbar } from "./RichTextToolbar";

describe("RichTextToolbar", () => {
	const createMockEditor = () => {
		const mockChain = {
			focus: vi.fn(() => mockChain),
			toggleBold: vi.fn(() => mockChain),
			toggleItalic: vi.fn(() => mockChain),
			toggleStrike: vi.fn(() => mockChain),
			toggleBulletList: vi.fn(() => mockChain),
			toggleOrderedList: vi.fn(() => mockChain),
			run: vi.fn(),
		};

		let transactionHandler: (() => void) | null = null;

		return {
			editor: {
				isActive: vi.fn(() => false),
				chain: vi.fn(() => mockChain),
				on: vi.fn((event: string, handler: () => void) => {
					if (event === "transaction") {
						transactionHandler = handler;
					}
				}),
				off: vi.fn(),
			},
			mockChain,
			triggerTransaction: () => transactionHandler?.(),
		};
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it("renders toolbar buttons", () => {
		const { editor } = createMockEditor();
		render(<RichTextToolbar editor={editor as any} />);

		expect(screen.getByTitle("Negrito")).toBeInTheDocument();
		expect(screen.getByTitle("Itálico")).toBeInTheDocument();
		expect(screen.getByTitle("Lista com marcadores")).toBeInTheDocument();
		expect(screen.getByTitle("Lista numerada")).toBeInTheDocument();
		expect(screen.getByTitle("Tachado")).toBeInTheDocument();
	});

	it("handles null editor without crashing", () => {
		render(<RichTextToolbar editor={null} />);

		// Buttons should still render
		expect(screen.getByTitle("Negrito")).toBeInTheDocument();
		expect(screen.getByTitle("Itálico")).toBeInTheDocument();
	});

	it("does not register transaction handler when editor is null", () => {
		render(<RichTextToolbar editor={null} />);

		// Component should render without errors
		expect(screen.getByTitle("Negrito")).toBeInTheDocument();
	});

	it("registers transaction handler when editor is provided", () => {
		const { editor } = createMockEditor();
		render(<RichTextToolbar editor={editor as any} />);

		expect(editor.on).toHaveBeenCalledWith("transaction", expect.any(Function));
	});

	it("cleans up transaction handler on unmount", () => {
		const { editor } = createMockEditor();
		const { unmount } = render(<RichTextToolbar editor={editor as any} />);

		unmount();

		expect(editor.off).toHaveBeenCalledWith("transaction", expect.any(Function));
	});

	it("does not call cleanup when editor was null", () => {
		const { unmount, container } = render(<RichTextToolbar editor={null} />);

		// Component renders toolbar even with null editor
		expect(container.firstChild).not.toBeNull();

		// Should unmount without errors (no cleanup needed when editor is null)
		unmount();
	});

	it("updates on transaction", () => {
		const { editor, triggerTransaction } = createMockEditor();
		const { container } = render(<RichTextToolbar editor={editor as any} />);

		// Get initial tick value
		const toolbar = container.querySelector("[data-editor-tick]");
		const initialTick = toolbar?.getAttribute("data-editor-tick");

		// Trigger a transaction wrapped in act
		act(() => {
			triggerTransaction();
		});

		// Tick should have incremented
		const newTick = toolbar?.getAttribute("data-editor-tick");
		expect(Number(newTick)).toBe(Number(initialTick) + 1);
	});

	it("calls toggleBold when bold button is clicked", () => {
		const { editor, mockChain } = createMockEditor();
		render(<RichTextToolbar editor={editor as any} />);

		const boldButton = screen.getByTitle("Negrito");
		fireEvent.mouseDown(boldButton);

		expect(editor.chain).toHaveBeenCalled();
		expect(mockChain.focus).toHaveBeenCalled();
		expect(mockChain.toggleBold).toHaveBeenCalled();
		expect(mockChain.run).toHaveBeenCalled();
	});

	it("calls toggleItalic when italic button is clicked", () => {
		const { editor, mockChain } = createMockEditor();
		render(<RichTextToolbar editor={editor as any} />);

		const italicButton = screen.getByTitle("Itálico");
		fireEvent.mouseDown(italicButton);

		expect(mockChain.toggleItalic).toHaveBeenCalled();
	});

	it("calls toggleBulletList when bullet list button is clicked", () => {
		const { editor, mockChain } = createMockEditor();
		render(<RichTextToolbar editor={editor as any} />);

		const bulletButton = screen.getByTitle("Lista com marcadores");
		fireEvent.mouseDown(bulletButton);

		expect(mockChain.toggleBulletList).toHaveBeenCalled();
	});

	it("calls toggleOrderedList when ordered list button is clicked", () => {
		const { editor, mockChain } = createMockEditor();
		render(<RichTextToolbar editor={editor as any} />);

		const orderedButton = screen.getByTitle("Lista numerada");
		fireEvent.mouseDown(orderedButton);

		expect(mockChain.toggleOrderedList).toHaveBeenCalled();
	});

	it("calls toggleStrike when strike button is clicked", () => {
		const { editor, mockChain } = createMockEditor();
		render(<RichTextToolbar editor={editor as any} />);

		const strikeButton = screen.getByTitle("Tachado");
		fireEvent.mouseDown(strikeButton);

		expect(mockChain.toggleStrike).toHaveBeenCalled();
	});

	it("shows active state for buttons", () => {
		const { editor } = createMockEditor();
		editor.isActive.mockReturnValue(true);
		render(<RichTextToolbar editor={editor as any} />);

		const boldButton = screen.getByTitle("Negrito");
		expect(boldButton).toHaveAttribute("aria-pressed", "true");
	});

	it("disables buttons when disabled prop is true", () => {
		const { editor } = createMockEditor();
		render(<RichTextToolbar editor={editor as any} disabled />);

		expect(screen.getByTitle("Negrito")).toBeDisabled();
		expect(screen.getByTitle("Itálico")).toBeDisabled();
		expect(screen.getByTitle("Lista com marcadores")).toBeDisabled();
		expect(screen.getByTitle("Lista numerada")).toBeDisabled();
		expect(screen.getByTitle("Tachado")).toBeDisabled();
	});

	it("buttons are not disabled by default", () => {
		const { editor } = createMockEditor();
		render(<RichTextToolbar editor={editor as any} />);

		expect(screen.getByTitle("Negrito")).not.toBeDisabled();
	});

	it("handles click on button with null editor gracefully", () => {
		render(<RichTextToolbar editor={null} />);

		const boldButton = screen.getByTitle("Negrito");
		// Should not throw when clicking with null editor
		fireEvent.mouseDown(boldButton);

		expect(boldButton).toBeInTheDocument();
	});
});
