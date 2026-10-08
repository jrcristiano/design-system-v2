import React, { useMemo, type ReactNode } from "react";
import clsx from "clsx";
import { FunnelIcon, FunnelSimpleIcon } from "@phosphor-icons/react";
import type {
	ITableProps,
	ITableHeaderProps,
	ITableBodyProps,
	ITableRowProps,
	ITableHeadCellProps,
	ITableCellProps,
} from "./Table.interface";
import type { ColumnSize } from "./Table.type";

const SIZE_STYLES: Record<ColumnSize, string> = {
	xs: "w-[160px]",
	sm: "w-[200px]",
	md: "w-[240px]",
	lg: "w-[300px]",
	xl: "w-[360px]",
};

const ALIGN_STYLES = {
	left: "justify-start",
	center: "justify-center text-center",
	right: "justify-end text-right",
};

type IconSlotProps = {
	onClick?: () => void;
	children: ReactNode;
	className?: string;
};

const IconSlot: React.FC<IconSlotProps> = ({ onClick, children, className }) => {
	if (!onClick) {
		return <span className={className}>{children}</span>;
	}

	return (
		<button
			type="button"
			className={clsx("cursor-pointer p-0 border-0 bg-transparent", className)}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export const Table: React.FC<ITableProps> = React.memo(({ children, className, ...props }) => {
	return (
		<div className="bg-white inline-flex flex-col w-full  overflow-x-auto">
			<table
				className={clsx("w-full border-collapse bg-[var(--ds-surface)]", className)}
				{...props}
			>
				{children}
			</table>
		</div>
	);
});

Table.displayName = "Table";

export const TableHeader: React.FC<ITableHeaderProps> = React.memo(
	({ children, className, ...props }) => {
		return (
			<thead className={clsx(className)} {...props}>
				{children}
			</thead>
		);
	},
);

TableHeader.displayName = "TableHeader";

export const TableBody: React.FC<ITableBodyProps> = React.memo(
	({ children, className, ...props }) => {
		return (
			<tbody className={clsx(className)} {...props}>
				{children}
			</tbody>
		);
	},
);

TableBody.displayName = "TableBody";

export const TableRow: React.FC<ITableRowProps> = React.memo(
	({ children, isClickable = false, isSelected = false, className, ...props }) => {
		const rowStyles = useMemo(() => {
			return clsx(
				"inline-flex w-full",
				isClickable && "cursor-pointer hover:bg-[var(--ds-color-neutral-98)]",
				isSelected && "bg-[var(--ds-color-blue-95)]",
				className,
			);
		}, [isClickable, isSelected, className]);

		return (
			<tr className={rowStyles} {...props}>
				{children}
			</tr>
		);
	},
);

TableRow.displayName = "TableRow";

type SortDirection = "asc" | "desc" | null;
type AriaSortValue = "ascending" | "descending" | "none" | undefined;

const getAriaSortValue = (sortable: boolean, sortDirection: SortDirection): AriaSortValue => {
	if (!sortable) return undefined;
	if (sortDirection === "asc") return "ascending";
	if (sortDirection === "desc") return "descending";
	return "none";
};

const renderSortIcon = (sortDirection: SortDirection) => {
	if (sortDirection === "asc") {
		return (
			<FunnelIcon
				size={16}
				weight="fill"
				className="text-[var(--ds-color-blue-50)] transition-colors"
			/>
		);
	}

	if (sortDirection === "desc") {
		return (
			<FunnelSimpleIcon
				size={16}
				weight="fill"
				className="text-[var(--ds-color-blue-50)] transition-colors"
			/>
		);
	}

	return (
		<FunnelIcon
			size={16}
			weight="regular"
			className="text-[var(--ds-color-neutral-60)] transition-colors"
		/>
	);
};

export const TableHeadCell: React.FC<ITableHeadCellProps> = React.memo(
	({
		children,
		columnSize = "md",
		align = "left",
		sortable = false,
		sortDirection = null,
		onSort,
		iconLeft: IconLeft,
		onIconLeftClick,
		iconWeight = "regular",
		className,
		...props
	}) => {
		const handleSort = () => {
			if (sortable && onSort) {
				onSort();
			}
		};

		const contentClasses = clsx(
			"h-12 px-6 bg-[var(--ds-surface)] inline-flex items-center gap-2 w-full",
			SIZE_STYLES[columnSize],
			ALIGN_STYLES[align],
		);

		const renderContent = () => (
			<>
				{IconLeft && (
					<IconSlot onClick={onIconLeftClick}>
						<IconLeft size={16} weight={iconWeight} className="text-[var(--ds-color-neutral-30)]" />
					</IconSlot>
				)}
				<div className="text-[var(--ds-color-neutral-30)] text-base font-semibold font-poppins leading-5">
					{children}
				</div>
				{sortable && renderSortIcon(sortDirection)}
			</>
		);

		return (
			<th
				className={clsx(
					"h-12 inline-flex flex-col justify-start items-start gap-px",
					SIZE_STYLES[columnSize],
					className,
				)}
				aria-sort={getAriaSortValue(sortable, sortDirection)}
				{...props}
			>
				{sortable ? (
					<button
						type="button"
						onClick={handleSort}
						className={clsx(
							contentClasses,
							"cursor-pointer select-none hover:bg-[var(--ds-color-neutral-95)] transition-colors border-0 m-0 p-0 bg-transparent text-left",
						)}
						style={{ padding: "0 24px" }}
					>
						{renderContent()}
					</button>
				) : (
					<div className={contentClasses}>{renderContent()}</div>
				)}
				<div className="self-stretch h-0 border border-[var(--ds-color-neutral-90)]"></div>
			</th>
		);
	},
);

TableHeadCell.displayName = "TableHeadCell";

export const TableCell: React.FC<ITableCellProps> = React.memo(
	({ children, columnSize = "md", align = "left", className, ...props }) => {
		return (
			<td
				className={clsx(
					"h-14 inline-flex flex-col justify-start items-start gap-px overflow-visible",
					SIZE_STYLES[columnSize],
					className,
				)}
				{...props}
			>
				<div
					className={clsx(
						"h-14 px-6 inline-flex items-center gap-2 overflow-visible",
						SIZE_STYLES[columnSize],
						ALIGN_STYLES[align],
					)}
				>
					{children}
				</div>
			</td>
		);
	},
);

TableCell.displayName = "TableCell";
