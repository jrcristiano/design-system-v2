import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	CaretDownIcon,
	CaretLeftIcon,
	CaretRightIcon,
	CaretUpIcon,
	CheckCircleIcon,
	GearSixIcon,
	LightningIcon,
	UserCircleIcon,
} from "@phosphor-icons/react";

import { useState } from "react";

import { Dropdown } from "../components/Dropdown/Dropdown";
import { DropdownTrigger } from "../components/Dropdown/DropdownTrigger";
import { DropdownMenu } from "../components/Dropdown/DropdownMenu";
import { DropdownItem, type DropdownItemVariant } from "../components/Dropdown/DropdownItem";
import { DropdownSeparator } from "../components/Dropdown/DropdownSeparator";
import { DropdownSearch } from "../components/Dropdown/DropdownSearch";
import { Button } from "../components/Button/Button";
import { Tag } from "../components/Tag/Tag";

interface DropdownStoryArgs {
	variant: DropdownItemVariant;
	icon?: React.ReactNode;
	checked?: boolean;
	shortcut?: string;
	disabled?: boolean;
	children?: string;
	triggerLabel: string;
}

const meta: Meta<DropdownStoryArgs> = {
	title: "Components/Dropdowns",
	component: DropdownItem,
	tags: ["autodocs"],

	argTypes: {
		triggerLabel: {
			control: "text",
			description: "Texto exibido no botão do trigger.",
		},

		variant: {
			control: "select",
			options: [
				"default",
				"checkbox",
				"icon",
				"shortcut",
				"icon-shortcut",
				"checkbox-shortcut",
				"checkbox-only",
				"label-only",
			],
			description: "Define o estilo visual do item do dropdown.",
		},

		icon: {
			control: "select",
			options: ["none", "GearSixIcon", "UserCircleIcon", "LightningIcon", "CheckCircleIcon"],
			mapping: {
				none: undefined,
				GearSixIcon: <GearSixIcon size={18} />,
				UserCircleIcon: <UserCircleIcon size={18} />,
				LightningIcon: <LightningIcon size={18} />,
				CheckCircleIcon: <CheckCircleIcon size={18} />,
			},
			description: "Ícone exibido no item do dropdown.",
		},

		checked: {
			control: "boolean",
			description: "Define se o item do dropdown está marcado (para variantes de checkbox).",
		},
		shortcut: {
			control: "text",
			description: "Atalho de teclado exibido ao lado do item do dropdown.",
		},
		disabled: {
			control: "boolean",
			description: "Desabilita o item do dropdown.",
		},
		children: {
			control: "text",
			description: "Conteúdo principal do item do dropdown (geralmente o texto).",
		},
	},

	args: {
		triggerLabel: "Menu",
		variant: "default",
		children: "Opção de Menu",
		checked: false,
		shortcut: "",
		disabled: false,
		icon: undefined,
	},
};

export default meta;

type Story = StoryObj<DropdownStoryArgs>;

function CheckboxLabelShortcutComponent(args: DropdownStoryArgs) {
	const [isChecked, setIsChecked] = useState(false);

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button iconRight={CaretDownIcon}>Menu</Button>
			</DropdownTrigger>

			<DropdownMenu width="260px">
				<DropdownItem {...args} checked={isChecked} onSelect={() => setIsChecked(!isChecked)} />
			</DropdownMenu>
		</Dropdown>
	);
}

function CheckboxLabelComponent(args: DropdownStoryArgs) {
	const [isChecked, setIsChecked] = useState(true);

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button iconRight={CaretDownIcon}>Menu</Button>
			</DropdownTrigger>

			<DropdownMenu width="260px">
				<DropdownItem {...args} checked={isChecked} onSelect={() => setIsChecked(!isChecked)} />
			</DropdownMenu>
		</Dropdown>
	);
}

function CheckboxShortcutComponent(args: DropdownStoryArgs) {
	const [isChecked, setIsChecked] = useState(true);

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button iconRight={CaretDownIcon}>Menu</Button>
			</DropdownTrigger>

			<DropdownMenu width="260px">
				<DropdownItem {...args} checked={isChecked} onSelect={() => setIsChecked(!isChecked)} />
			</DropdownMenu>
		</Dropdown>
	);
}

function OnlyCheckboxComponent(args: DropdownStoryArgs) {
	const [isChecked, setIsChecked] = useState(true);

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button iconRight={CaretDownIcon}>Menu</Button>
			</DropdownTrigger>

			<DropdownMenu width="260px">
				<DropdownItem {...args} checked={isChecked} onSelect={() => setIsChecked(!isChecked)} />
			</DropdownMenu>
		</Dropdown>
	);
}

function ManyCheckboxesComponent() {
	const [opcao1, setOpcao1] = useState(false);
	const [opcao2, setOpcao2] = useState(true);
	const [opcao3, setOpcao3] = useState(false);
	const [opcao4, setOpcao4] = useState(true);

	const allSelected = opcao1 && opcao2 && opcao3 && opcao4;

	const toggleAll = () => {
		const v = !allSelected;
		setOpcao1(v);
		setOpcao2(v);
		setOpcao3(v);
		setOpcao4(v);
	};

	return (
		<div className="w-[260px]">
			<Dropdown>
				<DropdownTrigger>
					<Button iconRight={CaretDownIcon}>Selecionar Itens</Button>
				</DropdownTrigger>

				<DropdownMenu width="260px">
					<DropdownItem variant="checkbox" checked={opcao1} onSelect={() => setOpcao1(!opcao1)}>
						Item 1
					</DropdownItem>

					<DropdownItem variant="checkbox" checked={opcao2} onSelect={() => setOpcao2(!opcao2)}>
						Item 2
					</DropdownItem>

					<DropdownItem variant="checkbox" checked={opcao3} onSelect={() => setOpcao3(!opcao3)}>
						Item 3
					</DropdownItem>

					<DropdownItem variant="checkbox" checked={opcao4} onSelect={() => setOpcao4(!opcao4)}>
						Item 4
					</DropdownItem>

					<DropdownSeparator />

					<DropdownItem
						variant="checkbox-shortcut"
						shortcut="⌘A"
						checked={allSelected}
						onSelect={toggleAll}
					>
						Selecionar Tudo
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
	);
}

function SearchableDropdownComponent() {
	return (
		<div className="w-[260px]">
			<Dropdown>
				<DropdownTrigger>
					<Button iconRight={CaretDownIcon}>Buscar itens</Button>
				</DropdownTrigger>

				<DropdownMenu scrollable width="260px" maxHeight="260px">
					<DropdownSearch />

					<DropdownItem icon={<GearSixIcon size={18} />}>Configurações</DropdownItem>
					<DropdownItem icon={<UserCircleIcon size={18} />}>Perfil</DropdownItem>
					<DropdownItem icon={<LightningIcon size={18} />}>Notificações</DropdownItem>
					<DropdownItem icon={<CheckCircleIcon size={18} />}>Status Geral</DropdownItem>
					<DropdownItem icon={<LightningIcon size={18} />}>Atalhos</DropdownItem>
					<DropdownItem icon={<GearSixIcon size={18} />}>Painel de Controle</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
	);
}

function SearchableMultiSelectComponent() {
	const [selectedItems, setSelectedItems] = useState<string[]>(["Configurações"]);

	const items = [
		{ id: "config", label: "Configurações", IconComponent: GearSixIcon },
		{ id: "perfil", label: "Perfil", IconComponent: UserCircleIcon },
		{ id: "notificacoes", label: "Notificações", IconComponent: LightningIcon },
		{ id: "status", label: "Status Geral", IconComponent: CheckCircleIcon },
		{ id: "atalhos", label: "Atalhos", IconComponent: LightningIcon },
		{ id: "painel", label: "Painel de Controle", IconComponent: GearSixIcon },
	];

	const toggleItem = (label: string) => {
		setSelectedItems((prev) =>
			prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
		);
	};

	const allSelected = items.every((item) => selectedItems.includes(item.label));
	const someSelected = selectedItems.length > 0 && !allSelected;

	const toggleAll = () => {
		if (allSelected) {
			setSelectedItems([]);
		} else {
			setSelectedItems(items.map((item) => item.label));
		}
	};

	const selectedCount = selectedItems.length;

	return (
		<div className="w-[280px] gap-2 flex flex-col">
			<Dropdown>
				<DropdownTrigger>
					<Button iconRight={CaretDownIcon}>
						{selectedCount > 0 ? `${selectedCount} selecionado(s)` : "Selecionar Itens"}
					</Button>
				</DropdownTrigger>

				<DropdownMenu scrollable width="280px" maxHeight="400px">
					<DropdownSearch />

					<DropdownItem
						variant="checkbox-shortcut"
						shortcut="⌘A"
						checked={allSelected}
						onSelect={toggleAll}
					>
						{allSelected ? "Desmarcar Tudo" : someSelected ? "Selecionar Tudo" : "Selecionar Tudo"}
					</DropdownItem>

					{items.map((item) => (
						<DropdownItem
							key={item.id}
							variant="checkbox"
							icon={<item.IconComponent size={18} />}
							checked={selectedItems.includes(item.label)}
							onSelect={() => toggleItem(item.label)}
						>
							{item.label}
						</DropdownItem>
					))}
				</DropdownMenu>
			</Dropdown>
			<div className="flex flex-wrap gap-4">
				{items
					.filter((item) => selectedItems.includes(item.label))
					.map((item) => (
						<Tag key={item.id} variant="primary" iconLeft={item.IconComponent}>
							{item.label}
						</Tag>
					))}
			</div>
		</div>
	);
}

export const Default: Story = {
	args: {
		variant: "default",
		children: "Opção padrão",
	},
	render: (args) => (
		<Dropdown>
			<DropdownTrigger>
				<Button iconRight={CaretDownIcon}>{args.triggerLabel}</Button>
			</DropdownTrigger>

			<DropdownMenu width="260px">
				<DropdownItem {...args} />
			</DropdownMenu>
		</Dropdown>
	),
};

export const Disabled: Story = {
	args: {
		children: "Opção disabled",
		disabled: true,
		variant: "checkbox-shortcut",
		shortcut: "⌘A",
	},
	render: (args) => (
		<Dropdown>
			<DropdownTrigger>
				<Button iconRight={CaretDownIcon}>{args.triggerLabel}</Button>
			</DropdownTrigger>

			<DropdownMenu width="260px">
				<DropdownItem {...args} />
			</DropdownMenu>
		</Dropdown>
	),
};

export const OnlyLabel: Story = {
	args: {
		variant: "label-only",
		children: "Somente label",
	},
	render: (args) => (
		<Dropdown>
			<DropdownTrigger>
				<Button iconRight={CaretDownIcon}>Menu</Button>
			</DropdownTrigger>

			<DropdownMenu width="260px">
				<DropdownItem {...args} />
			</DropdownMenu>
		</Dropdown>
	),
};

export const CheckboxLabelShortcut: Story = {
	args: {
		variant: "checkbox-shortcut",
		children: "Selecionar Tudo",
		shortcut: "⌘A",
	},
	render: (args) => <CheckboxLabelShortcutComponent {...args} />,
};

export const CheckboxLabel: Story = {
	args: {
		variant: "checkbox",
		children: "Selecionado",
	},
	render: (args) => <CheckboxLabelComponent {...args} />,
};

export const IconShortcut: Story = {
	args: {
		variant: "icon-shortcut",
		children: "Ação Rápida",
		icon: <LightningIcon size={18} />,
		shortcut: "⌘K",
	},
	render: (args) => (
		<Dropdown>
			<DropdownTrigger>
				<Button iconRight={CaretDownIcon}>Menu</Button>
			</DropdownTrigger>

			<DropdownMenu width="260px">
				<DropdownItem {...args} />
			</DropdownMenu>
		</Dropdown>
	),
};

export const IconLabel: Story = {
	args: {
		variant: "icon",
		children: "Perfil",
		icon: <UserCircleIcon size={18} />,
	},
	render: (args) => (
		<Dropdown>
			<DropdownTrigger>
				<Button iconRight={CaretDownIcon}>Menu</Button>
			</DropdownTrigger>

			<DropdownMenu width="260px">
				<DropdownItem {...args} />
			</DropdownMenu>
		</Dropdown>
	),
};

export const CheckboxShortcutStory: Story = {
	name: "Checkbox + Shortcut",
	args: {
		variant: "checkbox-shortcut",
		children: "Marcar item",
		shortcut: "⌘M",
	},
	render: (args) => <CheckboxShortcutComponent {...args} />,
};

export const OnlyCheckbox: Story = {
	args: {
		variant: "checkbox-only",
		children: "",
	},
	render: (args) => <OnlyCheckboxComponent {...args} />,
};

export const ManyCheckboxes: Story = {
	render: () => <ManyCheckboxesComponent />,
};

export const Divisor: Story = {
	render: () => (
		<Dropdown>
			<DropdownTrigger>
				<Button iconRight={CaretDownIcon}>Menu</Button>
			</DropdownTrigger>

			<DropdownMenu width="260px">
				<DropdownItem icon={<GearSixIcon size={18} />}>Configurações</DropdownItem>
				<DropdownSeparator />
				<DropdownItem icon={<UserCircleIcon size={18} />}>Perfil</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	),
};

export const SearchableDropdown: Story = {
	render: () => <SearchableDropdownComponent />,
};

export const SearchableMultiSelect: Story = {
	render: () => <SearchableMultiSelectComponent />,
};

export const IconRotation: Story = {
	render: () => (
		<Dropdown>
			<DropdownTrigger iconOpen={CaretUpIcon} iconClosed={CaretDownIcon}>
				<Button iconRight={CaretDownIcon}>Menu</Button>
			</DropdownTrigger>

			<DropdownMenu width="260px">
				<DropdownItem>Opção 1</DropdownItem>
				<DropdownItem>Opção 2</DropdownItem>
				<DropdownItem>Opção 3</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	),
	parameters: {
		docs: {
			description: {
				story: "Exemplo de rotação do ícone do trigger quando o dropdown abre e fecha.",
			},
		},
	},
};

export const Directions: Story = {
	render: () => (
		<div className="flex items-center justify-center h-96 gap-8">
			<Dropdown direction="top">
				<DropdownTrigger>
					<Button iconRight={CaretUpIcon}>Top</Button>
				</DropdownTrigger>
				<DropdownMenu width="120px">
					<DropdownItem>Item 1</DropdownItem>
					<DropdownItem>Item 2</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<Dropdown direction="right">
				<DropdownTrigger>
					<Button iconRight={CaretRightIcon}>Right</Button>
				</DropdownTrigger>
				<DropdownMenu width="120px">
					<DropdownItem>Item 1</DropdownItem>
					<DropdownItem>Item 2</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<Dropdown direction="down">
				<DropdownTrigger>
					<Button iconRight={CaretDownIcon}>Down</Button>
				</DropdownTrigger>
				<DropdownMenu width="120px">
					<DropdownItem>Item 1</DropdownItem>
					<DropdownItem>Item 2</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<Dropdown direction="left">
				<DropdownTrigger>
					<Button iconLeft={CaretLeftIcon}>Left</Button>
				</DropdownTrigger>
				<DropdownMenu width="120px">
					<DropdownItem>Item 1</DropdownItem>
					<DropdownItem>Item 2</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Exemplo de uso da prop `direction` para controlar a direção do menu.",
			},
		},
	},
};
