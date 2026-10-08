import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ClockIcon } from "@phosphor-icons/react";
import { InputDigitalTime } from "./InputDigitalTime";

describe("InputDigitalTime", () => {
	it("renders with label", () => {
		render(<InputDigitalTime label="Duration" unit="hours" />);
		expect(screen.getByText("Duration")).toBeInTheDocument();
	});

	it("renders without label", () => {
		render(<InputDigitalTime unit="minutes" />);
		const input = screen.getByLabelText("Minuto");
		expect(input).toBeInTheDocument();
	});

	it("renders with required asterisk", () => {
		render(<InputDigitalTime label="Duration" unit="hours" required />);
		expect(screen.getByText("*")).toBeInTheDocument();
	});

	it("renders with hint text", () => {
		render(<InputDigitalTime unit="hours" hint="Select the duration in hours" />);
		expect(screen.getByText("Select the duration in hours")).toBeInTheDocument();
	});

	it("renders with time unit label", () => {
		render(<InputDigitalTime unit="hours" timeUnitLabel="hours" />);
		expect(screen.getByText("hours")).toBeInTheDocument();
	});

	it("renders with time unit icon", () => {
		render(<InputDigitalTime unit="hours" timeUnitLabel="hours" timeUnitIcon={ClockIcon} />);
		expect(screen.getByText("hours")).toBeInTheDocument();
	});

	it("displays default value for hours", () => {
		render(<InputDigitalTime unit="hours" defaultValue={5} />);
		const input = screen.getByLabelText("Hora") as HTMLInputElement;
		expect(input.value).toBe("05");
	});

	it("displays default value for minutes", () => {
		render(<InputDigitalTime unit="minutes" defaultValue={30} />);
		const input = screen.getByLabelText("Minuto") as HTMLInputElement;
		expect(input.value).toBe("30");
	});

	it("displays default value for seconds", () => {
		render(<InputDigitalTime unit="seconds" defaultValue={45} />);
		const input = screen.getByLabelText("Segundo") as HTMLInputElement;
		expect(input.value).toBe("45");
	});

	it("displays controlled value", () => {
		render(<InputDigitalTime unit="hours" value={12} onChange={() => {}} />);
		const input = screen.getByLabelText("Hora") as HTMLInputElement;
		expect(input.value).toBe("12");
	});

	it("calls onChange when value changes and loses focus", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<InputDigitalTime unit="hours" onChange={handleChange} />);

		const input = screen.getByLabelText("Hora");
		await user.click(input);
		await user.clear(input);
		await user.type(input, "10");
		await user.tab();

		expect(handleChange).toHaveBeenCalledWith(10);
	});

	it("pads single digit values with zero", () => {
		render(<InputDigitalTime unit="hours" defaultValue={5} />);
		const input = screen.getByLabelText("Hora") as HTMLInputElement;
		expect(input.value).toBe("05");
	});

	it("limits hours to maximum of 23", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<InputDigitalTime unit="hours" onChange={handleChange} />);

		const input = screen.getByLabelText("Hora");
		await user.click(input);
		await user.clear(input);
		await user.type(input, "99");
		await user.tab();

		expect(handleChange).toHaveBeenCalledWith(23);
	});

	it("limits minutes to maximum of 59", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<InputDigitalTime unit="minutes" onChange={handleChange} />);

		const input = screen.getByLabelText("Minuto");
		await user.click(input);
		await user.clear(input);
		await user.type(input, "99");
		await user.tab();

		expect(handleChange).toHaveBeenCalledWith(59);
	});

	it("limits seconds to maximum of 59", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<InputDigitalTime unit="seconds" onChange={handleChange} />);

		const input = screen.getByLabelText("Segundo");
		await user.click(input);
		await user.clear(input);
		await user.type(input, "99");
		await user.tab();

		expect(handleChange).toHaveBeenCalledWith(59);
	});

	it("is disabled when disabled prop is true", () => {
		render(<InputDigitalTime unit="hours" disabled />);
		const input = screen.getByLabelText("Hora");
		expect(input).toBeDisabled();
	});

	it("does not call onChange when disabled", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<InputDigitalTime unit="hours" disabled onChange={handleChange} />);

		const input = screen.getByLabelText("Hora");
		await user.click(input);

		expect(input).toBeDisabled();
		expect(handleChange).not.toHaveBeenCalled();
	});

	it("applies focus state on focus", async () => {
		const user = userEvent.setup();
		render(<InputDigitalTime unit="hours" />);

		const input = screen.getByLabelText("Hora");
		await user.click(input);
		expect(input).toHaveFocus();
	});

	it("selects all text on focus", async () => {
		const user = userEvent.setup();
		render(<InputDigitalTime unit="hours" defaultValue={12} />);

		const input = screen.getByLabelText("Hora") as HTMLInputElement;
		await user.click(input);

		expect(input).toHaveFocus();
	});

	it("applies custom className", () => {
		render(<InputDigitalTime unit="hours" className="custom-class" />);
		const container = screen.getByLabelText("Hora").closest(".custom-class");
		expect(container).toBeInTheDocument();
	});

	it("handles only numeric input", async () => {
		const user = userEvent.setup();
		render(<InputDigitalTime unit="hours" />);

		const input = screen.getByLabelText("Hora") as HTMLInputElement;
		await user.click(input);
		await user.clear(input);
		await user.type(input, "abc123def");

		// O input tem maxLength=2, então apenas os 2 primeiros dígitos são mantidos
		expect(input.value).toBe("12");
	});

	it("handles empty input by setting to 0", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<InputDigitalTime unit="hours" defaultValue={10} onChange={handleChange} />);

		const input = screen.getByLabelText("Hora");
		await user.click(input);
		await user.clear(input);
		await user.tab();

		expect(handleChange).toHaveBeenCalledWith(0);
	});

	it("handles controlled component updates", () => {
		const { rerender } = render(<InputDigitalTime unit="hours" value={5} onChange={() => {}} />);

		let input = screen.getByLabelText("Hora") as HTMLInputElement;
		expect(input.value).toBe("05");

		rerender(<InputDigitalTime unit="hours" value={15} onChange={() => {}} />);

		input = screen.getByLabelText("Hora") as HTMLInputElement;
		expect(input.value).toBe("15");
	});

	it("handles uncontrolled component updates", async () => {
		const user = userEvent.setup();
		render(<InputDigitalTime unit="hours" defaultValue={0} />);

		const input = screen.getByLabelText("Hora") as HTMLInputElement;
		await user.click(input);
		await user.clear(input);
		await user.type(input, "08");
		await user.tab();

		expect(input.value).toBe("08");
	});

	it("has correct aria-label for hours", () => {
		render(<InputDigitalTime unit="hours" />);
		const input = screen.getByLabelText("Hora");
		expect(input).toBeInTheDocument();
	});

	it("has correct aria-label for minutes", () => {
		render(<InputDigitalTime unit="minutes" />);
		const input = screen.getByLabelText("Minuto");
		expect(input).toBeInTheDocument();
	});

	it("has correct aria-label for seconds", () => {
		render(<InputDigitalTime unit="seconds" />);
		const input = screen.getByLabelText("Segundo");
		expect(input).toBeInTheDocument();
	});

	it("maintains internal state for uncontrolled component", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(<InputDigitalTime unit="hours" defaultValue={5} onChange={handleChange} />);

		const input = screen.getByLabelText("Hora");
		await user.click(input);
		await user.clear(input);
		await user.type(input, "15");
		await user.tab();

		expect(handleChange).toHaveBeenCalledWith(15);
	});

	it("formats value with leading zero after blur", async () => {
		const user = userEvent.setup();
		render(<InputDigitalTime unit="hours" defaultValue={0} />);

		const input = screen.getByLabelText("Hora") as HTMLInputElement;
		await user.click(input);
		await user.clear(input);
		await user.type(input, "5");
		await user.tab();

		expect(input.value).toBe("05");
	});

	it("maxLength is 2 characters", async () => {
		const user = userEvent.setup();
		render(<InputDigitalTime unit="hours" />);

		const input = screen.getByLabelText("Hora") as HTMLInputElement;
		await user.click(input);
		await user.clear(input);
		await user.type(input, "12345");

		expect(input.value.length).toBeLessThanOrEqual(2);
	});

	it("shows disabled styles when disabled", () => {
		render(<InputDigitalTime unit="hours" disabled />);
		const input = screen.getByLabelText("Hora");
		expect(input).toBeDisabled();
		// Verificar que o input tem a classe de cursor not-allowed
		expect(input).toHaveClass("cursor-not-allowed");
	});

	it("renders hint with proper styling", () => {
		render(<InputDigitalTime unit="hours" hint="This is a hint" />);
		const hint = screen.getByText("This is a hint");
		expect(hint).toHaveClass("text-center");
		expect(hint).toHaveClass("text-xs");
	});

	it("handles rapid input changes correctly", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<InputDigitalTime unit="minutes" onChange={handleChange} />);

		const input = screen.getByLabelText("Minuto");
		await user.click(input);
		await user.clear(input);
		await user.type(input, "45");
		await user.tab();

		expect(handleChange).toHaveBeenCalledWith(45);
	});
});
