import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	durationToSeconds,
	secondsToDuration,
	padZero,
	formatDuration,
	isValidStopwatchValue,
	addSecond,
	compareDurations,
	hasReachedLimit,
	createStopwatchError,
} from "../Stopwatch.utils";
import { MAX_VALID_VALUES, ERROR_CODES } from "../Stopwatch.constants";
import type { StopwatchValue } from "../Stopwatch.types";

describe("durationToSeconds", () => {
	it("converts zero duration correctly", () => {
		const input: StopwatchValue = { hours: 0, minutes: 0, seconds: 0 };
		expect(durationToSeconds(input)).toBe(0);
	});

	it("converts seconds only", () => {
		const input: StopwatchValue = { hours: 0, minutes: 0, seconds: 45 };
		expect(durationToSeconds(input)).toBe(45);
	});

	it("converts minutes only", () => {
		const input: StopwatchValue = { hours: 0, minutes: 2, seconds: 0 };
		expect(durationToSeconds(input)).toBe(120);
	});

	it("converts hours only", () => {
		const input: StopwatchValue = { hours: 1, minutes: 0, seconds: 0 };
		expect(durationToSeconds(input)).toBe(3600);
	});

	it("converts full duration", () => {
		const input: StopwatchValue = { hours: 1, minutes: 2, seconds: 3 };
		expect(durationToSeconds(input)).toBe(3723);
	});
});

describe("secondsToDuration", () => {
	it("handles zero seconds", () => {
		expect(secondsToDuration(0)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
	});

	it("handles seconds under a minute", () => {
		expect(secondsToDuration(45)).toEqual({ hours: 0, minutes: 0, seconds: 45 });
	});

	it("handles minutes correctly", () => {
		expect(secondsToDuration(125)).toEqual({ hours: 0, minutes: 2, seconds: 5 });
	});

	it("handles hours correctly", () => {
		expect(secondsToDuration(3665)).toEqual({ hours: 1, minutes: 1, seconds: 5 });
	});

	it("rounds down using floor", () => {
		expect(secondsToDuration(3599)).toEqual({ hours: 0, minutes: 59, seconds: 59 });
	});
});

describe("padZero", () => {
	it("pads single digit", () => {
		expect(padZero(5)).toBe("05");
	});

	it("does not pad double digit", () => {
		expect(padZero(10)).toBe("10");
	});

	it("keeps larger numbers intact", () => {
		expect(padZero(123)).toBe("123");
	});
});

describe("formatDuration", () => {
	const value: StopwatchValue = { hours: 1, minutes: 2, seconds: 3 };

	it("formats default HH:MM:SS", () => {
		expect(formatDuration(value)).toBe("01:02:03");
	});

	it("formats MM:SS", () => {
		expect(formatDuration(value, "MM:SS")).toBe("62:03");
	});

	it("formats HH:MM", () => {
		expect(formatDuration(value, "HH:MM")).toBe("01:02");
	});

	it("formats zero correctly", () => {
		expect(formatDuration({ hours: 0, minutes: 0, seconds: 0 })).toBe("00:00:00");
	});
});

describe("isValidStopwatchValue", () => {
	it("returns true for valid value", () => {
		const valid: StopwatchValue = { hours: 1, minutes: 2, seconds: 3 };
		expect(isValidStopwatchValue(valid)).toBe(true);
	});

	it("returns false for null", () => {
		expect(isValidStopwatchValue(null)).toBe(false);
	});

	it("returns false for undefined", () => {
		expect(isValidStopwatchValue(undefined)).toBe(false);
	});

	it("returns false for negative values", () => {
		expect(isValidStopwatchValue({ hours: -1, minutes: 0, seconds: 0 })).toBe(false);
	});

	it("returns false for NaN", () => {
		expect(isValidStopwatchValue({ hours: NaN, minutes: 0, seconds: 0 })).toBe(false);
	});

	it("returns false for Infinity", () => {
		expect(isValidStopwatchValue({ hours: Infinity, minutes: 0, seconds: 0 })).toBe(false);
	});

	it("returns false for exceeding max values", () => {
		expect(
			isValidStopwatchValue({
				hours: MAX_VALID_VALUES.hours + 1,
				minutes: 0,
				seconds: 0,
			}),
		).toBe(false);
	});

	it("returns false when properties missing", () => {
		expect(isValidStopwatchValue({ hours: 1, minutes: 2 })).toBe(false);
	});
});

describe("addSecond", () => {
	it("increments simple second", () => {
		const input: StopwatchValue = { hours: 0, minutes: 0, seconds: 1 };
		expect(addSecond(input)).toEqual({ hours: 0, minutes: 0, seconds: 2 });
	});

	it("handles seconds overflow", () => {
		const input: StopwatchValue = { hours: 0, minutes: 0, seconds: 59 };
		expect(addSecond(input)).toEqual({ hours: 0, minutes: 1, seconds: 0 });
	});

	it("handles minutes overflow", () => {
		const input: StopwatchValue = { hours: 0, minutes: 59, seconds: 59 };
		expect(addSecond(input)).toEqual({ hours: 1, minutes: 0, seconds: 0 });
	});

	it("does not mutate original object", () => {
		const input: StopwatchValue = { hours: 0, minutes: 0, seconds: 0 };
		const copy = { ...input };
		addSecond(input);
		expect(input).toEqual(copy);
	});
});

describe("compareDurations", () => {
	const a: StopwatchValue = { hours: 0, minutes: 1, seconds: 0 };
	const b: StopwatchValue = { hours: 0, minutes: 2, seconds: 0 };

	it("returns -1 when a < b", () => {
		expect(compareDurations(a, b)).toBe(-1);
	});

	it("returns 1 when a > b", () => {
		expect(compareDurations(b, a)).toBe(1);
	});

	it("returns 0 when equal", () => {
		expect(compareDurations(a, { hours: 0, minutes: 1, seconds: 0 })).toBe(0);
	});
});

describe("hasReachedLimit", () => {
	const current: StopwatchValue = { hours: 0, minutes: 1, seconds: 0 };

	it("returns false when limit undefined", () => {
		expect(hasReachedLimit(current)).toBe(false);
	});

	it("returns false when limit zero", () => {
		expect(hasReachedLimit(current, { hours: 0, minutes: 0, seconds: 0 })).toBe(false);
	});

	it("returns false when below limit", () => {
		expect(hasReachedLimit(current, { hours: 0, minutes: 2, seconds: 0 })).toBe(false);
	});

	it("returns true when equal to limit", () => {
		expect(hasReachedLimit(current, { hours: 0, minutes: 1, seconds: 0 })).toBe(true);
	});

	it("returns true when above limit", () => {
		expect(hasReachedLimit(current, { hours: 0, minutes: 0, seconds: 30 })).toBe(true);
	});
});

describe("createStopwatchError", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it("creates structured error with mapped code and deterministic timestamp", () => {
		const error = createStopwatchError("INVALID_VALUE", "Invalid value");

		expect(error.code).toBe(ERROR_CODES.INVALID_VALUE);
		expect(error.message).toBe("Invalid value");
		expect(error.timestamp).toBe(new Date("2024-01-01T00:00:00.000Z").getTime());
	});
});
