import type { IconWeight } from "@phosphor-icons/react";
import type { CellAlign, ColumnSize, SortDirection } from "./Table.type";

// Interface base para a tabela completa
export interface ITableProps extends React.TableHTMLAttributes<HTMLTableElement> {
	children: React.ReactNode;
	className?: string;
}

// Interface para o cabeçalho
export interface ITableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
	children: React.ReactNode;
	className?: string;
}

// Interface para o corpo
export interface ITableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
	children: React.ReactNode;
	className?: string;
}

// Interface para linha
export interface ITableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
	children: React.ReactNode;
	isClickable?: boolean;
	isSelected?: boolean;
	className?: string;
}

// Interface para célula do cabeçalho
export interface ITableHeadCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
	children: React.ReactNode;
	columnSize?: ColumnSize;
	align?: CellAlign;
	sortable?: boolean;
	sortDirection?: SortDirection;
	onSort?: () => void;
	iconLeft?: React.ElementType<any>;
	onIconLeftClick?: () => void;
	iconWeight?: IconWeight;
	className?: string;
}

// Interface para célula do corpo
export interface ITableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
	children: React.ReactNode;
	columnSize?: ColumnSize;
	align?: CellAlign;
	className?: string;
}
