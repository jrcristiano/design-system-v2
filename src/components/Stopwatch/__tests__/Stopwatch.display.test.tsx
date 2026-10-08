import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { StopwatchDisplay } from "../Stopwatch.display";
import { StopwatchContext } from "../Stopwatch.types";
import { STOPWATCH_COLORS } from "../Stopwatch.constants";
import { formatDuration } from "../Stopwatch.utils";

/**
 * Mock determinístico do formatDuration
 */
vi.mock("../Stopwatch.utils", () => ({
	formatDuration: vi.fn(() => "01:02:03"),
}));

type ContextValue = React.ContextType<typeof StopwatchContext>;

const baseValue = {
	hours: 1,
	minutes: 2,
	seconds: 3,
};

const createContextValue = (overrides?: Partial<ContextValue>): ContextValue =>
	({
		value: baseValue,
		isRunning: false,
		isPaused: false,
		isLimitReached: false,
		disabled: false,
		handlers: {} as any,
		...overrides,
	}) as ContextValue;

const renderWithContext = (
	contextValue: ContextValue,
	props?: React.ComponentProps<typeof StopwatchDisplay>,
) =>
	render(
		<StopwatchContext.Provider value={contextValue}>
			<StopwatchDisplay {...props} />
		</StopwatchContext.Provider>,
	);

describe("StopwatchDisplay", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("lança erro se usado fora do contexto", () => {
		expect(() => render(<StopwatchDisplay />)).toThrow(
			"Stopwatch.Display must be used within Stopwatch.Root",
		);
	});

	it("renderiza tempo formatado", () => {
		const ctx = createContextValue();

		renderWithContext(ctx);

		expect(screen.getByText("01:02:03")).toBeInTheDocument();
	});

	it("aplica aria attributes corretamente", () => {
		const ctx = createContextValue();

		renderWithContext(ctx);

		const span = screen.getByText("01:02:03");

		expect(span).toHaveAttribute("aria-live", "polite");
		expect(span).toHaveAttribute("aria-atomic", "true");
	});

	it("aplica background idle por padrão", () => {
		const ctx = createContextValue();

		const { container } = renderWithContext(ctx);

		expect(container.firstChild).toHaveClass(STOPWATCH_COLORS.background.idle);
	});

	it("aplica background running quando isRunning=true", () => {
		const ctx = createContextValue({ isRunning: true });

		const { container } = renderWithContext(ctx);

		expect(container.firstChild).toHaveClass(STOPWATCH_COLORS.background.running);
	});

	it("aplica background paused quando isPaused=true", () => {
		const ctx = createContextValue({ isPaused: true });

		const { container } = renderWithContext(ctx);

		expect(container.firstChild).toHaveClass(STOPWATCH_COLORS.background.paused);
	});

	it("aplica background paused quando isLimitReached=true", () => {
		const ctx = createContextValue({ isLimitReached: true });

		const { container } = renderWithContext(ctx);

		expect(container.firstChild).toHaveClass(STOPWATCH_COLORS.background.paused);
	});

	it("disabled tem prioridade sobre outros estados", () => {
		const ctx = createContextValue({
			isRunning: true,
			disabled: true,
		});

		const { container } = renderWithContext(ctx);

		expect(container.firstChild).toHaveClass(STOPWATCH_COLORS.background.disabled);
	});

	it("aplica cor de texto primary no estado idle", () => {
		const ctx = createContextValue();

		renderWithContext(ctx);

		const span = screen.getByText("01:02:03");

		expect(span).toHaveClass(STOPWATCH_COLORS.text.primary);
	});

	it("aplica cor secondary quando running", () => {
		const ctx = createContextValue({ isRunning: true });

		renderWithContext(ctx);

		const span = screen.getByText("01:02:03");

		expect(span).toHaveClass(STOPWATCH_COLORS.text.secondary);
	});

	it("aplica cor disabled quando disabled=true", () => {
		const ctx = createContextValue({ disabled: true });

		renderWithContext(ctx);

		const span = screen.getByText("01:02:03");

		expect(span).toHaveClass(STOPWATCH_COLORS.text.disabled);
	});

	it("permite custom format", () => {
		const ctx = createContextValue();

		renderWithContext(ctx, { format: "MM:SS" });

		expect(formatDuration).toHaveBeenCalledWith(baseValue, "MM:SS");
	});

	it("aplica className customizada", () => {
		const ctx = createContextValue();

		const { container } = renderWithContext(ctx, {
			className: "custom-class",
		});

		expect(container.firstChild).toHaveClass("custom-class");
	});
});
