import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useInteractionState } from "./useInteractionState";

describe("useInteractionState", () => {
	it("initializes with default state", () => {
		const { result } = renderHook(() => useInteractionState());

		expect(result.current.isFocused).toBe(false);
		expect(result.current.isHovered).toBe(false);
		expect(result.current.isPressed).toBe(false);
		expect(result.current.state).toBe("default");
	});

	it("returns disabled state when disabled is true", () => {
		const { result } = renderHook(() => useInteractionState({ disabled: true }));

		expect(result.current.state).toBe("disabled");
	});

	it("returns selected state when selected is true", () => {
		const { result } = renderHook(() => useInteractionState({ selected: true }));

		expect(result.current.state).toBe("selected");
	});

	it("prioritizes disabled over selected", () => {
		const { result } = renderHook(() => useInteractionState({ disabled: true, selected: true }));

		expect(result.current.state).toBe("disabled");
	});

	it("sets hover state on mouse enter", () => {
		const { result } = renderHook(() => useInteractionState());

		act(() => {
			result.current.handlers.onMouseEnter();
		});

		expect(result.current.isHovered).toBe(true);
		expect(result.current.state).toBe("hover");
	});

	it("clears hover and pressed on mouse leave", () => {
		const { result } = renderHook(() => useInteractionState());

		act(() => {
			result.current.handlers.onMouseEnter();
			result.current.handlers.onMouseDown();
		});

		expect(result.current.isHovered).toBe(true);
		expect(result.current.isPressed).toBe(true);

		act(() => {
			result.current.handlers.onMouseLeave();
		});

		expect(result.current.isHovered).toBe(false);
		expect(result.current.isPressed).toBe(false);
		expect(result.current.state).toBe("default");
	});

	it("sets pressed state on mouse down", () => {
		const { result } = renderHook(() => useInteractionState());

		act(() => {
			result.current.handlers.onMouseDown();
		});

		expect(result.current.isPressed).toBe(true);
		expect(result.current.state).toBe("pressed");
	});

	it("clears pressed state on mouse up", () => {
		const { result } = renderHook(() => useInteractionState());

		act(() => {
			result.current.handlers.onMouseDown();
		});

		expect(result.current.isPressed).toBe(true);

		act(() => {
			result.current.handlers.onMouseUp();
		});

		expect(result.current.isPressed).toBe(false);
	});

	it("sets focused state on focus", () => {
		const { result } = renderHook(() => useInteractionState());

		act(() => {
			result.current.handlers.onFocus();
		});

		expect(result.current.isFocused).toBe(true);
		expect(result.current.state).toBe("focused");
	});

	it("clears focused state on blur", () => {
		const { result } = renderHook(() => useInteractionState());

		act(() => {
			result.current.handlers.onFocus();
		});

		expect(result.current.isFocused).toBe(true);

		act(() => {
			result.current.handlers.onBlur();
		});

		expect(result.current.isFocused).toBe(false);
	});

	it("does not set hover when disabled", () => {
		const { result } = renderHook(() => useInteractionState({ disabled: true }));

		act(() => {
			result.current.handlers.onMouseEnter();
		});

		expect(result.current.isHovered).toBe(false);
		expect(result.current.state).toBe("disabled");
	});

	it("does not set pressed when disabled", () => {
		const { result } = renderHook(() => useInteractionState({ disabled: true }));

		act(() => {
			result.current.handlers.onMouseDown();
		});

		expect(result.current.isPressed).toBe(false);
		expect(result.current.state).toBe("disabled");
	});

	it("does not set focused when disabled", () => {
		const { result } = renderHook(() => useInteractionState({ disabled: true }));

		act(() => {
			result.current.handlers.onFocus();
		});

		expect(result.current.isFocused).toBe(false);
		expect(result.current.state).toBe("disabled");
	});

	it("prioritizes pressed over focused", () => {
		const { result } = renderHook(() => useInteractionState());

		act(() => {
			result.current.handlers.onFocus();
			result.current.handlers.onMouseDown();
		});

		expect(result.current.state).toBe("pressed");
	});

	it("prioritizes focused over hover", () => {
		const { result } = renderHook(() => useInteractionState());

		act(() => {
			result.current.handlers.onMouseEnter();
			result.current.handlers.onFocus();
		});

		expect(result.current.state).toBe("focused");
	});

	it("prioritizes selected over pressed", () => {
		const { result } = renderHook(() => useInteractionState({ selected: true }));

		act(() => {
			result.current.handlers.onMouseDown();
		});

		expect(result.current.state).toBe("selected");
	});

	it("allows custom default state", () => {
		const { result } = renderHook(() => useInteractionState({ defaultState: "hover" }));

		expect(result.current.state).toBe("hover");
	});

	it("allows manual state setting via setters", () => {
		const { result } = renderHook(() => useInteractionState());

		act(() => {
			result.current.setIsFocused(true);
		});

		expect(result.current.isFocused).toBe(true);

		act(() => {
			result.current.setIsHovered(true);
		});

		expect(result.current.isHovered).toBe(true);

		act(() => {
			result.current.setIsPressed(true);
		});

		expect(result.current.isPressed).toBe(true);
	});

	it("updates state when options change", () => {
		const { result, rerender } = renderHook(({ disabled }) => useInteractionState({ disabled }), {
			initialProps: { disabled: false },
		});

		expect(result.current.state).toBe("default");

		rerender({ disabled: true });

		expect(result.current.state).toBe("disabled");
	});
});
