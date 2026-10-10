import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusIndicator } from "./StatusIndicator";

describe("StatusIndicator", () => {
	it("pairs the color cue with readable text", () => {
		render(<StatusIndicator status="success" label="Concluído" />);

		const indicator = screen.getByText("Concluído").parentElement;
		expect(indicator).toHaveAttribute("data-status", "success");
		expect(indicator?.querySelector('[aria-hidden="true"]')).toHaveClass(
			"bg-[var(--ds-color-success)]",
		);
	});

	it("names a dot-only indicator for assistive technology", () => {
		render(<StatusIndicator status="warning" label="Atenção" showLabel={false} size="sm" />);

		const indicator = screen.getByRole("img", { name: "Atenção" });
		expect(indicator).not.toHaveTextContent("Atenção");
		expect(indicator.querySelector('[aria-hidden="true"]')).toHaveClass("size-2");
	});

	it("accepts native span attributes without changing the status token", () => {
		render(<StatusIndicator status="error" label="Erro" className="custom-status" title="Falha" />);

		const indicator = screen.getByText("Erro").parentElement;
		expect(indicator).toHaveClass("custom-status");
		expect(indicator).toHaveAttribute("title", "Falha");
		expect(indicator?.querySelector('[aria-hidden="true"]')).toHaveClass(
			"bg-[var(--ds-color-error)]",
		);
	});
});
