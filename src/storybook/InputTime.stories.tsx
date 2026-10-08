import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputTime } from "../components/Input/InputTime";
import { ClockIcon, TimerIcon, HourglassIcon, CalendarIcon } from "@phosphor-icons/react";

const meta = {
	title: "Form/Inputs/Time",
	component: InputTime,
	parameters: {
		docs: {
			description: {
				component: "Componente de entrada de tempo usando input nativo HTML time.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "Texto do label do campo",
		},
		hint: {
			control: "text",
			description: "Texto de ajuda abaixo do input",
		},
		timeUnitIcon: {
			control: "select",
			options: ["none", "ClockIcon", "TimerIcon", "HourglassIcon", "CalendarIcon"],
			mapping: {
				none: undefined,
				ClockIcon,
				TimerIcon,
				HourglassIcon,
				CalendarIcon,
			},
			description: "Ícone da unidade de tempo.",
		},
		format: {
			control: "select",
			options: ["HH:MM", "HH:MM:SS", "MM:SS"],
			description: "Formato da máscara de tempo",
			defaultValue: "HH:MM",
		},
		value: {
			control: "object",
			description: "Valor do input no formato {hours, minutes, seconds}",
		},
		defaultValue: {
			control: "object",
			description: "Valor padrão do input",
		},
		onChange: {
			action: "changed",
			description: "Callback quando o valor é alterado",
		},
		disabled: {
			control: "boolean",
			description: "Desabilita o input",
			defaultValue: false,
		},
		required: {
			control: "boolean",
			description: "Define se o campo é obrigatório",
			defaultValue: false,
		},
		state: {
			control: "select",
			options: ["default", "focus"],
			description: "Estado visual do input",
			defaultValue: "default",
		},
	},
} satisfies Meta<typeof InputTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Time: Story = {
	args: {
		label: "Duração",
		hint: "Selecione a duração em horas",
		format: "HH:MM",
		timeUnitIcon: ClockIcon,
		defaultValue: { hours: 0, minutes: 10, seconds: 0 },
	},
};
