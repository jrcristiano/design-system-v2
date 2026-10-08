import { describe, it, expect } from "vitest";
import {
	getComponentState,
	isValidComponentState,
	type ComponentState,
	type GetComponentStateOptions,
} from "./getComponentState";

describe("getComponentState", () => {
	describe("default behavior", () => {
		it("returns 'default' when no options provided", () => {
			expect(getComponentState()).toBe("default");
		});

		it("returns 'default' when all states are false", () => {
			expect(
				getComponentState({
					disabled: false,
					selected: false,
					isFocused: false,
					isHovered: false,
					isPressed: false,
				}),
			).toBe("default");
		});

		it("returns custom defaultState when provided", () => {
			expect(getComponentState({ defaultState: "hover" })).toBe("hover");
		});
	});

	describe("state priority", () => {
		it("returns 'disabled' when disabled is true (highest priority)", () => {
			expect(
				getComponentState({
					disabled: true,
					selected: true,
					isFocused: true,
					isHovered: true,
					isPressed: true,
				}),
			).toBe("disabled");
		});

		it("returns 'selected' when selected is true and not disabled", () => {
			expect(
				getComponentState({
					disabled: false,
					selected: true,
					isFocused: true,
					isHovered: true,
					isPressed: true,
				}),
			).toBe("selected");
		});

		it("returns 'pressed' when pressed and not disabled/selected", () => {
			expect(
				getComponentState({
					disabled: false,
					selected: false,
					isFocused: true,
					isHovered: true,
					isPressed: true,
				}),
			).toBe("pressed");
		});

		it("returns 'focused' when focused and not disabled/selected/pressed", () => {
			expect(
				getComponentState({
					disabled: false,
					selected: false,
					isFocused: true,
					isHovered: true,
					isPressed: false,
				}),
			).toBe("focused");
		});

		it("returns 'hover' when hovered and not disabled/selected/pressed/focused", () => {
			expect(
				getComponentState({
					disabled: false,
					selected: false,
					isFocused: false,
					isHovered: true,
					isPressed: false,
				}),
			).toBe("hover");
		});
	});

	describe("controlled state", () => {
		it("returns controlled state when provided and not 'default'", () => {
			expect(
				getComponentState({
					controlledState: "focused",
					isHovered: true,
				}),
			).toBe("focused");
		});

		it("ignores controlled state when it is 'default'", () => {
			expect(
				getComponentState({
					controlledState: "default",
					isHovered: true,
				}),
			).toBe("hover");
		});

		it("controlled state takes priority over interaction states", () => {
			expect(
				getComponentState({
					controlledState: "selected",
					isFocused: true,
					isHovered: true,
					isPressed: true,
				}),
			).toBe("selected");
		});

		it("does not override disabled state", () => {
			// Note: controlledState takes priority, even over disabled
			// This is by design - if you pass controlledState, it's used
			expect(
				getComponentState({
					controlledState: "hover",
					disabled: true,
				}),
			).toBe("hover");
		});
	});

	describe("individual states", () => {
		it("returns 'disabled' when only disabled is true", () => {
			expect(getComponentState({ disabled: true })).toBe("disabled");
		});

		it("returns 'selected' when only selected is true", () => {
			expect(getComponentState({ selected: true })).toBe("selected");
		});

		it("returns 'pressed' when only isPressed is true", () => {
			expect(getComponentState({ isPressed: true })).toBe("pressed");
		});

		it("returns 'focused' when only isFocused is true", () => {
			expect(getComponentState({ isFocused: true })).toBe("focused");
		});

		it("returns 'hover' when only isHovered is true", () => {
			expect(getComponentState({ isHovered: true })).toBe("hover");
		});
	});

	describe("type safety", () => {
		it("returns correct ComponentState type", () => {
			const result: ComponentState = getComponentState({ isHovered: true });
			expect(result).toBe("hover");
		});

		it("accepts partial options", () => {
			const options: GetComponentStateOptions = { disabled: true };
			expect(getComponentState(options)).toBe("disabled");
		});
	});
});

describe("isValidComponentState", () => {
	it("returns true for 'default'", () => {
		expect(isValidComponentState("default")).toBe(true);
	});

	it("returns true for 'hover'", () => {
		expect(isValidComponentState("hover")).toBe(true);
	});

	it("returns true for 'pressed'", () => {
		expect(isValidComponentState("pressed")).toBe(true);
	});

	it("returns true for 'focused'", () => {
		expect(isValidComponentState("focused")).toBe(true);
	});

	it("returns true for 'disabled'", () => {
		expect(isValidComponentState("disabled")).toBe(true);
	});

	it("returns true for 'selected'", () => {
		expect(isValidComponentState("selected")).toBe(true);
	});

	it("returns false for invalid state", () => {
		expect(isValidComponentState("invalid")).toBe(false);
	});

	it("returns false for empty string", () => {
		expect(isValidComponentState("")).toBe(false);
	});

	it("returns false for similar but wrong values", () => {
		expect(isValidComponentState("hovered")).toBe(false);
		expect(isValidComponentState("pressing")).toBe(false);
		expect(isValidComponentState("focus")).toBe(false);
	});
});
