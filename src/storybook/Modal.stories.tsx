import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState, type ComponentProps, type JSX } from "react";
import {
	CheckCircleIcon,
	CircleNotchIcon,
	ClipboardTextIcon,
	CloudArrowUpIcon,
	InfoIcon,
	PlusIcon,
	TrashIcon,
	WarningCircleIcon,
	WarningOctagonIcon,
} from "@phosphor-icons/react";
import { Modal } from "../components/Modal/Modal";
import { Button } from "../components/Button/Button";
import { Input } from "../components/Input/Input";
import { InputUpload } from "../components/Input/InputUpload";
import type { ModalVariant } from "../components/Modal/Modal.type";

const iconOptions = {
	none: null,
	InfoIcon: <InfoIcon size={22} weight="bold" />,
	CheckCircleIcon: <CheckCircleIcon size={22} weight="bold" />,
	WarningCircleIcon: <WarningCircleIcon size={22} weight="bold" />,
	WarningOctagonIcon: <WarningOctagonIcon size={22} weight="bold" />,
	ClipboardTextIcon: <ClipboardTextIcon size={22} weight="bold" />,
};

const meta: Meta<typeof Modal> = {
	title: "Feedback/Modal",
	component: Modal,
	tags: ["autodocs", "accessibility"],
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Modal acessivel com foco preso, overlay e area de acoes. Use para confirmacoes, fluxos curtos e informacoes que exigem decisao.",
			},
		},
	},
	argTypes: {
		isOpen: {
			control: "boolean",
			description: "Controla visibilidade do modal.",
		},
		onOpenChange: {
			control: false,
			description: "Callback disparado quando o estado de abertura do modal muda.",
		},
		title: {
			control: "text",
			description: "Titulo do modal.",
		},
		description: {
			control: "text",
			description: "Descrição principal.",
		},
		size: {
			control: { type: "select" },
			options: ["sm", "md", "lg"],
			description: "Tamanho do modal.",
		},
		variant: {
			control: { type: "select" },
			options: ["default", "confirmation", "warning", "destructive", "fullscreen", "form"],
			description: "Variação visual e semantica.",
		},
		verticalPosition: {
			control: "select",
			options: ["top", "center", "bottom"],
			description: "Define o posicionamento vertical do modal.",
		},
		state: {
			control: { type: "select" },
			options: ["default", "loading", "error", "success"],
			description: "Estado visual do modal.",
		},
		closeOnOverlayClick: {
			control: "boolean",
			description: "Define se clicar no overlay fecha o modal.",
		},
		closeOnEsc: {
			control: "boolean",
			description: "Define se ESC fecha o modal.",
		},
		showCloseButton: {
			control: "boolean",
			description: "Exibe o botao de fechar no header.",
		},
		isContentScrollable: {
			control: "boolean",
			description: "Habilita scroll interno do conteudo.",
		},
		isTitleIconColorSynced: {
			control: "boolean",
			description: "Sincroniza a cor do titulo com o icone.",
		},
		icon: {
			control: { type: "select" },
			options: Object.keys(iconOptions),
			mapping: iconOptions,
			description: "Icone exibido no header.",
		},
		actions: {
			control: false,
			description: "Define as acoes (botoes) exibidas no footer do modal.",
		},
		loadingLabel: {
			control: "text",
			description: "Texto exibido no estado de carregamento.",
		},
		children: {
			control: false,
			description: "Conteudo principal do modal.",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Modal>;

const PositioningExample = (args: ComponentProps<typeof Modal>) => (
	<ModalStoryShell {...args}>
		<p className="text-[var(--ds-color-neutral-10)]">
			Ajuste verticalmente este modal pelo controle verticalPosition.
		</p>
	</ModalStoryShell>
);

const variantIcons: Record<ModalVariant, JSX.Element | null> = {
	default: iconOptions.InfoIcon,
	confirmation: iconOptions.CheckCircleIcon,
	warning: iconOptions.WarningCircleIcon,
	destructive: iconOptions.WarningOctagonIcon,
	fullscreen: iconOptions.InfoIcon,
	form: iconOptions.ClipboardTextIcon,
};

const ModalStoryShell = (args: ComponentProps<typeof Modal>) => {
	const [open, setOpen] = useState(true);
	const icon = args.icon ?? variantIcons[args.variant ?? "default"];

	const actions = useMemo(() => {
		const primaryVariant = args.variant === "destructive" ? "error" : "primary";
		const primaryLabel = args.variant === "destructive" ? "Remover" : "Confirmar";
		return {
			primary: {
				label: primaryLabel,
				variant: primaryVariant as "primary" | "secondary" | "text" | "error" | "outline",
				size: "md" as "sm" | "md" | "lg",
				onClick: () => setOpen(false),
			},
			secondary: {
				label: "Cancelar",
				variant: "text" as "primary" | "secondary" | "text" | "error" | "outline",
				size: "md" as "sm" | "md" | "lg",
				onClick: () => setOpen(false),
			},
		};
	}, [args.variant]);

	const resolvedActions = args.actions ?? actions;

	return (
		<div className="min-h-screen bg-[var(--ds-bg-secondary)] p-6 flex items-center justify-center">
			{!open && (
				<Button variant="primary" size="md" onClick={() => setOpen(true)}>
					Abrir modal
				</Button>
			)}
			<Modal
				{...args}
				icon={icon ?? undefined}
				isOpen={open}
				onOpenChange={setOpen}
				actions={resolvedActions}
			/>
		</div>
	);
};

export const SchoolSummary: Story = {
	args: {
		title: "Resumo da escola",
		description: "Revise os dados antes de concluir.",
		size: "md",
		variant: "default",
	},
	render: (args) => (
		<ModalStoryShell {...args}>
			<div className="flex flex-col gap-4 text-[var(--ds-color-neutral-10)]">
				<p>Os ajustes abaixo serao aplicados ao perfil da unidade.</p>
				<div className="grid gap-3">
					<div className="rounded-[var(--ds-radius-md)] bg-[var(--ds-color-neutral-95)] p-4">
						<p className="text-body-4 text-[var(--ds-color-neutral-40)]">Turnos</p>
						<p className="text-body-3">Manha e tarde</p>
					</div>
					<div className="rounded-[var(--ds-radius-md)] bg-[var(--ds-color-neutral-95)] p-4">
						<p className="text-body-4 text-[var(--ds-color-neutral-40)]">Alunos ativos</p>
						<p className="text-body-3">842 matriculas</p>
					</div>
				</div>
			</div>
		</ModalStoryShell>
	),
};

export const EnrollmentConfirmation: Story = {
	args: {
		title: "Confirmar matricula",
		description: "Os dados serao enviados para a secretaria.",
		size: "sm",
		variant: "confirmation",
		isTitleIconColorSynced: true,
	},
	render: (args) => (
		<ModalStoryShell {...args}>
			<ul className="list-disc pl-5 text-[var(--ds-color-neutral-10)]">
				<li>Historico escolar anexado</li>
				<li>Documentos conferidos</li>
				<li>Responsavel notificado</li>
			</ul>
		</ModalStoryShell>
	),
};

export const ScheduleWarning: Story = {
	args: {
		title: "Conflito de horario",
		description: "Existem turmas sem professor alocado.",
		size: "md",
		variant: "warning",
		isTitleIconColorSynced: true,
	},
	render: (args) => (
		<ModalStoryShell {...args}>
			<div className="flex flex-col gap-4 text-[var(--ds-color-neutral-10)]">
				<p>Revise as aulas marcadas para o turno da tarde.</p>
				<div className="rounded-[var(--ds-radius-md)] bg-[var(--ds-color-orange-95)] p-4">
					<p className="text-body-3 text-[var(--ds-color-orange-40)]">
						3 turmas sem docente confirmado.
					</p>
				</div>
			</div>
		</ModalStoryShell>
	),
};

export const StudentRemoval: Story = {
	args: {
		title: "Excluir aluno",
		description: "Os registros academicos serao removidos permanentemente.",
		size: "md",
		variant: "destructive",
		closeOnOverlayClick: false,
		closeOnEsc: false,
		isTitleIconColorSynced: true,
	},
	render: (args) => (
		<ModalStoryShell {...args}>
			<div className="flex flex-col gap-3 text-[var(--ds-color-neutral-10)]">
				<p>Antes de continuar, exporte o boletim e os registros de frequencia.</p>
				<p className="text-body-4 text-[var(--ds-color-red-50)]">
					Esta ação nao podera ser desfeita.
				</p>
			</div>
		</ModalStoryShell>
	),
};

export const AcademicPlanFullscreen: Story = {
	args: {
		title: "Plano pedagogico",
		description: "Valide todas as etapas antes de enviar.",
		size: "lg",
		variant: "fullscreen",
	},
	render: (args) => (
		<ModalStoryShell {...args}>
			<div className="flex flex-col gap-6 text-[var(--ds-color-neutral-10)]">
				<div className="grid gap-3 rounded-[var(--ds-radius-md)] bg-[var(--ds-color-neutral-95)] p-4">
					<p className="text-body-4 text-[var(--ds-color-neutral-40)]">Etapa 1</p>
					<p className="text-body-3">Diagnostico de aprendizagem por serie.</p>
				</div>
				<div className="grid gap-3 rounded-[var(--ds-radius-md)] bg-[var(--ds-color-neutral-95)] p-4">
					<p className="text-body-4 text-[var(--ds-color-neutral-40)]">Etapa 2</p>
					<p className="text-body-3">Metas de recuperação para o segundo semestre.</p>
				</div>
				<div className="grid gap-3 rounded-[var(--ds-radius-md)] bg-[var(--ds-color-neutral-95)] p-4">
					<p className="text-body-4 text-[var(--ds-color-neutral-40)]">Etapa 3</p>
					<p className="text-body-3">Plano de acompanhamento familiar.</p>
				</div>
			</div>
		</ModalStoryShell>
	),
};

export const GuardianForm: Story = {
	args: {
		title: "Cadastrar responsavel",
		description: "Informe os dados para liberar o acesso ao portal.",
		size: "md",
		variant: "form",
	},
	render: (args) => (
		<ModalStoryShell {...args}>
			<form className="flex flex-col gap-4">
				<Input label="Nome completo" placeholder="Digite o nome" required />
				<Input label="E-mail" type="email" placeholder="Digite o e-mail" required />
				<Input label="Telefone" type="tel" mask="(00) 00000-0000" placeholder="(00) 00000-0000" />
			</form>
		</ModalStoryShell>
	),
};

export const RequestWithUpload: Story = {
	args: {
		title: "Solicitar ajuste",
		description: "Preencha os campos para registrar a solicitação.",
		size: "md",
		variant: "form",
	},
	render: (args) => (
		<ModalStoryShell {...args}>
			<form className="flex flex-col gap-4">
				<Input
					label="Titulo"
					placeholder="Digite o titulo"
					required
					iconLeft={<PlusIcon />}
					iconRight={<PlusIcon />}
				/>
				<div className="flex flex-col gap-2">
					<label
						htmlFor="modal-request-description"
						className="flex items-center gap-1 font-body text-[var(--ds-color-neutral-10)] font-[var(--ds-label-1-weight)]"
					>
						Descrição
						<span className="text-[var(--ds-color-red-40)]">*</span>
					</label>
					<textarea
						id="modal-request-description"
						required
						rows={4}
						placeholder="Descreva a solicitação"
						className="w-full rounded-[var(--ds-radius-md)] border border-[var(--ds-color-neutral-50)] bg-transparent px-[var(--ds-pad-textarea-x)] py-[var(--ds-pad-textarea-y)] font-body text-[var(--ds-body-3-size)] text-[var(--ds-color-neutral-10)] placeholder:text-[var(--ds-color-neutral-30)] focus-within:border-[var(--ds-color-blue-10)] focus-within:ring-1 focus-within:ring-[var(--ds-color-blue-10)]"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="font-body text-[var(--ds-color-neutral-10)] font-[var(--ds-label-1-weight)]">
						Anexos
					</label>
					<InputUpload
						iconLeft={<CloudArrowUpIcon />}
						iconRight={<TrashIcon />}
						maxSize={5}
						acceptedFormats={["pdf", "doc", "docx"]}
					/>
				</div>
			</form>
		</ModalStoryShell>
	),
};

export const SyncingGrades: Story = {
	args: {
		title: "Sincronizando notas",
		description: "Atualizando lancamentos do bimestre.",
		size: "sm",
		variant: "default",
		state: "loading",
		loadingLabel: "Sincronizando",
	},
	render: (args) => (
		<ModalStoryShell {...args}>
			<p className="text-[var(--ds-color-neutral-10)]">Nao feche esta janela ate a conclusao.</p>
		</ModalStoryShell>
	),
};

export const CenteredLoadingContent: Story = {
	args: {
		title: "Gerando boletins",
		description: "Carregando indicadores por turma.",
		size: "sm",
		variant: "default",
		actions: {
			primary: {
				label: "Confirmar",
				variant: "primary",
				size: "md",
				isLoading: true,
			},
			secondary: {
				label: "Cancelar",
				variant: "text",
				size: "md",
			},
		},
	},
	render: (args) => (
		<ModalStoryShell {...args}>
			<div className="flex items-center justify-center text-[var(--ds-color-neutral-10)]">
				<CircleNotchIcon size={32} weight="bold" className="animate-spin" />
			</div>
		</ModalStoryShell>
	),
};

export const ApprovalQueue: Story = {
	args: {
		title: "Aplicacoes escolares",
		description: "Selecione quais pedidos deseja aprovar.",
		size: "lg",
		variant: "default",
		isContentScrollable: true,
	},
	render: (args) => (
		<ModalStoryShell {...args}>
			<div className="flex flex-col gap-4 text-[var(--ds-color-neutral-10)]">
				<div className="rounded-[var(--ds-radius-md)] bg-[var(--ds-color-neutral-95)] p-4">
					<p className="text-body-4 text-[var(--ds-color-neutral-40)]">Transferencia de alunos</p>
					<p className="text-body-3">8 solicitacoes aguardando validação</p>
				</div>
				<div className="rounded-[var(--ds-radius-md)] bg-[var(--ds-color-neutral-95)] p-4">
					<p className="text-body-4 text-[var(--ds-color-neutral-40)]">Matriz curricular</p>
					<p className="text-body-3">Atualização de carga horaria 2025</p>
				</div>
				<div className="rounded-[var(--ds-radius-md)] bg-[var(--ds-color-neutral-95)] p-4">
					<p className="text-body-4 text-[var(--ds-color-neutral-40)]">Calendario escolar</p>
					<p className="text-body-3">Adequação de feriados municipais</p>
				</div>
				<div className="rounded-[var(--ds-radius-md)] bg-[var(--ds-color-neutral-95)] p-4">
					<p className="text-body-4 text-[var(--ds-color-neutral-40)]">Projetos especiais</p>
					<p className="text-body-3">3 propostas aguardando parecer</p>
				</div>
			</div>
		</ModalStoryShell>
	),
};

export const SuccessState: Story = {
	args: {
		title: "Atualização concluida",
		description: "Os dados da escola foram publicados.",
		size: "sm",
		variant: "confirmation",
		state: "success",
	},
	render: (args) => (
		<ModalStoryShell {...args}>
			<div className="flex flex-col gap-3 text-[var(--ds-color-neutral-10)]">
				<p>Os ajustes ja aparecem no portal da secretaria.</p>
				<p className="text-body-4 text-[var(--ds-color-neutral-40)]">
					Voce pode revisar o historico completo em Relatorios.
				</p>
			</div>
		</ModalStoryShell>
	),
};

export const Default: Story = {
	args: { title: "Modal padrão", description: "Posição central, como no comportamento atual." },
	render: (args) => <PositioningExample {...args} />,
};

export const Top: Story = {
	args: { title: "Modal no topo", verticalPosition: "top" },
	render: (args) => <PositioningExample {...args} />,
};

export const Center: Story = {
	args: { title: "Modal centralizado", verticalPosition: "center" },
	render: (args) => <PositioningExample {...args} />,
};

export const Bottom: Story = {
	args: { title: "Modal na parte inferior", verticalPosition: "bottom" },
	render: (args) => <PositioningExample {...args} />,
};

export const LongContent: Story = {
	args: {
		title: "Conteúdo extenso",
		description: "O modal respeita a altura disponível e permite rolagem.",
		verticalPosition: "top",
		isContentScrollable: true,
	},
	render: (args) => (
		<ModalStoryShell {...args}>
			<div className="flex flex-col gap-4 text-[var(--ds-color-neutral-10)]">
				{Array.from({ length: 16 }, (_, index) => (
					<p key={index}>
						Seção {index + 1}: conteúdo demonstrativo para testar a rolagem do modal.
					</p>
				))}
			</div>
		</ModalStoryShell>
	),
};

export const InteractivePositioning: Story = {
	args: {
		title: "Posicionamento interativo",
		description: "Use o controle verticalPosition no painel Controls.",
		verticalPosition: "center",
	},
	render: (args) => <PositioningExample {...args} />,
};
