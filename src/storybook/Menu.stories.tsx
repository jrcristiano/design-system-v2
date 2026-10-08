import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu } from "../components/Menu/Menu";
import { MenuItem } from "../components/Menu/MenuItem";
import {
	HouseIcon,
	UsersIcon,
	GearIcon,
	FileTextIcon,
	ChartBarIcon,
	BellIcon,
	DownloadIcon,
	UploadIcon,
	EyeIcon,
	TrashIcon,
	CheckIcon,
	XIcon,
	CaretDownIcon,
} from "@phosphor-icons/react";
import AvatarImage from "../assets/Avatar.png";

type MenuStoryProps = React.ComponentProps<typeof Menu> & {
	logoSrc?: string;
	logoCollapsedSrc?: string;
	menuItemActive?: boolean;
};

const meta: Meta<MenuStoryProps> = {
	title: "Components/Menu",
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Componente de Menu lateral (sidebar) com suporte a itens, ícones, submenus e dividers. Segue as especificações do design system com estados hover, pressed e focused.",
			},
		},
	},
	component: Menu,
	argTypes: {
		children: {
			control: false,
			table: { disable: true },
			description: "Itens do menu.",
		},
		onCollapse: {
			control: false,
			table: { disable: true },
			description: "Callback disparado quando o estado colapsado do menu muda.",
		},
		onSearchChange: {
			control: false,
			table: { disable: true },
			description: "Callback disparado quando o valor do campo de busca muda.",
		},
		size: {
			control: "select",
			options: ["sm", "md"],
			description: "Tamanho do menu quando aberto (sm: 200px, md: 260px).",
		},
		isCollapsed: {
			control: "boolean",
			description: "Estado colapsado do menu.",
		},
		searchPlaceholder: {
			control: "text",
			description: "Placeholder do campo de busca.",
		},
		logo: {
			description: "Logo exibido quando o menu está aberto.",
			control: false,
			table: { disable: true },
		},
		logoCollapsed: {
			description: "Logo exibido quando o menu está colapsado.",
			control: false,
			table: { disable: true },
		},
		avatarSrc: {
			control: "text",
			description: "URL da imagem do avatar do usuário.",
		},
		userName: {
			control: "text",
			description: "Nome do usuário exibido no footer.",
		},
		userRole: {
			control: "text",
			description: "Cargo/função do usuário exibido no footer.",
		},
		menuItemActive: {
			control: "boolean",
			description: "Define se o primeiro item do menu está ativo.",
		},
	},
};

export default meta;
type Story = StoryObj<MenuStoryProps>;

export const Examples: Story = {
	render: (args) => {
		return (
			<div className="flex h-[700px]">
				<Menu
					size={args.size}
					isCollapsed={args.isCollapsed}
					showSearch
					searchPlaceholder={args.searchPlaceholder}
					avatarSrc={args.avatarSrc}
					userName={args.userName}
					userRole={args.userRole}
					logo={args.logo}
					logoCollapsed={args.logoCollapsed}
				>
					<MenuItem
						label="Secretarias"
						leftIcon={HouseIcon}
						rightIcon={CaretDownIcon}
						isActive={args.menuItemActive}
					>
						<MenuItem label="Button" leftIcon={FileTextIcon} href="/secretarias/button" />
						<MenuItem label="Submit" leftIcon={CheckIcon} href="/secretarias/submit" />
						<MenuItem label="Cancel" leftIcon={XIcon} href="/secretarias/cancel" />
						<MenuItem label="Reset" leftIcon={TrashIcon} href="/secretarias/reset" />
						<MenuItem label="Download" leftIcon={DownloadIcon} href="/secretarias/download" />
						<MenuItem label="Upload" leftIcon={UploadIcon} href="/secretarias/upload" />
						<MenuItem label="Preview" leftIcon={EyeIcon} href="/secretarias/preview" />
					</MenuItem>

					<MenuItem label="Configurações" leftIcon={GearIcon} rightIcon={CaretDownIcon}>
						<MenuItem label="Perfil" leftIcon={UsersIcon} href="/configuracoes/perfil" />
						<MenuItem label="Preferências" leftIcon={GearIcon} href="/configuracoes/preferencias" />
					</MenuItem>

					<MenuItem label="Documentação" leftIcon={FileTextIcon} href="/documentação" />
					<MenuItem label="Relatórios" leftIcon={ChartBarIcon} rightIcon={BellIcon} disabled />
				</Menu>
			</div>
		);
	},
	args: {
		size: "md",
		isCollapsed: false,
		showSearch: true,
		searchPlaceholder: "Buscar por...",
		logo: <img src="../src/assets/logotipo_branco_02.svg" className="h-[45px] w-full" />,
		logoCollapsed: <img src="../src/assets/logotipo_branco_02.svg" className="w-10 h-10" />,
		avatarSrc: AvatarImage,
		userName: "Joanna Doe",
		userRole: "Coordenadora",
		menuItemActive: false,
	},
};
