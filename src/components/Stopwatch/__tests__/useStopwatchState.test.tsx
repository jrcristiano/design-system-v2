import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStopwatchState } from "../hooks/useStopwatchState";

import { DEFAULT_STOPWATCH_VALUE, STOPWATCH_STATES } from "../Stopwatch.constants";

import type { StopwatchValue } from "../Stopwatch.types";

describe("useStopwatchState", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("initialization", () => {
		it("should initialize with default value", () => {
			const { result } = renderHook(() => useStopwatchState({}));

			expect(result.current.value).toEqual(DEFAULT_STOPWATCH_VALUE);
			expect(result.current.state).toBe(STOPWATCH_STATES.IDLE);
			expect(result.current.isRunning).toBe(false);
			expect(result.current.isPaused).toBe(false);
			expect(result.current.isLimitReached).toBe(false);
			expect(result.current.error).toBeNull();
		});

		it("should autoStart when enabled", () => {
			const { result } = renderHook(() => useStopwatchState({ autoStart: true }));

			expect(result.current.state).toBe(STOPWATCH_STATES.RUNNING);
			expect(result.current.isRunning).toBe(true);
		});

		it("should use controlled value when provided", () => {
			const controlled: StopwatchValue = {
				hours: 1,
				minutes: 2,
				seconds: 3,
			};

			const { result } = renderHook(() => useStopwatchState({ value: controlled }));

			expect(result.current.value).toEqual(controlled);
		});
	});

	describe("play / pause", () => {
		it("should transition to RUNNING when play is called", () => {
			const onStateChange = vi.fn();

			const { result } = renderHook(() => useStopwatchState({ onStateChange }));

			act(() => {
				result.current.handlers.play();
			});

			expect(result.current.state).toBe(STOPWATCH_STATES.RUNNING);
			expect(onStateChange).toHaveBeenCalledWith(STOPWATCH_STATES.RUNNING);
		});

		it("should transition to PAUSED when pause is called", () => {
			const onStateChange = vi.fn();

			const { result } = renderHook(() => useStopwatchState({ onStateChange }));

			act(() => {
				result.current.handlers.play();
			});

			act(() => {
				result.current.handlers.pause();
			});

			expect(result.current.state).toBe(STOPWATCH_STATES.PAUSED);
			expect(onStateChange).toHaveBeenCalledWith(STOPWATCH_STATES.PAUSED);
		});
	});

	describe("reset", () => {
		it("should reset value and state", () => {
			const onChange = vi.fn();
			const onStateChange = vi.fn();

			const { result } = renderHook(() =>
				useStopwatchState({
					onChange,
					onStateChange,
				}),
			);

			act(() => {
				result.current.handlers.play();
			});

			act(() => {
				result.current.handlers.reset();
			});

			expect(result.current.state).toBe(STOPWATCH_STATES.IDLE);
			expect(result.current.value).toEqual(DEFAULT_STOPWATCH_VALUE);
			expect(onStateChange).toHaveBeenCalledWith(STOPWATCH_STATES.IDLE);
			expect(onChange).toHaveBeenCalledWith(DEFAULT_STOPWATCH_VALUE);
		});
	});

	describe("tick behavior", () => {
		it("should increment one second when running", () => {
			const onChange = vi.fn();

			const { result } = renderHook(() =>
				useStopwatchState({
					onChange,
				}),
			);

			act(() => {
				result.current.handlers.play();
			});

			act(() => {
				result.current.handlers.tick();
			});

			expect(onChange).toHaveBeenCalledTimes(1);

			const newValue = onChange.mock.calls[0][0];

			expect(newValue).toEqual({
				hours: 0,
				minutes: 0,
				seconds: 1,
			});
		});

		it("should not tick when paused", () => {
			const onChange = vi.fn();

			const { result } = renderHook(() =>
				useStopwatchState({
					onChange,
				}),
			);

			act(() => {
				result.current.handlers.play();
			});

			act(() => {
				result.current.handlers.pause();
			});

			act(() => {
				result.current.handlers.tick();
			});

			expect(onChange).not.toHaveBeenCalled();
		});

		it("should respect timeLimit", () => {
			const limit: StopwatchValue = {
				hours: 0,
				minutes: 0,
				seconds: 1,
			};

			const { result } = renderHook(() =>
				useStopwatchState({
					timeLimit: limit,
				}),
			);

			act(() => {
				result.current.handlers.play();
			});

			act(() => {
				result.current.handlers.tick();
			});

			expect(result.current.isLimitReached).toBe(true);
			expect(result.current.state).toBe(STOPWATCH_STATES.LIMIT_REACHED);
		});
	});

	describe("disabled behavior", () => {
		it("should not start when disabled", () => {
			const { result } = renderHook(() =>
				useStopwatchState({
					disabled: true,
				}),
			);

			act(() => {
				result.current.handlers.play();
			});

			expect(result.current.state).toBe(STOPWATCH_STATES.IDLE);
		});
	});
});
