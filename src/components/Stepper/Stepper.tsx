import type { FC, ReactElement, ReactNode } from "react";
import { isValidElement, memo, useMemo } from "react";
import clsx from "clsx";
import { Step } from "./Step";
import type { StepData, StepStatus } from "./Step.interface";
import type { StepperProps } from "./Stepper.interface";

type StepItemProps = { children: ReactNode };
type StepLinkProps = {
	eventKey?: string | number;
	href?: string;
	disabled?: boolean;
	children: ReactNode;
};

// StepLink uses data attributes to store props; parent Stepper accesses them via .props pattern
const StepLink: FC<StepLinkProps> = ({ eventKey, href, disabled, children }) => (
	<span data-eventkey={eventKey} data-href={href} data-disabled={disabled}>
		{children}
	</span>
);
StepLink.displayName = "StepLink";

const StepItem: FC<StepItemProps> = ({ children }) => <>{children}</>;
StepItem.displayName = "StepItem";

const hasDisplayName = <Props,>(
	child: ReactNode,
	displayName: string,
): child is ReactElement<Props> => {
	if (!isValidElement<Props>(child)) return false;

	const elementType = child.type;
	const canHaveDisplayName =
		typeof elementType === "function" || (typeof elementType === "object" && elementType !== null);

	return (
		canHaveDisplayName && "displayName" in elementType && elementType.displayName === displayName
	);
};

const isStepItem = (child: ReactNode): child is ReactElement<StepItemProps> =>
	hasDisplayName<StepItemProps>(child, "StepItem");

const isStepLink = (child: ReactNode): child is ReactElement<StepLinkProps> =>
	hasDisplayName<StepLinkProps>(child, "StepLink");

const StepperComponent: FC<StepperProps> = memo(({ children, activeKey, onSelect, className }) => {
	const steps = useMemo(() => {
		const stepItems = Array.isArray(children) ? children : [children];

		return stepItems
			.filter(isStepItem)
			.map((child) => {
				const stepLink = child.props.children;
				if (isStepLink(stepLink)) {
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
