import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
	it("renders children", () => {
		render(
			<Tooltip content="Tooltip text">
				<button>Hover me</button>
			</Tooltip>,
		);
		expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
	});

	it("shows tooltip on hover", async () => {
		const user = userEvent.setup();
		render(
			<Tooltip content="Tooltip text" delay={0}>
				<button>Hover me</button>
			</Tooltip>,
		);

		await user.hover(screen.getByRole("button"));

		await waitFor(() => {
			expect(screen.getByText("Tooltip text")).toBeInTheDocument();
		});
	});

	it("hides tooltip on mouse leave", async () => {
		const user = userEvent.setup();
		render(
			<Tooltip content="Tooltip text" delay={0}>
				<button>Hover me</button>
			</Tooltip>,
		);

		const button = screen.getByRole("button");
		await user.hover(button);

		await waitFor(() => {
			expect(screen.getByText("Tooltip text")).toBeInTheDocument();
		});

		await user.unhover(button);

		// Tippy sets visibility: hidden instead of removing from DOM
		await waitFor(() => {
			const tooltipRoot = document.querySelector("[data-tippy-root]");
			expect(tooltipRoot).toHaveStyle({ visibility: "hidden" });
		});
	});

	it("renders with title", async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title="Title" content="Content" delay={0}>
				<button>Hover me</button>
			</Tooltip>,
		);

		await user.hover(screen.getByRole("button"));

		await waitFor(() => {
			expect(screen.getByText("Title")).toBeInTheDocument();
			expect(screen.getByText("Content")).toBeInTheDocument();
		});
	});

	it("does not show tooltip when disabled", async () => {
		const user = userEvent.setup();
		render(
			<Tooltip content="Tooltip text" disabled delay={0}>
				<button>Hover me</button>
			</Tooltip>,
		);

		await user.hover(screen.getByRole("button"));

		await waitFor(
			() => {
				expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();
			},
			{ timeout: 500 },
		);
	});

	it("applies custom className", async () => {
		const user = userEvent.setup();
		render(
			<Tooltip content="Tooltip text" className="custom-tooltip" delay={0}>
				<button>Hover me</button>
			</Tooltip>,
		);

		await user.hover(screen.getByRole("button"));

		await waitFor(() => {
			const tooltipContent = screen.getByText("Tooltip text").closest("div");
			expect(tooltipContent).toHaveClass("custom-tooltip");
		});
	});

	it("shows tooltip on focus", async () => {
		const user = userEvent.setup();
		render(
			<Tooltip content="Tooltip text" delay={0}>
				<button>Focus me</button>
			</Tooltip>,
		);

		await user.tab();

		await waitFor(() => {
			expect(screen.getByText("Tooltip text")).toBeInTheDocument();
		});
	});
});
