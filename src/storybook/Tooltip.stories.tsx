import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "../components/Tooltip/Tooltip";
import { Button } from "../components/Button/Button";

const meta: Meta<typeof Tooltip> = {
	title: "Components/Tooltips",
	component: Tooltip,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Demonstração das posições (`placement`) disponíveis no componente **Tooltip**, baseadas na biblioteca **@tippyjs/react**. Este componente suporta controles interativos para tema, animação, atraso e disparadores.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		content: {
			control: "text",
			description: "Conteúdo principal exibido dentro do tooltip.",
			table: { category: "Conteúdo" },
		},
		title: {
			control: "text",
			description: "Título opcional exibido acima do conteúdo.",
			table: { category: "Conteúdo" },
		},
		placement: {
			control: { type: "select" },
			options: [
				"default",
				"top",
				"bottom",
				"left",
				"right",
				"top-start",
				"top-end",
				"bottom-start",
				"bottom-end",
				"left-start",
				"left-end",
				"right-start",
				"right-end",
			],
			description: "Posição do tooltip em relação ao elemento filho.",
			table: { category: "Comportamento" },
		},
		animation: {
			control: { type: "select" },
			options: ["shift-away", "scale", "fade", "perspective", "shift-toward"],
			description: "Tipo de animação aplicada ao tooltip.",
			table: { category: "Comportamento" },
		},
		delay: {
			control: { type: "number" },
			description: "Tempo (em ms) de atraso para exibir o tooltip.",
			table: { category: "Comportamento" },
		},
		trigger: {
			control: "text",
			description: "Eventos que disparam o tooltip (ex: 'mouseenter focus').",
			table: { category: "Comportamento" },
		},
		disabled: {
			control: "boolean",
			description: "Define se o tooltip está desativado.",
			table: { category: "Comportamento" },
		},
	},
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Examples: Story = {
	render: (args) => (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(3, auto)",
				gap: "2rem",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
				padding: "2rem",
			}}
		>
			<Tooltip {...args} content="Default tooltip">
				<Button>default</Button>
			</Tooltip>
			<Tooltip {...args} content="Position: top" placement="top">
				<Button>top</Button>
			</Tooltip>

			<Tooltip {...args} content="Position: bottom" placement="bottom">
				<Button>bottom</Button>
			</Tooltip>

			<Tooltip {...args} content="Position: left" placement="left">
				<Button>left</Button>
			</Tooltip>

			<Tooltip {...args} content="Position: right" placement="right">
				<Button>right</Button>
			</Tooltip>

			<Tooltip {...args} content="Position: top-start" placement="top-start">
				<Button>top-start</Button>
			</Tooltip>

			<Tooltip {...args} content="Position: top-end" placement="top-end">
				<Button>top-end</Button>
			</Tooltip>

			<Tooltip {...args} content="Position: bottom-start" placement="bottom-start">
				<Button>bottom-start</Button>
			</Tooltip>

			<Tooltip {...args} content="Position: bottom-end" placement="bottom-end">
				<Button>bottom-end</Button>
			</Tooltip>

			<Tooltip {...args} content="Position: right-start" placement="right-start">
				<Button>right-start</Button>
			</Tooltip>

			<Tooltip {...args} content="Position: right-end" placement="right-end">
				<Button>right-end</Button>
			</Tooltip>

			<Tooltip {...args} content="Position: left-start" placement="left-start">
				<Button>left-start</Button>
			</Tooltip>

			<Tooltip {...args} content="Position: left-end" placement="left-end">
				<Button>left-end</Button>
			</Tooltip>
		</div>
	),
	args: {
		title: "Example title",
		animation: "shift-toward",
		delay: 100,
		trigger: "mouseenter focus",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Exibe uma grade com todas as posições (`placement`) disponíveis para o tooltip. Os controles permitem testar tema, animação e comportamento ao vivo.",
			},
		},
	},
};
