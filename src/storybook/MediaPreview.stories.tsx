import type { Meta, StoryObj } from "@storybook/react-vite";
import MediaPreview from "../components/MediaPreview/MediaPreview";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { RichText } from "../components/RichText";

const meta: Meta<typeof MediaPreview> = {
	title: "Form/Inputs/MediaPreview",
	component: MediaPreview,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		label: {
			control: { type: "text" },
			description: "Label exibido no card (mesmo estilo do Input).",
			table: { type: { summary: "string" }, defaultValue: { summary: "Preview" } },
		},
		required: {
			control: { type: "boolean" },
			description: "Exibe marcador de obrigatorio no label.",
			table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
		},
		disabled: {
			control: { type: "boolean" },
			description: "Desativa interacoes e altera o estilo do label.",
			table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
		},
		multiple: {
			control: { type: "boolean" },
			description: "Permite selecionar multiplos arquivos (ultimo selecionado sera exibido).",
			table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
		},
		maxTotalSizeMb: {
			control: { type: "number" },
			description: "Tamanho máximo permitido (MB).",
			table: { type: { summary: "number" }, defaultValue: { summary: "10" } },
		},
		className: {
			table: { disable: true },
			description: "Classes CSS adicionais para estilização do componente.",
		},
		title: {
			table: { disable: true },
			description: "Título opcional para o preview de mídia.",
		},
		onChange: {
			table: { disable: true },
			description: "Callback disparado quando o arquivo de mídia é alterado.",
		},
	},
};

export default meta;
type Story = StoryObj<typeof MediaPreview>;

export const Default: Story = {
	args: {
		label: "Preview",
		required: false,
		disabled: false,
		multiple: false,
		maxTotalSizeMb: 10,
	},
	render: (args) => (
		<div className="w-full">
			<MediaPreview {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: `
Componente para visualizar midias locais (JPG, PNG, PDF, MP3, MP4).
				`,
			},
		},
	},
};

export const FormWithPreview: Story = {
	args: {
		label: "Preview",
		required: true,
		disabled: false,
		multiple: true,
		maxTotalSizeMb: 10,
	},
	render: (args) => (
		<div className="mx-auto w-lg px-6 py-6 border mt-10 rounded-[12px] border-[var(--ds-color-neutral-90)] shadow-sm">
			<form className="grid gap-6 md:grid-cols-[1fr,1.2fr]">
				<div className="space-y-4">
					<Input label="Titulo" placeholder="Digite o titulo" required />
					<RichText label="Descrição" placeholder="Digite a Descrição" required />
					<MediaPreview {...args} />
					<Button type="button" variant="primary" className="w-full">
						Salvar
					</Button>
				</div>
			</form>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Exemplo de formulario com Titulo, Descrição e o MediaPreview ao lado.",
			},
		},
	},
};
