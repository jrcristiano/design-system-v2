import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "./Table";

describe("Table", () => {
	it("renders table with basic structure", () => {
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeadCell>Name</TableHeadCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>John</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		);

		expect(screen.getByRole("table")).toBeInTheDocument();
		expect(screen.getByText("Name")).toBeInTheDocument();
		expect(screen.getByText("John")).toBeInTheDocument();
		expect(screen.getByRole("region", { name: "Tabela rolável" })).toHaveAttribute("tabindex", "0");
	});

	it("keeps native table layout on rows and cells", () => {
		const { container } = render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeadCell>Heading</TableHeadCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>Value</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		);

		for (const element of container.querySelectorAll("tr, th, td")) {
			expect(element.className).not.toMatch(/inline-flex/);
		}
	});

	it("renders table header", () => {
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeadCell>Column 1</TableHeadCell>
						<TableHeadCell>Column 2</TableHeadCell>
					</TableRow>
				</TableHeader>
			</Table>,
		);

		expect(screen.getByText("Column 1")).toBeInTheDocument();
		expect(screen.getByText("Column 2")).toBeInTheDocument();
	});

	it("renders table body with multiple rows", () => {
		render(
			<Table>
				<TableBody>
					<TableRow>
						<TableCell>Row 1</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Row 2</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		);

		expect(screen.getByText("Row 1")).toBeInTheDocument();
		expect(screen.getByText("Row 2")).toBeInTheDocument();
	});

	it("applies clickable style to row when isClickable is true", () => {
		render(
			<Table>
				<TableBody>
					<TableRow isClickable>
						<TableCell>Clickable</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		);

		const row = screen.getByRole("row");
		expect(row).toHaveClass("cursor-pointer");
	});

	it("applies selected style to row when isSelected is true", () => {
		render(
			<Table>
				<TableBody>
					<TableRow isSelected>
						<TableCell>Selected</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		);

		const row = screen.getByRole("row");
		expect(row).toHaveClass("bg-[var(--ds-color-blue-95)]");
	});

	it("renders sortable column header", async () => {
		const handleSort = vi.fn();
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeadCell sortable onSort={handleSort}>
							Sortable
						</TableHeadCell>
					</TableRow>
				</TableHeader>
			</Table>,
		);

		const header = screen.getByRole("button");
		await userEvent.click(header);
		expect(handleSort).toHaveBeenCalled();
	});

	it("renders with ascending sort direction", () => {
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeadCell sortable sortDirection="asc">
							Ascending
						</TableHeadCell>
					</TableRow>
				</TableHeader>
			</Table>,
		);

		expect(screen.getByRole("columnheader")).toHaveAttribute("aria-sort", "ascending");
	});

	it("renders with descending sort direction", () => {
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeadCell sortable sortDirection="desc">
							Descending
						</TableHeadCell>
					</TableRow>
				</TableHeader>
			</Table>,
		);

		expect(screen.getByRole("columnheader")).toHaveAttribute("aria-sort", "descending");
	});

	it("handles keyboard navigation for sortable headers", async () => {
		const handleSort = vi.fn();
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeadCell sortable onSort={handleSort}>
							Keyboard Sort
						</TableHeadCell>
					</TableRow>
				</TableHeader>
			</Table>,
		);

		const header = screen.getByRole("button");
		header.focus();
		await userEvent.keyboard("{Enter}");
		expect(handleSort).toHaveBeenCalled();
	});

	it("renders with different column sizes", () => {
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeadCell columnSize="xs">XS</TableHeadCell>
						<TableHeadCell columnSize="sm">SM</TableHeadCell>
						<TableHeadCell columnSize="md">MD</TableHeadCell>
						<TableHeadCell columnSize="lg">LG</TableHeadCell>
						<TableHeadCell columnSize="xl">XL</TableHeadCell>
					</TableRow>
				</TableHeader>
			</Table>,
		);

		expect(screen.getByText("XS")).toBeInTheDocument();
		expect(screen.getByText("XL")).toBeInTheDocument();
	});

	it("renders cells with different alignments", () => {
		render(
			<Table>
				<TableBody>
					<TableRow>
						<TableCell align="left">Left</TableCell>
						<TableCell align="center">Center</TableCell>
						<TableCell align="right">Right</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		);

		expect(screen.getByText("Left")).toBeInTheDocument();
		expect(screen.getByText("Center")).toBeInTheDocument();
		expect(screen.getByText("Right")).toBeInTheDocument();
	});

	it("renders with custom className", () => {
		render(
			<Table className="custom-table">
				<TableBody>
					<TableRow>
						<TableCell>Cell</TableCell>
					</TableRow>
				</TableBody>
			</Table>,
		);

		expect(screen.getByRole("table")).toHaveClass("custom-table");
	});

	it("renders head cell with left icon", () => {
		const Icon = ({ size }: { size: number }) => <span data-testid="icon">Icon {size}</span>;
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeadCell iconLeft={Icon}>With Icon</TableHeadCell>
					</TableRow>
				</TableHeader>
			</Table>,
		);

		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});

	it("renders head cell with left icon and onIconLeftClick callback", async () => {
		const handleIconClick = vi.fn();
		const Icon = ({ size }: { size: number }) => <span data-testid="icon">Icon {size}</span>;
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeadCell iconLeft={Icon} onIconLeftClick={handleIconClick}>
							With Clickable Icon
						</TableHeadCell>
					</TableRow>
				</TableHeader>
			</Table>,
		);

		const iconButton = screen.getByTestId("icon").closest("button");
		expect(iconButton).toBeInTheDocument();

		await userEvent.click(iconButton!);
		expect(handleIconClick).toHaveBeenCalledTimes(1);
	});

	it("renders icon as span when onIconLeftClick is not provided", () => {
		const Icon = ({ size }: { size: number }) => <span data-testid="icon">Icon {size}</span>;
		render(
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeadCell iconLeft={Icon}>With Non-Clickable Icon</TableHeadCell>
					</TableRow>
				</TableHeader>
			</Table>,
		);

		const icon = screen.getByTestId("icon");
		const parentElement = icon.parentElement;
		expect(parentElement?.tagName.toLowerCase()).toBe("span");
	});
});
