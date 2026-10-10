import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/Button/Button";
import { Input } from "../components/Input/Input";
import { DateDropdownPicker } from "../components/DateDropdownPicker/DateDropdownPicker";
import { Tag } from "../components/Tag/Tag";
import { Dropdown } from "../components/Dropdown/Dropdown";
import { DropdownTrigger } from "../components/Dropdown/DropdownTrigger";
import { DropdownMenu } from "../components/Dropdown/DropdownMenu";
import { DropdownItem } from "../components/Dropdown/DropdownItem";
import {
	MagnifyingGlassIcon,
	FunnelIcon,
	CheckCircleIcon,
	XCircleIcon,
	WarningCircleIcon,
	ClockIcon,
	CaretDownIcon,
	CaretRightIcon,
	CircleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import "./Filters.stories.inline.css";

const meta = {
	title: "Examples/Filters",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Exemplos de como combinar componentes existentes (Input, Button, Tag, Dropdown, InputDatePicker) para criar interfaces de busca e filtros.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SearchBasic: Story = {
	render: () => (
		<div className="flex items-center gap-4 w-full flex-wrap">
			<Input
				label=""
				size="md"
				iconLeft={<MagnifyingGlassIcon size={16} />}
				name="search"
				type="search"
				placeholder="Buscar por e-mail"
			/>
			<Button size="md" variant="secondary">
				Buscar
			</Button>
		</div>
	),
};

const SearchWithFilterButtonComponent = () => {
	const [filterCount] = useState(3);

	return (
		<div className="flex items-center gap-4 w-full flex-wrap">
			<div className="flex-1 min-w-[280px]">
				<Input
					label=""
					iconLeft={<MagnifyingGlassIcon size={16} />}
					placeholder="Buscar por e-mail"
				/>
			</div>
			<Button size="md" variant="secondary">
				Buscar
			</Button>
			<div className="relative">
				<Button size="md" variant="outline" iconLeft={FunnelIcon}>
					Filtros
				</Button>
				{filterCount > 0 && (
					<div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[var(--ds-color-neutral-90)] border border-[var(--ds-color-neutral-50)] rounded-full flex items-center justify-center">
						<span className="text-[var(--ds-font-size-10)] font-poppins font-normal text-[var(--ds-color-neutral-10)]">
							{filterCount > 99 ? "99+" : filterCount}
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export const SearchWithFilterButton: Story = {
	render: () => <SearchWithFilterButtonComponent />,
};

const FiltersCompleteComponent = () => {
	const [statusFilter, setStatusFilter] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [dateFilter, setDateFilter] = useState("");
	const [stockFilter, setStockFilter] = useState<string[]>([]);
	const [filtersOpen, setFiltersOpen] = useState(true);

	const filterCount =
		(statusFilter ? 1 : 0) + (categoryFilter ? 1 : 0) + (dateFilter ? 1 : 0) + stockFilter.length;

	const statusOptions = [
		{ label: "Sucesso", value: "success", icon: CircleIcon, variant: "success" as const },
		{ label: "Erro", value: "error", icon: CircleIcon, variant: "danger" as const },
		{ label: "Atenção", value: "warning", icon: CircleIcon, variant: "warning" as const },
		{ label: "Pendente", value: "pending", icon: CircleIcon, variant: "info" as const },
	];

	const categoryOptions = [
		{ label: "Alimentos", value: "alimentos" },
		{ label: "Higiene", value: "higiene" },
		{ label: "Limpeza", value: "limpeza" },
	];

	const stockOptions = [
		{ label: "Em Estoque", value: "inStock" },
		{ label: "Fora de Estoque", value: "outOfStock" },
	];

	return (
		<div className="w-full space-y-4">
			<div className="flex items-center gap-4 w-full flex-wrap">
				<div className="flex-1 min-w-[280px]">
					<Input
						size="lg"
						label=""
						iconLeft={<MagnifyingGlassIcon size={16} />}
						placeholder="Buscar por nome, categoria ou ID..."
					/>
				</div>
				<Button size="lg" variant="secondary">
					Buscar
				</Button>
				<div className="relative">
					<Button
						size="lg"
						variant="outline"
						iconLeft={FunnelIcon}
						onClick={() => setFiltersOpen(!filtersOpen)}
					>
						Filtros
					</Button>
					{filterCount > 0 && (
						<div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[var(--ds-color-neutral-90)] border border-[var(--ds-color-neutral-50)] rounded-full flex items-center justify-center">
							<span className="text-[var(--ds-font-size-10)] font-poppins font-normal text-[var(--ds-color-neutral-10)]">
								{filterCount > 99 ? "99+" : filterCount}
							</span>
						</div>
					)}
				</div>
			</div>

			{filtersOpen && (
				<div className="w-full p-6 bg-[var(--ds-color-surface)] rounded-lg border-2 border-[var(--ds-color-neutral-50)] shadow-[0px_4px_5px_rgba(0,0,0,0.12)]">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="flex flex-col gap-2">
							<label className="text-label-1 text-[var(--ds-color-neutral-10)] font-ui uppercase tracking-[1.4px]">
								Status
							</label>
							<Dropdown>
								<DropdownTrigger
									applyOpenCloseColors
									iconOpen={CaretDownIcon}
									iconClosed={CaretRightIcon}
								>
									<Button
										variant="primary"
										gapBetweenTextAndIcon
										size="lg"
										className="w-full text-left"
									>
										{statusFilter
											? statusOptions.find((o) => o.value === statusFilter)?.label
											: "Selecione um status"}
									</Button>
								</DropdownTrigger>
								<DropdownMenu>
									{statusOptions.map((option) => (
										<DropdownItem key={option.value} onSelect={() => setStatusFilter(option.value)}>
											<Tag
												hoverBorderOnly
												variant={option.variant}
												iconLeft={option.icon}
												iconWeight="fill"
												state={statusFilter === option.value ? "selected" : "default"}
											>
												{option.label}
											</Tag>
										</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-label-1 text-[var(--ds-color-neutral-10)] font-ui uppercase tracking-[1.4px]">
								Categoria
							</label>
							<Dropdown>
								<DropdownTrigger
									applyOpenCloseColors
									iconOpen={CaretDownIcon}
									iconClosed={CaretRightIcon}
								>
									<Button
										variant="primary"
										size="lg"
										gapBetweenTextAndIcon
										className="w-full text-left"
									>
										{categoryFilter
											? categoryOptions.find((o) => o.value === categoryFilter)?.label
											: "Selecione uma categoria"}
									</Button>
								</DropdownTrigger>
								<DropdownMenu>
									<DropdownItem onSelect={() => setCategoryFilter("")}>
										Todas as categorias
									</DropdownItem>
									{categoryOptions.map((option) => (
										<DropdownItem
											key={option.value}
											onSelect={() => setCategoryFilter(option.value)}
										>
											{option.label}
										</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-label-1 text-[var(--ds-color-neutral-10)] font-ui uppercase tracking-[1.4px]">
								Data
							</label>
							<DateDropdownPicker
								variant="primary"
								size="lg"
								value={dateFilter}
								onChange={setDateFilter}
								placeholder="Selecione uma data"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-label-1 text-[var(--ds-color-neutral-10)] font-ui uppercase tracking-[1.4px]">
								Disponibilidade
							</label>
							<div className="flex flex-col gap-2">
								{stockOptions.map((option) => (
									<label
										key={option.value}
										className="flex items-center gap-3 cursor-pointer hover:bg-[var(--ds-color-neutral-90)] px-5 rounded-md transition-colors"
									>
										<input
											type="checkbox"
											checked={stockFilter.includes(option.value)}
											onChange={(e) => {
												const newValues = e.target.checked
													? [...stockFilter, option.value]
													: stockFilter.filter((v) => v !== option.value);
												setStockFilter(newValues);
											}}
											className="w-5 h-5 rounded border-[var(--ds-color-neutral-50)] text-[var(--ds-color-blue-40)] focus:ring-[var(--ds-color-blue-40)]"
										/>
										<span className="text-body-3 text-[var(--ds-color-neutral-10)] font-poppins">
											{option.label}
										</span>
									</label>
								))}
							</div>
						</div>
					</div>

					{/* Botões de ação */}
					<div className="flex justify-end gap-2 pt-6 mt-6 border-t border-[var(--ds-color-neutral-80)]">
						<Button
							variant="outline"
							size="md"
							onClick={() => {
								setStatusFilter("");
								setCategoryFilter("");
								setDateFilter("");
								setStockFilter([]);
							}}
						>
							Limpar Filtros
						</Button>
						<Button variant="primary" size="md">
							Aplicar Filtros
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export const FiltersComplete: Story = {
	render: () => <FiltersCompleteComponent />,
};

/**
 * Exemplo Prático: Lista com filtros
 */
const ShoppingListExampleComponent = () => {
	const allItems = [
		{
			id: 1,
			name: "Matemática",
			category: "exatas",
			status: "success",
			date: "2025-12-01",
			active: true,
		},
		{
			id: 2,
			name: "Português",
			category: "linguagens",
			status: "success",
			date: "2025-12-02",
			active: true,
		},
		{
			id: 3,
			name: "História",
			category: "humanas",
			status: "warning",
			date: "2025-12-03",
			active: false,
		},
		{
			id: 4,
			name: "Física",
			category: "exatas",
			status: "success",
			date: "2025-12-01",
			active: true,
		},
		{
			id: 5,
			name: "Química",
			category: "exatas",
			status: "error",
			date: "2025-12-05",
			active: false,
		},
		{
			id: 6,
			name: "Geografia",
			category: "humanas",
			status: "success",
			date: "2025-12-06",
			active: true,
		},
		{
			id: 7,
			name: "Biologia",
			category: "natureza",
			status: "success",
			date: "2025-12-02",
			active: true,
		},
		{
			id: 8,
			name: "Inglês",
			category: "linguagens",
			status: "pending",
			date: "2025-12-07",
			active: true,
		},
		{
			id: 9,
			name: "Filosofia",
			category: "humanas",
			status: "warning",
			date: "2025-12-08",
			active: false,
		},
		{
			id: 10,
			name: "Educação Física",
			category: "natureza",
			status: "success",
			date: "2025-12-01",
			active: true,
		},
	];

	const [searchValue, setSearchValue] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [statusFilter, setStatusFilter] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [dateFilter, setDateFilter] = useState("");
	const [stockFilter, setStockFilter] = useState<string[]>([]);
	const [filteredItems, setFilteredItems] = useState(allItems);

	const filterCount =
		(statusFilter ? 1 : 0) + (categoryFilter ? 1 : 0) + (dateFilter ? 1 : 0) + stockFilter.length;

	const normalizeString = (str: string) => {
		return str
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase();
	};

	const filterBySearch = (items: typeof allItems, query: string) => {
		const normalizedQuery = normalizeString(query);
		if (!normalizedQuery) return items;

		return items.filter(
			(item) =>
				normalizeString(item.name).includes(normalizedQuery) ||
				normalizeString(item.category).includes(normalizedQuery) ||
				item.id.toString().includes(normalizedQuery),
		);
	};

	const filterByStatus = (items: typeof allItems, status: string) =>
		status ? items.filter((item) => item.status === status) : items;

	const filterByCategory = (items: typeof allItems, category: string) =>
		category ? items.filter((item) => item.category === category) : items;

	const filterByDate = (items: typeof allItems, date: string) =>
		date ? items.filter((item) => item.date === date) : items;

	const filterByStock = (items: typeof allItems, stock: string[]) => {
		if (stock.length === 0) return items;

		const wantsActive = stock.includes("active");
		const wantsInactive = stock.includes("inactive");

		return items.filter((item) => {
			if (wantsActive && item.active) return true;
			if (wantsInactive && !item.active) return true;
			return false;
		});
	};

	const applyFilters = () => {
		let filtered = filterBySearch(allItems, searchValue);
		filtered = filterByStatus(filtered, statusFilter);
		filtered = filterByCategory(filtered, categoryFilter);
		filtered = filterByDate(filtered, dateFilter);
		filtered = filterByStock(filtered, stockFilter);

		setFilteredItems(filtered);
	};

	const clearFilters = () => {
		setSearchValue("");
		setStatusFilter("");
		setCategoryFilter("");
		setDateFilter("");
		setStockFilter([]);
		setFilteredItems(allItems);
	};

	const statusOptions = [
		{
			label: "Aprovado",
			value: "success",
			icon: CheckCircleIcon,
			variant: "success" as const,
		},
		{
			label: "Reprovado",
			value: "error",
			icon: XCircleIcon,
			variant: "danger" as const,
		},
		{
			label: "Recuperação",
			value: "warning",
			icon: WarningCircleIcon,
			variant: "warning" as const,
		},
		{
			label: "Em Andamento",
			value: "pending",
			icon: ClockIcon,
			variant: "info" as const,
		},
	];

	const categoryOptions = [
		{ label: "Exatas", value: "exatas" },
		{ label: "Humanas", value: "humanas" },
		{ label: "Linguagens", value: "linguagens" },
		{ label: "Natureza", value: "natureza" },
	];

	const stockOptions = [
		{ label: "Ativa", value: "active" },
		{ label: "Inativa", value: "inactive" },
	];

	return (
		<div className="w-full max-w-6xl mx-auto p-4">
			<h1 className="text-headline-4 mb-6 text-[var(--ds-color-neutral-10)]">
				Gerenciamento de Disciplinas
			</h1>

			<div className="flex items-center gap-4 w-full flex-wrap mb-4">
				<div className="flex-1 min-w-[280px]">
					<Input
						size="lg"
						label=""
						iconLeft={<MagnifyingGlassIcon size={16} />}
						placeholder="Buscar por nome, categoria ou ID..."
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</div>
				<Button size="md" variant="secondary" onClick={applyFilters}>
					Buscar
				</Button>
				<div className="relative">
					<Button
						size="md"
						variant="outline"
						iconLeft={FunnelIcon}
						onClick={() => setFiltersOpen(!filtersOpen)}
					>
						Filtros
					</Button>
					{filterCount > 0 && (
						<div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[var(--ds-color-neutral-90)] border border-[var(--ds-color-neutral-50)] rounded-full flex items-center justify-center">
							<span className="text-[var(--ds-font-size-10)] font-poppins font-normal text-[var(--ds-color-neutral-10)]">
								{filterCount > 99 ? "99+" : filterCount}
							</span>
						</div>
					)}
				</div>
			</div>

			{filtersOpen && (
				<div className="w-full p-6 bg-[var(--ds-color-surface)] rounded-lg border-2 border-[var(--ds-color-neutral-50)] shadow-[0px_4px_5px_rgba(0,0,0,0.12)] mb-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="flex flex-col gap-2">
							<label className="text-label-1 text-[var(--ds-color-neutral-10)] font-ui uppercase tracking-[1.4px]">
								Status
							</label>
							<Dropdown>
								<DropdownTrigger
									applyOpenCloseColors
									iconOpen={CaretDownIcon}
									iconClosed={CaretRightIcon}
								>
									<Button
										variant="outline"
										size="lg"
										gapBetweenTextAndIcon
										className="w-full text-left"
									>
										{statusFilter
											? statusOptions.find((o) => o.value === statusFilter)?.label
											: "Selecione um status"}
									</Button>
								</DropdownTrigger>
								<DropdownMenu>
									{statusOptions.map((option) => (
										<DropdownItem key={option.value} onSelect={() => setStatusFilter(option.value)}>
											<Tag
												variant={option.variant}
												iconLeft={option.icon}
												state={statusFilter === option.value ? "selected" : "default"}
											>
												{option.label}
											</Tag>
										</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-label-1 text-[var(--ds-color-neutral-10)] font-ui uppercase tracking-[1.4px]">
								Categoria
							</label>
							<Dropdown>
								<DropdownTrigger
									applyOpenCloseColors
									iconOpen={CaretDownIcon}
									iconClosed={CaretRightIcon}
								>
									<Button
										variant="outline"
										size="lg"
										iconRight={CaretDownIcon}
										className="w-full justify-between text-left"
									>
										{categoryFilter
											? categoryOptions.find((o) => o.value === categoryFilter)?.label
											: "Todas as categorias"}
									</Button>
								</DropdownTrigger>
								<DropdownMenu>
									<DropdownItem onSelect={() => setCategoryFilter("")}>
										Todas as categorias
									</DropdownItem>
									{categoryOptions.map((option) => (
										<DropdownItem
											key={option.value}
											onSelect={() => setCategoryFilter(option.value)}
										>
											{option.label}
										</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-label-1 text-[var(--ds-color-neutral-10)] font-ui uppercase tracking-[1.4px]">
								Data
							</label>
							<DateDropdownPicker
								variant="primary"
								size="lg"
								value={dateFilter}
								onChange={setDateFilter}
								placeholder="Selecione uma data"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-label-1 text-[var(--ds-color-neutral-10)] font-ui uppercase tracking-[1.4px]">
								Situação
							</label>
							<div className="flex flex-col gap-2">
								{stockOptions.map((option) => (
									<label
										key={option.value}
										className="flex items-center gap-3 cursor-pointer hover:bg-[var(--ds-color-neutral-90)] p-2 rounded-md transition-colors"
									>
										<input
											type="checkbox"
											checked={stockFilter.includes(option.value)}
											onChange={(e) => {
												const newValues = e.target.checked
													? [...stockFilter, option.value]
													: stockFilter.filter((v) => v !== option.value);
												setStockFilter(newValues);
											}}
											className="w-5 h-5 rounded border-[var(--ds-color-neutral-50)] text-[var(--ds-color-blue-40)] focus:ring-[var(--ds-color-blue-40)]"
										/>
										<span className="text-body-3 text-[var(--ds-color-neutral-10)] font-poppins">
											{option.label}
										</span>
									</label>
								))}
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-2 pt-6 mt-6 border-t border-[var(--ds-color-neutral-80)]">
						<Button variant="outline" size="md" onClick={clearFilters}>
							Limpar Filtros
						</Button>
						<Button variant="primary" size="md" onClick={applyFilters}>
							Aplicar Filtros
						</Button>
					</div>
				</div>
			)}

			<div className="mt-8">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-headline-6 text-[var(--ds-color-neutral-10)]">
						Resultados ({filteredItems.length} itens)
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredItems.length === 0 ? (
						<div className="col-span-full text-center py-12 text-body-2 text-[var(--ds-color-neutral-40)]">
							Nenhum item encontrado com os filtros aplicados
						</div>
					) : (
						filteredItems.map((item) => (
							<div
								key={item.id}
								className="p-4 border border-[var(--ds-color-neutral-80)] rounded-lg hover:shadow-md transition-shadow"
							>
								<div className="flex justify-between items-start mb-2">
									<h3 className="text-body-2 font-semibold text-[var(--ds-color-neutral-10)]">
										{item.name}
									</h3>
									<span
										className="w-3 h-3 rounded-full filters-stories-status"
										data-status={item.status}
										title={statusOptions.find((s) => s.value === item.status)?.label}
									/>
								</div>
								<p className="text-body-4 text-[var(--ds-color-neutral-40)] mb-2 capitalize">
									{item.category}
								</p>
								<div className="flex justify-between items-center">
									<span
										className={`text-caption-2 px-2 py-1 rounded ${
											item.active
												? "bg-[var(--ds-color-green-90)] text-[var(--ds-color-green-20)]"
												: "bg-[var(--ds-color-red-90)] text-[var(--ds-color-red-20)]"
										}`}
									>
										{item.active ? "Ativa" : "Inativa"}
									</span>
								</div>
								<p className="text-caption-2 text-[var(--ds-color-neutral-50)] mt-2">
									Data: {new Date(item.date).toLocaleDateString("pt-BR")}
								</p>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export const ShoppingListExample: Story = {
	render: () => <ShoppingListExampleComponent />,
};
