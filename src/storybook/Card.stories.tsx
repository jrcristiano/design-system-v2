import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	BookOpenIcon,
	GraduationCapIcon,
	ChartLineIcon,
	UsersIcon,
	ClipboardTextIcon,
	TrophyIcon,
	RocketIcon,
	LightbulbIcon,
} from "@phosphor-icons/react";
import { Card } from "../components/Card";

const meta: Meta<typeof Card> = {
	title: "EJA/Cards",
	component: Card,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Card do EJA com múltiplas variantes: simples (com barra lateral), type1 (com chip, progresso e botão) e type2 (com chip, progresso e dois botões).",
			},
		},
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["simple", "type1", "type2"],
			description: "Variante do card",
			table: {
				type: { summary: "simple | type1 | type2" },
				defaultValue: { summary: "simple" },
			},
		},
		title: {
			control: { type: "text" },
			description: "Título principal exibido no card",
			table: {
				type: { summary: "string" },
			},
		},
		progressIcon: {
			control: { type: "select" },
			options: [
				"none",
				"BookOpenIcon",
				"GraduationCapIcon",
				"ChartLineIcon",
				"UsersIcon",
				"ClipboardTextIcon",
				"TrophyIcon",
				"RocketIcon",
				"LightbulbIcon",
			],
			mapping: {
				none: undefined,
				BookOpenIcon: BookOpenIcon,
				GraduationCapIcon: GraduationCapIcon,
				ChartLineIcon: ChartLineIcon,
				UsersIcon: UsersIcon,
				ClipboardTextIcon: ClipboardTextIcon,
				TrophyIcon: TrophyIcon,
				RocketIcon: RocketIcon,
				LightbulbIcon: LightbulbIcon,
			},
			description: "Ícone exibido na seção de progresso (apenas type1 e type2)",
			table: {
				type: { summary: "React.ElementType" },
			},
			if: { arg: "variant", neq: "simple" },
		},
		chipLabel: {
			control: { type: "text" },
			description: "Label do chip (opcional para simple, obrigatório para type1 e type2)",
		},
		subtitle: {
			control: { type: "text" },
			description: "Subtítulo do card (apenas type1 e type2)",
			if: { arg: "variant", neq: "simple" },
		},
		progress: {
			control: { type: "range", min: 0, max: 100, step: 1 },
			description: "Percentual de progresso (apenas type1 e type2)",
			if: { arg: "variant", neq: "simple" },
		},
		primaryButtonText: {
			control: { type: "text" },
			description: "Texto do botão principal (apenas type1 e type2)",
			if: { arg: "variant", neq: "simple" },
		},
		secondaryButtonText: {
			control: { type: "text" },
			description: "Texto do botão secundário (apenas type2)",
			if: { arg: "variant", eq: "type2" },
		},
		label: {
			control: { type: "text" },
			description: "Label exibido abaixo do título (apenas simple)",
			if: { arg: "variant", eq: "simple" },
		},
		showLeftBorder: {
			control: { type: "boolean" },
			description: "Exibe a barra colorida na lateral esquerda (apenas simple)",
			if: { arg: "variant", eq: "simple" },
		},
		leftBorderColor: {
			control: { type: "color" },
			description: "Cor da barra lateral esquerda (apenas simple)",
			if: { arg: "variant", eq: "simple" },
		},
	},
};

export default meta;
type Story = StoryObj<typeof Card>;

/**
 * Card simples padrão com barra lateral azul
 */
export const Default: Story = {
	args: {
		variant: "simple",
		title: "Título do Card",
		label: "Informação adicional",
	},
};

/**
 * Card simples com barra lateral verde (sucesso)
 */
export const Success: Story = {
	args: {
		variant: "simple",
		title: "Operação Concluída",
		label: "Sucesso",
		leftBorderColor: "#338618",
	},
};

/**
 * Card simples com barra lateral vermelha (erro)
 */
export const Error: Story = {
	args: {
		variant: "simple",
		title: "Erro Detectado",
		label: "Ação necessária",
		leftBorderColor: "#C1290B",
	},
};

/**
 * Card simples sem barra lateral
 */
export const NoBorder: Story = {
	args: {
		variant: "simple",
		title: "Card Sem Borda",
		label: "Estilo minimalista",
		showLeftBorder: false,
	},
};

/**
 * Card simples com chip label
 */
export const SimpleWithChip: Story = {
	args: {
		variant: "simple",
		title: "Card com Chip",
		label: "Informação adicional",
		chipLabel: "Chip Label",
		leftBorderColor: "#017DA2",
	},
};

/**
 * Card Type1 com progresso completo
 */
export const Type1Complete: Story = {
	args: {
		variant: "type1",
		title: "História do Brasil",
		chipLabel: "Concluído",
		subtitle: "Módulo Final",
		progress: 100,
		primaryButtonText: "Revisar trilha",
		progressIcon: BookOpenIcon,
	},
};

/**
 * Card Type2 com progresso completo
 */
export const Type2Complete: Story = {
	args: {
		variant: "type2",
		title: "Turma A - 2024",
		chipLabel: "Concluído",
		subtitle: "Turno Noturno",
		progress: 100,
		primaryButtonText: "Ver turma",
		secondaryButtonText: "Relatório Final",
		progressIcon: GraduationCapIcon,
	},
};

/**
 * Múltiplos cards simples com diferentes cores
 */
export const MultipleSimpleCards: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "400px" }}>
			<Card variant="simple" title="Status Azul" label="Informação" leftBorderColor="#017DA2" />
			<Card variant="simple" title="Status Verde" label="Concluído" leftBorderColor="#338618" />
			<Card variant="simple" title="Status Vermelho" label="Erro" leftBorderColor="#C1290B" />
			<Card
				variant="simple"
				title="Card com Chip"
				label="Destaque especial"
				chipLabel="Chip Label"
				leftBorderColor="#F59E0B"
			/>
			<Card variant="simple" title="Sem Borda" label="Neutro" showLeftBorder={false} />
		</div>
	),
};
