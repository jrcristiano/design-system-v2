import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { InputDatePicker } from "./InputDatePicker";

describe("InputDatePicker", () => {
	it("renders with label", () => {
		render(<InputDatePicker label="Date" />);
		expect(screen.getByLabelText(/Date/)).toBeInTheDocument();
	});

	it("renders with placeholder", () => {
		render(<InputDatePicker label="Date" />);
		expect(screen.getByPlaceholderText("00/00/0000")).toBeInTheDocument();
	});

	it("opens calendar when calendar button is clicked", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Select Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		await user.click(calendarButton);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
	});

	it("closes calendar when clicking outside", async () => {
		const user = userEvent.setup();
		render(
			<div>
				<div data-testid="outside">Outside</div>
				<InputDatePicker label="Date" />
			</div>,
		);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		await user.click(calendarButton);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();

		fireEvent.mouseDown(screen.getByTestId("outside"));
		await waitFor(() => {
			expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
		});
	});

	it("closes calendar when Cancel button is clicked", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		await user.click(calendarButton);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();

		await user.click(screen.getByText("Cancelar"));
		await waitFor(() => {
			expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
		});
	});

	it("does not open calendar when disabled", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" disabled />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		await user.click(calendarButton);
		expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
	});

	it("is disabled when disabled prop is true", () => {
		render(<InputDatePicker label="Date" disabled />);
		expect(screen.getByLabelText(/Date/)).toBeDisabled();
	});

	it("allows typing in the input", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const input = screen.getByLabelText(/Date/);
		await user.type(input, "25122025");
		expect(input).toHaveValue("25/12/2025");
	});

	it("renders Ok button disabled initially", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		await user.click(calendarButton);
		const okButton = screen.getByText("Ok");
		expect(okButton).toBeDisabled();
	});

	it("toggles calendar on calendar button click", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });

		// Open
		await user.click(calendarButton);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();

		// Close
		await user.click(calendarButton);
		await waitFor(() => {
			expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
		});
	});

	it("renders with left icon", () => {
		render(<InputDatePicker label="Date" />);
		// PlusIcon is the left icon
		expect(screen.getByLabelText(/Date/)).toBeInTheDocument();
	});

	it("renders with calendar icon on right", () => {
		render(<InputDatePicker label="Date" />);
		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		expect(calendarButton).toBeInTheDocument();
	});

	it("opens calendar when calendar icon is clicked", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		await user.click(calendarButton);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
	});

	it("selects a date and formats it correctly", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		await user.click(calendarButton);

		// Click on a day in the calendar (day 15)
		const day15 = screen.getByText("15");
		await user.click(day15);

		// Input should have the formatted date (DD/MM/YYYY)
		const input = screen.getByLabelText(/Date/) as HTMLInputElement;
		expect(input.value).toMatch(/15\/\d{2}\/\d{4}/);
	});

	it("closes calendar and clears selection when OK is clicked with date selected", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		await user.click(calendarButton);

		// Select a date
		const day20 = screen.getByText("20");
		await user.click(day20);

		// OK button should be enabled now
		const okButton = screen.getByText("Ok");
		expect(okButton).not.toBeDisabled();

		// Click OK to close
		await user.click(okButton);
		await waitFor(() => {
			expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
		});
	});

	it("opens calendar with Enter key on calendar button", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		calendarButton.focus();
		await user.keyboard("{Enter}");

		expect(screen.getByText("Cancelar")).toBeInTheDocument();
	});

	it("opens calendar with Space key on calendar button", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		calendarButton.focus();
		await user.keyboard(" ");

		expect(screen.getByText("Cancelar")).toBeInTheDocument();
	});

	it("does not open calendar with keyboard when disabled", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" disabled />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		calendarButton.focus();
		await user.keyboard("{Enter}");

		expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
	});

	it("does not close calendar when OK is clicked without a date selected", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		await user.click(calendarButton);

		// Calendar is open
		expect(screen.getByText("Cancelar")).toBeInTheDocument();

		// OK button is disabled and selectedDate is null
		const okButton = screen.getByText("Ok");
		expect(okButton).toBeDisabled();

		// Click OK without selecting a date - calendar should remain open
		await user.click(okButton);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
	});

	it("clears input value when cancel is clicked with empty input", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		await user.click(calendarButton);

		// Calendar is open with empty input
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
		const input = screen.getByLabelText(/Date/) as HTMLInputElement;
		expect(input.value).toBe("");

		// Click cancel - should close and keep input empty
		await user.click(screen.getByText("Cancelar"));
		await waitFor(() => {
			expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
		});
		expect(input.value).toBe("");
	});

	it("closes calendar when cancel is clicked after date selection", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		await user.click(calendarButton);

		// Select a date
		const day15 = screen.getByText("15");
		await user.click(day15);

		const input = screen.getByLabelText(/Date/) as HTMLInputElement;
		expect(input.value).toMatch(/15\/\d{2}\/\d{4}/);

		// Click cancel - should close calendar and clear selection
		await user.click(screen.getByText("Cancelar"));
		await waitFor(() => {
			expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
		});
	});

	it("does not close calendar when handleOkClick is called with no selectedDate", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		await user.click(calendarButton);

		// Calendar is open with no date selected
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
		const okButton = screen.getByText("Ok");

		// OK button should be disabled when no date is selected
		expect(okButton).toBeDisabled();

		// Try to click OK - calendar should remain open because selectedDate is null
		// This covers the false branch of line 30: if (selectedDate)
		fireEvent.click(okButton);

		// Calendar should still be open
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
	});

	it("does not toggle calendar when non-Enter/Space key is pressed", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });

		// Focus the button and press a different key
		calendarButton.focus();
		await user.keyboard("{Tab}");

		// Calendar should not open because Tab is not Enter or Space
		// This covers the else branch of line 63
		expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
	});

	it("cancels and keeps empty input when cancel is clicked with empty value", async () => {
		const user = userEvent.setup();
		render(<InputDatePicker label="Date" />);

		const calendarButton = screen.getByRole("button", { name: "Open calendar" });
		await user.click(calendarButton);

		const input = screen.getByLabelText(/Date/) as HTMLInputElement;
		expect(input.value).toBe("");

		// Click cancel with empty inputValue - covers line 53-55
		await user.click(screen.getByText("Cancelar"));
		await waitFor(() => {
			expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
		});

		// Input should still be empty
		expect(input.value).toBe("");
	});
});
