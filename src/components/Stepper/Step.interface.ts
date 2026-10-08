export type StepStatus = "default" | "focused" | "active" | "completed";

export interface StepItem {
	id: string | number;
	label: string;
	status?: StepStatus;
	disabled?: boolean;
	href?: string;
}

export interface StepData {
	key: string | number;
	href?: string;
	disabled?: boolean;
	label: React.ReactNode;
}
