import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";
import { toast } from "react-toastify";
import {
	CheckCircleIcon,
	CheckIcon,
	InfoIcon,
	WarningCircleIcon,
	WarningOctagonIcon,
} from "@phosphor-icons/react";
import { Button } from "../components/Button/Button";
import { Toast } from "../components/Toast/Toast";
import type { ToastProps } from "../components/Toast/Toast.interface";
import {
	toastSuccessWithChip,
	toastErrorWithChip,
	toastWarningWithChip,
	toastInfoWithChip,
	toastSuccessWithLink,
	toastErrorWithLink,
	toastWarningWithLink,
	toastInfoWithLink,
} from "../components/Toast";

const iconOptions = {
	none: null,
	InfoIcon: <InfoIcon size={20} weight="bold" className="text-white" />,
	CheckCircleIcon: <CheckCircleIcon size={20} weight="bold" className="text-white" />,
	WarningCircleIcon: <WarningCircleIcon size={20} weight="bold" className="text-white" />,
	WarningOctagonIcon: <WarningOctagonIcon size={20} weight="bold" className="text-white" />,
};

type ToastStoryProps = ToastProps & {
	variant?: "info" | "success" | "warning" | "danger";
	title?: string;
	icon?: ReactElement | null;
};

const ToastStory = ({ variant = "info", title = "", icon, ...containerProps }: ToastStoryProps) => {
	const notify = () => {
		const options = { icon: icon ?? undefined };
		if (variant === "success") return toast.success(title, options);
		if (variant === "warning") return toast.warning(title, options);
		if (variant === "danger") return toast.error(title, options);
		return toast.info(title, options);
	};

	return (
		<div className="min-h-screen p-6">
			<div className="flex flex-wrap gap-3">
				<Button variant="primary" size="md" onClick={notify}>
					Disparar toast
				</Button>
			</div>
			<Toast {...containerProps} />
		</div>
	);
};

const meta: Meta<typeof ToastStory> = {
	title: "Feedback/Toast",
	component: ToastStory,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["info", "success", "warning", "danger"],
			description: "Define o tipo do toast.",
		},
		title: {
			control: { type: "text" },
			description: "Titulo do toast.",
		},
		icon: {
			control: { type: "select" },
			options: Object.keys(iconOptions),
			mapping: iconOptions,
			description: "Icone exibido no toast.",
		},
		floatingOn: {
			control: { type: "select" },
			options: [
				"top-right",
				"top-left",
				"top-center",
				"bottom-right",
				"bottom-left",
				"bottom-center",
			],
			description: "Define a posicao do toast na tela.",
		},
	},
};

export default meta;
type Story = StoryObj<typeof ToastStory>;

export const Playground: Story = {
	args: {
		variant: "info",
		title: "Atualização enviada",
		icon: iconOptions.InfoIcon,
		floatingOn: "top-right",
	},
	render: (args) => <ToastStory {...args} />,
};

export const Variants: Story = {
	render: (args) => {
		const { ...containerProps } = args;

		return (
			<div className="min-h-screen p-6">
				<div className="flex flex-col gap-3">
					<Button
						variant="primary"
						size="md"
						onClick={() =>
							toast.info("Existem atualizacoes pendentes.", {
								icon: <InfoIcon size={20} weight="bold" className="text-white" />,
							})
						}
					>
						Disparar info
					</Button>
					<Button
						variant="primary"
						size="md"
						onClick={() =>
							toast.success("Os arquivos foram processados.", {
								icon: <CheckCircleIcon size={20} weight="bold" className="text-white" />,
							})
						}
					>
						Disparar sucesso
					</Button>
					<Button
						variant="primary"
						size="md"
						onClick={() =>
							toast.warning("Revise os dados antes de enviar.", {
								icon: <WarningCircleIcon size={20} weight="bold" className="text-white" />,
							})
						}
					>
						Disparar warning
					</Button>
					<Button
						variant="primary"
						size="md"
						onClick={() =>
							toast.error("Nao foi possivel concluir a operação.", {
								icon: <WarningOctagonIcon size={20} weight="bold" className="text-white" />,
							})
						}
					>
						Disparar danger
					</Button>
				</div>
				<Toast {...containerProps} />
			</div>
		);
	},
};

export const WithChip: Story = {
	render: (args) => {
		const { ...containerProps } = args;

		return (
			<div className="min-h-screen p-6">
				<div className="flex flex-col gap-3">
					<Button
						variant="primary"
						size="md"
						onClick={() =>
							toastInfoWithChip("Existem atualizacoes pendentes.", {
								variant: "primary",
								state: "default",
								iconLeft: CheckIcon,
							})
						}
					>
						Disparar info com chip
					</Button>
					<Button
						variant="primary"
						size="md"
						onClick={() =>
							toastSuccessWithChip("Os arquivos foram processados.", {
								variant: "success",
								children: "Completo",
								state: "default",
							})
						}
					>
						Disparar sucesso com chip
					</Button>
					<Button
						variant="primary"
						size="md"
						onClick={() =>
							toastWarningWithChip("Revise os dados antes de enviar.", {
								variant: "success",
								children: "Ok",
							})
						}
					>
						Disparar warning com chip
					</Button>
					<Button
						variant="primary"
						size="md"
						onClick={() =>
							toastErrorWithChip("Nao foi possivel concluir a operação.", {
								variant: "danger",
								children: "Erro",
								state: "default",
							})
						}
					>
						Disparar danger com chip
					</Button>
				</div>
				<Toast {...containerProps} />
			</div>
		);
	},
};

export const WithLink: Story = {
	render: (args) => {
		const { ...containerProps } = args;

		return (
			<div className="min-h-screen p-6">
				<div className="flex flex-col gap-3">
					<Button
						variant="primary"
						size="md"
						onClick={() =>
							toastInfoWithLink("Existem atualizacoes pendentes.", {
								text: "Saiba mais",
								href: "https://example.com",
							})
						}
					>
						Toast info com link
					</Button>
					<Button
						variant="primary"
						size="md"
						onClick={() =>
							toastSuccessWithLink("Os arquivos foram processados.", {
								text: "Ver detalhes",
								href: "https://example.com/details",
							})
						}
					>
						Toast success com link
					</Button>
					<Button
						variant="primary"
						size="md"
						onClick={() =>
							toastWarningWithLink("Revise os dados antes de enviar.", {
								text: "Abrir editor",
								href: "https://example.com/editor",
							})
						}
					>
						Toast warning com link
					</Button>
					<Button
						variant="primary"
						size="md"
						onClick={() =>
							toastErrorWithLink("Nao foi possivel concluir a operação.", {
								text: "Ver erro",
								href: "https://example.com/error",
							})
						}
					>
						Toast error com link
					</Button>
				</div>
				<Toast {...containerProps} />
			</div>
		);
	},
};
