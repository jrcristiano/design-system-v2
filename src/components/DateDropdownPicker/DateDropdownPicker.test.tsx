import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DateDropdownPicker } from "./DateDropdownPicker";

describe("DateDropdownPicker", () => {
	describe("rendering", () => {
		it("renders with placeholder when no value", () => {
			const onChange = vi.fn();
			render(<DateDropdownPicker value="" onChange={onChange} />);

			expect(screen.getByText("Selecione uma data")).toBeInTheDocument();
		});

		it("renders with custom placeholder", () => {
			const onChange = vi.fn();
			render(<DateDropdownPicker value="" onChange={onChange} placeholder="Escolha a data" />);

			expect(screen.getByText("Escolha a data")).toBeInTheDocument();
		});

		it("renders with value", () => {
			const onChange = vi.fn();
			render(<DateDropdownPicker value="25/12/2025" onChange={onChange} />);

			expect(screen.getByText("25/12/2025")).toBeInTheDocument();
		});

		it("renders with different sizes", () => {
			const onChange = vi.fn();
			const { rerender } = render(<DateDropdownPicker value="" onChange={onChange} size="sm" />);

			expect(screen.getByRole("button")).toBeInTheDocument();

			rerender(<DateDropdownPicker value="" onChange={onChange} size="md" />);
			expect(screen.getByRole("button")).toBeInTheDocument();

			rerender(<DateDropdownPicker value="" onChange={onChange} size="lg" />);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("renders with different variants", () => {
			const onChange = vi.fn();
			const { rerender } = render(
				<DateDropdownPicker value="" onChange={onChange} variant="primary" />,
			);

			expect(screen.getByRole("button")).toBeInTheDocument();

			rerender(<DateDropdownPicker value="" onChange={onChange} variant="secondary" />);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});
	});

	describe("dropdown behavior", () => {
		it("opens calendar dropdown when clicked", () => {
			const onChange = vi.fn();
			render(<DateDropdownPicker value="" onChange={onChange} />);

			const trigger = screen.getByRole("button");
			fireEvent.click(trigger);

			// Calendar should be visible with Cancel and Ok buttons
			expect(screen.getByText("Cancelar")).toBeInTheDocument();
			expect(screen.getByText("Ok")).toBeInTheDocument();
		});

		it("shows month navigation in calendar", () => {
			const onChange = vi.fn();
			render(<DateDropdownPicker value="" onChange={onChange} />);

			const trigger = screen.getByRole("button");
			fireEvent.click(trigger);

			// Should show month navigation buttons
			const navButtons = screen.getAllByRole("button");
			expect(navButtons.length).toBeGreaterThan(2);
		});
	});

	describe("date selection", () => {
		it("selects a date when clicking on a day", () => {
			const onChange = vi.fn();
			render(<DateDropdownPicker value="" onChange={onChange} />);

			const trigger = screen.getByRole("button");
			fireEvent.click(trigger);

			// Find and click a day button (e.g., day 15)
			const dayButtons = screen.getAllByRole("button").filter((btn) => btn.textContent === "15");
			if (dayButtons.length > 0) {
				fireEvent.click(dayButtons[0]);
			}

			// Ok button should now be enabled
			const okButton = screen.getByText("Ok");
			expect(okButton).not.toBeDisabled();
		});

		it("confirms date selection when clicking Ok", () => {
			const onChange = vi.fn();
			render(<DateDropdownPicker value="" onChange={onChange} />);

			const trigger = screen.getByRole("button");
			fireEvent.click(trigger);

			// Select day 15
			const dayButtons = screen.getAllByRole("button").filter((btn) => btn.textContent === "15");
			if (dayButtons.length > 0) {
				fireEvent.click(dayButtons[0]);
			}

			// Click Ok
			const okButton = screen.getByText("Ok");
			fireEvent.click(okButton);

			// onChange should be called with formatted date
			expect(onChange).toHaveBeenCalled();
			const calledValue = onChange.mock.calls[0][0];
			expect(calledValue).toMatch(/15\/\d{2}\/\d{4}/);
		});

		it("cancels date selection when clicking Cancelar", () => {
			const onChange = vi.fn();
			render(<DateDropdownPicker value="25/12/2025" onChange={onChange} />);

			const trigger = screen.getByRole("button");
			fireEvent.click(trigger);

			// Select a different day
			const dayButtons = screen.getAllByRole("button").filter((btn) => btn.textContent === "10");
			if (dayButtons.length > 0) {
				fireEvent.click(dayButtons[0]);
			}

			// Click Cancel
			const cancelButton = screen.getByText("Cancelar");
			fireEvent.click(cancelButton);

			// onChange should NOT be called
			expect(onChange).not.toHaveBeenCalled();
		});

		it("Ok button is disabled when no date is selected", () => {
			const onChange = vi.fn();
			render(<DateDropdownPicker value="" onChange={onChange} />);

			const trigger = screen.getByRole("button");
			fireEvent.click(trigger);

			const okButton = screen.getByText("Ok");
			expect(okButton).toBeDisabled();
		});
	});

	describe("date parsing", () => {
		it("parses valid date value correctly", () => {
			const onChange = vi.fn();
			render(<DateDropdownPicker value="25/12/2025" onChange={onChange} />);

			expect(screen.getByText("25/12/2025")).toBeInTheDocument();
		});

		it("handles invalid date gracefully", () => {
			const onChange = vi.fn();
			render(<DateDropdownPicker value="invalid" onChange={onChange} />);

			// Should show the invalid value as text
			expect(screen.getByText("invalid")).toBeInTheDocument();
		});

		it("handles empty value", () => {
			const onChange = vi.fn();
			render(<DateDropdownPicker value="" onChange={onChange} />);

			expect(screen.getByText("Selecione uma data")).toBeInTheDocument();
		});
	});

	describe("value changes", () => {
		it("updates when value prop changes", () => {
			const onChange = vi.fn();
			const { rerender } = render(<DateDropdownPicker value="01/01/2025" onChange={onChange} />);

			expect(screen.getByText("01/01/2025")).toBeInTheDocument();

			rerender(<DateDropdownPicker value="31/12/2025" onChange={onChange} />);
			expect(screen.getByText("31/12/2025")).toBeInTheDocument();
		});
	});
});
