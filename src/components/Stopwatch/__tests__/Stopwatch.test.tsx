import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Stopwatch } from "../Stopwatch";
import type { StopwatchValue } from "../Stopwatch.interface";

describe("Stopwatch", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	const zero: StopwatchValue = { hours: 0, minutes: 0, seconds: 0 };

	it("renders initial time correctly", () => {
		render(<Stopwatch defaultValue={zero} />);
		expect(screen.getByText("00:00:00")).toBeInTheDocument();
	});

	it("starts counting when clicking start", () => {
		const onChange = vi.fn();

		render(<Stopwatch defaultValue={zero} onChange={onChange} />);

		fireEvent.click(screen.getByLabelText("Iniciar"));

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(screen.getByText("00:00:01")).toBeInTheDocument();
		expect(onChange).toHaveBeenCalledWith({ hours: 0, minutes: 0, seconds: 1 });
	});

	it("pauses correctly", () => {
		render(<Stopwatch defaultValue={zero} />);

		fireEvent.click(screen.getByLabelText("Iniciar"));

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		fireEvent.click(screen.getByLabelText("Pausar"));

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		expect(screen.getByText("00:00:02")).toBeInTheDocument();
	});

	it("resets correctly", () => {
		const onReset = vi.fn();
		const onChange = vi.fn();

		render(<Stopwatch defaultValue={zero} onReset={onReset} onChange={onChange} />);

		fireEvent.click(screen.getByLabelText("Iniciar"));

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		// Precisa pausar antes para exibir botão Resetar
		fireEvent.click(screen.getByLabelText("Pausar"));

		fireEvent.click(screen.getByLabelText("Resetar"));

		expect(screen.getByText("00:00:00")).toBeInTheDocument();
		expect(onReset).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenLastCalledWith(zero);
	});

	it("autoStart starts automatically", () => {
		render(<Stopwatch defaultValue={zero} autoStart />);

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(screen.getByText("00:00:01")).toBeInTheDocument();
	});

	it("respects timeLimit", () => {
		const limit: StopwatchValue = { hours: 0, minutes: 0, seconds: 2 };
		const onPause = vi.fn();

		render(<Stopwatch defaultValue={zero} value={limit} onPause={onPause} />);

		fireEvent.click(screen.getByLabelText("Iniciar"));

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		expect(screen.getByText("00:00:02")).toBeInTheDocument();

		// Deve ter pausado ao atingir limite
		expect(onPause).toHaveBeenCalled();
	});

	it("does not start when disabled", () => {
		render(<Stopwatch defaultValue={zero} disabled />);

		fireEvent.click(screen.getByLabelText("Iniciar"));

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		expect(screen.getByText("00:00:00")).toBeInTheDocument();
	});

	it("hides controls when showControls is false", () => {
		render(<Stopwatch defaultValue={zero} showControls={false} />);
		expect(screen.queryByLabelText("Iniciar")).not.toBeInTheDocument();
	});

	it("renders label when provided", () => {
		render(<Stopwatch defaultValue={zero} label="Tempo total" />);
		expect(screen.getByText("Tempo total")).toBeInTheDocument();
	});

	it("calls onStart callback", () => {
		const onStart = vi.fn();

		render(<Stopwatch defaultValue={zero} onStart={onStart} />);

		fireEvent.click(screen.getByLabelText("Iniciar"));

		expect(onStart).toHaveBeenCalledTimes(1);
	});

	it("calls onPause callback", () => {
		const onPause = vi.fn();

		render(<Stopwatch defaultValue={zero} onPause={onPause} />);

		fireEvent.click(screen.getByLabelText("Iniciar"));
		fireEvent.click(screen.getByLabelText("Pausar"));

		expect(onPause).toHaveBeenCalledTimes(1);
	});
});
