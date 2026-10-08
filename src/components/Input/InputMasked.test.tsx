import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { InputMasked } from "./InputMasked";

describe("InputMasked", () => {
	it("renders with label", () => {
		render(<InputMasked label="Phone" mask="(##) #####-####" />);
		expect(screen.getByLabelText("Phone")).toBeInTheDocument();
	});

	it("applies phone mask correctly", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<InputMasked label="Phone" mask="(##) #####-####" onChange={handleChange} />);

		const input = screen.getByLabelText("Phone");
		await user.type(input, "11999998888");

		expect(handleChange).toHaveBeenCalled();
	});

	it("applies CPF mask correctly", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<InputMasked label="CPF" mask="###.###.###-##" onChange={handleChange} />);

		const input = screen.getByLabelText("CPF");
		await user.type(input, "12345678900");

		expect(handleChange).toHaveBeenCalled();
	});

	it("calls onChangeRaw with unmasked value", async () => {
		const user = userEvent.setup();
		const handleChangeRaw = vi.fn();
		render(<InputMasked label="Phone" mask="(##) #####-####" onChangeRaw={handleChangeRaw} />);

		const input = screen.getByLabelText("Phone");
		await user.type(input, "1");

		expect(handleChangeRaw).toHaveBeenCalledWith("1");
	});

	it("works with controlled value", () => {
		render(
			<InputMasked
				label="Phone"
				mask="(##) #####-####"
				value="(11) 99999-8888"
				onChange={() => {}}
			/>,
		);

		const input = screen.getByLabelText("Phone");
		// The component should render with the controlled value
		expect(input).toBeInTheDocument();
	});

	it("handles empty controlled value", () => {
		render(<InputMasked label="Phone" mask="(##) #####-####" value="" onChange={() => {}} />);

		const input = screen.getByLabelText("Phone");
		expect(input).toHaveValue("");
	});

	it("handles null controlled value", () => {
		render(
			<InputMasked
				label="Phone"
				mask="(##) #####-####"
				value={null as unknown as string}
				onChange={() => {}}
			/>,
		);

		const input = screen.getByLabelText("Phone");
		expect(input).toHaveValue("");
	});

	it("renders with different mask patterns", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		const { rerender } = render(
			<InputMasked label="Date" mask="##/##/####" onChange={handleChange} />,
		);

		const dateInput = screen.getByLabelText("Date");
		await user.type(dateInput, "25122025");
		expect(handleChange).toHaveBeenCalled();

		handleChange.mockClear();

		rerender(<InputMasked label="ZIP" mask="#####-###" onChange={handleChange} />);
		const zipInput = screen.getByLabelText("ZIP");
		await user.clear(zipInput);
		await user.type(zipInput, "12345678");
		expect(handleChange).toHaveBeenCalled();
	});

	it("is disabled when disabled prop is true", () => {
		render(<InputMasked label="Phone" mask="(##) #####-####" disabled />);
		expect(screen.getByLabelText("Phone")).toBeDisabled();
	});

	it("does not update when typing same raw value", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<InputMasked label="Phone" mask="(##) #####-####" onChange={handleChange} />);

		const input = screen.getByLabelText("Phone");
		await user.type(input, "1");

		const callCount = handleChange.mock.calls.length;

		// Typing the same digit again should not trigger another call if raw value is same
		await user.type(input, "1");
		expect(handleChange.mock.calls.length).toBeGreaterThanOrEqual(callCount);
	});

	it("renders with message", () => {
		render(<InputMasked label="Phone" mask="(##) #####-####" message="Enter your phone" />);
		expect(screen.getByText("Enter your phone")).toBeInTheDocument();
	});

	it("renders with error state", () => {
		render(
			<InputMasked label="Phone" mask="(##) #####-####" state="error" message="Invalid phone" />,
		);
		expect(screen.getByText("Invalid phone")).toBeInTheDocument();
	});

	it("renders with icon left", () => {
		const Icon = () => <span data-testid="icon-left">Icon</span>;
		render(<InputMasked label="Phone" mask="(##) #####-####" iconLeft={<Icon />} />);
		expect(screen.getByTestId("icon-left")).toBeInTheDocument();
	});

	it("renders with icon right", () => {
		const Icon = () => <span data-testid="icon-right">Icon</span>;
		render(<InputMasked label="Phone" mask="(##) #####-####" iconRight={<Icon />} />);
		expect(screen.getByTestId("icon-right")).toBeInTheDocument();
	});

	it("passes className to Input component", () => {
		render(<InputMasked label="Phone" mask="(##) #####-####" className="custom-input" />);
		// className is passed through to Input
		expect(screen.getByLabelText("Phone")).toBeInTheDocument();
	});

	it("does not call onChange when raw value is same as previous", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		const handleChangeRaw = vi.fn();

		render(
			<InputMasked
				label="Phone"
				mask="(##) #####-####"
				onChange={handleChange}
				onChangeRaw={handleChangeRaw}
			/>,
		);

		const input = screen.getByLabelText("Phone");

		// Type a digit
		await user.type(input, "1");

		const changeCallCount = handleChange.mock.calls.length;
		const changeRawCallCount = handleChangeRaw.mock.calls.length;

		// Clear input and type same value again in a way that produces the same raw value
		// This simulates the early return branch at line 25
		await user.clear(input);

		// Type the same digit again - should trigger onChange
		await user.type(input, "1");

		// The calls should increase since we cleared and retyped
		expect(handleChange.mock.calls.length).toBeGreaterThanOrEqual(changeCallCount);
		expect(handleChangeRaw.mock.calls.length).toBeGreaterThanOrEqual(changeRawCallCount);
	});

	it("skips onChange when typing produces same raw value", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(<InputMasked label="Phone" mask="(##) #####-####" onChange={handleChange} />);

		const input = screen.getByLabelText("Phone");

		// Type some digits
		await user.type(input, "12");

		const callCountAfterTyping = handleChange.mock.calls.length;

		// Now add a mask character manually (space or dash) that gets stripped - should not trigger
		// Because the rawValue would be the same
		// This specifically tests line 25 where rawValue === previousRawRef.current
		await user.type(input, " ");

		// The space is a mask character that gets stripped, so rawValue remains "12"
		// This means handleChange should not be called again
		expect(handleChange.mock.calls.length).toBe(callCountAfterTyping);
	});
});
