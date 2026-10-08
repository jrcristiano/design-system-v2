export const parseDateValue = (value: string): Date | null => {
	const [day, month, year] = value.split("/").map(Number);
	if (!day || !month || !year) return null;
	const date = new Date(year, month - 1, day);
	return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateValue = (date: Date) =>
	`${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
