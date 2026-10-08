import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon, CheckIcon, TrashIcon, EyeIcon } from "@phosphor-icons/react";
import { Fab } from "../components/Fab/Fab";

const meta: Meta<typeof Fab> = {
	title: "Components/FAB",
	component: Fab,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Floating Action Button baseado no Button, com posições predefinidas e estilo circular.",
			},
		},
	},
	argTypes: {
		children: {
			control: "text",
			description: "Texto exibido ao lado do ícone.",
		},
		icon: {
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
		iconWeight: {
			control: "select",
			options: ["thin", "light", "regular", "bold", "fill", "duotone"],
			description: "Define o peso do ícone.",
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
			],
			description: "Define a posição do FAB.",
		},
		variant: {
			control: "select",
			options: ["primary", "secondary", "text", "error", "outline"],
			description: "Define o estilo visual do FAB.",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "Define o tamanho do FAB.",
		},
		state: {
			control: "select",
			options: ["default", "hover", "pressed", "focused"],
			description: "Define o estado visual do FAB.",
		},
		isLoading: {
			control: "boolean",
			description: "Exibe um spinner de carregamento no FAB.",
		},
		disabled: {
			control: "boolean",
			description: "Desabilita o FAB.",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Fab>;

export const Default: Story = {
	args: {
		icon: PlusIcon,
		"aria-label": "Adicionar",
		floatingOn: "bottom-right",
		children: "Criar",
	},
};

export const Examples: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-4 p-6">
			<Fab icon={PlusIcon} aria-label="Adicionar" floatingOn="contextual" variant="primary" />
			<Fab icon={CheckIcon} aria-label="Confirmar" floatingOn="contextual" variant="secondary" />
			<Fab icon={TrashIcon} aria-label="Excluir" floatingOn="contextual" variant="error" />
			<Fab icon={EyeIcon} aria-label="Ver" floatingOn="contextual" variant="outline" />
			<Fab icon={PlusIcon} aria-label="Texto" floatingOn="contextual" variant="text" />
		</div>
	),
};

export const WithText: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-4 p-6">
			<Fab icon={PlusIcon} aria-label="Adicionar" floatingOn="contextual" circle={false}>
				Adicionar
			</Fab>
			<Fab icon={CheckIcon} aria-label="Confirmar" floatingOn="contextual" circle={false}>
				Confirmar
			</Fab>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-4 p-6">
			<Fab icon={PlusIcon} aria-label="Pequeno" floatingOn="contextual" size="sm" />
			<Fab icon={PlusIcon} aria-label="Medio" floatingOn="contextual" size="md" />
			<Fab icon={PlusIcon} aria-label="Grande" floatingOn="contextual" size="lg" />
		</div>
	),
};
