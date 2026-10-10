import { CalendarBlankIcon, PlusIcon } from "@phosphor-icons/react";
import { useState, useRef, useEffect, useCallback } from "react";
import type { InputProps } from "./Input.interface";
import { Input } from "./Input";
import { DateCalendar } from "./DateCalendar";

export const InputDatePicker: React.FC<InputProps> = ({
	label,
	disabled,
	onClick,
	onIconLeftClick,
	onIconRightClick,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [inputValue, setInputValue] = useState("");
	const confirmedInputValueRef = useRef("");
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setInputValue(confirmedInputValueRef.current);
				setSelectedDate(null);
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleDateSelect = useCallback((date: Date) => {
		setSelectedDate(date);
		const formatted = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
		setInputValue(formatted);
	}, []);

	const handleOkClick = useCallback(() => {
		if (selectedDate) {
			confirmedInputValueRef.current = inputValue;
			setIsOpen(false);
		}
	}, [inputValue, selectedDate]);

	const handleToggle = useCallback(() => {
		if (disabled) return;
		if (isOpen) {
			setInputValue(confirmedInputValueRef.current);
			setSelectedDate(null);
			setIsOpen(false);
		} else {
			setIsOpen(true);
		}
	}, [disabled, isOpen]);

	const handleOpen = useCallback(() => {
		if (disabled) return;
		setIsOpen(true);
	}, [disabled]);

	const handleInputClick = useCallback(
		(e: React.MouseEvent<HTMLInputElement>) => {
			handleOpen();
			onClick?.(e);
		},
		[handleOpen, onClick],
	);

	const handleLeftIconClick = useCallback(() => {
		handleOpen();
		onIconLeftClick?.();
	}, [handleOpen, onIconLeftClick]);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		confirmedInputValueRef.current = e.target.value;
		setSelectedDate(null);
	}, []);

	const handleCalendarClick = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			handleToggle();
			if (!disabled) {
				onIconRightClick?.();
			}
		},
		[handleToggle, disabled, onIconRightClick],
	);

	const handleCancelClick = useCallback(() => {
		setInputValue(confirmedInputValueRef.current);
		setSelectedDate(null);
		setIsOpen(false);
	}, []);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				handleToggle();
			}
		},
		[handleToggle],
	);

	return (
		<div ref={containerRef} className="relative">
			<Input
				label={label}
				type="text"
				required
				disabled={disabled}
				value={inputValue}
				onChange={handleInputChange}
				onClick={handleInputClick}
				mask="00/00/0000"
				placeholder="00/00/0000"
				iconLeft={<PlusIcon size={20} />}
				onIconLeftClick={handleLeftIconClick}
				iconRight={
					<button
						className="dark:focus-visible:outline-2 dark:focus-visible:outline-offset-2 dark:focus-visible:outline-[var(--ds-color-focus-ring)]"
						type="button"
						onClick={handleCalendarClick}
						onKeyDown={handleKeyDown}
						aria-label="Open calendar"
					>
						<CalendarBlankIcon size={20} />
					</button>
				}
				iconClassName="text-[var(--ds-color-neutral-40)] focus:text-[var(--ds-color-neutral-10)] transition-colors"
				{...props}
			/>

			{isOpen && (
				<div className="absolute mt-2 z-50">
					<DateCalendar
						selectedDate={selectedDate}
						onSelect={handleDateSelect}
						footer={
							<>
								<button
									onClick={handleCancelClick}
									className="px-3 py-2 text-sm font-[var(--ds-font-weight-regular)] text-[var(--ds-color-neutral-10)] hover:bg-[var(--ds-color-neutral-95)] rounded-full transition-colors dark:focus-visible:outline-2 dark:focus-visible:outline-offset-2 dark:focus-visible:outline-[var(--ds-color-focus-ring)]"
								>
									Cancelar
								</button>
								<button
									onClick={handleOkClick}
									disabled={!selectedDate}
									className={`px-3 py-2 text-sm rounded-full transition-colors font-[var(--ds-font-weight-regular)] dark:focus-visible:outline-2 dark:focus-visible:outline-offset-2 dark:focus-visible:outline-[var(--ds-color-focus-ring)] ${
										selectedDate
											? "bg-[var(--ds-color-blue-40)] text-[var(--ds-color-neutral-white)] hover:bg-[var(--ds-color-blue-60)]"
											: "bg-[var(--ds-color-neutral-80)] text-[var(--ds-color-neutral-40)] cursor-not-allowed"
									}`}
								>
									Ok
								</button>
							</>
						}
					/>
				</div>
			)}
		</div>
	);
};
