import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown } from "./Dropdown";
import { DropdownItem } from "./DropdownItem";
import { DropdownMenu } from "./DropdownMenu";
import { DropdownSearch } from "./DropdownSearch";
import { DropdownTrigger } from "./DropdownTrigger";

describe("Dropdown components", () => {
	it("renders Dropdown with trigger and menu", () => {
		render(
			<Dropdown>
				<DropdownTrigger>Open Menu</DropdownTrigger>
				<DropdownMenu>
					<DropdownItem>Item 1</DropdownItem>
					<DropdownItem>Item 2</DropdownItem>
				</DropdownMenu>
			</Dropdown>,
		);

		expect(screen.queryByText("Item 1")).toBeNull();

		// Abre o menu
		fireEvent.click(screen.getByText("Open Menu"));
		expect(screen.getByText("Item 1")).toBeVisible();
		expect(screen.getByRole("menu")).toBeTruthy();
	});

	it("toggles menu with native Enter and Space activation", async () => {
		const user = userEvent.setup();
		render(
			<Dropdown>
				<DropdownTrigger>Open Menu</DropdownTrigger>
				<DropdownMenu>
					<DropdownItem>Item A</DropdownItem>
				</DropdownMenu>
			</Dropdown>,
		);

		const trigger = screen.getByRole("button", { name: "Open Menu" });

		trigger.focus();
		await user.keyboard("{Enter}");
		expect(screen.getByText("Item A")).toBeVisible();

		trigger.focus();
		await user.keyboard(" ");
		expect(screen.queryByText("Item A")).toBeNull();
	});

	it("gives non-native trigger elements button semantics", async () => {
		const user = userEvent.setup();
		render(
			<Dropdown>
				<DropdownTrigger>
					<div>Custom trigger</div>
				</DropdownTrigger>
				<DropdownMenu>
					<DropdownItem>Custom item</DropdownItem>
				</DropdownMenu>
			</Dropdown>,
		);

		const trigger = screen.getByRole("button", { name: "Custom trigger" });
		expect(trigger).toHaveAttribute("tabindex", "0");
		trigger.focus();
		await user.keyboard("{Enter}");
		expect(screen.getByText("Custom item")).toBeVisible();
	});

	it("closes menu on Escape", () => {
		render(
			<Dropdown>
				<DropdownTrigger>Open</DropdownTrigger>
				<DropdownMenu>
					<DropdownItem>Close Test</DropdownItem>
				</DropdownMenu>
			</Dropdown>,
		);

		fireEvent.click(screen.getByText("Open"));
		expect(screen.getByText("Close Test")).toBeVisible();

		fireEvent.keyDown(document, { key: "Escape" });
		expect(screen.queryByText("Close Test")).toBeNull();
	});

	it("DropdownItem checkbox toggles and calls onSelect", () => {
		const onSelect = vi.fn();
		render(
			<Dropdown>
				<DropdownTrigger>Open</DropdownTrigger>
				<DropdownMenu>
					<DropdownItem variant="checkbox" checked={false} onSelect={onSelect}>
						Check Me
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>,
		);

		fireEvent.click(screen.getByText("Open"));
		const item = screen.getByText("Check Me");

		fireEvent.click(item);
		expect(onSelect).toHaveBeenCalledWith(true);
	});

	it("uses one interactive element for checkbox menu items and supports arrow keys", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		render(
			<Dropdown>
				<DropdownTrigger>Open</DropdownTrigger>
				<DropdownMenu>
					<DropdownItem variant="checkbox" checked onSelect={onSelect}>
						First
					</DropdownItem>
					<DropdownItem>Second</DropdownItem>
				</DropdownMenu>
			</Dropdown>,
		);

		await user.click(screen.getByRole("button", { name: "Open" }));
		const first = screen.getByRole("menuitemcheckbox", { name: "First" });
		const second = screen.getByRole("menuitem", { name: "Second" });
		expect(first.querySelector("button, input")).toBeNull();
		expect(first).toHaveAttribute("aria-checked", "true");

		await user.keyboard("{ArrowDown}");
		expect(second).toHaveFocus();
		await user.keyboard("{ArrowUp}");
		expect(first).toHaveFocus();
		await user.keyboard("{Enter}");
		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith(false);
	});

	it("DropdownSearch updates query", () => {
		render(
			<Dropdown>
				<DropdownTrigger>Search Menu</DropdownTrigger>
				<DropdownSearch />
			</Dropdown>,
		);

		fireEvent.click(screen.getByText("Search Menu"));
		const input = screen.getByPlaceholderText("Buscar");

		fireEvent.change(input, { target: { value: "abc" } });
		expect((input as HTMLInputElement).value).toBe("abc");
	});

	it("DropdownMenu scrollable applies correct classes", () => {
		render(
			<Dropdown>
				<DropdownTrigger>Scroll Menu</DropdownTrigger>
				<DropdownMenu scrollable maxHeight="100px">
					<DropdownItem>Scrollable</DropdownItem>
				</DropdownMenu>
			</Dropdown>,
		);

		fireEvent.click(screen.getByText("Scroll Menu"));
		const menu = screen.getByRole("menu");
		expect(menu).toHaveStyle({ maxHeight: "100px", overflowY: "auto" });
		expect(menu.className).toMatch(/customScroll/);
	});

	it("DropdownTrigger adds aria attributes", () => {
		render(
			<Dropdown>
				<DropdownTrigger>Trigger Test</DropdownTrigger>
				<DropdownMenu>
					<DropdownItem>Item X</DropdownItem>
				</DropdownMenu>
			</Dropdown>,
		);

		const trigger = screen.getByText("Trigger Test");
		expect(trigger).toHaveAttribute("aria-haspopup", "menu");
		expect(trigger).toHaveAttribute("aria-expanded", "false");

		fireEvent.click(trigger);
		expect(trigger).toHaveAttribute("aria-expanded", "true");
	});
});
