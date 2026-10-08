import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Chip } from "./Chip";

describe("Chip", () => {
	it("renders with children text", () => {
		render(<Chip>Label</Chip>);
		expect(screen.getByText("Label")).toBeInTheDocument();
	});

	it("uses pill radius by default", () => {
		render(<Chip>Pill</Chip>);
		const chip = screen.getByRole("button", { name: /pill/i });
		expect(chip).toHaveAttribute("data-pill", "true");
	});

	it("uses rounded radius when pill is false", () => {
		render(<Chip pill={false}>Rounded</Chip>);
		const chip = screen.getByRole("button", { name: /rounded/i });
		expect(chip).toHaveAttribute("data-pill", "false");
	});

	it("renders with different variants", () => {
		const { rerender } = render(<Chip variant="primary">Primary</Chip>);
		expect(screen.getByText("Primary")).toBeInTheDocument();

		rerender(<Chip variant="success">Success</Chip>);
		expect(screen.getByText("Success")).toBeInTheDocument();

		rerender(<Chip variant="danger">Danger</Chip>);
		expect(screen.getByText("Danger")).toBeInTheDocument();
	});

	it("applies outline styles", () => {
		render(
			<Chip variant="primary" state="outline">
				Outline
			</Chip>,
		);

		const chip = screen.getByRole("button", { name: /outline/i });
		expect(chip).toHaveAttribute("data-variant", "primary");
		expect(chip).toHaveAttribute("data-visual-state", "outline");
	});

	it("applies pressed styles", () => {
		render(
			<Chip variant="primary" state="pressed">
				Pressed
			</Chip>,
		);

		const chip = screen.getByRole("button", { name: /pressed/i });
		expect(chip).toHaveAttribute("data-variant", "primary");
		expect(chip).toHaveAttribute("data-visual-state", "pressed");
	});

	it("applies disabled styles", () => {
		render(<Chip disabled>Disabled</Chip>);
		const chip = screen.getByRole("button", { name: /disabled/i });
		expect(chip).toBeDisabled();
		expect(chip).toHaveAttribute("data-visual-state", "disabled");
	});

	it("renders left and right icons", () => {
		const IconLeft = () => <span data-testid="icon-left">L</span>;
		const IconRight = () => <span data-testid="icon-right">R</span>;
		render(
			<Chip iconLeft={IconLeft} iconRight={IconRight}>
				With Icons
			</Chip>,
		);
		expect(screen.getByTestId("icon-left")).toBeInTheDocument();
		expect(screen.getByTestId("icon-right")).toBeInTheDocument();
	});

	it("calls onIconLeftClick when left icon is clicked", async () => {
		const user = userEvent.setup();
		const handleIconLeftClick = vi.fn();
		const handleChipClick = vi.fn();
		const IconLeft = () => <span data-testid="icon-left">L</span>;
		render(
			<Chip iconLeft={IconLeft} onIconLeftClick={handleIconLeftClick} onClick={handleChipClick}>
				With Left Icon
			</Chip>,
		);

		await user.click(screen.getByTestId("icon-left"));
		expect(handleIconLeftClick).toHaveBeenCalledTimes(1);
		expect(handleChipClick).not.toHaveBeenCalled();
		expect(screen.getAllByRole("button")).toHaveLength(1);
		expect(screen.getByTestId("icon-left").parentElement).not.toHaveAttribute("tabindex");
	});

	it("calls onIconRightClick when right icon is clicked", async () => {
		const user = userEvent.setup();
		const handleIconRightClick = vi.fn();
		const IconRight = () => <span data-testid="icon-right">R</span>;
		render(
			<Chip iconRight={IconRight} onIconRightClick={handleIconRightClick}>
				With Right Icon
			</Chip>,
		);

		await user.click(screen.getByTestId("icon-right"));
		expect(handleIconRightClick).toHaveBeenCalled();
	});

	it("does not call icon handlers when disabled", async () => {
		const user = userEvent.setup();
		const handleIconLeftClick = vi.fn();
		const handleIconRightClick = vi.fn();
		const IconLeft = () => <span data-testid="icon-left">L</span>;
		const IconRight = () => <span data-testid="icon-right">R</span>;
		render(
			<Chip
				disabled
				iconLeft={IconLeft}
				iconRight={IconRight}
				onIconLeftClick={handleIconLeftClick}
				onIconRightClick={handleIconRightClick}
			>
				Disabled Icons
			</Chip>,
		);

		await user.click(screen.getByTestId("icon-left"));
		await user.click(screen.getByTestId("icon-right"));
		expect(handleIconLeftClick).not.toHaveBeenCalled();
		expect(handleIconRightClick).not.toHaveBeenCalled();
	});
});
