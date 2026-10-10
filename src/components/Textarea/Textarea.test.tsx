import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
	it("associates its label with the native textarea", () => {
		render(<Textarea label="Descrição" placeholder="Escreva uma descrição" />);

		expect(screen.getByLabelText("Descrição")).toHaveAttribute(
			"placeholder",
			"Escreva uma descrição",
		);
	});

	it("exposes required and validation message to assistive technology", () => {
		render(
			<Textarea
				label="Descrição"
				required
				state="error"
				message="A descrição é obrigatória"
				aria-describedby="hint"
			/>,
		);

		const textarea = screen.getByLabelText(/Descrição/);
		expect(textarea).toBeRequired();
		expect(textarea).toHaveAttribute("aria-required", "true");
		expect(textarea).toHaveAttribute("aria-invalid", "true");
		expect(textarea).toHaveAttribute("aria-errormessage");
		expect(textarea.getAttribute("aria-describedby")).toContain("hint");
		expect(textarea.getAttribute("aria-describedby")).toContain(
			screen.getByText("A descrição é obrigatória").id,
		);
	});

	it("updates an uncontrolled value through native input events", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Textarea label="Descrição" defaultValue="Inicial" onChange={onChange} />);

		const textarea = screen.getByLabelText("Descrição");
		await user.type(textarea, " atualizada");

		expect(textarea).toHaveValue("Inicial atualizada");
		expect(onChange).toHaveBeenCalled();
	});

	it("preserves a controlled value until the consumer changes it", () => {
		const onChange = vi.fn();
		render(<Textarea label="Descrição" value="Controlada" onChange={onChange} />);

		const textarea = screen.getByLabelText("Descrição");
		fireEvent.change(textarea, { target: { value: "Nova descrição" } });

		expect(onChange).toHaveBeenCalledOnce();
		expect(textarea).toHaveValue("Controlada");
	});

	it("disables the field and forwards native textarea attributes", () => {
		render(<Textarea label="Descrição" disabled rows={6} maxLength={200} />);

		const textarea = screen.getByLabelText("Descrição");
		expect(textarea).toBeDisabled();
		expect(textarea).toHaveAttribute("rows", "6");
		expect(textarea).toHaveAttribute("maxLength", "200");
	});
});
