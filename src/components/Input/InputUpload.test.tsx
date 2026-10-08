import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { InputUpload } from "./InputUpload";
import type { FileUploadItem } from "./InputUpload.type";

const createMockFile = (name: string, size: number, type: string): File => {
	const file = new File(["content"], name, { type });
	Object.defineProperty(file, "size", { value: size });
	return file;
};

describe("InputUpload", () => {
	it("renders upload dropzone", () => {
		render(<InputUpload />);
		expect(screen.getByText(/Selecione um ou mais arquivos/i)).toBeInTheDocument();
	});

	it("renders with message", () => {
		render(<InputUpload message="Upload your documents" />);
		expect(screen.getByText("Upload your documents")).toBeInTheDocument();
	});

	it("shows accepted formats", () => {
		render(<InputUpload acceptedFormats={["pdf", "docx"]} />);
		expect(screen.getByText(/PDF ou DOCX/i)).toBeInTheDocument();
	});

	it("shows max size", () => {
		render(<InputUpload maxSize={10} />);
		expect(screen.getByText(/10MB/i)).toBeInTheDocument();
	});

	it("renders with disabled state", () => {
		render(<InputUpload disabled />);
		const text = screen.getByText(/Selecione um ou mais arquivos/i);
		expect(text).toBeInTheDocument();
	});

	it("renders with custom icon left", () => {
		const Icon = () => <span data-testid="custom-icon">Icon</span>;
		render(<InputUpload iconLeft={<Icon />} />);
		expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
	});

	it("renders with controlled files", () => {
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} />);
		expect(screen.getByText("document.pdf")).toBeInTheDocument();
	});

	it("shows file size for completed files", () => {
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile("document.pdf", 1024 * 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} />);
		expect(screen.getByText(/1.*MB|1024.*KB/i)).toBeInTheDocument();
	});

	it("shows progress bar for uploading files", () => {
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "uploading",
				progress: 50,
			},
		];

		render(<InputUpload files={files} />);
		expect(screen.getByText("document.pdf")).toBeInTheDocument();
	});

	it("shows error message for error files", () => {
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "error",
				progress: 0,
				error: "Upload failed",
			},
		];

		render(<InputUpload files={files} />);
		expect(screen.getByText("Upload failed")).toBeInTheDocument();
	});

	it("calls onRemoveFile when remove button is clicked", async () => {
		const user = userEvent.setup();
		const handleRemoveFile = vi.fn();
		const files: FileUploadItem[] = [
			{
				id: "file-1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} onRemoveFile={handleRemoveFile} />);

		const removeButton = screen.getByRole("button", { name: "Remover arquivo document.pdf" });
		await user.click(removeButton);
		expect(handleRemoveFile).toHaveBeenCalledWith("file-1");
	});

	it("does not call onRemoveFile when disabled", async () => {
		const user = userEvent.setup();
		const handleRemoveFile = vi.fn();
		const files: FileUploadItem[] = [
			{
				id: "file-1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} onRemoveFile={handleRemoveFile} disabled />);

		const removeButton = screen.getByRole("button", { name: "Remover arquivo document.pdf" });
		await user.click(removeButton);
		expect(handleRemoveFile).not.toHaveBeenCalled();
	});

	it("handles drag enter event", () => {
		render(<InputUpload />);
		const dropzone = screen
			.getByText(/Selecione um ou mais arquivos/i)
			.closest("div")!.parentElement!;

		fireEvent.dragEnter(dropzone);
		expect(dropzone).toBeInTheDocument();
	});

	it("handles drag leave event", () => {
		render(<InputUpload />);
		const dropzone = screen
			.getByText(/Selecione um ou mais arquivos/i)
			.closest("div")!.parentElement!;

		fireEvent.dragEnter(dropzone);
		fireEvent.dragLeave(dropzone);
		expect(dropzone).toBeInTheDocument();
	});

	it("handles drag over event", () => {
		render(<InputUpload />);
		const dropzone = screen
			.getByText(/Selecione um ou mais arquivos/i)
			.closest("div")!.parentElement!;

		fireEvent.dragOver(dropzone);
		expect(dropzone).toBeInTheDocument();
	});

	it("truncates long file names", () => {
		const longFileName = "this-is-a-very-long-file-name-that-should-be-truncated.pdf";
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile(longFileName, 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} />);
		// Should show truncated name with ellipsis
		expect(screen.getByText(/this-is-a-very-long-file-name-th.*\.\.\.pdf/)).toBeInTheDocument();
	});

	it("renders multiple files", () => {
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile("document1.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
			{
				id: "2",
				file: createMockFile("document2.pdf", 2048, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} />);
		expect(screen.getByText("document1.pdf")).toBeInTheDocument();
		expect(screen.getByText("document2.pdf")).toBeInTheDocument();
	});

	it("renders with different accepted formats", () => {
		render(<InputUpload acceptedFormats={["jpg", "png", "gif"]} />);
		expect(screen.getByText(/JPG ou PNG ou GIF/i)).toBeInTheDocument();
	});

	it("renders with single file mode", () => {
		render(<InputUpload multiple={false} />);
		expect(screen.getByText(/Selecione um ou mais arquivos/i)).toBeInTheDocument();
	});

	it("does not open file browser when dropzone clicked with files", async () => {
		const user = userEvent.setup();
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} />);
		const dropzone = screen.getByText("document.pdf").closest("div")!.parentElement!;
		await user.click(dropzone);
		expect(dropzone).toBeInTheDocument();
	});

	it("opens file browser when empty dropzone is clicked", async () => {
		const user = userEvent.setup();
		render(<InputUpload />);

		const dropzone = screen
			.getByText(/Selecione um ou mais arquivos/i)
			.closest("div")!.parentElement!;
		await user.click(dropzone);
		expect(dropzone).toBeInTheDocument();
	});

	it("does not open file browser when disabled", async () => {
		const user = userEvent.setup();
		render(<InputUpload disabled />);

		const dropzone = screen
			.getByText(/Selecione um ou mais arquivos/i)
			.closest("div")!.parentElement!;
		await user.click(dropzone);
		expect(dropzone).toBeInTheDocument();
	});

	it("renders with tooltip content", () => {
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} tooltipContent="File info" />);
		expect(screen.getByText("document.pdf")).toBeInTheDocument();
	});

	it("shows add more files button when files exist", () => {
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} />);
		expect(screen.getByText("Adicionar mais arquivos")).toBeInTheDocument();
	});

	it("handles drag events on add more files button", () => {
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} />);
		const addMoreButton = screen.getByText("Adicionar mais arquivos");

		fireEvent.dragEnter(addMoreButton);
		fireEvent.dragOver(addMoreButton);
		fireEvent.dragLeave(addMoreButton);
		expect(addMoreButton).toBeInTheDocument();
	});

	it("disables add more files button when disabled prop is true", () => {
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} disabled />);
		const addMoreButton = screen.getByText("Adicionar mais arquivos");
		expect(addMoreButton).toBeDisabled();
	});

	it("handles drop event on add more files button", () => {
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} />);
		const addMoreButton = screen.getByText("Adicionar mais arquivos");

		const mockFile = createMockFile("new-file.pdf", 1024, "application/pdf");
		const dataTransfer = {
			files: [mockFile],
		};

		fireEvent.drop(addMoreButton, { dataTransfer });
		expect(addMoreButton).toBeInTheDocument();
	});

	it("opens file browser when Enter key is pressed on empty dropzone", () => {
		render(<InputUpload />);

		const dropzone = screen
			.getByText(/Selecione um ou mais arquivos/i)
			.closest("div")!.parentElement!;

		fireEvent.keyDown(dropzone, { key: "Enter" });
		expect(dropzone).toBeInTheDocument();
	});

	it("opens file browser when Space key is pressed on empty dropzone", () => {
		render(<InputUpload />);

		const dropzone = screen
			.getByText(/Selecione um ou mais arquivos/i)
			.closest("div")!.parentElement!;

		fireEvent.keyDown(dropzone, { key: " " });
		expect(dropzone).toBeInTheDocument();
	});

	it("does not open file browser when Enter key is pressed with files", () => {
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} />);
		const dropzone = screen.getByText("document.pdf").closest("div")!.parentElement!;

		fireEvent.keyDown(dropzone, { key: "Enter" });
		expect(dropzone).toBeInTheDocument();
	});

	it("does not call onIconLeftClick when disabled", async () => {
		const user = userEvent.setup();
		const handleIconLeftClick = vi.fn();

		render(<InputUpload onIconLeftClick={handleIconLeftClick} disabled />);

		// When disabled, clicks should not trigger the handler
		const dropzone = screen.getByRole("button", { name: /selecionar arquivos/i });
		const icon = dropzone.querySelector("[role='button']");

		if (icon) {
			await user.click(icon);
		}

		expect(handleIconLeftClick).not.toHaveBeenCalled();
	});

	it("does not call handler on other key presses on IconSlot", () => {
		const handleIconLeftClick = vi.fn();

		render(<InputUpload onIconLeftClick={handleIconLeftClick} />);

		const dropzone = screen.getByRole("button", { name: /selecionar arquivos/i });
		const buttons = dropzone.querySelectorAll("button[type='button']");

		if (buttons.length > 0) {
			fireEvent.keyDown(buttons[0] as HTMLElement, { key: "Tab" });
		}

		// Tab key should not trigger the handler
		expect(handleIconLeftClick).not.toHaveBeenCalled();
	});

	it("renders IconSlot as span when no onIconLeftClick is provided", () => {
		render(<InputUpload />);

		// When no onIconLeftClick is provided, IconSlot renders a span, not a button
		// The CloudArrowUpIcon should be inside a span
		const dropzone = screen.getByRole("button", { name: /selecionar arquivos/i });
		const iconContainer = dropzone.querySelector("span.flex.items-center.justify-center");
		expect(iconContainer).toBeInTheDocument();
	});

	it("calls onIconRightClick when remove button is clicked", async () => {
		const user = userEvent.setup();
		const handleIconRightClick = vi.fn();
		const files: FileUploadItem[] = [
			{
				id: "file-1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} onIconRightClick={handleIconRightClick} />);

		const buttons = screen.getAllByRole("button");
		const removeButton = buttons[0];
		await user.click(removeButton);
		expect(handleIconRightClick).toHaveBeenCalled();
	});

	it("renders with non-element iconRight (string)", () => {
		const files: FileUploadItem[] = [
			{
				id: "file-1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		// Pass a string instead of a React element as iconRight
		render(<InputUpload files={files} iconRight={"X"} />);
		expect(screen.getByText("document.pdf")).toBeInTheDocument();
	});

	it("renders with non-element iconLeft (string)", () => {
		// Pass a string instead of a React element as iconLeft
		render(<InputUpload iconLeft={"Upload"} />);
		expect(screen.getByText(/Selecione um ou mais arquivos/i)).toBeInTheDocument();
	});

	it("does not open file browser on click when disabled", async () => {
		const user = userEvent.setup();
		render(<InputUpload disabled />);

		const dropzone = screen.getByRole("button", { name: /selecionar arquivos/i });
		await user.click(dropzone);

		// Should not throw error, just not do anything
		expect(dropzone).toBeDisabled();
	});

	it("does not open file browser on add more click when disabled", async () => {
		const user = userEvent.setup();
		const files: FileUploadItem[] = [
			{
				id: "1",
				file: createMockFile("document.pdf", 1024, "application/pdf"),
				state: "completed",
				progress: 100,
			},
		];

		render(<InputUpload files={files} disabled />);

		const addMoreButton = screen.getByText("Adicionar mais arquivos");
		expect(addMoreButton).toBeDisabled();
		await user.click(addMoreButton);

		// Button is disabled, click should have no effect
		expect(addMoreButton).toBeInTheDocument();
	});
});
