import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "../components/Skeleton/Skeleton";

const meta: Meta<typeof Skeleton> = {
	title: "Components/Skeleton",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Componente Skeleton Loader para indicar carregamento de conteúdo. Segue as especificações do Design System com suporte a modo claro/escuro, variações (linha, retângulo, círculo) e animações (shimmer/pulse).",
			},
		},
	},
	component: Skeleton,
	argTypes: {
		variant: {
			control: "select",
			options: ["line", "rectangle", "circle"],
			description: "Define a forma visual do skeleton (linha, retângulo ou círculo).",
		},
		animation: {
			control: "select",
			options: ["shimmer", "pulse", "none"],
			description: "Define o tipo de animação (shimmer=wave, pulse ou nenhuma).",
		},
		width: {
			control: "text",
			description: "Largura do skeleton (número em px ou string com unidade).",
		},
		height: {
			control: "text",
			description: "Altura do skeleton (número em px ou string com unidade).",
		},
		lines: {
			control: "number",
			description: "Quantidade de linhas para variant line.",
		},
		gap: {
			control: "text",
			description: "Espaçamento entre linhas quando lines > 1.",
		},
		ariaLabel: {
			control: "text",
			description: "Label personalizado para leitores de tela.",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Examples: Story = {
	render: () => (
		<div className="space-y-12 p-8 rounded-lg">
			{/* Variantes Básicas */}
			<section>
				<h3 className="text-lg font-semibold mb-4 text-[var(--ds-color-neutral-10)]">
					Variantes Básicas
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="space-y-2 bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] p-4 rounded-lg">
						<p className="text-sm text-[var(--ds-color-neutral-30)] mb-2">Linha</p>
						<Skeleton variant="line" width="100%" />
					</div>
					<div className="space-y-2 bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] p-4 rounded-lg">
						<p className="text-sm text-[var(--ds-color-neutral-30)] mb-2">Retângulo</p>
						<Skeleton variant="rectangle" width="100%" height={118} />
					</div>
					<div className="space-y-2 bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] p-4 rounded-lg">
						<p className="text-sm text-[var(--ds-color-neutral-30)] mb-2">Círculo</p>
						<Skeleton variant="circle" width={38} height={38} />
					</div>
				</div>
			</section>

			{/* Animações */}
			<section>
				<h3 className="text-lg font-semibold mb-4 text-[var(--ds-color-neutral-10)]">
					Tokens de Animação
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="space-y-2 bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] p-4 rounded-lg">
						<p className="text-sm text-[var(--ds-color-neutral-30)] mb-2">Shimmer (default)</p>
						<Skeleton animation="shimmer" width="100%" height={64} />
					</div>
					<div className="space-y-2 bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] p-4 rounded-lg">
						<p className="text-sm text-[var(--ds-color-neutral-30)] mb-2">Pulse</p>
						<Skeleton animation="pulse" width="100%" height={64} />
					</div>
					<div className="space-y-2 bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] p-4 rounded-lg">
						<p className="text-sm text-[var(--ds-color-neutral-30)] mb-2">Sem Animação</p>
						<Skeleton animation="none" width="100%" height={64} />
					</div>
				</div>
			</section>

			{/* Padrões Comuns (do Figma) */}
			<section>
				<h3 className="text-lg font-semibold mb-4 text-[var(--ds-color-neutral-10)]">
					Padrões Comuns (Figma)
				</h3>

				<div className="space-y-4">
					{/* Card Simples */}
					<div className="bg-[var(--ds-color-neutral-95)] rounded-2xl border border-[#E2E8F0] p-6">
						<Skeleton variant="line" width="100%" />
					</div>

					{/* Card com Avatar e Texto */}
					<div className="bg-[var(--ds-color-neutral-95)] rounded-2xl border border-[#E2E8F0] p-6">
						<div className="flex items-center gap-4">
							<Skeleton variant="circle" width={38} height={38} />
							<Skeleton variant="line" width="100%" />
						</div>
					</div>

					{/* Card Complexo */}
					<div className="bg-[var(--ds-color-neutral-95)] rounded-2xl border border-[#E2E8F0] p-6">
						<div className="space-y-4">
							<Skeleton variant="line" width="100%" />
							<Skeleton variant="line" width="100%" />
							<Skeleton variant="line" width="100%" />
							<Skeleton variant="rectangle" width="100%" height={118} />
						</div>
					</div>
				</div>
			</section>

			{/* Múltiplas Linhas */}
			<section>
				<h3 className="text-lg font-semibold mb-4 text-[var(--ds-color-neutral-10)]">
					Múltiplas Linhas (Grupos)
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2 bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] p-4 rounded-lg">
						<p className="text-sm text-[var(--ds-color-neutral-30)]">3 linhas</p>
						<Skeleton lines={3} width="100%" />
					</div>
					<div className="space-y-2 bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] p-4 rounded-lg">
						<p className="text-sm text-[var(--ds-color-neutral-30)]">
							5 linhas com gap customizado
						</p>
						<Skeleton lines={5} width="100%" gap="0.75rem" />
					</div>
				</div>
			</section>

			{/* Casos de Uso Práticos */}
			<section>
				<h3 className="text-lg font-semibold mb-4 text-[var(--ds-color-neutral-10)]">
					Exemplos de Uso Isolado e em Grupos
				</h3>

				{/* Card de Perfil */}
				<div className="space-y-6">
					<div>
						<p className="text-sm text-[var(--ds-color-neutral-30)] mb-3">Card de Perfil</p>
						<div className="bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] rounded-lg p-6 max-w-md">
							<div className="flex items-start gap-4">
								<Skeleton variant="circle" width={64} height={64} />
								<div className="flex-1">
									<Skeleton width="60%" height={20} className="mb-2" />
									<Skeleton width="40%" height={16} />
								</div>
							</div>
							<div className="mt-4">
								<Skeleton lines={3} />
							</div>
						</div>
					</div>

					{/* Lista de Posts */}
					<div>
						<p className="text-sm text-[var(--ds-color-neutral-30)] mb-3">Lista de Posts</p>
						<div className="space-y-4 max-w-2xl">
							{[1, 2, 3].map((item) => (
								<div
									key={item}
									className="bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] rounded-lg p-4"
								>
									<div className="flex items-center gap-3 mb-3">
										<Skeleton variant="circle" width={40} height={40} />
										<div className="flex-1">
											<Skeleton width="30%" height={16} className="mb-1" />
											<Skeleton width="20%" height={14} />
										</div>
									</div>
									<Skeleton lines={2} className="mb-3" />
									<Skeleton variant="rectangle" width="100%" height={200} />
								</div>
							))}
						</div>
					</div>

					{/* Grid de Cards */}
					<div>
						<p className="text-sm text-[var(--ds-color-neutral-30)] mb-3">Grid de Cards (Grupo)</p>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{[1, 2, 3].map((item) => (
								<div
									key={item}
									className="bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] rounded-lg p-4"
								>
									<Skeleton variant="rectangle" width="100%" height={120} className="mb-3" />
									<Skeleton width="80%" height={18} className="mb-2" />
									<Skeleton width="60%" height={14} />
								</div>
							))}
						</div>
					</div>

					{/* Tabela */}
					<div>
						<p className="text-sm text-[var(--ds-color-neutral-30)] mb-3">Tabela (Grupo)</p>
						<div className="bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] rounded-lg overflow-hidden">
							<div className="bg-[var(--ds-color-neutral-90)] p-4 grid grid-cols-4 gap-4">
								<Skeleton width="100%" height={16} />
								<Skeleton width="100%" height={16} />
								<Skeleton width="100%" height={16} />
								<Skeleton width="100%" height={16} />
							</div>
							{[1, 2, 3, 4].map((item) => (
								<div
									key={item}
									className="p-4 grid grid-cols-4 gap-4 border-t border-[var(--ds-color-neutral-70)]"
								>
									<Skeleton width="80%" height={14} />
									<Skeleton width="70%" height={14} />
									<Skeleton width="90%" height={14} />
									<Skeleton width="60%" height={14} />
								</div>
							))}
						</div>
					</div>

					{/* Formulário */}
					<div>
						<p className="text-sm text-[var(--ds-color-neutral-30)] mb-3">Formulário (Isolado)</p>
						<div className="bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] rounded-lg p-6 max-w-md space-y-4">
							<div>
								<Skeleton width="30%" height={14} className="mb-2" />
								<Skeleton width="100%" height={40} variant="rectangle" />
							</div>
							<div>
								<Skeleton width="40%" height={14} className="mb-2" />
								<Skeleton width="100%" height={40} variant="rectangle" />
							</div>
							<div>
								<Skeleton width="35%" height={14} className="mb-2" />
								<Skeleton width="100%" height={100} variant="rectangle" />
							</div>
							<Skeleton width="30%" height={40} variant="rectangle" />
						</div>
					</div>
				</div>
			</section>

			{/* Modo Claro/Escuro */}
			<section>
				<h3 className="text-lg font-semibold mb-4 text-[var(--ds-color-neutral-10)]">
					Suporte a Modo Claro e Escuro
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] p-6 rounded-lg">
						<p className="text-sm text-[var(--ds-color-neutral-30)] mb-4">Modo Claro</p>
						<Skeleton variant="line" width="100%" className="mb-2" />
						<Skeleton variant="line" width="80%" className="mb-4" />
						<Skeleton variant="rectangle" width="100%" height={100} />
					</div>
					<div className="bg-[var(--ds-color-neutral-10)] p-6 rounded-lg">
						<p className="text-sm text-[var(--ds-color-neutral-70)] mb-4">Modo Escuro</p>
						<Skeleton variant="line" width="100%" className="mb-2" />
						<Skeleton variant="line" width="80%" className="mb-4" />
						<Skeleton variant="rectangle" width="100%" height={100} />
					</div>
				</div>
			</section>

			{/* Acessibilidade */}
			<section>
				<h3 className="text-lg font-semibold mb-4 text-[var(--ds-color-neutral-10)]">
					Acessibilidade
				</h3>
				<div className="bg-[var(--ds-color-neutral-95)] border border-[#E2E8F0] rounded-lg p-6 max-w-2xl">
					<p className="text-sm text-[var(--ds-color-neutral-30)] mb-4">
						O componente inclui atributos ARIA apropriados:
					</p>
					<ul className="list-disc list-inside space-y-2 text-sm text-[var(--ds-color-neutral-20)] mb-6">
						<li>
							<code>role="status"</code> - Indica que é uma área de status
						</li>
						<li>
							<code>aria-live="polite"</code> - Leitores de tela anunciam mudanças sem interromper
						</li>
						<li>
							<code>aria-label="Carregando..."</code> - Descrição personaliz ável para contexto
						</li>
						<li>
							<code>aria-hidden="true"</code> - Elementos decorativos em grupos não são lidos
						</li>
					</ul>
					<Skeleton variant="line" lines={2} ariaLabel="Carregando informações do perfil" />
				</div>
			</section>
		</div>
	),
};

export const Default: Story = {
	args: {
		variant: "line",
		animation: "shimmer",
		width: "100%",
	},
};

export const Circle: Story = {
	args: {
		variant: "circle",
		width: 38,
		height: 38,
	},
};

export const Rectangle: Story = {
	args: {
		variant: "rectangle",
		width: 200,
		height: 118,
	},
};

export const MultipleLines: Story = {
	args: {
		variant: "line",
		lines: 4,
		width: "100%",
	},
};

export const ShimmerAnimation: Story = {
	args: {
		variant: "rectangle",
		animation: "shimmer",
		width: 300,
		height: 150,
	},
};

export const PulseAnimation: Story = {
	args: {
		variant: "rectangle",
		animation: "pulse",
		width: 300,
		height: 150,
	},
};

export const NoAnimation: Story = {
	args: {
		variant: "rectangle",
		animation: "none",
		width: 300,
		height: 150,
	},
};
