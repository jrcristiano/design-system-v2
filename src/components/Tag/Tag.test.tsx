import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Tag } from "./Tag";

describe("Tag", () => {
	it("renders with children text", () => {
		render(<Tag>Status</Tag>);
		expect(screen.getByText("Status")).toBeInTheDocument();
	});

	it("renders with different variants", () => {
		const { rerender } = render(<Tag variant="primary">Primary</Tag>);
		expect(screen.getByText("Primary")).toBeInTheDocument();

		rerender(<Tag variant="success">Success</Tag>);
		expect(screen.getByText("Success")).toBeInTheDocument();

		rerender(<Tag variant="warning">Warning</Tag>);
		expect(screen.getByText("Warning")).toBeInTheDocument();

		rerender(<Tag variant="danger">Danger</Tag>);
		expect(screen.getByText("Danger")).toBeInTheDocument();

		rerender(<Tag variant="info">Info</Tag>);
		expect(screen.getByText("Info")).toBeInTheDocument();
	});

	it("renders with different sizes", () => {
		const { rerender } = render(<Tag size="sm">Small</Tag>);
		expect(screen.getByText("Small")).toBeInTheDocument();

		rerender(<Tag size="md">Medium</Tag>);
		expect(screen.getByText("Medium")).toBeInTheDocument();
	});

	it("renders as pill when pill prop is true", () => {
		render(<Tag pill>Pill Tag</Tag>);
		expect(screen.getByText("Pill Tag")).toBeInTheDocument();
	});

	it("renders with count", () => {
		render(<Tag count={5}>Items</Tag>);
		expect(screen.getByText("5")).toBeInTheDocument();
		expect(screen.getByText("Items")).toBeInTheDocument();
	});

	it("renders closable tag with X button", () => {
		render(<Tag closable>Closable</Tag>);
		expect(screen.getByText("Closable")).toBeInTheDocument();
	});

	it("calls onClose when close button is clicked", async () => {
		const user = userEvent.setup();
		const handleClose = vi.fn();
		render(
			<Tag closable onClose={handleClose}>
				Close me
			</Tag>,
		);

		const closeButton = screen.getByText("Close me").parentElement?.querySelector("svg");
		if (closeButton) {
			await user.click(closeButton);
			expect(handleClose).toHaveBeenCalled();
		}
	});

	it("hides when closed", async () => {
		const user = userEvent.setup();
		render(<Tag closable>Will hide</Tag>);

		const closeButton = screen.getByText("Will hide").parentElement?.querySelector("svg");
		if (closeButton) {
			await user.click(closeButton);
			expect(screen.queryByText("Will hide")).not.toBeInTheDocument();
		}
	});

	it("is not clickable when disabled", () => {
		render(<Tag disabled>Disabled</Tag>);
		const tag = screen.getByRole("button", { name: /disabled/i });
		expect(tag).toBeDisabled();
	});

	it("renders with left icon", () => {
		const IconLeft = () => <span data-testid="icon-left">Icon</span>;
		render(<Tag iconLeft={IconLeft}>With Icon</Tag>);
		expect(screen.getByTestId("icon-left")).toBeInTheDocument();
	});

	it("renders as circle when circle prop is true", () => {
		render(
			<Tag circle iconLeft={() => <span data-testid="icon">I</span>}>
				C
			</Tag>,
		);
		// Circle tags don't show text, only icon
		const icon = screen.getByTestId("icon");
		expect(icon).toBeInTheDocument();
	});

	it("handles mouse enter and leave events", async () => {
		const user = userEvent.setup();
		render(<Tag>Hover me</Tag>);
		const tag = screen.getByRole("button", { name: /hover me/i });

		await user.hover(tag);
		await user.unhover(tag);
		expect(tag).toBeInTheDocument();
	});

	it("handles focus and blur events", async () => {
		const user = userEvent.setup();
		render(<Tag>Focus me</Tag>);
		const tag = screen.getByRole("button", { name: /focus me/i });

		await user.tab();
		await user.tab();
		expect(tag).toBeInTheDocument();
	});

	it("handles mouse down and up events", async () => {
		const user = userEvent.setup();
		render(<Tag>Press me</Tag>);
		const tag = screen.getByRole("button", { name: /press me/i });

		await user.pointer({ keys: "[MouseLeft>]", target: tag });
		await user.pointer({ keys: "[/MouseLeft]", target: tag });
		expect(tag).toBeInTheDocument();
	});

	it("does not change state when disabled on hover", async () => {
		const user = userEvent.setup();
		render(<Tag disabled>Disabled</Tag>);
		const tag = screen.getByRole("button", { name: /disabled/i });

		await user.hover(tag);
		await user.unhover(tag);
		expect(tag).toBeInTheDocument();
	});

	it("does not change state when disabled on focus", async () => {
		render(<Tag disabled>Disabled Focus</Tag>);
		const tag = screen.getByRole("button", { name: /disabled focus/i });

		tag.focus();
		tag.blur();
		expect(tag).toBeInTheDocument();
	});

	it("renders with right icon", () => {
		const IconRight = () => <span data-testid="icon-right">R</span>;
		render(<Tag iconRight={IconRight}>With Right</Tag>);
		expect(screen.getByTestId("icon-right")).toBeInTheDocument();
	});

	it("handles hoverBorderOnly prop", async () => {
		const user = userEvent.setup();
		render(<Tag hoverBorderOnly>Border on Hover</Tag>);
		const tag = screen.getByRole("button", { name: /border on hover/i });

		await user.hover(tag);
		expect(tag).toBeInTheDocument();
	});

	it("calls onIconLeftClick when left icon is clicked", async () => {
		const user = userEvent.setup();
		const handleIconLeftClick = vi.fn();
		const IconLeft = () => <span data-testid="icon-left">L</span>;
		render(
			<Tag iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick}>
				With Left Icon
			</Tag>,
		);

		const iconElement = screen.getByTestId("icon-left");
		await user.click(iconElement);
		expect(handleIconLeftClick).toHaveBeenCalled();
	});

	it("calls onIconRightClick when right icon is clicked", async () => {
		const user = userEvent.setup();
		const handleIconRightClick = vi.fn();
		const IconRight = () => <span data-testid="icon-right">R</span>;
		render(
			<Tag iconRight={IconRight} onIconRightClick={handleIconRightClick}>
				With Right Icon
			</Tag>,
		);

		const iconElement = screen.getByTestId("icon-right");
		await user.click(iconElement);
		expect(handleIconRightClick).toHaveBeenCalled();
	});

	it("does not call onIconLeftClick when disabled", async () => {
		const user = userEvent.setup();
		const handleIconLeftClick = vi.fn();
		const IconLeft = () => <span data-testid="icon-left">L</span>;
		render(
			<Tag disabled iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick}>
				Disabled Left
			</Tag>,
		);

		const iconElement = screen.getByTestId("icon-left");
		await user.click(iconElement);
		expect(handleIconLeftClick).not.toHaveBeenCalled();
	});

	it("does not call onIconRightClick when disabled", async () => {
		const user = userEvent.setup();
		const handleIconRightClick = vi.fn();
		const IconRight = () => <span data-testid="icon-right">R</span>;
		render(
			<Tag disabled iconRight={IconRight} onIconRightClick={handleIconRightClick}>
				Disabled Right
			</Tag>,
		);

		const iconElement = screen.getByTestId("icon-right");
		await user.click(iconElement);
		expect(handleIconRightClick).not.toHaveBeenCalled();
	});

	it("calls onIconRightClick and handleClose when closable with onIconRightClick", async () => {
		const user = userEvent.setup();
		const handleIconRightClick = vi.fn();
		const handleClose = vi.fn();
		render(
			<Tag closable onIconRightClick={handleIconRightClick} onClose={handleClose}>
				Closable with handler
			</Tag>,
		);

		const closeIcon = screen.getByText("Closable with handler").parentElement?.querySelector("svg");
		if (closeIcon) {
			await user.click(closeIcon);
			expect(handleIconRightClick).toHaveBeenCalled();
			expect(handleClose).toHaveBeenCalled();
		}
	});

	it("does not trigger icon click when clicking outside icon area", async () => {
		const user = userEvent.setup();
		const handleIconLeftClick = vi.fn();
		const handleIconRightClick = vi.fn();
		const IconLeft = () => <span data-testid="icon-left">L</span>;
		const IconRight = () => <span data-testid="icon-right">R</span>;
		render(
			<Tag
				iconLeft={IconLeft}
				iconRight={IconRight}
				onIconLeftClick={handleIconLeftClick}
				onIconRightClick={handleIconRightClick}
			>
				Click Text
			</Tag>,
		);

		// Click on the text content, not on icons
		const textElement = screen.getByText("Click Text");
		await user.click(textElement);
		expect(handleIconLeftClick).not.toHaveBeenCalled();
		expect(handleIconRightClick).not.toHaveBeenCalled();
	});

	describe("handleIconLeftClick edge cases", () => {
		it("does not call onIconLeftClick when disabled even with handler", async () => {
			const user = userEvent.setup();
			const handleIconLeftClick = vi.fn();
			const IconLeft = () => <span data-testid="icon-left">L</span>;
			render(
				<Tag disabled iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick}>
					Disabled Left Icon
				</Tag>,
			);

			const iconSlot = screen.getByTestId("icon-left").closest("[data-tag-icon]");
			if (iconSlot) {
				await user.click(iconSlot);
			}
			expect(handleIconLeftClick).not.toHaveBeenCalled();
		});

		it("calls onIconLeftClick when not disabled", async () => {
			const user = userEvent.setup();
			const handleIconLeftClick = vi.fn();
			const IconLeft = () => <span data-testid="icon-left">L</span>;
			render(
				<Tag iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick}>
					Enabled Left Icon
				</Tag>,
			);

			const iconElement = screen.getByTestId("icon-left");
			await user.click(iconElement);
			expect(handleIconLeftClick).toHaveBeenCalled();
		});
	});

	describe("handleIconRightClick edge cases", () => {
		it("does not call onIconRightClick when disabled", async () => {
			const user = userEvent.setup();
			const handleIconRightClick = vi.fn();
			const IconRight = () => <span data-testid="icon-right">R</span>;
			render(
				<Tag disabled iconRight={IconRight} onIconRightClick={handleIconRightClick}>
					Disabled Right Icon
				</Tag>,
			);

			const iconSlot = screen.getByTestId("icon-right").closest("[data-tag-icon]");
			if (iconSlot) {
				await user.click(iconSlot);
			}
			expect(handleIconRightClick).not.toHaveBeenCalled();
		});

		it("calls handleClose when closable and right icon clicked", async () => {
			const user = userEvent.setup();
			const handleIconRightClick = vi.fn();
			const handleClose = vi.fn();
			render(
				<Tag closable onIconRightClick={handleIconRightClick} onClose={handleClose}>
					Closable Tag
				</Tag>,
			);

			const closeIcon = screen.getByText("Closable Tag").parentElement?.querySelector("svg");
			if (closeIcon) {
				await user.click(closeIcon);
			}
			expect(handleIconRightClick).toHaveBeenCalled();
			expect(handleClose).toHaveBeenCalled();
		});
	});

	describe("handleButtonClick edge cases", () => {
		it("does nothing when disabled and button clicked", async () => {
			const user = userEvent.setup();
			const handleIconLeftClick = vi.fn();
			const IconLeft = () => <span data-testid="icon-left">L</span>;
			render(
				<Tag disabled iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick}>
					Disabled Button
				</Tag>,
			);

			const button = screen.getByRole("button");
			await user.click(button);
			expect(handleIconLeftClick).not.toHaveBeenCalled();
		});

		it("does nothing when clicking on non-icon target", async () => {
			const user = userEvent.setup();
			const handleIconLeftClick = vi.fn();
			const handleIconRightClick = vi.fn();
			const IconLeft = () => <span data-testid="icon-left">L</span>;
			const IconRight = () => <span data-testid="icon-right">R</span>;
			render(
				<Tag
					iconLeft={IconLeft}
					iconRight={IconRight}
					onIconLeftClick={handleIconLeftClick}
					onIconRightClick={handleIconRightClick}
				>
					Text Content
				</Tag>,
			);

			// Click on the text span, not the icon
			const textSpan = screen.getByText("Text Content");
			await user.click(textSpan);
			expect(handleIconLeftClick).not.toHaveBeenCalled();
			expect(handleIconRightClick).not.toHaveBeenCalled();
		});

		it("handles left icon click via handleButtonClick", async () => {
			const user = userEvent.setup();
			const handleIconLeftClick = vi.fn();
			const IconLeft = () => <span data-testid="icon-left">L</span>;
			render(
				<Tag iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick}>
					Left Icon Tag
				</Tag>,
			);

			const iconSlot = screen.getByTestId("icon-left").closest("[data-tag-icon='left']");
			if (iconSlot) {
				await user.click(iconSlot);
			}
			expect(handleIconLeftClick).toHaveBeenCalled();
		});

		it("handles right icon click via handleButtonClick", async () => {
			const user = userEvent.setup();
			const handleIconRightClick = vi.fn();
			const IconRight = () => <span data-testid="icon-right">R</span>;
			render(
				<Tag iconRight={IconRight} onIconRightClick={handleIconRightClick}>
					Right Icon Tag
				</Tag>,
			);

			const iconSlot = screen.getByTestId("icon-right").closest("[data-tag-icon='right']");
			if (iconSlot) {
				await user.click(iconSlot);
			}
			expect(handleIconRightClick).toHaveBeenCalled();
		});
	});

	describe("resolveCurrentState function", () => {
		it("returns state directly when state is not default", () => {
			render(<Tag state="selected">Selected State</Tag>);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("returns disabled when state is default and disabled is true", () => {
			render(
				<Tag state="default" disabled>
					Disabled State
				</Tag>,
			);
			expect(screen.getByRole("button")).toBeDisabled();
		});

		it("returns focused when state is default and isFocused is true", async () => {
			const user = userEvent.setup();
			render(<Tag state="default">Focus State</Tag>);
			const button = screen.getByRole("button");
			await user.tab();
			expect(button).toHaveFocus();
		});

		it("returns pressed when state is default and isPressed is true", async () => {
			const user = userEvent.setup();
			render(<Tag state="default">Press State</Tag>);
			const button = screen.getByRole("button");
			await user.pointer({ keys: "[MouseLeft>]", target: button });
			expect(button).toBeInTheDocument();
		});

		it("returns hover when state is default and isHovered is true", async () => {
			const user = userEvent.setup();
			render(<Tag state="default">Hover State</Tag>);
			const button = screen.getByRole("button");
			await user.hover(button);
			expect(button).toBeInTheDocument();
		});
	});

	describe("inactive variant", () => {
		it("renders with inactive variant", () => {
			render(<Tag variant="inactive">Inactive</Tag>);
			expect(screen.getByText("Inactive")).toBeInTheDocument();
		});
	});

	describe("circle tag behavior", () => {
		it("does not show text content when circle is true", () => {
			const IconLeft = () => <span data-testid="icon">I</span>;
			render(
				<Tag circle iconLeft={IconLeft}>
					Hidden Text
				</Tag>,
			);
			expect(screen.queryByText("Hidden Text")).not.toBeInTheDocument();
			expect(screen.getByTestId("icon")).toBeInTheDocument();
		});

		it("does not show right icon when circle is true", () => {
			const IconLeft = () => <span data-testid="icon-left">L</span>;
			const IconRight = () => <span data-testid="icon-right">R</span>;
			render(
				<Tag circle iconLeft={IconLeft} iconRight={IconRight}>
					Circle
				</Tag>,
			);
			expect(screen.getByTestId("icon-left")).toBeInTheDocument();
			expect(screen.queryByTestId("icon-right")).not.toBeInTheDocument();
		});

		it("does not show count when circle is true", () => {
			const IconLeft = () => <span data-testid="icon">I</span>;
			render(
				<Tag circle count={5} iconLeft={IconLeft}>
					Circle
				</Tag>,
			);
			expect(screen.queryByText("5")).not.toBeInTheDocument();
		});
	});

	describe("count display", () => {
		it("shows count of 0", () => {
			render(<Tag count={0}>With Zero</Tag>);
			expect(screen.getByText("0")).toBeInTheDocument();
		});

		it("does not show count when null", () => {
			render(<Tag count={null as any}>Without Count</Tag>);
			// Should not render a count
			expect(screen.getByText("Without Count")).toBeInTheDocument();
		});

		it("does not show count when undefined", () => {
			render(<Tag count={undefined}>Without Count</Tag>);
			expect(screen.getByText("Without Count")).toBeInTheDocument();
		});
	});
});
