import React from "react";

export type DigitalTimeUnit = "hours" | "minutes" | "seconds";

export interface InputDigitalTimeProps {
	label?: string;
	hint?: string;
	timeUnitLabel?: string;
	timeUnitIcon?: React.ElementType<any>;
	/** Unidade de tempo a ser editada */
	unit: DigitalTimeUnit;
	/** Valor numérico da unidade de tempo */
	value?: number;
	/** Valor padrão da unidade de tempo */
	defaultValue?: number;
	onChange?: (value: number) => void;
	disabled?: boolean;
	required?: boolean;
	className?: string;
}

export interface DigitalTimeUnitProps {
	type: DigitalTimeUnit;
	value: number;
	onChange: (value: number) => void;
	disabled?: boolean;
}
