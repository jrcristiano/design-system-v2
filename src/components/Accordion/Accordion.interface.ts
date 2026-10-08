import type { AccordionState } from "./Accordion.type";

export interface IAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	children: React.ReactNode;
	state?: AccordionState;
	isOpen?: boolean;
	onToggle?: never;
}
