import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DateDropdownPicker } from "../components/DateDropdownPicker/DateDropdownPicker";

const meta = {
	title: "Form/Inputs/DateDropdownPicker",
	component: DateDropdownPicker,
	tags: ["autodocs"],
	parameters: {
		docs: {
			description: {
				component:
					"Seletor de data controlado. Confirme a data no calendário para chamar onChange.",
			},
		},
	},
	argTypes: {
		value: { control: "text", description: "Data no formato DD/MM/AAAA." },
		variant: { control: "select", options: ["primary", "secondary", "text", "error", "outline"] },
		size: { control: "select", options: ["sm", "md", "lg"] },
		placeholder: { control: "text" },
		onChange: { description: "Chamado após a confirmação de uma data." },
	},
} satisfies Meta<typeof DateDropdownPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledDatePicker(args: ComponentProps<typeof DateDropdownPicker>) {
	const [value, setValue] = useState(args.value);

	return (
		<DateDropdownPicker
			{...args}
			value={value}
			onChange={(nextValue) => {
				setValue(nextValue);
				args.onChange(nextValue);
			}}
		/>
	);
}

export const Empty: Story = {
	args: { value: "", onChange: fn() },
	render: (args) => <ControlledDatePicker key={args.value} {...args} />,
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("button", { name: "Selecione uma data" }));
		const day = canvas.getAllByRole("button").find((button) => button.textContent?.trim() === "15");
		if (!day) throw new Error("O calendário não exibiu o dia 15");
		await userEvent.click(day);
		await userEvent.click(canvas.getByRole("button", { name: "Confirmar seleção de data" }));
		await expect(args.onChange).toHaveBeenCalledWith(expect.stringMatching(/^15\/\d{2}\/\d{4}$/));
	},
};

export const WithDate: Story = {
	args: { value: "25/12/2025", onChange: fn(), size: "md" },
	render: (args) => <ControlledDatePicker key={args.value} {...args} />,
};

export const Secondary: Story = {
	args: { value: "", onChange: fn(), variant: "secondary", size: "sm" },
	render: (args) => <ControlledDatePicker key={args.value} {...args} />,
};
