import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Stepper } from "../components/Stepper/Stepper";

const meta: Meta<typeof Stepper> = {
	title: "Components/Steppers",
	component: Stepper,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component: `
# Stepper

Componente de navegação step-by-step com API similar ao React Bootstrap Nav.

## Funcionalidades

- Navegação entre steps via clique
- Estados de disabled
- Controle total via props
- Acessível e responsivo
- API familiar para usuários do React Bootstrap

## Uso

\`\`\`tsx
<Stepper activeKey={activeStep} onSelect={setActiveStep}>
  <Stepper.Item>
    <Stepper.Link eventKey="home">Início</Stepper.Link>
  </Stepper.Item>
  <Stepper.Item>
    <Stepper.Link eventKey="profile">Perfil</Stepper.Link>
  </Stepper.Item>
  <Stepper.Item>
    <Stepper.Link eventKey="contact" disabled>
      Desabilitado
    </Stepper.Link>
  </Stepper.Item>
</Stepper>
\`\`\`
        `,
			},
		},
	},
	argTypes: {
		activeKey: {
			control: { type: "text" },
			description: "Step ativo (eventKey)",
			table: {
				type: { summary: "string | number" },
			},
		},
		onSelect: {
			action: "stepSelected",
			description: "Callback disparado ao selecionar um step",
			table: {
				category: "Events",
			},
		},
		className: {
			control: { type: "text" },
			description: "Classe CSS adicional",
			table: {
				category: "Styling",
			},
		},
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
	args: {
		activeKey: 1,
	},
	render: function DefaultStory(args) {
		const [activeStep, setActiveStep] = useState<string | number>(args.activeKey || 1);

		const handleStepSelect = (key: string | number) => {
			setActiveStep(key);
			args.onSelect?.(key);
		};

		return (
			<div className="w-full max-w-full px-8 py-6">
				<Stepper activeKey={activeStep} onSelect={handleStepSelect}>
					<Stepper.Item>
						<Stepper.Link eventKey={1}>Início</Stepper.Link>
					</Stepper.Item>

					<Stepper.Item>
						<Stepper.Link eventKey={2}>Perfil</Stepper.Link>
					</Stepper.Item>

					<Stepper.Item>
						<Stepper.Link disabled eventKey={3}>
							Configurações [disabled]
						</Stepper.Link>
					</Stepper.Item>
				</Stepper>

				<div className="mt-8 p-4 border border-neutral-200 rounded-lg w-full">
					<p>
						Step ativo: <strong>{activeStep}</strong>
					</p>
				</div>
			</div>
		);
	},
};
