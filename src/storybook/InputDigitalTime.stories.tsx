import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { InputDigitalTime } from "../components/Input/InputDigitalTime";
import { ClockIcon, TimerIcon, HourglassIcon, CalendarIcon } from "@phosphor-icons/react";

const meta = {
	title: "Form/Inputs/InputTimeDigital",
	component: InputDigitalTime,
	parameters: {
		docs: {
			description: {
				component: "Componente de entrada de tempo digital com unidades individuais editáveis.",
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
		timeUnitLabel: {
			control: "text",
			description: "Label da unidade de tempo",
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
		unit: {
			control: "select",
			options: ["hours", "minutes", "seconds"],
			description: "Unidade de tempo a ser editada",
		},
		value: {
			control: "number",
			description: "Valor numérico da unidade de tempo",
		},
		defaultValue: {
			control: "number",
			description: "Valor padrão da unidade de tempo",
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
	},
} satisfies Meta<typeof InputDigitalTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hours: Story = {
	name: "Horas",
	args: {
		label: "Tempo de estudo",
		unit: "hours",
		timeUnitLabel: "Hora",
		timeUnitIcon: ClockIcon,
		defaultValue: 0,
	},
};

const MultipleUnitsComponent = () => {
	const [hours, setHours] = useState<number>(0);
	const [minutes, setMinutes] = useState<number>(0);
	const [seconds, setSeconds] = useState<number>(0);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex gap-4">
				<InputDigitalTime unit="hours" timeUnitLabel="Hora" value={hours} onChange={setHours} />
				<InputDigitalTime
					unit="minutes"
					timeUnitLabel="Minuto"
					value={minutes}
					onChange={setMinutes}
				/>
				<InputDigitalTime
					unit="seconds"
					timeUnitLabel="Segundo"
					value={seconds}
					onChange={setSeconds}
				/>
			</div>

			<div className="rounded-lg bg-gray-100 p-4 max-w-max">
				<p className="font-mono text-sm">
					Valor: {hours}h {minutes}m {seconds}s
				</p>
			</div>
		</div>
	);
};

export const MultipleUnits = {
	name: "Múltiplas Unidades",
	render: () => <MultipleUnitsComponent />,
};
