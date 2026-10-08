import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Step } from "./Step";

describe("Step", () => {
	it("renders with label", () => {
		render(<Step stepKey={1}>Step Label</Step>);
		expect(screen.getByText("Step Label")).toBeInTheDocument();
	});

	it("renders step number", () => {
		render(<Step stepKey={1}>Step 1</Step>);
		expect(screen.getByText("1")).toBeInTheDocument();
	});

	it("calls onClick when clicked", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		render(
			<Step stepKey={1} onClick={handleClick}>
				Clickable Step
			</Step>,
		);

		await user.click(screen.getByText("Clickable Step"));
		expect(handleClick).toHaveBeenCalledWith(1);
	});

	it("does not call onClick when disabled", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		render(
			<Step stepKey={1} disabled onClick={handleClick}>
				Disabled Step
			</Step>,
		);

		await user.click(screen.getByText("Disabled Step"));
		expect(handleClick).not.toHaveBeenCalled();
	});

	it("renders with default status", () => {
		render(<Step stepKey={1}>Default Step</Step>);
		expect(screen.getByText("Default Step")).toBeInTheDocument();
	});

	it("renders with active status", () => {
		render(
			<Step stepKey={1} status="active">
				Active Step
			</Step>,
		);
		expect(screen.getByText("Active Step")).toBeInTheDocument();
	});

	it("renders with completed status - shows check icon", () => {
		render(
			<Step stepKey={1} status="completed">
				Completed Step
			</Step>,
		);
		// When completed, should not show the number
		expect(screen.queryByText("1")).not.toBeInTheDocument();
	});

	it("renders with focused status", () => {
		render(
			<Step stepKey={1} status="focused">
				Focused Step
			</Step>,
		);
		expect(screen.getByText("Focused Step")).toBeInTheDocument();
	});

	it("renders connector when not last step", () => {
		const { container } = render(
			<Step stepKey={1} isLast={false}>
				Not Last Step
			</Step>,
		);
		// Connector should be present
		expect(container.querySelector(".border-dashed")).toBeInTheDocument();
	});

	it("does not render connector when last step", () => {
		const { container } = render(
			<Step stepKey={1} isLast={true}>
				Last Step
			</Step>,
		);
		// No connector for last step
		expect(container.querySelectorAll(".border-dashed").length).toBe(0);
	});

	it("handles string stepKey", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		render(
			<Step stepKey="step-1" onClick={handleClick}>
				String Key Step
			</Step>,
		);

		await user.click(screen.getByText("String Key Step"));
		expect(handleClick).toHaveBeenCalledWith("step-1");
	});

	it("applies cursor-not-allowed when disabled", () => {
		const { container } = render(
			<Step stepKey={1} disabled>
				Disabled
			</Step>,
		);
		expect(container.querySelector(".cursor-not-allowed")).toBeInTheDocument();
	});

	it("applies cursor-pointer when not disabled", () => {
		const { container } = render(<Step stepKey={1}>Enabled</Step>);
		expect(container.querySelector(".cursor-pointer")).toBeInTheDocument();
	});

	it("renders step key as number in circle", () => {
		render(<Step stepKey={5}>Step Five</Step>);
		expect(screen.getByText("5")).toBeInTheDocument();
	});

	describe("keyboard navigation", () => {
		it("calls onClick when Enter key is pressed", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<Step stepKey={1} onClick={handleClick}>
					Enter Step
				</Step>,
			);

			const button = screen.getByRole("button");
			button.focus();
			await user.keyboard("{Enter}");
			expect(handleClick).toHaveBeenCalledWith(1);
		});

		it("calls onClick when Space key is pressed", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<Step stepKey={1} onClick={handleClick}>
					Space Step
				</Step>,
			);

			const button = screen.getByRole("button");
			button.focus();
			await user.keyboard(" ");
			expect(handleClick).toHaveBeenCalledWith(1);
		});

		it("does not call onClick on Enter when disabled", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<Step stepKey={1} disabled onClick={handleClick}>
					Disabled Enter
				</Step>,
			);

			const button = screen.getByRole("button");
			button.focus();
			await user.keyboard("{Enter}");
			expect(handleClick).not.toHaveBeenCalled();
		});

		it("does not call onClick on Space when disabled", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<Step stepKey={1} disabled onClick={handleClick}>
					Disabled Space
				</Step>,
			);

			const button = screen.getByRole("button");
			button.focus();
			await user.keyboard(" ");
			expect(handleClick).not.toHaveBeenCalled();
		});

		it("does not trigger onClick on other keys", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<Step stepKey={1} onClick={handleClick}>
					Other Keys
				</Step>,
			);

			const button = screen.getByRole("button");
			button.focus();
			await user.keyboard("{Tab}");
			await user.keyboard("a");
			// Only Enter and Space should trigger onClick through handleKeyDown
			// Other keys should not call the handler
			expect(handleClick).not.toHaveBeenCalled();
		});
	});

	describe("handleClick behavior", () => {
		it("does nothing when disabled and clicked", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<Step stepKey={1} disabled onClick={handleClick}>
					Disabled Click
				</Step>,
			);

			await user.click(screen.getByRole("button"));
			expect(handleClick).not.toHaveBeenCalled();
		});

		it("calls onClick without callback when onClick is undefined", async () => {
			const user = userEvent.setup();
			render(<Step stepKey={1}>No Handler</Step>);

			const button = screen.getByRole("button");
			// Should not throw when clicked without onClick handler
			await user.click(button);
			expect(button).toBeInTheDocument();
		});

		it("handles keyboard without onClick callback", async () => {
			const user = userEvent.setup();
			render(<Step stepKey={1}>No Handler Keyboard</Step>);

			const button = screen.getByRole("button");
			button.focus();
			// Should not throw when pressing Enter/Space without onClick handler
			await user.keyboard("{Enter}");
			await user.keyboard(" ");
			expect(button).toBeInTheDocument();
		});
	});
});
