import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FunnelIcon } from "@phosphor-icons/react";
import { Button } from "../../components/Button/Button";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import { FilterSection } from "../../components/SidebarFilter/FilterSection";
import { SidebarFilter } from "../../components/SidebarFilter/SidebarFilter";
import { SidebarFilterContent } from "../../components/SidebarFilter/SidebarFilterContent";
import { SidebarFilterFooter } from "../../components/SidebarFilter/SidebarFilterFooter";
import { SidebarFilterHeader } from "../../components/SidebarFilter/SidebarFilterHeader";
import { SidebarFilterPanel } from "../../components/SidebarFilter/SidebarFilterPanel";
import { SidebarFilterTrigger } from "../../components/SidebarFilter/SidebarFilterTrigger";
import { Input } from "../../components/Input/Input";
import { Pagination } from "../../components/Pagination/Pagination";
import { Radio } from "../../components/Radio/Radio";
import {
	Table,
	TableBody,
	TableCell,
	TableHeadCell,
	TableHeader,
	TableRow,
} from "../../components/Table/Table";

type PersonStatus = "active" | "inactive";
type StatusFilter = "all" | PersonStatus;

type Person = {
	id: number;
	name: string;
	department: string;
	email: string;
	status: PersonStatus;
};

type AppliedFilters = {
	departments: string[];
	status: StatusFilter;
};

type DirectoryPageProps = {
	initialSearch?: string;
};

const PEOPLE: Person[] = [
	{
		id: 1,
		name: "Ana Souza",
		department: "Engenharia",
		email: "ana.souza@example.com",
		status: "active",
	},
	{
		id: 2,
		name: "Bruno Lima",
		department: "Design",
		email: "bruno.lima@example.com",
		status: "active",
	},
	{
		id: 3,
		name: "Carla Mendes",
		department: "Produto",
		email: "carla.mendes@example.com",
		status: "inactive",
	},
	{
		id: 4,
		name: "Diego Ramos",
		department: "Engenharia",
		email: "diego.ramos@example.com",
		status: "inactive",
	},
	{
		id: 5,
		name: "Elisa Rocha",
		department: "Operações",
		email: "elisa.rocha@example.com",
		status: "active",
	},
	{
		id: 6,
		name: "Felipe Nunes",
		department: "Design",
		email: "felipe.nunes@example.com",
		status: "inactive",
	},
	{
		id: 7,
		name: "Gabriela Alves",
		department: "Produto",
		email: "gabriela.alves@example.com",
		status: "active",
	},
	{
		id: 8,
		name: "Hugo Martins",
		department: "Engenharia",
		email: "hugo.martins@example.com",
		status: "active",
	},
];

const DEPARTMENTS = ["Design", "Engenharia", "Operações", "Produto"];
const PAGE_SIZE = 4;

function DirectoryPage({ initialSearch = "" }: DirectoryPageProps) {
	const [search, setSearch] = useState(initialSearch);
	const [draftDepartments, setDraftDepartments] = useState<string[]>([]);
	const [draftStatus, setDraftStatus] = useState<StatusFilter>("all");
	const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
		departments: [],
		status: "all",
	});
	const [currentPage, setCurrentPage] = useState(1);

	const matchingPeople = PEOPLE.filter((person) => {
		const matchesSearch = person.name.toLowerCase().includes(search.trim().toLowerCase());
		const matchesDepartment =
			appliedFilters.departments.length === 0 ||
			appliedFilters.departments.includes(person.department);
		const matchesStatus =
			appliedFilters.status === "all" || appliedFilters.status === person.status;

		return matchesSearch && matchesDepartment && matchesStatus;
	});

	const visiblePeople = matchingPeople.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	const handleApplyFilters = () => {
		setAppliedFilters({ departments: [...draftDepartments], status: draftStatus });
		setCurrentPage(1);
	};

	const handleClearFilters = () => {
		setDraftDepartments([]);
		setDraftStatus("all");
		setAppliedFilters({ departments: [], status: "all" });
		setCurrentPage(1);
	};

	const handleDepartmentChange = (department: string, checked: boolean) => {
		setDraftDepartments((current) =>
			checked
				? [...current, department]
				: current.filter((selectedDepartment) => selectedDepartment !== department),
		);
	};

	const resultLabel =
		matchingPeople.length === 1
			? "1 pessoa encontrada"
			: matchingPeople.length === 0
				? "Nenhuma pessoa encontrada"
				: `${matchingPeople.length} pessoas encontradas`;

	return (
		<main className="min-h-screen w-full bg-[var(--ds-bg-secondary)] px-4 py-6 sm:px-8 sm:py-10">
			<div className="mx-auto flex w-full max-w-container flex-col gap-6">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-body-4 text-[var(--ds-color-neutral-40)]">Equipe</p>
						<h1 className="text-headline-3 text-[var(--ds-color-neutral-10)]">
							Diretório de pessoas
						</h1>
						<p className="mt-1 text-body-3 text-[var(--ds-color-neutral-40)]">
							Consulte pessoas por nome, departamento e status.
						</p>
					</div>

					<SidebarFilter position="right" onApply={handleApplyFilters}>
						<SidebarFilterTrigger>
							<Button iconLeft={FunnelIcon} variant="secondary">
								Filtros
							</Button>
						</SidebarFilterTrigger>
						<SidebarFilterPanel position="right">
							<SidebarFilterHeader title="Filtrar pessoas" />
							<SidebarFilterContent>
								<fieldset className="m-0 min-w-0 border-0 p-0">
									<legend className="sr-only">Departamento</legend>
									<FilterSection title="Departamento">
										{DEPARTMENTS.map((department) => (
											<Checkbox
												key={department}
												label={department}
												checked={draftDepartments.includes(department)}
												onChange={(event) =>
													handleDepartmentChange(department, event.target.checked)
												}
											/>
										))}
									</FilterSection>
								</fieldset>

								<fieldset className="m-0 min-w-0 border-0 p-0">
									<legend className="sr-only">Status</legend>
									<FilterSection title="Status">
										<Radio
											name="directory-status"
											label="Todos"
											value="all"
											checked={draftStatus === "all"}
											onChange={() => setDraftStatus("all")}
										/>
										<Radio
											name="directory-status"
											label="Ativo"
											value="active"
											checked={draftStatus === "active"}
											onChange={() => setDraftStatus("active")}
										/>
										<Radio
											name="directory-status"
											label="Inativo"
											value="inactive"
											checked={draftStatus === "inactive"}
											onChange={() => setDraftStatus("inactive")}
										/>
									</FilterSection>
								</fieldset>
							</SidebarFilterContent>
							<SidebarFilterFooter onClear={handleClearFilters} />
						</SidebarFilterPanel>
					</SidebarFilter>
				</header>

				<section
					aria-label="Lista de pessoas"
					className="flex flex-col gap-4 rounded-2xl border border-[var(--ds-color-neutral-90)] bg-[var(--ds-color-neutral-white)] p-4 sm:p-6"
				>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
						<div className="w-full sm:max-w-md">
							<Input
								label="Buscar pessoas"
								placeholder="Digite um nome"
								type="search"
								value={search}
								onChange={(event) => {
									setSearch(event.target.value);
									setCurrentPage(1);
								}}
							/>
						</div>
						<p
							role="status"
							aria-live="polite"
							className="text-body-4 text-[var(--ds-color-neutral-40)]"
						>
							{resultLabel}
						</p>
					</div>

					<Table aria-label="Pessoas cadastradas">
						<TableHeader>
							<TableRow>
								<TableHeadCell scope="col" columnSize="md">
									Nome
								</TableHeadCell>
								<TableHeadCell scope="col" columnSize="md">
									Departamento
								</TableHeadCell>
								<TableHeadCell scope="col" columnSize="lg">
									E-mail
								</TableHeadCell>
								<TableHeadCell scope="col" columnSize="sm">
									Status
								</TableHeadCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							{visiblePeople.length > 0 ? (
								visiblePeople.map((person) => (
									<TableRow key={person.id}>
										<TableCell columnSize="md">{person.name}</TableCell>
										<TableCell columnSize="md">{person.department}</TableCell>
										<TableCell columnSize="lg">
											<a
												href={`mailto:${person.email}`}
												className="text-[var(--ds-color-blue-20)] underline"
											>
												{person.email}
											</a>
										</TableCell>
										<TableCell columnSize="sm">
											<span className="inline-flex rounded-full bg-[var(--ds-color-neutral-95)] px-2 py-1 text-body-4 font-medium text-[var(--ds-color-neutral-20)]">
												{person.status === "active" ? "Ativo" : "Inativo"}
											</span>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={4} align="center">
										<p className="py-6 text-body-3 text-[var(--ds-color-neutral-40)]">
											Nenhuma pessoa corresponde à busca e aos filtros selecionados.
										</p>
										<Button
											variant="secondary"
											onClick={() => {
												setSearch("");
												setCurrentPage(1);
											}}
										>
											Limpar busca
										</Button>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>

					{matchingPeople.length > PAGE_SIZE && (
						<Pagination
							currentPage={currentPage}
							onPageChange={setCurrentPage}
							total={matchingPeople.length}
							perPage={PAGE_SIZE}
							label="pessoas"
							positionLabel="right"
							showPageInput={false}
						/>
					)}
				</section>
			</div>
		</main>
	);
}

const meta = {
	title: "Pages/Directory",
	component: DirectoryPage,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
		a11y: { test: "error" },
		docs: {
			description: {
				component:
					"Página demonstrativa de diretório. Combina busca local, filtros aplicados sob demanda, tabela responsiva e paginação sem backend.",
			},
		},
	},
	argTypes: {
		initialSearch: {
			control: false,
			table: { disable: true },
			description: "Texto inicial da busca. Útil para apresentar o estado sem resultados.",
		},
	},
} satisfies Meta<typeof DirectoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithData: Story = {
	args: { initialSearch: "" },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const search = canvas.getByRole("searchbox", { name: "Buscar pessoas" });
		await userEvent.type(search, "Ana");
		await expect(canvas.getByText("Ana Souza")).toBeInTheDocument();
		await expect(canvas.queryByText("Bruno Lima")).not.toBeInTheDocument();

		await userEvent.clear(search);
		await userEvent.click(canvas.getByRole("button", { name: "Próxima página" }));
		await expect(canvas.getByText("Elisa Rocha")).toBeInTheDocument();

		await userEvent.click(canvas.getByRole("button", { name: "Página anterior" }));
		await userEvent.click(canvas.getByRole("button", { name: "Filtros" }));
		const dialog = within(document.body).getByRole("dialog");
		await userEvent.click(within(dialog).getByRole("checkbox", { name: "Engenharia" }));
		await userEvent.click(within(dialog).getByRole("radio", { name: "Ativo" }));
		await userEvent.click(within(dialog).getByRole("button", { name: "Aplicar" }));

		await expect(canvas.getByText("Ana Souza")).toBeInTheDocument();
		await expect(canvas.getByText("Hugo Martins")).toBeInTheDocument();
		await expect(canvas.queryByText("Diego Ramos")).not.toBeInTheDocument();
		await expect(canvas.getByRole("status")).toHaveTextContent("2 pessoas encontradas");

		await userEvent.click(canvas.getByRole("button", { name: "Filtros" }));
		const reopenedDialog = within(document.body).getByRole("dialog");
		await userEvent.click(within(reopenedDialog).getByRole("button", { name: "Limpar" }));
		await expect(canvas.getByRole("status")).toHaveTextContent("8 pessoas encontradas");
		await expect(canvas.getByText("Diego Ramos")).toBeInTheDocument();
	},
};

export const EmptyResults: Story = {
	args: { initialSearch: "pessoa inexistente" },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByRole("status")).toHaveTextContent("Nenhuma pessoa encontrada");
		await expect(
			canvas.getByText("Nenhuma pessoa corresponde à busca e aos filtros selecionados."),
		).toBeInTheDocument();
		await userEvent.click(canvas.getByRole("button", { name: "Limpar busca" }));
		await expect(canvas.getByText("Ana Souza")).toBeInTheDocument();
	},
};
