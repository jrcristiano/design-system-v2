import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Card } from "./Card";
import { BookOpenIcon } from "@phosphor-icons/react";

describe("Card", () => {
	describe("Simple variant", () => {
		it("renders with title and label", () => {
			render(<Card variant="simple" title="Test Title" label="Test Label" />);

			expect(screen.getByRole("heading", { name: "Test Title" })).toBeInTheDocument();
			expect(screen.getByText("Test Label")).toBeInTheDocument();
		});

		it("renders with left border by default", () => {
			const { container } = render(<Card variant="simple" title="Title" label="Label" />);
			const card = container.firstChild as HTMLElement;

			expect(card).toHaveClass("card-simple-root", "card-simple-root--with-left-border");
		});

		it("hides left border when showLeftBorder is false", () => {
			const { container } = render(
				<Card variant="simple" title="Title" label="Label" showLeftBorder={false} />,
			);
			const card = container.firstChild as HTMLElement;

			expect(card).toHaveClass("card-simple-root");
			expect(card).not.toHaveClass("card-simple-root--with-left-border");
		});

		it("applies custom left border color", () => {
			const { container } = render(
				<Card variant="simple" title="Title" label="Label" leftBorderColor="#FF0000" />,
			);
			const card = container.firstChild as HTMLElement;

			expect(card).toHaveClass("card-simple-root--with-left-border");
			expect(card.style.getPropertyValue("--card-left-border-color")).toBe("#FF0000");
		});

		it("applies custom className", () => {
			const { container } = render(
				<Card variant="simple" title="Title" label="Label" className="custom-card" />,
			);
			const card = container.firstChild as HTMLElement;

			expect(card).toHaveClass("custom-card");
		});

		it("has proper shadow and border radius", () => {
			const { container } = render(<Card variant="simple" title="Title" label="Label" />);
			const card = container.firstChild as HTMLElement;

			expect(card).toHaveClass("card-simple-root");
		});

		it("renders with chipLabel when provided", () => {
			render(<Card variant="simple" title="Title with Chip" label="Label" chipLabel="Active" />);

			expect(screen.getByRole("heading", { name: "Title with Chip" })).toBeInTheDocument();
			expect(screen.getByText("Active")).toBeInTheDocument();
			expect(screen.getByText("Label")).toBeInTheDocument();
		});
	});

	describe("Type1 variant", () => {
		it("renders with all required props", () => {
			render(
				<Card
					variant="type1"
					title="Type1 Title"
					chipLabel="Active"
					subtitle="Subtitle"
					progress={75}
					primaryButtonText="View Details"
				/>,
			);

			expect(screen.getByRole("heading", { name: "Type1 Title" })).toBeInTheDocument();
			expect(screen.getByText("Active")).toBeInTheDocument();
			expect(screen.getByText("Subtitle")).toBeInTheDocument();
			expect(screen.getAllByText("75%").length).toBeGreaterThan(0);
			expect(screen.getByRole("button", { name: "View Details" })).toBeInTheDocument();
		});

		it("renders with progress icon", () => {
			const { container } = render(
				<Card
					variant="type1"
					title="Title"
					chipLabel="Active"
					subtitle="Subtitle"
					progress={50}
					primaryButtonText="Button"
					progressIcon={BookOpenIcon}
				/>,
			);

			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("calls onPrimaryButtonClick when button is clicked", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			render(
				<Card
					variant="type1"
					title="Title"
					chipLabel="Active"
					subtitle="Subtitle"
					progress={50}
					primaryButtonText="Click Me"
					onPrimaryButtonClick={handleClick}
				/>,
			);

			const button = screen.getByRole("button", { name: "Click Me" });
			await user.click(button);

			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("has outline border styling", () => {
			const { container } = render(
				<Card
					variant="type1"
					title="Title"
					chipLabel="Active"
					subtitle="Subtitle"
					progress={50}
					primaryButtonText="Button"
				/>,
			);
			const card = container.firstChild as HTMLElement;

			expect(card).toHaveClass("card-complex-root");
		});
	});

	describe("Type2 variant", () => {
		it("renders with two buttons", () => {
			render(
				<Card
					variant="type2"
					title="Type2 Title"
					chipLabel="Active"
					subtitle="Subtitle"
					progress={80}
					primaryButtonText="Primary"
					secondaryButtonText="Secondary"
				/>,
			);

			expect(screen.getByRole("button", { name: "Primary" })).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "Secondary" })).toBeInTheDocument();
		});

		it("calls onSecondaryButtonClick when secondary button is clicked", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			render(
				<Card
					variant="type2"
					title="Title"
					chipLabel="Active"
					subtitle="Subtitle"
					progress={50}
					primaryButtonText="Primary"
					secondaryButtonText="Secondary"
					onSecondaryButtonClick={handleClick}
				/>,
			);

			const button = screen.getByRole("button", { name: "Secondary" });
			await user.click(button);

			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("renders all type2 content correctly", () => {
			render(
				<Card
					variant="type2"
					title="Course Title"
					chipLabel="In Progress"
					subtitle="Module 1"
					progress={45}
					primaryButtonText="View Class"
					secondaryButtonText="At Risk Students"
				/>,
			);

			expect(screen.getByRole("heading", { name: "Course Title" })).toBeInTheDocument();
			expect(screen.getByText("In Progress")).toBeInTheDocument();
			expect(screen.getByText("Module 1")).toBeInTheDocument();
			expect(screen.getAllByText("45%").length).toBeGreaterThan(0);
			expect(screen.getByRole("button", { name: "View Class" })).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "At Risk Students" })).toBeInTheDocument();
		});
	});

	describe("Accessibility", () => {
		it("renders as article with proper ARIA attributes", () => {
			render(<Card variant="simple" title="Accessible Title" label="Accessible Label" />);

			const article = screen.getByRole("article");
			expect(article).toBeInTheDocument();
			const titleId = article.getAttribute("aria-labelledby");
			expect(titleId).toBeTruthy();
			expect(document.getElementById(titleId!)).toHaveTextContent("Accessible Title");
		});

		it("renders complex card as article", () => {
			render(
				<Card
					variant="type1"
					title="Title"
					chipLabel="Active"
					subtitle="Subtitle"
					progress={50}
					primaryButtonText="Button"
				/>,
			);

			const article = screen.getByRole("article");
			expect(article).toBeInTheDocument();
			const titleId = article.getAttribute("aria-labelledby");
			expect(titleId).toBeTruthy();
			expect(document.getElementById(titleId!)).toHaveTextContent("Title");
		});

		it("uses unique title IDs for multiple cards", () => {
			render(
				<>
					<Card variant="simple" title="First" label="First label" />
					<Card variant="simple" title="Second" label="Second label" />
					<Card
						variant="type1"
						title="Third"
						chipLabel="Active"
						subtitle="Subtitle"
						progress={50}
						primaryButtonText="Open"
					/>
				</>,
			);

			const articles = screen.getAllByRole("article");
			const labelledBy = articles.map((article) => article.getAttribute("aria-labelledby"));
			expect(new Set(labelledBy).size).toBe(articles.length);
			articles.forEach((article) => {
				expect(
					document.getElementById(article.getAttribute("aria-labelledby")!),
				).toBeInTheDocument();
			});
		});
	});

	describe("Backwards compatibility", () => {
		it("renders simple card without variant prop", () => {
			render(<Card title="Title" label="Label" />);

			expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
			expect(screen.getByText("Label")).toBeInTheDocument();
		});
	});
});
