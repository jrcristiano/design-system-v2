import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "../components/Spinner/Spinner";
import "./Spinner.stories.inline.css";

const meta: Meta<typeof Spinner> = {
	title: "Components/Spinner",
	component: Spinner,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Indicador de carregamento minimalista com 4 segmentos em SVG, rotação contínua e props de customização.",
			},
		},
	},
	argTypes: {
		size: {
			control: "select",
			options: ["xs", "sm", "md", "lg", "xl"],
			description: "Tamanho do spinner (preset) ou número em pixels.",
		},
		variant: {
			control: "select",
			options: ["primary", "neutral", "success", "warning", "danger"],
			description: "Define a cor do spinner conforme o tema.",
		},
		speed: {
			control: { type: "number", min: 0.3, max: 3, step: 0.1 },
			description: "Velocidade da rotação (segundos por volta).",
		},
		progress: {
			control: { type: "number", min: 0, max: 100, step: 1 },
			description: "Valor percentual exibido abaixo do spinner.",
		},
		ariaLabel: {
			control: "text",
			description: "Rótulo de acessibilidade para leitores de tela.",
		},
	},
	decorators: [
		(Story) => (
			<div className="spinner-stories-inline-1">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
	args: {
		size: "md",
		variant: "primary",
		speed: 1.5,
		ariaLabel: "Carregando...",
	},
};
