import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
	Offcanvas,
	OffcanvasHeader,
	OffcanvasTitle,
	OffcanvasDescription,
	OffcanvasBody,
	OffcanvasFooter,
	type IOffcanvasProps,
} from "../components/Offcanvas";
import { Button } from "../components/Button/Button";
import { Input } from "../components/Input/Input";

function Example(args: IOffcanvasProps) {
	const [open, setOpen] = useState(args.open);
	useEffect(() => setOpen(args.open), [args.open]);
	return (
		<div className="p-6 bg-[var(--ds-color-bg-canvas)] text-[var(--ds-color-text-primary)]">
			<Button onClick={() => setOpen(true)}>Abrir painel</Button>
			<Offcanvas
				{...args}
				open={open}
				onOpenChange={(next) => {
					args.onOpenChange(next);
					setOpen(next);
				}}
			>
				{args.children ?? (
					<>
						<OffcanvasHeader>
							<OffcanvasTitle>Configurações</OffcanvasTitle>
							<OffcanvasDescription>Personalize suas preferências.</OffcanvasDescription>
						</OffcanvasHeader>
						<OffcanvasBody>
							<p>Conteúdo do painel.</p>
						</OffcanvasBody>
						<OffcanvasFooter>
							<Button onClick={() => setOpen(false)}>Salvar</Button>
						</OffcanvasFooter>
					</>
				)}
			</Offcanvas>
		</div>
	);
}

const meta = {
	title: "Components/Offcanvas",
	component: Offcanvas,
	tags: ["autodocs"],
	args: {
		open: false,
		onOpenChange: fn(),
		side: "right",
		size: "md",
		closeOnOverlayClick: true,
		closeOnEsc: true,
		showCloseButton: true,
	},
	argTypes: {
		open: { control: "boolean" },
		side: { control: "select", options: ["left", "right", "top", "bottom"] },
		size: { control: "select", options: ["sm", "md", "lg"] },
		closeOnOverlayClick: { control: "boolean" },
		closeOnEsc: { control: "boolean" },
		showCloseButton: { control: "boolean" },
		closeLabel: { control: "text" },
		children: { control: false },
		initialFocusRef: { control: false },
		returnFocusRef: { control: false },
	},
	parameters: {
		docs: {
			description: {
				component:
					"Painel modal controlado com dialog nativo, Escape, foco contido e scroll compartilhado com Modal. Use OffcanvasTitle ou aria-label para nomear o diálogo. OffcanvasBody rola mantendo header, fechamento e footer visíveis. A saída mantém a modalidade até a transição terminar e respeita prefers-reduced-motion. Requer showModal; o tema acompanha o ThemeProvider global.",
			},
		},
	},
	render: (args) => <Example {...args} />,
	play: async ({ canvasElement, args }) => {
		const page = within(canvasElement.ownerDocument.body);
		if (!args.open)
			await userEvent.click(within(canvasElement).getByRole("button", { name: "Abrir painel" }));
		const dialog = await page.findByRole("dialog");
		await expect(dialog).toHaveAccessibleName();
		await expect(dialog).toHaveAttribute("data-side", args.side);
		await expect(dialog).toHaveAttribute("data-size", args.size);
		await expect(canvasElement.ownerDocument.body.style.overflow).toBe("hidden");
		await waitFor(() => {
			const bounds = dialog.getBoundingClientRect();
			expect(bounds.left).toBeGreaterThanOrEqual(-1);
			expect(bounds.top).toBeGreaterThanOrEqual(-1);
			expect(bounds.right).toBeLessThanOrEqual(window.innerWidth + 1);
			expect(bounds.bottom).toBeLessThanOrEqual(window.innerHeight + 1);
		});
	},
} satisfies Meta<typeof Offcanvas>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Left: Story = { args: { side: "left" } };
export const Right: Story = { args: { side: "right" } };
export const Top: Story = { args: { side: "top" } };
export const Bottom: Story = { args: { side: "bottom" } };
export const Small: Story = { args: { size: "sm" } };
export const Medium: Story = { args: { size: "md" } };
export const Large: Story = { args: { size: "lg" } };
export const WithHeaderAndFooter: Story = {};
export const WithoutHeaderAndFooter: Story = {
	args: {
		"aria-label": "Detalhes",
		children: (
			<OffcanvasBody>
				<p>Painel com nome acessível sem cabeçalho.</p>
			</OffcanvasBody>
		),
	},
};
export const BackdropDisabled: Story = { args: { closeOnOverlayClick: false } };
export const Light: Story = { globals: { theme: "light" } };
export const Dark: Story = { globals: { theme: "dark" } };
export const LongContent: Story = {
	args: {
		children: (
			<>
				<OffcanvasHeader>
					<OffcanvasTitle>Relatório</OffcanvasTitle>
				</OffcanvasHeader>
				<OffcanvasBody>
					{Array.from({ length: 40 }, (_, i) => (
						<p key={i}>Seção {i + 1}: conteúdo extenso para verificar a rolagem interna.</p>
					))}
				</OffcanvasBody>
				<OffcanvasFooter>
					<Button>Exportar</Button>
				</OffcanvasFooter>
			</>
		),
	},
};
export const WithForm: Story = {
	args: {
		children: (
			<>
				<OffcanvasHeader>
					<OffcanvasTitle>Perfil</OffcanvasTitle>
				</OffcanvasHeader>
				<OffcanvasBody>
					<form id="offcanvas-profile" onSubmit={(event) => event.preventDefault()}>
						<Input label="Nome" required />
						<Input label="E-mail" type="email" required />
					</form>
				</OffcanvasBody>
				<OffcanvasFooter>
					<Button type="submit" form="offcanvas-profile">
						Salvar perfil
					</Button>
				</OffcanvasFooter>
			</>
		),
	},
};

export const Keyboard: Story = {
	play: async ({ canvasElement, args }) => {
		const page = within(canvasElement.ownerDocument.body);
		const trigger = within(canvasElement).getByRole("button", { name: "Abrir painel" });
		await userEvent.click(trigger);
		const dialog = await page.findByRole("dialog", { name: "Configurações" });
		await expect(dialog).toHaveAttribute("aria-modal", "true");
		await expect(within(dialog).getByRole("button", { name: "Fechar painel" })).toHaveFocus();
		await userEvent.tab();
		await expect(within(dialog).getByRole("button", { name: "Salvar" })).toHaveFocus();
		// Browsers may focus browser chrome at the boundary; outside document controls remain inert.
		await userEvent.tab();
		await expect(trigger).not.toHaveFocus();
		trigger.focus();
		await expect(trigger).not.toHaveFocus();
		within(dialog).getByRole("button", { name: "Fechar painel" }).focus();
		await userEvent.tab({ shift: true });
		await expect(trigger).not.toHaveFocus();
		within(dialog).getByRole("button", { name: "Fechar painel" }).focus();
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
		await expect(trigger).toHaveFocus();
		await expect(args.onOpenChange).toHaveBeenCalledWith(false);
	},
};
