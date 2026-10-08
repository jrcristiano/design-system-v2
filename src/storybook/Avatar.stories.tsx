import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../components/Avatar/Avatar";

const meta: Meta<typeof Avatar> = {
	title: "Components/Avatars",
	component: Avatar,
	tags: ["autodocs"],
	argTypes: {
		status: {
			control: { type: "select" },
			options: ["available", "away"],
			description: "Status do usuário.",
			table: {
				type: { summary: '"available" | "away"' },
				defaultValue: { summary: "available" },
			},
		},
		iconSize: {
			control: { type: "select" },
			options: ["xs", "sm", "md", "lg", "xl"],
			description: "Tamanho do ícone interno (SVG).",
			table: {
				type: { summary: '"xs" | "sm" | "md" | "lg" | "xl"' },
				defaultValue: { summary: "sm" },
			},
		},
		bordered: {
			control: { type: "boolean" },
			description: "Ativa a borda padrão do DS.",
			table: {
				type: { summary: "boolean" },
			},
		},
		className: {
			table: { disable: true },
			description: "Classes CSS adicionais para estilização.",
		},
		style: {
			table: { disable: true },
			description: "Estilos CSS inline para o componente.",
		},
	},
	parameters: {
		docs: {
			description: {
				component:
					"Avatar circular com fundo baseado no token `--ds-color-sky-90`, status disponível/ausente e ícone SVG escalável.",
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Examples: Story = {
	parameters: {
		layout: "centered",
	},
	args: {
		status: "available",
		bordered: false,
	},
	render: (args) => {
		const avatarUserName = "John Doe";

		return (
			<div className="flex flex-col gap-6 p-4">
				<div className="flex flex-col gap-2">
					<span className="text-sm text-neutral-500 font-medium">Avatares sem nome</span>

					<div className="flex gap-3 items-center">
						<Avatar {...args} iconSize="xs" />
						<Avatar {...args} iconSize="sm" />
						<Avatar {...args} iconSize="md" />
						<Avatar {...args} iconSize="lg" />
						<Avatar {...args} iconSize="xl" />
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<span className="text-sm text-neutral-500 font-medium">Avatares com nome (iniciais)</span>

					<div className="flex gap-3 items-center">
						<Avatar {...args} avatarUserName={avatarUserName} iconSize="xs" />
						<Avatar {...args} avatarUserName={avatarUserName} iconSize="sm" />
						<Avatar {...args} avatarUserName={avatarUserName} iconSize="md" />
						<Avatar {...args} avatarUserName={avatarUserName} iconSize="lg" />
						<Avatar {...args} avatarUserName={avatarUserName} iconSize="xl" />
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<span className="text-sm text-neutral-500 font-medium">
						Status (Disponível / Ausente)
					</span>

					<div className="flex gap-3 items-center">
						<Avatar {...args} status="available" iconSize="md" />
						<Avatar {...args} status="away" iconSize="md" />
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<span className="text-sm text-neutral-500 font-medium">Borda habilitada</span>

					<div className="flex gap-3 items-center">
						<Avatar {...args} bordered iconSize="sm" />
						<Avatar {...args} bordered iconSize="md" />
						<Avatar {...args} bordered iconSize="lg" />
					</div>
				</div>
			</div>
		);
	},
};

export const Default: Story = {
	args: {
		status: "available",
		iconSize: "md",
		bordered: false,
	},
};
