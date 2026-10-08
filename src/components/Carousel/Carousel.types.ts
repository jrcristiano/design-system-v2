import type { ReactNode } from "react";

export interface CarouselItem {
	id: string | number;
	content: ReactNode;
}

export interface CarouselProps {
	/** Array de itens a serem exibidos no carrossel */
	items: CarouselItem[];
	/** Mostra setas de navegação */
	showArrows?: boolean;
	/** Mostra indicadores de posição (dots) */
	showDots?: boolean;
	/** Habilita autoplay */
	autoplay?: boolean;
	/** Intervalo do autoplay em milissegundos */
	autoplayInterval?: number;
	/** Número de itens visíveis por vez (responsivo) */
	itemsPerView?: {
		mobile?: number;
		tablet?: number;
		desktop?: number;
	};
	/** Gap entre itens em pixels */
	gap?: number;
	/** Callback ao mudar de slide */
	onSlideChange?: (currentIndex: number) => void;
	/** Classe CSS adicional */
	className?: string;
	/** Habilita navegação por teclado */
	enableKeyboard?: boolean;
	/** Habilita navegação por swipe/touch */
	enableSwipe?: boolean;
	/** Label para acessibilidade */
	ariaLabel?: string;
	/** Pausa autoplay ao focar/hover */
	pauseOnInteraction?: boolean;
	/** Loop infinito */
	loop?: boolean;
}

export interface CarouselContextType {
	currentIndex: number;
	totalItems: number;
	goToSlide: (index: number) => void;
	nextSlide: () => void;
	prevSlide: () => void;
	isAnimating: boolean;
}
