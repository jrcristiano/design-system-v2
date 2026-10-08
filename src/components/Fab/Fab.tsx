import React from "react";
import type { IFabProps } from "./Fab.interface";
import { Button } from "../Button/Button";

export const Fab: React.FC<IFabProps> = React.memo(
	({
		icon: Icon,
		floatingOn = "bottom-right",
		variant = "primary",
		size = "lg",
		state = "default",
		iconWeight = "regular",
		circle = true,
		children,
		...props
	}) => (
		<Button
			variant={variant}
			size={size}
			state={state}
			iconLeft={Icon}
			iconWeight={iconWeight}
			floatingOn={floatingOn}
			circle={circle}
			{...props}
		>
			{children}
		</Button>
	),
);

Fab.displayName = "Fab";
