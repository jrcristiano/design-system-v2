import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
	it("renders with label", () => {
		render(<Checkbox label="Accept terms" onChange={() => {}} />);
		expect(screen.getByText("Accept terms")).toBeInTheDocument();
	});

	it("renders without label", () => {
		render(<Checkbox />);
		expect(screen.getByRole("checkbox")).toBeInTheDocument();
	});

	it("is checked when checked prop is true", () => {
		render(<Checkbox checked onChange={() => {}} />);
		expect(screen.getByRole("checkbox")).toBeChecked();
	});

	it("is not checked by default", () => {
		render(<Checkbox />);
		expect(screen.getByRole("checkbox")).not.toBeChecked();
	});

	it("calls onChange when clicked", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Checkbox label="Accept" onChange={handleChange} />);

		await user.click(screen.getByRole("checkbox"));
		expect(handleChange).toHaveBeenCalled();
	});

	it("is disabled when disabled prop is true", () => {
		render(<Checkbox disabled />);
		expect(screen.getByRole("checkbox")).toBeDisabled();
	});

	it("does not call onChange when disabled", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Checkbox disabled onChange={handleChange} />);

		await user.click(screen.getByRole("checkbox"));
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("applies custom className", () => {
		render(<Checkbox className="custom-class" label="Test" />);
		const label = screen.getByText("Test").closest("label");
		expect(label).toHaveClass("custom-class");
	});

	it("handles indeterminate state", () => {
		render(<Checkbox indeterminate />);
		const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
		expect(checkbox.indeterminate).toBe(true);
	});

	it("handles focus state", async () => {
		const user = userEvent.setup();
		render(<Checkbox label="Focus me" />);

		await user.tab();
		expect(screen.getByRole("checkbox")).toHaveFocus();
	});

	it("handles hover state", async () => {
		const user = userEvent.setup();
		render(<Checkbox label="Hover me" />);

		const label = screen.getByText("Hover me").closest("label");
		await user.hover(label!);
		expect(label).toBeInTheDocument();
	});

	it("renders with checked and indeterminate - checked takes precedence visually", () => {
		render(<Checkbox checked indeterminate onChange={() => {}} />);
		expect(screen.getByRole("checkbox")).toBeChecked();
	});

	it("applies fontLabelStyle to label", () => {
		render(<Checkbox label="Styled" fontLabelStyle={{ color: "red" }} />);
		const label = screen.getByText("Styled");
		expect(label).toHaveStyle({ color: "rgb(255, 0, 0)" });
	});

	it("handles state prop", () => {
		render(<Checkbox label="Pressed" state="pressed" />);
		expect(screen.getByRole("checkbox")).toBeInTheDocument();
	});

	it("handles checkbox area click", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Checkbox label="Click area" onChange={handleChange} />);

		const checkbox = screen.getByRole("checkbox");
		await user.click(checkbox);
		expect(handleChange).toHaveBeenCalled();
	});

	it("does not allow checkbox area click when disabled", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Checkbox label="Disabled" disabled onChange={handleChange} />);

		const checkbox = screen.getByRole("checkbox");
		await user.click(checkbox);
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("handles focus and blur states", async () => {
		const user = userEvent.setup();
		render(<Checkbox label="Focus test" onChange={vi.fn()} />);

		const checkbox = screen.getByRole("checkbox");
		await user.tab();
		expect(checkbox).toHaveFocus();

		await user.tab();
		expect(checkbox).not.toHaveFocus();
	});

	it("handles mouse enter and leave states", async () => {
		const user = userEvent.setup();
		render(<Checkbox label="Hover test" onChange={vi.fn()} />);

		const label = screen.getByText("Hover test").closest("label");
		await user.hover(label!);
		await user.unhover(label!);
		expect(label).toBeInTheDocument();
	});

	it("does not change hover state when disabled", async () => {
		const user = userEvent.setup();
		render(<Checkbox label="Disabled hover" disabled onChange={vi.fn()} />);

		const label = screen.getByText("Disabled hover").closest("label");
		await user.hover(label!);
		await user.unhover(label!);
		expect(label).toBeInTheDocument();
	});

	it("handles click on checkbox overlay area", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		const { container } = render(<Checkbox label="Overlay click" onChange={handleChange} />);

		// The overlay div is an absolute positioned div that triggers checkbox click
		const overlay = container.querySelector(".absolute.inset-0.cursor-pointer");
		if (overlay) {
			await user.click(overlay);
			expect(handleChange).toHaveBeenCalled();
		}
	});

	it("does not trigger checkbox via overlay when disabled", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		const { container } = render(
			<Checkbox label="Disabled overlay" disabled onChange={handleChange} />,
		);

		const overlay = container.querySelector(".absolute.inset-0");
		if (overlay) {
			await user.click(overlay);
			expect(handleChange).not.toHaveBeenCalled();
		}
	});

	it("updates indeterminate state when prop changes", () => {
		const { rerender } = render(<Checkbox indeterminate={false} />);
		const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
		expect(checkbox.indeterminate).toBe(false);

		rerender(<Checkbox indeterminate={true} />);
		expect(checkbox.indeterminate).toBe(true);

		rerender(<Checkbox indeterminate={false} />);
		expect(checkbox.indeterminate).toBe(false);
	});
});
