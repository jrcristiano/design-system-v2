import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RichTextLabel } from "./RichTextLabel";

describe("RichTextLabel", () => {
	it("returns null when no label is provided", () => {
		const { container } = render(<RichTextLabel />);
		expect(container.firstChild).toBeNull();
	});

	it("renders label text when label is provided", () => {
		render(<RichTextLabel label="Test Label" />);
		expect(screen.getByText("Test Label")).toBeInTheDocument();
	});

	it("associates the label with the editor element", () => {
		render(
			<RichTextLabel label="Description" id="description-label" htmlFor="description-editor" />,
		);
		expect(screen.getByText("Description").closest("label")).toHaveAttribute(
			"for",
			"description-editor",
		);
	});

	it("renders required indicator when required is true", () => {
		render(<RichTextLabel label="Required Field" required />);
		expect(screen.getByText("*")).toBeInTheDocument();
	});

	it("does not render required indicator when required is false", () => {
		render(<RichTextLabel label="Optional Field" required={false} />);
		expect(screen.queryByText("*")).not.toBeInTheDocument();
	});

	it("applies disabled color when disabled is true", () => {
		render(<RichTextLabel label="Disabled Label" disabled />);
		const labelSpan = screen.getByText("Disabled Label");
		expect(labelSpan).toHaveStyle({ color: "var(--ds-color-neutral-40)" });
	});

	it("applies normal color when disabled is false", () => {
		render(<RichTextLabel label="Enabled Label" disabled={false} />);
		const labelSpan = screen.getByText("Enabled Label");
		expect(labelSpan).toHaveStyle({ color: "var(--ds-color-neutral-10)" });
	});

	it("applies normal color by default when disabled is not specified", () => {
		render(<RichTextLabel label="Default Label" />);
		const labelSpan = screen.getByText("Default Label");
		expect(labelSpan).toHaveStyle({ color: "var(--ds-color-neutral-10)" });
	});

	it("renders both label and required indicator with correct styles", () => {
		render(<RichTextLabel label="Full Label" required disabled />);
		expect(screen.getByText("Full Label")).toHaveStyle({ color: "var(--ds-color-neutral-40)" });
		expect(screen.getByText("*")).toHaveStyle({ color: "var(--ds-color-red-40)" });
	});
});
