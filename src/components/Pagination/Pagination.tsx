import React, { useState, useEffect, useId, memo } from "react";
import { CaretLeftIcon, CaretRightIcon, DotsThreeIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import type { IPaginationProps } from "./Pagination.interface";
import type { PaginationSize, PaginationPageInputAlign } from "./Pagination.type";

const BUTTON_SIZES: Record<PaginationSize, string> = {
	sm: "w-6 h-6 text-[length:var(--ds-font-size-12)] min-w-6",
	md: "w-9 h-9 text-[length:var(--ds-font-size-14)] min-w-9",
	lg: "w-10 h-10 text-[length:var(--ds-font-size-14)] min-w-10",
};

const ICON_SIZES: Record<PaginationSize, number> = {
	sm: 12,
	md: 16,
	lg: 20,
};

const INFO_TEXT_SIZES: Record<PaginationSize, string> = {
	sm: "text-[var(--ds-font-size-12)] leading-[18px] sm:text-[var(--ds-font-size-14)] sm:leading-[21px]",
	md: "text-[var(--ds-font-size-14)] leading-[21px]",
	lg: "text-[var(--ds-font-size-14)] leading-[21px] sm:text-[var(--ds-font-size-16)] sm:leading-[24px]",
};

const PAGE_INPUT_ROW_ALIGNMENTS: Record<PaginationPageInputAlign, string> = {
	left: "justify-start",
	center: "justify-center",
	right: "justify-end",
};

const PAGE_INPUT_CONTENT_ALIGNMENTS: Record<PaginationPageInputAlign, string> = {
	left: "items-start text-left",
	center: "items-center text-center",
	right: "items-end text-right",
};

const INPUT_SIZES: Record<PaginationSize, string> = {
	sm: "h-6 text-[var(--ds-font-size-12)]",
	md: "h-9 text-[var(--ds-font-size-14)]",
	lg: "h-10 text-[var(--ds-font-size-14)]",
};

const BASE_BUTTON_STYLES = `
	rounded-full inline-flex items-center justify-center
	font-[var(--ds-font-family-ui)] font-[var(--ds-font-weight-semibold)]
	transition-all duration-150 cursor-pointer
	focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-color-blue-10)]
	focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg-secondary)]
	flex-shrink-0
`;

// ---------- PageButton ----------
interface PageButtonProps {
	page: number;
	currentPage: number;
	disabled: boolean;
	size: PaginationSize;
	onClick: (page: number) => void;
}

const PageButton = memo<PageButtonProps>(({ page, currentPage, disabled, size, onClick }) => {
	const isActive = page === currentPage;

	let buttonStateClasses = "";
	if (disabled) {
		buttonStateClasses =
			"bg-[var(--ds-color-neutral-80)] text-[var(--ds-color-neutral-40)] cursor-not-allowed";
	} else if (isActive) {
		buttonStateClasses = "bg-[var(--ds-color-blue-10)] text-[color:var(--ds-color-neutral-white)]";
	} else {
		buttonStateClasses = "text-[var(--ds-color-neutral-40)] hover:bg-[var(--ds-color-neutral-90)]";
	}

	const buttonClasses = clsx(BASE_BUTTON_STYLES, BUTTON_SIZES[size], buttonStateClasses);

	return (
		<button
			onClick={() => onClick(page)}
			disabled={disabled}
			className={buttonClasses}
			aria-label={`Página ${page}`}
			aria-current={isActive ? "page" : undefined}
		>
			{page}
		</button>
	);
});
PageButton.displayName = "PageButton";

// ---------- DotsButton ----------
interface DotsButtonProps {
	size: PaginationSize;
	position: "start" | "end";
}

const DotsButton = memo<DotsButtonProps>(({ size }) => {
	const classes = clsx(
		BASE_BUTTON_STYLES,
		BUTTON_SIZES[size],
		"text-[var(--ds-color-neutral-40)] pointer-events-none",
	);

	return (
		<span className={classes} aria-hidden="true">
			<DotsThreeIcon size={ICON_SIZES[size]} weight="bold" />
		</span>
	);
});
DotsButton.displayName = "DotsButton";

// ---------- Pagination ----------
export const Pagination: React.FC<IPaginationProps> = memo(
	({
		currentPage,
		onPageChange,
		size = "lg",
		positionLabel,
		perPage = 50,
		total = 0,
		label = "Itens",
		maxButtons = 5,
		disabled = false,
		showPageInput = true,
		pageInputAlign = "center",
	}) => {
		const inputId = useId();
		const errorId = `${inputId}-error`;
		const totalPages = Math.max(1, Math.ceil(total / perPage));

		const [pageInput, setPageInput] = useState(String(currentPage));
		const [pageError, setPageError] = useState<string | null>(null);

		useEffect(() => {
			setPageInput(String(currentPage));
			setPageError(null);
		}, [currentPage]);

		const handlePageChange = (page: number) => {
			if (disabled || page < 1 || page > totalPages || page === currentPage) return;
			onPageChange(page);
		};

		const getPageInputError = (value: string) => {
			if (!value.trim()) return "Informe uma página.";
			const parsed = Number(value);
			if (!Number.isInteger(parsed)) return "Use um número inteiro.";
			if (parsed < 1 || parsed > totalPages) return `Página deve estar entre 1 e ${totalPages}.`;
			return null;
		};

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setPageInput(e.target.value);
			setPageError(getPageInputError(e.target.value));
		};

		const handleInputSubmit = () => {
			const error = getPageInputError(pageInput);
			if (error) {
				setPageError(error);
				return;
			}
			handlePageChange(Number(pageInput));
		};

		const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key !== "Enter") return;
			e.preventDefault();
			handleInputSubmit();
		};

		const startItem = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
		const endItem = total === 0 ? 0 : Math.min(currentPage * perPage, total);

		// ---------- Page Numbers ----------
		const pageNumbers = (() => {
			const half = Math.floor(maxButtons / 2);

			if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);

			if (currentPage <= half + 1) {
				const initialPages = Array.from({ length: maxButtons - 1 }, (_, i) => i + 1);
				return [...initialPages, "dots" as const, totalPages];
			}

			if (currentPage >= totalPages - half) {
				const lastPages = Array.from(
					{ length: maxButtons - 1 },
					(_, i) => totalPages - (maxButtons - 2) + i,
				);
				return [1, "dots" as const, ...lastPages];
			}

			const middlePages = [currentPage - 1, currentPage, currentPage + 1];
			return [1, "dots" as const, ...middlePages, "dots" as const, totalPages];
		})();

		const renderInfoText = positionLabel ? (
			<div
				className={clsx(
					INFO_TEXT_SIZES[size],
					"font-[var(--ds-font-family-ui)] text-[var(--ds-color-neutral-40)] text-center sm:text-left flex-shrink-0",
				)}
			>
				<span className="font-[var(--ds-font-weight-regular)]">Mostrando </span>
				<span className="font-[var(--ds-font-weight-bold)]">
					{startItem}-{endItem}
				</span>
				<span className="font-[var(--ds-font-weight-regular)]"> de </span>
				<span className="font-[var(--ds-font-weight-bold)]">{total}</span>
				<span className="font-[var(--ds-font-weight-regular)]"> {label}</span>
			</div>
		) : null;

		const inputClasses = clsx(
			"rounded-full border text-center font-[var(--ds-font-family-ui)] font-[var(--ds-font-weight-regular)]",
			"bg-[var(--ds-bg-secondary)] text-[var(--ds-color-neutral-10)]",
			"focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-color-blue-10)]",
			"focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-bg-secondary)]",
			pageError
				? "border-[var(--ds-color-red-40)] text-[var(--ds-color-red-40)]"
				: "border-[var(--ds-color-neutral-70)]",
			INPUT_SIZES[size],
		);

		const jumpButtonClasses = clsx(
			BASE_BUTTON_STYLES,
			BUTTON_SIZES[size],
			disabled
				? "bg-[var(--ds-color-neutral-80)] text-[var(--ds-color-neutral-40)] cursor-not-allowed"
				: "bg-[var(--ds-color-blue-40)] text-[var(--ds-color-neutral-white)] hover:opacity-90",
		);

		return (
			<div className="w-full flex flex-col gap-2">
				{positionLabel === "top" && renderInfoText}
				<div className="flex items-center w-full justify-between gap-3">
					{positionLabel === "left" && renderInfoText}
					<div className="flex items-center gap-1 flex-wrap justify-center flex-1 min-w-0">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={disabled || currentPage === 1}
							className={clsx(
								BASE_BUTTON_STYLES,
								BUTTON_SIZES[size],
								"text-[var(--ds-color-neutral-10)] hover:bg-[var(--ds-color-neutral-90)]",
							)}
							aria-label="Página anterior"
						>
							<CaretLeftIcon size={ICON_SIZES[size]} weight="bold" />
						</button>

						{pageNumbers.map((p, index) =>
							p === "dots" ? (
								<DotsButton
									key={`dots-${index}-${totalPages}`}
									size={size}
									position={currentPage < totalPages / 2 ? "start" : "end"}
								/>
							) : (
								<PageButton
									key={`page-${p}`}
									page={p}
									currentPage={currentPage}
									disabled={disabled}
									size={size}
									onClick={handlePageChange}
								/>
							),
						)}

						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={disabled || currentPage === totalPages}
							className={clsx(
								BASE_BUTTON_STYLES,
								BUTTON_SIZES[size],
								"text-[var(--ds-color-neutral-10)] hover:bg-[var(--ds-color-neutral-90)]",
							)}
							aria-label="Próxima página"
						>
							<CaretRightIcon size={ICON_SIZES[size]} weight="bold" />
						</button>
					</div>
					{positionLabel === "right" && renderInfoText}
				</div>

				{showPageInput && (
					<div className={clsx("flex w-full", PAGE_INPUT_ROW_ALIGNMENTS[pageInputAlign])}>
						<div
							className={clsx("flex flex-col gap-1", PAGE_INPUT_CONTENT_ALIGNMENTS[pageInputAlign])}
						>
							<div className="flex items-center gap-2">
								<label htmlFor={inputId} className="sr-only">
									Página
								</label>
								<span className="text-[var(--ds-color-neutral-40)] font-[var(--ds-font-family-ui)] text-[var(--ds-font-size-12)] sm:text-[var(--ds-font-size-14)]">
									Ir para página:
								</span>
								<input
									id={inputId}
									type="number"
									inputMode="numeric"
									min={1}
									max={totalPages}
									step={1}
									value={pageInput}
									onChange={handleInputChange}
									onKeyDown={handleInputKeyDown}
									disabled={disabled}
									className={inputClasses}
									aria-invalid={!!pageError || undefined}
									aria-describedby={pageError ? errorId : undefined}
								/>
								<button
									type="button"
									onClick={handleInputSubmit}
									disabled={disabled}
									className={jumpButtonClasses}
									aria-label="Ir para página"
								>
									Ir
								</button>
							</div>
							{pageError && (
								<span
									id={errorId}
									role="alert"
									className="text-[var(--ds-font-size-12)] text-[var(--ds-color-red-40)]"
								>
									{pageError}
								</span>
							)}
						</div>
					</div>
				)}
			</div>
		);
	},
);

Pagination.displayName = "Pagination";
