import type { FC, ReactNode } from "react";
import { memo, useMemo } from "react";
import clsx from "clsx";
import { Step } from "./Step";
import type { StepData, StepStatus } from "./Step.interface";
import type { StepperProps } from "./Stepper.interface";

// StepLink uses data attributes to store props; parent Stepper accesses them via .props pattern
const StepLink: FC<{
	eventKey?: string | number;
	href?: string;
	disabled?: boolean;
	children: ReactNode;
}> = ({ eventKey, href, disabled, children }) => (
	<span data-eventkey={eventKey} data-href={href} data-disabled={disabled}>
		{children}
	</span>
);
StepLink.displayName = "StepLink";

const StepItem: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
StepItem.displayName = "StepItem";

const StepperComponent: FC<StepperProps> = memo(({ children, activeKey, onSelect, className }) => {
	const steps = useMemo(() => {
		const stepItems = Array.isArray(children) ? children : [children];

		return stepItems
			.filter((child: any) => child?.type?.displayName === "StepItem")
			.map((child: any) => {
				const stepLink = child.props.children;
				if (stepLink?.type?.displayName === "StepLink") {
					return {
						key: stepLink.props.eventKey ?? stepLink.props.href,
						href: stepLink.props.href,
						disabled: stepLink.props.disabled,
						label: stepLink.props.children,
					} as StepData;
				}
				return null;
			})
			.filter((step): step is StepData => step !== null);
	}, [children]);

	const activeIndex = useMemo(
		() => steps.findIndex((s) => s.key === activeKey),
		[steps, activeKey],
	);

	const stepsWithStatus = useMemo(() => {
		return steps.map((step, index) => {
			let status: StepStatus = "default";
			if (!step.disabled) {
				if (step.key === activeKey) status = "active";
				else if (index < activeIndex) status = "completed";
			}
			return { ...step, status };
		});
	}, [steps, activeIndex, activeKey]);

	const containerClasses = useMemo(
		() => clsx("flex w-full flex-col gap-4 md:flex-row md:items-center md:gap-6", className),
		[className],
	);

	if (!stepsWithStatus.length) return null;

	return (
		<div className={containerClasses}>
			{stepsWithStatus.map((step, index) => (
				<Step
					key={step.key}
					stepKey={step.key}
					href={step.href}
					disabled={step.disabled}
					isLast={index === steps.length - 1}
					status={step.status}
					onClick={onSelect}
				>
					{step.label}
				</Step>
			))}
		</div>
	);
});

StepperComponent.displayName = "Stepper";

export const Stepper = StepperComponent as typeof StepperComponent & {
	Item: typeof StepItem;
	Link: typeof StepLink;
};

Stepper.Item = StepItem;
Stepper.Link = StepLink;
