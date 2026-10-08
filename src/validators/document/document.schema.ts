import "./document.validator";
import * as Yup from "yup";

export const documentSchema = Yup.object({
	document: Yup.string().required("CPF ou CNPJ é obrigatório").document("CPF ou CNPJ inválido"),
});
