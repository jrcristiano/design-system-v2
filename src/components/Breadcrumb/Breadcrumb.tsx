import React, { type FC, type ReactNode, useMemo } from "react";
import type { BreadcrumbItem, BreadcrumbProps } from "./Breadcrumb.interface";
import "./Breadcrumb.inline.css";
import clsx from "clsx";

const responsiveTokens = {
	typography: {
		mobile: "text-sm leading-5",
		desktop: "text-base leading-6",
	},
	spacing: {
		mobile: "gap-0.5",
		desktop: "gap-1",
	},
	container: {
		mobile: "px-2 py-1",
		desktop: "px-3 py-2",
	},
} as const;

// Memoriza classes para performance
const useInteractiveClasses = () =>
	useMemo(
		() => `
	flex items-center gap-1 transition-all duration-200
	${responsiveTokens.typography.mobile}
	md:${responsiveTokens.typography.desktop}
	text-[var(--ds-color-blue-40)] hover:text-[var(--ds-color-blue-20)]
	focus:text-[var(--ds-color-blue-20)] focus:outline-none
	focus:ring-2 focus:ring-[var(--ds-color-focus-ring)] focus:ring-offset-1
	active:text-[var(--ds-color-blue-10)] disabled:text-[var(--ds-color-neutral-40)]
	disabled:cursor-not-allowed truncate
	${responsiveTokens.container.mobile}
	md:${responsiveTokens.container.desktop}
	rounded-lg hover:bg-[var(--ds-color-blue-95)] focus:bg-[var(--ds-color-blue-95)]
`,
		[],
	);

// Componentes puros memorizados
const BreadcrumbSeparator: FC<{
	readonly separator: ReactNode;
	readonly separatorColor: string;
}> = React.memo(({ separator, separatorColor }) => (
	<span
		aria-hidden="true"
		className={`
		mx-1 sm:mx-2 shrink-0
		${separatorColor}
		${responsiveTokens.typography.mobile}
		md:${responsiveTokens.typography.desktop}
	`}
	>
		{separator}
	</span>
));

const BreadcrumbContent: FC<{
	readonly label: string;
	readonly iconLeft?: ReactNode;
	readonly iconRight?: ReactNode;
	readonly iconColor: string;
}> = React.memo(({ label, iconLeft, iconRight, iconColor }) => (
	<>
		{iconLeft && (
			<span className="shrink-0" style={{ color: iconColor }} aria-hidden="true">
				{iconLeft}
			</span>
		)}
		<span className="truncate max-w-[120px] sm:max-w-[160px] md:max-w-[200px]">{label}</span>
		{iconRight && (
			<span className="shrink-0" style={{ color: iconColor }} aria-hidden="true">
				{iconRight}
			</span>
		)}
	</>
));

const BreadcrumbItemComponent: FC<{
	readonly item: BreadcrumbItem;
	readonly isLast: boolean;
	readonly separator: ReactNode;
	readonly separatorColor: string;
	readonly iconLeft?: ReactNode;
	readonly iconRight?: ReactNode;
	readonly iconColor: string;
}> = React.memo(({ item, isLast, separator, separatorColor, iconLeft, iconRight, iconColor }) => {
	const interactiveClasses = useInteractiveClasses();

	const content = (
		<BreadcrumbContent
			label={item.label}
			iconLeft={iconLeft}
			iconRight={iconRight}
			iconColor={iconColor}
		/>
	);

	// Simplificação do ternário aninhado
	let element: ReactNode;
	if (!isLast && item.href) {
		element = (
			<a
				href={item.href}
				className={interactiveClasses}
				aria-label={item.ariaLabel ?? `Navigate to ${item.label}`}
			>
				{content}
			</a>
		);
	} else if (!isLast && item.onClick) {
		element = (
			<button
				type="button"
				onClick={item.onClick}
				className={interactiveClasses}
				aria-label={item.ariaLabel ?? `Navigate to ${item.label}`}
			>
				{content}
			</button>
		);
	} else {
		element = (
			<span
				aria-current="page"
				className={clsx(
					`
					flex items-center gap-1
					${responsiveTokens.typography.mobile}
					md:${responsiveTokens.typography.desktop}
					text-[var(--ds-color-neutral-10)] truncate
				`,
					"breadcrumb-inline-1",
				)}
			>
				{content}
			</span>
		);
	}

	return (
		<li className="flex items-center">
			{element}
			{!isLast && <BreadcrumbSeparator separator={separator} separatorColor={separatorColor} />}
		</li>
	);
});

export const Breadcrumb: FC<Readonly<BreadcrumbProps>> = ({
	items,
	separator = "/",
	separatorColor = "text-[var(--ds-color-neutral-40)]",
	iconLeft,
	iconRight,
	iconColor = "currentColor",
	className = "",
	ariaLabel = "Breadcrumb navigation",
}) => (
	<nav className={className} aria-label={ariaLabel}>
		<ol
			className={`
				flex items-center flex-wrap
				${responsiveTokens.spacing.mobile}
				md:${responsiveTokens.spacing.desktop}
				w-full min-h-[32px] md:min-h-[40px]
			`}
		>
			{items.map((item, index) => (
				<BreadcrumbItemComponent
					key={item.id ?? item.label}
					item={item}
					isLast={index === items.length - 1}
					separator={separator}
					separatorColor={separatorColor}
					iconLeft={iconLeft}
					iconRight={iconRight}
					iconColor={iconColor}
				/>
			))}
		</ol>
	</nav>
);

export default Breadcrumb;
