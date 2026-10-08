import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Breadcrumb from "./Breadcrumb";

const items = [
	{ label: "Home", href: "/" },
	{ label: "Products", onClick: vi.fn() },
	{ label: "Shoes" },
];

describe("Breadcrumb", () => {
	it("renders navigation with correct aria-label", () => {
		render(<Breadcrumb items={items} />);
		expect(screen.getByRole("navigation", { name: /breadcrumb navigation/i })).toBeInTheDocument();
	});

	it("renders links and buttons correctly", () => {
		render(<Breadcrumb items={items} />);
		expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /products/i })).toBeInTheDocument();
	});

	it("marks last item as current page", () => {
		render(<Breadcrumb items={items} />);

		const current = screen.getByText("Shoes").closest('[aria-current="page"]');

		expect(current).toBeInTheDocument();
	});

	it("calls onClick when breadcrumb button is clicked", async () => {
		const user = userEvent.setup();
		render(<Breadcrumb items={items} />);

		await user.click(screen.getByRole("button", { name: /products/i }));
		expect(items[1].onClick).toHaveBeenCalledTimes(1);
	});

	it("does not render separator after last item", () => {
		render(<Breadcrumb items={items} />);
		const separators = screen.getAllByText("/");
		expect(separators).toHaveLength(items.length - 1);
	});
});
