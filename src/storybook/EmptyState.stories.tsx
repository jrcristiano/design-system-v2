import type { Meta, StoryObj } from "@storybook/react-vite";
import { MagnifyingGlassIcon, TrayIcon } from "@phosphor-icons/react";
import { fn } from "storybook/test";
import { Button } from "../components/Button/Button";
import { EmptyState } from "../components/EmptyState";

const meta = {
	title: "Components/EmptyState",
	component: EmptyState,
	tags: ["autodocs", "accessibility"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Mensagem reutilizável para listas, buscas e tabelas sem dados. Use title para explicar o estado, description para orientar a próxima ação e action para compor um Button existente. O conteúdo tem role=status por padrão e usa os tokens globais nos temas Light, Dark e System.",
			},
		},
	},
	argTypes: {
		size: { control: "select", options: ["sm", "md"] },
	},
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		title: "Nenhum resultado encontrado",
		description: "Tente ajustar a busca ou os filtros selecionados.",
		icon: <MagnifyingGlassIcon size={32} weight="regular" />,
	},
};

export const WithAction: Story = {
	args: {
		title: "Ainda não há registros",
		description: "Crie o primeiro registro para começar.",
		icon: <TrayIcon size={32} weight="regular" />,
		action: (
			<Button variant="primary" onClick={fn()}>
				Criar registro
			</Button>
		),
	},
};

export const InResultsPanel: Story = {
	args: { title: "Nenhuma pessoa encontrada" },
	render: () => (
		<section className="rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface)]">
			<EmptyState
				title="Nenhuma pessoa encontrada"
				description="Tente outra busca ou limpe os filtros."
				size="sm"
			/>
		</section>
	),
};
