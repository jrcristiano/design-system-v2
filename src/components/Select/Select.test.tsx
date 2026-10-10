import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

describe("Select", () => {
	it("associates its label with the native select", () => {
		render(
			<Select label="Status">
				<option value="active">Ativo</option>
			</Select>,
		);

		expect(screen.getByLabelText("Status")).toHaveValue("active");
	});

	it("exposes required and validation message to assistive technology", () => {
		render(
			<Select
				label="Status"
				required
				state="error"
				message="Escolha um status"
				aria-describedby="hint"
			>
				<option value="">Selecione</option>
			</Select>,
		);

		const select = screen.getByLabelText(/Status/);
		expect(select).toBeRequired();
		expect(select).toHaveAttribute("aria-required", "true");
		expect(select).toHaveAttribute("aria-invalid", "true");
		expect(select).toHaveAttribute("aria-errormessage");
		expect(select.getAttribute("aria-describedby")).toContain("hint");
		expect(select.getAttribute("aria-describedby")).toContain(
			screen.getByText("Escolha um status").id,
		);
	});

	it("updates an uncontrolled value through native change events", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Select label="Status" defaultValue="draft" onChange={onChange}>
				<option value="draft">Rascunho</option>
				<option value="published">Publicado</option>
			</Select>,
		);

		const select = screen.getByLabelText("Status");
		await user.selectOptions(select, "published");

		expect(select).toHaveValue("published");
		expect(onChange).toHaveBeenCalledOnce();
	});

	it("preserves a controlled value until the consumer changes it", () => {
		const onChange = vi.fn();
		render(
			<Select label="Status" value="draft" onChange={onChange}>
				<option value="draft">Rascunho</option>
				<option value="published">Publicado</option>
			</Select>,
		);

		const select = screen.getByLabelText("Status");
		fireEvent.change(select, { target: { value: "published" } });

		expect(onChange).toHaveBeenCalledOnce();
		expect(select).toHaveValue("draft");
	});

	it("disables the select and its icon actions", async () => {
		const user = userEvent.setup();
		const onIconRightClick = vi.fn();
		render(
			<Select
				label="Status"
				disabled
				iconRight={<span>More</span>}
				onIconRightClick={onIconRightClick}
			>
				<option value="active">Ativo</option>
			</Select>,
		);

		expect(screen.getByLabelText("Status")).toBeDisabled();
		const iconAction = screen.getByRole("button", { name: "Ação ao lado do seletor" });
		expect(iconAction).toBeDisabled();
		await user.click(iconAction);
		expect(onIconRightClick).not.toHaveBeenCalled();
	});
});
