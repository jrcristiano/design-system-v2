import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chart } from "../components/Chart/Chart";

const meta: Meta<typeof Chart> = {
	title: "Components/Chart",
	component: Chart,
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: "select",
			options: ["bar", "line", "area", "scatter", "pie", "bullet", "gauge"],
		},
		title: {
			control: "text",
		},
	},
};

export default meta;

type Story = StoryObj<typeof Chart>;

const baseData = [
	{ x: "Jan", y: 35 },
	{ x: "Fev", y: 42 },
	{ x: "Mar", y: 28 },
	{ x: "Abr", y: 50 },
];

export const Bar: Story = {
	args: {
		type: "bar",
		title: "Vendas Mensais",
		data: baseData,
	},
};

export const Line: Story = {
	args: {
		type: "line",
		title: "Evolução de Receita",
		data: baseData,
	},
};

export const Area: Story = {
	args: {
		type: "area",
		title: "Crescimento Acumulado",
		data: baseData,
	},
};

export const Scatter: Story = {
	args: {
		type: "scatter",
		title: "Distribuição de Pontos",
		data: baseData,
	},
};

export const Pie: Story = {
	args: {
		type: "pie",
		title: "Participação por Mês",
		data: baseData,
	},
};

export const Bullet: Story = {
	args: {
		type: "bullet",
		title: "Meta vs Realizado",
		data: baseData,
	},
};

export const Gauge: Story = {
	args: {
		type: "gauge",
		title: "Progresso Atual",
		data: [{ x: "Progresso", y: 65 }],
	},
};
