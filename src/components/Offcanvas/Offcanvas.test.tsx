import React, { useState } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import {
	Offcanvas,
	OffcanvasHeader,
	OffcanvasTitle,
	OffcanvasDescription,
	OffcanvasBody,
	OffcanvasFooter,
} from "./index";
import { Modal } from "../Modal/Modal";

// JSDOM does not implement the native dialog lifecycle. Keyboard containment is tested in Chromium stories.
beforeEach(() => {
	Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
		configurable: true,
		value: vi.fn(function (this: HTMLDialogElement) {
			this.setAttribute("open", "");
			this.querySelector<HTMLElement>("button, input")?.focus();
		}),
	});
	Object.defineProperty(HTMLDialogElement.prototype, "close", {
		configurable: true,
		value: vi.fn(function (this: HTMLDialogElement) {
			this.removeAttribute("open");
		}),
	});
});
afterEach(() => {
	cleanup();
	Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
	Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
	vi.restoreAllMocks();
	vi.useRealTimers();
});

describe("Offcanvas", () => {
	it("renders semantic slots with automatic ARIA associations", () => {
		render(
			<Offcanvas open onOpenChange={vi.fn()}>
				<OffcanvasHeader>
					<OffcanvasTitle>Preferências</OffcanvasTitle>
					<OffcanvasDescription>Personalize</OffcanvasDescription>
				</OffcanvasHeader>
				<OffcanvasBody>Conteúdo</OffcanvasBody>
				<OffcanvasFooter>
					<button>Salvar</button>
				</OffcanvasFooter>
			</Offcanvas>,
		);
		const dialog = screen.getByRole("dialog", { name: "Preferências" });
		expect(dialog).toHaveAttribute("aria-modal", "true");
		expect(dialog).toHaveAccessibleDescription("Personalize");
		expect(screen.getByText("Conteúdo")).toBeVisible();
		expect(screen.getByRole("button", { name: "Salvar" })).toBeVisible();
	});
	it("stays nonmodal when closed and renders safely on the server", () => {
		render(<Offcanvas open={false} onOpenChange={vi.fn()} aria-label="Painel" />);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
		expect(renderToString(<Offcanvas open onOpenChange={vi.fn()} aria-label="Painel" />)).toBe("");
	});
	it("opens and closes through controlled state and restores focus and scroll", async () => {
		const user = userEvent.setup();
		document.body.style.overflow = "scroll";
		function Example() {
			const [open, setOpen] = useState(false);
			return (
				<>
					<button onClick={() => setOpen(true)}>Abrir</button>
					<Offcanvas open={open} onOpenChange={setOpen} aria-label="Painel" />
				</>
			);
		}
		render(<Example />);
		await user.click(screen.getByText("Abrir"));
		expect(document.body.style.overflow).toBe("hidden");
		await user.click(screen.getByRole("button", { name: "Fechar painel" }));
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		expect(screen.getByText("Abrir")).toHaveFocus();
		expect(document.body.style.overflow).toBe("scroll");
		document.body.style.overflow = "";
	});
	it("handles native Escape cancellation once and supports disabling it", () => {
		const change = vi.fn();
		const { rerender } = render(<Offcanvas open onOpenChange={change} aria-label="Painel" />);
		const dialog = screen.getByRole("dialog");
		fireEvent(dialog, new Event("cancel", { cancelable: true }));
		fireEvent(dialog, new Event("cancel", { cancelable: true }));
		expect(change).toHaveBeenCalledExactlyOnceWith(false);
		rerender(<Offcanvas open onOpenChange={change} closeOnEsc={false} aria-label="Painel" />);
		change.mockClear();
		fireEvent(dialog, new Event("cancel", { cancelable: true }));
		expect(change).not.toHaveBeenCalled();
	});
	it("handles Escape keydown and respects a prevented consumer event", () => {
		const change = vi.fn();
		const onKeyDown = vi.fn((event: React.KeyboardEvent<HTMLDialogElement>) =>
			event.preventDefault(),
		);
		const { rerender } = render(
			<Offcanvas open onOpenChange={change} onKeyDown={onKeyDown} aria-label="Painel" />,
		);
		const dialog = screen.getByRole("dialog");

		fireEvent.keyDown(dialog, { key: "Escape" });
		expect(onKeyDown).toHaveBeenCalledOnce();
		expect(change).not.toHaveBeenCalled();

		rerender(<Offcanvas open onOpenChange={change} aria-label="Painel" />);
		fireEvent.keyDown(dialog, { key: "Escape" });
		expect(change).toHaveBeenCalledExactlyOnceWith(false);
	});
	it("closes only for a gesture starting and ending on the backdrop", () => {
		const change = vi.fn();
		const { rerender } = render(<Offcanvas open onOpenChange={change} aria-label="Painel" />);
		const dialog = screen.getByRole("dialog");
		vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({
			left: 10,
			right: 100,
			top: 10,
			bottom: 100,
		} as DOMRect);
		fireEvent.click(dialog, { clientX: 50, clientY: 50 });
		expect(change).not.toHaveBeenCalled();
		// PointerEvent is not implemented by all JSDOM versions; provide coordinates explicitly.
		const down = new Event("pointerdown", { bubbles: true });
		Object.assign(down, { clientX: 0, clientY: 0 });
		fireEvent(dialog, down);
		fireEvent.click(dialog, { clientX: 0, clientY: 0 });
		expect(change).toHaveBeenCalledExactlyOnceWith(false);
		rerender(<Offcanvas open={false} onOpenChange={change} aria-label="Painel" />);
		rerender(
			<Offcanvas open onOpenChange={change} closeOnOverlayClick={false} aria-label="Painel" />,
		);
		change.mockClear();
		fireEvent(dialog, down);
		fireEvent.click(dialog, { clientX: 0, clientY: 0 });
		expect(change).not.toHaveBeenCalled();
	});
	it.each(["left", "right", "top", "bottom"] as const)(
		"supports %s positioning and all sizes",
		(side) => {
			const { rerender } = render(
				<Offcanvas
					open
					onOpenChange={vi.fn()}
					side={side}
					aria-label="Painel"
					className="custom"
				/>,
			);
			const dialog = screen.getByRole("dialog");
			expect(dialog).toHaveAttribute("data-side", side);
			for (const size of ["sm", "md", "lg"] as const) {
				rerender(
					<Offcanvas
						open
						onOpenChange={vi.fn()}
						side={side}
						size={size}
						aria-label="Painel"
						className="custom"
					/>,
				);
				expect(dialog).toHaveAttribute("data-size", size);
			}
			expect(dialog).toHaveClass("ds-offcanvas", "custom");
		},
	);
	it("focuses an explicit target without reopening on callback updates", () => {
		const initialFocusRef = React.createRef<HTMLInputElement>();
		const { rerender } = render(
			<Offcanvas open initialFocusRef={initialFocusRef} onOpenChange={vi.fn()} aria-label="Painel">
				<input ref={initialFocusRef} aria-label="Nome" />
			</Offcanvas>,
		);
		expect(screen.getByRole("textbox")).toHaveFocus();
		rerender(
			<Offcanvas open initialFocusRef={initialFocusRef} onOpenChange={vi.fn()} aria-label="Painel">
				<input ref={initialFocusRef} aria-label="Nome" />
			</Offcanvas>,
		);
		expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
	});
	it("retains the modal during exit, cancels pending exit on reopening and cleans up on unmount", () => {
		vi.useFakeTimers();
		const { rerender, unmount } = render(
			<Offcanvas
				open
				onOpenChange={vi.fn()}
				aria-label="Painel"
				style={{ transitionDuration: "0.2s", transitionDelay: "0s" }}
			/>,
		);
		rerender(
			<Offcanvas
				open={false}
				onOpenChange={vi.fn()}
				aria-label="Painel"
				style={{ transitionDuration: "0.2s", transitionDelay: "0s" }}
			/>,
		);
		expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "closing");
		act(() => vi.advanceTimersByTime(100));
		rerender(<Offcanvas open onOpenChange={vi.fn()} aria-label="Painel" />);
		act(() => vi.advanceTimersByTime(200));
		expect(screen.getByRole("dialog")).toHaveAttribute("open");
		unmount();
		expect(document.body.style.overflow).not.toBe("hidden");
		expect(vi.getTimerCount()).toBe(0);
	});
	it("shares scroll locks with Modal", () => {
		const { rerender, unmount } = render(
			<>
				<Modal isOpen title="Modal" />
				<Offcanvas open onOpenChange={vi.fn()} aria-label="Painel" />
			</>,
		);
		rerender(
			<>
				<Modal isOpen title="Modal" />
				<Offcanvas open={false} onOpenChange={vi.fn()} aria-label="Painel" />
			</>,
		);
		expect(document.body.style.overflow).toBe("hidden");
		unmount();
		expect(document.body.style.overflow).not.toBe("hidden");
	});
});
