import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { InputMasked } from "../components/Input/InputMasked";
import {
	CheckIcon,
	EyeIcon,
	MagnifyingGlassIcon,
	PlusIcon,
	SpinnerIcon,
	TrashIcon,
	UserCircleIcon,
} from "@phosphor-icons/react";
import type { InputProps } from "../components/Input/Input.interface";

const meta: Meta<typeof InputMasked> = {
	title: "Form/Inputs",
	component: InputMasked,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: { type: "select" },
			options: ["sm", "md"],
			description: "Define o tamanho do input.",
			table: { type: { summary: '"sm" | "md"' }, defaultValue: { summary: "md" } },
		},
		state: {
			control: { type: "select" },
			options: ["default", "error"],
			description: "Define o estado do input.",
			table: { type: { summary: '"default" | "error"' }, defaultValue: { summary: "default" } },
		},
		required: {
			control: { type: "boolean" },
			description: "Define se o campo é obrigatório ou não.",
			table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
		},
		label: {
			control: { type: "text" },
			description: "Texto do label exibido acima do campo.",
			table: { type: { summary: "string" } },
		},
		placeholder: {
			control: { type: "text" },
			description: "Placeholder do input.",
			table: { type: { summary: "string" } },
		},
		message: {
			control: { type: "text" },
			description: "Mensagem exibida abaixo do campo.",
			table: { type: { summary: "string" } },
		},
		iconLeft: {
			control: { type: "select" },
			options: [
				"none",
				"MagnifyingGlassIcon",
				"PlusIcon",
				"CheckIcon",
				"TrashIcon",
				"EyeIcon",
				"SpinnerIcon",
				"UserCircleIcon",
			],
			mapping: {
				none: undefined,
				MagnifyingGlassIcon: <MagnifyingGlassIcon />,
				PlusIcon: <PlusIcon />,
				CheckIcon: <CheckIcon />,
				TrashIcon: <TrashIcon />,
				EyeIcon: <EyeIcon />,
				SpinnerIcon: <SpinnerIcon />,
				UserCircleIcon: <UserCircleIcon />,
			},
			description: "Ícone exibido à esquerda do input.",
			table: { type: { summary: "ReactNode" } },
		},
		iconRight: {
			control: { type: "select" },
			options: [
				"none",
				"MagnifyingGlassIcon",
				"PlusIcon",
				"CheckIcon",
				"TrashIcon",
				"EyeIcon",
				"SpinnerIcon",
				"UserCircleIcon",
			],
			mapping: {
				none: undefined,
				MagnifyingGlassIcon: <MagnifyingGlassIcon />,
				PlusIcon: <PlusIcon />,
				CheckIcon: <CheckIcon />,
				TrashIcon: <TrashIcon />,
				EyeIcon: <EyeIcon />,
				SpinnerIcon: <SpinnerIcon />,
				UserCircleIcon: <UserCircleIcon />,
			},
			description: "Ícone exibido à direita do input.",
			table: { type: { summary: "ReactNode" } },
		},
		disabled: {
			control: { type: "boolean" },
			description: "Desativa o campo de input.",
			table: { type: { summary: "boolean" } },
		},
		type: {
			control: { type: "select" },
			options: ["text", "email", "password", "number", "search", "tel", "url"],
			description: "Tipo HTML padrão do input.",
			table: { type: { summary: "string" }, defaultValue: { summary: "text" } },
		},
		mask: {
			control: { type: "text" },
			type: { name: "string", required: true },
			description:
				"Define a máscara aplicada ao input. Ex: (00) 00000-0000, 00000-000, 00/00/0000.",
			table: { type: { summary: "string" } },
		},
		onChangeRaw: {
			action: "changed",
			description: "Callback acionado ao alterar o valor sem máscara.",
			table: { type: { summary: "(rawValue: string) => void" } },
		},
	},
};

export default meta;

type Story = StoryObj<typeof InputMasked>;

export const GenericMask: Story = {
	name: "Mask",
	args: {
		label: "Telefone",
		placeholder: "(00) 00000-0000",
		mask: "(00) 00000-0000",
		message: "Insira um número válido.",
		state: "default",
		size: "md",
		required: true,
		iconLeft: <UserCircleIcon />,
		iconRight: undefined,
		disabled: false,
		onChangeRaw: fn(),
	} satisfies InputProps,
	render: (args) => <InputMasked {...args} />,
	play: async ({ args, canvasElement }) => {
		const input = within(canvasElement).getByRole("textbox", { name: /Telefone/ });
		await userEvent.type(input, "11987654321");
		await expect(args.onChangeRaw).toHaveBeenCalledWith("11987654321");
	},
	parameters: {
		docs: {
			description: {
				story: `
Input genérico com **máscara customizável**.
Permite configurar dinamicamente a prop \`mask\` no painel de controles do Storybook.

**Exemplos de máscaras:**
- **Telefone:** \`(00) 00000-0000\`
- **CEP:** \`00000-000\`
- **CPF:** \`000.000.000-00\`
- **Data:** \`00/00/0000\`
				`,
			},
		},
	},
};
