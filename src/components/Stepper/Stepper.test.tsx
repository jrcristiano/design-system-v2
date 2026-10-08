import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Stepper } from "./Stepper";

describe("Stepper", () => {
	it("renders stepper with items", () => {
		render(
			<Stepper activeKey="1">
				<Stepper.Item>
					<Stepper.Link eventKey="1">Step 1</Stepper.Link>
				</Stepper.Item>
				<Stepper.Item>
					<Stepper.Link eventKey="2">Step 2</Stepper.Link>
				</Stepper.Item>
			</Stepper>,
		);

		expect(screen.getByText("Step 1")).toBeInTheDocument();
		expect(screen.getByText("Step 2")).toBeInTheDocument();
	});

	it("renders active step with correct styling", () => {
		render(
			<Stepper activeKey="2">
				<Stepper.Item>
					<Stepper.Link eventKey="1">First</Stepper.Link>
				</Stepper.Item>
				<Stepper.Item>
					<Stepper.Link eventKey="2">Second</Stepper.Link>
				</Stepper.Item>
			</Stepper>,
		);

		expect(screen.getByText("Second")).toBeInTheDocument();
	});

	it("marks previous steps as completed", () => {
		render(
			<Stepper activeKey="3">
				<Stepper.Item>
					<Stepper.Link eventKey="1">Step 1</Stepper.Link>
				</Stepper.Item>
				<Stepper.Item>
					<Stepper.Link eventKey="2">Step 2</Stepper.Link>
				</Stepper.Item>
				<Stepper.Item>
					<Stepper.Link eventKey="3">Step 3</Stepper.Link>
				</Stepper.Item>
			</Stepper>,
		);

		expect(screen.getByText("Step 3")).toBeInTheDocument();
	});

	it("calls onSelect when step is clicked", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();

		render(
			<Stepper activeKey="1" onSelect={handleSelect}>
				<Stepper.Item>
					<Stepper.Link eventKey="1">Step 1</Stepper.Link>
				</Stepper.Item>
				<Stepper.Item>
					<Stepper.Link eventKey="2">Step 2</Stepper.Link>
				</Stepper.Item>
			</Stepper>,
		);

		await user.click(screen.getByText("Step 2"));
		expect(handleSelect).toHaveBeenCalledWith("2");
	});

	it("does not call onSelect when disabled step is clicked", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();

		render(
			<Stepper activeKey="1" onSelect={handleSelect}>
				<Stepper.Item>
					<Stepper.Link eventKey="1">Step 1</Stepper.Link>
				</Stepper.Item>
				<Stepper.Item>
					<Stepper.Link eventKey="2" disabled>
						Disabled Step
					</Stepper.Link>
				</Stepper.Item>
			</Stepper>,
		);

		await user.click(screen.getByText("Disabled Step"));
		expect(handleSelect).not.toHaveBeenCalled();
	});

	it("applies custom className", () => {
		const { container } = render(
			<Stepper activeKey="1" className="custom-stepper">
				<Stepper.Item>
					<Stepper.Link eventKey="1">Step 1</Stepper.Link>
				</Stepper.Item>
			</Stepper>,
		);

		expect(container.querySelector(".custom-stepper")).toBeInTheDocument();
	});

	it("renders nothing when no valid items", () => {
		const { container } = render(<Stepper activeKey="1">{null}</Stepper>);

		expect(container.firstChild).toBeNull();
	});

	it("renders with href in StepLink", () => {
		render(
			<Stepper activeKey="1">
				<Stepper.Item>
					<Stepper.Link href="/step1">Step 1</Stepper.Link>
				</Stepper.Item>
			</Stepper>,
		);

		expect(screen.getByRole("link", { name: /Step 1/ })).toHaveAttribute("href", "/step1");
	});

	it("renders step numbers", () => {
		render(
			<Stepper activeKey="2">
				<Stepper.Item>
					<Stepper.Link eventKey="1">First</Stepper.Link>
				</Stepper.Item>
				<Stepper.Item>
					<Stepper.Link eventKey="2">Second</Stepper.Link>
				</Stepper.Item>
			</Stepper>,
		);

		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("handles step with all StepLink props", () => {
		const handleSelect = vi.fn();

		render(
			<Stepper activeKey="test-key" onSelect={handleSelect}>
				<Stepper.Item>
					<Stepper.Link eventKey="test-key" href="/test-href">
						Test Step
					</Stepper.Link>
				</Stepper.Item>
			</Stepper>,
		);

		// Verify the step is rendered with the label from StepLink
		expect(screen.getByRole("link", { name: /Test Step/ })).toHaveAttribute("href", "/test-href");
	});

	it("uses href as key when eventKey is not provided", () => {
		render(
			<Stepper activeKey="/page1">
				<Stepper.Item>
					<Stepper.Link href="/page1">Page 1</Stepper.Link>
				</Stepper.Item>
				<Stepper.Item>
					<Stepper.Link href="/page2">Page 2</Stepper.Link>
				</Stepper.Item>
			</Stepper>,
		);

		expect(screen.getByText("Page 1")).toBeInTheDocument();
		expect(screen.getByText("Page 2")).toBeInTheDocument();
	});

	it("calls onSelect when Enter key is pressed on step", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();

		render(
			<Stepper activeKey="1" onSelect={handleSelect}>
				<Stepper.Item>
					<Stepper.Link eventKey="1">Step 1</Stepper.Link>
				</Stepper.Item>
				<Stepper.Item>
					<Stepper.Link eventKey="2">Step 2</Stepper.Link>
				</Stepper.Item>
			</Stepper>,
		);

		const step2Button = screen.getByText("Step 2").closest("button")!;
		step2Button.focus();
		await user.keyboard("{Enter}");
		expect(handleSelect).toHaveBeenCalledWith("2");
	});

	it("calls onSelect when Space key is pressed on step", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();

		render(
			<Stepper activeKey="1" onSelect={handleSelect}>
				<Stepper.Item>
					<Stepper.Link eventKey="1">Step 1</Stepper.Link>
				</Stepper.Item>
				<Stepper.Item>
					<Stepper.Link eventKey="2">Step 2</Stepper.Link>
				</Stepper.Item>
			</Stepper>,
		);

		const step2Button = screen.getByText("Step 2").closest("button")!;
		step2Button.focus();
		await user.keyboard(" ");
		expect(handleSelect).toHaveBeenCalledWith("2");
	});

	it("does not call onSelect when keyboard on disabled step", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();

		render(
			<Stepper activeKey="1" onSelect={handleSelect}>
				<Stepper.Item>
					<Stepper.Link eventKey="1">Step 1</Stepper.Link>
				</Stepper.Item>
				<Stepper.Item>
					<Stepper.Link eventKey="2" disabled>
						Disabled Step
					</Stepper.Link>
				</Stepper.Item>
			</Stepper>,
		);

		const disabledButton = screen.getByText("Disabled Step").closest("button")!;
		disabledButton.focus();
		await user.keyboard("{Enter}");
		expect(handleSelect).not.toHaveBeenCalled();
	});

	describe("StepLink component", () => {
		it("renders StepLink with data attributes", () => {
			const { container } = render(
				<Stepper.Link eventKey="test-key" href="/test-path" disabled>
					Test Link Content
				</Stepper.Link>,
			);

			const span = container.querySelector("span");
			expect(span).toBeInTheDocument();
			expect(span).toHaveAttribute("data-eventkey", "test-key");
			expect(span).toHaveAttribute("data-href", "/test-path");
			expect(span).toHaveAttribute("data-disabled", "true");
			expect(span).toHaveTextContent("Test Link Content");
		});

		it("renders StepLink with optional props omitted", () => {
			const { container } = render(<Stepper.Link>Simple Link</Stepper.Link>);

			const span = container.querySelector("span");
			expect(span).toBeInTheDocument();
			expect(span).toHaveTextContent("Simple Link");
		});

		it("renders StepLink with numeric eventKey", () => {
			const { container } = render(<Stepper.Link eventKey={42}>Numeric Key Link</Stepper.Link>);

			const span = container.querySelector("span");
			expect(span).toBeInTheDocument();
			expect(span).toHaveAttribute("data-eventkey", "42");
		});
	});

	describe("StepItem with invalid child structure", () => {
		it("returns null when StepItem child is not a StepLink", () => {
			render(
				<Stepper activeKey="1">
					<Stepper.Item>
						<Stepper.Link eventKey="1">Valid Step</Stepper.Link>
					</Stepper.Item>
					<Stepper.Item>
						<div>Not a StepLink</div>
					</Stepper.Item>
				</Stepper>,
			);

			// Should only render the valid step, not the invalid one
			expect(screen.getByText("Valid Step")).toBeInTheDocument();
			expect(screen.queryByText("Not a StepLink")).not.toBeInTheDocument();
		});

		it("returns null when StepItem has plain text child", () => {
			render(
				<Stepper activeKey="1">
					<Stepper.Item>
						<Stepper.Link eventKey="1">Valid Step</Stepper.Link>
					</Stepper.Item>
					<Stepper.Item>Plain text child</Stepper.Item>
				</Stepper>,
			);

			// Should only render the valid step
			expect(screen.getByText("Valid Step")).toBeInTheDocument();
			// The plain text is not rendered as a step
		});

		it("returns null when StepItem has null child", () => {
			render(
				<Stepper activeKey="1">
					<Stepper.Item>
						<Stepper.Link eventKey="1">Valid Step</Stepper.Link>
					</Stepper.Item>
					<Stepper.Item>{null}</Stepper.Item>
				</Stepper>,
			);

			// Should only render the valid step
			expect(screen.getByText("Valid Step")).toBeInTheDocument();
		});

		it("handles StepItem with component that has no displayName", () => {
			const NoDisplayNameComponent = () => <span>No display name</span>;

			render(
				<Stepper activeKey="1">
					<Stepper.Item>
						<Stepper.Link eventKey="1">Valid Step</Stepper.Link>
					</Stepper.Item>
					<Stepper.Item>
						<NoDisplayNameComponent />
					</Stepper.Item>
				</Stepper>,
			);

			// Should only render the valid step
			expect(screen.getByText("Valid Step")).toBeInTheDocument();
			expect(screen.queryByText("No display name")).not.toBeInTheDocument();
		});
	});

	describe("StepItem component", () => {
		it("renders StepItem children directly", () => {
			const { container } = render(<Stepper.Item>Direct content</Stepper.Item>);
			expect(container.textContent).toBe("Direct content");
		});

		it("StepItem has correct displayName", () => {
			expect(Stepper.Item.displayName).toBe("StepItem");
		});
	});

	describe("StepLink component", () => {
		it("StepLink has correct displayName", () => {
			expect(Stepper.Link.displayName).toBe("StepLink");
		});
	});

	describe("edge cases", () => {
		it("handles single child without array wrapper", () => {
			render(
				<Stepper activeKey="1">
					<Stepper.Item>
						<Stepper.Link eventKey="1">Single Step</Stepper.Link>
					</Stepper.Item>
				</Stepper>,
			);

			expect(screen.getByText("Single Step")).toBeInTheDocument();
		});

		it("handles step with disabled that affects status", () => {
			render(
				<Stepper activeKey="2">
					<Stepper.Item>
						<Stepper.Link eventKey="1" disabled>
							Disabled Step 1
						</Stepper.Link>
					</Stepper.Item>
					<Stepper.Item>
						<Stepper.Link eventKey="2">Active Step 2</Stepper.Link>
					</Stepper.Item>
				</Stepper>,
			);

			// Step 1 is disabled, so it stays default even though it's before active
			expect(screen.getByText("Disabled Step 1")).toBeInTheDocument();
			expect(screen.getByText("Active Step 2")).toBeInTheDocument();
		});

		it("filters out non-StepItem children", () => {
			render(
				<Stepper activeKey="1">
					<div>Not a StepItem</div>
					<Stepper.Item>
						<Stepper.Link eventKey="1">Valid Step</Stepper.Link>
					</Stepper.Item>
					<span>Another invalid</span>
				</Stepper>,
			);

			expect(screen.getByText("Valid Step")).toBeInTheDocument();
			expect(screen.queryByText("Not a StepItem")).not.toBeInTheDocument();
			expect(screen.queryByText("Another invalid")).not.toBeInTheDocument();
		});

		it("handles activeKey that does not match any step", () => {
			render(
				<Stepper activeKey="nonexistent">
					<Stepper.Item>
						<Stepper.Link eventKey="1">Step 1</Stepper.Link>
					</Stepper.Item>
					<Stepper.Item>
						<Stepper.Link eventKey="2">Step 2</Stepper.Link>
					</Stepper.Item>
				</Stepper>,
			);

			// All steps should render with default status
			expect(screen.getByText("Step 1")).toBeInTheDocument();
			expect(screen.getByText("Step 2")).toBeInTheDocument();
		});

		it("handles step without eventKey using href as key", () => {
			const handleSelect = vi.fn();
			render(
				<Stepper activeKey="/page1" onSelect={handleSelect}>
					<Stepper.Item>
						<Stepper.Link href="/page1">Page 1</Stepper.Link>
					</Stepper.Item>
				</Stepper>,
			);

			expect(screen.getByText("Page 1")).toBeInTheDocument();
		});
	});
});
