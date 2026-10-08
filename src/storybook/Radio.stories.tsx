import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio } from "../components/Radio/Radio";
import { useState } from "react";

const meta: Meta<typeof Radio> = {
	title: "Form/Inputs/Radio",
	component: Radio,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "Componente Radio Button com suporte a estados visuais e seleção única.",
			},
		},
	},
	argTypes: {
		label: {
			control: { type: "text" },
			description: "Define o texto do label ao lado do radio button.",
			table: {
				type: { summary: "string" },
			},
		},
		disabled: {
			control: { type: "boolean" },
			description: "Desativa o radio button.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const RadioExamples: Story = {
	name: "Radio",
	render: (args) => {
		const RadioGroup = () => {
			const [selected, setSelected] = useState("option1");

			return (
				<div className="flex flex-col">
					<Radio
						label={args.label}
						disabled={args.disabled}
						name="radio-group"
						checked={selected === "option1"}
						onChange={() => setSelected("option1")}
					/>
					<Radio
						label={args.label}
						disabled={args.disabled}
						name="radio-group"
						checked={selected === "option2"}
						onChange={() => setSelected("option2")}
					/>
					<Radio
						label={args.label}
						disabled={args.disabled}
						name="radio-group"
						checked={selected === "option3"}
						onChange={() => setSelected("option3")}
					/>
				</div>
			);
		};

		return <RadioGroup />;
	},
	args: {
		label: "Opção",
		disabled: false,
	},
};
