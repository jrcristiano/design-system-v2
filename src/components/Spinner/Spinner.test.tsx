import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllTimers();
	});

	it("renders with status role and initial progress", () => {
		render(<Spinner />);
		expect(screen.getByRole("status")).toBeInTheDocument();
		expect(screen.getByText("0%")).toBeInTheDocument();
	});

	it("increments progress by 25% every 750ms until 100%", () => {
		vi.useFakeTimers();
		render(<Spinner />);

		expect(screen.getByText("0%")).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(750);
		});
		expect(screen.getByText("25%")).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(750);
		});
		expect(screen.getByText("50%")).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(750);
		});
		expect(screen.getByText("75%")).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(750);
		});
		expect(screen.getByText("100%")).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(1500);
		});
		expect(screen.getByText("100%")).toBeInTheDocument();
	});

	it("uses the provided progress when set", () => {
		render(<Spinner progress={120} />);
		expect(screen.getByText("100%")).toBeInTheDocument();
	});
});
