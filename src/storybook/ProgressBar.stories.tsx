import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "../components/ProgressBar/ProgressBar";

const meta: Meta<typeof ProgressBar> = {
	title: "Components/ProgressBar",
	component: ProgressBar,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Barra de progresso para uploads, com variants de cor e estados de sucesso/erro.",
			},
		},
	},
	argTypes: {
		progress: {
			control: { type: "number", min: 0, max: 100, step: 1 },
			description: "Percentual do progresso (0-100).",
		},
		variant: {
			control: "select",
			options: ["primary", "success", "warning", "danger"],
			description: "Define a cor da barra, ícone e legenda.",
		},
		status: {
			control: "select",
			options: ["in-progress", "success", "error"],
			description: "Estado do upload.",
		},
		fileName: {
			control: "text",
			description: "Nome do arquivo exibido quando concluído.",
		},
		message: {
			control: "text",
			description: "Mensagem exibida na legenda quando concluído.",
		},
	},
	decorators: [
		(Story) => (
			<div
				style={{
					width: "100%",
					maxWidth: "100%",
					padding: "24px",
					backgroundColor: "#ddd",
				}}
			>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
	args: {
		progress: 48,
		variant: "primary",
		status: "in-progress",
	},
};

export const Primary: Story = {
	args: {
		progress: 64,
		variant: "primary",
		status: "in-progress",
		fileName: "Lista_Presenca_7ano_EF.xlsx",
		message: "Enviando arquivo...",
	},
};

export const CompletedSuccess: Story = {
	args: {
		progress: 100,
		variant: "success",
		status: "success",
		fileName: "relatorio-escolar.pdf",
		message: "Upload concluído com sucesso!",
	},
};

export const CompletedError: Story = {
	args: {
		progress: 72,
		variant: "danger",
		status: "error",
		fileName: "video-aula.mp4",
		message: "Falha no upload do arquivo.",
	},
};

export const Warning: Story = {
	args: {
		progress: 35,
		variant: "warning",
		status: "in-progress",
		fileName: "contrato-assinado.pdf",
		message: "Validando arquivo...",
	},
};
