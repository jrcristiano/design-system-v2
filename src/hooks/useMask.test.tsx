import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useMask } from "./useMask";

describe("useMask", () => {
	describe("applyMask", () => {
		it("applies numeric mask (0)", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.applyMask("12345678901", "000.000.000-00")).toBe("123.456.789-01");
		});

		it("applies alphabetic mask (A)", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.applyMask("ABC", "AAA")).toBe("ABC");
		});

		it("applies wildcard mask (*)", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.applyMask("A1B2", "****")).toBe("A1B2");
		});

		it("applies mixed mask with wildcard", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.applyMask("AB12", "**-00")).toBe("AB-12");
		});

		it("handles partial input", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.applyMask("123", "000.000.000-00")).toBe("123");
		});

		it("ignores non-alphanumeric characters in input", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.applyMask("123-456", "000000")).toBe("123456");
		});

		it("handles empty input", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.applyMask("", "000")).toBe("");
		});

		it("applies phone mask", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.applyMask("11999998888", "(00) 00000-0000")).toBe("(11) 99999-8888");
		});

		it("applies CEP mask", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.applyMask("01310100", "00000-000")).toBe("01310-100");
		});

		it("handles alpha mask when digit provided - adds mask char", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.applyMask("1", "A")).toBe("");
		});

		it("handles numeric mask when letter provided - adds mask char", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.applyMask("A", "0")).toBe("");
		});
	});

	describe("stripMask", () => {
		it("removes non-alphanumeric characters", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.stripMask("123.456.789-01")).toBe("12345678901");
		});

		it("keeps alphanumeric characters", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.stripMask("ABC123")).toBe("ABC123");
		});

		it("handles empty string", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.stripMask("")).toBe("");
		});

		it("removes all special characters", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.stripMask("(11) 99999-8888")).toBe("11999998888");
		});

		it("uses mask tokens when mask is provided", () => {
			const { result } = renderHook(() => useMask());
			expect(result.current.stripMask("AB12", "00")).toBe("12");
		});
	});
});
