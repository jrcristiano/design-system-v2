import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Radio } from "./Radio";

describe("Radio", () => {
	it("renders with label", () => {
		render(<Radio label="Option 1" name="option" />);
		expect(screen.getByText("Option 1")).toBeInTheDocument();
	});

	it("renders without label", () => {
		render(<Radio name="option" />);
		expect(screen.getByRole("radio")).toBeInTheDocument();
	});

	it("is checked when checked prop is true", () => {
		render(<Radio checked name="option" onChange={() => {}} />);
		expect(screen.getByRole("radio")).toBeChecked();
	});

	it("is not checked by default", () => {
		render(<Radio name="option" />);
		expect(screen.getByRole("radio")).not.toBeChecked();
	});

	it("calls onChange when clicked", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Radio label="Option" name="option" onChange={handleChange} />);

		await user.click(screen.getByRole("radio"));
		expect(handleChange).toHaveBeenCalled();
	});

	it("is disabled when disabled prop is true", () => {
		render(<Radio disabled name="option" />);
		expect(screen.getByRole("radio")).toBeDisabled();
	});

	it("does not call onChange when disabled", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Radio disabled name="option" onChange={handleChange} />);

		await user.click(screen.getByRole("radio"));
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("groups radios by name", () => {
		render(
			<>
				<Radio label="Option 1" name="group" value="1" />
				<Radio label="Option 2" name="group" value="2" />
			</>,
		);

		const radios = screen.getAllByRole("radio");
		expect(radios).toHaveLength(2);
		expect(radios[0]).toHaveAttribute("name", "group");
		expect(radios[1]).toHaveAttribute("name", "group");
	});

	it("applies fontLabelStyle to label", () => {
		render(<Radio label="Styled" name="option" fontLabelStyle={{ color: "red" }} />);
		const label = screen.getByText("Styled");
		expect(label).toHaveAttribute("style", expect.stringContaining("color: red"));
	});

	it("handles hover state", async () => {
		const user = userEvent.setup();
		render(<Radio label="Hover me" name="option" />);

		const label = screen.getByText("Hover me").closest("label");
		await user.hover(label!);
		await user.unhover(label!);
		expect(label).toBeInTheDocument();
	});

	it("handles focus and blur state", async () => {
		const user = userEvent.setup();
		render(<Radio label="Focus me" name="option" onChange={() => {}} />);

		const radio = screen.getByRole("radio");
		await user.tab();
		expect(radio).toHaveFocus();

		await user.tab();
		expect(radio).not.toHaveFocus();
	});

	it("handles focused checked state", async () => {
		const user = userEvent.setup();
		render(<Radio label="Focused checked" name="option" checked onChange={() => {}} />);

		const radio = screen.getByRole("radio");
		await user.tab();
		expect(radio).toHaveFocus();
	});

	it("handles disabled checked state", () => {
		render(<Radio label="Disabled checked" name="option" disabled checked onChange={() => {}} />);
		const label = screen.getByText("Disabled checked");
		expect(label).toBeInTheDocument();
	});

	it("does not change hover state when disabled", async () => {
		const user = userEvent.setup();
		render(<Radio label="Disabled hover" name="option" disabled />);

		const label = screen.getByText("Disabled hover").closest("label");
		await user.hover(label!);
		await user.unhover(label!);
		expect(label).toBeInTheDocument();
	});
});
