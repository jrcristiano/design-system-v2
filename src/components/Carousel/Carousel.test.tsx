import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Carousel } from "./Carousel";
import type { CarouselItem } from "./Carousel.types";

const mockItems: CarouselItem[] = [
	{
		id: 1,
		content: <div>Slide 1</div>,
	},
	{
		id: 2,
		content: <div>Slide 2</div>,
	},
	{
		id: 3,
		content: <div>Slide 3</div>,
	},
	{
		id: 4,
		content: <div>Slide 4</div>,
	},
];

describe("Carousel", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe("Renderização", () => {
		it("deve renderizar o carrossel com itens", () => {
			render(<Carousel items={mockItems} />);
			expect(screen.getByText("Slide 1")).toBeInTheDocument();
		});

		it("deve renderizar setas de navegação por padrão", () => {
			render(<Carousel items={mockItems} />);
			expect(screen.getByLabelText("Slide anterior")).toBeInTheDocument();
			expect(screen.getByLabelText("Próximo slide")).toBeInTheDocument();
		});

		it("deve renderizar indicadores (dots) por padrão", () => {
			render(<Carousel items={mockItems} />);
			const dots = screen.getAllByRole("tab");
			expect(dots.length).toBeGreaterThan(0);
		});

		it("navigates to the final valid index when the item count is not divisible by visibleItems", async () => {
			const onSlideChange = vi.fn();
			render(
				<Carousel
					items={mockItems}
					onSlideChange={onSlideChange}
					itemsPerView={{ mobile: 3, tablet: 3, desktop: 3 }}
				/>,
			);

			const lastDot = screen.getByRole("tab", { name: "Ir para slide 2" });
			fireEvent.click(lastDot);
			await vi.runAllTimersAsync();

			expect(onSlideChange).toHaveBeenCalledWith(1);
			expect(lastDot).toHaveAttribute("aria-selected", "true");
		});

		it("não deve renderizar setas quando showArrows é false", () => {
			render(<Carousel items={mockItems} showArrows={false} />);
			expect(screen.queryByLabelText("Slide anterior")).not.toBeInTheDocument();
			expect(screen.queryByLabelText("Próximo slide")).not.toBeInTheDocument();
		});

		it("não deve renderizar dots quando showDots é false", () => {
			render(<Carousel items={mockItems} showDots={false} />);
			expect(screen.queryByRole("tab")).not.toBeInTheDocument();
		});
	});

	describe("Navegação", () => {
		it("deve avançar para o próximo slide ao clicar na seta direita", async () => {
			const onSlideChange = vi.fn();
			render(<Carousel items={mockItems} onSlideChange={onSlideChange} />);

			const nextButton = screen.getByLabelText("Próximo slide");
			fireEvent.click(nextButton);

			await vi.runAllTimersAsync();
			expect(onSlideChange).toHaveBeenCalledWith(1);
		});

		it("deve voltar para o slide anterior ao clicar na seta esquerda", async () => {
			const onSlideChange = vi.fn();
			render(
				<Carousel
					items={mockItems}
					onSlideChange={onSlideChange}
					itemsPerView={{ mobile: 1, tablet: 1, desktop: 1 }}
				/>,
			);

			// Primeiro avança
			const nextButton = screen.getByLabelText("Próximo slide");
			fireEvent.click(nextButton);
			await vi.runAllTimersAsync();

			// Verifica todas as chamadas até agora
			expect(onSlideChange).toHaveBeenCalledTimes(1);
			expect(onSlideChange).toHaveBeenNthCalledWith(1, 1);

			// Depois volta
			const prevButton = screen.getByLabelText("Slide anterior");
			fireEvent.click(prevButton);
			await vi.runAllTimersAsync();

			// Verifica se foi chamado 2 vezes
			expect(onSlideChange).toHaveBeenCalledTimes(2);
			expect(onSlideChange).toHaveBeenNthCalledWith(2, 0);
		});
	});

	describe("Navegação por Teclado", () => {
		it("deve avançar com a seta direita do teclado", async () => {
			const onSlideChange = vi.fn();
			const { container } = render(
				<Carousel items={mockItems} onSlideChange={onSlideChange} enableKeyboard={true} />,
			);

			const carousel = container.querySelector(".carousel-container");
			if (carousel) {
				fireEvent.keyDown(carousel, { key: "ArrowRight" });
				await vi.runAllTimersAsync();
				expect(onSlideChange).toHaveBeenCalledWith(1);
			}
		});

		it("deve voltar com a seta esquerda do teclado", async () => {
			const onSlideChange = vi.fn();
			const { container } = render(
				<Carousel
					items={mockItems}
					onSlideChange={onSlideChange}
					itemsPerView={{ mobile: 1, tablet: 1, desktop: 1 }}
					enableKeyboard={true}
				/>,
			);

			const carousel = container.querySelector(".carousel-container");
			if (carousel) {
				// Primeiro avança
				fireEvent.keyDown(carousel, { key: "ArrowRight" });
				await vi.runAllTimersAsync();
				expect(onSlideChange).toHaveBeenCalledWith(1);

				// Depois volta
				fireEvent.keyDown(carousel, { key: "ArrowLeft" });
				await vi.runAllTimersAsync();
				expect(onSlideChange).toHaveBeenLastCalledWith(0);
			}
		});

		it("não deve navegar por teclado quando enableKeyboard é false", async () => {
			const onSlideChange = vi.fn();
			const { container } = render(
				<Carousel items={mockItems} onSlideChange={onSlideChange} enableKeyboard={false} />,
			);

			const carousel = container.querySelector(".carousel-container");
			if (carousel) {
				fireEvent.keyDown(carousel, { key: "ArrowRight" });

				// Não deve ter sido chamado
				expect(onSlideChange).not.toHaveBeenCalled();
			}
		});
	});

	describe("Autoplay", () => {
		it("deve avançar automaticamente quando autoplay está habilitado", async () => {
			const onSlideChange = vi.fn();
			render(
				<Carousel
					items={mockItems}
					autoplay={true}
					autoplayInterval={1000}
					onSlideChange={onSlideChange}
				/>,
			);

			// Avança o tempo do intervalo + animação
			await vi.advanceTimersByTimeAsync(1350);
			expect(onSlideChange).toHaveBeenCalledWith(1);
		});

		it("deve pausar autoplay ao passar o mouse quando pauseOnInteraction é true", async () => {
			const onSlideChange = vi.fn();
			const { container } = render(
				<Carousel
					items={mockItems}
					autoplay={true}
					autoplayInterval={1000}
					pauseOnInteraction={true}
					onSlideChange={onSlideChange}
				/>,
			);

			const carousel = container.querySelector(".carousel-container");
			if (carousel) {
				// Simula mouse enter
				fireEvent.mouseEnter(carousel);

				// Avança o tempo
				vi.advanceTimersByTime(1000);

				// Não deve ter avançado
				expect(onSlideChange).not.toHaveBeenCalled();
			}
		});

		it("deve retomar autoplay ao tirar o mouse quando pauseOnInteraction é true", async () => {
			const onSlideChange = vi.fn();
			const { container } = render(
				<Carousel
					items={mockItems}
					autoplay={true}
					autoplayInterval={1000}
					pauseOnInteraction={true}
					onSlideChange={onSlideChange}
				/>,
			);

			const carousel = container.querySelector(".carousel-container");
			if (carousel) {
				// Simula mouse enter e leave
				fireEvent.mouseEnter(carousel);
				fireEvent.mouseLeave(carousel);

				// Avança o tempo do intervalo + animação
				await vi.advanceTimersByTimeAsync(1350);
				expect(onSlideChange).toHaveBeenCalled();
			}
		});
	});

	describe("Acessibilidade", () => {
		it("deve ter atributos ARIA corretos", () => {
			const { container } = render(<Carousel items={mockItems} ariaLabel="Meu carrossel" />);

			const carousel = container.querySelector(".carousel-container");
			expect(carousel).toHaveAttribute("aria-label", "Meu carrossel");
			expect(carousel).toHaveAttribute("aria-roledescription", "carrossel");
		});

		it("deve ter navegação acessível por dots com role tablist", () => {
			render(<Carousel items={mockItems} />);

			const tablist = screen.getByRole("tablist");
			expect(tablist).toBeInTheDocument();
			expect(tablist).toHaveAttribute("aria-label", "Navegação do carrossel");
		});

		it("cada slide deve ter aria-label com sua posição", () => {
			const { container } = render(<Carousel items={mockItems} />);

			const slides = container.querySelectorAll(".carousel-item");
			expect(slides[0]).toHaveAttribute("aria-label", "1 de 4");
			expect(slides[1]).toHaveAttribute("aria-label", "2 de 4");
		});
	});

	describe("Swipe/Touch", () => {
		it("deve avançar ao fazer swipe para a esquerda", async () => {
			const onSlideChange = vi.fn();
			const { container } = render(
				<Carousel items={mockItems} onSlideChange={onSlideChange} enableSwipe={true} />,
			);

			const trackContainer = container.querySelector(".carousel-track-container");
			if (trackContainer) {
				fireEvent.touchStart(trackContainer, { targetTouches: [{ clientX: 100 }] });
				fireEvent.touchMove(trackContainer, { targetTouches: [{ clientX: 40 }] });
				fireEvent.touchEnd(trackContainer);

				await vi.runAllTimersAsync();
				expect(onSlideChange).toHaveBeenCalledWith(1);
			}
		});

		it("deve voltar ao fazer swipe para a direita", async () => {
			const onSlideChange = vi.fn();
			const { container } = render(
				<Carousel items={mockItems} onSlideChange={onSlideChange} enableSwipe={true} />,
			);

			const trackContainer = container.querySelector(".carousel-track-container");
			const nextButton = screen.getByLabelText("Próximo slide");

			// Primeiro avança um slide
			fireEvent.click(nextButton);
			await vi.runAllTimersAsync();
			expect(onSlideChange).toHaveBeenCalledWith(1);

			// Depois faz swipe para direita
			if (trackContainer) {
				fireEvent.touchStart(trackContainer, { targetTouches: [{ clientX: 40 }] });
				fireEvent.touchMove(trackContainer, { targetTouches: [{ clientX: 100 }] });
				fireEvent.touchEnd(trackContainer);

				await vi.runAllTimersAsync();
				expect(onSlideChange).toHaveBeenLastCalledWith(0);
			}
		});
	});

	describe("Loop", () => {
		it("deve voltar ao primeiro slide após o último quando loop é true", async () => {
			const onSlideChange = vi.fn();
			render(
				<Carousel
					items={mockItems}
					loop={true}
					onSlideChange={onSlideChange}
					itemsPerView={{ mobile: 1, tablet: 1, desktop: 1 }}
				/>,
			);

			const nextButton = screen.getByLabelText("Próximo slide");

			// Avança até o último slide, aguardando a animação entre cada clique
			fireEvent.click(nextButton); // vai para 1
			await vi.runOnlyPendingTimersAsync();
			await vi.advanceTimersByTimeAsync(350);
			fireEvent.click(nextButton); // vai para 2
			await vi.runOnlyPendingTimersAsync();
			await vi.advanceTimersByTimeAsync(350);
			fireEvent.click(nextButton); // vai para 3
			await vi.runOnlyPendingTimersAsync();
			await vi.advanceTimersByTimeAsync(350);
			fireEvent.click(nextButton); // deve voltar para 0
			await vi.runOnlyPendingTimersAsync();
			await vi.advanceTimersByTimeAsync(350);

			expect(onSlideChange).toHaveBeenLastCalledWith(0);
		});

		it("deve ir para o último slide ao voltar do primeiro quando loop é true", async () => {
			const onSlideChange = vi.fn();
			render(
				<Carousel
					items={mockItems}
					loop={true}
					onSlideChange={onSlideChange}
					itemsPerView={{ mobile: 1, tablet: 1, desktop: 1 }}
				/>,
			);

			const prevButton = screen.getByLabelText("Slide anterior");
			fireEvent.click(prevButton);

			await vi.runAllTimersAsync();
			expect(onSlideChange).toHaveBeenCalledWith(3);
		});

		it("não deve voltar ao primeiro após o último quando loop é false", async () => {
			const onSlideChange = vi.fn();
			render(
				<Carousel
					items={mockItems}
					loop={false}
					onSlideChange={onSlideChange}
					itemsPerView={{ mobile: 1, tablet: 1, desktop: 1 }}
				/>,
			);

			const nextButton = screen.getByLabelText("Próximo slide");

			// Avança até o último slide (3 cliques para ir de 0 a 3)
			for (let i = 0; i < 3; i++) {
				fireEvent.click(nextButton);
				await vi.runOnlyPendingTimersAsync();
				await vi.advanceTimersByTimeAsync(350);
			}

			// Deve estar desabilitado
			expect(nextButton).toBeDisabled();
		});
	});

	describe("Responsividade", () => {
		it("deve aceitar configuração de itens por view", () => {
			const { container } = render(
				<Carousel
					items={mockItems}
					itemsPerView={{
						mobile: 1,
						tablet: 2,
						desktop: 3,
					}}
				/>,
			);

			expect(container.querySelector(".carousel-container")).toBeInTheDocument();
		});

		it("deve aplicar gap customizado", () => {
			const { container } = render(<Carousel items={mockItems} gap={20} />);

			const track = container.querySelector(".carousel-track") as HTMLElement;
			expect(track?.style.gap).toBe("20px");
		});
	});

	it("removes controls in hidden slides from the focus order", () => {
		const items: CarouselItem[] = [
			{ id: 10, content: <button type="button">First slide action</button> },
			{ id: 11, content: <button type="button">Second slide action</button> },
		];
		render(<Carousel items={items} itemsPerView={{ mobile: 1, tablet: 1, desktop: 1 }} />);
		const secondAction = screen.getByText("Second slide action");
		const secondSlide = secondAction.closest('[aria-roledescription="slide"]');
		expect(secondSlide).toHaveAttribute("aria-hidden", "true");
		expect(secondSlide).toHaveAttribute("inert");

		fireEvent.click(screen.getByLabelText("Próximo slide"));
		expect(secondSlide).not.toHaveAttribute("inert");
	});
});
