import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusIndicator } from "../components/StatusIndicator";

const meta = {
	title: "Components/StatusIndicator",
	component: StatusIndicator,
	tags: ["autodocs", "accessibility"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Indicador compacto de estado para linhas, cartões e listas. A cor sempre acompanha um rótulo visível ou um nome acessível quando showLabel=false. Usa os tokens semânticos de feedback e acompanha Light, Dark e System sem lógica de tema própria.",
			},
		},
	},
	argTypes: {
		status: {
			control: "select",
			options: ["success", "warning", "error", "info", "neutral"],
		},
		size: { control: "select", options: ["sm", "md"] },
	},
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: { status: "success", label: "Ativo" },
};

export const AllStatuses: Story = {
	args: { status: "success", label: "Ativo" },
	render: () => (
		<div className="flex flex-wrap gap-[var(--ds-pad-section)] rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface)] p-[var(--ds-pad-card)]">
			<StatusIndicator status="success" label="Ativo" />
			<StatusIndicator status="warning" label="Atenção" />
			<StatusIndicator status="error" label="Erro" />
			<StatusIndicator status="info" label="Pendente" />
			<StatusIndicator status="neutral" label="Inativo" />
		</div>
	),
};

export const DotOnly: Story = {
	args: { status: "info", label: "Pendente", showLabel: false, size: "sm" },
};
