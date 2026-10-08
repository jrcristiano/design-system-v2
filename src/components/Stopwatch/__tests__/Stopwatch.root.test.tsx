import { useContext } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { StopwatchContext } from "../Stopwatch.types";

import * as stateHook from "../hooks/useStopwatchState";
import * as timerHook from "../hooks/useStopwatchTimer";
import { StopwatchRoot } from "../Stopwatch.root";

// --------------------------------------------------
// Mocks
// --------------------------------------------------

vi.mock("../hooks/useStopwatchState");
vi.mock("../hooks/useStopwatchTimer");

const mockPlay = vi.fn();
const mockPause = vi.fn();
const mockReset = vi.fn();
const mockTick = vi.fn();

const baseStateMock = {
	value: { hours: 0, minutes: 0, seconds: 0 },
	state: "idle",
	isRunning: false,
	isPaused: false,
	isLimitReached: false,
	error: null,
	handlers: {
		play: mockPlay,
		pause: mockPause,
		reset: mockReset,
		tick: mockTick,
	},
};

const setupStateMock = (override?: Partial<typeof baseStateMock>) => {
	(stateHook.useStopwatchState as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
		...baseStateMock,
		...override,
	});
};

const setupTimerMock = () => {
	(timerHook.useStopwatchTimer as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {});
};

// --------------------------------------------------
// Test Consumer (para validar Context)
// --------------------------------------------------

const ContextConsumer = () => {
	const ctx = useContext(StopwatchContext);
	if (!ctx) return null;

	return (
		<div>
			<span data-testid="state">{ctx.state}</span>
			<span data-testid="disabled">{String(ctx.disabled)}</span>
			<button onClick={ctx.handlers.onPlay}>play</button>
			<button onClick={ctx.handlers.onPause}>pause</button>
			<button onClick={ctx.handlers.onReset}>reset</button>
		</div>
	);
};

// --------------------------------------------------
// Test Suite
// --------------------------------------------------

describe("StopwatchRoot", () => {
	const timeLimit = {
		hours: 0,
		minutes: 1,
		seconds: 0,
	} as const;

	beforeEach(() => {
		vi.clearAllMocks();
		setupStateMock();
		setupTimerMock();
	});

	it("renders children correctly", () => {
		render(
			<StopwatchRoot>
				<div data-testid="child">child</div>
			</StopwatchRoot>,
		);

		expect(screen.getByTestId("child")).toBeInTheDocument();
	});

	it("passes correct props to useStopwatchState", () => {
		render(
			<StopwatchRoot autoStart disabled timeLimit={timeLimit}>
				<div />
			</StopwatchRoot>,
		);

		expect(stateHook.useStopwatchState).toHaveBeenCalledWith(
			expect.objectContaining({
				autoStart: true,
				disabled: true,
				timeLimit,
			}),
		);
	});

	it("initializes timer with correct parameters", () => {
		setupStateMock({
			isRunning: true,
		});

		render(
			<StopwatchRoot timeLimit={timeLimit}>
				<div />
			</StopwatchRoot>,
		);

		expect(timerHook.useStopwatchTimer).toHaveBeenCalledWith(
			expect.objectContaining({
				isRunning: true,
				disabled: false,
				onTick: mockTick,
				onError: expect.any(Function),
			}),
		);
	});

	it("provides correct context values", () => {
		setupStateMock({
			state: "running",
			isRunning: true,
		});

		render(
			<StopwatchRoot>
				<ContextConsumer />
			</StopwatchRoot>,
		);

		expect(screen.getByTestId("state")).toHaveTextContent("running");
		expect(screen.getByTestId("disabled")).toHaveTextContent("false");
	});

	it("triggers context handlers correctly", () => {
		render(
			<StopwatchRoot>
				<ContextConsumer />
			</StopwatchRoot>,
		);

		fireEvent.click(screen.getByText("play"));
		fireEvent.click(screen.getByText("pause"));
		fireEvent.click(screen.getByText("reset"));

		expect(mockPlay).toHaveBeenCalledTimes(1);
		expect(mockPause).toHaveBeenCalledTimes(1);
		expect(mockReset).toHaveBeenCalledTimes(1);
	});

	it("renders error state when error exists", () => {
		setupStateMock({
			error: { message: "Erro interno" },
		});

		render(
			<StopwatchRoot>
				<div>child</div>
			</StopwatchRoot>,
		);

		expect(screen.getByRole("alert")).toBeInTheDocument();
		expect(screen.getByText(/Erro no cronômetro/i)).toBeInTheDocument();
	});

	it("calls reset handler when clicking reiniciar button", () => {
		setupStateMock({
			error: { message: "Falha crítica" },
		});

		render(
			<StopwatchRoot>
				<div />
			</StopwatchRoot>,
		);

		fireEvent.click(screen.getByText("Reiniciar"));

		expect(mockReset).toHaveBeenCalledTimes(1);
	});

	it("wraps timer error into TIMER_OVERFLOW structure", () => {
		const onError = vi.fn();

		setupStateMock();

		(timerHook.useStopwatchTimer as unknown as ReturnType<typeof vi.fn>).mockImplementation(
			({ onError }) => {
				onError(new Error("Overflow"));
			},
		);

		render(
			<StopwatchRoot onError={onError}>
				<div />
			</StopwatchRoot>,
		);

		expect(onError).toHaveBeenCalledWith(
			expect.objectContaining({
				code: "TIMER_OVERFLOW",
				message: "Overflow",
				timestamp: expect.any(Number),
			}),
		);
	});

	it("does not render provider content when error exists", () => {
		setupStateMock({
			error: { message: "Erro fatal" },
		});

		render(
			<StopwatchRoot>
				<ContextConsumer />
			</StopwatchRoot>,
		);

		expect(screen.queryByTestId("state")).not.toBeInTheDocument();
	});
});
