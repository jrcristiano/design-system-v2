import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SampleCard } from "./SampleCard";
import styles from "./SampleCard.module.css";

const IconStub = ({ className }: { className?: string }) => (
	<svg data-testid="icon-stub" className={className} />
);

describe("SampleCard", () => {
	it("renders title, subtitle and primary action by default", () => {
		render(<SampleCard title="Card title" subtitle="Card subtitle" />);

		expect(screen.getByText("Card title")).toBeInTheDocument();
		expect(screen.getByText("Card subtitle")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Primary action" })).toBeInTheDocument();
	});

	it("hides subtitle when subtitle has zero characters", () => {
		render(<SampleCard title="Card title" subtitle="" />);

		expect(screen.queryByText("Card subtitle")).not.toBeInTheDocument();
	});

	it("renders tags when provided", () => {
		render(
			<SampleCard
				title="Card title"
				subtitle="Card subtitle"
				tags={[
					{ label: "Tag A", variant: "primary" },
					{ label: "Tag B", variant: "success" },
				]}
			/>,
		);

		expect(screen.getByRole("button", { name: "Tag A" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Tag B" })).toBeInTheDocument();
	});

	it("renders secondary action together with primary action when label is provided", async () => {
		const user = userEvent.setup();
		const onPrimaryAction = vi.fn();
		const onSecondaryAction = vi.fn();

		render(
			<SampleCard
				title="Card title"
				subtitle="Card subtitle"
				primaryActionLabel="Primary"
				secondaryActionLabel="Secondary"
				onPrimaryAction={onPrimaryAction}
				onSecondaryAction={onSecondaryAction}
				secondaryActionIcon={IconStub}
			/>,
		);

		await user.click(screen.getByRole("button", { name: "Primary" }));
		await user.click(screen.getByRole("button", { name: "Secondary" }));

		expect(onPrimaryAction).toHaveBeenCalledTimes(1);
		expect(onSecondaryAction).toHaveBeenCalledTimes(1);
	});

	it("renders and triggers action callback", async () => {
		const user = userEvent.setup();
		const onActionClick = vi.fn();

		render(
			<SampleCard
				title="Card title"
				subtitle="Card subtitle"
				actionIcon={IconStub}
				onActionClick={onActionClick}
				actionAriaLabel="Card action"
			/>,
		);

		await user.click(screen.getByRole("button", { name: "Card action" }));
		expect(onActionClick).toHaveBeenCalledTimes(1);
	});

	it("titleOnly forces horizontal layout and circle image", () => {
		const { container } = render(
			<SampleCard
				title="Only title"
				subtitle="Hidden subtitle"
				titleOnly
				layout="vertical"
				imageVariant="square"
				tags={[{ label: "Should hide" }]}
			/>,
		);

		expect(screen.queryByText("Hidden subtitle")).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Should hide" })).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Primary action" })).not.toBeInTheDocument();

		const image = screen.getByAltText("Only title");
		expect(image).toHaveClass(styles.imageCircle);
		expect(container.firstElementChild).toHaveClass(styles.cardHorizontal);
	});

	it("applies circle image only when layout is horizontal", () => {
		const { rerender } = render(
			<SampleCard
				title="Card title"
				subtitle="Card subtitle"
				layout="vertical"
				imageVariant="circle"
			/>,
		);

		expect(screen.getByAltText("Card title")).not.toHaveClass(styles.imageCircle);

		rerender(
			<SampleCard
				title="Card title"
				subtitle="Card subtitle"
				layout="horizontal"
				imageVariant="circle"
			/>,
		);

		expect(screen.getByAltText("Card title")).toHaveClass(styles.imageCircle);
	});
});
