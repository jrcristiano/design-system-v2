import * as Yup from "yup";
import { cpf, cnpj } from "cpf-cnpj-validator";

export const registerDocumentValidation = () => {
	Yup.addMethod<Yup.StringSchema>(Yup.string, "document", function (message?: string) {
		return this.test("cpf-cnpj", message || "CPF ou CNPJ inválido", function (value) {
			if (!value) return true;
			const clean = value.replaceAll(/[^\d]+/g, "");
			if (clean.length <= 11) return cpf.isValid(clean);
			return cnpj.isValid(clean);
		});
	});
};

registerDocumentValidation();
