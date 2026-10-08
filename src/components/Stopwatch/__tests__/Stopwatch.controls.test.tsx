import React from "react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StopwatchControls } from "../Stopwatch.controls";
import { StopwatchContext } from "../Stopwatch.types";

/**
 * MOCK obrigatório — remove dependência externa pesada
 */
vi.mock("@phosphor-icons/react", () => ({
	PlayCircleIcon: () => <svg data-testid="play-icon" />,
	PauseCircleIcon: () => <svg data-testid="pause-icon" />,
	ClockClockwiseIcon: () => <svg data-testid="reset-icon" />,
}));

type ContextValue = React.ContextType<typeof StopwatchContext>;

const createContextValue = (overrides?: Partial<ContextValue>): ContextValue =>
	({
		isRunning: false,
		isPaused: false,
		isLimitReached: false,
		disabled: false,
		handlers: {
			onPlay: vi.fn(),
			onPause: vi.fn(),
			onReset: vi.fn(),
		},
		...overrides,
	}) as ContextValue;

const renderWithContext = (
	contextValue: ContextValue,
	props?: React.ComponentProps<typeof StopwatchControls>,
) =>
	render(
		<StopwatchContext.Provider value={contextValue}>
			<StopwatchControls {...props} />
		</StopwatchContext.Provider>,
	);

describe("StopwatchControls", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("lança erro se usado fora do contexto", () => {
		expect(() => render(<StopwatchControls />)).toThrow(
			"Stopwatch.Controls must be used within Stopwatch.Root",
		);
	});

	it("renderiza play no estado idle", () => {
		const ctx = createContextValue();

		renderWithContext(ctx);

		expect(screen.getByRole("button", { name: "Iniciar" })).toBeInTheDocument();
	});

	it("renderiza pause no estado running", () => {
		const ctx = createContextValue({ isRunning: true });

		renderWithContext(ctx);

		expect(screen.getByRole("button", { name: "Pausar" })).toBeInTheDocument();
	});

	it("renderiza play + reset no estado paused", () => {
		const ctx = createContextValue({ isPaused: true });

		renderWithContext(ctx);

		expect(screen.getByRole("button", { name: "Iniciar" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Redefinir" })).toBeInTheDocument();
	});

	it("renderiza apenas reset no estado limit_reached", () => {
		const ctx = createContextValue({ isLimitReached: true });

		renderWithContext(ctx);

		expect(screen.getByRole("button", { name: "Redefinir" })).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Iniciar" })).toBeNull();
	});

	it("chama handler correto ao clicar", () => {
		const ctx = createContextValue();

		renderWithContext(ctx);

		fireEvent.click(screen.getByRole("button", { name: "Iniciar" }));

		expect(ctx.handlers.onPlay).toHaveBeenCalledTimes(1);
	});

	it("desabilita botão corretamente", () => {
		const ctx = createContextValue({ disabled: true });

		renderWithContext(ctx);

		const button = screen.getByRole("button", { name: "Iniciar" });

		expect(button).toBeDisabled();
		expect(button).toHaveAttribute("aria-disabled", "true");
	});

	it("aplica layout vertical", () => {
		const ctx = createContextValue();

		const { container } = renderWithContext(ctx, { orientation: "vertical" });

		expect(container.firstChild).toHaveClass("flex-col");
	});

	it("não renderiza label quando showLabels=false", () => {
		const ctx = createContextValue();

		renderWithContext(ctx, { showLabels: false });

		expect(screen.queryByText("Iniciar")).toBeNull();
	});
});
