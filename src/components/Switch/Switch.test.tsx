import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Switch from "./Switch";

describe("Switch", () => {
	it("renders unchecked by default", () => {
		render(<Switch />);
		expect(screen.getByRole("checkbox")).not.toBeChecked();
	});

	it("renders checked when defaultChecked is true", () => {
		render(<Switch defaultChecked />);
		expect(screen.getByRole("checkbox")).toBeChecked();
	});

	it("toggles when clicked (uncontrolled)", async () => {
		const user = userEvent.setup();
		render(<Switch />);

		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).not.toBeChecked();

		await user.click(checkbox);
		expect(checkbox).toBeChecked();

		await user.click(checkbox);
		expect(checkbox).not.toBeChecked();
	});

	it("calls onChange when toggled", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Switch onChange={handleChange} />);

		await user.click(screen.getByRole("checkbox"));
		expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));
	});

	it("respects controlled checked prop", () => {
		const { rerender } = render(<Switch checked={false} onChange={() => {}} />);
		expect(screen.getByRole("checkbox")).not.toBeChecked();

		rerender(<Switch checked={true} onChange={() => {}} />);
		expect(screen.getByRole("checkbox")).toBeChecked();
	});

	it("is disabled when disabled prop is true", () => {
		render(<Switch disabled />);
		expect(screen.getByRole("checkbox")).toBeDisabled();
	});

	it("does not call onChange when disabled", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Switch disabled onChange={handleChange} />);

		await user.click(screen.getByRole("checkbox"));
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("applies custom className", () => {
		render(<Switch className="custom-switch" />);
		const label = screen.getByRole("checkbox").closest("label");
		expect(label).toHaveClass("custom-switch");
	});

	it("updates internal state when uncontrolled (without checked prop)", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Switch onChange={handleChange} />);

		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).not.toBeChecked();

		await user.click(checkbox);
		expect(checkbox).toBeChecked();
		expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));

		await user.click(checkbox);
		expect(checkbox).not.toBeChecked();
		expect(handleChange).toHaveBeenCalledWith(false, expect.any(Object));
	});

	it("does not update internal state when controlled (with checked prop)", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Switch checked={false} onChange={handleChange} />);

		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).not.toBeChecked();

		await user.click(checkbox);
		// In controlled mode, the checkbox state is determined by the checked prop
		// The internal state should not change, only onChange should be called
		expect(checkbox).not.toBeChecked();
		expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));
	});
});
