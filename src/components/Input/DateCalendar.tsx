import { CaretRightIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

type DateCalendarProps = {
	selectedDate: Date | null;
	onSelect: (date: Date) => void;
	closeOnSelect?: boolean;
	onClose?: () => void;
	footer?: ReactNode;
};

export const DateCalendar = ({
	selectedDate,
	onSelect,
	closeOnSelect = false,
	onClose,
	footer,
}: DateCalendarProps) => {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const months = useMemo(
		() => [
			"Janeiro",
			"Fevereiro",
			"Março",
			"Abril",
			"Maio",
			"Junho",
			"Julho",
			"Agosto",
			"Setembro",
			"Outubro",
			"Novembro",
			"Dezembro",
		],
		[],
	);
	const daysOfWeek = useMemo(() => ["S", "T", "Q", "Q", "S", "S", "D"], []);

	useEffect(() => {
		if (selectedDate) {
			setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
		}
	}, [selectedDate]);

	const getDaysInMonth = useCallback((date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days = [];
		for (let i = 0; i < startingDayOfWeek; i++) {
			days.push(null);
		}
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(i);
		}
		return days;
	}, []);

	const days = useMemo(() => getDaysInMonth(currentMonth), [currentMonth, getDaysInMonth]);

	const isToday = useCallback(
		(day: number | null) => {
			if (!day) return false;
			const today = new Date();
			return (
				day === today.getDate() &&
				currentMonth.getMonth() === today.getMonth() &&
				currentMonth.getFullYear() === today.getFullYear()
			);
		},
		[currentMonth],
	);

	const isSelected = useCallback(
		(day: number | null) => {
			if (!selectedDate || !day) return false;
			return (
				day === selectedDate.getDate() &&
				currentMonth.getMonth() === selectedDate.getMonth() &&
				currentMonth.getFullYear() === selectedDate.getFullYear()
			);
		},
		[selectedDate, currentMonth],
	);

	const handleDateClick = (day: number | null) => {
		if (!day) return;
		const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
		onSelect(newDate);
		if (closeOnSelect) {
			onClose?.();
		}
	};

	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCurrentMonth(new Date(Number.parseInt(e.target.value, 10), currentMonth.getMonth(), 1));
	};

	return (
		<div className="bg-[var(--ds-surface)] rounded-[var(--ds-radius-md)] shadow-2xl p-4 w-[320px] border-2 border-[var(--ds-color-neutral-50)]">
			<div className="flex items-center justify-between">
				<select
					value={currentMonth.getFullYear()}
					onChange={handleYearChange}
					className="h-[var(--ds-control-height-sm)] px-3 border-2 font-[var(--ds-font-weight-regular)] border-[var(--ds-color-neutral-50)] rounded-full text-sm focus:outline-none focus:border-[var(--ds-color-blue-40)] text-[var(--ds-color-neutral-30)] bg-[var(--ds-surface)] max-w-[90px] cursor-pointer"
				>
					{Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i).map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>

				<div className="flex items-center gap-3">
					<button
						onClick={() =>
							setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
						}
						className="p-1 font-[var(--ds-font-weight-regular)] hover:bg-[var(--ds-color-neutral-95)] rounded transition-colors cursor-pointer"
					>
						<CaretRightIcon className="rotate-180 text-[var(--ds-color-neutral-30)]" size={20} />
					</button>

					<span className="text-base font-[var(--ds-font-weight-regular)] text-[var(--ds-color-neutral-40)] min-w-[80px] text-center cursor-pointer select-none">
						{months[currentMonth.getMonth()]}
					</span>

					<button
						onClick={() =>
							setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
						}
						className="p-1 font-[var(--ds-font-weight-regular)] hover:bg-[var(--ds-color-neutral-95)] rounded transition-colors cursor-pointer"
					>
						<CaretRightIcon className="text-[var(--ds-color-neutral-30)]" size={20} />
					</button>
				</div>
			</div>

			<div className="pt-4">
				<div className="grid grid-cols-7 gap-2 mb-3">
					{daysOfWeek.map((day, index) => (
						<div
							key={`weekday-${day}-${index}`}
							className="text-center text-sm font-[var(--ds-font-weight-medium)] text-[var(--ds-color-blue-40)] py-1"
						>
							{day}
						</div>
					))}
				</div>

				<div className="border-t-1 border-[var(--ds-color-neutral-50)] grid grid-cols-7 gap-2">
					{days.map((day, index) => (
						<button
							key={day ? `day-${day}` : `empty-${index}`}
							onClick={() => handleDateClick(day)}
							disabled={!day}
							className={`
								aspect-square h-10 rounded-full text-sm font-medium transition-all cursor-pointer
								${day ? "" : "invisible"}
								${isSelected(day) ? "bg-[var(--ds-color-blue-40)] text-[var(--ds-color-neutral-white)] scale-105" : ""}
								${isToday(day) && !isSelected(day) ? "border-2 border-[var(--ds-color-blue-40)] text-[var(--ds-color-blue-40)]" : ""}
								${!isSelected(day) && !isToday(day) ? "text-[var(--ds-color-neutral-10)] hover:bg-[var(--ds-color-neutral-95)]" : ""}
							`}
						>
							{day}
						</button>
					))}
				</div>
			</div>

			{footer && <div className="flex justify-end gap-2 mt-2">{footer}</div>}
		</div>
	);
};
