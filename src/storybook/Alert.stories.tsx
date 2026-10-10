import type { Meta, StoryObj } from "@storybook/react-vite";

import { InfoIcon } from "@phosphor-icons/react";
import type { AlertProps } from "../components/Alert/alert.types";
import { Alert } from "../components/Alert/Alert";

const meta: Meta<AlertProps> = {
	title: "Feedback/Alert",
	component: Alert,
	parameters: {
		layout: "padded",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["success", "warning", "error", "info"],
		},
		dismissible: {
			control: "boolean",
		},
	},
	args: {
		variant: "success",
		title: "Operação realizada com sucesso",
		message: "Sua ação foi concluída sem erros.",
		dismissible: false,
	},
};

export default meta;
type Story = StoryObj<AlertProps>;

/* -------------------------------------------------------------------------- */
/*  Básico                                                                     */
/* -------------------------------------------------------------------------- */

export const Success: Story = {};

export const Warning: Story = {
	args: {
		variant: "warning",
		title: "Atenção necessária",
		message: "Alguns dados precisam ser revisados.",
	},
};

export const Error: Story = {
	args: {
		variant: "error",
		title: "Erro ao processar",
		message: "Não foi possível concluir a operação.",
	},
};

export const Info: Story = {
	args: {
		variant: "info",
		title: "Informação",
		message: "Esta ação pode ser desfeita posteriormente.",
	},
};

/* -------------------------------------------------------------------------- */
/*  Variações                                                                  */
/* -------------------------------------------------------------------------- */

export const Dismissible: Story = {
	args: {
		dismissible: true,
		onDismiss: () => console.log("Dismissed alert"),
		title: "Alerta fechável",
		message: "Você pode dispensar este alerta.",
	},
};

export const WithAction: Story = {
	args: {
		title: "Atualização disponível",
		message: "Uma nova versão está pronta para instalação.",
		action: {
			label: "Chip Label",
			onClick: () => console.log("Action clicked"),
		},
	},
};

export const WithoutIcon: Story = {
	args: {
		title: "Alerta sem ícone",
		message: "Este alerta não exibe ícone.",
		icon: null,
	},
};

export const CustomIcon: Story = {
	args: {
		variant: "info",
		title: "Ícone customizado",
		message: "Este alerta utiliza um ícone diferente do padrão.",
		icon: <InfoIcon size={24} weight="bold" />,
	},
};

/* -------------------------------------------------------------------------- */
/*  Estilos customizados                                                       */
/* -------------------------------------------------------------------------- */

export const CustomClassName: Story = {
	args: {
		title: "Estilo customizado",
		message: "Este alerta possui classes adicionais.",
		className: "shadow-lg",
	},
};

/* -------------------------------------------------------------------------- */
/*  Showcase                                                                   */
/* -------------------------------------------------------------------------- */

export const Examples: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div className="flex flex-col gap-4 w-full">
			<Alert
				variant="success"
				dismissible
				onDismiss={() => console.log("Dismissed alert")}
				action={{
					label: "Chip action",
					iconLeft: InfoIcon,
					variant: "success",
					onClick: () => console.log("Action clicked"),
				}}
				title="Success"
				message="With example message"
			/>

			<Alert
				variant="warning"
				dismissible
				onDismiss={() => console.log("Dismissed alert")}
				action={{
					label: "Chip action",
					iconLeft: InfoIcon,
					onClick: () => console.log("Action clicked"),
				}}
				title="Warning"
			/>
			<Alert
				variant="error"
				dismissible
				onDismiss={() => console.log("Dismissed alert")}
				action={{
					label: "Chip action",
					iconLeft: InfoIcon,
					variant: "danger",
					onClick: () => console.log("Action clicked"),
				}}
				title="Error"
			/>
			<Alert
				variant="info"
				dismissible
				onDismiss={() => console.log("Dismissed alert")}
				action={{
					label: "Chip action",
					iconLeft: InfoIcon,
					variant: "primary",
					onClick: () => console.log("Action clicked"),
				}}
				title="Info"
			/>
		</div>
	),
};
