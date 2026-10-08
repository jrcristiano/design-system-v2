import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Accordion } from "./Accordion";

describe("Accordion", () => {
	it("renders with title", () => {
		render(<Accordion title="Section Title">Content</Accordion>);
		expect(screen.getByText("Section Title")).toBeInTheDocument();
	});

	it("accepts the legacy state prop without forwarding it to the DOM", () => {
		const { container } = render(
			<Accordion title="Legacy props" state="hover">
				Content
			</Accordion>,
		);
		expect(container.firstElementChild).not.toHaveAttribute("state");
	});

	it("is closed by default", () => {
		render(<Accordion title="Section">Content</Accordion>);
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-expanded", "false");
	});

	it("opens when clicked", async () => {
		const user = userEvent.setup();
		render(<Accordion title="Section">Content</Accordion>);

		const button = screen.getByRole("button");
		await user.click(button);

		expect(button).toHaveAttribute("aria-expanded", "true");
	});

	it("closes when clicked while open", async () => {
		const user = userEvent.setup();
		render(<Accordion title="Section">Content</Accordion>);

		const button = screen.getByRole("button");
		await user.click(button);
		expect(button).toHaveAttribute("aria-expanded", "true");

		await user.click(button);
		expect(button).toHaveAttribute("aria-expanded", "false");
	});

	it("shows content when open", async () => {
		const user = userEvent.setup();
		render(<Accordion title="Section">Hidden Content</Accordion>);

		await user.click(screen.getByRole("button"));
		expect(screen.getByText("Hidden Content")).toBeInTheDocument();
	});

	it("respects controlled isOpen prop", () => {
		const { rerender } = render(
			<Accordion title="Section" isOpen={false}>
				Content
			</Accordion>,
		);
		expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");

		rerender(
			<Accordion title="Section" isOpen={true}>
				Content
			</Accordion>,
		);
		expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
	});

	it("opens with Enter key", async () => {
		const user = userEvent.setup();
		render(<Accordion title="Section">Content</Accordion>);

		const button = screen.getByRole("button");
		button.focus();
		await user.keyboard("{Enter}");

		expect(button).toHaveAttribute("aria-expanded", "true");
	});

	it("opens with Space key", async () => {
		const user = userEvent.setup();
		render(<Accordion title="Section">Content</Accordion>);

		const button = screen.getByRole("button");
		button.focus();
		await user.keyboard(" ");

		expect(button).toHaveAttribute("aria-expanded", "true");
	});

	it("applies custom className", () => {
		render(
			<Accordion title="Section" className="custom-accordion">
				Content
			</Accordion>,
		);
		const container = screen.getByText("Section").closest("div[class*='rounded']");
		expect(container).toHaveClass("custom-accordion");
	});

	it("renders children content correctly", async () => {
		const user = userEvent.setup();
		render(
			<Accordion title="Section">
				<div data-testid="child-content">
					<p>Paragraph 1</p>
					<p>Paragraph 2</p>
				</div>
			</Accordion>,
		);

		await user.click(screen.getByRole("button"));
		expect(screen.getByTestId("child-content")).toBeInTheDocument();
		expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
		expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
	});

	it("keeps opened content mounted but removes it from focus order when collapsed", async () => {
		const user = userEvent.setup();
		render(
			<Accordion title="Focusable content">
				<button type="button">Inner action</button>
			</Accordion>,
		);

		const toggle = screen.getByRole("button", { name: "Focusable content" });
		await user.click(toggle);
		const panel = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
		const innerAction = screen.getByRole("button", { name: "Inner action" });
		expect(panel).not.toHaveAttribute("inert");

		await user.click(toggle);
		expect(innerAction).toBeInTheDocument();
		expect(panel).toHaveAttribute("inert");
		expect(panel).toHaveAttribute("aria-hidden", "true");
	});

	it("handles mouse events for styling", async () => {
		const user = userEvent.setup();
		render(<Accordion title="Hover Me">Content</Accordion>);

		const container = screen.getByText("Hover Me").closest("div[class*='rounded']");
		await user.hover(container!);
		await user.unhover(container!);
		expect(container).toBeInTheDocument();
	});

	it("handles focus and blur events for styling", async () => {
		const user = userEvent.setup();
		render(<Accordion title="Focus Me">Content</Accordion>);

		const button = screen.getByRole("button");
		await user.tab();
		expect(button).toHaveFocus();

		await user.tab();
		expect(button).not.toHaveFocus();
	});

	it("handles mouse down and up events", async () => {
		const user = userEvent.setup();
		render(<Accordion title="Press Me">Content</Accordion>);

		const button = screen.getByRole("button");
		await user.pointer({ keys: "[MouseLeft>]", target: button });
		await user.pointer({ keys: "[/MouseLeft]", target: button });
		expect(button).toBeInTheDocument();
	});

	it("does not change internal state when controlledState is set", async () => {
		const user = userEvent.setup();
		render(
			<Accordion title="Controlled State" state="default">
				Content
			</Accordion>,
		);

		const container = screen.getByText("Controlled State").closest("div[class*='rounded']");
		await user.hover(container!);
		await user.unhover(container!);
		expect(container).toBeInTheDocument();
	});

	it("handles focus/blur with controlled state", async () => {
		const user = userEvent.setup();
		render(
			<Accordion title="Controlled Focus" state="default">
				Content
			</Accordion>,
		);

		const button = screen.getByRole("button");
		await user.tab();
		await user.tab();
		expect(button).not.toHaveFocus();
	});

	it("handles press with controlled state", async () => {
		const user = userEvent.setup();
		render(
			<Accordion title="Controlled Press" state="hover">
				Content
			</Accordion>,
		);

		const button = screen.getByRole("button");
		await user.pointer({ keys: "[MouseLeft>]", target: button });
		await user.pointer({ keys: "[/MouseLeft]", target: button });
		expect(button).toBeInTheDocument();
	});

	it("does not update internal state when controlled with isOpen prop", async () => {
		const user = userEvent.setup();
		render(
			<Accordion title="Controlled Open" isOpen={true}>
				Content
			</Accordion>,
		);

		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-expanded", "true");

		// Clicking should not change the open state because it's controlled
		await user.click(button);
		expect(button).toHaveAttribute("aria-expanded", "true");
	});

	it("does not toggle when controlled isOpen is false", async () => {
		const user = userEvent.setup();
		render(
			<Accordion title="Controlled Closed" isOpen={false}>
				Content
			</Accordion>,
		);

		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-expanded", "false");

		// Clicking should not change the open state because it's controlled
		await user.click(button);
		expect(button).toHaveAttribute("aria-expanded", "false");
	});
});
