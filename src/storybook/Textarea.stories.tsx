import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "../components/Textarea/Textarea";

const meta: Meta<typeof Textarea> = {
	title: "Form/Textarea",
	component: Textarea,
	tags: ["autodocs"],
	args: {
		label: "Descrição",
		rows: 4,
		state: "default",
	},
	argTypes: {
		state: { control: "inline-radio", options: ["default", "error"] },
		rows: { control: { type: "number", min: 2, max: 12 } },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { placeholder: "Conte um pouco mais...", message: "Até 500 caracteres." },
};

export const Error: Story = {
	args: { state: "error", message: "A descrição é obrigatória." },
};

export const Disabled: Story = {
	args: { disabled: true, defaultValue: "Descrição bloqueada" },
};
