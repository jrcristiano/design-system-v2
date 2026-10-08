import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "../components/Typography/Typography";

const meta: Meta<typeof Typography> = {
	title: "Style Guide/Tipografias",
	component: Typography,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Renderiza todos os estilos tipográficos definidos no arquivo `typography.css`, usando diretamente as variáveis CSS do Design System.",
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Examples: Story = {
	render: () => <Typography />,
};
