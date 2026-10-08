import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { StopwatchContext } from "../Stopwatch.types";
import { STOPWATCH_COLORS } from "../Stopwatch.constants";
import { StopwatchLabel } from "../Stopwatch.label";

const renderWithContext = (ui: React.ReactNode, contextValue: any) => {
	return render(<StopwatchContext.Provider value={contextValue}>{ui}</StopwatchContext.Provider>);
};

describe("Stopwatch.Label", () => {
	const baseContext = {
		value: 0,
		isRunning: false,
		isPaused: false,
		isLimitReached: false,
		disabled: false,
		start: vi.fn(),
		pause: vi.fn(),
		reset: vi.fn(),
	};

	it("renderiza o conteúdo corretamente", () => {
		renderWithContext(<StopwatchLabel>Tempo</StopwatchLabel>, baseContext);

		expect(screen.getByText("Tempo")).toBeInTheDocument();
	});

	it("aplica classe de posição bottom por padrão", () => {
		renderWithContext(<StopwatchLabel>Tempo</StopwatchLabel>, baseContext);

		const label = screen.getByText("Tempo");
		expect(label).toHaveClass("mt-1");
	});

	it("aplica classe de posição top corretamente", () => {
		renderWithContext(<StopwatchLabel position="top">Tempo</StopwatchLabel>, baseContext);

		const label = screen.getByText("Tempo");
		expect(label).toHaveClass("mb-1");
	});

	it("aplica classe de posição left corretamente", () => {
		renderWithContext(<StopwatchLabel position="left">Tempo</StopwatchLabel>, baseContext);

		const label = screen.getByText("Tempo");
		expect(label).toHaveClass("mr-2");
	});

	it("aplica classe de posição right corretamente", () => {
		renderWithContext(<StopwatchLabel position="right">Tempo</StopwatchLabel>, baseContext);

		const label = screen.getByText("Tempo");
		expect(label).toHaveClass("ml-2");
	});

	it("aplica cor primary quando não está disabled", () => {
		renderWithContext(<StopwatchLabel>Tempo</StopwatchLabel>, { ...baseContext, disabled: false });

		const label = screen.getByText("Tempo");
		expect(label).toHaveClass(STOPWATCH_COLORS.text.primary);
	});

	it("aplica cor disabled quando está disabled", () => {
		renderWithContext(<StopwatchLabel>Tempo</StopwatchLabel>, { ...baseContext, disabled: true });

		const label = screen.getByText("Tempo");
		expect(label).toHaveClass(STOPWATCH_COLORS.text.disabled);
	});

	it("lança erro quando usado fora do Stopwatch.Root", () => {
		expect(() => render(<StopwatchLabel>Tempo</StopwatchLabel>)).toThrow(
			"Stopwatch.Label must be used within Stopwatch.Root",
		);
	});
});
