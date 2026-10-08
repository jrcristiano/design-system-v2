import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
	const defaultProps = {
		currentPage: 1,
		onPageChange: vi.fn(),
		total: 100,
		perPage: 10,
	};

	it("renders pagination buttons", () => {
		render(<Pagination {...defaultProps} />);
		expect(screen.getByLabelText("Página 1")).toBeInTheDocument();
		expect(screen.getByLabelText("Página anterior")).toBeInTheDocument();
		expect(screen.getByLabelText("Próxima página")).toBeInTheDocument();
		expect(screen.getByLabelText("Página")).toBeInTheDocument();
		expect(screen.getByLabelText("Ir para página")).toBeInTheDocument();
	});

	it("shows current page as active", () => {
		render(<Pagination {...defaultProps} currentPage={3} />);
		const currentPageButton = screen.getByLabelText("Página 3");
		expect(currentPageButton).toHaveAttribute("aria-current", "page");
		expect(currentPageButton).toHaveClass(
			"text-[color:var(--ds-color-neutral-white)]",
			"bg-[var(--ds-color-blue-10)]",
		);
		expect(screen.getByLabelText("Página 2")).toHaveClass(
			"text-[var(--ds-color-neutral-40)]",
			"hover:bg-[var(--ds-color-neutral-90)]",
		);
	});

	it("moves active styles when the current page changes", () => {
		const { rerender } = render(<Pagination {...defaultProps} currentPage={2} />);

		expect(screen.getByLabelText("Página 2")).toHaveAttribute("aria-current", "page");
		expect(screen.getByLabelText("Página 2")).toHaveClass(
			"text-[color:var(--ds-color-neutral-white)]",
		);

		rerender(<Pagination {...defaultProps} currentPage={3} />);

		expect(screen.getByLabelText("Página 2")).not.toHaveAttribute("aria-current");
		expect(screen.getByLabelText("Página 2")).toHaveClass("text-[var(--ds-color-neutral-40)]");
		expect(screen.getByLabelText("Página 3")).toHaveAttribute("aria-current", "page");
		expect(screen.getByLabelText("Página 3")).toHaveClass(
			"text-[color:var(--ds-color-neutral-white)]",
		);
	});

	it("syncs input value with current page", () => {
		render(<Pagination {...defaultProps} currentPage={3} />);
		const input = screen.getByLabelText("Página");
		expect(input).toHaveValue(3);
	});

	it("calls onPageChange when clicking a page", async () => {
		const user = userEvent.setup();
		const handlePageChange = vi.fn();
		render(<Pagination {...defaultProps} onPageChange={handlePageChange} />);

		await user.click(screen.getByLabelText("Página 2"));
		expect(handlePageChange).toHaveBeenCalledWith(2);
	});

	it("calls onPageChange when submitting page input", async () => {
		const user = userEvent.setup();
		const handlePageChange = vi.fn();
		render(<Pagination {...defaultProps} onPageChange={handlePageChange} />);

		const input = screen.getByLabelText("Página");
		await user.clear(input);
		await user.type(input, "4{Enter}");
		expect(handlePageChange).toHaveBeenCalledWith(4);
	});

	it("shows validation message for out of range page", async () => {
		const user = userEvent.setup();
		render(<Pagination {...defaultProps} total={50} perPage={10} />);

		const input = screen.getByLabelText("Página");
		await user.clear(input);
		await user.type(input, "0");
		expect(screen.getByText("Página deve estar entre 1 e 5.")).toBeInTheDocument();
	});

	it("calls onPageChange when clicking next", async () => {
		const user = userEvent.setup();
		const handlePageChange = vi.fn();
		render(<Pagination {...defaultProps} onPageChange={handlePageChange} />);

		await user.click(screen.getByLabelText("Próxima página"));
		expect(handlePageChange).toHaveBeenCalledWith(2);
	});

	it("calls onPageChange when clicking previous", async () => {
		const user = userEvent.setup();
		const handlePageChange = vi.fn();
		render(<Pagination {...defaultProps} currentPage={3} onPageChange={handlePageChange} />);

		await user.click(screen.getByLabelText("Página anterior"));
		expect(handlePageChange).toHaveBeenCalledWith(2);
	});

	it("disables previous button on first page", () => {
		render(<Pagination {...defaultProps} currentPage={1} />);
		expect(screen.getByLabelText("Página anterior")).toBeDisabled();
	});

	it("disables next button on last page", () => {
		render(<Pagination {...defaultProps} currentPage={10} />);
		expect(screen.getByLabelText("Próxima página")).toBeDisabled();
	});

	it("renders with different sizes", () => {
		const { rerender } = render(<Pagination {...defaultProps} size="sm" />);
		expect(screen.getByLabelText("Página 1")).toBeInTheDocument();

		rerender(<Pagination {...defaultProps} size="md" />);
		expect(screen.getByLabelText("Página 1")).toBeInTheDocument();

		rerender(<Pagination {...defaultProps} size="lg" />);
		expect(screen.getByLabelText("Página 1")).toBeInTheDocument();
	});

	it("shows info text when positionLabel is set", () => {
		render(<Pagination {...defaultProps} positionLabel="left" label="Registros" />);
		expect(screen.getByText("Mostrando")).toBeInTheDocument();
		expect(screen.getByText("Registros")).toBeInTheDocument();
	});

	it("calculates correct item range", () => {
		render(<Pagination {...defaultProps} currentPage={2} positionLabel="left" />);
		expect(screen.getByText("11-20")).toBeInTheDocument();
	});

	it("disables all buttons when disabled", () => {
		render(<Pagination {...defaultProps} disabled />);
		expect(screen.getByLabelText("Página anterior")).toBeDisabled();
		expect(screen.getByLabelText("Próxima página")).toBeDisabled();
		expect(screen.getByLabelText("Página 1")).toBeDisabled();
	});

	it("does not call onPageChange when disabled", async () => {
		const user = userEvent.setup();
		const handlePageChange = vi.fn();
		render(<Pagination {...defaultProps} disabled onPageChange={handlePageChange} />);

		await user.click(screen.getByLabelText("Página 2"));
		expect(handlePageChange).not.toHaveBeenCalled();
	});

	it("shows ellipsis for many pages", () => {
		render(<Pagination {...defaultProps} total={200} currentPage={5} />);
		const dots = document.querySelectorAll('[class*="pointer-events-none"]');
		expect(dots.length).toBeGreaterThan(0);
	});

	it("renders all pages when total pages is less than maxButtons", () => {
		render(<Pagination {...defaultProps} total={30} perPage={10} maxButtons={5} />);
		// Should show pages 1, 2, 3 without ellipsis
		expect(screen.getByLabelText("Página 1")).toBeInTheDocument();
		expect(screen.getByLabelText("Página 2")).toBeInTheDocument();
		expect(screen.getByLabelText("Página 3")).toBeInTheDocument();
	});

	it("renders with positionLabel right", () => {
		render(<Pagination {...defaultProps} positionLabel="right" />);
		expect(screen.getByText(/Mostrando/)).toBeInTheDocument();
	});

	it("renders with positionLabel left", () => {
		render(<Pagination {...defaultProps} positionLabel="left" />);
		expect(screen.getByText(/Mostrando/)).toBeInTheDocument();
	});

	it("does not call onPageChange when clicking current page", async () => {
		const user = userEvent.setup();
		const handlePageChange = vi.fn();
		render(<Pagination {...defaultProps} currentPage={1} onPageChange={handlePageChange} />);

		await user.click(screen.getByLabelText("Página 1"));
		expect(handlePageChange).not.toHaveBeenCalled();
	});

	it("does not call onPageChange for previous when already on first page", async () => {
		const user = userEvent.setup();
		const handlePageChange = vi.fn();
		render(<Pagination {...defaultProps} currentPage={1} onPageChange={handlePageChange} />);

		// Button is disabled, but let's verify handler check
		const prevButton = screen.getByLabelText("Página anterior");
		await user.click(prevButton);
		expect(handlePageChange).not.toHaveBeenCalled();
	});

	it("does not call onPageChange for next when already on last page", async () => {
		const user = userEvent.setup();
		const handlePageChange = vi.fn();
		render(<Pagination {...defaultProps} currentPage={10} onPageChange={handlePageChange} />);

		// Button is disabled, but let's verify handler check
		const nextButton = screen.getByLabelText("Próxima página");
		await user.click(nextButton);
		expect(handlePageChange).not.toHaveBeenCalled();
	});

	it("does not call onPageChange when disabled and clicking previous", async () => {
		const user = userEvent.setup();
		const handlePageChange = vi.fn();
		render(
			<Pagination {...defaultProps} currentPage={5} disabled onPageChange={handlePageChange} />,
		);

		const prevButton = screen.getByLabelText("Página anterior");
		await user.click(prevButton);
		expect(handlePageChange).not.toHaveBeenCalled();
	});

	it("does not call onPageChange when disabled and clicking next", async () => {
		const user = userEvent.setup();
		const handlePageChange = vi.fn();
		render(
			<Pagination {...defaultProps} currentPage={5} disabled onPageChange={handlePageChange} />,
		);

		const nextButton = screen.getByLabelText("Próxima página");
		await user.click(nextButton);
		expect(handlePageChange).not.toHaveBeenCalled();
	});

	it("renders without positionLabel (default)", () => {
		render(<Pagination {...defaultProps} />);
		expect(screen.queryByText(/Mostrando/)).not.toBeInTheDocument();
	});
});
