import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
	it("renders successfully", () => {
		const { container } = render(<Skeleton />);
		expect(container.firstChild).toBeInTheDocument();
	});

	it("applies line variant by default", () => {
		const { container } = render(<Skeleton />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveClass("rounded-[12px]");
		expect(skeleton).toHaveClass("h-4");
	});

	it("applies circle variant correctly", () => {
		const { container } = render(<Skeleton variant="circle" />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveClass("rounded-full");
		expect(skeleton).toHaveClass("aspect-square");
	});

	it("applies rectangle variant correctly", () => {
		const { container } = render(<Skeleton variant="rectangle" />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveClass("rounded-[12px]");
	});

	it("applies shimmer animation by default", () => {
		const { container } = render(<Skeleton />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton.className).toContain("before:animate-[shimmer");
	});

	it("applies pulse animation correctly", () => {
		const { container } = render(<Skeleton animation="pulse" />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveClass("animate-pulse");
	});

	it("applies no animation when animation is none", () => {
		const { container } = render(<Skeleton animation="none" />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).not.toHaveClass("animate-pulse");
		expect(skeleton.className).not.toContain("before:animate");
	});

	it("applies custom width as number", () => {
		const { container } = render(<Skeleton width={200} />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveStyle({ width: "200px" });
	});

	it("applies custom width as string", () => {
		const { container } = render(<Skeleton width="50%" />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveStyle({ width: "50%" });
	});

	it("applies custom height as number", () => {
		const { container } = render(<Skeleton height={100} />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveStyle({ height: "100px" });
	});

	it("applies custom height as string", () => {
		const { container } = render(<Skeleton height="2rem" />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveStyle({ height: "2rem" });
	});

	it("applies custom className", () => {
		const { container } = render(<Skeleton className="custom-class" />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveClass("custom-class");
	});

	it("renders multiple lines when lines prop is provided", () => {
		const { container } = render(<Skeleton lines={3} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper.children).toHaveLength(3);
	});

	it("renders last line with 80% width when lines > 1 and no width specified", () => {
		const { container } = render(<Skeleton lines={2} />);
		const wrapper = container.firstChild as HTMLElement;
		const lastLine = wrapper.children[1] as HTMLElement;
		expect(lastLine).toHaveStyle({ width: "80%" });
	});

	it("applies custom gap between lines", () => {
		const { container } = render(<Skeleton lines={3} gap="1rem" />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveStyle({ gap: "1rem" });
	});

	it("applies width to all lines when specified with multiple lines", () => {
		const { container } = render(<Skeleton lines={3} width="100%" />);
		const wrapper = container.firstChild as HTMLElement;
		const firstLine = wrapper.children[0] as HTMLElement;
		const lastLine = wrapper.children[2] as HTMLElement;
		expect(firstLine).toHaveStyle({ width: "100%" });
		expect(lastLine).toHaveStyle({ width: "100%" });
	});

	it("forwards additional HTML attributes", () => {
		const { container } = render(<Skeleton data-testid="skeleton-test" />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveAttribute("data-testid", "skeleton-test");
	});

	it("merges custom styles with dimension styles", () => {
		const { container } = render(<Skeleton width={150} height={50} style={{ margin: "10px" }} />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveStyle({
			width: "150px",
			height: "50px",
			margin: "10px",
		});
	});

	// Testes de Acessibilidade
	it("renders as semantic <output> element for better accessibility", () => {
		const { container } = render(<Skeleton />);
		const skeleton = container.firstChild as HTMLElement;
		// Verifica que é um elemento <output> (semântico)
		expect(skeleton.tagName).toBe("OUTPUT");
		expect(skeleton).toHaveAttribute("aria-live", "polite");
		expect(skeleton).toHaveAttribute("aria-label", "Carregando...");
	});

	it("accepts custom aria-label", () => {
		const { container } = render(<Skeleton ariaLabel="Carregando dados do usuário" />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveAttribute("aria-label", "Carregando dados do usuário");
	});

	it("renders multiple lines wrapper as <output> element", () => {
		const { container } = render(<Skeleton lines={2} />);
		const wrapper = container.firstChild as HTMLElement;
		// Verifica que o wrapper também é um <output>
		expect(wrapper.tagName).toBe("OUTPUT");
		expect(wrapper).toHaveAttribute("aria-live", "polite");
		expect(wrapper).toHaveAttribute("aria-label", "Carregando...");
		// Linhas individuais devem ter aria-hidden
		const firstLine = wrapper.children[0] as HTMLElement;
		expect(firstLine).toHaveAttribute("aria-hidden", "true");
	});

	// Testes de Cores (Design System)
	it("uses correct loading color from design system", () => {
		const { container } = render(<Skeleton />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveClass("bg-[var(--ds-color-neutral-40)]");
	});
});
