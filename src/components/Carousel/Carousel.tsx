import { useCallback, useEffect, useRef, useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";
import type { CarouselProps } from "./Carousel.types";
import "./Carousel.css";

export const Carousel = ({
	items,
	showArrows = true,
	showDots = true,
	autoplay = false,
	autoplayInterval = 3000,
	itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
	gap = 40,
	onSlideChange,
	className,
	enableKeyboard = true,
	enableSwipe = true,
	ariaLabel = "Carrossel de conteúdo",
	pauseOnInteraction = true,
	loop = true,
}: CarouselProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const containerRef = useRef<HTMLElement>(null);
	const autoplayTimerRef = useRef<ReturnType<typeof globalThis.setInterval> | null>(null);
	const timeoutRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);
	const isAnimatingRef = useRef(false);

	const touchStartRef = useRef(0);
	const touchEndRef = useRef(0);

	// SSR-safe + Sonar compliant
	const getItemsPerView = useCallback((): number => {
		const win = globalThis.window;
		if (!win) return itemsPerView.desktop ?? 3;

		const width = win.innerWidth;
		if (width < 768) return itemsPerView.mobile ?? 1;
		if (width < 1024) return itemsPerView.tablet ?? 2;
		return itemsPerView.desktop ?? 3;
	}, [itemsPerView]);

	const [visibleItems, setVisibleItems] = useState(() => getItemsPerView());

	useEffect(() => {
		const handleResize = () => setVisibleItems(getItemsPerView());
		globalThis.window?.addEventListener("resize", handleResize);
		return () => globalThis.window?.removeEventListener("resize", handleResize);
	}, [getItemsPerView]);

	const maxIndex = Math.max(0, items.length - visibleItems);
	const totalSlides = Math.ceil(items.length / visibleItems);

	const goToSlide = useCallback(
		(index: number) => {
			if (isAnimatingRef.current) return;

			let newIndex = index;

			if (loop) {
				if (index < 0) newIndex = maxIndex;
				else if (index > maxIndex) newIndex = 0;
			} else {
				newIndex = Math.max(0, Math.min(index, maxIndex));
			}

			isAnimatingRef.current = true;
			setCurrentIndex(newIndex);
			onSlideChange?.(newIndex);

			// Limpa timeout anterior se existir
			if (timeoutRef.current) globalThis.clearTimeout(timeoutRef.current);
			timeoutRef.current = globalThis.setTimeout(() => {
				isAnimatingRef.current = false;
			}, 300);
		},
		[loop, maxIndex, onSlideChange],
	);

	const nextSlide = useCallback(() => goToSlide(currentIndex + 1), [currentIndex, goToSlide]);
	const prevSlide = useCallback(() => goToSlide(currentIndex - 1), [currentIndex, goToSlide]);

	// Autoplay
	useEffect(() => {
		if (!autoplay || isPaused) {
			if (autoplayTimerRef.current !== null) {
				globalThis.clearInterval(autoplayTimerRef.current);
				autoplayTimerRef.current = null;
			}
			return;
		}

		autoplayTimerRef.current = globalThis.setInterval(nextSlide, autoplayInterval);

		return () => {
			if (autoplayTimerRef.current !== null) {
				globalThis.clearInterval(autoplayTimerRef.current);
			}
		};
	}, [autoplay, autoplayInterval, isPaused, nextSlide]);

	// Keyboard navigation
	useEffect(() => {
		if (!enableKeyboard) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				prevSlide();
			}
			if (e.key === "ArrowRight") {
				e.preventDefault();
				nextSlide();
			}
		};

		const container = containerRef.current;
		container?.addEventListener("keydown", handleKeyDown);
		return () => container?.removeEventListener("keydown", handleKeyDown);
	}, [enableKeyboard, nextSlide, prevSlide]);

	// Touch / Swipe
	const handleTouchStart = (e: React.TouchEvent) => {
		if (!enableSwipe) return;
		touchStartRef.current = e.targetTouches[0].clientX;
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!enableSwipe) return;
		touchEndRef.current = e.targetTouches[0].clientX;
	};

	const handleTouchEnd = () => {
		if (!enableSwipe) return;

		const delta = touchStartRef.current - touchEndRef.current;
		if (delta > 50) nextSlide();
		if (delta < -50) prevSlide();
	};

	// Pause / Resume
	const pause = () => {
		if (pauseOnInteraction && autoplay) setIsPaused(true);
	};
	const resume = () => {
		if (pauseOnInteraction && autoplay) setIsPaused(false);
	};

	const canGoPrev = loop || currentIndex > 0;
	const canGoNext = loop || currentIndex < maxIndex;

	return (
		<section
			ref={containerRef}
			className={clsx("carousel-container", className)}
			aria-label={ariaLabel}
			aria-roledescription="carrossel"
			onMouseEnter={pause}
			onMouseLeave={resume}
			onFocus={pause}
			onBlur={resume}
		>
			<div className="carousel-wrapper">
				{showArrows && (
					<button
						type="button"
						className={clsx("carousel-arrow carousel-arrow-prev", {
							"carousel-arrow-disabled": !canGoPrev,
						})}
						onClick={prevSlide}
						disabled={!canGoPrev}
						aria-label="Slide anterior"
					>
						<CaretLeftIcon size={24} weight="bold" />
					</button>
				)}

				<div
					className="carousel-track-container"
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
				>
					<div
						className="carousel-track"
						style={{
							transform: `translateX(calc(-${currentIndex} * (100% / ${visibleItems}) - ${currentIndex} * ${gap}px / ${visibleItems}))`,
							gap: `${gap}px`,
						}}
						aria-live="polite"
						aria-atomic="true"
					>
						{items.map((item, index) => (
							<div
								key={item.id} // ✅ Key única baseada em ID
								className="carousel-item"
								style={{
									flex: `0 0 calc((100% - ${gap * (visibleItems - 1)}px) / ${visibleItems})`,
									maxWidth: `calc((100% - ${gap * (visibleItems - 1)}px) / ${visibleItems})`,
								}}
								aria-roledescription="slide"
								aria-label={`${index + 1} de ${items.length}`}
								aria-hidden={index < currentIndex || index >= currentIndex + visibleItems}
							>
								{item.content}
							</div>
						))}
					</div>
				</div>

				{showArrows && (
					<button
						type="button"
						className={clsx("carousel-arrow carousel-arrow-next", {
							"carousel-arrow-disabled": !canGoNext,
						})}
						onClick={nextSlide}
						disabled={!canGoNext}
						aria-label="Próximo slide"
					>
						<CaretRightIcon size={24} weight="bold" />
					</button>
				)}
			</div>

			{showDots && (
				<div className="carousel-dots" role="tablist" aria-label="Navegação do carrossel">
					{Array.from({ length: totalSlides }).map((_, slideIndex) => {
						const isActive = Math.floor(currentIndex / visibleItems) === slideIndex;

						const handleClick = () => goToSlide(slideIndex * visibleItems);

						return (
							<button
								key={`dot-${items[slideIndex * visibleItems]?.id ?? slideIndex}`}
								type="button"
								className={clsx("carousel-dot", {
									"carousel-dot-active": isActive,
								})}
								onClick={handleClick}
								role="tab"
								aria-selected={isActive}
								aria-label={`Ir para slide ${slideIndex + 1}`}
							/>
						);
					})}
				</div>
			)}
		</section>
	);
};

export default Carousel;
