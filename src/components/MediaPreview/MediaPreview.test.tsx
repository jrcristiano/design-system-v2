import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MediaPreview from "./MediaPreview";

describe("MediaPreview", () => {
	const originalCreateObjectURL = URL.createObjectURL;
	const originalRevokeObjectURL = URL.revokeObjectURL;
	let openSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
		Object.defineProperty(URL, "createObjectURL", {
			value: vi.fn(() => "blob:mock"),
			configurable: true,
		});
		Object.defineProperty(URL, "revokeObjectURL", {
			value: vi.fn(),
			configurable: true,
		});
	});

	afterEach(() => {
		openSpy.mockRestore();
		Object.defineProperty(URL, "createObjectURL", {
			value: originalCreateObjectURL,
			configurable: true,
		});
		Object.defineProperty(URL, "revokeObjectURL", {
			value: originalRevokeObjectURL,
			configurable: true,
		});
	});

	it("renders label with file summary", () => {
		render(<MediaPreview label="Preview" maxTotalSizeMb={10} />);
		expect(screen.getByText("Preview")).toBeInTheDocument();
		expect(screen.getByText("0 arquivos • 0 KB / 10.00 MB max")).toBeInTheDocument();
	});

	it("adds a file and shows it in the list", async () => {
		const user = userEvent.setup();
		render(<MediaPreview label="Preview" multiple />);

		const input = screen.getByLabelText("Preview") as HTMLInputElement;
		const file = new File(["image"], "foto.jpg", { type: "image/jpeg" });
		await user.upload(input, file);

		expect(screen.getByText("foto.jpg")).toBeInTheDocument();
	});

	it("shows newest file first when uploading multiple files", async () => {
		const user = userEvent.setup();
		const { container } = render(<MediaPreview label="Preview" multiple />);

		const input = screen.getByLabelText("Preview") as HTMLInputElement;
		const first = new File(["first"], "primeiro.png", { type: "image/png" });
		const second = new File(["second"], "segundo.png", { type: "image/png" });
		await user.upload(input, [first, second]);

		const headings = Array.from(container.querySelectorAll("h6")).map(
			(element) => element.textContent,
		);
		expect(headings[0]).toBe("segundo.png");
		expect(headings[1]).toBe("primeiro.png");
	});

	it("shows validation error for unsupported extension", async () => {
		render(<MediaPreview label="Preview" />);

		const file = new File(["data"], "arquivo.exe", { type: "application/octet-stream" });
		const dropzone = screen.getByRole("button", { name: /clique para fazer upload/i });
		const dataTransfer =
			typeof DataTransfer !== "undefined"
				? (() => {
						const transfer = new DataTransfer();
						transfer.items.add(file);
						return transfer;
					})()
				: { files: [file] };
		fireEvent.drop(dropzone, { dataTransfer });

		expect(
			await screen.findByText(/Formato de arquivo não suportado/i, {}, { timeout: 2000 }),
		).toBeInTheDocument();
	});

	it("removes item when clicking trash button", async () => {
		const user = userEvent.setup();
		render(<MediaPreview label="Preview" multiple />);

		const input = screen.getByLabelText("Preview") as HTMLInputElement;
		const file = new File(["file"], "remover.pdf", { type: "application/pdf" });
		await user.upload(input, file);

		const removeButton = screen.getByLabelText("Remover arquivo");
		await user.click(removeButton);

		expect(screen.queryByText("remover.pdf")).not.toBeInTheDocument();
	});
});
