import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHeadCell,
	TableCell,
} from "../components/Table/Table";
import { Pagination } from "../components/Pagination/Pagination";
import { CaretDownIcon, CircleIcon, PlusIcon } from "@phosphor-icons/react";
import { Tag } from "../components/Tag/Tag";
import { Checkbox } from "../components/Checkbox/Checkbox";
import { Dropdown } from "../components/Dropdown/Dropdown";
import { DropdownTrigger } from "../components/Dropdown/DropdownTrigger";
import { DropdownMenu } from "../components/Dropdown/DropdownMenu";
import { DropdownItem } from "../components/Dropdown/DropdownItem";
import type { SortDirection } from "../components/Table/Table.type";

const meta: Meta<typeof Table> = {
	title: "Components/Table",
	component: Table,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Componente de tabela completo seguindo o design do Figma, com suporte a ordenação, tamanhos de coluna personalizáveis e linhas clicáveis.",
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof Table>;

const componentData = [
	{ type: "Type/Text", id: "001" },
	{ type: "Type/Number", id: "002" },
	{ type: "Type/Badge+text", id: "003" },
	{ type: "Type/Action", id: "004" },
	{ type: "Type/Checkbox", id: "005" },
	{ type: "Type/Tag", id: "006" },
	{ type: "Type/Tag+Status", id: "007" },
	{ type: "Type/Null", id: "008" },
	{ type: "Type/Text+dublo", id: "009" },
];

const ExemploComponent = (args: any) => {
	const [sortColumn, setSortColumn] = React.useState<string | null>(null);
	const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
	const [sortedData, setSortedData] = React.useState(componentData);

	// Checkbox simples da tabela
	const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

	// Checkbox do dropdown (Type/Action)
	const [actionChecked, setActionChecked] = React.useState<Record<string, boolean>>({});

	const handleCheckboxChange = (id: string) => {
		setCheckedItems((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const toggleActionItem = (key: string) => {
		setActionChecked((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const handleSort = (column: string) => {
		let newDirection: SortDirection = "asc";

		if (sortColumn === column) {
			if (sortDirection === "asc") newDirection = "desc";
			else if (sortDirection === "desc") newDirection = null;
		}

		setSortColumn(newDirection ? column : null);
		setSortDirection(newDirection);

		if (!newDirection) {
			setSortedData(componentData);
			return;
		}

		const sorted = [...componentData].sort((a, b) => {
			const aValue = column === "id" ? a.id : a.type;
			const bValue = column === "id" ? b.id : b.type;

			if (aValue < bValue) return newDirection === "asc" ? -1 : 1;
			if (aValue > bValue) return newDirection === "asc" ? 1 : -1;
			return 0;
		});

		setSortedData(sorted);
	};

	return (
		<div className="w-full">
			<Table {...args}>
				<TableHeader>
					<TableRow>
						<TableHeadCell
							columnSize="xs"
							iconLeft={PlusIcon}
							sortable
							sortDirection={sortColumn === "id" ? sortDirection : null}
							onSort={() => handleSort("id")}
						>
							ID (xs)
						</TableHeadCell>

						<TableHeadCell columnSize="sm" align="center">
							(sm)
						</TableHeadCell>

						<TableHeadCell
							columnSize="md"
							sortable
							sortDirection={sortColumn === "type" ? sortDirection : null}
							onSort={() => handleSort("type")}
						>
							Type (md)
						</TableHeadCell>

						<TableHeadCell columnSize="lg" align="center">
							Exemplo (lg)
						</TableHeadCell>

						<TableHeadCell columnSize="xl" align="center">
							(xl)
						</TableHeadCell>
					</TableRow>
				</TableHeader>

				<TableBody>
					{sortedData.map((row) => (
						<TableRow key={row.id} className="hover:bg-[var(--ds-color-blue-90)] transition-colors">
							<TableCell columnSize="xs" align="center">
								{row.id}
							</TableCell>

							<TableCell columnSize="sm" align="center">
								-
							</TableCell>

							<TableCell columnSize="md">{row.type}</TableCell>

							<TableCell columnSize="lg" align="center">
								{row.type === "Type/Badge+text" && (
									<Tag variant="success" iconWeight="fill" iconLeft={CircleIcon}>
										Online
									</Tag>
								)}

								{row.type === "Type/Action" && (
									<Dropdown>
										<DropdownTrigger>
											<div className="flex items-center gap-2 cursor-pointer">
												<CaretDownIcon size={24} />
												<span>Label</span>
											</div>
										</DropdownTrigger>

										<DropdownMenu width="260px">
											{["item1", "item2", "item3", "item4"].map((key, index) => (
												<DropdownItem
													key={key}
													variant="checkbox"
													checked={!!actionChecked[key]}
													onSelect={() => toggleActionItem(key)}
												>
													Item {index + 1}
												</DropdownItem>
											))}
										</DropdownMenu>
									</Dropdown>
								)}

								{row.type === "Type/Checkbox" && (
									<Checkbox
										label="Label"
										checked={!!checkedItems[row.id]}
										onChange={() => handleCheckboxChange(row.id)}
									/>
								)}

								{row.type === "Type/Tag" && <Tag variant="danger">Highlighted</Tag>}

								{row.type === "Type/Tag+Status" && (
									<Tag variant="primary" iconLeft={PlusIcon}>
										Add
									</Tag>
								)}

								{row.type === "Type/Null" && "-"}
							</TableCell>

							<TableCell columnSize="xl" align="center">
								-
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<div className="flex justify-center mt-4">
				<Pagination
					label="Itens"
					size="md"
					positionLabel="right"
					perPage={10}
					total={100}
					currentPage={1}
					onPageChange={() => {}}
				/>
			</div>
		</div>
	);
};

export const Example: Story = {
	render: (args) => <ExemploComponent {...args} />,
};
