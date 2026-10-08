import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stopwatch } from "../components/Stopwatch/Stopwatch";
import { useState } from "react";
import type { StopwatchValue } from "../components/Stopwatch/Stopwatch.interface";

const meta: Meta<typeof Stopwatch> = {
	title: "Components/Stopwatch",
	component: Stopwatch,
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: { type: "text" },
			description: "Define o texto do label.",
			table: { type: { summary: "string" } },
		},
		disabled: {
			control: { type: "boolean" },
			description: "Define se o componente está desabilitado.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		autoStart: {
			control: { type: "boolean" },
			description: "Inicia automaticamente o cronômetro.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
	},
	parameters: {
		docs: {
			description: {
				component:
					"Componente de cronômetro com contagem automática e controles de play, pause e reset.",
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof Stopwatch>;

/**
 * **Estado: Default (Parado)**
 */
export const Default: Story = {
	args: {
		label: "Cronômetro Parado",
	},
};

/**
 * **Estado: Em Execução**
 */
export const Running: Story = {
	args: {
		label: "Cronômetro em Execução",
		autoStart: true,
	},
};

/**
 * **Estado: Pausado**
 */
export const Paused: Story = {
	args: {
		label: "Cronômetro Pausado",
		defaultValue: {
			hours: 0,
			minutes: 0,
			seconds: 1,
		},
	},
};

/**
 * **Estado: Reset**
 */
export const Reset: Story = {
	args: {
		label: "Cronômetro aguardando Reset",
		defaultValue: {
			hours: 0,
			minutes: 0,
			seconds: 5,
		},
		value: {
			hours: 0,
			minutes: 0,
			seconds: 5,
		},
	},
};

/**
 * **Comparação de Todos os Estados**
 */
const AllStatesComponent = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
			<div className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg">
				<h3 className="font-semibold text-sm text-gray-700">Default (Parado)</h3>
				<Stopwatch />
			</div>

			<div className="flex flex-col items-center gap-2 p-4 border border-green-200 rounded-lg bg-green-50">
				<h3 className="font-semibold text-sm text-gray-700">Running (Em Execução)</h3>
				<Stopwatch autoStart />
			</div>

			<div className="flex flex-col items-center gap-2 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
				<h3 className="font-semibold text-sm text-gray-700">Paused (Pausado)*</h3>
				<Stopwatch defaultValue={{ hours: 0, minutes: 0, seconds: 1 }} />
				<p className="text-xs text-gray-500 text-center">*Inicie e pause manualmente</p>
			</div>

			<div className="flex flex-col items-center gap-2 p-4 border border-blue-200 rounded-lg bg-blue-50">
				<h3 className="font-semibold text-sm text-gray-700">Reset</h3>
				<Stopwatch
					defaultValue={{ hours: 0, minutes: 0, seconds: 5 }}
					value={{ hours: 0, minutes: 0, seconds: 5 }}
				/>
				<p className="text-xs text-gray-500 text-center">Clique no botão de reset</p>
			</div>
		</div>
	);
};

export const AllStates: Story = {
	render: () => <AllStatesComponent />,
};

/**
 * Cronômetro desabilitado.
 */
export const Disabled: Story = {
	args: {
		label: "Cronômetro Desabilitado",
		disabled: true,
	},
};

/**
 * Cronômetro com limite de tempo definido.
 */
const WithTimeLimitComponent = () => {
	const [value] = useState<StopwatchValue>({
		hours: 0,
		minutes: 0,
		seconds: 10,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<p className="text-sm text-gray-600">Cronômetro configurado para parar em 10 segundos</p>
			<Stopwatch value={value} autoStart />
		</div>
	);
};

export const WithTimeLimit: Story = {
	render: () => <WithTimeLimitComponent />,
};

/**
 * Cronômetro com callbacks para todos os eventos.
 * Demonstra como capturar eventos de start, pause, reset e mudanças de valor.
 */
const WithCallbacksComponent = () => {
	const [currentTime, setCurrentTime] = useState<StopwatchValue>({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [events, setEvents] = useState<string[]>([]);

	const addEvent = (event: string) => {
		setEvents((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${event}`].slice(-5));
	};

	return (
		<div className="flex flex-col items-center gap-4">
			<Stopwatch
				onChange={setCurrentTime}
				onStart={() => addEvent("▶️ Iniciado")}
				onPause={() => addEvent("⏸️ Pausado")}
				onReset={() => addEvent("🔄 Resetado")}
			/>
			<div className="rounded-lg bg-gray-100 p-4 min-w-[300px]">
				<p className="font-mono text-sm text-center mb-2">
					Tempo: {String(currentTime.hours).padStart(2, "0")}:
					{String(currentTime.minutes).padStart(2, "0")}:
					{String(currentTime.seconds).padStart(2, "0")}
				</p>
				<div className="border-t border-gray-300 pt-2">
					<p className="text-xs font-semibold mb-1">Eventos:</p>
					{events.length === 0 ? (
						<p className="text-xs text-gray-500">Nenhum evento registrado</p>
					) : (
						<ul className="text-xs space-y-1">
							{events.map((event, i) => (
								<li key={i} className="text-gray-700">
									{event}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export const WithCallbacks: Story = {
	render: () => <WithCallbacksComponent />,
};
