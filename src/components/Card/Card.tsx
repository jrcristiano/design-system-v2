import React from "react";
import { Chip } from "../Chip/Chip";
import { Button } from "../Button/Button";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import type { ComplexCardProps, ICardProps, SimpleCardProps } from "./Card.interface";

// Simple Card Component
const SimpleCard: React.FC<SimpleCardProps & { className?: string }> = ({
	title,
	label,
	chipLabel,
	showLeftBorder = true,
	leftBorderColor = "var(--ds-color-blue-40, #017DA2)",
	className,
	...rest
}) => {
	const titleId = React.useId();
	const baseStyles: React.CSSProperties = {
		paddingLeft: "16px",
		paddingRight: "16px",
		paddingTop: "24px",
		paddingBottom: "24px",
		background: "var(--ds-color-neutral-white, white)",
		boxShadow: "0px 4px 25px rgba(0, 0, 0, 0.20)",
		borderRadius: "8px",
		...(showLeftBorder && {
			borderLeft: `10px solid ${leftBorderColor}`,
		}),
	};

	const titleStyles: React.CSSProperties = {
		color: "var(--ds-color-neutral-10, #17191C)",
		fontSize: "24px",
		fontFamily: "var(--ds-font-family-poppins, Poppins)",
		fontWeight: "600",
		lineHeight: "30px",
		wordWrap: "break-word",
		margin: 0,
	};

	const labelContainerStyles: React.CSSProperties = {
		paddingLeft: "24px",
		paddingRight: "24px",
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		gap: "8px",
		marginTop: "8px",
	};

	const dotStyles: React.CSSProperties = {
		width: "5px",
		height: "5px",
		background: "var(--ds-color-neutral-10, #17191C)",
		borderRadius: "50%",
		flexShrink: 0,
	};

	const labelTextStyles: React.CSSProperties = {
		color: "black",
		fontSize: "14px",
		fontFamily: "var(--ds-font-family-poppins, Poppins)",
		fontWeight: "500",
		lineHeight: "20px",
		wordWrap: "break-word",
	};

	return (
		<article style={baseStyles} className={className} aria-labelledby={titleId} {...rest}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "flex-start",
					gap: "8px",
				}}
			>
				{/* Title and optional Chip Section */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-start",
						alignItems: "flex-start",
						gap: "8px",
						alignSelf: "stretch",
					}}
				>
					{chipLabel ? (
						<div
							style={{
								alignSelf: "stretch",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								gap: "8px",
							}}
						>
							<h2 id={titleId} style={{ ...titleStyles, flex: 1, minWidth: 0 }}>
								{title}
							</h2>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									flexShrink: 0,
									gap: "8px",
								}}
							>
								<div
									style={{
										width: "24px",
										height: "24px",
										position: "relative",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexShrink: 0,
									}}
									aria-hidden="true"
								>
									<div style={dotStyles} />
								</div>
								<Chip
									variant="primary"
									state="default"
									style={{
										fontSize: "12px",
										fontFamily: "Poppins",
										fontWeight: "700",
										lineHeight: "18px",
									}}
								>
									{chipLabel}
								</Chip>
							</div>
						</div>
					) : (
						<h2 id={titleId} style={titleStyles}>
							{title}
						</h2>
					)}
				</div>

				{/* Label Section */}
				<div style={labelContainerStyles}>
					<div
						style={{
							width: "40px",
							height: "40px",
							position: "relative",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
						aria-hidden="true"
					>
						<div style={dotStyles} />
					</div>
					<span style={labelTextStyles}>{label}</span>
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

	const dotStyles: React.CSSProperties = {
		width: "5px",
		height: "5px",
		background: "var(--ds-color-neutral-10, #17191C)",
		borderRadius: "50%",
		flexShrink: 0,
	};

	return (
		<article
			style={{
				minWidth: "240px",
				paddingLeft: "16px",
				paddingRight: "16px",
				paddingTop: "24px",
				paddingBottom: "24px",
				background: "var(--ds-color-neutral-white, white)",
				borderRadius: "8px",
				outline: "2px solid var(--ds-color-neutral-60, #737D8C)",
				outlineOffset: "-2px",
				display: "inline-flex",
				justifyContent: "flex-start",
				alignItems: "center",
				gap: "12px",
				flexWrap: "wrap",
			}}
			className={className}
			aria-labelledby={titleId}
			{...rest}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-start",
					alignItems: "center",
					gap: "16px",
					alignSelf: "stretch",
					minWidth: "160px",
				}}
			>
				{/* Title and Chip Section */}
				<div
					style={{
						width: "335px",
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-start",
						alignItems: "flex-start",
						gap: "8px",
					}}
				>
					<div
						style={{
							alignSelf: "stretch",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "flex-start",
								alignItems: "center",
								gap: "8px",
								flex: 1,
								minWidth: 0,
							}}
						>
							<h2
								id={titleId}
								style={{
									color: "var(--ds-color-neutral-10, #17191C)",
									fontSize: "24px",
									fontFamily: "var(--ds-font-family-poppins, Poppins)",
									fontWeight: "600",
									lineHeight: "30px",
									wordWrap: "break-word",
									margin: 0,
								}}
							>
								{title}
							</h2>
						</div>
						<div
							style={{
								minWidth: "111px",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								flexShrink: 0,
								gap: "8px",
							}}
						>
							<div
								style={{
									width: "24px",
									height: "24px",
									position: "relative",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									flexShrink: 0,
								}}
								aria-hidden="true"
							>
								<div style={dotStyles} />
							</div>
							<Chip
								variant="primary"
								state="default"
								style={{
									fontSize: "12px",
									fontFamily: "Poppins",
									fontWeight: "700",
									lineHeight: "18px",
								}}
							>
								{chipLabel}
							</Chip>
						</div>
					</div>

					{/* Subtitle */}
					<div
						style={{
							display: "flex",
							justifyContent: "flex-start",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<div
							style={{
								width: "12px",
								height: "12px",
								position: "relative",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
							}}
							aria-hidden="true"
						>
							<div style={{ ...dotStyles, width: "5px", height: "5px" }} />
						</div>
						<span
							style={{
								color: "var(--ds-color-neutral-30, #454B54)",
								fontSize: "16px",
								fontFamily: "var(--ds-font-family-poppins, Poppins)",
								fontWeight: "700",
								lineHeight: "24px",
								wordWrap: "break-word",
								whiteSpace: "nowrap",
							}}
						>
							{subtitle}
						</span>
					</div>
				</div>

				{/* Progress Section */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-start",
						alignItems: "flex-start",
						gap: "8px",
					}}
				>
					<div
						style={{
							display: "inline-flex",
							justifyContent: "flex-start",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<div
							style={{
								width: "16px",
								height: "16px",
								position: "relative",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
							aria-hidden="true"
						>
							<div style={{ ...dotStyles, width: "5px", height: "5px" }} />
						</div>
						<span
							style={{
								color: "black",
								fontSize: "14px",
								fontFamily: "var(--ds-font-family-poppins, Poppins)",
								fontWeight: "500",
								lineHeight: "20px",
								wordWrap: "break-word",
							}}
						>
							{progress}%
						</span>
					</div>
					<div
						style={{
							display: "inline-flex",
							justifyContent: "center",
							alignItems: "center",
							gap: "16px",
						}}
					>
						{progressIcon && (
							<div
								style={{
									width: "24px",
									height: "24px",
									position: "relative",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
								aria-hidden="true"
							>
								{React.createElement(progressIcon, { size: 18 })}
							</div>
						)}
						<div
							style={{
								width: "297px",
								display: "flex",
								justifyContent: "flex-start",
								alignItems: "center",
								gap: "8px",
							}}
						>
							<ProgressBar progress={progress} variant="primary" status="in-progress" fileName="" />
						</div>
					</div>
				</div>

				{/* Buttons Section */}
				{isType2 && secondaryButtonText ? (
					<div
						style={{
							display: "inline-flex",
							justifyContent: "flex-start",
							alignItems: "flex-start",
							gap: "16px",
						}}
					>
						<Button
							variant="secondary"
							size="md"
							onClick={onSecondaryButtonClick}
							style={{
								height: "40px",
								paddingLeft: "16px",
								paddingRight: "16px",
								paddingTop: "12px",
								paddingBottom: "12px",
								borderRadius: "24px",
							}}
						>
							{secondaryButtonText}
						</Button>
						<Button
							variant="primary"
							size="md"
							onClick={onPrimaryButtonClick}
							style={{
								height: "40px",
								paddingLeft: "16px",
								paddingRight: "16px",
								paddingTop: "12px",
								paddingBottom: "12px",
								borderRadius: "24px",
							}}
						>
							{primaryButtonText}
						</Button>
					</div>
				) : (
					<Button
						variant="primary"
						size="md"
						onClick={onPrimaryButtonClick}
						style={{
							width: "250px",
							height: "44px",
							paddingLeft: "16px",
							paddingRight: "16px",
							paddingTop: "12px",
							paddingBottom: "12px",
							borderRadius: "24px",
						}}
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
