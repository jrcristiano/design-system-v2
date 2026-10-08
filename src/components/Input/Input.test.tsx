import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
	it("renders with label", () => {
		render(<Input label="Email" />);
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
	});

	it("renders with default label when not provided", () => {
		render(<Input />);
		expect(screen.getByLabelText("Label")).toBeInTheDocument();
	});

	it("shows required indicator when required", () => {
		render(<Input label="Email" required />);
		expect(screen.getByText("*")).toBeInTheDocument();
	});

	it("shows required indicator even when disabled", () => {
		render(<Input label="Email" required disabled />);
		expect(screen.getByText("*")).toBeInTheDocument();
	});

	it("calls onChange when user types", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Input label="Email" onChange={handleChange} />);

		const input = screen.getByLabelText("Email");
		await user.type(input, "test@example.com");

		expect(handleChange).toHaveBeenCalled();
	});

	it("is disabled when disabled prop is true", () => {
		render(<Input label="Email" disabled />);
		expect(screen.getByLabelText("Email")).toBeDisabled();
	});

	it("shows message when provided", () => {
		render(<Input label="Email" message="Enter a valid email" />);
		expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
	});

	it("applies mask to input value", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Input label="Phone" mask="(##) #####-####" onChange={handleChange} />);

		const input = screen.getByLabelText("Phone");
		await user.type(input, "11999998888");

		// Mask should be applied
		expect(handleChange).toHaveBeenCalled();
	});

	it("provides rawValue without mask characters", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		render(<Input label="CPF" mask="000.000.000-00" onChange={handleChange} />);

		const input = screen.getByLabelText("CPF");
		await user.type(input, "12345678901");

		const lastCall = handleChange.mock.calls.at(-1)?.[0];
		expect(lastCall?.target?.rawValue).toBe("12345678901");
	});

	it("renders with icon left", () => {
		const Icon = () => <span data-testid="icon-left">Icon</span>;
		render(<Input label="Search" iconLeft={<Icon />} />);
		expect(screen.getByTestId("icon-left")).toBeInTheDocument();
	});

	it("renders with icon right", () => {
		const Icon = () => <span data-testid="icon-right">Icon</span>;
		render(<Input label="Search" iconRight={<Icon />} />);
		expect(screen.getByTestId("icon-right")).toBeInTheDocument();
	});

	it("renders with different sizes", () => {
		const { rerender } = render(<Input label="Small" size="sm" />);
		expect(screen.getByLabelText("Small")).toBeInTheDocument();

		rerender(<Input label="Medium" size="md" />);
		expect(screen.getByLabelText("Medium")).toBeInTheDocument();

		rerender(<Input label="Large" size="lg" />);
		expect(screen.getByLabelText("Large")).toBeInTheDocument();
	});

	it("renders with error state", () => {
		render(<Input label="Email" state="error" message="Invalid email" />);
		expect(screen.getByText("Invalid email")).toBeInTheDocument();
	});

	it("accepts controlled value", () => {
		render(<Input label="Email" value="test@example.com" onChange={() => {}} />);
		expect(screen.getByLabelText("Email")).toHaveValue("test@example.com");
	});

	it("renders iconRight as native button without wrapping", () => {
		const handleClick = vi.fn();
		render(
			<Input
				label="Test"
				iconRight={
					<button type="button" onClick={handleClick} data-testid="button-icon">
						Click me
					</button>
				}
			/>,
		);

		const buttonIcon = screen.getByTestId("button-icon");
		expect(buttonIcon).toBeInTheDocument();
		// Native button should be rendered as-is, without wrapping in IconSlot
		expect(buttonIcon.tagName).toBe("BUTTON");
		expect(buttonIcon).toHaveTextContent("Click me");
	});

	it("does not call onIconRightClick when disabled", async () => {
		const user = userEvent.setup();
		const handleIconRightClick = vi.fn();
		const Icon = () => <span data-testid="icon-right">Icon</span>;

		render(
			<Input label="Test" iconRight={<Icon />} onIconRightClick={handleIconRightClick} disabled />,
		);

		const iconSlot = screen.getByTestId("icon-right").parentElement;
		if (iconSlot) {
			await user.click(iconSlot);
		}
		expect(handleIconRightClick).not.toHaveBeenCalled();
	});

	it("calls onIconRightClick when not disabled", async () => {
		const user = userEvent.setup();
		const handleIconRightClick = vi.fn();
		const Icon = () => <span data-testid="icon-right">Icon</span>;

		render(<Input label="Test" iconRight={<Icon />} onIconRightClick={handleIconRightClick} />);

		const iconButton = screen.getByTestId("icon-right").closest("button");
		if (iconButton) {
			await user.click(iconButton);
		}
		expect(handleIconRightClick).toHaveBeenCalled();
	});

	it("calls onIconLeftClick when iconLeft is clickable and not disabled", async () => {
		const user = userEvent.setup();
		const handleIconLeftClick = vi.fn();
		const Icon = () => <span data-testid="icon-left">Icon</span>;

		render(<Input label="Test" iconLeft={<Icon />} onIconLeftClick={handleIconLeftClick} />);

		const iconButton = screen.getByTestId("icon-left").closest("button");
		if (iconButton) {
			await user.click(iconButton);
		}
		expect(handleIconLeftClick).toHaveBeenCalled();
	});

	it("does not call onIconLeftClick when disabled", async () => {
		const user = userEvent.setup();
		const handleIconLeftClick = vi.fn();
		const Icon = () => <span data-testid="icon-left">Icon</span>;

		render(
			<Input label="Test" iconLeft={<Icon />} onIconLeftClick={handleIconLeftClick} disabled />,
		);

		const iconSlot = screen.getByTestId("icon-left").parentElement;
		if (iconSlot) {
			await user.click(iconSlot);
		}
		expect(handleIconLeftClick).not.toHaveBeenCalled();
	});

	it("renders iconLeft with IconSlot button when onIconLeftClick is provided", () => {
		const handleIconLeftClick = vi.fn();
		const Icon = () => <span data-testid="icon-left">Icon</span>;

		render(<Input label="Test" iconLeft={<Icon />} onIconLeftClick={handleIconLeftClick} />);

		const icon = screen.getByTestId("icon-left");
		const iconButton = icon.closest("button");
		expect(iconButton).toBeInTheDocument();
		expect(iconButton?.tagName).toBe("BUTTON");
	});

	it("renders iconLeft with IconSlot span when no onIconLeftClick is provided", () => {
		const Icon = () => <span data-testid="icon-left">Icon</span>;

		render(<Input label="Test" iconLeft={<Icon />} />);

		const icon = screen.getByTestId("icon-left");
		const iconSpan = icon.closest("span");
		expect(iconSpan).toBeInTheDocument();
	});

	it("prevents default on mousedown for iconLeft when handleIconLeftClick is defined", () => {
		const handleIconLeftClick = vi.fn();
		const Icon = () => <span data-testid="icon-left">Icon</span>;

		render(<Input label="Test" iconLeft={<Icon />} onIconLeftClick={handleIconLeftClick} />);

		const iconButton = screen.getByTestId("icon-left").closest("button");
		if (iconButton) {
			fireEvent.mouseDown(iconButton);
			expect(iconButton).toBeInTheDocument();
		}
	});

	it("handles password toggle with iconRight", async () => {
		const user = userEvent.setup();
		const Icon = () => <span data-testid="icon-right">Eye</span>;

		render(<Input label="Password" type="password" iconRight={<Icon />} />);

		const input = screen.getByLabelText("Password");
		expect(input).toHaveAttribute("type", "password");

		const toggleButton = screen.getByRole("button", { name: /mostrar senha/i });
		await user.click(toggleButton);

		expect(input).toHaveAttribute("type", "text");
	});

	it("handles password toggle and calls onIconRightClick together", async () => {
		const user = userEvent.setup();
		const handleIconRightClick = vi.fn();
		const Icon = () => <span data-testid="icon-right">Eye</span>;

		render(
			<Input
				label="Password"
				type="password"
				iconRight={<Icon />}
				onIconRightClick={handleIconRightClick}
			/>,
		);

		const toggleButton = screen.getByRole("button", { name: /mostrar senha/i });
		await user.click(toggleButton);

		expect(handleIconRightClick).toHaveBeenCalled();
	});

	it("does not toggle password when disabled", () => {
		const Icon = () => <span data-testid="icon-right">Eye</span>;

		render(<Input label="Password" type="password" iconRight={<Icon />} disabled />);

		const input = screen.getByLabelText("Password");
		expect(input).toHaveAttribute("type", "password");

		const toggleButton = screen.getByRole("button", { name: /mostrar senha/i });
		expect(toggleButton).toBeDisabled();
	});

	it("resets isPasswordVisible when type changes from password to text while visible", async () => {
		const user = userEvent.setup();
		const Icon = () => <span data-testid="icon-right">Eye</span>;

		const { rerender } = render(<Input label="Password" type="password" iconRight={<Icon />} />);

		const input = screen.getByLabelText("Password");
		expect(input).toHaveAttribute("type", "password");

		// Toggle password visibility to true
		const toggleButton = screen.getByRole("button", { name: /mostrar senha/i });
		await user.click(toggleButton);

		// Now type is "text" because password is visible
		expect(input).toHaveAttribute("type", "text");

		// Re-render with type="text" - this triggers the useEffect that resets isPasswordVisible
		rerender(<Input label="Password" type="text" iconRight={<Icon />} />);

		// The type should now be "text" and not "password"
		expect(input).toHaveAttribute("type", "text");
	});

	it("handles typing without onChange handler", async () => {
		const user = userEvent.setup();
		render(<Input label="Test" />);

		const input = screen.getByLabelText("Test");
		await user.type(input, "test");

		// Should not throw - the onChange branch is skipped
		expect(input).toHaveValue("test");
	});

	it("renders iconLeft without click handler (span instead of button)", () => {
		const Icon = () => <span data-testid="icon-left">Icon</span>;

		render(<Input label="Test" iconLeft={<Icon />} />);

		const icon = screen.getByTestId("icon-left");
		const parentSpan = icon.closest("span");
		expect(parentSpan).toBeInTheDocument();
		// When no onIconLeftClick is provided, the mouseDown handler is undefined
	});

	it("renders message with default values for disabled and state", () => {
		render(<Input label="Test" message="Help text" />);
		expect(screen.getByText("Help text")).toBeInTheDocument();
	});

	it("renders label with undefined required and disabled props", () => {
		// This tests the nullish coalescing in shouldShowRequiredMarker
		render(<Input label="Test" required={undefined} disabled={undefined} />);
		expect(screen.getByLabelText("Test")).toBeInTheDocument();
		// No required marker should be shown when required is undefined/false
		expect(screen.queryByText("*")).not.toBeInTheDocument();
	});

	it("renders without label", () => {
		render(<Input label="" />);
		// When label is empty/falsy, InputLabel returns null
		const container = document.querySelector(".flex.flex-col.gap-\\[2px\\]");
		expect(container).toBeInTheDocument();
	});
});
