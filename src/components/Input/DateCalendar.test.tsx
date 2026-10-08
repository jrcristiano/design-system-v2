import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DateCalendar } from "./DateCalendar";

describe("DateCalendar", () => {
	it("renders calendar with days of week", () => {
		render(<DateCalendar selectedDate={null} onSelect={vi.fn()} />);
		// Days of week: S, T, Q, Q, S, S, D (Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo)
		const daysOfWeek = screen.getAllByText(/^[STQD]$/);
		expect(daysOfWeek.length).toBeGreaterThanOrEqual(7);
	});

	it("renders current month name", () => {
		const mockDate = new Date(2025, 11, 25); // December 2025
		render(<DateCalendar selectedDate={mockDate} onSelect={vi.fn()} />);
		expect(screen.getByText("Dezembro")).toBeInTheDocument();
	});

	it("renders year selector", () => {
		const currentYear = new Date().getFullYear();
		const mockDate = new Date(currentYear, 11, 25);
		render(<DateCalendar selectedDate={mockDate} onSelect={vi.fn()} />);
		expect(screen.getByRole("combobox")).toHaveValue(String(currentYear));
	});

	it("calls onSelect when a day is clicked", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();
		render(<DateCalendar selectedDate={null} onSelect={handleSelect} />);

		await user.click(screen.getByText("15"));
		expect(handleSelect).toHaveBeenCalled();
	});

	it("navigates to previous month", async () => {
		const user = userEvent.setup();
		const mockDate = new Date(2025, 11, 25); // December
		render(<DateCalendar selectedDate={mockDate} onSelect={vi.fn()} />);

		expect(screen.getByText("Dezembro")).toBeInTheDocument();

		const prevButton = screen.getAllByRole("button")[0];
		await user.click(prevButton);

		expect(screen.getByText("Novembro")).toBeInTheDocument();
	});

	it("navigates to next month", async () => {
		const user = userEvent.setup();
		const mockDate = new Date(2025, 0, 15); // January
		render(<DateCalendar selectedDate={mockDate} onSelect={vi.fn()} />);

		expect(screen.getByText("Janeiro")).toBeInTheDocument();

		const buttons = screen.getAllByRole("button");
		const nextButton = buttons[1];
		await user.click(nextButton);

		expect(screen.getByText("Fevereiro")).toBeInTheDocument();
	});

	it("changes year when selecting from dropdown", async () => {
		const user = userEvent.setup();
		const currentYear = new Date().getFullYear();
		const mockDate = new Date(currentYear, 11, 25);
		render(<DateCalendar selectedDate={mockDate} onSelect={vi.fn()} />);

		const yearSelect = screen.getByRole("combobox");
		const previousYear = String(currentYear - 1);
		await user.selectOptions(yearSelect, previousYear);

		expect(yearSelect).toHaveValue(previousYear);
	});

	it("highlights selected date", () => {
		const mockDate = new Date(2025, 11, 25);
		render(<DateCalendar selectedDate={mockDate} onSelect={vi.fn()} />);

		const selectedDay = screen.getByText("25");
		expect(selectedDay).toHaveClass("bg-[var(--ds-color-blue-40)]");
	});

	it("renders footer when provided", () => {
		render(
			<DateCalendar
				selectedDate={null}
				onSelect={vi.fn()}
				footer={<button>Custom Footer</button>}
			/>,
		);

		expect(screen.getByText("Custom Footer")).toBeInTheDocument();
	});

	it("calls onClose when closeOnSelect is true", async () => {
		const user = userEvent.setup();
		const handleClose = vi.fn();
		render(
			<DateCalendar
				selectedDate={null}
				onSelect={vi.fn()}
				closeOnSelect={true}
				onClose={handleClose}
			/>,
		);

		await user.click(screen.getByText("15"));
		expect(handleClose).toHaveBeenCalled();
	});

	it("does not call onClose when closeOnSelect is false", async () => {
		const user = userEvent.setup();
		const handleClose = vi.fn();
		render(
			<DateCalendar
				selectedDate={null}
				onSelect={vi.fn()}
				closeOnSelect={false}
				onClose={handleClose}
			/>,
		);

		await user.click(screen.getByText("15"));
		expect(handleClose).not.toHaveBeenCalled();
	});

	it("updates month when selectedDate changes", () => {
		const { rerender } = render(
			<DateCalendar selectedDate={new Date(2025, 0, 15)} onSelect={vi.fn()} />,
		);
		expect(screen.getByText("Janeiro")).toBeInTheDocument();

		rerender(<DateCalendar selectedDate={new Date(2025, 5, 15)} onSelect={vi.fn()} />);
		expect(screen.getByText("Junho")).toBeInTheDocument();
	});

	it("renders all days of the month", () => {
		const mockDate = new Date(2025, 0, 1); // January 2025 has 31 days
		render(<DateCalendar selectedDate={mockDate} onSelect={vi.fn()} />);

		expect(screen.getByText("1")).toBeInTheDocument();
		expect(screen.getByText("31")).toBeInTheDocument();
	});

	it("does not call onSelect when clicking empty day cell", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();
		const { container } = render(<DateCalendar selectedDate={null} onSelect={handleSelect} />);

		// Find invisible buttons (empty cells)
		const invisibleButtons = container.querySelectorAll("button.invisible");
		if (invisibleButtons.length > 0) {
			await user.click(invisibleButtons[0]);
			expect(handleSelect).not.toHaveBeenCalled();
		}
	});

	it("does not call onSelect when handleDateClick receives null day", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();

		// Render with a date that starts mid-week to ensure there are empty cells
		const mockDate = new Date(2025, 0, 1); // January 2025 starts on Wednesday
		const { container } = render(<DateCalendar selectedDate={mockDate} onSelect={handleSelect} />);

		// Find disabled buttons (null day cells)
		const disabledButtons = container.querySelectorAll("button[disabled]");
		expect(disabledButtons.length).toBeGreaterThan(0);

		// Click on a disabled button (empty cell with null day)
		await user.click(disabledButtons[0]);

		// onSelect should not have been called since day is null
		expect(handleSelect).not.toHaveBeenCalled();
	});

	it("closes on select when closeOnSelect is true and day is valid", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();
		const handleClose = vi.fn();

		render(
			<DateCalendar
				selectedDate={null}
				onSelect={handleSelect}
				closeOnSelect={true}
				onClose={handleClose}
			/>,
		);

		// Click on a valid day
		await user.click(screen.getByText("20"));

		// Both onSelect and onClose should be called
		expect(handleSelect).toHaveBeenCalled();
		expect(handleClose).toHaveBeenCalled();
	});
});
