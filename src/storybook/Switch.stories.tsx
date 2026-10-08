import React from "react";
import Switch from "../components/Switch/Switch";
import { Button } from "../components/Button/Button";

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

const Template = (args: any) => <Switch {...args} />;

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

export const Controlled = (args: any) => {
	const [isChecked, setIsChecked] = React.useState(false);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
			<Switch checked={isChecked} onChange={setIsChecked} {...args} />
			<span style={{ color: "var(--ds-color-neutral-70)" }}>
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
	<div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "20px" }}>
		<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
			<Switch defaultChecked={false} />
			<span>Default (Off)</span>
		</div>

		<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
			<Switch defaultChecked={true} />
			<span>Default (On)</span>
		</div>

		<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
			<Switch disabled defaultChecked={false} />
			<span>Disabled (Off)</span>
		</div>

		<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
	<div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px" }}>
		<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
			<Switch defaultChecked={false} />
			<span>Padrão (50px)</span>
		</div>
	</div>
);

export const Accessibility = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "300px" }}>
		<h3>Switch com labels acessíveis</h3>

		<label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
			<Switch defaultChecked={true} />
			<span>Notificações por email</span>
		</label>

		<label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
			<Switch defaultChecked={false} />
			<span>Modo escuro</span>
		</label>

		<label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
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
