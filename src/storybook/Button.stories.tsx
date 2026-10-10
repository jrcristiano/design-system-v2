import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon, CheckIcon, TrashIcon, EyeIcon } from "@phosphor-icons/react";
import { Button } from "../components/Button/Button";

const meta: Meta<typeof Button> = {
	title: "Components/Buttons",
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Componente de botão com suporte a variantes, tamanhos, ícones e estados visuais. As cores seguem o tema definido no Tailwind.",
			},
		},
	},
	component: Button,
	argTypes: {
		variant: {
			control: "select",
			options: ["primary", "secondary", "text", "error", "outline"],
			description: "Define o estilo visual do botão.",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "Define o tamanho do botão.",
		},
		state: {
			control: "select",
			options: ["default", "hover", "pressed", "focused"],
			description: "Define o estado do botão.",
		},
		isLoading: {
			control: "boolean",
			description: "Mostra o spinner de carregamento.",
		},
		iconLeft: {
			control: "select",
			options: ["none", "PlusIcon", "CheckIcon", "TrashIcon", "EyeIcon"],
			mapping: {
				none: undefined,
				PlusIcon,
				CheckIcon,
				TrashIcon,
				EyeIcon,
			},
			description: "Ícone à esquerda.",
		},
		iconRight: {
			control: "select",
			options: ["none", "PlusIcon", "CheckIcon", "TrashIcon", "EyeIcon"],
			mapping: {
				none: undefined,
				PlusIcon,
				CheckIcon,
				TrashIcon,
				EyeIcon,
			},
			description: "Ícone à direita.",
		},
		iconWeight: {
			control: "select",
			options: ["thin", "light", "regular", "bold", "fill", "duotone"],
			description: "Define o peso do ícone.",
		},
		children: {
			control: "text",
			description: "Texto interno do botão.",
		},
		disabled: {
			control: "boolean",
			description: "Desativa o botão.",
		},
		circle: {
			control: "boolean",
			description: "Deixa o botão redondo e exibe apenas o ícone.",
		},
		floatingOn: {
			control: "select",
			options: [
				"bottom-right",
				"bottom-left",
				"bottom-center",
				"top-right",
				"relative",
				"contextual",
				"none",
			],
			mapping: {
				none: undefined,
			},
			description: "Define a posição do Floating Action Button (FAB).",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Examples: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div className="flex gap-4">
			<Button variant="primary" iconLeft={PlusIcon}>
				Primary
			</Button>
			<Button variant="secondary" iconLeft={PlusIcon}>
				Secondary
			</Button>
			<Button variant="error" iconLeft={PlusIcon}>
				Error
			</Button>
			<Button variant="outline" iconLeft={PlusIcon}>
				Outline
			</Button>
			<Button variant="text" iconLeft={PlusIcon}>
				Text
			</Button>
		</div>
	),
};

export const Primary: Story = {
	args: {
		children: "Button",
		variant: "primary",
		iconLeft: PlusIcon,
		size: "lg",
		state: "default",
	},
};

export const Secondary: Story = {
	args: {
		children: "Button",
		variant: "secondary",
		iconLeft: PlusIcon,
		size: "lg",
		state: "default",
	},
};

export const Error: Story = {
	args: {
		children: "Button",
		variant: "error",
		iconLeft: PlusIcon,
		size: "lg",
		state: "default",
	},
};

export const Outline: Story = {
	args: {
		children: "Button",
		variant: "outline",
		iconLeft: PlusIcon,
		size: "lg",
		state: "default",
	},
};
