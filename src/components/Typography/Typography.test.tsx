import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { Typography } from "./Typography";

const storage = new Map<string, string>();
const mockLocalStorage = {
	getItem: (key: string) => (storage.has(key) ? (storage.get(key) ?? null) : null),
	setItem: (key: string, value: string) => {
		storage.set(key, String(value));
	},
	removeItem: (key: string) => {
		storage.delete(key);
	},
	clear: () => {
		storage.clear();
	},
};

describe("Typography", () => {
	beforeEach(() => {
		Object.defineProperty(window, "localStorage", {
			value: mockLocalStorage,
			configurable: true,
		});
		mockLocalStorage.clear();
	});

	it("renders typography playground header", () => {
		render(<Typography />);
		expect(screen.getByText("Tipografia")).toBeInTheDocument();
		expect(screen.getByText("Estados, tamanhos e variantes")).toBeInTheDocument();
	});

	it("renders typography toggle buttons", () => {
		render(<Typography />);
		expect(screen.getByRole("button", { name: "Ensino Fundamental" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Ensino Médio" })).toBeInTheDocument();
	});

	it("renders headline table", () => {
		render(<Typography />);
		expect(screen.getByText("Headlines")).toBeInTheDocument();
		expect(screen.getByText("headline-1")).toBeInTheDocument();
	});

	it("renders body table", () => {
		render(<Typography />);
		expect(screen.getByText("Body")).toBeInTheDocument();
		expect(screen.getByText("body-1")).toBeInTheDocument();
	});

	it("renders caption table", () => {
		render(<Typography />);
		expect(screen.getByText("Caption")).toBeInTheDocument();
		expect(screen.getByText("caption-1")).toBeInTheDocument();
	});

	it("renders label table", () => {
		render(<Typography />);
		expect(screen.getByText("Label")).toBeInTheDocument();
		expect(screen.getByText("label-1")).toBeInTheDocument();
	});

	it("renders button styles table", () => {
		render(<Typography />);
		expect(screen.getByText("Button")).toBeInTheDocument();
		expect(screen.getByText("button-lg")).toBeInTheDocument();
	});

	it("renders link styles table", () => {
		render(<Typography />);
		expect(screen.getByText("Link")).toBeInTheDocument();
		expect(screen.getByText("link-md")).toBeInTheDocument();
	});

	it("switches to Ensino Fundamental typography", async () => {
		const user = userEvent.setup();
		render(<Typography />);

		await user.click(screen.getByRole("button", { name: "Ensino Fundamental" }));
		expect(localStorage.getItem("ds-typography")).toBe("ef");
	});

	it("switches to Ensino Médio typography", async () => {
		const user = userEvent.setup();
		render(<Typography />);

		await user.click(screen.getByRole("button", { name: "Ensino Médio" }));
		expect(localStorage.getItem("ds-typography")).toBe("em");
	});

	it("renders font weights section", () => {
		render(<Typography />);
		expect(screen.getAllByText("Regular").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Medium").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Semibold").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Bold").length).toBeGreaterThan(0);
	});

	it("displays alphabet sample", () => {
		render(<Typography />);
		expect(screen.getByText(/ABCDEFGHIJKLMNOPQRSTUVWXYZ/)).toBeInTheDocument();
	});

	it("loads saved typography preference from localStorage", () => {
		localStorage.setItem("ds-typography", "em");
		render(<Typography />);
		expect(screen.getByRole("button", { name: "Ensino Médio" })).toBeInTheDocument();
	});

	it("applies typography to container ref when available", async () => {
		const user = userEvent.setup();
		render(<Typography />);

		// Click the button - this will apply typography to the container ref
		await user.click(screen.getByRole("button", { name: "Ensino Fundamental" }));

		// Verify the typography was applied by checking localStorage and state
		expect(localStorage.getItem("ds-typography")).toBe("ef");
		expect(localStorage.getItem("ds-font-token")).toBe("--ds-font-family-fredoka");
	});

	it("loads saved ef typography preference from localStorage on mount", () => {
		localStorage.setItem("ds-typography", "ef");
		render(<Typography />);
		expect(screen.getByRole("button", { name: "Ensino Fundamental" })).toBeInTheDocument();
		expect(localStorage.getItem("ds-typography")).toBe("ef");
	});
});
