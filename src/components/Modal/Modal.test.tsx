import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { Modal } from "./Modal";

describe("Modal", () => {
	it("defaults to centered positioning and updates vertical position", () => {
		const { rerender } = render(<Modal isOpen title="Position" />);
		const dialog = screen.getByRole("dialog", { name: "Position" });
		expect(dialog).toHaveClass("modal-dialog--center");

		rerender(<Modal isOpen title="Position" verticalPosition="top" />);
		expect(dialog).toHaveClass("modal-dialog--top");

		rerender(<Modal isOpen title="Position" verticalPosition="bottom" />);
		expect(dialog).toHaveClass("modal-dialog--bottom");
	});

	it("renders title and description when open", () => {
		render(
			<Modal isOpen title="Detalhes da turma" description="Revise os dados antes de confirmar." />,
		);

		expect(screen.getByText("Detalhes da turma")).toBeInTheDocument();
		expect(screen.getByText("Revise os dados antes de confirmar.")).toBeInTheDocument();
	});

	it("uses dialog semantics and restores focus when it closes", async () => {
		const user = userEvent.setup();
		const returnFocusRef = React.createRef<HTMLButtonElement>();
		const onOpenChange = vi.fn();
		const { rerender } = render(
			<>
				<button ref={returnFocusRef}>Launch modal</button>
				<Modal
					isOpen
					title="Accessible dialog"
					onOpenChange={onOpenChange}
					returnFocusRef={returnFocusRef}
				/>
			</>,
		);

		const dialog = screen.getByRole("dialog", { name: "Accessible dialog" });
		expect(dialog).toHaveAttribute("aria-modal", "true");
		await user.click(screen.getByRole("button", { name: "Fechar modal" }));
		rerender(
			<>
				<button ref={returnFocusRef}>Launch modal</button>
				<Modal isOpen={false} title="Accessible dialog" returnFocusRef={returnFocusRef} />
			</>,
		);
		expect(returnFocusRef.current).toHaveFocus();
	});

	it("calls onOpenChange when close button is clicked", async () => {
		const user = userEvent.setup();
		const handleOpenChange = vi.fn();

		render(<Modal isOpen title="Fechar modal" onOpenChange={handleOpenChange} />);

		const closeButton = screen.getByRole("button", { name: /fechar modal/i });
		await user.click(closeButton);

		expect(handleOpenChange).toHaveBeenCalledWith(false);
	});

	it("closes when clicking on overlay", async () => {
		const user = userEvent.setup();
		const handleOpenChange = vi.fn();
		render(<Modal isOpen title="Overlay" onOpenChange={handleOpenChange} />);

		const overlay = document.body.querySelector('button[aria-hidden="true"]');
		expect(overlay).toBeTruthy();
		if (overlay) {
			await user.click(overlay);
		}

		expect(handleOpenChange).toHaveBeenCalledWith(false);
	});

	it("closes on Escape key press", () => {
		const handleOpenChange = vi.fn();
		render(<Modal isOpen title="Escape" onOpenChange={handleOpenChange} />);

		fireEvent.keyDown(document, { key: "Escape" });

		expect(handleOpenChange).toHaveBeenCalledWith(false);
	});

	it("disables footer actions when any action is loading", async () => {
		const user = userEvent.setup();
		render(
			<Modal
				isOpen
				title="Processando"
				actions={{
					primary: { label: "Confirmar", isLoading: true },
					secondary: { label: "Cancelar" },
				}}
			/>,
		);

		const primary = screen.getByRole("button", { name: "Confirmar" });
		const secondary = screen.getByRole("button", { name: "Cancelar" });

		expect(primary).toBeDisabled();
		expect(secondary).toBeDisabled();

		await user.click(primary);
		await user.click(secondary);
	});
});
