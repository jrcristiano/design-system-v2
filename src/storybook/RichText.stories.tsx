import { useState } from "react";
import { Form, Formik } from "formik";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as Yup from "yup";
import { fn } from "storybook/test";
import { RichText } from "../components/RichText/RichText";
import "./RichText.stories.inline.css";

const meta: Meta<typeof RichText> = {
	title: "Components/RichText",
	component: RichText,
	parameters: {
		layout: "centered",
	},
	args: {
		onChange: fn(),
	},
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "Label do campo",
		},
		required: {
			control: "boolean",
			description: "Indica se o campo é obrigatório",
		},
		placeholder: {
			control: "text",
			description: "Placeholder quando o campo está vazio",
		},
		value: {
			control: "text",
			description: "Conteúdo inicial do editor",
		},
		error: {
			control: "text",
			description: "Mensagem de erro a ser exibida",
		},
		disabled: {
			control: "boolean",
			description: "Indica se o campo está desabilitado",
		},
		minLength: {
			control: "number",
			description: "Número mínimo de caracteres",
		},
		maxLength: {
			control: "number",
			description: "Número máximo de caracteres",
		},
	},
};

export default meta;
type Story = StoryObj<typeof RichText>;

// Componente wrapper para controlar o estado
const RichTextWrapper = (args: any) => {
	const [value, setValue] = useState(args.value || "");

	return (
		<div className="richtext-stories-inline-1">
			<RichText
				{...args}
				value={value}
				onChange={(content) => {
					setValue(content);
					args.onChange?.(content);
				}}
			/>
		</div>
	);
};

export const Examples: Story = {
	render: (args) => <RichTextWrapper {...args} />,
	args: {
		label: "Descrição",
		required: true,
		placeholder: "Digite sua descrição aqui...",
		minLength: 50,
		maxLength: 1000,
		value: `
      <p>Este texto contém <strong>negrito</strong>, <em>itálico</em> e <s>tachado</s>.</p>
      <h2>Título de seção</h2>
      <p>Você pode criar listas com marcadores:</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
      <p>Ou listas numeradas:</p>
      <ol>
        <li>Primeiro</li>
        <li>Segundo</li>
        <li>Terceiro</li>
      </ol>
    `,
	},
};

export const Disabled: Story = {
	render: (args) => <RichTextWrapper {...args} />,
	args: {
		label: "Descrição",
		required: true,
		value:
			"<p>Este é um exemplo de texto preenchido no componente Rich Text. O texto pode conter <strong>formatações</strong> como <strong>negrito</strong>, <em>itálico</em> e <strong>listas</strong>.</p>",
		disabled: true,
		minLength: 50,
		maxLength: 1000,
	},
};

export const WithoutLabel: Story = {
	render: (args) => <RichTextWrapper {...args} />,
	args: {
		placeholder: "Digite sua descrição aqui...",
		minLength: 50,
		maxLength: 1000,
	},
};

/**
 * Validação de caracteres mínimos
 */
export const MinimumCharacterValidation: Story = {
	render: (args) => <RichTextWrapper {...args} />,
	args: {
		label: "Descrição",
		required: true,
		value: "<p>Texto muito curto</p>",
		minLength: 50,
		maxLength: 1000,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Quando o texto tem menos caracteres que o mínimo, uma mensagem de erro é exibida automaticamente.",
			},
		},
	},
};

/**
 * Validação de caracteres máximos
 */
export const MaximumCharacterValidation: Story = {
	render: (args) => (
		<div className="richtext-stories-inline-2">
			<Formik
				initialValues={{ description: args.value || "" }}
				initialTouched={{ description: true }}
				validateOnMount
				validationSchema={Yup.object({
					description: Yup.string().test(
						"max-text",
						`O texto deve ter no máximo ${args.maxLength || 100} caracteres.`,
						(value) => {
							const text = (value || "").replace(/<[^>]*>/g, "");
							return text.length <= (args.maxLength || 100);
						},
					),
				})}
				onSubmit={() => undefined}
			>
				<Form>
					<RichText {...args} name="description" />
				</Form>
			</Formik>
		</div>
	),
	args: {
		label: "Descrição",
		required: true,
		value:
			"<p>Este texto ultrapassa o limite máximo <b>20 (vinte)</b> de caracteres definido no componente.</p>",
		minLength: 10,
		maxLength: 20,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Quando o texto excede o número máximo de caracteres, a mensagem de erro é exibida via Formik + Yup.",
			},
		},
	},
};
