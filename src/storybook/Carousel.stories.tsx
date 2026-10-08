import type { Meta, StoryObj } from "@storybook/react-vite";
import { Carousel } from "../components/Carousel";
import type { CarouselItem } from "../components/Carousel";
import { SampleCard } from "./components/SampleCard";

const meta = {
	title: "Components/Carousel",
	component: Carousel,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Componente de carrossel/slider responsivo com suporte a navegação por setas, touch/swipe, teclado e autoplay. Segue as diretrizes de acessibilidade WCAG.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		items: {
			description: "Array de itens a serem exibidos no carrossel",
			control: { type: "object" },
		},
		showArrows: {
			description: "Mostra setas de navegação",
			control: { type: "boolean" },
		},
		showDots: {
			description: "Mostra indicadores de posição (dots)",
			control: { type: "boolean" },
		},
		autoplay: {
			description: "Habilita autoplay",
			control: { type: "boolean" },
		},
		autoplayInterval: {
			description: "Intervalo do autoplay em milissegundos",
			control: { type: "number" },
		},
		gap: {
			description: "Gap entre itens em pixels",
			control: { type: "number" },
		},
		enableKeyboard: {
			description: "Habilita navegação por teclado",
			control: { type: "boolean" },
		},
		enableSwipe: {
			description: "Habilita navegação por swipe/touch",
			control: { type: "boolean" },
		},
		pauseOnInteraction: {
			description: "Pausa autoplay ao focar/hover",
			control: { type: "boolean" },
		},
		loop: {
			description: "Loop infinito",
			control: { type: "boolean" },
		},
	},
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Dados de exemplo
const createSmallCards = (count: number): CarouselItem[] =>
	Array.from({ length: count }, (_, i) => ({
		id: i + 1,
		content: (
			<SampleCard
				title={`Title ${i + 1}`}
				subtitle="Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
				imageAspectRatio="348/242"
			/>
		),
	}));

const createMediumCards = (count: number): CarouselItem[] =>
	Array.from({ length: count }, (_, i) => ({
		id: i + 1,
		content: (
			<SampleCard
				title={`Title ${i + 1}`}
				subtitle="Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
				imageAspectRatio="675/242"
				layout="horizontal"
			/>
		),
	}));

const createLargeCards = (count: number): CarouselItem[] =>
	Array.from({ length: count }, (_, i) => ({
		id: i + 1,
		content: (
			<SampleCard
				title={`Title ${i + 1}`}
				subtitle="Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story."
				imageAspectRatio="800/400"
			/>
		),
	}));

/**
 * Carrossel com setas de navegação apenas.
 * Cards pequenos (348x242px) com 3 itens visíveis por vez no desktop.
 */
export const ArrowsOnly: Story = {
	args: {
		items: createSmallCards(6),
		showArrows: true,
		showDots: false,
		autoplay: false,
		gap: 40,
		loop: true,
		enableKeyboard: true,
		enableSwipe: true,
		itemsPerView: {
			mobile: 1,
			tablet: 2,
			desktop: 3,
		},
	},
};

/**
 * Carrossel com setas e indicadores (dots).
 * Cards pequenos (348x242px) com navegação completa.
 */
export const WithArrowsAndDots: Story = {
	args: {
		items: createSmallCards(6),
		showArrows: true,
		showDots: true,
		autoplay: false,
		gap: 40,
		loop: true,
		enableKeyboard: true,
		enableSwipe: true,
		itemsPerView: {
			mobile: 1,
			tablet: 2,
			desktop: 3,
		},
	},
};

/**
 * Carrossel com indicadores (dots) apenas, sem setas.
 * Cards pequenos (348x242px).
 */
export const DotsOnly: Story = {
	args: {
		items: createSmallCards(6),
		showArrows: false,
		showDots: true,
		autoplay: false,
		gap: 40,
		loop: true,
		enableKeyboard: true,
		enableSwipe: true,
		itemsPerView: {
			mobile: 1,
			tablet: 2,
			desktop: 3,
		},
	},
};

/**
 * Carrossel com cards médios (675x242px).
 * Exibe 2 itens por vez no desktop.
 */
export const MediumCards: Story = {
	args: {
		items: createMediumCards(4),
		showArrows: true,
		showDots: true,
		autoplay: false,
		gap: 40,
		loop: true,
		enableKeyboard: true,
		enableSwipe: true,
		itemsPerView: {
			mobile: 1,
			tablet: 1,
			desktop: 2,
		},
	},
};

/**
 * Carrossel com cards grandes (800x400px).
 * Exibe 1 item por vez.
 */
export const LargeCards: Story = {
	args: {
		items: createLargeCards(4),
		showArrows: true,
		showDots: true,
		autoplay: false,
		gap: 40,
		loop: true,
		enableKeyboard: true,
		enableSwipe: true,
		itemsPerView: {
			mobile: 1,
			tablet: 1,
			desktop: 1,
		},
	},
};

/**
 * Carrossel com autoplay habilitado.
 * Avança automaticamente a cada 3 segundos e pausa ao passar o mouse.
 */
export const WithAutoplay: Story = {
	args: {
		items: createSmallCards(6),
		showArrows: true,
		showDots: true,
		autoplay: true,
		autoplayInterval: 3000,
		pauseOnInteraction: true,
		gap: 40,
		loop: true,
		enableKeyboard: true,
		enableSwipe: true,
		itemsPerView: {
			mobile: 1,
			tablet: 2,
			desktop: 3,
		},
	},
};

/**
 * Carrossel sem loop.
 * As setas ficam desabilitadas quando alcança o início ou fim.
 */
export const WithoutLoop: Story = {
	args: {
		items: createSmallCards(6),
		showArrows: true,
		showDots: true,
		autoplay: false,
		gap: 40,
		loop: false,
		enableKeyboard: true,
		enableSwipe: true,
		itemsPerView: {
			mobile: 1,
			tablet: 2,
			desktop: 3,
		},
	},
};

/**
 * Carrossel com gap customizado (20px).
 */
export const CustomGap: Story = {
	args: {
		items: createSmallCards(6),
		showArrows: true,
		showDots: true,
		autoplay: false,
		gap: 20,
		loop: true,
		enableKeyboard: true,
		enableSwipe: true,
		itemsPerView: {
			mobile: 1,
			tablet: 2,
			desktop: 3,
		},
	},
};

/**
 * Carrossel apenas com navegação por teclado e swipe (sem setas e dots).
 * Use as setas do teclado ou swipe no touch para navegar.
 */
export const KeyboardAndSwipeOnly: Story = {
	args: {
		items: createSmallCards(6),
		showArrows: false,
		showDots: false,
		autoplay: false,
		gap: 40,
		loop: true,
		enableKeyboard: true,
		enableSwipe: true,
		itemsPerView: {
			mobile: 1,
			tablet: 2,
			desktop: 3,
		},
	},
	parameters: {
		docs: {
			description: {
				story: "Use as setas do teclado (← →) ou faça swipe no dispositivo touch para navegar.",
			},
		},
	},
};

/**
 * Playground para testar todas as configurações disponíveis.
 */
export const Playground: Story = {
	args: {
		items: createSmallCards(8),
		showArrows: true,
		showDots: true,
		autoplay: false,
		autoplayInterval: 3000,
		gap: 40,
		loop: true,
		enableKeyboard: true,
		enableSwipe: true,
		pauseOnInteraction: true,
		itemsPerView: {
			mobile: 1,
			tablet: 2,
			desktop: 3,
		},
		ariaLabel: "Carrossel de conteúdo",
	},
};
