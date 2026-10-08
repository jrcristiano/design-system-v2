import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MenuItem } from "./MenuItem";
import { MenuContext } from "./MenuContext";

const renderWithContext = (ui: React.ReactElement, isCollapsed = false) => {
	return render(<MenuContext.Provider value={{ isCollapsed }}>{ui}</MenuContext.Provider>);
};

describe("MenuItem", () => {
	it("renders with label", () => {
		renderWithContext(<MenuItem label="Dashboard" />);
		expect(screen.getByText("Dashboard")).toBeInTheDocument();
	});

	it("renders as button by default", () => {
		renderWithContext(<MenuItem label="Click me" />);
		expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
	});

	it("renders as link when href is provided", () => {
		renderWithContext(<MenuItem label="Go Home" href="/home" />);
		expect(screen.getByRole("link", { name: /go home/i })).toHaveAttribute("href", "/home");
	});

	it("calls onClick when clicked", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		renderWithContext(<MenuItem label="Click" onClick={handleClick} />);

		await user.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalled();
	});

	it("does not call onClick when disabled", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		renderWithContext(<MenuItem label="Disabled" disabled onClick={handleClick} />);

		await user.click(screen.getByRole("button"));
		expect(handleClick).not.toHaveBeenCalled();
	});

	it("renders with left icon", () => {
		const Icon = ({ size }: { size: number }) => <span data-testid="left-icon">{size}</span>;
		renderWithContext(<MenuItem label="With Icon" leftIcon={Icon} />);
		expect(screen.getByTestId("left-icon")).toBeInTheDocument();
	});

	it("renders with right icon", () => {
		const Icon = ({ size }: { size: number }) => <span data-testid="right-icon">{size}</span>;
		renderWithContext(<MenuItem label="With Icon" rightIcon={Icon} />);
		expect(screen.getByTestId("right-icon")).toBeInTheDocument();
	});

	it("applies active styles when isActive is true", () => {
		renderWithContext(<MenuItem label="Active" isActive />);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("text-[var(--ds-color-blue-30)]");
	});

	it("renders submenu when children are provided", async () => {
		const user = userEvent.setup();
		renderWithContext(
			<MenuItem label="Parent">
				<MenuItem label="Child 1" />
				<MenuItem label="Child 2" />
			</MenuItem>,
		);

		const parent = screen.getByRole("button", { name: /parent/i });
		expect(parent).toHaveAttribute("aria-expanded", "false");
		const submenu = document.querySelector('nav[aria-label="Submenu de Parent"]')!;
		expect(submenu).toHaveAttribute("inert");

		await user.click(parent);
		expect(parent).toHaveAttribute("aria-expanded", "true");
		expect(submenu).not.toHaveAttribute("inert");
		expect(screen.getByText("Child 1")).toBeInTheDocument();
	});

	it("hides label when menu is collapsed", () => {
		renderWithContext(<MenuItem label="Hidden Label" />, true);
		expect(screen.queryByText("Hidden Label")).not.toBeInTheDocument();
	});

	it("handles keyboard navigation with Enter", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		renderWithContext(<MenuItem label="Keyboard" onClick={handleClick} />);

		const button = screen.getByRole("button");
		button.focus();
		await user.keyboard("{Enter}");
		expect(handleClick).toHaveBeenCalled();
	});

	it("handles keyboard navigation with Space", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		renderWithContext(<MenuItem label="Keyboard" onClick={handleClick} />);

		const button = screen.getByRole("button");
		button.focus();
		await user.keyboard(" ");
		expect(handleClick).toHaveBeenCalled();
	});

	it("expands submenu with ArrowDown key", async () => {
		const user = userEvent.setup();
		renderWithContext(
			<MenuItem label="Parent">
				<MenuItem label="Child" />
			</MenuItem>,
		);

		const parent = screen.getByRole("button", { name: /parent/i });
		parent.focus();
		await user.keyboard("{ArrowDown}");
		expect(parent).toHaveAttribute("aria-expanded", "true");
	});

	it("collapses submenu with ArrowUp key", async () => {
		const user = userEvent.setup();
		renderWithContext(
			<MenuItem label="Parent">
				<MenuItem label="Child" />
			</MenuItem>,
		);

		const parent = screen.getByRole("button", { name: /parent/i });
		await user.click(parent);
		expect(parent).toHaveAttribute("aria-expanded", "true");

		parent.focus();
		await user.keyboard("{ArrowUp}");
		expect(parent).toHaveAttribute("aria-expanded", "false");
	});

	it("handles hover state", async () => {
		const user = userEvent.setup();
		renderWithContext(<MenuItem label="Hover Me" />);

		const button = screen.getByRole("button");
		await user.hover(button);
		expect(button).toBeInTheDocument();

		await user.unhover(button);
		expect(button).toBeInTheDocument();
	});

	it("applies custom className", () => {
		renderWithContext(<MenuItem label="Custom" className="custom-class" />);
		expect(screen.getByRole("button")).toHaveClass("custom-class");
	});

	it("renders as submenu item with isSubmenuItem prop", () => {
		renderWithContext(<MenuItem label="Submenu Item" isSubmenuItem />);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("toggles submenu with Enter key", async () => {
		const user = userEvent.setup();
		renderWithContext(
			<MenuItem label="Parent">
				<MenuItem label="Child" />
			</MenuItem>,
		);

		const parent = screen.getByRole("button", { name: /parent/i });
		expect(parent).toHaveAttribute("aria-expanded", "false");

		parent.focus();
		await user.keyboard("{Enter}");
		expect(parent).toHaveAttribute("aria-expanded", "true");

		await user.keyboard("{Enter}");
		expect(parent).toHaveAttribute("aria-expanded", "false");
	});

	it("toggles submenu with Space key", async () => {
		const user = userEvent.setup();
		renderWithContext(
			<MenuItem label="Parent">
				<MenuItem label="Child" />
			</MenuItem>,
		);

		const parent = screen.getByRole("button", { name: /parent/i });
		parent.focus();
		await user.keyboard(" ");
		expect(parent).toHaveAttribute("aria-expanded", "true");
	});

	it("prevents navigation on disabled link", () => {
		const handleClick = vi.fn();
		renderWithContext(
			<MenuItem label="Disabled Link" href="/test" disabled onClick={handleClick} />,
		);

		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("tabindex", "-1");
		// Use fireEvent as userEvent respects pointer-events: none
		fireEvent.click(link);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it("calls onClick when clicking non-disabled link", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		renderWithContext(<MenuItem label="Clickable Link" href="/test" onClick={handleClick} />);

		const link = screen.getByRole("link");
		await user.click(link);
		expect(handleClick).toHaveBeenCalled();
	});

	it("forwards anchor attributes to links", () => {
		renderWithContext(
			<MenuItem
				label="External link"
				href="/docs"
				target="_blank"
				rel="noreferrer"
				data-source="menu"
			/>,
		);
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noreferrer");
		expect(link).toHaveAttribute("data-source", "menu");
	});

	it("handles non-element children in submenu", async () => {
		const user = userEvent.setup();
		renderWithContext(
			<MenuItem label="Parent">
				{null}
				<MenuItem label="Valid Child" />
				{"text child"}
			</MenuItem>,
		);

		const parent = screen.getByRole("button", { name: /parent/i });
		await user.click(parent);
		expect(screen.getByText("Valid Child")).toBeInTheDocument();
	});

	it("does not respond to keyboard when disabled", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		renderWithContext(<MenuItem label="Disabled" disabled onClick={handleClick} />);

		const button = screen.getByRole("button");
		button.focus();
		await user.keyboard("{Enter}");
		expect(handleClick).not.toHaveBeenCalled();
	});

	it("handles focus and blur events", async () => {
		const user = userEvent.setup();
		renderWithContext(<MenuItem label="Focus Me" />);

		const button = screen.getByRole("button");
		await user.click(button);
		expect(button).toHaveFocus();

		await user.tab();
		expect(button).not.toHaveFocus();
	});

	it("handles mouse down and up events", async () => {
		const user = userEvent.setup();
		renderWithContext(<MenuItem label="Press Me" />);

		const button = screen.getByRole("button");
		await user.pointer({ target: button, keys: "[MouseLeft>]" });
		await user.pointer({ target: button, keys: "[/MouseLeft]" });
		expect(button).toBeInTheDocument();
	});
});
