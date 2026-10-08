import { Button } from "../../components/Button/Button";
import { Chip } from "../../components/Chip/Chip";
import type { ChipState, ChipVariant } from "../../components/Chip/Chip.interface";
import type React from "react";
import styles from "./SampleCard.module.css";

type IconComponent = React.ElementType;
type CardLayout = "vertical" | "horizontal";
type ImageVariant = "square" | "circle";
type ButtonLayout = "full" | "inline" | "stacked";
type ButtonAlign = "left" | "right" | "full";
type ActionSize = "sm" | "md" | "lg";
type IconPosition = "left" | "right";

const ASPECT_RATIO_CLASS_MAP: Record<string, string> = {
	"348/242": styles.aspect348x242,
	"675/242": styles.aspect675x242,
	"800/400": styles.aspect800x400,
	"16/9": styles.aspect16x9,
};

const ACTION_ICON_SIZE_MAP: Record<ActionSize, number> = {
	sm: 16,
	md: 20,
	lg: 24,
};

const joinClasses = (...classNames: Array<string | false | undefined>) =>
	classNames.filter(Boolean).join(" ");

type SampleCardTag = {
	label: string;
	variant?: ChipVariant;
	state?: ChipState;
	pill?: boolean;
};

type SampleCardProps = {
	title: string;
	subtitle: string;
	titleOnly?: boolean;
	imageSrc?: string;
	imageVariant?: ImageVariant;
	imageAspectRatio?: string;
	layout?: CardLayout;
	tags?: ReadonlyArray<SampleCardTag>;
	buttonLayout?: ButtonLayout;
	buttonAlign?: ButtonAlign;
	primaryActionLabel?: string;
	onPrimaryAction?: () => void;
	secondaryActionLabel?: string;
	onSecondaryAction?: () => void;
	secondaryActionIcon?: IconComponent;
	secondaryActionIconPosition?: IconPosition;
	primaryActionIconLeft?: IconComponent;
	primaryActionIconRight?: IconComponent;
	actionIcon?: IconComponent;
	onActionClick?: () => void;
	actionAriaLabel?: string;
	actionSize?: ActionSize;
};

export const SampleCard = ({
	title,
	subtitle,
	titleOnly = false,
	imageSrc,
	imageVariant = "square",
	imageAspectRatio = "348/242",
	layout = "vertical",
	tags,
	buttonLayout = "full",
	buttonAlign = "full",
	primaryActionLabel = "Primary action",
	onPrimaryAction,
	secondaryActionLabel,
	onSecondaryAction,
	secondaryActionIcon,
	secondaryActionIconPosition = "right",
	primaryActionIconLeft,
	primaryActionIconRight,
	actionIcon: ActionIcon,
	onActionClick,
	actionAriaLabel = "Card action",
	actionSize = "md",
}: SampleCardProps) => {
	const effectiveLayout: CardLayout = titleOnly ? "horizontal" : layout;
	const isHorizontal = effectiveLayout === "horizontal";
	const effectiveImageVariant: ImageVariant = titleOnly ? "circle" : imageVariant;
	const useCircleImage = isHorizontal && effectiveImageVariant === "circle";
	const hideContentDetails = isHorizontal && titleOnly;

	const actionIconSize = ACTION_ICON_SIZE_MAP[actionSize];
	const aspectClass = ASPECT_RATIO_CLASS_MAP[imageAspectRatio] ?? styles.aspect348x242;
	const hasAction = Boolean(ActionIcon && onActionClick);
	const hasSecondaryButton = Boolean(secondaryActionLabel);
	const isFullButtons = buttonLayout === "full";
	const isStackedButtons = buttonLayout === "stacked";
	const isFullAligned = buttonAlign === "full";
	const buttonRowAlignClass =
		buttonAlign === "right"
			? styles.buttonRowAlignRight
			: buttonAlign === "left"
				? styles.buttonRowAlignLeft
				: styles.buttonRowAlignFull;

	const renderActionButton = () => {
		if (!ActionIcon || !onActionClick) return null;

		return (
			<Button
				variant="text"
				circle
				size={actionSize}
				iconLeft={(iconProps: { size?: number; weight?: string; className?: string }) => (
					<ActionIcon {...iconProps} size={actionIconSize} />
				)}
				onClick={onActionClick}
				aria-label={actionAriaLabel}
			/>
		);
	};

	return (
		<div className={joinClasses(styles.card, isHorizontal && styles.cardHorizontal)}>
			<div
				className={joinClasses(
					styles.mediaColumn,
					isHorizontal && styles.mediaColumnHorizontal,
					!isHorizontal && hasAction && styles.mediaColumnWithTopAction,
				)}
			>
				{!isHorizontal && hasAction ? (
					<div className={styles.actionTopRight}>{renderActionButton()}</div>
				) : null}
				<div
					className={joinClasses(
						styles.media,
						useCircleImage ? styles.mediaCircle : undefined,
						!useCircleImage && isHorizontal ? styles.mediaHorizontal : undefined,
						!useCircleImage && !isHorizontal ? aspectClass : undefined,
					)}
				>
					<img
						className={joinClasses(styles.image, useCircleImage && styles.imageCircle)}
						src={imageSrc || "https://placehold.co/800x600"}
						alt={title}
					/>
				</div>
			</div>
			<div className={joinClasses(styles.content, isHorizontal && styles.contentHorizontal)}>
				<div className={styles.textGroup}>
					<div className={styles.titleRow}>
						<h3 className={styles.title}>{title}</h3>
					</div>
					{!hideContentDetails && tags?.length ? (
						<div className={styles.chipsRow}>
							{tags.map((tag, index) => (
								<Chip
									key={`${tag.label}-${index}`}
									variant={tag.variant ?? "primary"}
									state={tag.state ?? "default"}
									pill={tag.pill}
								>
									{tag.label}
								</Chip>
							))}
						</div>
					) : null}
					{!hideContentDetails && subtitle.length > 0 ? (
						<p className={styles.description}>{subtitle}</p>
					) : null}
				</div>
				{!hideContentDetails ? (
					<div className={joinClasses(styles.buttonRow, buttonRowAlignClass)}>
						<div
							className={joinClasses(
								styles.buttonGroup,
								(isFullButtons || isFullAligned || isStackedButtons) && styles.buttonGroupFull,
								isStackedButtons && styles.buttonGroupStacked,
							)}
						>
							{hasSecondaryButton ? (
								<Button
									variant="secondary"
									onClick={onSecondaryAction}
									iconLeft={
										secondaryActionIconPosition === "left" ? secondaryActionIcon : undefined
									}
									iconRight={
										secondaryActionIconPosition === "right" ? secondaryActionIcon : undefined
									}
									className={joinClasses(
										(isFullButtons || isFullAligned) && styles.buttonItemFull,
										isStackedButtons && styles.buttonFullWidth,
									)}
								>
									{secondaryActionLabel}
								</Button>
							) : null}
							<Button
								variant="primary"
								onClick={onPrimaryAction}
								iconLeft={primaryActionIconLeft}
								iconRight={primaryActionIconRight}
								className={
									isFullButtons || isFullAligned
										? hasSecondaryButton
											? styles.buttonItemFull
											: styles.buttonFullWidth
										: isStackedButtons
											? styles.buttonFullWidth
											: undefined
								}
							>
								{primaryActionLabel}
							</Button>
						</div>
					</div>
				) : null}
			</div>
			{isHorizontal && hasAction ? (
				<div className={joinClasses(styles.actionContainer, styles.actionContainerHorizontal)}>
					{renderActionButton()}
				</div>
			) : null}
		</div>
	);
};
