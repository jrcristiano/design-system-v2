import { describe, it, expect } from "vitest";
import { getInitials } from "./get.initials.util";

describe("getInitials", () => {
	describe("empty and falsy input handling", () => {
		it("returns empty string for empty string input", () => {
			expect(getInitials("")).toBe("");
		});
	});

	describe("single name handling", () => {
		it("returns first letter uppercased for single name", () => {
			expect(getInitials("John")).toBe("J");
		});

		it("returns first letter uppercased for single lowercase name", () => {
			expect(getInitials("john")).toBe("J");
		});

		it("handles single name with leading/trailing whitespace", () => {
			expect(getInitials("  John  ")).toBe("J");
		});
	});

	describe("two name handling", () => {
		it("returns first and last initials for two names", () => {
			expect(getInitials("John Doe")).toBe("JD");
		});

		it("returns first and last initials uppercased for lowercase names", () => {
			expect(getInitials("john doe")).toBe("JD");
		});

		it("handles multiple spaces between names", () => {
			expect(getInitials("John   Doe")).toBe("JD");
		});
	});

	describe("multiple name handling", () => {
		it("returns first and last initials for three names", () => {
			expect(getInitials("John Michael Doe")).toBe("JD");
		});

		it("returns first and last initials for many names", () => {
			expect(getInitials("John Michael William Robert Doe")).toBe("JD");
		});
	});

	describe("edge cases for parts.at(-1)?.[0] ?? '' fallback", () => {
		// These tests target the ?? "" fallback on line 11
		// The fallback is triggered when parts.at(-1)?.[0] is undefined
		// This can happen if the last part is an empty string (though trim/split usually prevents this)

		it("handles name with only first character", () => {
			expect(getInitials("A B")).toBe("AB");
		});

		it("handles single character names", () => {
			expect(getInitials("A")).toBe("A");
		});

		it("handles mixed case names correctly", () => {
			expect(getInitials("JOHN DOE")).toBe("JD");
		});
	});
});
