import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TreeViewItem } from "./TreeViewItem";
import { TreeViewContext } from "./TreeViewContext";
import type { TreeViewContextValue, TreeViewItemProps } from "./TreeView.type";

const mockToggleExpanded = vi.fn();
const mockToggleSelected = vi.fn();
const mockSelectMultiple = vi.fn();

const defaultContext: TreeViewContextValue = {
	expandedIds: new Set<string>(),
	selectedIds: new Set<string>(),
	toggleExpanded: mockToggleExpanded,
	toggleSelected: mockToggleSelected,
	selectMultiple: mockSelectMultiple,
	withCheckbox: false,
	multiSelect: false,
};

const mockNode = {
	id: "node-1",
	label: "Nó Pai",
	children: [{ id: "child-1", label: "Nó Filho" }],
};

const renderWithContext = (
	props: TreeViewItemProps,
	contextValue: Partial<TreeViewContextValue> = {},
) => {
	return render(
		<TreeViewContext.Provider value={{ ...defaultContext, ...contextValue }}>
			<ul role="tree">
				<TreeViewItem {...props} />
			</ul>
		</TreeViewContext.Provider>,
	);
};

describe("TreeViewItem", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("deve renderizar o label e aplicar atributos de acessibilidade", () => {
		renderWithContext({ node: mockNode });

		const treeItem = screen.getByRole("treeitem");
		expect(treeItem).toBeInTheDocument();
		expect(treeItem).toHaveAttribute("aria-selected", "false");
		expect(screen.getByText("Nó Pai")).toBeInTheDocument();
	});

	it("deve renderizar filhos dentro de um <ul> quando estiver expandido", () => {
		const { container } = renderWithContext(
			{ node: mockNode },
			{ expandedIds: new Set(["node-1"]) },
		);

		expect(screen.getByText("Nó Filho")).toBeInTheDocument();

		const nestedList = container.querySelector("ul ul");
		expect(nestedList).toBeInTheDocument();
	});

	it("deve chamar selectMultiple ao clicar quando checkbox estiver ativo", () => {
		renderWithContext({ node: mockNode }, { withCheckbox: true });

		fireEvent.click(screen.getByRole("treeitem"));
		expect(mockSelectMultiple).toHaveBeenCalledWith("node-1", true);
	});

	it("deve expandir o item ao usar ArrowRight no teclado", () => {
		renderWithContext({ node: mockNode });

		const treeItem = screen.getByRole("treeitem");
		fireEvent.keyDown(treeItem, { key: "ArrowRight" });

		expect(mockToggleExpanded).toHaveBeenCalledWith("node-1");
	});

	it("deve navegar usando globalThis.location quando href estiver definido", () => {
		const locationStub = { href: "" };
		vi.stubGlobal("location", locationStub);

		renderWithContext({ node: { ...mockNode, href: "/dashboard" } });
		fireEvent.click(screen.getByRole("treeitem"));

		expect(globalThis.location.href).toBe("/dashboard");

		vi.unstubAllGlobals();
	});
});
