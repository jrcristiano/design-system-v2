import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
	it("renders file name, message, and percentage while in progress", () => {
		render(
			<ProgressBar
				progress={64.4}
				variant="primary"
				status="in-progress"
				fileName="Lista_Presenca_7ano_EF.xlsx"
				message="Enviando arquivo..."
			/>,
		);

		expect(screen.getByText("Lista_Presenca_7ano_EF.xlsx")).toBeInTheDocument();
		expect(screen.getByText("Enviando arquivo...")).toBeInTheDocument();
		expect(screen.getByText("64%")).toBeInTheDocument();
		expect(screen.getByTestId("progressbar-icon")).toBeInTheDocument();
		const progressbar = screen.getByRole("progressbar", { name: "Lista_Presenca_7ano_EF.xlsx" });
		expect(progressbar).toHaveAttribute("aria-valuemin", "0");
		expect(progressbar).toHaveAttribute("aria-valuemax", "100");
		expect(progressbar).toHaveAttribute("aria-valuenow", "64.4");
	});

	it("provides a fallback name for unnamed progress", () => {
		render(<ProgressBar progress={25} ariaLabel="Import progress" />);
		expect(screen.getByRole("progressbar", { name: "Import progress" })).toHaveAttribute(
			"aria-valuenow",
			"25",
		);
	});

	it("shows default status labels when message is not provided", () => {
		const { rerender } = render(<ProgressBar progress={100} status="success" />);
		expect(screen.getByText("Sucesso")).toBeInTheDocument();

		rerender(<ProgressBar progress={100} status="error" />);
		expect(screen.getByText("Erro")).toBeInTheDocument();
	});

	it("renders a custom icon when provided", () => {
		render(
			<ProgressBar
				progress={50}
				status="success"
				fileName="documento.pdf"
				icon={<span data-testid="custom-icon" />}
			/>,
		);

		expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
	});

	it("clamps progress to 100%", () => {
		render(<ProgressBar progress={140} status="in-progress" />);
		expect(screen.getByText("100%")).toBeInTheDocument();
		expect(screen.getByTestId("progressbar-fill")).toHaveStyle({ width: "100%" });
	});
});
