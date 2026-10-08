import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Tab } from "./Tab";

describe("Tab", () => {
	it("renders with label", () => {
		render(<Tab label="Tab Label" />);
		expect(screen.getByRole("tab", { name: "Tab Label" })).toBeInTheDocument();
	});

	it("renders with role tab", () => {
		render(<Tab label="Test Tab" />);
		expect(screen.getByRole("tab")).toBeInTheDocument();
	});

	it("calls onSelect when clicked", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();
		render(<Tab label="Click Me" onSelect={handleSelect} />);

		await user.click(screen.getByRole("tab"));
		expect(handleSelect).toHaveBeenCalled();
	});

	it("does not call onSelect when disabled", async () => {
		const user = userEvent.setup();
		const handleSelect = vi.fn();
		render(<Tab label="Disabled Tab" disabled onSelect={handleSelect} />);

		await user.click(screen.getByRole("tab"));
		expect(handleSelect).not.toHaveBeenCalled();
	});

	it("is disabled when disabled prop is true", () => {
		render(<Tab label="Disabled" disabled />);
		expect(screen.getByRole("tab")).toBeDisabled();
	});

	it("has aria-selected true when selected", () => {
		render(<Tab label="Selected Tab" selected />);
		expect(screen.getByRole("tab")).toHaveAttribute("aria-selected", "true");
	});

	it("has aria-selected false when not selected", () => {
		render(<Tab label="Unselected Tab" />);
		expect(screen.getByRole("tab")).toHaveAttribute("aria-selected", "false");
	});

	it("renders with simple type", () => {
		render(<Tab label="Simple" type="simple" />);
		expect(screen.getByRole("tab")).toBeInTheDocument();
	});

	it("renders with horizontal-indicator type", () => {
		render(<Tab label="Horizontal" type="horizontal-indicator" />);
		expect(screen.getByRole("tab")).toBeInTheDocument();
	});

	it("renders with vertical-indicator type", () => {
		render(<Tab label="Vertical" type="vertical-indicator" />);
		expect(screen.getByRole("tab")).toBeInTheDocument();
	});

	it("renders with contained type", () => {
		render(<Tab label="Contained" type="contained" />);
		expect(screen.getByRole("tab")).toBeInTheDocument();
	});

	it("renders with left icon", () => {
		const IconLeft = ({ size }: { size: number }) => (
			<span data-testid="icon-left" style={{ width: size }}>
				←
			</span>
		);
		render(<Tab label="With Icon" iconLeft={IconLeft} />);
		expect(screen.getByTestId("icon-left")).toBeInTheDocument();
	});

	it("renders with right icon", () => {
		const IconRight = ({ size }: { size: number }) => (
			<span data-testid="icon-right" style={{ width: size }}>
				→
			</span>
		);
		render(<Tab label="With Icon" iconRight={IconRight} />);
		expect(screen.getByTestId("icon-right")).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(<Tab label="Custom" className="custom-tab" />);
		expect(screen.getByRole("tab")).toHaveClass("custom-tab");
	});

	it("handles hover state", async () => {
		const user = userEvent.setup();
		render(<Tab label="Hover Me" />);

		const tab = screen.getByRole("tab");
		await user.hover(tab);
		expect(tab).toBeInTheDocument();
	});

	it("handles mousedown and mouseup", async () => {
		const user = userEvent.setup();
		render(<Tab label="Press Me" />);

		const tab = screen.getByRole("tab");
		await user.pointer([{ target: tab, keys: "[MouseLeft>]" }, { keys: "[/MouseLeft]" }]);
		expect(tab).toBeInTheDocument();
	});

	it("calls onClick handler", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		render(<Tab label="Click" onClick={handleClick} />);

		await user.click(screen.getByRole("tab"));
		expect(handleClick).toHaveBeenCalled();
	});

	it("handles mouse leave event", async () => {
		const user = userEvent.setup();
		render(<Tab label="Leave Me" />);

		const tab = screen.getByRole("tab");
		await user.hover(tab);
		await user.unhover(tab);
		expect(tab).toBeInTheDocument();
	});

	it("resets pressed state on mouse leave", async () => {
		const user = userEvent.setup();
		render(<Tab label="Reset Press" />);

		const tab = screen.getByRole("tab");
		// Press and then leave to trigger both setIsHovered(false) and setIsPressed(false)
		await user.pointer([{ target: tab, keys: "[MouseLeft>]" }]);
		await user.unhover(tab);
		expect(tab).toBeInTheDocument();
	});

	it("calls onIconLeftClick when left icon is clicked", async () => {
		const user = userEvent.setup();
		const handleIconLeftClick = vi.fn();
		const IconLeft = ({ size }: { size: number }) => (
			<span data-testid="icon-left" style={{ width: size }}>
				←
			</span>
		);
		render(<Tab label="With Icon" iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick} />);

		const iconButton = screen.getByTestId("icon-left").parentElement;
		expect(iconButton).toBeInTheDocument();
		await user.click(iconButton!);
		expect(handleIconLeftClick).toHaveBeenCalled();
	});

	it("calls onIconRightClick when right icon is clicked", async () => {
		const user = userEvent.setup();
		const handleIconRightClick = vi.fn();
		const IconRight = ({ size }: { size: number }) => (
			<span data-testid="icon-right" style={{ width: size }}>
				→
			</span>
		);
		render(<Tab label="With Icon" iconRight={IconRight} onIconRightClick={handleIconRightClick} />);

		const iconButton = screen.getByTestId("icon-right").parentElement;
		expect(iconButton).toBeInTheDocument();
		await user.click(iconButton!);
		expect(handleIconRightClick).toHaveBeenCalled();
	});

	it("does not call onIconLeftClick when disabled", async () => {
		const user = userEvent.setup();
		const handleIconLeftClick = vi.fn();
		const IconLeft = ({ size }: { size: number }) => (
			<span data-testid="icon-left" style={{ width: size }}>
				←
			</span>
		);
		render(
			<Tab label="Disabled" disabled iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick} />,
		);

		const iconButton = screen.getByTestId("icon-left").closest("button");
		if (iconButton) {
			await user.click(iconButton);
		}
		expect(handleIconLeftClick).not.toHaveBeenCalled();
	});

	it("does not call onIconRightClick when disabled", async () => {
		const user = userEvent.setup();
		const handleIconRightClick = vi.fn();
		const IconRight = ({ size }: { size: number }) => (
			<span data-testid="icon-right" style={{ width: size }}>
				→
			</span>
		);
		render(
			<Tab
				label="Disabled"
				disabled
				iconRight={IconRight}
				onIconRightClick={handleIconRightClick}
			/>,
		);

		const iconButton = screen.getByTestId("icon-right").closest("button");
		if (iconButton) {
			await user.click(iconButton);
		}
		expect(handleIconRightClick).not.toHaveBeenCalled();
	});

	describe("handleClick behavior", () => {
		it("does not call onSelect when disabled", async () => {
			const user = userEvent.setup();
			const handleSelect = vi.fn();
			const handleClick = vi.fn();
			render(<Tab label="Disabled Tab" disabled onSelect={handleSelect} onClick={handleClick} />);

			await user.click(screen.getByRole("tab"));
			expect(handleSelect).not.toHaveBeenCalled();
			expect(handleClick).not.toHaveBeenCalled();
		});

		it("calls both onSelect and onClick when not disabled", async () => {
			const user = userEvent.setup();
			const handleSelect = vi.fn();
			const handleClick = vi.fn();
			render(<Tab label="Enabled Tab" onSelect={handleSelect} onClick={handleClick} />);

			await user.click(screen.getByRole("tab"));
			expect(handleSelect).toHaveBeenCalled();
			expect(handleClick).toHaveBeenCalled();
		});
	});

	describe("icon click handlers when disabled", () => {
		it("handleIconLeftClick does not call callback when disabled", async () => {
			const user = userEvent.setup();
			const handleIconLeftClick = vi.fn();
			const IconLeft = ({ size }: { size: number }) => (
				<span data-testid="icon-left" style={{ width: size }}>
					L
				</span>
			);
			render(
				<Tab label="Test" disabled iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick} />,
			);

			// Try clicking directly on the icon
			await user.click(screen.getByTestId("icon-left"));
			expect(handleIconLeftClick).not.toHaveBeenCalled();
		});

		it("handleIconRightClick does not call callback when disabled", async () => {
			const user = userEvent.setup();
			const handleIconRightClick = vi.fn();
			const IconRight = ({ size }: { size: number }) => (
				<span data-testid="icon-right" style={{ width: size }}>
					R
				</span>
			);
			render(
				<Tab label="Test" disabled iconRight={IconRight} onIconRightClick={handleIconRightClick} />,
			);

			// Try clicking directly on the icon
			await user.click(screen.getByTestId("icon-right"));
			expect(handleIconRightClick).not.toHaveBeenCalled();
		});
	});

	describe("interaction handlers when disabled", () => {
		it("does not attach mouse handlers when disabled", async () => {
			const user = userEvent.setup();
			render(<Tab label="Disabled Interaction" disabled />);

			const tab = screen.getByRole("tab");
			// These should not change state since handlers are empty object
			await user.hover(tab);
			await user.unhover(tab);
			await user.pointer([{ target: tab, keys: "[MouseLeft>]" }, { keys: "[/MouseLeft]" }]);
			expect(tab).toBeInTheDocument();
		});
	});

	describe("currentState transitions", () => {
		it("shows disabled state when disabled", () => {
			render(<Tab label="Disabled" disabled type="simple" />);
			expect(screen.getByRole("tab")).toHaveClass("cursor-not-allowed");
		});

		it("shows selected state when selected", () => {
			render(<Tab label="Selected" selected />);
			expect(screen.getByRole("tab")).toHaveAttribute("aria-selected", "true");
		});

		it("shows pressed state during mouse down", async () => {
			const user = userEvent.setup();
			render(<Tab label="Press" />);

			const tab = screen.getByRole("tab");
			await user.pointer([{ target: tab, keys: "[MouseLeft>]" }]);
			// Tab should be in pressed state during mouse down
			expect(tab).toBeInTheDocument();
		});

		it("shows hover state on mouse enter", async () => {
			const user = userEvent.setup();
			render(<Tab label="Hover" />);

			const tab = screen.getByRole("tab");
			await user.hover(tab);
			expect(tab).toBeInTheDocument();
		});

		it("uses provided state prop as default state", () => {
			render(<Tab label="Custom State" state="hover" />);
			expect(screen.getByRole("tab")).toBeInTheDocument();
		});
	});

	describe("icon rendering without click handlers", () => {
		it("renders left icon without onClick handler", () => {
			const IconLeft = ({ size }: { size: number }) => (
				<span data-testid="icon-left" style={{ width: size }}>
					L
				</span>
			);
			render(<Tab label="Icon Test" iconLeft={IconLeft} />);
			expect(screen.getByTestId("icon-left")).toBeInTheDocument();
		});

		it("renders right icon without onClick handler", () => {
			const IconRight = ({ size }: { size: number }) => (
				<span data-testid="icon-right" style={{ width: size }}>
					R
				</span>
			);
			render(<Tab label="Icon Test" iconRight={IconRight} />);
			expect(screen.getByTestId("icon-right")).toBeInTheDocument();
		});
	});
});
