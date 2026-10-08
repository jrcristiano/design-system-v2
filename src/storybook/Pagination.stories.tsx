import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Pagination } from "../components/Pagination/Pagination";
import { useState, useEffect } from "react";
import "./Pagination.stories.inline.css";

const meta: Meta<typeof Pagination> = {
	title: "Components/Paginations",
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Componente de paginação versátil, responsivo e otimizado para diferentes tamanhos de tela. Inclui botões numéricos, navegação por setas, reticências inteligentes, estado desabilitado e exibição opcional de rótulo informativo com intervalo de itens. Ideal para listas, tabelas e grids com grande volume de dados.",
			},
		},
	},
	component: Pagination,
	argTypes: {
		currentPage: {
			control: { type: "number", min: 1 },
			description:
				"Define a página atualmente selecionada. Alterações externas atualizam o estado interno do componente.",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description:
				"Controla o tamanho dos botões de navegação. Ideal para diferentes breakpoints: `sm` (24px, mobile), `md` (36px, tablet) e `lg` (40px, desktop).",
		},
		positionLabel: {
			control: "select",
			options: ["none", "top", "left", "right"],
			mapping: {
				none: undefined,
				top: "top",
				left: "left",
				right: "right",
			},
			description:
				"Controla a posição do rótulo informativo (ex: “1–50 de 500”). Pode ser exibido acima, à esquerda, à direita ou ocultado.",
		},
		perPage: {
			control: { type: "number", min: 1 },
			description:
				"Quantidade de itens exibidos por página. Usado para calcular dinamicamente o intervalo exibido no label informativo.",
		},
		total: {
			control: { type: "number", min: 0, max: 10000 },
			description:
				"Total de itens no dataset. Utilizado para calcular o total de páginas e o intervalo exibido.",
		},
		maxButtons: {
			control: { type: "number", min: 1 },
			description:
				"Número máximo de botões numéricos visíveis. Quando excedido, o componente exibe reticências para navegação condensada.",
		},
		disabled: {
			control: "boolean",
			description:
				"Desabilita completamente a interação da paginação, incluindo botões numéricos e setas de navegação.",
		},
		showPageInput: {
			control: "boolean",
			description:
				"Exibe o campo numérico para ir direto a uma página específica (atalho de navegação).",
		},
		pageInputAlign: {
			control: "select",
			options: ["left", "center", "right"],
			description:
				"Define o alinhamento horizontal do bloco de navegação direta (esquerda, centro ou direita).",
		},
		label: {
			control: "text",
			description: "Texto utilizado no label informativo (ex: “Itens”, “Resultados”, “Registros”).",
		},
		onPageChange: {
			table: { disable: true },
			description: "Callback disparado quando a página atual é alterada.",
		},
	},
	decorators: [
		(Story) => (
			<div className="pagination-stories-inline-1">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const PaginationExample: Story["render"] = (args) => {
	const [currentPage, setCurrentPage] = useState(args.currentPage);

	useEffect(() => {
		setCurrentPage(args.currentPage);
	}, [args.currentPage]);

	return (
		<Pagination
			{...args}
			currentPage={currentPage}
			onPageChange={(page) => {
				setCurrentPage(page);
				console.log("Página alterada para:", page);
			}}
		/>
	);
};

export const Examples: Story = {
	args: {
		currentPage: 1,
		size: "lg",
		positionLabel: "right",
		perPage: 50,
		total: 500,
		label: "Itens",
		maxButtons: 5,
		disabled: false,
		showPageInput: true,
		pageInputAlign: "center",
	},
	render: PaginationExample,
};

export const ActivePageColor: Story = {
	name: "Active page color",
	args: {
		currentPage: 1,
		positionLabel: undefined,
		total: 100,
		showPageInput: false,
	},
	render: PaginationExample,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const inactivePage = canvas.getByRole("button", { name: "Página 2" });
		const activePage = canvas.getByRole("button", { name: "Página 1" });
		const getComputedColor = (element: HTMLElement) =>
			element.ownerDocument.defaultView?.getComputedStyle(element).color;
		expect(
			activePage.ownerDocument.defaultView
				?.getComputedStyle(activePage.ownerDocument.documentElement)
				.getPropertyValue("--ds-color-neutral-white")
				.trim(),
		).toBe("#ffffff");

		expect(getComputedColor(activePage)).toBe("rgb(255, 255, 255)");
		expect(getComputedColor(inactivePage)).toBe("rgb(92, 100, 112)");

		await userEvent.click(inactivePage);

		const newlyActivePage = canvas.getByRole("button", { name: "Página 2" });
		await new Promise((resolve) => setTimeout(resolve, 200));
		expect(newlyActivePage).toHaveAttribute("aria-current", "page");
		expect(getComputedColor(newlyActivePage)).toBe("rgb(255, 255, 255)");
		expect(getComputedColor(canvas.getByRole("button", { name: "Página 1" }))).toBe(
			"rgb(92, 100, 112)",
		);
	},
};

export const Disabled: Story = {
	args: {
		currentPage: 3,
		positionLabel: undefined,
		total: 100,
		showPageInput: false,
		disabled: true,
	},
	render: PaginationExample,
};
