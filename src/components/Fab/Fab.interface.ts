import type { IconWeight } from "@phosphor-icons/react";
import type { Size, State, Variant } from "../../types/Commons.type";
import type { FabPosition } from "../Button/Button.interface";

export interface IFabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
	size?: Size;
	state?: State;
	icon: React.ElementType<any>;
	iconWeight?: IconWeight;
	isLoading?: boolean;
	disabled?: boolean;
	floatingOn?: FabPosition;
	circle?: boolean;
	"aria-label": string;
}
