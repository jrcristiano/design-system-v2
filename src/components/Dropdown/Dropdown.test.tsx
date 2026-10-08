import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

	it("toggles menu with keyboard Enter and Space", () => {
		render(
			<Dropdown>
				<DropdownTrigger>Open Menu</DropdownTrigger>
				<DropdownMenu>
					<DropdownItem>Item A</DropdownItem>
				</DropdownMenu>
			</Dropdown>,
		);

		const trigger = screen.getByText("Open Menu");

		// Press Enter
		fireEvent.keyDown(trigger, { key: "Enter" });
		expect(screen.getByText("Item A")).toBeVisible();

		// Press Space
		fireEvent.keyDown(trigger, { key: " " });
		expect(screen.queryByText("Item A")).toBeNull();
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
