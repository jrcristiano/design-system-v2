import type {
	PaginationSize,
	PaginationPositionLabel,
	PaginationPageInputAlign,
} from "./Pagination.type";

export interface IPaginationProps {
	currentPage: number;
	onPageChange: (page: number) => void;
	size?: PaginationSize;
	positionLabel?: PaginationPositionLabel;
	perPage?: number;
	total?: number;
	label?: string;
	maxButtons?: number;
	disabled?: boolean;
	showPageInput?: boolean;
	pageInputAlign?: PaginationPageInputAlign;
}
