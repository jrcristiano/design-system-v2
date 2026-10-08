import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { Carousel } from "./Carousel";
import type { CarouselItem } from "./Carousel.types";

const createItems = (count: number): CarouselItem[] =>
	Array.from({ length: count }, (_, index) => ({
		id: index + 1,
		content: <div>Slide {index + 1}</div>,
	}));

const onePerView = { mobile: 1, tablet: 1, desktop: 1 };

describe("Carousel", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
		Object.defineProperty(window, "matchMedia", { configurable: true, value: undefined });
		Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		vi.useRealTimers();
	});

	it("renders an accessible region, slides, and labeled navigation", () => {
		const items = createItems(4);
		const { container } = render(
			<Carousel items={items} ariaLabel="Destaques" itemsPerView={onePerView} loop={false} />,
		);

		const carousel = screen.getByRole("region", { name: "Destaques" });
		expect(carousel).toHaveAttribute("aria-roledescription", "carrossel");
		expect(carousel).not.toHaveAttribute("tabindex");
		expect(container.querySelectorAll(".carousel-item")).toHaveLength(4);
		expect(screen.getByRole("button", { name: "Slide anterior" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Próximo slide" })).toBeEnabled();
		expect(screen.getByRole("navigation", { name: "Navegação do carrossel" })).toBeInTheDocument();
	});

	it("handles empty and single item collections without invalid controls or division", () => {
		const { rerender, container } = render(<Carousel items={[]} />);
		expect(container.querySelectorAll(".carousel-item")).toHaveLength(0);
		expect(screen.getByRole("button", { name: "Slide anterior" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Próximo slide" })).toBeDisabled();
		expect(
			screen.queryByRole("navigation", { name: "Navegação do carrossel" }),
		).not.toBeInTheDocument();

		rerender(<Carousel items={createItems(1)} autoplay />);
		expect(screen.getByText("Slide 1")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Próximo slide" })).toBeDisabled();
		expect(
			screen.queryByRole("button", { name: "Pausar rotação automática" }),
		).not.toBeInTheDocument();
	});

	it("does not show navigation dots when there is only one page", () => {
		render(<Carousel items={createItems(2)} itemsPerView={{ mobile: 2, tablet: 2, desktop: 2 }} />);
		expect(
			screen.queryByRole("navigation", { name: "Navegação do carrossel" }),
		).not.toBeInTheDocument();
	});

	it("moves one item for each rapid click and only reports real index changes", () => {
		const onSlideChange = vi.fn();
		render(
			<Carousel
				items={createItems(4)}
				itemsPerView={onePerView}
				loop={false}
				onSlideChange={onSlideChange}
			/>,
		);

		const next = screen.getByRole("button", { name: "Próximo slide" });
		fireEvent.click(next);
		fireEvent.click(next);
		fireEvent.click(next);
		fireEvent.click(next);

		expect(onSlideChange.mock.calls.map(([index]) => index)).toEqual([1, 2, 3]);
		expect(next).toBeDisabled();
	});

	it("wraps at both ends only when loop is enabled", () => {
		const onSlideChange = vi.fn();
		render(
			<Carousel items={createItems(4)} itemsPerView={onePerView} onSlideChange={onSlideChange} />,
		);

		fireEvent.click(screen.getByRole("button", { name: "Slide anterior" }));
		expect(onSlideChange).toHaveBeenLastCalledWith(3);
		fireEvent.click(screen.getByRole("button", { name: "Próximo slide" }));
		expect(onSlideChange).toHaveBeenLastCalledWith(0);
	});

	it("changes pages from dots and uses current-page semantics", () => {
		const onSlideChange = vi.fn();
		render(
			<Carousel
				items={createItems(5)}
				itemsPerView={{ mobile: 2, tablet: 2, desktop: 2 }}
				loop={false}
				onSlideChange={onSlideChange}
			/>,
		);

		const pageTwo = screen.getByRole("button", { name: "Ir para página 2" });
		fireEvent.click(pageTwo);
		expect(onSlideChange).toHaveBeenCalledWith(2);
		expect(pageTwo).toHaveAttribute("aria-current", "true");
		expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
	});

	it("clamps the current index after items are removed and reports the effective change once", () => {
		const onSlideChange = vi.fn();
		const { rerender } = render(
			<Carousel
				items={createItems(5)}
				itemsPerView={onePerView}
				loop={false}
				onSlideChange={onSlideChange}
			/>,
		);

		const next = screen.getByRole("button", { name: "Próximo slide" });
		fireEvent.click(next);
		fireEvent.click(next);
		fireEvent.click(next);
		onSlideChange.mockClear();

		rerender(
			<Carousel
				items={createItems(2)}
				itemsPerView={onePerView}
				loop={false}
				onSlideChange={onSlideChange}
			/>,
		);

		expect(onSlideChange).toHaveBeenCalledTimes(1);
		expect(onSlideChange).toHaveBeenCalledWith(1);
		expect(screen.getByRole("button", { name: "Próximo slide" })).toBeDisabled();
		expect(
			screen.getByText("Slide 2").closest('[aria-roledescription="slide"]'),
		).not.toHaveAttribute("aria-hidden", "true");
	});

	it("clamps when itemsPerView changes and normalizes invalid values", () => {
		const onSlideChange = vi.fn();
		const { rerender, container } = render(
			<Carousel
				items={createItems(5)}
				itemsPerView={onePerView}
				loop={false}
				onSlideChange={onSlideChange}
			/>,
		);
		const next = screen.getByRole("button", { name: "Próximo slide" });
		fireEvent.click(next);
		fireEvent.click(next);
		fireEvent.click(next);
		onSlideChange.mockClear();

		rerender(
			<Carousel
				items={createItems(5)}
				itemsPerView={{ mobile: 0, tablet: -2, desktop: Number.NaN }}
				gap={Number.POSITIVE_INFINITY}
				loop={false}
				onSlideChange={onSlideChange}
			/>,
		);

		expect(onSlideChange).toHaveBeenCalledWith(2);
		expect((container.querySelector(".carousel-track") as HTMLElement).style.gap).toBe("40px");
	});

	it("keeps CSS values finite and clamps itemsPerView to the item count", () => {
		const { container } = render(
			<Carousel
				items={createItems(2)}
				itemsPerView={{ mobile: 4.8, tablet: 4.8, desktop: 4.8 }}
				gap={-12}
			/>,
		);
		const slides = container.querySelectorAll<HTMLElement>(".carousel-item");
		expect(slides[0].style.flexBasis).toBe("50%");
		expect((container.querySelector(".carousel-track") as HTMLElement).style.gap).toBe("0px");
	});

	it("responds to container width changes and keeps the index in range", () => {
		let resizeCallback: ResizeObserverCallback | undefined;
		let observed: Element | undefined;
		class MockResizeObserver {
			constructor(callback: ResizeObserverCallback) {
				resizeCallback = callback;
			}
			observe(target: Element) {
				observed = target;
			}
			disconnect() {}
			unobserve() {}
		}
		vi.stubGlobal("ResizeObserver", MockResizeObserver);
		const onSlideChange = vi.fn();
		const { container } = render(
			<Carousel items={createItems(6)} loop={false} onSlideChange={onSlideChange} />,
		);

		const next = screen.getByRole("button", { name: "Próximo slide" });
		fireEvent.click(next);
		fireEvent.click(next);
		fireEvent.click(next);
		onSlideChange.mockClear();

		if (!resizeCallback || !observed) throw new Error("ResizeObserver was not registered");
		const reportWidth = (width: number) =>
			resizeCallback?.(
				[
					{
						target: observed as Element,
						contentRect: {
							width,
							height: 200,
							top: 0,
							right: width,
							bottom: 200,
							left: 0,
							x: 0,
							y: 0,
							toJSON: () => ({}),
						},
						borderBoxSize: [],
						contentBoxSize: [],
						devicePixelContentBoxSize: [],
					} as unknown as ResizeObserverEntry,
				],
				{} as ResizeObserver,
			);
		act(() => reportWidth(500));
		for (let index = 0; index < 5; index += 1) fireEvent.click(next);
		onSlideChange.mockClear();
		act(() => reportWidth(1200));

		expect(onSlideChange).toHaveBeenCalledWith(3);
		expect(container.querySelectorAll(".carousel-item")).toHaveLength(6);
		expect(screen.getByRole("button", { name: "Slide anterior" })).toBeEnabled();
	});

	it("falls back to window resize when ResizeObserver is unavailable", () => {
		vi.stubGlobal("ResizeObserver", undefined);
		const { container } = render(<Carousel items={createItems(4)} />);
		Object.defineProperty(window, "innerWidth", { configurable: true, value: 500 });
		fireEvent(window, new Event("resize"));
		expect((container.querySelectorAll(".carousel-item")[0] as HTMLElement).style.flexBasis).toBe(
			"100%",
		);
	});

	it("supports arrows, Home, and End while preserving input keys and modifier shortcuts", () => {
		const onSlideChange = vi.fn();
		const items: CarouselItem[] = [
			{ id: 1, content: <input aria-label="Busca no slide" /> },
			{ id: 2, content: <button type="button">Ação</button> },
			{ id: 3, content: <div>Slide 3</div> },
		];
		const { container } = render(
			<Carousel
				items={items}
				itemsPerView={onePerView}
				loop={false}
				onSlideChange={onSlideChange}
			/>,
		);
		const carousel = screen.getByRole("region", { name: "Carrossel de conteúdo" });

		fireEvent.keyDown(carousel, { key: "ArrowRight", ctrlKey: true });
		expect(onSlideChange).not.toHaveBeenCalled();
		fireEvent.keyDown(screen.getByRole("textbox", { name: "Busca no slide" }), {
			key: "ArrowRight",
		});
		expect(onSlideChange).not.toHaveBeenCalled();
		fireEvent.keyDown(screen.getByRole("button", { name: "Próximo slide" }), {
			key: "ArrowRight",
		});
		expect(onSlideChange).toHaveBeenCalledWith(1);
		fireEvent.keyDown(screen.getByRole("button", { name: "Ação" }), { key: "ArrowRight" });
		expect(onSlideChange).toHaveBeenLastCalledWith(1);
		fireEvent.keyDown(screen.getByRole("button", { name: "Próximo slide" }), {
			key: "ArrowRight",
		});
		expect(onSlideChange).toHaveBeenLastCalledWith(2);
		fireEvent.keyDown(carousel, { key: "End" });
		expect(onSlideChange).toHaveBeenLastCalledWith(2);
		fireEvent.keyDown(carousel, { key: "Home" });
		expect(onSlideChange).toHaveBeenLastCalledWith(0);
		expect(container.querySelector(".carousel-container")).toHaveAttribute(
			"aria-keyshortcuts",
			"ArrowLeft ArrowRight Home End",
		);
	});

	it("does not capture navigation keys from links and form controls", () => {
		const onSlideChange = vi.fn();
		const { container } = render(
			<Carousel
				items={[{ id: 0, content: <a href="#target">Link</a> }, ...createItems(2)]}
				itemsPerView={onePerView}
				loop={false}
				onSlideChange={onSlideChange}
			/>,
		);
		fireEvent.keyDown(screen.getByRole("link", { name: "Link" }), { key: "ArrowRight" });
		fireEvent.keyDown(screen.getByRole("link", { name: "Link" }), { key: "End" });
		expect(onSlideChange).not.toHaveBeenCalled();
		expect(within(container).getByRole("link")).toBeInTheDocument();
	});

	it("ignores keyboard navigation when it is disabled", () => {
		const onSlideChange = vi.fn();
		render(
			<Carousel items={createItems(3)} onSlideChange={onSlideChange} enableKeyboard={false} />,
		);
		fireEvent.keyDown(screen.getByRole("region", { name: "Carrossel de conteúdo" }), {
			key: "ArrowRight",
		});
		expect(onSlideChange).not.toHaveBeenCalled();
	});

	it("provides a keyboard focus target when other navigation controls are hidden", () => {
		const onSlideChange = vi.fn();
		render(
			<Carousel
				items={createItems(3)}
				itemsPerView={onePerView}
				showArrows={false}
				showDots={false}
				loop={false}
				onSlideChange={onSlideChange}
			/>,
		);
		const carousel = screen.getByRole("region", { name: "Carrossel de conteúdo" });
		expect(carousel).toHaveAttribute("tabindex", "0");
		fireEvent.keyDown(carousel, { key: "ArrowRight" });
		expect(onSlideChange).toHaveBeenCalledWith(1);
	});

	it("marks off-screen slides inert and exposes them after navigation", () => {
		const items: CarouselItem[] = [
			{ id: 1, content: <button type="button">Ação do primeiro</button> },
			{ id: 2, content: <button type="button">Ação do segundo</button> },
		];
		render(<Carousel items={items} itemsPerView={onePerView} />);
		const secondSlide = screen
			.getByText("Ação do segundo")
			.closest('[aria-roledescription="slide"]');
		expect(secondSlide).toHaveAttribute("aria-hidden", "true");
		expect(secondSlide).toHaveAttribute("inert");
		fireEvent.click(screen.getByRole("button", { name: "Próximo slide" }));
		expect(secondSlide).not.toHaveAttribute("inert");
		expect(secondSlide).not.toHaveAttribute("aria-hidden", "true");
	});

	it("supports valid horizontal swipes and consecutive gestures", () => {
		const onSlideChange = vi.fn();
		const { container } = render(
			<Carousel
				items={createItems(5)}
				itemsPerView={onePerView}
				loop={false}
				onSlideChange={onSlideChange}
			/>,
		);
		const track = container.querySelector(".carousel-track-container") as HTMLElement;

		fireEvent.pointerDown(track, {
			pointerId: 1,
			pointerType: "touch",
			isPrimary: true,
			button: 0,
			clientX: 140,
			clientY: 50,
		});
		fireEvent.pointerMove(track, {
			pointerId: 1,
			pointerType: "touch",
			isPrimary: true,
			clientX: 70,
			clientY: 52,
		});
		fireEvent.pointerUp(track, {
			pointerId: 1,
			pointerType: "touch",
			isPrimary: true,
			clientX: 70,
			clientY: 52,
		});
		fireEvent.pointerDown(track, {
			pointerId: 2,
			pointerType: "touch",
			isPrimary: true,
			button: 0,
			clientX: 30,
			clientY: 50,
		});
		fireEvent.pointerMove(track, {
			pointerId: 2,
			pointerType: "touch",
			isPrimary: true,
			clientX: 100,
			clientY: 50,
		});
		fireEvent.pointerUp(track, {
			pointerId: 2,
			pointerType: "touch",
			isPrimary: true,
			clientX: 100,
			clientY: 50,
		});

		expect(onSlideChange.mock.calls.map(([index]) => index)).toEqual([1, 0]);
	});

	it("does not navigate on taps, short gestures, cancelled gestures, or vertical scrolling", () => {
		const onSlideChange = vi.fn();
		const { container } = render(
			<Carousel items={createItems(4)} itemsPerView={onePerView} onSlideChange={onSlideChange} />,
		);
		const track = container.querySelector(".carousel-track-container") as HTMLElement;

		fireEvent.pointerDown(track, {
			pointerId: 1,
			isPrimary: true,
			button: 0,
			clientX: 100,
			clientY: 50,
		});
		fireEvent.pointerUp(track, { pointerId: 1, isPrimary: true, clientX: 100, clientY: 50 });
		fireEvent.pointerDown(track, {
			pointerId: 2,
			isPrimary: true,
			button: 0,
			clientX: 100,
			clientY: 50,
		});
		fireEvent.pointerMove(track, { pointerId: 2, isPrimary: true, clientX: 60, clientY: 50 });
		fireEvent.pointerUp(track, { pointerId: 2, isPrimary: true, clientX: 60, clientY: 50 });
		fireEvent.pointerDown(track, {
			pointerId: 3,
			isPrimary: true,
			button: 0,
			clientX: 100,
			clientY: 50,
		});
		fireEvent.pointerMove(track, { pointerId: 3, isPrimary: true, clientX: 40, clientY: 50 });
		fireEvent.pointerCancel(track, { pointerId: 3, isPrimary: true, clientX: 40, clientY: 50 });
		fireEvent.pointerDown(track, {
			pointerId: 4,
			isPrimary: true,
			button: 0,
			clientX: 100,
			clientY: 20,
		});
		fireEvent.pointerMove(track, { pointerId: 4, isPrimary: true, clientX: 90, clientY: 100 });
		fireEvent.pointerUp(track, { pointerId: 4, isPrimary: true, clientX: 90, clientY: 100 });

		expect(onSlideChange).not.toHaveBeenCalled();
	});

	it("does not steal pointer gestures from interactive slide content", () => {
		const onSlideChange = vi.fn();
		const { container } = render(
			<Carousel
				items={[{ id: 0, content: <a href="#action">Open</a> }, ...createItems(2)]}
				itemsPerView={onePerView}
				onSlideChange={onSlideChange}
			/>,
		);
		const link = screen.getByRole("link", { name: "Open" });
		fireEvent.pointerDown(link, {
			pointerId: 1,
			isPrimary: true,
			button: 0,
			clientX: 100,
			clientY: 20,
		});
		fireEvent.pointerMove(link, { pointerId: 1, isPrimary: true, clientX: 20, clientY: 20 });
		fireEvent.pointerUp(link, { pointerId: 1, isPrimary: true, clientX: 20, clientY: 20 });
		expect(onSlideChange).not.toHaveBeenCalled();
		expect(container.querySelector(".carousel-track-container")).toBeInTheDocument();
	});

	it("autoplays, resets its delay after a slide, and honors loop=false at the final page", () => {
		const onSlideChange = vi.fn();
		render(
			<Carousel
				items={createItems(2)}
				itemsPerView={onePerView}
				loop={false}
				autoplay
				autoplayInterval={1000}
				onSlideChange={onSlideChange}
			/>,
		);

		act(() => vi.advanceTimersByTime(1000));
		expect(onSlideChange).toHaveBeenCalledTimes(1);
		expect(onSlideChange).toHaveBeenCalledWith(1);
		act(() => vi.advanceTimersByTime(5000));
		expect(onSlideChange).toHaveBeenCalledTimes(1);
		expect(vi.getTimerCount()).toBe(0);
	});

	it("loops during autoplay without duplicate intervals in StrictMode", () => {
		const onSlideChange = vi.fn();
		render(
			<div>
				<Carousel
					items={createItems(3)}
					itemsPerView={onePerView}
					autoplay
					autoplayInterval={1000}
					onSlideChange={onSlideChange}
				/>
			</div>,
			{ reactStrictMode: true },
		);
		act(() => vi.advanceTimersByTime(1000));
		act(() => vi.advanceTimersByTime(1000));
		act(() => vi.advanceTimersByTime(1000));
		act(() => vi.advanceTimersByTime(500));
		expect(onSlideChange.mock.calls.map(([index]) => index)).toEqual([1, 2, 0]);
		expect(vi.getTimerCount()).toBe(1);
	});

	it("restarts the autoplay delay after a manual slide change", () => {
		const onSlideChange = vi.fn();
		render(
			<Carousel
				items={createItems(4)}
				itemsPerView={onePerView}
				autoplay
				autoplayInterval={1000}
				onSlideChange={onSlideChange}
			/>,
		);

		act(() => vi.advanceTimersByTime(500));
		fireEvent.click(screen.getByRole("button", { name: "Próximo slide" }));
		act(() => vi.advanceTimersByTime(999));
		expect(onSlideChange).toHaveBeenCalledTimes(1);
		act(() => vi.advanceTimersByTime(1));
		expect(onSlideChange).toHaveBeenNthCalledWith(2, 2);
	});

	it("restarts a single timer when autoplayInterval changes", () => {
		const onSlideChange = vi.fn();
		const { rerender } = render(
			<Carousel
				items={createItems(4)}
				itemsPerView={onePerView}
				autoplay
				autoplayInterval={1000}
				onSlideChange={onSlideChange}
			/>,
		);
		act(() => vi.advanceTimersByTime(500));
		rerender(
			<Carousel
				items={createItems(4)}
				itemsPerView={onePerView}
				autoplay
				autoplayInterval={2000}
				onSlideChange={onSlideChange}
			/>,
		);
		act(() => vi.advanceTimersByTime(1999));
		expect(onSlideChange).not.toHaveBeenCalled();
		act(() => vi.advanceTimersByTime(1));
		expect(onSlideChange).toHaveBeenCalledTimes(1);
	});

	it("pauses while the page is hidden and restarts after it becomes visible", () => {
		const onSlideChange = vi.fn();
		render(
			<Carousel
				items={createItems(4)}
				itemsPerView={onePerView}
				autoplay
				autoplayInterval={1000}
				onSlideChange={onSlideChange}
			/>,
		);
		act(() => vi.advanceTimersByTime(500));
		Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
		fireEvent(document, new Event("visibilitychange"));
		act(() => vi.advanceTimersByTime(2000));
		expect(onSlideChange).not.toHaveBeenCalled();
		Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
		fireEvent(document, new Event("visibilitychange"));
		act(() => vi.advanceTimersByTime(1000));
		expect(onSlideChange).toHaveBeenCalledWith(1);
	});

	it("pauses on hover and resumes after the pointer leaves", () => {
		const onSlideChange = vi.fn();
		const { container } = render(
			<Carousel
				items={createItems(3)}
				itemsPerView={onePerView}
				autoplay
				autoplayInterval={1000}
				onSlideChange={onSlideChange}
			/>,
		);
		const carousel = container.querySelector(".carousel-container") as HTMLElement;
		fireEvent.mouseEnter(carousel);
		act(() => vi.advanceTimersByTime(2000));
		expect(onSlideChange).not.toHaveBeenCalled();
		fireEvent.mouseLeave(carousel);
		act(() => vi.advanceTimersByTime(1000));
		expect(onSlideChange).toHaveBeenCalledWith(1);
	});

	it("keeps autoplay paused while focus moves between internal controls", () => {
		const onSlideChange = vi.fn();
		render(
			<Carousel
				items={createItems(3)}
				itemsPerView={onePerView}
				autoplay
				autoplayInterval={1000}
				onSlideChange={onSlideChange}
			/>,
		);
		const previous = screen.getByRole("button", { name: "Slide anterior" });
		const next = screen.getByRole("button", { name: "Próximo slide" });
		fireEvent.focus(previous);
		fireEvent.blur(previous, { relatedTarget: next });
		fireEvent.focus(next);
		act(() => vi.advanceTimersByTime(2000));
		expect(onSlideChange).not.toHaveBeenCalled();
		fireEvent.blur(next, { relatedTarget: document.body });
		act(() => vi.advanceTimersByTime(1000));
		expect(onSlideChange).toHaveBeenCalledWith(1);
	});

	it("offers a persistent autoplay pause control and honors reduced motion", () => {
		const onSlideChange = vi.fn();
		const { container } = render(
			<Carousel
				items={createItems(3)}
				itemsPerView={onePerView}
				autoplay
				autoplayInterval={1000}
				onSlideChange={onSlideChange}
			/>,
		);
		const pause = screen.getByRole("button", { name: "Pausar rotação automática" });
		fireEvent.click(pause);
		act(() => vi.advanceTimersByTime(2000));
		expect(onSlideChange).not.toHaveBeenCalled();
		fireEvent.click(screen.getByRole("button", { name: "Retomar rotação automática" }));
		act(() => vi.advanceTimersByTime(1000));
		expect(onSlideChange).toHaveBeenCalledWith(1);
		expect(container.querySelector(".carousel-visually-hidden")).toHaveAttribute(
			"aria-live",
			"off",
		);
	});

	it("uses the default safe autoplay interval for zero, negative, or non-finite values", () => {
		const onSlideChange = vi.fn();
		render(
			<Carousel
				items={createItems(3)}
				itemsPerView={onePerView}
				autoplay
				autoplayInterval={0}
				onSlideChange={onSlideChange}
			/>,
		);
		act(() => vi.advanceTimersByTime(2999));
		expect(onSlideChange).not.toHaveBeenCalled();
		act(() => vi.advanceTimersByTime(1));
		expect(onSlideChange).toHaveBeenCalledWith(1);
	});

	it("disables autoplay under prefers-reduced-motion", () => {
		const matchMedia = vi.fn().mockReturnValue({
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		});
		Object.defineProperty(window, "matchMedia", { configurable: true, value: matchMedia });
		const onSlideChange = vi.fn();
		render(
			<Carousel
				items={createItems(3)}
				itemsPerView={onePerView}
				autoplay
				onSlideChange={onSlideChange}
			/>,
		);

		act(() => vi.advanceTimersByTime(10000));
		expect(onSlideChange).not.toHaveBeenCalled();
		expect(screen.getByRole("button", { name: /movimento reduzido/i })).toBeDisabled();
	});

	it("uses polite announcements while stationary and turns them off during rotation", () => {
		const { rerender, container } = render(
			<Carousel items={createItems(3)} itemsPerView={onePerView} />,
		);
		expect(container.querySelector(".carousel-visually-hidden")).toHaveAttribute(
			"aria-live",
			"polite",
		);
		rerender(<Carousel items={createItems(3)} itemsPerView={onePerView} autoplay />);
		expect(container.querySelector(".carousel-visually-hidden")).toHaveAttribute(
			"aria-live",
			"off",
		);
	});
});
