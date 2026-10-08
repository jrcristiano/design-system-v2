import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PlusIcon } from "@phosphor-icons/react";
import { Fab } from "./Fab";

describe("Fab", () => {
	it("renders with icon and default floating position", () => {
		render(<Fab icon={PlusIcon} aria-label="Adicionar" />);
		const button = screen.getByRole("button", { name: /adicionar/i });
		expect(button).toHaveClass("!fixed");
		expect(button).toHaveClass("rounded-full");
	});
});
