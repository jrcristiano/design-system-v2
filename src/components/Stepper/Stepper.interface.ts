import type { ReactNode } from "react";

export interface StepperProps {
	children: ReactNode;
	activeKey?: string | number;
	onSelect?: (key: string | number) => void;
	className?: string;
}
