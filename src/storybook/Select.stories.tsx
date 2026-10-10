import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "../components/Select/Select";

const meta: Meta<typeof Select> = {
	title: "Form/Select",
	component: Select,
	tags: ["autodocs"],
	args: {
		label: "Status",
		size: "md",
		state: "default",
	},
	argTypes: {
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
		state: { control: "inline-radio", options: ["default", "error"] },
		children: { control: false },
		iconLeft: { control: false },
		iconRight: { control: false },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const options = (
	<>
		<option value="">Selecione um status</option>
		<option value="draft">Rascunho</option>
		<option value="active">Ativo</option>
		<option value="archived">Arquivado</option>
	</>
);

export const Default: Story = {
	args: { message: "Escolha o status atual." },
	render: (args) => <Select {...args}>{options}</Select>,
};

export const Error: Story = {
	args: { state: "error", message: "Selecione um status válido." },
	render: (args) => <Select {...args}>{options}</Select>,
};

export const Disabled: Story = {
	args: { disabled: true, message: "Este valor não pode ser alterado." },
	render: (args) => <Select {...args}>{options}</Select>,
};
