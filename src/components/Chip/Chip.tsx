import { useInteractionState } from "../../hooks/useInteractionState";
import type { ChipState, IChipProps } from "./Chip.interface";
import { IconSlot } from "../shared/IconSlot";
import React from "react";
import clsx from "clsx";
import "./Chip.inline.css";

type ChipVisualState = ChipState | "disabled";

// Resolve o estado visual final do Chip
const resolveChipState = (
	state: ChipState,
	interactionState: ReturnType<typeof useInteractionState>["state"],
	disabled: boolean,
): ChipVisualState => {
	if (disabled) return "disabled";
	if (state !== "default") return state;
	if (interactionState === "pressed") return "pressed";
	if (interactionState === "focused") return "focused";
	return "default";
};

export const Chip: React.FC<IChipProps> = React.memo(
	({
		variant = "primary",
		state = "default",
		disabled = false,
		pill = true,
		iconLeft: IconLeft,
		iconRight: IconRight,
		onIconLeftClick,
		onIconRightClick,
		children,
		className,
		style,
		type,
		...props
	}) => {
		const { state: interactionState, handlers } = useInteractionState({ disabled });

		// Estado final do chip
		const currentState = resolveChipState(state, interactionState, disabled);

		// Garantir fallback seguro caso variante inválida

		// Estilos finais combinados

		// Função genérica para ícones interativos
		const handleIconClick = (callback?: () => void) => (event: React.MouseEvent<HTMLElement>) => {
			if (!disabled) {
				event.stopPropagation();
				callback?.();
			}
		};

		return (
			<button
				type={type ?? "button"}
				className={clsx("chip-inline", className)}
				style={style}
				data-variant={variant}
				data-visual-state={currentState}
				data-pill={pill}
				disabled={disabled}
				{...handlers}
				{...props}
			>
				{IconLeft && (
					<IconSlot
						as="span"
						onClick={onIconLeftClick ? handleIconClick(onIconLeftClick) : undefined}
					>
						<IconLeft size={16} />
					</IconSlot>
				)}
				{children}
				{IconRight && (
					<IconSlot
						as="span"
						onClick={onIconRightClick ? handleIconClick(onIconRightClick) : undefined}
					>
						<IconRight size={16} />
					</IconSlot>
				)}
			</button>
		);
	},
);

Chip.displayName = "Chip";
