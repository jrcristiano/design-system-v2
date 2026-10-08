import React from "react";
import type { ComponentProps } from "react";
import Switch from "../components/Switch/Switch";
import { Button } from "../components/Button/Button";
import "./Switch.stories.inline.css";

export default {
	title: "Components/Switch",
	component: Switch,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		disabled: {
			control: "boolean",
			description: "Estado desabilitado do switch",
		},
		defaultChecked: {
			control: "boolean",
			description: "Estado inicial quando não controlado",
		},
		checked: {
			control: "boolean",
			description: "Estado controlado do switch",
		},
		onChange: {
			action: "changed",
			description: "Callback quando o estado muda",
		},
	},
};

const Template = (args: ComponentProps<typeof Switch>) => <Switch {...args} />;

export const Default = Template.bind({});
Default.args = {
	defaultChecked: false,
};

export const Checked = Template.bind({});
Checked.args = {
	defaultChecked: true,
};
Checked.parameters = {
	docs: {
		description: {
			story: "Switch que começa na posição ligado (on).",
		},
	},
};

export const Disabled = Template.bind({});
Disabled.args = {
	disabled: true,
	defaultChecked: false,
};

Disabled.parameters = {
	docs: {
		description: {
			story: "Switch desabilitado que não pode ser interagido.",
		},
	},
};

export const DisabledChecked = Template.bind({});
DisabledChecked.args = {
	disabled: true,
	defaultChecked: true,
};

DisabledChecked.parameters = {
	docs: {
		description: {
			story: "Switch desabilitado na posição ligado.",
		},
	},
};

export const Controlled = (args: ComponentProps<typeof Switch>) => {
	const [isChecked, setIsChecked] = React.useState(false);

	return (
		<div className="switch-stories-inline-1">
			<Switch {...args} checked={isChecked} onChange={setIsChecked} />
			<span className="switch-stories-inline-2">
				Estado atual: {isChecked ? "Ligado" : "Desligado"}
			</span>
			<Button onClick={() => setIsChecked(!isChecked)}>Alternar Switch</Button>
		</div>
	);
};
Controlled.parameters = {
	docs: {
		description: {
			story: "Exemplo de switch controlado onde o estado é gerenciado externamente.",
		},
	},
};

export const AllStates = () => (
	<div className="switch-stories-inline-3">
		<div className="switch-stories-inline-4">
			<Switch defaultChecked={false} />
			<span>Default (Off)</span>
		</div>

		<div className="switch-stories-inline-5">
			<Switch defaultChecked={true} />
			<span>Default (On)</span>
		</div>

		<div className="switch-stories-inline-6">
			<Switch disabled defaultChecked={false} />
			<span>Disabled (Off)</span>
		</div>

		<div className="switch-stories-inline-7">
			<Switch disabled defaultChecked={true} />
			<span>Disabled (On)</span>
		</div>
	</div>
);

AllStates.parameters = {
	docs: {
		description: {
			story: "Visão geral de todos os estados do componente Switch.",
		},
	},
};

export const Sizes = () => (
	<div className="switch-stories-inline-8">
		<div className="switch-stories-inline-9">
			<Switch defaultChecked={false} />
			<span>Padrão (50px)</span>
		</div>
	</div>
);

export const Accessibility = () => (
	<div className="switch-stories-inline-10">
		<h3>Switch com labels acessíveis</h3>

		<label className="switch-stories-inline-11">
			<Switch defaultChecked={true} />
			<span>Notificações por email</span>
		</label>

		<label className="switch-stories-inline-12">
			<Switch defaultChecked={false} />
			<span>Modo escuro</span>
		</label>

		<label className="switch-stories-inline-13">
			<Switch disabled defaultChecked={true} />
			<span>Login automático (desabilitado)</span>
		</label>
	</div>
);

Accessibility.parameters = {
	docs: {
		description: {
			story: "Exemplos de uso acessível com labels descritivos.",
		},
	},
};
