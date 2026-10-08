import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon, PlusIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";
import { Chip } from "../components/Chip/Chip";
import "./Chip.stories.inline.css";

const meta: Meta<typeof Chip> = {
	title: "Components/Chip",
	component: Chip,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "Componente Chip para indicar status ou categorias com estilos de destaque.",
			},
		},
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["primary", "success", "danger"],
			description: "Variante visual do chip",
			table: {
				defaultValue: { summary: "primary" },
			},
		},
		state: {
			control: { type: "select" },
			options: ["default", "pressed", "focused", "outline"],
			description: "Estado visual do chip",
			table: {
				defaultValue: { summary: "default" },
			},
		},
		disabled: {
			control: { type: "boolean" },
			description: "Estado desabilitado",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		pill: {
			control: { type: "boolean" },
			description: "Define o formato do chip: pill (true) ou rounded (false).",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "true" },
			},
		},
		children: {
			control: { type: "text" },
			description: "Texto exibido dentro do chip",
		},
		iconLeft: {
			control: { type: "select" },
			options: ["none", "PlusIcon", "CheckIcon", "XIcon"],
			mapping: {
				none: undefined,
				PlusIcon: PlusIcon,
				CheckIcon: CheckIcon,
				XIcon: XIcon,
			},
			description: "Ícone a ser exibido no lado esquerdo",
		},
		iconRight: {
			control: { type: "select" },
			options: ["none", "PlusIcon", "CheckIcon", "XIcon"],
			mapping: {
				none: undefined,
				PlusIcon: PlusIcon,
				CheckIcon: CheckIcon,
				XIcon: XIcon,
			},
			description: "Ícone a ser exibido no lado direito",
		},
	},
	args: {
		children: "Chip",
		variant: "primary",
		state: "default",
		disabled: false,
		pill: true,
		iconLeft: undefined,
		iconRight: undefined,
	},
};

export default meta;

type Story = StoryObj<typeof Chip>;

export const Examples: Story = {
	render: () => (
		<div className="chip-stories-inline-1">
			<div>
				<h3 className="chip-stories-inline-2">Variantes</h3>
				<div className="chip-stories-inline-3">
					<Chip variant="primary">Primary</Chip>
					<Chip variant="success">Success</Chip>
					<Chip variant="danger">Danger</Chip>
					<Chip disabled>Disabled</Chip>
				</div>
			</div>
			<div>
				<h3 className="chip-stories-inline-4">Com Ícones</h3>
				<div className="chip-stories-inline-5">
					<Chip variant="primary" iconLeft={PlusIcon}>
						Create
					</Chip>
					<Chip variant="success" iconLeft={CheckIcon}>
						Success
					</Chip>
					<Chip variant="danger" iconLeft={WarningCircleIcon} iconRight={XIcon}>
						Error
					</Chip>
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Exemplos das variantes e estados disponíveis para o componente Chip.",
			},
		},
	},
};

export const Primary: Story = {
	args: {
		variant: "primary",
		children: "Primary",
	},
};

export const Success: Story = {
	args: {
		variant: "success",
		children: "Success",
		disabled: true,
	},
};

export const Danger: Story = {
	args: {
		variant: "danger",
		children: "Danger",
	},
};

export const Rounded: Story = {
	args: {
		variant: "primary",
		children: "Rounded",
		pill: false,
	},
};
