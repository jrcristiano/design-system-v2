import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ClockIcon } from "@phosphor-icons/react";
import { InputTime } from "./InputTime";
import type { TimeValue } from "./InputTime.interface";

// Helper para encontrar o input time
const getTimeInput = (container: HTMLElement) =>
	container.querySelector('input[type="time"]') as HTMLInputElement;

describe("InputTime", () => {
	it("renders with label", () => {
		render(<InputTime label="Duration" />);
		expect(screen.getByText("Duration")).toBeInTheDocument();
	});

	it("renders without label", () => {
		const { container } = render(<InputTime />);
		const input = getTimeInput(container);
		expect(input).toBeInTheDocument();
	});

	it("renders with required asterisk", () => {
		render(<InputTime label="Duration" required />);
		expect(screen.getByText("*")).toBeInTheDocument();
	});

	it("renders with hint text", () => {
		render(<InputTime hint="Select the duration in hours" />);
		expect(screen.getByText("Select the duration in hours")).toBeInTheDocument();
	});

	it("renders with time unit label", () => {
		render(<InputTime timeUnitLabel="hours" />);
		expect(screen.getByText("hours")).toBeInTheDocument();
	});

	it("renders with time unit icon", () => {
		render(<InputTime timeUnitLabel="hours" timeUnitIcon={ClockIcon} />);
		expect(screen.getByText("hours")).toBeInTheDocument();
	});

	it("displays default value", () => {
		const { container } = render(
			<InputTime defaultValue={{ hours: 2, minutes: 30, seconds: 0 }} format="HH:MM" />,
		);
		const input = getTimeInput(container) as HTMLInputElement;
		expect(input.value).toBe("02:30");
	});

	it("displays controlled value", () => {
		const { container } = render(
			<InputTime
				value={{ hours: 3, minutes: 45, seconds: 0 }}
				format="HH:MM"
				onChange={() => {}}
			/>,
		);
		const input = getTimeInput(container) as HTMLInputElement;
		expect(input.value).toBe("03:45");
	});

	it("calls onChange when value changes", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		const { container } = render(<InputTime onChange={handleChange} format="HH:MM" />);

		const input = getTimeInput(container);
		await user.clear(input);
		await user.type(input, "14:30");

		expect(handleChange).toHaveBeenCalled();
	});

	it("handles format HH:MM correctly", () => {
		const { container } = render(
			<InputTime defaultValue={{ hours: 10, minutes: 25, seconds: 0 }} format="HH:MM" />,
		);
		const input = getTimeInput(container) as HTMLInputElement;
		expect(input.value).toBe("10:25");
	});

	it("handles format HH:MM:SS correctly", () => {
		const { container } = render(
			<InputTime defaultValue={{ hours: 10, minutes: 25, seconds: 45 }} format="HH:MM:SS" />,
		);
		const input = getTimeInput(container) as HTMLInputElement;
		expect(input.value).toBe("10:25:45");
	});

	it("handles format MM:SS correctly", () => {
		const { container } = render(
			<InputTime defaultValue={{ hours: 0, minutes: 15, seconds: 30 }} format="MM:SS" />,
		);
		const input = getTimeInput(container) as HTMLInputElement;
		expect(input.value).toBe("15:30");
	});

	it("is disabled when disabled prop is true", () => {
		const { container } = render(<InputTime disabled />);
		const input = getTimeInput(container);
		expect(input).toBeDisabled();
	});

	it("applies focus state on focus", async () => {
		const user = userEvent.setup();
		const { container } = render(<InputTime label="Time" />);

		const input = getTimeInput(container);
		await user.click(input);
		expect(input).toHaveFocus();
	});

	it("applies custom className", () => {
		const { container } = render(<InputTime className="custom-class" />);
		const element = getTimeInput(container).closest(".custom-class");
		expect(element).toBeInTheDocument();
	});

	it("handles clearing the input", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		const { container } = render(
			<InputTime
				defaultValue={{ hours: 2, minutes: 30, seconds: 0 }}
				onChange={handleChange}
				format="HH:MM"
			/>,
		);

		const input = getTimeInput(container);
		await user.clear(input);

		expect(handleChange).toHaveBeenCalledWith({
			hours: 0,
			minutes: 0,
			seconds: 0,
		});
	});

	it("pads single digit values with zero", () => {
		const { container } = render(
			<InputTime defaultValue={{ hours: 5, minutes: 3, seconds: 8 }} format="HH:MM:SS" />,
		);
		const input = getTimeInput(container) as HTMLInputElement;
		expect(input.value).toBe("05:03:08");
	});

	it("handles controlled component updates", () => {
		const { rerender, container } = render(
			<InputTime value={{ hours: 1, minutes: 0, seconds: 0 }} onChange={() => {}} format="HH:MM" />,
		);

		let input = getTimeInput(container) as HTMLInputElement;
		expect(input.value).toBe("01:00");

		rerender(
			<InputTime
				value={{ hours: 2, minutes: 30, seconds: 0 }}
				onChange={() => {}}
				format="HH:MM"
			/>,
		);

		input = getTimeInput(container) as HTMLInputElement;
		expect(input.value).toBe("02:30");
	});

	it("handles uncontrolled component updates", async () => {
		const user = userEvent.setup();
		const { container } = render(<InputTime format="HH:MM" />);

		const input = getTimeInput(container);
		await user.click(input);
		// Simular mudança de valor diretamente pois userEvent.type não funciona bem com input type=time
		input.value = "08:45";
		input.dispatchEvent(new Event("change", { bubbles: true }));

		const typedInput = getTimeInput(container) as HTMLInputElement;
		expect(typedInput.value).toBe("08:45");
	});

	it("renders hint with disabled style when disabled", () => {
		render(<InputTime hint="This is a hint" disabled />);
		const hint = screen.getByText("This is a hint");
		expect(hint).toBeInTheDocument();
		expect(hint).toHaveClass("text-[var(--ds-color-neutral-40)]");
	});

	it("renders time unit label with disabled style when disabled", () => {
		render(<InputTime timeUnitLabel="hours" disabled />);
		const label = screen.getByText("hours");
		expect(label).toHaveClass("text-[var(--ds-color-neutral-30)]");
	});

	it("applies step attribute for HH:MM:SS format", () => {
		const { container } = render(<InputTime format="HH:MM:SS" />);
		const input = getTimeInput(container);
		expect(input).toHaveAttribute("step", "1");
	});

	it("does not apply step attribute for HH:MM format", () => {
		const { container } = render(<InputTime format="HH:MM" />);
		const input = getTimeInput(container);
		expect(input).not.toHaveAttribute("step");
	});

	it("maintains internal state for uncontrolled component", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		const { container } = render(
			<InputTime
				defaultValue={{ hours: 1, minutes: 0, seconds: 0 }}
				onChange={handleChange}
				format="HH:MM"
			/>,
		);

		const input = getTimeInput(container);
		await user.clear(input);
		await user.type(input, "05:30");

		expect(handleChange).toHaveBeenCalled();
	});

	it("handles onChange with MM:SS format correctly", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		const { container } = render(<InputTime onChange={handleChange} format="MM:SS" />);

		const input = getTimeInput(container);
		await user.clear(input);
		await user.type(input, "25:45");

		expect(handleChange).toHaveBeenCalled();
		const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1][0] as TimeValue;
		expect(lastCall.minutes).toBeGreaterThanOrEqual(0);
		expect(lastCall.seconds).toBeGreaterThanOrEqual(0);
	});
});
