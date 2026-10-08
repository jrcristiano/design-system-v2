import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { CaretLeftIcon, CaretRightIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";
import type { CarouselProps } from "./Carousel.types";
import "./Carousel.css";

const EMPTY_ITEMS: CarouselProps["items"] = [];
const DEFAULT_ITEMS_PER_VIEW = { mobile: 1, tablet: 2, desktop: 3 } as const;
const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;
const DEFAULT_AUTOPLAY_INTERVAL = 3000;
const DEFAULT_GAP = 40;
const SWIPE_THRESHOLD = 50;
const SWIPE_AXIS_THRESHOLD = 8;
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const normalizeCount = (value: number | undefined, fallback: number): number => {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return fallback;
	return Math.max(1, Math.floor(value));
};

const normalizeGap = (value: number | undefined): number => {
	if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_GAP;
	return Math.max(0, value);
};

const normalizeInterval = (value: number | undefined): number => {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
		return DEFAULT_AUTOPLAY_INTERVAL;
	}
	return value;
};

const getItemsPerView = (width: number, itemsPerView: CarouselProps["itemsPerView"]): number => {
	if (width < TABLET_BREAKPOINT) {
		return normalizeCount(itemsPerView?.mobile, DEFAULT_ITEMS_PER_VIEW.mobile);
	}
	if (width < DESKTOP_BREAKPOINT) {
		return normalizeCount(itemsPerView?.tablet, DEFAULT_ITEMS_PER_VIEW.tablet);
	}
	return normalizeCount(itemsPerView?.desktop, DEFAULT_ITEMS_PER_VIEW.desktop);
};

const clamp = (index: number, maxIndex: number): number => Math.max(0, Math.min(index, maxIndex));

const isEditableTarget = (target: EventTarget | null): boolean => {
	if (!(target instanceof HTMLElement)) return false;
	return Boolean(
		target.closest(
			"input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox'], [role='combobox'], [role='listbox'], [role='slider'], [role='spinbutton'], [role='menuitem']",
		),
	);
};

const isInteractiveTarget = (target: EventTarget | null): boolean => {
	if (!(target instanceof HTMLElement)) return false;
	return Boolean(
		target.closest(
			"input, textarea, select, button, a[href], [contenteditable]:not([contenteditable='false']), [role='button'], [role='link'], [role='slider'], [role='spinbutton'], [role='menuitem']",
		),
	);
};

const isCarouselNavigationControl = (target: EventTarget | null): boolean => {
	if (!(target instanceof HTMLElement)) return false;
	return Boolean(target.closest(".carousel-arrow, .carousel-dot, .carousel-rotation-control"));
};

interface PointerGesture {
	pointerId: number;
	startX: number;
	startY: number;
	lockedAxis: "horizontal" | "vertical" | null;
}

export const Carousel = ({
	items,
	showArrows = true,
	showDots = true,
	autoplay = false,
	autoplayInterval = DEFAULT_AUTOPLAY_INTERVAL,
	itemsPerView = DEFAULT_ITEMS_PER_VIEW,
	gap = DEFAULT_GAP,
	onSlideChange,
	className,
	enableKeyboard = true,
	enableSwipe = true,
	ariaLabel = "Carrossel de conteúdo",
	pauseOnInteraction = true,
	loop = true,
}: CarouselProps) => {
	const safeItems = items ?? EMPTY_ITEMS;
	const safeGap = normalizeGap(gap);
	const safeAutoplayInterval = normalizeInterval(autoplayInterval);
	const [currentIndexState, setCurrentIndexState] = useState(0);
	const [containerWidth, setContainerWidth] = useState(0);
	const [isHovered, setIsHovered] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [resumeWhileFocused, setResumeWhileFocused] = useState(false);
	const [isPausedByUser, setIsPausedByUser] = useState(false);
	const [isDocumentVisible, setIsDocumentVisible] = useState(
		() => typeof document === "undefined" || document.visibilityState !== "hidden",
	);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	const containerRef = useRef<HTMLElement>(null);
	const currentIndexRef = useRef(0);
	const onSlideChangeRef = useRef(onSlideChange);
	const gestureRef = useRef<PointerGesture | null>(null);
	const suppressClickRef = useRef(false);
	const suppressClickTimerRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);
	onSlideChangeRef.current = onSlideChange;

	const requestedItemsPerView = getItemsPerView(containerWidth, itemsPerView);
	const visibleItems = Math.max(1, Math.min(requestedItemsPerView, Math.max(1, safeItems.length)));
	const maxIndex = Math.max(0, safeItems.length - visibleItems);
	const currentIndex = clamp(currentIndexState, maxIndex);
	const totalPages = safeItems.length === 0 ? 0 : Math.ceil(safeItems.length / visibleItems);
	const pageStartIndices = Array.from({ length: totalPages }, (_, index) =>
		index === totalPages - 1 ? maxIndex : index * visibleItems,
	);
	const canMove = maxIndex > 0;
	const canGoPrev = canMove && (loop || currentIndex > 0);
	const canGoNext = canMove && (loop || currentIndex < maxIndex);
	const autoRotationAvailable = autoplay && canMove;
	const hasFocusableNavigation =
		(showArrows && canMove) ||
		(showDots && totalPages > 1) ||
		(autoRotationAvailable && !prefersReducedMotion);
	const focusPausesRotation = isFocused && !resumeWhileFocused;
	const isPaused =
		isPausedByUser ||
		!isDocumentVisible ||
		prefersReducedMotion ||
		(pauseOnInteraction && (isHovered || focusPausesRotation));
	const isAutoRotating = autoRotationAvailable && !isPaused;

	useIsomorphicLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const updateWidth = (width: number) => {
			if (width > 0 && Number.isFinite(width)) setContainerWidth(width);
		};
		const measure = () =>
			updateWidth(container.getBoundingClientRect().width || globalThis.window?.innerWidth || 0);
		measure();

		if (typeof ResizeObserver !== "undefined") {
			const observer = new ResizeObserver((entries) => {
				const entry = entries.find(({ target }) => target === container);
				if (entry) updateWidth(entry.contentRect.width);
			});
			observer.observe(container);
			return () => observer.disconnect();
		}

		globalThis.window?.addEventListener("resize", measure);
		return () => globalThis.window?.removeEventListener("resize", measure);
	}, []);

	useIsomorphicLayoutEffect(() => {
		if (currentIndexState === currentIndex) return;
		currentIndexRef.current = currentIndex;
		setCurrentIndexState(currentIndex);
		onSlideChangeRef.current?.(currentIndex);
	}, [currentIndex, currentIndexState]);

	useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
		updatePreference();
		mediaQuery.addEventListener?.("change", updatePreference);
		return () => mediaQuery.removeEventListener?.("change", updatePreference);
	}, []);

	useEffect(() => {
		if (typeof document === "undefined") return;
		const updateVisibility = () => setIsDocumentVisible(document.visibilityState !== "hidden");
		document.addEventListener("visibilitychange", updateVisibility);
		return () => document.removeEventListener("visibilitychange", updateVisibility);
	}, []);

	const navigateTo = useCallback(
		(index: number) => {
			if (!Number.isFinite(index) || maxIndex === 0) return;

			let nextIndex: number;
			if (loop && index < 0) nextIndex = maxIndex;
			else if (loop && index > maxIndex) nextIndex = 0;
			else nextIndex = clamp(Math.trunc(index), maxIndex);

			if (nextIndex === currentIndexRef.current) return;
			currentIndexRef.current = nextIndex;
			setCurrentIndexState(nextIndex);
			onSlideChangeRef.current?.(nextIndex);
		},
		[loop, maxIndex],
	);

	const moveBy = useCallback(
		(amount: number) => navigateTo(clamp(currentIndexRef.current, maxIndex) + amount),
		[maxIndex, navigateTo],
	);

	useEffect(() => {
		if (!isAutoRotating || (!loop && currentIndex >= maxIndex)) return;

		const timer = globalThis.setTimeout(() => moveBy(1), safeAutoplayInterval);
		return () => globalThis.clearTimeout(timer);
	}, [currentIndex, isAutoRotating, loop, maxIndex, moveBy, safeAutoplayInterval]);

	const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (
			!enableKeyboard ||
			event.defaultPrevented ||
			event.altKey ||
			event.ctrlKey ||
			event.metaKey ||
			event.shiftKey
		) {
			return;
		}
		if (isEditableTarget(event.target)) return;
		if (!isCarouselNavigationControl(event.target) && isInteractiveTarget(event.target)) return;

		if (event.key === "ArrowLeft" && canGoPrev) {
			event.preventDefault();
			moveBy(-1);
		} else if (event.key === "ArrowRight" && canGoNext) {
			event.preventDefault();
			moveBy(1);
		} else if (
			event.key === "Home" &&
			(event.target === event.currentTarget || isCarouselNavigationControl(event.target)) &&
			currentIndex > 0
		) {
			event.preventDefault();
			navigateTo(0);
		} else if (
			event.key === "End" &&
			(event.target === event.currentTarget || isCarouselNavigationControl(event.target)) &&
			currentIndex < maxIndex
		) {
			event.preventDefault();
			navigateTo(maxIndex);
		}
	};

	const handleFocus = () => {
		setIsFocused(true);
		setResumeWhileFocused(false);
	};

	const handleBlur = (event: FocusEvent<HTMLElement>) => {
		if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
		setIsFocused(false);
		setResumeWhileFocused(false);
	};

	const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
		gestureRef.current = null;
		if (!enableSwipe || !event.isPrimary || event.button !== 0 || isInteractiveTarget(event.target))
			return;

		gestureRef.current = {
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			lockedAxis: null,
		};
		event.currentTarget.setPointerCapture?.(event.pointerId);
	};

	const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
		const gesture = gestureRef.current;
		if (!enableSwipe || !gesture || gesture.pointerId !== event.pointerId) return;

		const deltaX = event.clientX - gesture.startX;
		const deltaY = event.clientY - gesture.startY;
		if (
			gesture.lockedAxis === null &&
			Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= SWIPE_AXIS_THRESHOLD
		) {
			gesture.lockedAxis = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
		}
	};

	const finishPointerGesture = (event: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
		const gesture = gestureRef.current;
		gestureRef.current = null;
		if (
			!gesture ||
			gesture.pointerId !== event.pointerId ||
			cancelled ||
			gesture.lockedAxis !== "horizontal"
		) {
			return;
		}

		const deltaX = gesture.startX - event.clientX;
		if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

		suppressClickRef.current = true;
		if (suppressClickTimerRef.current !== null)
			globalThis.clearTimeout(suppressClickTimerRef.current);
		suppressClickTimerRef.current = globalThis.setTimeout(() => {
			suppressClickRef.current = false;
			suppressClickTimerRef.current = null;
		}, 0);
		moveBy(deltaX > 0 ? 1 : -1);
	};

	const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
		if (!suppressClickRef.current) return;
		suppressClickRef.current = false;
		if (suppressClickTimerRef.current !== null) {
			globalThis.clearTimeout(suppressClickTimerRef.current);
			suppressClickTimerRef.current = null;
		}
		event.preventDefault();
		event.stopPropagation();
	};

	const handleRotationToggle = () => {
		if (isPausedByUser) {
			setIsPausedByUser(false);
			setResumeWhileFocused(true);
		} else {
			setIsPausedByUser(true);
			setResumeWhileFocused(false);
		}
	};

	const trackOffset = currentIndex * (100 / visibleItems);
	const trackGapOffset = (currentIndex * safeGap) / visibleItems;
	const itemWidth =
		visibleItems === 1 || safeGap === 0
			? `${100 / visibleItems}%`
			: `calc(${100 / visibleItems}% - ${(safeGap * (visibleItems - 1)) / visibleItems}px)`;

	return (
		<section
			ref={containerRef}
			className={clsx("carousel-container", className)}
			role="region"
			aria-label={ariaLabel}
			aria-roledescription="carrossel"
			aria-keyshortcuts={enableKeyboard ? "ArrowLeft ArrowRight Home End" : undefined}
			tabIndex={enableKeyboard && canMove && !hasFocusableNavigation ? 0 : undefined}
			onKeyDown={handleKeyDown}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onFocusCapture={handleFocus}
			onBlurCapture={handleBlur}
		>
			{autoRotationAvailable && (
				<div className="carousel-rotation-control-row">
					<button
						type="button"
						className="carousel-rotation-control"
						onClick={handleRotationToggle}
						disabled={prefersReducedMotion}
						aria-label={
							prefersReducedMotion
								? "Rotação automática desativada pela preferência de movimento reduzido"
								: isPausedByUser
									? "Retomar rotação automática"
									: "Pausar rotação automática"
						}
					>
						{isPausedByUser ? (
							<PlayIcon size={18} weight="bold" aria-hidden="true" />
						) : (
							<PauseIcon size={18} weight="bold" aria-hidden="true" />
						)}
					</button>
				</div>
			)}

			<div className="carousel-wrapper">
				{showArrows && (
					<button
						type="button"
						className="carousel-arrow carousel-arrow-prev"
						onClick={() => moveBy(-1)}
						disabled={!canGoPrev}
						aria-label="Slide anterior"
					>
						<CaretLeftIcon size={24} weight="bold" aria-hidden="true" />
					</button>
				)}

				<div
					className="carousel-track-container"
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerUp={(event) => finishPointerGesture(event, false)}
					onPointerCancel={(event) => finishPointerGesture(event, true)}
					onClickCapture={handleClickCapture}
				>
					<div
						className="carousel-track"
						style={{
							transform: `translateX(calc(-${trackOffset}% - ${trackGapOffset}px))`,
							gap: `${safeGap}px`,
						}}
					>
						{safeItems.map((item, index) => {
							const isHidden = index < currentIndex || index >= currentIndex + visibleItems;
							return (
								<div
									key={item.id}
									className="carousel-item"
									style={{ flexBasis: itemWidth, maxWidth: itemWidth }}
									role="group"
									aria-roledescription="slide"
									aria-label={`${index + 1} de ${safeItems.length}`}
									aria-hidden={isHidden}
									inert={isHidden}
								>
									{item.content}
								</div>
							);
						})}
					</div>
				</div>

				{showArrows && (
					<button
						type="button"
						className="carousel-arrow carousel-arrow-next"
						onClick={() => moveBy(1)}
						disabled={!canGoNext}
						aria-label="Próximo slide"
					>
						<CaretRightIcon size={24} weight="bold" aria-hidden="true" />
					</button>
				)}
			</div>

			<div
				className="carousel-visually-hidden"
				aria-live={isAutoRotating ? "off" : "polite"}
				aria-atomic="true"
			>
				{safeItems.length > 0 &&
					`${currentIndex + 1} a ${Math.min(currentIndex + visibleItems, safeItems.length)} de ${safeItems.length}`}
			</div>

			{showDots && totalPages > 1 && (
				<nav className="carousel-dots" aria-label="Navegação do carrossel">
					{pageStartIndices.map((startIndex, pageIndex) => {
						const nextStartIndex = pageStartIndices[pageIndex + 1];
						const isActive =
							currentIndex >= startIndex &&
							(nextStartIndex === undefined || currentIndex < nextStartIndex);

						return (
							<button
								key={`page-${pageIndex}`}
								type="button"
								className={clsx("carousel-dot", { "carousel-dot-active": isActive })}
								onClick={() => navigateTo(startIndex)}
								aria-current={isActive ? "true" : undefined}
								aria-label={`Ir para página ${pageIndex + 1}`}
							/>
						);
					})}
				</nav>
			)}
		</section>
	);
};

export default Carousel;
