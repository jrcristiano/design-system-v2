export const getMask = (value: string) =>
	value.replaceAll(/\D/g, "").length > 11 ? "00.000.000/0000-00" : "000.000.000-00";
