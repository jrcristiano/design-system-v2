/**
 * Common component states used across the design system.
 */
export type ComponentState = "default" | "hover" | "pressed" | "focused" | "disabled" | "selected";

/**
 * Options for calculating the component state.
 */
export interface GetComponentStateOptions {
	/** Whether the component is disabled */
	disabled?: boolean;
	/** Whether the component is selected/active */
	selected?: boolean;
	/** Whether the component is currently focused */
	isFocused?: boolean;
	/** Whether the component is being hovered */
	isHovered?: boolean;
	/** Whether the component is being pressed */
	isPressed?: boolean;
	/** Controlled state that takes priority (if not "default") */
	controlledState?: ComponentState;
	/** Default state to return when no other state applies */
	defaultState?: ComponentState;
}

/**
 * Calculates the current visual state of a component based on interaction states.
 *
 * Priority order (highest to lowest):
 * 1. Controlled state (if provided and not "default")
 * 2. Disabled
 * 3. Selected
 * 4. Pressed
 * 5. Focused
 * 6. Hovered
 * 7. Default state
 *
 * @example
 * ```tsx
 * const state = getComponentState({
 *   disabled,
 *   isFocused,
 *   isHovered,
 *   isPressed,
 * });
 *
 * return <div className={stateStyles[state]} />;
 * ```
 *
 * @example With controlled state
 * ```tsx
 * const state = getComponentState({
 *   disabled,
 *   isFocused,
 *   isHovered,
 *   controlledState: propState, // "selected" | "focused" | etc.
 * });
 * ```
 */
export function getComponentState(options: GetComponentStateOptions = {}): ComponentState {
	const {
		disabled = false,
		selected = false,
		isFocused = false,
		isHovered = false,
		isPressed = false,
		controlledState,
		defaultState = "default",
	} = options;

	// Controlled state takes priority if it's not "default"
	if (controlledState && controlledState !== "default") {
		return controlledState;
	}

	// Priority-based state resolution
	if (disabled) return "disabled";
	if (selected) return "selected";
	if (isPressed) return "pressed";
	if (isFocused) return "focused";
	if (isHovered) return "hover";

	return defaultState;
}

/**
 * Type guard to check if a state is a valid ComponentState
 */
export function isValidComponentState(state: string): state is ComponentState {
	return ["default", "hover", "pressed", "focused", "disabled", "selected"].includes(state);
}
