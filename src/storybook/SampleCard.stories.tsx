import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon, TrashIcon, XIcon } from "@phosphor-icons/react";
import { SampleCard } from "./components/SampleCard";

const outlinedTags = [
	{ label: "Label 1", variant: "primary", state: "outline", pill: false },
	{ label: "Label 2", variant: "primary", state: "outline", pill: false },
	{ label: "Label 3", variant: "primary", state: "outline", pill: false },
] as const;

const meta: Meta<typeof SampleCard> = {
	title: "Components/SampleCard",
	component: SampleCard,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Card de exemplo com imagem, título, subtítulo e botões. Suporta layouts vertical e horizontal.",
			},
		},
	},
	decorators: [
		(Story, context) => (
			<div
				style={{
					width: "100%",
					maxWidth: context.args.layout === "horizontal" ? "650px" : "380px",
					margin: "0 auto",
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		title: {
			control: "text",
			description: "Título principal do card.",
		},
		subtitle: {
			control: "text",
			description: "Subtítulo exibido abaixo do título.",
		},
		titleOnly: {
			control: "boolean",
			description: "Quando true, exibe apenas o título no conteúdo do card.",
			if: { arg: "layout", eq: "horizontal" },
		},
		imageSrc: {
			control: "text",
			description: "URL da imagem de capa.",
		},
		imageVariant: {
			control: { type: "select" },
			options: ["square", "circle"],
			description: "Define o formato visual da imagem.",
			if: { arg: "layout", eq: "horizontal" },
		},
		imageAspectRatio: {
			control: "text",
			description: "Aspect ratio da imagem (ex.: 348/242, 16/9).",
		},
		layout: {
			control: { type: "select" },
			options: ["vertical", "horizontal"],
			description: "Define o layout do card.",
		},
		buttonLayout: {
			control: { type: "select" },
			options: ["full", "inline", "stacked"],
			description: "Define o layout dos botões de ação.",
		},
		buttonAlign: {
			control: { type: "select" },
			options: ["right", "left", "full"],
			description: "Define o alinhamento do bloco de botões.",
		},
		primaryActionLabel: {
			control: "text",
			description: "Texto do botão primário.",
		},
		onPrimaryAction: {
			control: false,
			table: { disable: true },
		},
		secondaryActionLabel: {
			control: "text",
			description: "Texto opcional do botão secundário.",
		},
		onSecondaryAction: {
			control: false,
			table: { disable: true },
		},
		secondaryActionIconPosition: {
			control: { type: "select" },
			options: ["left", "right"],
			description: "Posição do ícone no botão secundário.",
		},
		primaryActionIconRight: {
			control: false,
			description: "Ícone exibido à direita no botão primário.",
		},
		actionAriaLabel: {
			control: "text",
			description: "Aria-label da action do card.",
		},
		onActionClick: {
			control: false,
			table: { disable: true },
		},
		actionSize: {
			control: { type: "select" },
			options: ["sm", "md", "lg"],
			description: "Tamanho do botão de action.",
		},
	},
	args: {
		title: "Title 1",
		subtitle:
			"Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
		titleOnly: false,
		imageVariant: "square",
		imageAspectRatio: "348/242",
		layout: "vertical",
		buttonLayout: "full",
		buttonAlign: "full",
		primaryActionLabel: "Button",
		secondaryActionLabel: "",
		primaryActionIconRight: PlusIcon,
		actionSize: "lg",
	},
};

export default meta;
type Story = StoryObj<typeof SampleCard>;

export const Default: Story = {};

export const Horizontal: Story = {
	args: {
		layout: "horizontal",
	},
};

export const WithCustomImage: Story = {
	args: {
		imageSrc:
			"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
	},
};

export const WithTags: Story = {
	args: {
		tags: outlinedTags,
	},
};

export const HorizontalWithTags: Story = {
	args: {
		layout: "horizontal",
		tags: outlinedTags,
	},
};

export const WideImage: Story = {
	args: {
		imageAspectRatio: "16/9",
	},
};

export const InlineButtons: Story = {
	args: {
		buttonLayout: "inline",
		buttonAlign: "right",
	},
};

export const InlineButtonsLeft: Story = {
	args: {
		buttonLayout: "inline",
		buttonAlign: "left",
	},
};

export const InlineButtonsFull: Story = {
	args: {
		buttonLayout: "inline",
		buttonAlign: "full",
	},
};

export const StackedButtons: Story = {
	args: {
		buttonLayout: "stacked",
		secondaryActionLabel: "Button",
	},
};

export const PrimaryAndSecondaryActions: Story = {
	args: {
		buttonLayout: "inline",
		primaryActionLabel: "Button",
		secondaryActionLabel: "Button",
		secondaryActionIcon: PlusIcon,
		secondaryActionIconPosition: "right",
	},
};

export const WithActionHorizontal: Story = {
	args: {
		layout: "horizontal",
		actionIcon: TrashIcon,
		actionAriaLabel: "Executar ação do card",
	},
};

export const WithActionVertical: Story = {
	args: {
		layout: "vertical",
		actionIcon: XIcon,
		actionAriaLabel: "Fechar card",
		actionSize: "sm",
	},
};

export const WithoutSubtitle: Story = {
	args: {
		subtitle: "",
	},
};

export const CircleImage: Story = {
	args: {
		layout: "horizontal",
		imageVariant: "circle",
	},
};

export const TitleOnly: Story = {
	args: {
		layout: "horizontal",
		titleOnly: true,
	},
};
