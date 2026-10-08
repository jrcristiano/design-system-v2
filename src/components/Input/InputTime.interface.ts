import React from "react";

export interface TimeValue {
	hours: number;
	minutes: number;
	seconds: number;
}

export interface InputTimeProps {
	label?: string;
	hint?: string;
	timeUnitLabel?: string;
	timeUnitIcon?: React.ElementType<any>;
	/** Formato da máscara de tempo (ex: "HH:MM", "HH:MM:SS", "MM:SS") */
	format?: string;
	value?: TimeValue;
	defaultValue?: TimeValue;
	onChange?: (value: TimeValue) => void;
	state?: "default" | "focus";
	disabled?: boolean;
	required?: boolean;
	className?: string;
}
