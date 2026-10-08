import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Icon } from "./Icon";

describe("Icon", () => {
	it("renders an icon by name", () => {
		render(<Icon name="House" />);
		const svg = document.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});

	it("renders with custom size", () => {
		render(<Icon name="House" size={32} />);
		const svg = document.querySelector("svg");
		expect(svg).toHaveAttribute("width", "32");
		expect(svg).toHaveAttribute("height", "32");
	});

	it("renders with custom color", () => {
		render(<Icon name="House" color="#ff0000" />);
		const svg = document.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});

	it("renders with custom weight", () => {
		render(<Icon name="House" weight="bold" />);
		const svg = document.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});

	it("applies custom className", () => {
		render(<Icon name="House" className="custom-icon" />);
		const svg = document.querySelector("svg");
		expect(svg).toHaveClass("custom-icon");
	});

	it("returns null for unknown icon name", () => {
		const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		const { container } = render(<Icon name="NonExistentIcon12345" />);
		expect(container.firstChild).toBeNull();
		expect(consoleSpy).toHaveBeenCalledWith('Ícone "NonExistentIcon12345" não encontrado');
		consoleSpy.mockRestore();
	});

	it("renders different icon names", () => {
		const { rerender } = render(<Icon name="House" />);
		expect(document.querySelector("svg")).toBeInTheDocument();

		rerender(<Icon name="User" />);
		expect(document.querySelector("svg")).toBeInTheDocument();

		rerender(<Icon name="Heart" />);
		expect(document.querySelector("svg")).toBeInTheDocument();
	});
});
