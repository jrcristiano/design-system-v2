import type { Meta, StoryObj } from "@storybook/react-vite";
import * as Yup from "yup";
import { Input } from "../components/Input/Input";
import {
	CheckIcon,
	EyeIcon,
	LinkIcon,
	MagnifyingGlassIcon,
	PlusIcon,
	SpinnerIcon,
	TrashIcon,
	UserCircleIcon,
} from "@phosphor-icons/react";
import { Form, Formik } from "formik";
import { Button } from "../components/Button/Button";
import { documentSchema } from "../validators/document/document.schema";

const meta: Meta<typeof Input> = {
	title: "Form/Inputs",
	component: Input,
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: { type: "select" },
			options: ["sm", "md"],
			description: "Define o tamanho do input.",
			table: {
				type: { summary: '"sm" | "md"' },
				defaultValue: { summary: "md" },
			},
		},
		state: {
			control: { type: "select" },
			options: ["default", "error"],
			description: "Define o estado do input.",
			table: {
				type: { summary: '"default" | "error"' },
				defaultValue: { summary: "default" },
			},
		},
		required: {
			control: { type: "boolean" },
			description: "Define se o campo é obrigatório ou não.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		label: {
			control: { type: "text" },
			description: "Define o texto do label.",
			table: { type: { summary: "string" } },
		},
		placeholder: {
			control: { type: "text" },
			description: "Define o placeholder do input.",
			table: { type: { summary: "string" } },
		},
		message: {
			control: { type: "text" },
			description: "Mensagem exibida abaixo do campo.",
			table: { type: { summary: "string" } },
		},
		autoComplete: {
			control: { type: "select" },
			options: ["on", "off"],
			description: "Define o comportamento de autocompletar do HTML5.",
			table: { type: { summary: "string" }, defaultValue: { summary: "off" } },
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
			description: "Define o ícone à esquerda do input.",
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
			description: "Define o ícone à direita do input.",
			table: { type: { summary: "ReactNode" } },
		},
		disabled: {
			control: { type: "boolean" },
			description: "Desativa o campo de input.",
			table: { type: { summary: "boolean" } },
		},
		type: {
			control: { type: "select" },
			options: ["text", "email", "password", "number", "search", "tel", "url", "CPF/CNPJ"],
			description: "Define o tipo de input (HTML padrão).",
			table: { type: { summary: "string" }, defaultValue: { summary: "text" } },
		},
		mask: {
			control: { type: "text" },
			type: { name: "string" },
			description: "Define a máscara aplicada ao input.",
			table: { type: { summary: "string" } },
		},
	},
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Examples = {
	render: () => (
		<div className="max-w-md mx-auto">
			<Formik
				initialValues={{ name: "", email: "", cpf: "" }}
				validationSchema={Yup.object({
					name: Yup.string()
						.min(3, "O nome deve ter pelo menos 3 caracteres")
						.required("Campo obrigatório"),
					email: Yup.string().email("E-mail inválido").required("Campo obrigatório"),
					cpf: documentSchema.fields.document,
				})}
				onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
			>
				{({ handleSubmit, isSubmitting }) => (
					<Form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<Input name="name" label="Nome" placeholder="Digite seu nome" required />
						<Input
							name="email"
							label="E-mail"
							type="email"
							placeholder="Digite seu e-mail"
							required
						/>
						<Input
							name="cpf"
							label="CPF"
							type="text"
							placeholder="Digite seu CPF"
							mask="000.000.000-00"
							required
						/>
						<Button
							iconLeft={CheckIcon}
							size="lg"
							disabled={isSubmitting}
							variant="primary"
							type="submit"
						>
							{isSubmitting ? "Enviando..." : "Enviar"}
						</Button>
					</Form>
				)}
			</Formik>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: `
Formulário completo com **validação Yup** e campo de **CPF/CNPJ** utilizando \`cpf-cnpj-validator\`.

O campo é renderizado via **InputDocumentFormik**, integrado ao Design System.
				`,
			},
		},
	},
};

export const Text: Story = {
	args: {
		label: "Nome",
		type: "text",
		placeholder: "Digite seu nome",
		required: true,
		iconLeft: <UserCircleIcon />,
		iconRight: undefined,
		state: "default",
		size: "md",
		message: "Este é um texto de dica para ajudar o usuário.",
	},
};

export const Email: Story = {
	args: {
		label: "E-mail",
		type: "email",
		placeholder: "exemplo@email.com",
		iconLeft: <CheckIcon />,
		state: "default",
		size: "md",
		message: "Digite um e-mail válido.",
	},
};

export const Password: Story = {
	args: {
		label: "Senha",
		type: "password",
		placeholder: "Digite sua senha",
		iconRight: <EyeIcon />,
		state: "default",
		size: "md",
		message: "Sua senha deve conter pelo menos 8 caracteres.",
	},
};

export const Number: Story = {
	args: {
		label: "Idade",
		type: "number",
		placeholder: "Digite sua idade",
		iconLeft: <PlusIcon />,
		state: "default",
		size: "md",
	},
};

export const Search: Story = {
	args: {
		label: "Pesquisar",
		type: "search",
		placeholder: "Buscar conteúdo...",
		iconLeft: <MagnifyingGlassIcon />,
		size: "md",
	},
};

export const Tel: Story = {
	args: {
		label: "Telefone",
		type: "tel",
		placeholder: "(00) 00000-0000",
		iconLeft: <UserCircleIcon />,
		state: "default",
		size: "md",
		mask: "(00) 00000-0000",
	},
};

export const Url: Story = {
	args: {
		label: "Website",
		type: "url",
		placeholder: "https://exemplo.com",
		iconLeft: <LinkIcon />,
		state: "default",
		size: "md",
	},
};
