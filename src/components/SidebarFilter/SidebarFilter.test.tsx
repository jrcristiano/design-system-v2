import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SidebarFilter } from "./SidebarFilter";
import { SidebarFilterTrigger } from "./SidebarFilterTrigger";
import { SidebarFilterPanel } from "./SidebarFilterPanel";
import { SidebarFilterHeader } from "./SidebarFilterHeader";
import { SidebarFilterContent } from "./SidebarFilterContent";
import { SidebarFilterFooter } from "./SidebarFilterFooter";
import { FilterSection } from "./FilterSection";
import { useSidebarFilter } from "./SidebarFilterContext";
import { Button } from "../Button/Button";

// Test component that uses useSidebarFilter outside of SidebarFilter
const UseFilterOutsideContext = () => {
	const ctx = useSidebarFilter();
	return <div>{ctx.isOpen ? "open" : "closed"}</div>;
};

describe("SidebarFilter", () => {
	it("renders sidebar filter with trigger", () => {
		render(
			<SidebarFilter>
				<SidebarFilterTrigger>
					<Button>Filtrar</Button>
				</SidebarFilterTrigger>
			</SidebarFilter>,
		);

		expect(screen.getByText("Filtrar")).toBeInTheDocument();
	});

	it("opens panel when trigger is clicked", async () => {
		const user = userEvent.setup();
		render(
			<SidebarFilter>
				<SidebarFilterTrigger>
					<Button>Filtrar</Button>
				</SidebarFilterTrigger>
				<SidebarFilterPanel>
					<SidebarFilterHeader />
					<SidebarFilterContent>
						<div>Conteúdo do filtro</div>
					</SidebarFilterContent>
				</SidebarFilterPanel>
			</SidebarFilter>,
		);

		await user.click(screen.getByText("Filtrar"));
		expect(screen.getByText("Filtros")).toBeInTheDocument();
		expect(screen.getByText("Conteúdo do filtro")).toBeInTheDocument();
	});

	it("closes panel when close button is clicked", async () => {
		const user = userEvent.setup();
		render(
			<SidebarFilter>
				<SidebarFilterTrigger>
					<Button>Filtrar</Button>
				</SidebarFilterTrigger>
				<SidebarFilterPanel>
					<SidebarFilterHeader />
					<SidebarFilterContent>
						<div>Conteúdo do filtro</div>
					</SidebarFilterContent>
				</SidebarFilterPanel>
			</SidebarFilter>,
		);

		await user.click(screen.getByText("Filtrar"));
		expect(screen.getByText("Filtros")).toBeInTheDocument();

		await user.click(screen.getByLabelText("Fechar filtros"));
		await waitFor(() => {
			expect(screen.queryByText("Filtros")).not.toBeInTheDocument();
		});
	});

	it("closes panel when Escape key is pressed", async () => {
		const user = userEvent.setup();
		render(
			<SidebarFilter>
				<SidebarFilterTrigger>
					<Button>Filtrar</Button>
				</SidebarFilterTrigger>
				<SidebarFilterPanel>
					<SidebarFilterHeader />
					<SidebarFilterContent>
						<div>Conteúdo do filtro</div>
					</SidebarFilterContent>
				</SidebarFilterPanel>
			</SidebarFilter>,
		);

		await user.click(screen.getByText("Filtrar"));
		expect(screen.getByText("Filtros")).toBeInTheDocument();

		await user.keyboard("{Escape}");
		await waitFor(() => {
			expect(screen.queryByText("Filtros")).not.toBeInTheDocument();
		});
	});

	it.each(["left", "right"] as const)(
		"restores trigger focus after Escape (%s)",
		async (position) => {
			const user = userEvent.setup();
			render(
				<SidebarFilter position={position}>
					<SidebarFilterTrigger>
						<Button>Filtrar</Button>
					</SidebarFilterTrigger>
					<SidebarFilterPanel>
						<SidebarFilterHeader />
						<SidebarFilterContent>Conteúdo do filtro</SidebarFilterContent>
					</SidebarFilterPanel>
				</SidebarFilter>,
			);

			const trigger = screen.getByRole("button", { name: "Filtrar" });
			await user.click(trigger);
			await user.keyboard("{Escape}");
			expect(trigger).toHaveFocus();
		},
	);

	it("closes panel when overlay is clicked", async () => {
		const user = userEvent.setup();
		render(
			<SidebarFilter>
				<SidebarFilterTrigger>
					<Button>Filtrar</Button>
				</SidebarFilterTrigger>
				<SidebarFilterPanel>
					<SidebarFilterHeader />
					<SidebarFilterContent>
						<div>Conteúdo do filtro</div>
					</SidebarFilterContent>
				</SidebarFilterPanel>
			</SidebarFilter>,
		);

		await user.click(screen.getByText("Filtrar"));
		expect(screen.getByText("Filtros")).toBeInTheDocument();

		const overlay = document.querySelector('[aria-hidden="true"]');
		if (overlay) {
			await user.click(overlay as HTMLElement);
			await waitFor(() => {
				expect(screen.queryByText("Filtros")).not.toBeInTheDocument();
			});
		}
	});

	it("calls onApply when Apply button is clicked", async () => {
		const user = userEvent.setup();
		const onApply = vi.fn();

		render(
			<SidebarFilter onApply={onApply}>
				<SidebarFilterTrigger>
					<Button>Filtrar</Button>
				</SidebarFilterTrigger>
				<SidebarFilterPanel>
					<SidebarFilterHeader />
					<SidebarFilterContent>
						<div>Conteúdo do filtro</div>
					</SidebarFilterContent>
					<SidebarFilterFooter />
				</SidebarFilterPanel>
			</SidebarFilter>,
		);

		await user.click(screen.getByText("Filtrar"));
		await user.click(screen.getByText("Aplicar"));

		expect(onApply).toHaveBeenCalledTimes(1);
	});

	it("clears filters when Clear button is clicked", async () => {
		const user = userEvent.setup();
		const onClear = vi.fn();

		render(
			<SidebarFilter defaultFilters={{ test: "value" }}>
				<SidebarFilterTrigger>
					<Button>Filtrar</Button>
				</SidebarFilterTrigger>
				<SidebarFilterPanel>
					<SidebarFilterHeader />
					<SidebarFilterContent>
						<div>Conteúdo do filtro</div>
					</SidebarFilterContent>
					<SidebarFilterFooter onClear={onClear} />
				</SidebarFilterPanel>
			</SidebarFilter>,
		);

		await user.click(screen.getByText("Filtrar"));
		await user.click(screen.getByText("Limpar"));

		expect(onClear).toHaveBeenCalledTimes(1);
	});

	it("renders FilterSection with title and required indicator", async () => {
		const user = userEvent.setup();

		render(
			<SidebarFilter>
				<SidebarFilterTrigger>
					<Button>Filtrar</Button>
				</SidebarFilterTrigger>
				<SidebarFilterPanel>
					<SidebarFilterHeader />
					<SidebarFilterContent>
						<FilterSection title="Categoria" required>
							<div>Options</div>
						</FilterSection>
					</SidebarFilterContent>
				</SidebarFilterPanel>
			</SidebarFilter>,
		);

		await user.click(screen.getByText("Filtrar"));

		await waitFor(() => {
			expect(screen.getByText("Categoria")).toBeInTheDocument();
			expect(screen.getByText("*")).toBeInTheDocument();
		});
	});

	it("throws error when useSidebarFilter is used outside context", () => {
		// Suppress console.error for this test
		const originalError = console.error;
		console.error = vi.fn();

		expect(() => render(<UseFilterOutsideContext />)).toThrow(
			"SidebarFilter components must be used inside <SidebarFilter>",
		);

		console.error = originalError;
	});

	it("inherits the configured left position when the panel has no override", async () => {
		const user = userEvent.setup();
		render(
			<SidebarFilter position="left">
				<SidebarFilterTrigger>
					<Button>Filtrar</Button>
				</SidebarFilterTrigger>
				<SidebarFilterPanel>
					<SidebarFilterHeader />
				</SidebarFilterPanel>
			</SidebarFilter>,
		);

		await user.click(screen.getByText("Filtrar"));

		const panel = screen.getByRole("dialog");
		expect(panel).toHaveAttribute("data-position", "left");
	});

	it("inherits right position and updates it when the prop changes", async () => {
		const user = userEvent.setup();
		const sidebar = (position: "left" | "right") => (
			<SidebarFilter position={position}>
				<SidebarFilterTrigger>
					<Button>Filtrar</Button>
				</SidebarFilterTrigger>
				<SidebarFilterPanel>
					<SidebarFilterHeader />
				</SidebarFilterPanel>
			</SidebarFilter>
		);
		const { rerender } = render(sidebar("right"));

		await user.click(screen.getByText("Filtrar"));

		const panel = screen.getByRole("dialog");
		expect(panel).toHaveAttribute("data-position", "right");

		rerender(sidebar("left"));
		expect(panel).toHaveAttribute("data-position", "left");
	});

	it("prevents body scroll when panel is open", async () => {
		const user = userEvent.setup();
		render(
			<SidebarFilter>
				<SidebarFilterTrigger>
					<Button>Filtrar</Button>
				</SidebarFilterTrigger>
				<SidebarFilterPanel>
					<SidebarFilterHeader />
				</SidebarFilterPanel>
			</SidebarFilter>,
		);

		const originalOverflow = document.body.style.overflow;

		await user.click(screen.getByText("Filtrar"));

		await waitFor(() => {
			expect(document.body.style.overflow).toBe("hidden");
		});

		await user.keyboard("{Escape}");

		await waitFor(() => {
			expect(document.body.style.overflow).toBe(originalOverflow);
		});
	});
});
