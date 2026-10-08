import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Dropdown } from "../Dropdown/Dropdown";
import { DropdownMenu } from "../Dropdown/DropdownMenu";
import { DropdownTrigger } from "../Dropdown/DropdownTrigger";
import { useDropdown } from "../Dropdown/DropdownContext";
import { Button } from "../Button/Button";
import { DateCalendar } from "../Input/DateCalendar";
import type { Size, Variant } from "../../types/Commons.type";
import { formatDateValue, parseDateValue } from "../../utils/date.util";

type DateDropdownPickerProps = {
	value: string;
	variant?: Variant;
	onChange: (value: string) => void;
	size?: Size;
	placeholder?: string;
};

const CalendarMenu = ({
	selectedDate,
	onSelect,
	onCancel,
	onOk,
}: {
	selectedDate: Date | null;
	onSelect: (date: Date) => void;
	onCancel: () => void;
	onOk: () => void;
}) => {
	const { close } = useDropdown();

	// Consolidando close() para evitar duplicação
	const handleCancel = () => {
		onCancel();
		close();
	};

	const handleOk = () => {
		if (!selectedDate) return;
		onOk();
		close();
	};

	return (
		<DateCalendar
			selectedDate={selectedDate}
			onSelect={onSelect}
			footer={
				<div className="flex gap-2">
					<button
						onClick={handleCancel}
						aria-label="Cancelar seleção de data"
						className="px-3 py-2 text-sm font-[var(--ds-font-weight-regular)] text-[var(--ds-color-neutral-10)] hover:bg-[var(--ds-color-neutral-95)] rounded-full transition-colors"
					>
						Cancelar
					</button>
					<button
						onClick={handleOk}
						disabled={!selectedDate}
						aria-disabled={!selectedDate}
						aria-label="Confirmar seleção de data"
						className={`px-3 py-2 text-sm rounded-full transition-colors font-[var(--ds-font-weight-regular)] ${
							selectedDate
								? "bg-[var(--ds-color-blue-40)] text-[var(--ds-color-neutral-white)] hover:bg-[var(--ds-color-blue-60)]"
								: "bg-[var(--ds-color-neutral-80)] text-[var(--ds-color-neutral-40)] cursor-not-allowed"
						}`}
					>
						Ok
					</button>
				</div>
			}
		/>
	);
};

export const DateDropdownPicker = ({
	value,
	variant = "primary",
	onChange,
	size = "lg",
	placeholder = "Selecione uma data",
}: DateDropdownPickerProps) => {
	// Estado único, derivado do value, elimina uso redundante de useMemo e useEffect
	const [draftDate, setDraftDate] = useState<Date | null>(parseDateValue(value));

	// Cancelar mantém a data atual
	const handleCancel = () => setDraftDate(parseDateValue(value));

	// Confirmar apenas se draftDate for válido
	const handleOk = () => {
		if (draftDate) {
			onChange(formatDateValue(draftDate));
		}
	};

	return (
		<Dropdown>
			<DropdownTrigger iconOpen={CaretDownIcon} iconClosed={CaretRightIcon}>
				<Button variant={variant} size={size} gapBetweenTextAndIcon className="w-full text-left">
					{value || placeholder}
				</Button>
			</DropdownTrigger>
			<DropdownMenu bordered={false}>
				<CalendarMenu
					selectedDate={draftDate}
					onSelect={setDraftDate}
					onCancel={handleCancel}
					onOk={handleOk}
				/>
			</DropdownMenu>
		</Dropdown>
	);
};
