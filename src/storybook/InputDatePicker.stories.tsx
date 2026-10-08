import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputDatePicker } from "../components/Input/InputDatePicker";

const meta = {
	title: "Form/Inputs/DatePicker",
	component: InputDatePicker,
	parameters: {
		docs: {
			description: {
				component: "Componente de seleção de data com calendário integrado usando o design system.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "Texto do label do campo",
			defaultValue: "Data",
		},
		placeholder: {
			control: "text",
			description: "Texto de placeholder do input",
			defaultValue: "Selecione uma data",
		},
		required: {
			control: "boolean",
			description: "Define se o campo é obrigatório",
			defaultValue: false,
		},
		disabled: {
			control: "boolean",
			description: "Desabilita o input",
			defaultValue: false,
		},
		state: {
			control: "select",
			options: ["default", "error"],
			description: "Estado visual do input",
			defaultValue: "default",
		},
		size: {
			control: "select",
			options: ["sm", "md"],
			description: "Tamanho do input",
			defaultValue: "md",
		},
		message: {
			control: "text",
			description: "Mensagem de ajuda ou erro abaixo do input",
		},
		value: {
			control: "text",
			description: "Valor do input (formato: DD/MM/YYYY)",
		},
		onChange: {
			action: "changed",
			description: "Callback quando o valor é alterado",
		},
	},
} satisfies Meta<typeof InputDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DatePicker: Story = {
	name: "DatePicker",
	args: {
		label: "Data",
		placeholder: "Selecione uma data",
		required: true,
	},
};
