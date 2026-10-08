import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	CloudArrowUpIcon,
	FileCloudIcon,
	TrashIcon,
	XIcon,
	XCircleIcon,
} from "@phosphor-icons/react";

import { InputUpload } from "../components/Input/InputUpload";

const meta: Meta<typeof InputUpload> = {
	title: "Form/Inputs/Upload",
	component: InputUpload,
	tags: ["autodocs"],
	argTypes: {
		message: {
			control: { type: "text" },
			description: "Mensagem exibida abaixo do campo de upload.",
			table: { type: { summary: "string" } },
		},
		multiple: {
			control: { type: "boolean" },
			description: "Permite upload de múltiplos arquivos.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "true" },
			},
		},
		maxSize: {
			control: { type: "number" },
			description: "Tamanho máximo do arquivo em MB.",
			table: {
				type: { summary: "number" },
				defaultValue: { summary: "5" },
			},
		},
		acceptedFormats: {
			control: { type: "object" },
			description: "Formatos de arquivo aceitos (ex: ['pdf', 'doc', 'docx']).",
			table: {
				type: { summary: "string[]" },
				defaultValue: { summary: "['pdf', 'doc', 'docx']" },
			},
		},
		tooltipContent: {
			control: { type: "text" },
			description: "Conteúdo do tooltip. Se vazio, o tooltip não será exibido.",
			table: {
				type: { summary: "ReactNode" },
				defaultValue: { summary: "undefined" },
			},
		},
		disabled: {
			control: { type: "boolean" },
			description: "Desativa o campo de upload.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		iconLeft: {
			control: { type: "select" },
			options: ["none", "CloudArrowUpIcon", "FileCloudIcon"],
			mapping: {
				none: undefined,
				CloudArrowUpIcon: <CloudArrowUpIcon />,
				FileCloudIcon: <FileCloudIcon />,
			},
			description: "Ícone exibido no estado vazio (lado esquerdo do texto).",
			table: { type: { summary: "ReactNode" } },
		},
		iconRight: {
			control: { type: "select" },
			options: ["none", "TrashIcon", "XIcon", "XCircleIcon"],
			mapping: {
				none: undefined,
				TrashIcon: <TrashIcon />,
				XIcon: <XIcon />,
				XCircleIcon: <XCircleIcon />,
			},
			description: "Ícone de remoção/cancelamento de arquivo.",
			table: { type: { summary: "ReactNode" } },
		},
		onFilesChange: {
			table: { disable: true },
			description: "Callback disparado quando a lista de arquivos selecionados muda.",
		},
		onUploadComplete: {
			table: { disable: true },
			description: "Callback disparado quando o upload de um arquivo é concluído com sucesso.",
		},
		onUploadError: {
			table: { disable: true },
			description: "Callback disparado quando ocorre um erro durante o upload de um arquivo.",
		},
		onRemoveFile: {
			table: { disable: true },
			description: "Callback disparado quando um arquivo é removido.",
		},
		files: {
			table: { disable: true },
			description: "Lista de arquivos atualmente selecionados ou em upload.",
		},
	},
};

export default meta;
type Story = StoryObj<typeof InputUpload>;

export const Upload: Story = {
	args: {
		message: "",
		multiple: true,
		maxSize: 5,
		acceptedFormats: ["pdf", "doc", "docx"],
		tooltipContent: "Clique para remover o arquivo",
		disabled: false,
		iconLeft: <CloudArrowUpIcon />,
		iconRight: <TrashIcon />,
	},
	render: (args) => {
		return (
			<div className="max-w-2xl mx-auto">
				<InputUpload {...args} />
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: `
Componente de upload de arquivos com suporte a:

- **Drag & Drop**: Arraste arquivos para o campo
- **Múltiplos arquivos**: Configurável via prop \`multiple\`
- **Validação**: Tamanho e formato de arquivo
- **Progress tracking**: Barra de progresso durante upload
- **Estados visuais**: Idle, Uploading, Completed, Error
- **Tooltip**: Exibido automaticamente quando \`tooltipContent\` tem valor

**Configurações disponíveis nos Controls:**
- \`message\`: Mensagem de ajuda
- \`multiple\`: Permite múltiplos arquivos
- \`maxSize\`: Tamanho máximo em MB
- \`acceptedFormats\`: Array de extensões aceitas
- \`tooltipContent\`: Conteúdo do tooltip (se vazio, tooltip não aparece)
- \`disabled\`: Desativa o componente
				`,
			},
		},
	},
};
