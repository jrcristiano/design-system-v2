import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Tab } from "../components/Tab/Tab";
import { CheckIcon, CircleIcon, EyeIcon, PlusIcon, TrashIcon, XIcon } from "@phosphor-icons/react";

const meta: Meta<typeof Tab> = {
	title: "Components/Tab",
	component: Tab,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Componente de Tab para navegação entre diferentes seções. Suporta múltiplos tipos: simples, com indicador horizontal, vertical ou contained. Pode incluir ícones à esquerda, direita ou ambos os lados.",
			},
		},
	},
	argTypes: {
		type: {
			control: "select",
			options: ["simple", "horizontal-indicator", "vertical-indicator", "contained"],
			description: "Tipo visual da tab",
		},
		iconLeft: {
			control: "select",
			options: ["none", "CheckIcon", "CircleIcon", "EyeIcon", "PlusIcon", "TrashIcon", "XIcon"],
			mapping: {
				none: undefined,
				CheckIcon,
				CircleIcon,
				EyeIcon,
				PlusIcon,
				TrashIcon,
				XIcon,
			},
			description: "Ícone à esquerda",
		},
		iconRight: {
			control: "select",
			options: ["none", "CheckIcon", "CircleIcon", "EyeIcon", "PlusIcon", "TrashIcon", "XIcon"],
			mapping: {
				none: undefined,
				CheckIcon,
				CircleIcon,
				EyeIcon,
				PlusIcon,
				TrashIcon,
				XIcon,
			},
			description: "Ícone à direita",
		},
		iconWeight: {
			control: "select",
			options: ["thin", "light", "regular", "bold", "fill", "duotone"],
			description: "Peso do ícone",
		},
		selected: {
			control: "boolean",
			description: "Se a tab está selecionada",
		},
		disabled: {
			control: "boolean",
			description: "Se a tab está desabilitada",
		},
		label: {
			control: "text",
			description: "Conteúdo textual da tab",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Playground: Story = {
	args: {
		type: "simple",
		label: "Label",
		selected: false,
		disabled: false,
		iconWeight: "regular",
	},
	render: (args) => (
		<div className="p-8">
			<Tab {...args} />
		</div>
	),
};

const NavigationTabsComponent = () => {
	const [active, setActive] = useState("produtos");

	return (
		<div className="flex gap-4 p-6">
			<Tab
				type="horizontal-indicator"
				label="Produtos"
				selected={active === "produtos"}
				onClick={() => setActive("produtos")}
			/>
			<Tab
				type="horizontal-indicator"
				label="Serviços"
				selected={active === "serviços"}
				onClick={() => setActive("serviços")}
			/>
			<Tab
				type="horizontal-indicator"
				label="Sobre"
				selected={active === "sobre"}
				onClick={() => setActive("sobre")}
			/>
		</div>
	);
};

export const NavigationTabs: Story = {
	parameters: { controls: { disable: true } },
	render: () => <NavigationTabsComponent />,
};

const DashboardTabsComponent = () => {
	const [current, setCurrent] = useState("overview");

	return (
		<div className="flex gap-2 p-6 bg-slate-100">
			<Tab
				type="contained"
				label="Overview"
				iconLeft={EyeIcon}
				selected={current === "overview"}
				onClick={() => setCurrent("overview")}
			/>
			<Tab
				type="contained"
				label="Criar Novo"
				iconLeft={PlusIcon}
				selected={current === "criar"}
				onClick={() => setCurrent("criar")}
			/>
			<Tab
				type="contained"
				label="Arquivados"
				iconLeft={TrashIcon}
				selected={current === "arquivados"}
				onClick={() => setCurrent("arquivados")}
			/>
		</div>
	);
};

export const DashboardTabs: Story = {
	parameters: { controls: { disable: true } },
	render: () => <DashboardTabsComponent />,
};

const SidebarTabsComponent = () => {
	const [selected, setSelected] = useState("config");

	return (
		<div className="flex flex-col gap-2 p-6 bg-gray-50 w-64">
			<Tab
				type="vertical-indicator"
				label="Configurações"
				selected={selected === "config"}
				onClick={() => setSelected("config")}
			/>
			<Tab
				type="vertical-indicator"
				label="Notificações"
				selected={selected === "notif"}
				onClick={() => setSelected("notif")}
			/>
			<Tab
				type="vertical-indicator"
				label="Privacidade"
				selected={selected === "priv"}
				onClick={() => setSelected("priv")}
			/>
			<Tab type="vertical-indicator" label="Ajuda" disabled />
		</div>
	);
};

export const SidebarTabs: Story = {
	parameters: { controls: { disable: true } },
	render: () => <SidebarTabsComponent />,
};

const StatusTabsComponent = () => {
	const [status, setStatus] = useState("pendente");

	return (
		<div className="flex gap-3 p-6">
			<Tab
				type="simple"
				label="Pendente"
				iconLeft={CircleIcon}
				iconWeight="fill"
				selected={status === "pendente"}
				onClick={() => setStatus("pendente")}
			/>
			<Tab
				type="simple"
				label="Em Andamento"
				iconLeft={CircleIcon}
				iconWeight="fill"
				selected={status === "andamento"}
				onClick={() => setStatus("andamento")}
			/>
			<Tab
				type="simple"
				label="Concluído"
				iconLeft={CheckIcon}
				iconWeight="bold"
				selected={status === "concluido"}
				onClick={() => setStatus("concluido")}
			/>
		</div>
	);
};

export const StatusTabs: Story = {
	parameters: { controls: { disable: true } },
	render: () => <StatusTabsComponent />,
};

const SettingsTabsComponent = () => {
	const [page, setPage] = useState("perfil");

	return (
		<div className="inline-flex gap-1 p-6 bg-white border border-gray-200 rounded-lg">
			<Tab
				type="contained"
				label="Perfil"
				selected={page === "perfil"}
				onClick={() => setPage("perfil")}
			/>
			<Tab
				type="contained"
				label="Conta"
				selected={page === "conta"}
				onClick={() => setPage("conta")}
			/>
			<Tab
				type="contained"
				label="Segurança"
				selected={page === "seguranca"}
				onClick={() => setPage("seguranca")}
			/>
			<Tab
				type="contained"
				label="Integrações"
				selected={page === "integracoes"}
				onClick={() => setPage("integracoes")}
			/>
		</div>
	);
};

export const SettingsTabs: Story = {
	parameters: { controls: { disable: true } },
	render: () => <SettingsTabsComponent />,
};

export const ComparisonTypes: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div className="space-y-8 p-6">
			<div className="space-y-2">
				<p className="text-sm text-gray-600 font-medium">Simple</p>
				<div className="flex gap-2">
					<Tab type="simple" label="Opção 1" selected />
					<Tab type="simple" label="Opção 2" />
					<Tab type="simple" label="Opção 3" />
				</div>
			</div>

			<div className="space-y-2">
				<p className="text-sm text-gray-600 font-medium">Horizontal Indicator</p>
				<div className="flex gap-2">
					<Tab type="horizontal-indicator" label="Opção 1" selected />
					<Tab type="horizontal-indicator" label="Opção 2" />
					<Tab type="horizontal-indicator" label="Opção 3" />
				</div>
			</div>

			<div className="space-y-2">
				<p className="text-sm text-gray-600 font-medium">Vertical Indicator</p>
				<div className="flex flex-col gap-2 w-48">
					<Tab type="vertical-indicator" label="Opção 1" selected />
					<Tab type="vertical-indicator" label="Opção 2" />
					<Tab type="vertical-indicator" label="Opção 3" />
				</div>
			</div>

			<div className="space-y-2">
				<p className="text-sm text-gray-600 font-medium">Contained</p>
				<div className="flex gap-2">
					<Tab type="contained" label="Opção 1" selected />
					<Tab type="contained" label="Opção 2" />
					<Tab type="contained" label="Opção 3" />
				</div>
			</div>
		</div>
	),
};
