import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { TIMER_INTERVAL_MS } from "../Stopwatch.constants";
import { useStopwatchTimer } from "../hooks/useStopwatchTimer";

describe("useStopwatchTimer", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(0);
		vi.spyOn(global, "setInterval");
		vi.spyOn(global, "clearInterval");
		vi.spyOn(console, "warn").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.restoreAllMocks();
	});

	it("inicia o timer quando isRunning=true e disabled=false", () => {
		const onTick = vi.fn();

		renderHook(() =>
			useStopwatchTimer({
				isRunning: true,
				disabled: false,
				onTick,
			}),
		);

		expect(setInterval).toHaveBeenCalledTimes(1);
		expect(setInterval).toHaveBeenCalledWith(expect.any(Function), TIMER_INTERVAL_MS);
	});

	it("executa onTick no intervalo correto", () => {
		const onTick = vi.fn();

		renderHook(() =>
			useStopwatchTimer({
				isRunning: true,
				disabled: false,
				onTick,
			}),
		);

		act(() => {
			vi.advanceTimersByTime(TIMER_INTERVAL_MS * 3);
		});

		expect(onTick).toHaveBeenCalledTimes(3);
	});

	it("não inicia quando disabled=true", () => {
		const onTick = vi.fn();

		renderHook(() =>
			useStopwatchTimer({
				isRunning: true,
				disabled: true,
				onTick,
			}),
		);

		expect(setInterval).not.toHaveBeenCalled();
	});

	it("para o timer quando isRunning muda para false", () => {
		const onTick = vi.fn();

		const { rerender } = renderHook((props) => useStopwatchTimer(props), {
			initialProps: {
				isRunning: true,
				disabled: false,
				onTick,
			},
		});

		rerender({
			isRunning: false,
			disabled: false,
			onTick,
		});

		expect(clearInterval).toHaveBeenCalled();
	});

	it("faz cleanup no unmount", () => {
		const onTick = vi.fn();

		const { unmount } = renderHook(() =>
			useStopwatchTimer({
				isRunning: true,
				disabled: false,
				onTick,
			}),
		);

		unmount();

		expect(clearInterval).toHaveBeenCalled();
	});

	it("detecta drift significativo e loga warning", () => {
		const onTick = vi.fn();

		renderHook(() =>
			useStopwatchTimer({
				isRunning: true,
				disabled: false,
				onTick,
			}),
		);

		act(() => {
			vi.setSystemTime(TIMER_INTERVAL_MS * 2); // simula drift > 50%
			vi.advanceTimersByTime(TIMER_INTERVAL_MS);
		});

		expect(console.warn).toHaveBeenCalled();
	});

	it("chama onError e interrompe timer quando ocorre erro no tick", () => {
		const onTick = vi.fn(() => {
			throw new Error("fail");
		});
		const onError = vi.fn();

		renderHook(() =>
			useStopwatchTimer({
				isRunning: true,
				disabled: false,
				onTick,
				onError,
			}),
		);

		act(() => {
			vi.advanceTimersByTime(TIMER_INTERVAL_MS);
		});

		expect(onError).toHaveBeenCalledTimes(1);
		expect(clearInterval).toHaveBeenCalled();
	});

	it("interrompe execução após 3600 ticks (proteção contra memory leak)", () => {
		const onTick = vi.fn();
		const onError = vi.fn();

		renderHook(() =>
			useStopwatchTimer({
				isRunning: true,
				disabled: false,
				onTick,
				onError,
			}),
		);

		act(() => {
			vi.advanceTimersByTime(TIMER_INTERVAL_MS * 3601);
		});

		expect(onError).toHaveBeenCalledTimes(1);
		expect(clearInterval).toHaveBeenCalled();
	});
});
