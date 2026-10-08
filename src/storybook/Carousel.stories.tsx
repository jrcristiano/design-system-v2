import { useState } from "react";
import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Carousel } from "../components/Carousel";
import type { CarouselItem } from "../components/Carousel";
import { SampleCard } from "./components/SampleCard";

const meta = {
	title: "Components/Carousel",
	component: Carousel,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Carrossel acessível com navegação por setas, páginas, teclado, gesto horizontal e autoplay. `itemsPerView` escolhe os valores mobile, tablet e desktop conforme a largura do próprio container; os limites seguem os tokens de 768 px e 1024 px do Design System.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		items: {
			description:
				"Itens identificados por id e renderizados como conteúdo React. Veja as stories de itens dinâmicos e interativos para exemplos.",
			control: false,
		},
		showArrows: { description: "Mostra as setas de navegação.", control: { type: "boolean" } },
		showDots: { description: "Mostra os botões de página.", control: { type: "boolean" } },
		itemsPerView: {
			description:
				"Quantidade por largura do container (aceita frações para mostrar parte do próximo slide): mobile (<768 px), tablet (768–1023 px), desktop (≥1024 px).",
			control: { type: "object" },
		},
		autoplay: {
			description: "Ativa rotação automática quando há mais de uma página.",
			control: { type: "boolean" },
		},
		autoplayInterval: {
			description: "Intervalo entre mudanças, em milissegundos.",
			control: { type: "number" },
		},
		pauseOnInteraction: {
			description: "Pausa ao receber hover ou foco.",
			control: { type: "boolean" },
		},
		loop: {
			description: "Volta ao primeiro/último índice nos limites.",
			control: { type: "boolean" },
		},
		gap: {
			description: "Espaço entre itens, em pixels.",
			control: { type: "number", min: 0, step: 4 },
		},
		enableKeyboard: {
			description: "Ativa setas do teclado e Home/End.",
			control: { type: "boolean" },
		},
		enableSwipe: {
			description: "Ativa gestos horizontais por Pointer Events.",
			control: { type: "boolean" },
		},
		ariaLabel: { description: "Nome acessível da região do carrossel.", control: { type: "text" } },
		className: { control: { type: "text" } },
		onSlideChange: {
			description: "Disparado uma vez para cada índice efetivamente alterado.",
			action: "slide changed",
			control: false,
		},
	},
	args: {
		onSlideChange: fn(),
	},
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const createSmallCards = (count: number): CarouselItem[] =>
	Array.from({ length: count }, (_, index) => ({
		id: index + 1,
		content: (
			<SampleCard
				title={`Destaque ${index + 1}`}
				subtitle="Conteúdo de exemplo para uma seção de destaques. O texto pode variar sem alterar o tamanho do cartão."
				imageAspectRatio="348/242"
			/>
		),
	}));

const createMediumCards = (count: number): CarouselItem[] =>
	Array.from({ length: count }, (_, index) => ({
		id: index + 1,
		content: (
			<SampleCard
				title={`Notícia ${index + 1}`}
				subtitle="Uma chamada em formato horizontal para notícias e conteúdo editorial."
				imageAspectRatio="675/242"
				layout="horizontal"
			/>
		),
	}));

const baseArgs = {
	items: createSmallCards(6),
	showArrows: true,
	showDots: true,
	autoplay: false,
	autoplayInterval: 3000,
	pauseOnInteraction: true,
	gap: 40,
	loop: true,
	enableKeyboard: true,
	enableSwipe: true,
	itemsPerView: { mobile: 1, tablet: 2, desktop: 3 },
	ariaLabel: "Destaques de conteúdo",
};

export const Basic: Story = {
	args: baseArgs,
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("button", { name: "Próximo slide" }));
		await expect(args.onSlideChange).toHaveBeenCalledWith(1);
		await expect(canvas.getByRole("group", { name: "2 de 6" })).toBeInTheDocument();
	},
};

export const ArrowsOnly: Story = {
	args: { ...baseArgs, showDots: false },
};

export const DotsOnly: Story = {
	args: { ...baseArgs, showArrows: false },
};

export const MultipleVisibleItems: Story = {
	args: { ...baseArgs, itemsPerView: { mobile: 1, tablet: 2, desktop: 4 }, gap: 16 },
};

export const FractionalItems12: Story = {
	args: {
		...baseArgs,
		itemsPerView: { mobile: 1.2, tablet: 1.2, desktop: 1.2 },
		gap: 16,
		loop: false,
	},
};

export const FractionalItems25: Story = {
	args: {
		...baseArgs,
		itemsPerView: { mobile: 2.5, tablet: 2.5, desktop: 2.5 },
		gap: 24,
		loop: false,
	},
};

export const FractionalItems32: Story = {
	args: {
		...baseArgs,
		itemsPerView: { mobile: 3.2, tablet: 3.2, desktop: 3.2 },
		gap: 24,
		loop: false,
	},
};

export const ResponsiveFractionalItems: Story = {
	args: {
		...baseArgs,
		itemsPerView: { mobile: 1.2, tablet: 2.2, desktop: 3.2 },
		loop: false,
	},
};

export const Responsive: Story = {
	args: { ...baseArgs, itemsPerView: { mobile: 1, tablet: 2, desktop: 4 } },
	parameters: {
		docs: {
			description: {
				story:
					"Redimensione o painel ou a janela. A quantidade de itens acompanha a largura observada do container, inclusive dentro de layouts flex e grid.",
			},
		},
	},
};

const createViewportStory = (
	width: number,
	itemsPerView: typeof baseArgs.itemsPerView,
	expectedVisibleItems: number,
): Story => ({
	args: { ...baseArgs, itemsPerView },
	render: (args) => (
		<div style={{ width: `${width}px`, maxWidth: "100%", marginInline: "auto" }}>
			<Carousel {...args} />
		</div>
	),
	parameters: { layout: "padded" },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const carousel = canvas.getByRole("region", { name: "Destaques de conteúdo" });
		await waitFor(() => {
			expect(within(carousel).getAllByRole("group")).toHaveLength(expectedVisibleItems);
		});
	},
});

export const Mobile: Story = createViewportStory(375, { mobile: 1, tablet: 2, desktop: 3 }, 1);
export const Tablet: Story = createViewportStory(800, { mobile: 1, tablet: 2, desktop: 3 }, 2);
export const Desktop: Story = createViewportStory(1120, { mobile: 1, tablet: 2, desktop: 3 }, 3);
export const WideDesktop: Story = createViewportStory(
	1440,
	{ mobile: 1, tablet: 2, desktop: 4 },
	4,
);

export const WithAutoplay: Story = {
	args: { ...baseArgs, autoplay: true, autoplayInterval: 3000 },
	parameters: {
		docs: {
			description: {
				story:
					"A rotação pausa ao receber foco ou hover e pode ser interrompida pelo botão de pausa.",
			},
		},
	},
};

export const LoopEnabled: Story = {
	args: { ...baseArgs, loop: true },
};

export const LoopDisabled: Story = {
	args: { ...baseArgs, loop: false },
};

export const MediumCards: Story = {
	args: {
		...baseArgs,
		items: createMediumCards(4),
		itemsPerView: { mobile: 1, tablet: 1, desktop: 2 },
	},
};

const variedHeightItems: CarouselItem[] = [
	{
		id: 1,
		content: (
			<div
				style={{ minHeight: 160, padding: 24, background: "var(--Semantic-surface-surface, #fff)" }}
			>
				Banner curto
			</div>
		),
	},
	{
		id: 2,
		content: (
			<div
				style={{ minHeight: 280, padding: 24, background: "var(--Semantic-surface-surface, #fff)" }}
			>
				Card de conteúdo mais alto com texto adicional.
			</div>
		),
	},
	{
		id: 3,
		content: (
			<div
				style={{ minHeight: 210, padding: 24, background: "var(--Semantic-surface-surface, #fff)" }}
			>
				Outro destaque
			</div>
		),
	},
];

export const DifferentHeights: Story = {
	args: {
		...baseArgs,
		items: variedHeightItems,
		itemsPerView: { mobile: 1, tablet: 2, desktop: 3 },
		gap: 16,
	},
};

export const FewItems: Story = {
	args: {
		...baseArgs,
		items: createSmallCards(2),
		itemsPerView: { mobile: 1, tablet: 2, desktop: 3 },
	},
};

export const ManyItems: Story = {
	args: { ...baseArgs, items: createSmallCards(18) },
};

function DynamicItemsExample(props: Omit<Story["args"], "items">) {
	const [count, setCount] = useState(4);
	return (
		<div>
			<div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
				<button type="button" onClick={() => setCount((current) => current + 1)}>
					Adicionar item
				</button>
				<button type="button" onClick={() => setCount((current) => Math.max(0, current - 1))}>
					Remover item
				</button>
				<span>{count} itens</span>
			</div>
			<Carousel {...props} items={createSmallCards(count)} />
		</div>
	);
}

export const DynamicItems: Story = {
	args: baseArgs,
	render: (args) => <DynamicItemsExample {...args} />,
};

export const InteractiveSlides: Story = {
	args: {
		...baseArgs,
		items: [
			{
				id: 1,
				content: (
					<button type="button" onClick={() => undefined}>
						Abrir primeiro destaque
					</button>
				),
			},
			{ id: 2, content: <a href="#detalhes">Ler detalhes do segundo destaque</a> },
			{ id: 3, content: <input aria-label="Buscar neste destaque" placeholder="Buscar" /> },
			...createSmallCards(3).map((item) => ({ ...item, id: `sample-${item.id}` })),
		],
	},
};

export const KeyboardAccessible: Story = {
	args: { ...baseArgs, showArrows: false, showDots: false, enableKeyboard: true },
	parameters: {
		docs: {
			description: {
				story: "Foque a região com Tab e use ←/→ para navegar; Home e End vão ao início e ao fim.",
			},
		},
	},
};

export const ConstrainedContainer: Story = {
	args: { ...baseArgs, itemsPerView: { mobile: 1, tablet: 2, desktop: 3 } },
	render: (args) => (
		<div
			style={{
				width: "min(620px, 100%)",
				padding: 16,
				border: "1px dashed var(--Semantic-primary-primary, #004ecc)",
			}}
		>
			<p style={{ marginTop: 0 }}>O carousel mede esta área, mesmo que a janela seja maior.</p>
			<Carousel {...args} />
		</div>
	),
};

export const Playground: Story = {
	args: baseArgs,
};

const storyFrameStyle: CSSProperties = { width: "100%", maxWidth: 1440, marginInline: "auto" };
export const DesignSystemSectionExample: Story = {
	args: { ...baseArgs, itemsPerView: { mobile: 1, tablet: 2, desktop: 4 }, gap: 20 },
	render: (args) => (
		<section style={storyFrameStyle} aria-labelledby="featured-content-heading">
			<h2 id="featured-content-heading">Conteúdos em destaque</h2>
			<p>
				Uma seção realista de página que mantém o carrossel fluido dentro da largura disponível.
			</p>
			<Carousel {...args} />
		</section>
	),
};
