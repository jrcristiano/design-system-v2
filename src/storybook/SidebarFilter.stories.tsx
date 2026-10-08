import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { useState } from "react";
import { SidebarFilter } from "../components/SidebarFilter/SidebarFilter";
import { SidebarFilterTrigger } from "../components/SidebarFilter/SidebarFilterTrigger";
import { SidebarFilterPanel } from "../components/SidebarFilter/SidebarFilterPanel";
import { SidebarFilterHeader } from "../components/SidebarFilter/SidebarFilterHeader";
import { SidebarFilterContent } from "../components/SidebarFilter/SidebarFilterContent";
import { SidebarFilterFooter } from "../components/SidebarFilter/SidebarFilterFooter";
import { FilterSection } from "../components/SidebarFilter/FilterSection";
import { Button } from "../components/Button/Button";
import { Checkbox } from "../components/Checkbox/Checkbox";
import { Radio } from "../components/Radio/Radio";
import { Dropdown } from "../components/Dropdown/Dropdown";
import { DropdownTrigger } from "../components/Dropdown/DropdownTrigger";
import { DropdownMenu } from "../components/Dropdown/DropdownMenu";
import { DropdownItem } from "../components/Dropdown/DropdownItem";
import { Input } from "../components/Input/Input";
import { InputDatePicker } from "../components/Input/InputDatePicker";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHeadCell,
	TableCell,
} from "../components/Table/Table";
import { FunnelIcon, CaretDownIcon } from "@phosphor-icons/react";
import type { FilterValue } from "../components/SidebarFilter/SidebarFilter.type";

const meta = {
	title: "Components/SidebarFilter",
	component: SidebarFilter,
	tags: ["autodocs"],
	parameters: {
		docs: {
			description: {
				component:
					"Painel composto para reunir filtros de uma listagem. Use quando a pessoa precisa combinar critérios e aplicá-los em conjunto; evite para controles simples que podem ficar diretamente na página. O painel fecha ao aplicar, ao pressionar Escape ou pelo botão de fechar. O trigger deve ter nome acessível e o conteúdo do painel deve manter rótulos claros para cada controle.",
			},
		},
	},
	argTypes: {
		children: {
			control: false,
			table: { disable: true },
		},
		position: {
			control: "select",
			options: ["left", "right"],
			description: "Lado em que o painel entra na tela.",
		},
		defaultFilters: {
			control: false,
			table: { disable: true },
		},
		filters: {
			control: false,
			table: { disable: true },
			description: "Valores aplicados quando o componente é controlado pelo consumidor.",
		},
		onFiltersChange: {
			control: false,
			table: { disable: true },
			description: "Notifica mudanças nos valores quando `filters` é controlado.",
		},
		onApply: {
			control: false,
			description: "Recebe os filtros quando a pessoa confirma a seleção.",
			table: { category: "Eventos" },
		},
	},
	args: {
		children: null,
		position: "right",
		onApply: fn(),
	},
} satisfies Meta<typeof SidebarFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

// Story básica
const DefaultStory = (args: ComponentProps<typeof SidebarFilter>) => {
	const [appliedFilters, setAppliedFilters] = useState<FilterValue>({});
	const [select1, setSelect1] = useState<string>("");
	const [select2, setSelect2] = useState<string>("");
	const [select3, setSelect3] = useState<string>("");
	const [multiplaEscolha, setMultiplaEscolha] = useState<string[]>([]);
	const [status, setStatus] = useState<string>("");
	const [dataInicio, setDataInicio] = useState<string>("");
	const [dataFim, setDataFim] = useState<string>("");

	return (
		<div className="p-8">
			<SidebarFilter
				{...args}
				onApply={() => {
					const nextFilters: FilterValue = {
						select1,
						select2,
						select3,
						multiplaEscolha: [...multiplaEscolha],
						status,
						dataInicio,
						dataFim,
					};
					setAppliedFilters(nextFilters);
					args.onApply?.(nextFilters);
				}}
			>
				<SidebarFilterTrigger>
					<Button iconRight={FunnelIcon} variant="secondary">
						Filtros Avançados
					</Button>
				</SidebarFilterTrigger>

				<SidebarFilterPanel position={args.position}>
					<SidebarFilterHeader />

					<SidebarFilterContent>
						<FilterSection title="Select 1">
							<Dropdown>
								<DropdownTrigger>
									<Input
										label=""
										placeholder={select1 || "Buscar"}
										iconRight={<CaretDownIcon size={20} />}
										readOnly
									/>
								</DropdownTrigger>
								<DropdownMenu>
									<DropdownItem onSelect={() => setSelect1("Opção 1")}>Opção 1</DropdownItem>
									<DropdownItem onSelect={() => setSelect1("Opção 2")}>Opção 2</DropdownItem>
									<DropdownItem onSelect={() => setSelect1("Opção 3")}>Opção 3</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</FilterSection>

						<FilterSection title="Select 2">
							<Dropdown>
								<DropdownTrigger>
									<Input
										label=""
										placeholder={select2 || "Buscar"}
										iconRight={<CaretDownIcon size={20} />}
										readOnly
									/>
								</DropdownTrigger>
								<DropdownMenu>
									<DropdownItem onSelect={() => setSelect2("Opção 1")}>Opção 1</DropdownItem>
									<DropdownItem onSelect={() => setSelect2("Opção 2")}>Opção 2</DropdownItem>
									<DropdownItem onSelect={() => setSelect2("Opção 3")}>Opção 3</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</FilterSection>

						<FilterSection title="Select 3">
							<Dropdown>
								<DropdownTrigger>
									<Input
										label=""
										placeholder={select3 || "Buscar"}
										iconRight={<CaretDownIcon size={20} />}
										readOnly
									/>
								</DropdownTrigger>
								<DropdownMenu>
									<DropdownItem onSelect={() => setSelect3("Opção 1")}>Opção 1</DropdownItem>
									<DropdownItem onSelect={() => setSelect3("Opção 2")}>Opção 2</DropdownItem>
									<DropdownItem onSelect={() => setSelect3("Opção 3")}>Opção 3</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</FilterSection>

						<FilterSection title="Múltipla escolha" required>
							<Checkbox
								label="Opção 1"
								checked={multiplaEscolha.includes("opcao1")}
								onChange={(e) => {
									if (e.target.checked) {
										setMultiplaEscolha([...multiplaEscolha, "opcao1"]);
									} else {
										setMultiplaEscolha(multiplaEscolha.filter((c) => c !== "opcao1"));
									}
								}}
							/>
							<Checkbox
								label="Opção 2"
								checked={multiplaEscolha.includes("opcao2")}
								onChange={(e) => {
									if (e.target.checked) {
										setMultiplaEscolha([...multiplaEscolha, "opcao2"]);
									} else {
										setMultiplaEscolha(multiplaEscolha.filter((c) => c !== "opcao2"));
									}
								}}
							/>
							<Checkbox
								label="Opção 3"
								checked={multiplaEscolha.includes("opcao3")}
								onChange={(e) => {
									if (e.target.checked) {
										setMultiplaEscolha([...multiplaEscolha, "opcao3"]);
									} else {
										setMultiplaEscolha(multiplaEscolha.filter((c) => c !== "opcao3"));
									}
								}}
							/>
						</FilterSection>

						<FilterSection title="Status">
							<Radio
								name="status"
								label="Ativo"
								value="active"
								checked={status === "active"}
								onChange={(e) => setStatus(e.target.value)}
							/>
							<Radio
								name="status"
								label="Inativo"
								value="inactive"
								checked={status === "inactive"}
								onChange={(e) => setStatus(e.target.value)}
							/>
						</FilterSection>

						{/* Date Range */}
						<FilterSection title="Período" required>
							<div className="flex flex-col gap-2">
								<InputDatePicker
									label=""
									size="sm"
									placeholder="Selecione a data inicial"
									value={dataInicio}
									onChange={(e) => setDataInicio(e.target.value)}
								/>
								<InputDatePicker
									label=""
									size="sm"
									placeholder="Selecione a data final"
									value={dataFim}
									onChange={(e) => setDataFim(e.target.value)}
								/>
							</div>
						</FilterSection>
					</SidebarFilterContent>

					<SidebarFilterFooter
						onClear={() => {
							setSelect1("");
							setSelect2("");
							setSelect3("");
							setMultiplaEscolha([]);
							setStatus("");
							setDataInicio("");
							setDataFim("");
							setAppliedFilters({});
						}}
					/>
				</SidebarFilterPanel>
			</SidebarFilter>

			<div className="mt-4 p-4 bg-gray-100 rounded">
				<h3 className="font-bold mb-2">Filtros Aplicados:</h3>
				<pre className="text-sm">{JSON.stringify(appliedFilters, null, 2)}</pre>
			</div>
		</div>
	);
};

export const Default: Story = {
	render: DefaultStory,
};

// Story com posição à esquerda
const PositionStory = (args: ComponentProps<typeof SidebarFilter>) => {
	const [filtros, setFiltros] = useState<string[]>([]);

	return (
		<div className="p-8 flex gap-4">
			<SidebarFilter {...args}>
				<SidebarFilterTrigger>
					<Button iconLeft={FunnelIcon}>Filtrar (Esquerda)</Button>
				</SidebarFilterTrigger>

				<SidebarFilterPanel>
					<SidebarFilterHeader />

					<SidebarFilterContent>
						<FilterSection title="Select">
							<Checkbox
								label="Opção 1"
								checked={filtros.includes("opcao1")}
								onChange={(e) => {
									if (e.target.checked) {
										setFiltros([...filtros, "opcao1"]);
									} else {
										setFiltros(filtros.filter((f) => f !== "opcao1"));
									}
								}}
							/>
							<Checkbox
								label="Opção 2"
								checked={filtros.includes("opcao2")}
								onChange={(e) => {
									if (e.target.checked) {
										setFiltros([...filtros, "opcao2"]);
									} else {
										setFiltros(filtros.filter((f) => f !== "opcao2"));
									}
								}}
							/>
							<Checkbox
								label="Opção 3"
								checked={filtros.includes("opcao3")}
								onChange={(e) => {
									if (e.target.checked) {
										setFiltros([...filtros, "opcao3"]);
									} else {
										setFiltros(filtros.filter((f) => f !== "opcao3"));
									}
								}}
							/>
						</FilterSection>
					</SidebarFilterContent>

					<SidebarFilterFooter />
				</SidebarFilterPanel>
			</SidebarFilter>

			<SidebarFilter position="right" onApply={args.onApply}>
				<SidebarFilterTrigger>
					<Button iconLeft={FunnelIcon}>Filtrar (Direita)</Button>
				</SidebarFilterTrigger>

				<SidebarFilterPanel position="right">
					<SidebarFilterHeader />

					<SidebarFilterContent>
						<FilterSection title="Select">
							<Checkbox
								label="Opção 1"
								checked={filtros.includes("opcao1")}
								onChange={(e) => {
									if (e.target.checked) {
										setFiltros([...filtros, "opcao1"]);
									} else {
										setFiltros(filtros.filter((f) => f !== "opcao1"));
									}
								}}
							/>
							<Checkbox
								label="Opção 2"
								checked={filtros.includes("opcao2")}
								onChange={(e) => {
									if (e.target.checked) {
										setFiltros([...filtros, "opcao2"]);
									} else {
										setFiltros(filtros.filter((f) => f !== "opcao2"));
									}
								}}
							/>
							<Checkbox
								label="Opção 3"
								checked={filtros.includes("opcao3")}
								onChange={(e) => {
									if (e.target.checked) {
										setFiltros([...filtros, "opcao3"]);
									} else {
										setFiltros(filtros.filter((f) => f !== "opcao3"));
									}
								}}
							/>
						</FilterSection>
					</SidebarFilterContent>

					<SidebarFilterFooter />
				</SidebarFilterPanel>
			</SidebarFilter>
		</div>
	);
};

export const Position: Story = {
	args: {
		position: "left",
	},
	render: PositionStory,
};

// Story com integração em tabela
const WithTableStory = (args: ComponentProps<typeof SidebarFilter>) => {
	const [appliedFilters, setAppliedFilters] = useState<FilterValue>({});
	const [departamentos, setDepartamentos] = useState<string[]>([]);
	const [status, setStatus] = useState<string>("");
	const [nomeSelecionado, setNomeSelecionado] = useState<string>("");

	// Dados mockados para a tabela
	const allTableData = [
		{ id: 1, nome: "João Silva", departamento: "TI", status: "Ativo" },
		{ id: 2, nome: "Maria Santos", departamento: "RH", status: "Ativo" },
		{ id: 3, nome: "Pedro Costa", departamento: "Vendas", status: "Inativo" },
		{ id: 4, nome: "Ana Oliveira", departamento: "TI", status: "Inativo" },
		{ id: 5, nome: "Carlos Souza", departamento: "Vendas", status: "Ativo" },
	];

	// Filtra os dados baseado nos filtros aplicados
	const filteredData = allTableData.filter((row) => {
		const deptFilter = appliedFilters.departamentos as string[] | undefined;
		const statusFilter = appliedFilters.status as string | undefined;
		const nomeFilter = appliedFilters.nome as string | undefined;

		const matchDept =
			!deptFilter || deptFilter.length === 0 || deptFilter.includes(row.departamento);
		const matchStatus =
			!statusFilter ||
			(statusFilter === "active" && row.status === "Ativo") ||
			(statusFilter === "inactive" && row.status === "Inativo");
		const matchNome = !nomeFilter || row.nome === nomeFilter;

		return matchDept && matchStatus && matchNome;
	});

	return (
		<div className="w-full min-h-screen">
			<div className="p-8">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-2xl font-bold">Funcionários</h2>

					<SidebarFilter
						{...args}
						onApply={() => {
							const nextFilters: FilterValue = {
								departamentos: [...departamentos],
								status,
								nome: nomeSelecionado,
							};
							setAppliedFilters(nextFilters);
							args.onApply?.(nextFilters);
						}}
					>
						<SidebarFilterTrigger>
							<Button iconRight={FunnelIcon} variant="secondary">
								Filtros Avançados
							</Button>
						</SidebarFilterTrigger>

						<SidebarFilterPanel position={args.position}>
							<SidebarFilterHeader title="Filtros" />

							<SidebarFilterContent>
								<FilterSection title="Nome">
									<Dropdown>
										<DropdownTrigger>
											<Input
												label=""
												placeholder={nomeSelecionado || "Escolher..."}
												iconRight={<CaretDownIcon size={20} />}
												readOnly
											/>
										</DropdownTrigger>
										<DropdownMenu>
											<DropdownItem onSelect={() => setNomeSelecionado("")}>Todos</DropdownItem>
											<DropdownItem onSelect={() => setNomeSelecionado("João Silva")}>
												João Silva
											</DropdownItem>
											<DropdownItem onSelect={() => setNomeSelecionado("Maria Santos")}>
												Maria Santos
											</DropdownItem>
											<DropdownItem onSelect={() => setNomeSelecionado("Pedro Costa")}>
												Pedro Costa
											</DropdownItem>
											<DropdownItem onSelect={() => setNomeSelecionado("Ana Oliveira")}>
												Ana Oliveira
											</DropdownItem>
											<DropdownItem onSelect={() => setNomeSelecionado("Carlos Souza")}>
												Carlos Souza
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</FilterSection>

								<FilterSection title="Filtros">
									<Checkbox
										label="TI"
										checked={departamentos.includes("TI")}
										onChange={(e) => {
											if (e.target.checked) {
												setDepartamentos([...departamentos, "TI"]);
											} else {
												setDepartamentos(departamentos.filter((d) => d !== "TI"));
											}
										}}
									/>
									<Checkbox
										label="RH"
										checked={departamentos.includes("RH")}
										onChange={(e) => {
											if (e.target.checked) {
												setDepartamentos([...departamentos, "RH"]);
											} else {
												setDepartamentos(departamentos.filter((d) => d !== "RH"));
											}
										}}
									/>
									<Checkbox
										label="Vendas"
										checked={departamentos.includes("Vendas")}
										onChange={(e) => {
											if (e.target.checked) {
												setDepartamentos([...departamentos, "Vendas"]);
											} else {
												setDepartamentos(departamentos.filter((d) => d !== "Vendas"));
											}
										}}
									/>
								</FilterSection>

								<FilterSection title="Status">
									<Radio
										name="status"
										label="Ativo"
										value="active"
										checked={status === "active"}
										onChange={(e) => setStatus(e.target.value)}
									/>
									<Radio
										name="status"
										label="Inativo"
										value="inactive"
										checked={status === "inactive"}
										onChange={(e) => setStatus(e.target.value)}
									/>
								</FilterSection>
							</SidebarFilterContent>

							<SidebarFilterFooter
								onClear={() => {
									setDepartamentos([]);
									setStatus("");
									setNomeSelecionado("");
									setAppliedFilters({});
								}}
							/>
						</SidebarFilterPanel>
					</SidebarFilter>
				</div>
			</div>

			{/* Tabela mockada */}
			<div className="px-8">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHeadCell columnSize="lg">Nome</TableHeadCell>
							<TableHeadCell columnSize="md">Departamento</TableHeadCell>
							<TableHeadCell columnSize="sm">Status</TableHeadCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredData.length > 0 ? (
							filteredData.map((row) => (
								<TableRow key={row.id}>
									<TableCell columnSize="lg">{row.nome}</TableCell>
									<TableCell columnSize="md">{row.departamento}</TableCell>
									<TableCell columnSize="sm">{row.status}</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={3} align="center">
									<span className="text-gray-500">Nenhum resultado encontrado</span>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				<div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
					<p className="text-sm text-blue-800 font-medium">
						✓ Modal não bloqueia a navegação da tabela | Mostrando {filteredData.length} de{" "}
						{allTableData.length} resultados
					</p>
				</div>
			</div>
		</div>
	);
};

export const WithTable: Story = {
	parameters: {
		layout: "fullscreen",
	},
	render: WithTableStory,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const page = within(document.body);

		await userEvent.click(canvas.getByRole("button", { name: "Filtros Avançados" }));
		const dialog = page.getByRole("dialog");
		await userEvent.click(within(dialog).getByRole("checkbox", { name: "TI" }));
		await userEvent.click(within(dialog).getByRole("button", { name: "Limpar" }));
		await expect(canvas.getByText("Pedro Costa")).toBeInTheDocument();

		await userEvent.click(within(dialog).getByRole("checkbox", { name: "TI" }));
		await userEvent.click(within(dialog).getByRole("button", { name: "Aplicar" }));
		await expect(canvas.getByText("João Silva")).toBeInTheDocument();
		await expect(canvas.getByText("Ana Oliveira")).toBeInTheDocument();
		await expect(canvas.queryByText("Maria Santos")).not.toBeInTheDocument();
		await expect(args.onApply).toHaveBeenCalledWith({
			departamentos: ["TI"],
			status: "",
			nome: "",
		});

		await userEvent.click(canvas.getByRole("button", { name: "Filtros Avançados" }));
		await userEvent.click(within(page.getByRole("dialog")).getByRole("checkbox", { name: "TI" }));
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
	},
};
