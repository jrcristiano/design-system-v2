import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
	it("renders the message with accessible status semantics", () => {
		render(<EmptyState title="Nenhum resultado" description="Tente outro termo de busca." />);

		const status = screen.getByRole("status");
		expect(status).toHaveTextContent("Nenhum resultado");
		expect(status).toHaveTextContent("Tente outro termo de busca.");
	});

	it("supports a compact layout, decorative icon, and native attributes", () => {
		render(
			<EmptyState
				title="Lista vazia"
				size="sm"
				icon={<svg data-testid="empty-icon" />}
				className="custom-empty"
				data-testid="empty-state"
			/>,
		);

		const emptyState = screen.getByTestId("empty-state");
		expect(emptyState).toHaveClass("custom-empty");
		expect(emptyState).toHaveClass("py-[var(--ds-pad-section)]");
		expect(screen.getByTestId("empty-icon").parentElement).toHaveAttribute("aria-hidden", "true");
	});

	it("keeps a composed action operable", async () => {
		const onClick = vi.fn();
		render(
			<EmptyState
				title="Sem registros"
				action={<button onClick={onClick}>Criar registro</button>}
			/>,
		);

		await userEvent.tab();
		expect(screen.getByRole("button", { name: "Criar registro" })).toHaveFocus();
		await userEvent.keyboard("{Enter}");
		expect(onClick).toHaveBeenCalledOnce();
	});
});
