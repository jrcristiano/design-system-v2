import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "../components/Accordion/Accordion";

const GridContent = () => (
	<div className="w-full flex flex-wrap gap-4 pb-5">
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
			<div className="flex flex-col gap-1">
				<span className="text-label-1 text-[var(--ds-color-neutral-40)] font-body">
					Nome completo
				</span>
				<span className="font-body font-[var(--ds-font-weight-regular)] text-[var(--ds-font-size-16)] leading-[24px] text-[var(--ds-color-neutral-10)]">
					EEIP Mundo Encantado
				</span>
			</div>

			<div className="flex flex-col gap-1">
				<span className="text-label-1 text-[var(--ds-color-neutral-40)] font-body">
					Código INEP
				</span>
				<span className="font-body font-[var(--ds-font-weight-regular)] text-[var(--ds-font-size-16)] leading-[24px] text-[var(--ds-color-neutral-10)]">
					43008100
				</span>
			</div>

			<div className="flex flex-col gap-1">
				<span className="text-label-1 text-[var(--ds-color-neutral-40)] font-body">Cidade</span>
				<span className="font-body font-[var(--ds-font-weight-regular)] text-[var(--ds-font-size-16)] leading-[24px] text-[var(--ds-color-neutral-10)]">
					Vitória
				</span>
			</div>

			<div className="flex flex-col gap-1">
				<span className="text-label-1 text-[var(--ds-color-neutral-40)] font-body">Estado</span>
				<span className="font-body font-[var(--ds-font-weight-regular)] text-[var(--ds-font-size-16)] leading-[24px] text-[var(--ds-color-neutral-10)]">
					ES
				</span>
			</div>

			<div className="flex flex-col gap-1">
				<span className="text-label-1 text-[var(--ds-color-neutral-40)] font-body">CEP</span>
				<span className="font-body font-[var(--ds-font-weight-regular)] text-[var(--ds-font-size-16)] leading-[24px] text-[var(--ds-color-neutral-10)]">
					00000-000
				</span>
			</div>

			<div className="col-span-1 sm:col-span-2 flex flex-col gap-1">
				<span className="text-label-1 text-[var(--ds-color-neutral-40)] font-body">Endereço</span>
				<span className="font-body font-[var(--ds-font-weight-regular)] text-[var(--ds-font-size-16)] leading-[24px] text-[var(--ds-color-neutral-10)]">
					Rua Waldomiro Vieira, 345, Pinheiro
				</span>
			</div>

			<div className="col-span-1 sm:col-span-2 md:col-span-3 flex flex-col gap-1">
				<span className="text-label-1 text-[var(--ds-color-neutral-40)] font-body">
					Etapas de ensino
				</span>
				<span className="font-body text-[var(--ds-font-size-16)] leading-[24px] text-[var(--ds-color-neutral-10)]">
					Pré-Escola, Anos Iniciais do Ensino Fundamental, Anos Finais do Ensino Fundamental
				</span>
			</div>

			<div className="flex flex-col gap-1">
				<span className="text-label-1 text-[var(--ds-color-neutral-40)] font-body">
					Rede de ensino
				</span>
				<span className="font-body font-[var(--ds-font-weight-regular)] text-[var(--ds-font-size-16)] leading-[24px] text-[var(--ds-color-neutral-10)]">
					Pública
				</span>
			</div>
		</div>
	</div>
);

const meta: Meta<typeof Accordion> = {
	title: "Components/Accordions",
	component: Accordion,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Componente de accordion (expansível) com suporte a diferentes estados visuais e layouts de conteúdo. Totalmente interativo com hover, pressed e focused states automáticos.",
			},
		},
	},
	argTypes: {
		title: {
			control: "text",
			description: "Título exibido no cabeçalho do accordion",
		},
		state: {
			control: "select",
			options: ["default", "hover", "pressed", "focused", "selected"],
			description: "Estado visual do accordion (opcional - automático por padrão)",
		},
		isOpen: {
			control: "boolean",
			description: "Controla se o accordion está aberto (deixe undefined para modo não controlado)",
		},
		children: {
			control: false,
			description: "Conteúdo do accordion",
		},
		onToggle: {
			control: false,
			table: { disable: true },
			description: "(removido) callback obsoleto - não use",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
	render: (args) => (
		<div className="w-full flex flex-col gap-4 p-4">
			<Accordion title="EEIP Mundo Encantado" {...args}>
				<GridContent />
			</Accordion>

			<Accordion title="EEIP Mundo Encantado 2" {...args}>
				<GridContent />
			</Accordion>

			<Accordion title="EEIP Mundo Encantado 3" {...args}>
				<GridContent />
			</Accordion>
		</div>
	),
};
