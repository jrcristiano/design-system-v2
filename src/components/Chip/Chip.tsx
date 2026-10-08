import { useInteractionState } from "../../hooks/useInteractionState";
import type { ChipState, ChipVariant, IChipProps } from "./Chip.interface";
import { IconSlot } from "../shared/IconSlot";
import React from "react";

type ChipVisualState = ChipState | "disabled";

interface ChipColors {
	bg: string;
	text: string;
	border: string;
}

// Estilos desabilitados compartilhados
const DISABLED_STYLES: ChipColors = {
	bg: "#C7CBD1",
	text: "#5C6470",
	border: "transparent",
};

// Estilos por variante e estado
const variantStyles: Record<ChipVariant, Record<ChipVisualState, ChipColors>> = {
	primary: {
		default: { bg: "#CCE0FF", text: "#004ECC", border: "transparent" },
		pressed: { bg: "#003B99", text: "#fff", border: "transparent" },
		focused: { bg: "#CCE0FF", text: "#003B99", border: "#001E4D" },
		outline: { bg: "#fff", text: "#004ECC", border: "#004ECC" },
		disabled: DISABLED_STYLES,
	},
	success: {
		default: { bg: "#DDF7D4", text: "#338618", border: "transparent" },
		pressed: { bg: "#296C13", text: "#fff", border: "transparent" },
		focused: { bg: "#DDF7D4", text: "#296C13", border: "#19410C" },
		outline: { bg: "#fff", text: "#338618", border: "#338618" },
		disabled: DISABLED_STYLES,
	},
	danger: {
		default: { bg: "#FCD6CF", text: "#C1290B", border: "transparent" },
		pressed: { bg: "#911F08", text: "#fff", border: "transparent" },
		focused: { bg: "#FCD6CF", text: "#911F08", border: "#480F05" },
		outline: { bg: "#fff", text: "#C1290B", border: "#C1290B" },
		disabled: DISABLED_STYLES,
	},
};

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

// Estilos base compartilhados (sem alterações de cores dinâmicas)
const BASE_STYLES: React.CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "var(--ds-pad-chip-y, 8px)",
	padding: "var(--ds-pad-chip-y, 8px) var(--ds-pad-chip-x, 8px)",
	height: "34px",
	fontSize: "var(--ds-font-size-14, 14px)",
	fontFamily: "var(--ds-font-family-ui, var(--ds-font-family-poppins, Poppins))",
	fontStyle: "normal",
	fontWeight: "var(--ds-label-1-weight, var(--ds-font-weight-medium, 500))",
	lineHeight: "var(--ds-label-1-line, 20px)",
	letterSpacing: "var(--font-letter-spacing-default, 0)",
	borderWidth: "1px",
	borderStyle: "solid",
	outline: "none",
	userSelect: "none",
	transition: "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease",
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
		const currentColors = variantStyles[variant]?.[currentState] ?? DISABLED_STYLES;

		// Estilos finais combinados
		const chipStyles: React.CSSProperties = {
			...BASE_STYLES,
			borderRadius: pill ? "var(--ds-radius-full, 9999px)" : "var(--ds-radius-md, 8px)",
			backgroundColor: currentColors.bg,
			color: currentColors.text,
			borderColor: currentColors.border,
			cursor: disabled ? "not-allowed" : "pointer",
			...style,
		};

		// Função genérica para ícones interativos
		const handleIconClick = (callback?: () => void) => () => {
			if (!disabled) callback?.();
		};

		return (
			<button
				type={type ?? "button"}
				className={className}
				style={chipStyles}
				disabled={disabled}
				{...handlers}
				{...props}
			>
				{IconLeft && (
					<IconSlot
						as="span"
						onClick={onIconLeftClick ? handleIconClick(onIconLeftClick) : undefined}
						role={onIconLeftClick ? "button" : undefined}
						tabIndex={onIconLeftClick ? 0 : undefined}
					>
						<IconLeft size={16} />
					</IconSlot>
				)}
				{children}
				{IconRight && (
					<IconSlot
						as="span"
						onClick={onIconRightClick ? handleIconClick(onIconRightClick) : undefined}
						role={onIconRightClick ? "button" : undefined}
						tabIndex={onIconRightClick ? 0 : undefined}
					>
						<IconRight size={16} />
					</IconSlot>
				)}
			</button>
		);
	},
);

Chip.displayName = "Chip";
