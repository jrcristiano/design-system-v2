import React from "react";
import { Chip } from "../Chip/Chip";
import { Button } from "../Button/Button";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import type { ComplexCardProps, ICardProps, SimpleCardProps } from "./Card.interface";
import "./Card.inline.css";
import clsx from "clsx";

// Simple Card Component
const SimpleCard: React.FC<SimpleCardProps & { className?: string }> = ({
	title,
	label,
	chipLabel,
	showLeftBorder = true,
	leftBorderColor = "var(--ds-color-blue-40, #017DA2)",
	className,
	style,
	...rest
}) => {
	const titleId = React.useId();
	const cardStyle =
		style ?? ({ "--card-left-border-color": leftBorderColor } as React.CSSProperties);

	return (
		<article
			style={cardStyle}
			className={clsx(
				className,
				!style && "card-simple-root",
				!style && showLeftBorder && "card-simple-root--with-left-border",
			)}
			aria-labelledby={titleId}
			{...rest}
		>
			<div className="card-inline-1">
				{/* Title and optional Chip Section */}
				<div className="card-inline-2">
					{chipLabel ? (
						<div className="card-inline-3">
							<h2 id={titleId} className="card-simple-title card-simple-title--with-chip">
								{title}
							</h2>
							<div className="card-inline-4">
								<div className="card-inline-5" aria-hidden="true">
									<div className="card-simple-dot" />
								</div>
								<Chip variant="primary" state="default" className="card-chip-label">
									{chipLabel}
								</Chip>
							</div>
						</div>
					) : (
						<h2 id={titleId} className="card-simple-title">
							{title}
						</h2>
					)}
				</div>

				{/* Label Section */}
				<div className="card-label-container">
					<div className="card-inline-6" aria-hidden="true">
						<div className="card-simple-dot" />
					</div>
					<span className="card-label-text">{label}</span>
				</div>
			</div>
		</article>
	);
};

// Complex Card Component (Type 1 & 2)
const ComplexCard: React.FC<ComplexCardProps & { className?: string }> = ({
	variant,
	title,
	chipLabel,
	subtitle,
	progress,
	progressIcon,
	primaryButtonText,
	onPrimaryButtonClick,
	secondaryButtonText,
	onSecondaryButtonClick,
	className,
	...rest
}) => {
	const titleId = React.useId();
	const isType2 = variant === "type2";

	return (
		<article className={clsx(className, "card-complex-root")} aria-labelledby={titleId} {...rest}>
			<div className="card-inline-8">
				{/* Title and Chip Section */}
				<div className="card-inline-9">
					<div className="card-inline-10">
						<div className="card-inline-11">
							<h2 id={titleId} className="card-inline-12">
								{title}
							</h2>
						</div>
						<div className="card-inline-13">
							<div className="card-inline-14" aria-hidden="true">
								<div className="card-simple-dot" />
							</div>
							<Chip variant="primary" state="default" className="card-chip-label">
								{chipLabel}
							</Chip>
						</div>
					</div>

					{/* Subtitle */}
					<div className="card-inline-15">
						<div className="card-inline-16" aria-hidden="true">
							<div className="card-simple-dot" />
						</div>
						<span className="card-inline-17">{subtitle}</span>
					</div>
				</div>

				{/* Progress Section */}
				<div className="card-inline-18">
					<div className="card-inline-19">
						<div className="card-inline-20" aria-hidden="true">
							<div className="card-simple-dot" />
						</div>
						<span className="card-inline-21">{progress}%</span>
					</div>
					<div className="card-inline-22">
						{progressIcon && (
							<div className="card-inline-23" aria-hidden="true">
								{React.createElement(progressIcon, { size: 18 })}
							</div>
						)}
						<div className="card-inline-24">
							<ProgressBar progress={progress} variant="primary" status="in-progress" fileName="" />
						</div>
					</div>
				</div>

				{/* Buttons Section */}
				{isType2 && secondaryButtonText ? (
					<div className="card-inline-25">
						<Button
							variant="secondary"
							size="md"
							onClick={onSecondaryButtonClick}
							className="card-action-button"
						>
							{secondaryButtonText}
						</Button>
						<Button
							variant="primary"
							size="md"
							onClick={onPrimaryButtonClick}
							className="card-action-button"
						>
							{primaryButtonText}
						</Button>
					</div>
				) : (
					<Button
						variant="primary"
						size="md"
						onClick={onPrimaryButtonClick}
						className="card-action-button card-action-button--full"
					>
						{primaryButtonText}
					</Button>
				)}
			</div>
		</article>
	);
};

// Main Card Component with type discrimination
export const Card: React.FC<ICardProps> = (props) => {
	const variant = props.variant || "simple";

	if (variant === "simple") {
		return <SimpleCard {...(props as SimpleCardProps)} variant="simple" />;
	}

	if (variant === "type1" || variant === "type2") {
		const complexProps = props as ComplexCardProps;
		return <ComplexCard {...complexProps} />;
	}

	// Fallback to simple
	return <SimpleCard {...(props as SimpleCardProps)} variant="simple" />;
};

Card.displayName = "Card";
