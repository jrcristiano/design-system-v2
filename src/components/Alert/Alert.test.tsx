import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Alert } from "./Alert";
import type { AlertVariant } from "./alert.types";
import { CheckCircleIcon } from "@phosphor-icons/react";

describe("Alert component", () => {
	const variants: AlertVariant[] = ["success", "warning", "error", "info"];

	it("renders title and message", () => {
		render(<Alert variant="success" title="Success title" message="Success message" />);

		expect(screen.getByText("Success title")).toBeInTheDocument();
		expect(screen.getByText("Success message")).toBeInTheDocument();
	});

	it("renders without message when message is not provided", () => {
		render(<Alert variant="info" title="Only title" />);

		expect(screen.getByText("Only title")).toBeInTheDocument();
	});

	it("renders correct role per variant", () => {
		variants.forEach((variant) => {
			const { unmount } = render(<Alert variant={variant} title={`Alert ${variant}`} />);

			expect(screen.getByRole(variant === "error" ? "alert" : "status")).toBeInTheDocument();

			unmount();
		});
	});

	it("renders custom icon when provided", () => {
		render(
			<Alert
				variant="success"
				title="Custom icon"
				icon={<CheckCircleIcon data-testid="custom-icon" />}
			/>,
		);

		expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
	});

	it("does not render icon when icon is null", () => {
		render(<Alert variant="warning" title="No icon" icon={null} />);

		expect(screen.queryByTestId("custom-icon")).not.toBeInTheDocument();
	});

	it("calls onDismiss when clicking dismiss button", async () => {
		const user = userEvent.setup();
		const onDismiss = vi.fn();

		render(<Alert variant="info" title="Dismissible" dismissible onDismiss={onDismiss} />);

		await user.click(screen.getByRole("button", { name: /fechar alerta/i }));

		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it("calls onDismiss with keyboard interaction", async () => {
		const user = userEvent.setup();
		const onDismiss = vi.fn();

		render(<Alert variant="info" title="Dismissible" dismissible onDismiss={onDismiss} />);

		const button = screen.getByRole("button", {
			name: /fechar alerta/i,
		});

		button.focus();
		await user.keyboard("{Enter}");

		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it("renders action and triggers onClick", async () => {
		const user = userEvent.setup();
		const onAction = vi.fn();

		render(
			<Alert
				variant="success"
				title="With action"
				action={{
					label: "Retry",
					onClick: onAction,
				}}
			/>,
		);

		await user.click(screen.getByText("Retry"));

		expect(onAction).toHaveBeenCalledTimes(1);
	});

	it("supports keyboard activation on action", async () => {
		const user = userEvent.setup();
		const onAction = vi.fn();

		render(
			<Alert
				variant="success"
				title="Keyboard action"
				action={{
					label: "Retry",
					onClick: onAction,
				}}
			/>,
		);

		const action = screen.getByText("Retry");
		action.focus();

		await user.keyboard(" ");

		expect(onAction).toHaveBeenCalledTimes(1);
	});

	it("uses polite aria-live for non-error variants", () => {
		render(<Alert variant="info" title="Info alert" />);

		expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
	});
});
