import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../components/Checkbox/Checkbox";
import { useState } from "react";
import { fn } from "storybook/test";

const meta: Meta<typeof Checkbox> = {
	title: "Form/Inputs/Checkbox",
	component: Checkbox,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
Componente Checkbox com suporte a estados visuais (default, hover, pressed, focused, disabled) e estado indeterminado.
        `,
			},
		},
	},
	argTypes: {
		label: {
			control: { type: "text" },
			description: "Define o texto do label ao lado do checkbox.",
			table: {
				type: { summary: "string" },
			},
		},
		checked: {
			control: { type: "boolean" },
			description: "Define se o checkbox está marcado.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		indeterminate: {
			control: { type: "boolean" },
			description:
				"Define se o checkbox está em estado indeterminado (traço). Sobrescreve o ícone de check.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		disabled: {
			control: { type: "boolean" },
			description: "Desativa o checkbox e aplica estilos de estado desabilitado.",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		state: {
			control: false,
			table: { disable: true },
			description:
				"Estado interno do checkbox (usado para estilização em estados como hover, pressed, focused).",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const CheckboxExamples: Story = {
	name: "Checkbox",
	args: {
		label: "Aceito os termos e condições",
		checked: false,
		onChange: fn(),
		indeterminate: false,
		disabled: false,
	},
	render: (args) => {
		const InteractiveExample = () => {
			const [playgroundChecked, setPlaygroundChecked] = useState(args.checked);
			const [groupOptions, setGroupOptions] = useState({
				option1: false,
				option2: true,
				option3: false,
			});

			const allChecked = Object.values(groupOptions).every(Boolean);
			const someChecked = Object.values(groupOptions).some(Boolean) && !allChecked;

			const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
				const newValue = e.target.checked;
				setGroupOptions({
					option1: newValue,
					option2: newValue,
					option3: newValue,
				});
			};

			return (
				<div className="flex flex-col gap-8 min-w-[300px]">
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--ds-color-neutral-30)] mb-4">
							Checkbox Interativo
						</h3>
						<Checkbox
							{...args}
							checked={playgroundChecked}
							onChange={(event) => {
								setPlaygroundChecked(event.target.checked);
								args.onChange?.(event);
							}}
						/>
						<p className="text-sm text-[var(--ds-color-neutral-40)] mt-2">
							Estado:{" "}
							<span className="inline-block w-[110px]">
								{args.indeterminate
									? "Indeterminado"
									: playgroundChecked
										? "Marcado"
										: "Desmarcado"}
							</span>{" "}
							| Use os <strong>Controls</strong> abaixo para testar todas as props
						</p>
					</div>

					<div className="h-px bg-[var(--ds-color-neutral-90)]" />

					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--ds-color-neutral-30)] mb-4">
							Checkbox Group
						</h3>
						<div className="flex flex-col gap-3">
							<Checkbox
								label="Selecionar todos"
								checked={allChecked}
								indeterminate={someChecked}
								onChange={handleSelectAll}
							/>
							<div className="h-px bg-[var(--ds-color-neutral-90)]" />
							<div className="flex flex-col gap-2 pl-4">
								<Checkbox
									label="Opção 1"
									checked={groupOptions.option1}
									onChange={(e) => setGroupOptions({ ...groupOptions, option1: e.target.checked })}
								/>
								<Checkbox
									label="Opção 2"
									checked={groupOptions.option2}
									onChange={(e) => setGroupOptions({ ...groupOptions, option2: e.target.checked })}
								/>
								<Checkbox
									label="Opção 3"
									checked={groupOptions.option3}
									onChange={(e) => setGroupOptions({ ...groupOptions, option3: e.target.checked })}
								/>
							</div>
						</div>
					</div>
				</div>
			);
		};

		return <InteractiveExample />;
	},
};
