import { CheckIcon, CircleIcon, EyeIcon, PlusIcon, TrashIcon, XIcon } from "@phosphor-icons/react";
import { Tag } from "../components/Tag/Tag";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Tag> = {
	title: "Components/Tags",
	component: Tag,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Componente Tag/Badge para exibir status, categorias ou informações em formato de etiqueta.",
			},
		},
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["primary", "success", "info", "warning", "danger", "inactive"],
			description: "Variante visual do tag",
			table: {
				defaultValue: { summary: "primary" },
			},
		},
		state: {
			control: { type: "select" },
			options: ["default", "hover", "pressed", "selected", "focused", "disabled"],
			description: "Estado interativo do componente",
			table: {
				defaultValue: { summary: "default" },
			},
		},
		pill: {
			control: { type: "boolean" },
			description: "Formato pill com bordas completamente arredondadas",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		circle: {
			control: { type: "boolean" },
			description: "Formato circular que oculta o texto",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		disabled: {
			control: { type: "boolean" },
			description: "Estado desabilitado",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		closable: {
			control: { type: "boolean" },
			description: "Exibe ícone de fechar e permite fechar o tag",
			table: {
				type: { summary: "boolean" },
				defaultValue: { summary: "false" },
			},
		},
		size: {
			control: { type: "select" },
			options: ["sm", "md"],
			description: "Tamanho do tag",
			table: {
				defaultValue: { summary: "md" },
			},
		},
		count: {
			control: { type: "number" },
			description: "Número a ser exibido no lugar do texto",
		},
		iconWeight: {
			control: { type: "select" },
			options: ["thin", "light", "regular", "bold", "fill", "duotone"],
			description: "Define o peso do ícone exibido pelo componente Tag.",
			table: {
				type: { summary: '"thin" | "light" | "regular" | "bold" | "fill" | "duotone"' },
				defaultValue: { summary: "regular" },
			},
		},
		iconLeft: {
			control: { type: "select" },
			options: ["none", "PlusIcon", "CheckIcon", "TrashIcon", "EyeIcon", "XIcon"],
			mapping: {
				none: undefined,
				PlusIcon: PlusIcon,
				CheckIcon: CheckIcon,
				TrashIcon: TrashIcon,
				EyeIcon: EyeIcon,
				XIcon: XIcon,
			},
			description: "Ícone a ser exibido no lado esquerdo",
		},
		iconRight: {
			control: { type: "select" },
			options: ["none", "PlusIcon", "CheckIcon", "TrashIcon", "EyeIcon", "XIcon"],
			mapping: {
				none: undefined,
				PlusIcon: PlusIcon,
				CheckIcon: CheckIcon,
				TrashIcon: TrashIcon,
				EyeIcon: EyeIcon,
				XIcon: XIcon,
			},
			description: "Ícone a ser exibido no lado direito",
		},
		onClose: {
			action: "onClose",
			description: "Callback executado quando o tag é fechado",
		},
		children: {
			control: { type: "text" },
			description: "Conteúdo textual do tag",
		},
	},
	args: {
		children: "Tag Label",
		variant: "primary",
		size: "md",
		state: "default",
		pill: false,
		circle: false,
		disabled: false,
		closable: false,
		count: undefined,
		iconLeft: undefined,
		iconRight: undefined,
	},
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Examples: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "600px" }}>
			<div>
				<h3 style={{ marginBottom: "12px", color: "#333" }}>Variantes Básicas</h3>
				<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
					<Tag variant="primary">Primary</Tag>
					<Tag variant="success">Success</Tag>
					<Tag variant="info">Info</Tag>
					<Tag variant="warning">Warning</Tag>
					<Tag variant="danger">Danger</Tag>
					<Tag variant="inactive">Inactive</Tag>
				</div>
			</div>

			<div>
				<h3 style={{ marginBottom: "12px", color: "#333" }}>Com Ícones</h3>
				<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
					<Tag variant="primary" iconLeft={PlusIcon}>
						Add
					</Tag>
					<Tag variant="success" iconWeight="fill" iconLeft={CircleIcon}>
						Online
					</Tag>
					<Tag variant="info" iconLeft={EyeIcon}>
						View
					</Tag>
					<Tag variant="warning" iconLeft={TrashIcon}>
						Delete
					</Tag>
					<Tag variant="danger" iconLeft={XIcon}>
						Error
					</Tag>
				</div>
			</div>

			<div>
				<h3 style={{ marginBottom: "12px", color: "#333" }}>Fecháveis</h3>
				<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
					<Tag variant="primary" closable>
						Primary
					</Tag>
					<Tag variant="success" closable iconLeft={CheckIcon}>
						Success
					</Tag>
					<Tag variant="info" closable>
						Info
					</Tag>
					<Tag variant="warning" closable>
						Warning
					</Tag>
					<Tag variant="danger" closable iconLeft={XIcon}>
						Danger
					</Tag>
				</div>
			</div>

			<div>
				<h3 style={{ marginBottom: "12px", color: "#333" }}>Formatos</h3>
				<div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
					<Tag variant="primary" pill>
						Pill
					</Tag>
					<Tag variant="success" circle iconLeft={CheckIcon} />
					<Tag variant="warning" circle iconLeft={TrashIcon} />
					<Tag variant="danger" circle iconLeft={XIcon} />
					<Tag variant="primary" count={12} />
					<Tag variant="success" count={5} />
				</div>
			</div>

			<div>
				<h3 style={{ marginBottom: "12px", color: "#333" }}>Tamanhos</h3>
				<div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
					<Tag variant="primary" size="sm">
						Small
					</Tag>
					<Tag variant="success" size="sm" iconLeft={CheckIcon}>
						Small
					</Tag>
					<Tag variant="primary" size="md">
						Medium
					</Tag>
					<Tag variant="success" size="md" iconLeft={CheckIcon}>
						Medium
					</Tag>
					<Tag variant="primary" size="sm" pill>
						Small Pill
					</Tag>
					<Tag variant="success" size="md" pill>
						Medium Pill
					</Tag>
				</div>
			</div>

			<div>
				<h3 style={{ marginBottom: "12px", color: "#333" }}>Estados</h3>
				<div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
					<Tag variant="primary" state="default">
						Default
					</Tag>
					<Tag variant="primary" state="hover">
						Hover
					</Tag>
					<Tag variant="primary" state="pressed">
						Pressed
					</Tag>
					<Tag variant="primary" state="selected">
						Selected
					</Tag>
					<Tag variant="primary" state="focused">
						Focused
					</Tag>
					<Tag variant="primary" disabled>
						Disabled
					</Tag>
				</div>
			</div>

			<div>
				<h3 style={{ marginBottom: "12px", color: "#333" }}>Exemplos Combinados</h3>
				<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
					<Tag variant="success" iconLeft={CheckIcon} closable pill>
						Success Pill
					</Tag>
					<Tag variant="warning" iconLeft={TrashIcon} closable count={3}>
						Warning Count
					</Tag>
					<Tag variant="danger" iconLeft={XIcon} closable size="sm">
						Small Danger
					</Tag>
					<Tag variant="info" iconLeft={EyeIcon} circle closable />
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Coleção completa de exemplos mostrando todas as variantes, formatos e estados do componente Tag.",
			},
		},
	},
};

export const Primary: Story = {
	args: {
		variant: "primary",
		children: "Primary",
	},
	parameters: {
		docs: {
			description: {
				story: "Variante primária para ações principais e destaque.",
			},
		},
	},
};

export const Success: Story = {
	args: {
		variant: "success",
		children: "Success",
	},
	parameters: {
		docs: {
			description: {
				story: "Variante de sucesso para confirmações e estados positivos.",
			},
		},
	},
};

export const Info: Story = {
	args: {
		variant: "info",
		children: "Info",
	},
	parameters: {
		docs: {
			description: {
				story: "Variante informativa para notificações e informações.",
			},
		},
	},
};

export const Warning: Story = {
	args: {
		variant: "warning",
		children: "Warning",
	},
	parameters: {
		docs: {
			description: {
				story: "Variante de alerta para avisos e atenções.",
			},
		},
	},
};

export const Danger: Story = {
	args: {
		variant: "danger",
		children: "Danger",
	},
	parameters: {
		docs: {
			description: {
				story: "Variante de perigo para erros e estados críticos.",
			},
		},
	},
};

export const Disabled: Story = {
	args: {
		variant: "primary",
		children: "Disabled",
		disabled: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Tag no estado desabilitado.",
			},
		},
	},
};
