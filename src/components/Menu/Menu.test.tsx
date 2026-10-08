import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Menu } from "./Menu";

describe("Menu", () => {
	it("renders menu with navigation role", () => {
		render(<Menu>Menu Content</Menu>);
		expect(screen.getByRole("navigation")).toBeInTheDocument();
	});

	it("renders children content", () => {
		render(<Menu>Menu Content</Menu>);
		expect(screen.getByText("Menu Content")).toBeInTheDocument();
	});

	it("renders with expand/collapse button", () => {
		render(<Menu>Content</Menu>);
		expect(screen.getByRole("button", { name: /recolher menu/i })).toBeInTheDocument();
	});

	it("calls onCollapse when toggle button is clicked", async () => {
		const user = userEvent.setup();
		const handleCollapse = vi.fn();
		render(<Menu onCollapse={handleCollapse}>Content</Menu>);

		await user.click(screen.getByRole("button", { name: /recolher menu/i }));
		expect(handleCollapse).toHaveBeenCalled();
	});

	it("renders in collapsed state", () => {
		render(<Menu isCollapsed>Content</Menu>);
		expect(screen.getByRole("button", { name: /expandir/i })).toBeInTheDocument();
	});

	it("renders in expanded state", () => {
		render(<Menu isCollapsed={false}>Content</Menu>);
		expect(screen.getByRole("button", { name: /recolher/i })).toBeInTheDocument();
	});

	it("renders with logo when expanded", () => {
		const Logo = () => <div data-testid="logo">Logo</div>;
		render(
			<Menu logo={<Logo />} isCollapsed={false}>
				Content
			</Menu>,
		);
		expect(screen.getByTestId("logo")).toBeInTheDocument();
	});

	it("renders collapsed logo when collapsed", () => {
		const LogoCollapsed = () => <div data-testid="collapsed-logo">CL</div>;
		render(
			<Menu logoCollapsed={<LogoCollapsed />} isCollapsed>
				Content
			</Menu>,
		);
		expect(screen.getByTestId("collapsed-logo")).toBeInTheDocument();
	});

	it("shows search input when showSearch is true", () => {
		render(
			<Menu showSearch isCollapsed={false}>
				Content
			</Menu>,
		);
		expect(screen.getByLabelText("Buscar no menu")).toBeInTheDocument();
	});

	it("does not show search when collapsed", () => {
		render(
			<Menu showSearch isCollapsed>
				Content
			</Menu>,
		);
		expect(screen.queryByLabelText("Buscar no menu")).not.toBeInTheDocument();
	});

	it("calls onSearchChange when typing in search", async () => {
		const user = userEvent.setup();
		const handleSearch = vi.fn();
		render(
			<Menu showSearch onSearchChange={handleSearch} isCollapsed={false}>
				Content
			</Menu>,
		);

		const searchInput = screen.getByLabelText("Buscar no menu");
		await user.type(searchInput, "test");
		expect(handleSearch).toHaveBeenCalled();
	});

	it("renders user profile in footer", () => {
		render(
			<Menu userName="John Doe" userRole="Admin" isCollapsed={false}>
				Content
			</Menu>,
		);
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("Admin")).toBeInTheDocument();
	});

	it("hides user info when collapsed", () => {
		render(
			<Menu userName="John Doe" userRole="Admin" isCollapsed>
				Content
			</Menu>,
		);
		expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
	});

	it("renders with md size", () => {
		render(
			<Menu size="md" isCollapsed={false}>
				Content
			</Menu>,
		);
		expect(screen.getByRole("navigation")).toBeInTheDocument();
	});

	it("renders with custom search placeholder", () => {
		render(
			<Menu showSearch searchPlaceholder="Search here..." isCollapsed={false}>
				Content
			</Menu>,
		);
		expect(screen.getByPlaceholderText("Search here...")).toBeInTheDocument();
	});

	it("renders with user avatar", () => {
		render(
			<Menu userName="John" userRole="Admin" avatarSrc="avatar.png" isCollapsed={false}>
				Content
			</Menu>,
		);
		expect(screen.getByText("John")).toBeInTheDocument();
	});

	it("does not render logo when collapsed without logoCollapsed", () => {
		const Logo = () => <div data-testid="logo">Logo</div>;
		render(
			<Menu logo={<Logo />} isCollapsed>
				Content
			</Menu>,
		);
		// Logo is not shown when collapsed unless logoCollapsed is provided
		expect(screen.queryByTestId("logo")).not.toBeInTheDocument();
	});
});
