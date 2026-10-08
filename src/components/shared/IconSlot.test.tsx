import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { IconSlot } from "./IconSlot";

describe("IconSlot", () => {
	describe("when onClick is not provided", () => {
		it("renders children inside a span", () => {
			render(
				<IconSlot>
					<span data-testid="icon">Icon</span>
				</IconSlot>,
			);

			const icon = screen.getByTestId("icon");
			expect(icon).toBeInTheDocument();
			expect(icon.parentElement?.tagName).toBe("SPAN");
		});

		it("applies flex-shrink-0 class by default", () => {
			render(
				<IconSlot>
					<span data-testid="icon">Icon</span>
				</IconSlot>,
			);

			const span = screen.getByTestId("icon").parentElement;
			expect(span).toHaveClass("flex-shrink-0");
		});

		it("applies custom className", () => {
			render(
				<IconSlot className="custom-class">
					<span data-testid="icon">Icon</span>
				</IconSlot>,
			);

			const span = screen.getByTestId("icon").parentElement;
			expect(span).toHaveClass("custom-class");
			expect(span).toHaveClass("flex-shrink-0");
		});
	});

	describe("when onClick is provided", () => {
		it("renders children inside an interactive span", () => {
			const handleClick = vi.fn();
			render(
				<IconSlot onClick={handleClick}>
					<span data-testid="icon">Icon</span>
				</IconSlot>,
			);

			const icon = screen.getByTestId("icon");
			expect(icon).toBeInTheDocument();
			expect(icon.parentElement?.tagName).toBe("BUTTON");
			expect(icon.parentElement).toHaveAttribute("type", "button");
		});

		it("renders interactive element as semantic button for accessibility", () => {
			const handleClick = vi.fn();
			render(
				<IconSlot onClick={handleClick}>
					<span data-testid="icon">Icon</span>
				</IconSlot>,
			);

			const el = screen.getByRole("button");
			expect(el.tagName).toBe("BUTTON");
			expect(el).toHaveAttribute("type", "button");
		});

		it("applies default interactive styling classes", () => {
			const handleClick = vi.fn();
			render(
				<IconSlot onClick={handleClick}>
					<span data-testid="icon">Icon</span>
				</IconSlot>,
			);

			const el = screen.getByRole("button");
			expect(el).toHaveClass("flex-shrink-0");
			expect(el).toHaveClass("cursor-pointer");
			expect(el).toHaveClass("p-0");
			expect(el).toHaveClass("bg-transparent");
		});

		it("applies custom className to button", () => {
			const handleClick = vi.fn();
			render(
				<IconSlot onClick={handleClick} className="custom-button-class">
					<span data-testid="icon">Icon</span>
				</IconSlot>,
			);

			const button = screen.getByRole("button");
			expect(button).toHaveClass("custom-button-class");
		});

		it("calls onClick when button is clicked", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<IconSlot onClick={handleClick}>
					<span>Icon</span>
				</IconSlot>,
			);

			await user.click(screen.getByRole("button"));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("calls onClick when Enter key is pressed", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<IconSlot onClick={handleClick}>
					<span>Icon</span>
				</IconSlot>,
			);

			const button = screen.getByRole("button");
			button.focus();
			await user.keyboard("{Enter}");
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("calls onClick when Space key is pressed", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<IconSlot onClick={handleClick}>
					<span>Icon</span>
				</IconSlot>,
			);

			const button = screen.getByRole("button");
			button.focus();
			await user.keyboard(" ");
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("does not call onClick for other keys", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<IconSlot onClick={handleClick}>
					<span>Icon</span>
				</IconSlot>,
			);

			const button = screen.getByRole("button");
			button.focus();
			await user.keyboard("{Tab}");
			expect(handleClick).not.toHaveBeenCalled();
		});

		it("calls custom onKeyDown handler", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			const handleKeyDown = vi.fn();
			render(
				<IconSlot onClick={handleClick} onKeyDown={handleKeyDown}>
					<span>Icon</span>
				</IconSlot>,
			);

			const button = screen.getByRole("button");
			button.focus();
			await user.keyboard("{Enter}");

			expect(handleClick).toHaveBeenCalledTimes(1);
			expect(handleKeyDown).toHaveBeenCalledTimes(1);
		});

		it("calls onKeyDown for non-Enter/Space keys", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			const handleKeyDown = vi.fn();
			render(
				<IconSlot onClick={handleClick} onKeyDown={handleKeyDown}>
					<span>Icon</span>
				</IconSlot>,
			);

			const button = screen.getByRole("button");
			button.focus();
			await user.keyboard("a");

			expect(handleClick).not.toHaveBeenCalled();
			expect(handleKeyDown).toHaveBeenCalled();
		});
	});

	describe("accessibility", () => {
		it("button is focusable when onClick is provided", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<IconSlot onClick={handleClick}>
					<span>Icon</span>
				</IconSlot>,
			);

			const button = screen.getByRole("button");
			await user.tab();
			expect(button).toHaveFocus();
		});

		it("span is not focusable when onClick is not provided", () => {
			render(
				<IconSlot>
					<span data-testid="icon">Icon</span>
				</IconSlot>,
			);

			const span = screen.getByTestId("icon").parentElement;
			expect(span).not.toHaveAttribute("tabindex");
		});
	});

	describe("data attributes", () => {
		it("passes data attributes to span when no onClick", () => {
			render(
				<IconSlot data-tag-icon="left" data-testattr="value">
					<span data-testid="icon">Icon</span>
				</IconSlot>,
			);

			const span = screen.getByTestId("icon").parentElement;
			expect(span).toHaveAttribute("data-tag-icon", "left");
			expect(span).toHaveAttribute("data-testattr", "value");
		});

		it("passes data attributes to button when onClick is provided", () => {
			const handleClick = vi.fn();
			render(
				<IconSlot onClick={handleClick} data-tag-icon="right" data-custom="test">
					<span data-testid="icon">Icon</span>
				</IconSlot>,
			);

			const button = screen.getByRole("button");
			expect(button).toHaveAttribute("data-tag-icon", "right");
			expect(button).toHaveAttribute("data-custom", "test");
		});

		it("supports event delegation pattern with data attributes", async () => {
			const user = userEvent.setup();
			const handleParentClick = vi.fn((e: React.MouseEvent) => {
				const target = e.target as HTMLElement;
				const iconSlot = target.closest("[data-icon-position]");
				return iconSlot?.getAttribute("data-icon-position");
			});

			render(
				<div onClick={handleParentClick}>
					<IconSlot data-icon-position="left">
						<span data-testid="left-icon">Left</span>
					</IconSlot>
					<IconSlot data-icon-position="right">
						<span data-testid="right-icon">Right</span>
					</IconSlot>
				</div>,
			);

			await user.click(screen.getByTestId("left-icon"));
			expect(handleParentClick).toHaveBeenCalled();
		});
	});
});
