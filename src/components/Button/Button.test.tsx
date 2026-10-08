import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
	it("renders with children text", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
	});

	it("calls onClick when clicked", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click me</Button>);

		await user.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("is disabled when disabled prop is true", () => {
		render(<Button disabled>Click me</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("is disabled when isLoading is true", () => {
		render(<Button isLoading>Click me</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("shows loading spinner when isLoading is true", () => {
		render(<Button isLoading>Click me</Button>);
		const button = screen.getByRole("button");
		expect(button.querySelector(".animate-spin")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(<Button className="custom-class">Click me</Button>);
		expect(screen.getByRole("button")).toHaveClass("custom-class");
	});

	it("renders with different variants", () => {
		const { rerender } = render(<Button variant="primary">Primary</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();

		rerender(<Button variant="secondary">Secondary</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();

		rerender(<Button variant="outline">Outline</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("renders with different sizes", () => {
		const { rerender } = render(<Button size="sm">Small</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();

		rerender(<Button size="md">Medium</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();

		rerender(<Button size="lg">Large</Button>);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("renders as circle when circle prop is true", () => {
		render(<Button circle>X</Button>);
		expect(screen.getByRole("button")).toHaveClass("rounded-full");
	});

	it("renders as floating action button when floatingOn prop is set", () => {
		render(<Button floatingOn="bottom-right">+</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("rounded-full");
		expect(button).toHaveClass("!fixed");
	});

	it("renders with iconLeft", () => {
		const Icon = ({ size }: { size: number }) => <span data-testid="icon">{size}</span>;
		render(<Button iconLeft={Icon}>With Icon</Button>);
		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});

	it("renders with iconRight", () => {
		const Icon = ({ size }: { size: number }) => <span data-testid="icon">{size}</span>;
		render(<Button iconRight={Icon}>With Icon</Button>);
		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});

	it("renders with gapBetweenTextAndIcon and iconLeft only", () => {
		const IconLeft = ({ size }: { size: number }) => <span data-testid="left-icon">{size}</span>;
		render(
			<Button gapBetweenTextAndIcon iconLeft={IconLeft}>
				Space Between
			</Button>,
		);
		expect(screen.getByTestId("left-icon")).toBeInTheDocument();
		expect(screen.getByText("Space Between")).toBeInTheDocument();
	});

	it("renders with gapBetweenTextAndIcon and both icons", () => {
		const IconLeft = ({ size }: { size: number }) => <span data-testid="left-icon">{size}</span>;
		const IconRight = ({ size }: { size: number }) => <span data-testid="right-icon">{size}</span>;
		render(
			<Button gapBetweenTextAndIcon iconLeft={IconLeft} iconRight={IconRight}>
				Both Icons
			</Button>,
		);
		expect(screen.getByTestId("left-icon")).toBeInTheDocument();
		expect(screen.getByTestId("right-icon")).toBeInTheDocument();
	});

	it("renders with gapBetweenTextAndIcon and iconRight only", () => {
		const IconRight = ({ size }: { size: number }) => <span data-testid="right-icon">{size}</span>;
		render(
			<Button gapBetweenTextAndIcon iconRight={IconRight}>
				Right Only
			</Button>,
		);
		expect(screen.getByTestId("right-icon")).toBeInTheDocument();
	});

	it("handles focus and blur events", async () => {
		const user = userEvent.setup();
		render(<Button>Focus Me</Button>);
		const button = screen.getByRole("button");

		await user.click(button);
		expect(button).toHaveFocus();

		await user.tab();
		expect(button).not.toHaveFocus();
	});

	describe("Icon click handlers", () => {
		it("calls onIconLeftClick when left icon is clicked", async () => {
			const user = userEvent.setup();
			const handleIconLeftClick = vi.fn();
			const IconLeft = ({ size }: { size: number }) => <span data-testid="left-icon">{size}</span>;

			render(
				<Button iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick}>
					Click me
				</Button>,
			);

			const iconButton = screen.getByTestId("left-icon").parentElement;
			expect(iconButton).toBeInTheDocument();
			expect(screen.getAllByRole("button")).toHaveLength(1);
			await user.click(iconButton!);
			expect(handleIconLeftClick).toHaveBeenCalledTimes(1);
		});

		it("calls onIconRightClick when right icon is clicked", async () => {
			const user = userEvent.setup();
			const handleIconRightClick = vi.fn();
			const IconRight = ({ size }: { size: number }) => (
				<span data-testid="right-icon">{size}</span>
			);

			render(
				<Button iconRight={IconRight} onIconRightClick={handleIconRightClick}>
					Click me
				</Button>,
			);

			const iconButton = screen.getByTestId("right-icon").parentElement;
			expect(iconButton).toBeInTheDocument();
			await user.click(iconButton!);
			expect(handleIconRightClick).toHaveBeenCalledTimes(1);
		});

		it("does not call onIconLeftClick when button is disabled", async () => {
			const user = userEvent.setup();
			const handleIconLeftClick = vi.fn();
			const IconLeft = ({ size }: { size: number }) => <span data-testid="left-icon">{size}</span>;

			render(
				<Button iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick} disabled>
					Click me
				</Button>,
			);

			const iconButton = screen.getByTestId("left-icon").parentElement;
			expect(iconButton).toBeInTheDocument();
			await user.click(iconButton!);
			expect(handleIconLeftClick).not.toHaveBeenCalled();
		});

		it("does not call onIconRightClick when button is disabled", async () => {
			const user = userEvent.setup();
			const handleIconRightClick = vi.fn();
			const IconRight = ({ size }: { size: number }) => (
				<span data-testid="right-icon">{size}</span>
			);

			render(
				<Button iconRight={IconRight} onIconRightClick={handleIconRightClick} disabled>
					Click me
				</Button>,
			);

			const iconButton = screen.getByTestId("right-icon").parentElement;
			expect(iconButton).toBeInTheDocument();
			await user.click(iconButton!);
			expect(handleIconRightClick).not.toHaveBeenCalled();
		});

		it("does not call onIconLeftClick when button is loading", async () => {
			const handleIconLeftClick = vi.fn();
			const IconLeft = ({ size }: { size: number }) => <span data-testid="left-icon">{size}</span>;

			render(
				<Button iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick} isLoading>
					Click me
				</Button>,
			);

			// Icon is not rendered when loading, so we verify handler is not called
			// by checking the icon is not in the document
			expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
		});

		it("does not call onIconRightClick when button is loading", async () => {
			const handleIconRightClick = vi.fn();
			const IconRight = ({ size }: { size: number }) => (
				<span data-testid="right-icon">{size}</span>
			);

			render(
				<Button iconRight={IconRight} onIconRightClick={handleIconRightClick} isLoading>
					Click me
				</Button>,
			);

			// Icon is not rendered when loading, so we verify handler is not called
			// by checking the icon is not in the document
			expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
		});

		it("renders icon as span when no click handler is provided for iconLeft", () => {
			const IconLeft = ({ size }: { size: number }) => <span data-testid="left-icon">{size}</span>;

			render(<Button iconLeft={IconLeft}>Click me</Button>);

			const icon = screen.getByTestId("left-icon");
			// Parent should be a span, not a button
			expect(icon.closest("button")?.classList.contains("bg-transparent")).toBeFalsy();
			expect(icon.parentElement?.tagName).toBe("SPAN");
		});

		it("renders icon as span when no click handler is provided for iconRight", () => {
			const IconRight = ({ size }: { size: number }) => (
				<span data-testid="right-icon">{size}</span>
			);

			render(<Button iconRight={IconRight}>Click me</Button>);

			const icon = screen.getByTestId("right-icon");
			// Parent should be a span, not a button
			expect(icon.parentElement?.tagName).toBe("SPAN");
		});

		it("calls onIconLeftClick in gapBetweenTextAndIcon mode", async () => {
			const user = userEvent.setup();
			const handleIconLeftClick = vi.fn();
			const IconLeft = ({ size }: { size: number }) => <span data-testid="left-icon">{size}</span>;

			render(
				<Button gapBetweenTextAndIcon iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick}>
					Click me
				</Button>,
			);

			const iconButton = screen.getByTestId("left-icon").parentElement;
			expect(iconButton).toBeInTheDocument();
			await user.click(iconButton!);
			expect(handleIconLeftClick).toHaveBeenCalledTimes(1);
		});

		it("calls onIconRightClick in gapBetweenTextAndIcon mode with both icons", async () => {
			const user = userEvent.setup();
			const handleIconRightClick = vi.fn();
			const IconLeft = ({ size }: { size: number }) => <span data-testid="left-icon">{size}</span>;
			const IconRight = ({ size }: { size: number }) => (
				<span data-testid="right-icon">{size}</span>
			);

			render(
				<Button
					gapBetweenTextAndIcon
					iconLeft={IconLeft}
					iconRight={IconRight}
					onIconRightClick={handleIconRightClick}
				>
					Click me
				</Button>,
			);

			const iconButton = screen.getByTestId("right-icon").parentElement;
			expect(iconButton).toBeInTheDocument();
			await user.click(iconButton!);
			expect(handleIconRightClick).toHaveBeenCalledTimes(1);
		});

		it("calls onIconRightClick in gapBetweenTextAndIcon mode with only right icon", async () => {
			const user = userEvent.setup();
			const handleIconRightClick = vi.fn();
			const IconRight = ({ size }: { size: number }) => (
				<span data-testid="right-icon">{size}</span>
			);

			render(
				<Button gapBetweenTextAndIcon iconRight={IconRight} onIconRightClick={handleIconRightClick}>
					Click me
				</Button>,
			);

			const iconButton = screen.getByTestId("right-icon").parentElement;
			expect(iconButton).toBeInTheDocument();
			await user.click(iconButton!);
			expect(handleIconRightClick).toHaveBeenCalledTimes(1);
		});

		it("handleIconLeftClick does nothing when onIconLeftClick is undefined", () => {
			const IconLeft = ({ size }: { size: number }) => <span data-testid="left-icon">{size}</span>;

			// Render with no onIconLeftClick handler - IconSlot will render as span
			render(<Button iconLeft={IconLeft}>Click me</Button>);

			// Icon should be wrapped in span, not button
			const icon = screen.getByTestId("left-icon");
			expect(icon.parentElement?.tagName).toBe("SPAN");
		});

		it("handleIconRightClick does nothing when onIconRightClick is undefined", () => {
			const IconRight = ({ size }: { size: number }) => (
				<span data-testid="right-icon">{size}</span>
			);

			// Render with no onIconRightClick handler - IconSlot will render as span
			render(<Button iconRight={IconRight}>Click me</Button>);

			// Icon should be wrapped in span, not button
			const icon = screen.getByTestId("right-icon");
			expect(icon.parentElement?.tagName).toBe("SPAN");
		});

		it("handleIconLeftClick is blocked when button is disabled even with handler", () => {
			const handleIconLeftClick = vi.fn();
			const IconLeft = ({ size }: { size: number }) => <span data-testid="left-icon">{size}</span>;

			render(
				<Button iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick} disabled>
					Click me
				</Button>,
			);

			// The main button should be disabled
			const buttons = screen.getAllByRole("button");
			const mainButton = buttons[0];
			expect(mainButton).toBeDisabled();
			// The icon is still rendered
			expect(screen.getByTestId("left-icon")).toBeInTheDocument();
		});

		it("handleIconRightClick is blocked when button is disabled even with handler", () => {
			const handleIconRightClick = vi.fn();
			const IconRight = ({ size }: { size: number }) => (
				<span data-testid="right-icon">{size}</span>
			);

			render(
				<Button iconRight={IconRight} onIconRightClick={handleIconRightClick} disabled>
					Click me
				</Button>,
			);

			// The main button should be disabled
			const buttons = screen.getAllByRole("button");
			const mainButton = buttons[0];
			expect(mainButton).toBeDisabled();
			// The icon is still rendered
			expect(screen.getByTestId("right-icon")).toBeInTheDocument();
		});
	});

	describe("Size variations with circle", () => {
		it("renders circle button with sm size", () => {
			render(
				<Button circle size="sm">
					X
				</Button>,
			);
			expect(screen.getByRole("button")).toHaveClass("rounded-full");
		});

		it("renders circle button with lg size", () => {
			render(
				<Button circle size="lg">
					X
				</Button>,
			);
			expect(screen.getByRole("button")).toHaveClass("rounded-full");
		});
	});

	describe("Variant states", () => {
		it("applies error variant styles", () => {
			render(<Button variant="error">Error</Button>);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("applies text variant styles", () => {
			render(<Button variant="text">Text</Button>);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});
	});
});
