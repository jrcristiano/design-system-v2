import { useState, useMemo, useCallback } from "react";

export type InteractionState =
	"default" | "hover" | "pressed" | "focused" | "disabled" | "selected";

export interface UseInteractionStateOptions {
	disabled?: boolean;
	selected?: boolean;
	defaultState?: InteractionState;
}

export interface InteractionStateResult {
	// Individual states
	isFocused: boolean;
	isHovered: boolean;
	isPressed: boolean;

	// Computed final state (priority: disabled > selected > pressed > focused > hover > default)
	state: InteractionState;

	// Event handlers
	handlers: {
		onMouseEnter: () => void;
		onMouseLeave: () => void;
		onMouseDown: () => void;
		onMouseUp: () => void;
		onFocus: () => void;
		onBlur: () => void;
	};

	// Individual setters (for custom behavior)
	setIsFocused: (value: boolean) => void;
	setIsHovered: (value: boolean) => void;
	setIsPressed: (value: boolean) => void;
}

/**
 * Hook to manage interaction states (hover, focus, pressed) for interactive components.
 *
 * @example
 * ```tsx
 * const { state, handlers } = useInteractionState({ disabled });
 *
 * return (
 *   <button
 *     className={stateStyles[state]}
 *     {...handlers}
 *   >
 *     Click me
 *   </button>
 * );
 * ```
 */
export function useInteractionState(
	options: UseInteractionStateOptions = {},
): InteractionStateResult {
	const { disabled = false, selected = false, defaultState = "default" } = options;

	const [isFocused, setIsFocused] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isPressed, setIsPressed] = useState(false);

	// Calculate final state based on priority
	const state = useMemo((): InteractionState => {
		if (disabled) return "disabled";
		if (selected) return "selected";
		if (isPressed) return "pressed";
		if (isFocused) return "focused";
		if (isHovered) return "hover";
		return defaultState;
	}, [disabled, selected, isPressed, isFocused, isHovered, defaultState]);

	// Memoized handlers
	const handleMouseEnter = useCallback(() => {
		if (!disabled) setIsHovered(true);
	}, [disabled]);

	const handleMouseLeave = useCallback(() => {
		setIsHovered(false);
		setIsPressed(false);
	}, []);

	const handleMouseDown = useCallback(() => {
		if (!disabled) setIsPressed(true);
	}, [disabled]);

	const handleMouseUp = useCallback(() => {
		setIsPressed(false);
	}, []);

	const handleFocus = useCallback(() => {
		if (!disabled) setIsFocused(true);
	}, [disabled]);

	const handleBlur = useCallback(() => {
		setIsFocused(false);
	}, []);

	const handlers = useMemo(
		() => ({
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
			onMouseDown: handleMouseDown,
			onMouseUp: handleMouseUp,
			onFocus: handleFocus,
			onBlur: handleBlur,
		}),
		[handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp, handleFocus, handleBlur],
	);

	return {
		isFocused,
		isHovered,
		isPressed,
		state,
		handlers,
		setIsFocused,
		setIsHovered,
		setIsPressed,
	};
}
