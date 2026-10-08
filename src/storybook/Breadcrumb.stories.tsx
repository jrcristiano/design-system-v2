import {
	ArrowLineRightIcon,
	ArrowRightIcon,
	CaretCircleRightIcon,
	CaretRightIcon,
	EyeSlashIcon,
	GearIcon,
	HouseIcon,
	MagnifyingGlassIcon,
	PackageIcon,
	ShoppingCartIcon,
	UserCheckIcon,
	UserIcon,
} from "@phosphor-icons/react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Navigation/Breadcrumbs",
	component: Breadcrumb,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Um componente de breadcrumb responsivo e acessível para navegação hierárquica. Segue os princípios WCAG 2.2 AA e é otimizado para mobile-first.",
			},
		},
	},
	tags: ["autodocs", "accessibility"],
	argTypes: {
		items: {
			description: "Array de itens do breadcrumb. O último item representa a página atual.",
			control: { type: "object" },
			table: {
				type: {
					summary: "BreadcrumbItem[]",
					detail:
						"interface BreadcrumbItem { label: string; href?: string; onClick?: () => void; ariaLabel?: string; }",
				},
				defaultValue: { summary: "[]" },
				category: "Content",
			},
		},
		separator: {
			description: "Separador entre os itens. Pode ser string ou ReactNode.",
			control: { type: "select" },
			options: [
				"default",
				"slash",
				"greater-than",
				"arrow",
				"caret",
				"caret-circle",
				"arrow-line",
				"custom",
			],
			mapping: {
				default: "/",
				slash: <EyeSlashIcon size={14} weight="bold" />,
				"greater-than": ">",
				arrow: <ArrowRightIcon size={14} />,
				caret: <CaretRightIcon size={14} weight="bold" />,
				"caret-circle": <CaretCircleRightIcon size={14} />,
				"arrow-line": <ArrowLineRightIcon size={14} />,
				custom: "•",
			},
			table: {
				type: { summary: "ReactNode" },
				defaultValue: { summary: "/" },
				category: "Visual",
			},
		},
		iconLeft: {
			description: "Ícone à esquerda do texto em todos os itens.",
			control: { type: "select" },
			options: ["none", "house", "package", "shopping-cart", "user", "gear", "magnifying-glass"],
			mapping: {
				none: undefined,
				house: <HouseIcon size={16} />,
				package: <PackageIcon size={16} />,
				"shopping-cart": <ShoppingCartIcon size={16} />,
				user: <UserCheckIcon size={16} />,
				gear: <GearIcon size={16} />,
				"magnifying-glass": <MagnifyingGlassIcon size={16} />,
			},
			table: {
				type: { summary: "ReactNode" },
				defaultValue: { summary: "undefined" },
				category: "Icons",
			},
		},
		iconRight: {
			description: "Ícone à direita do texto em todos os itens.",
			control: { type: "select" },
			options: ["none", "magnifying-glass", "caret-right", "arrow-right"],
			mapping: {
				none: undefined,
				"magnifying-glass": <MagnifyingGlassIcon size={14} />,
				"caret-right": <CaretRightIcon size={14} />,
				"arrow-right": <ArrowRightIcon size={14} />,
			},
			table: {
				type: { summary: "ReactNode" },
				defaultValue: { summary: "undefined" },
				category: "Icons",
			},
		},
		separatorColor: {
			description: "Cor do separador usando classes Tailwind.",
			control: { type: "select" },
			options: [
				"gray-400",
				"gray-500",
				"blue-400",
				"blue-500",
				"red-400",
				"green-400",
				"purple-400",
				"orange-400",
			],
			mapping: {
				"gray-400": "text-gray-400",
				"gray-500": "text-gray-500",
				"blue-400": "text-blue-400",
				"blue-500": "text-blue-500",
				"red-400": "text-red-400",
				"green-400": "text-green-400",
				"purple-400": "text-purple-400",
				"orange-400": "text-orange-400",
			},
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "text-gray-400" },
				category: "Visual",
			},
		},
		iconColor: {
			description: "Cor dos ícones usando classes Tailwind.",
			control: { type: "select" },
			options: ["currentColor", "blue-500", "gray-600", "purple-500", "red-500", "green-600"],
			mapping: {
				currentColor: "currentColor",
				"blue-500": "text-blue-500",
				"gray-600": "text-gray-600",
				"purple-500": "text-purple-500",
				"red-500": "text-red-500",
				"green-600": "text-green-600",
			},
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "currentColor" },
				category: "Icons",
			},
		},
		maxItems: {
			description: "Número máximo de itens visíveis antes de colapsar com ellipsis.",
			control: {
				type: "number",
				min: 3,
				max: 10,
				step: 1,
			},
			table: {
				type: { summary: "number" },
				defaultValue: { summary: "undefined" },
				category: "Behavior",
			},
		},
		ariaLabel: {
			description: "Label ARIA para a navegação do breadcrumb.",
			control: { type: "text" },
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "'Breadcrumb navigation'" },
				category: "Accessibility",
			},
		},
		className: {
			description: "Classes CSS adicionais para personalização.",
			control: { type: "text" },
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "''" },
				category: "Layout",
			},
		},
	},
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

const ecommerceItems = [
	{ label: "Início", href: "/" },
	{ label: "Produtos", href: "/produtos" },
	{ label: "Eletrônicos", href: "/produtos/eletronicos" },
	{ label: "Smartphones", href: "/produtos/eletronicos/smartphones" },
	{ label: "iPhone 15 Pro" },
];

const adminItems = [
	{ label: "Dashboard", href: "/admin" },
	{ label: "Gerenciamento", href: "/admin/management" },
	{ label: "Usuários", href: "/admin/management/users" },
	{ label: "Lista", href: "/admin/management/users/list" },
	{ label: "Detalhes do Usuário" },
];

const Template: Story["render"] = (args) => (
	<div className="p-6 min-h-screen">
		<Breadcrumb {...args} />
	</div>
);

export const Default: Story = {
	render: Template,
	args: {
		items: ecommerceItems,
		ariaLabel: "Navegação do e-commerce",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Breadcrumb padrão com separador tradicional. O último item tem `font-weight: var(--ds-font-weight-regular)` conforme especificado.",
			},
		},
	},
};

export const WithIcons: Story = {
	render: Template,
	args: {
		items: ecommerceItems,
		iconLeft: <HouseIcon size={16} />,
		separator: "arrow",
		separatorColor: "blue-400",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Breadcrumb com ícones e separador personalizado. Ideal para interfaces mais visuais.",
			},
		},
	},
};

export const Truncated: Story = {
	render: Template,
	args: {
		items: adminItems,
		maxItems: 4,
		separator: "caret",
		iconLeft: <UserIcon size={16} />,
		iconColor: "purple-500",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Breadcrumb com truncamento responsivo. Em mobile, mostra menos itens automaticamente.",
			},
		},
	},
};

export const Playground: Story = {
	args: {
		items: ecommerceItems,
		separator: "default",
		iconLeft: "none",
		iconRight: "none",
		separatorColor: "gray-400",
		iconColor: "currentColor",
		maxItems: undefined,
		ariaLabel: "Breadcrumb navigation",
		className: "",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Use os controles para explorar todas as variações do Breadcrumb. Teste diferentes combinações de ícones, separadores e cores.",
			},
		},
	},
};
