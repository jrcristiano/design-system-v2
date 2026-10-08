export function getInitials(fullName: string): string {
	if (!fullName) return "";

	const parts = fullName.trim().split(/\s+/);

	if (parts.length === 1) {
		return parts[0][0].toUpperCase();
	}

	const first = parts[0][0];
	const last = parts.at(-1)?.[0] ?? "";

	return `${first}${last}`.toUpperCase();
}
