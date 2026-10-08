import "yup";

declare module "yup" {
	interface StringSchema {
		document(message?: string): this;
	}
}
