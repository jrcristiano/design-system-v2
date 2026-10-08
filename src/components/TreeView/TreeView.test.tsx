import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TreeView } from "./TreeView";

const sampleData = [
	{
		id: "n1",
		label: "Node 1",
		children: [{ id: "n1-1", label: "Child 1" }],
	},
	{ id: "n2", label: "Node 2" },
];

describe("TreeView", () => {
	beforeEach(() => vi.clearAllMocks());

	it("renders nodes and uses default expanded/selected ids", () => {
		render(<TreeView data={sampleData} defaultExpandedIds={["n1"]} defaultSelectedIds={["n2"]} />);

		expect(screen.getByRole("tree")).toBeInTheDocument();
		// Child should be visible due to defaultExpandedIds
		expect(screen.getByText("Child 1")).toBeInTheDocument();
		// Node 2 should appear and be selectable
		expect(screen.getByText("Node 2")).toBeInTheDocument();
	});

	it("calls callbacks on selection and expand change", () => {
		const onSelectionChange = vi.fn();
		const onExpandChange = vi.fn();
		render(
			<TreeView
				data={sampleData}
				onSelectionChange={onSelectionChange}
				onExpandChange={onExpandChange}
			/>,
		);

		// Expand from the roving tree item using the recommended arrow key.
		const firstNode = screen.getByText("Node 1").closest('[role="treeitem"]');
		if (!firstNode) throw new Error("Expected the first tree item");
		fireEvent.keyDown(firstNode, { key: "ArrowRight" });
		expect(onExpandChange).toHaveBeenCalled();

		// click Node 2 to select
		fireEvent.click(screen.getByText("Node 2"));
		expect(onSelectionChange).toHaveBeenCalled();
	});

	it("exposes groups and keeps one enabled item in the tab order", () => {
		render(<TreeView data={sampleData} defaultExpandedIds={["n1"]} />);
		const tree = screen.getByRole("tree");
		const items = screen.getAllByRole("treeitem");

		expect(tree.tagName).toBe("UL");
		expect(tree).not.toHaveAttribute("aria-multiselectable", "true");
		expect(items[0]).toHaveAttribute("aria-level", "1");
		expect(items[1]).toHaveAttribute("aria-level", "2");
		expect(tree.querySelector('[role="group"]')).toContainElement(items[1]);
		expect(items.filter((item) => item.getAttribute("tabindex") === "0")).toHaveLength(1);
	});

	it("moves roving focus through visible items with arrow keys", () => {
		render(<TreeView data={sampleData} defaultExpandedIds={["n1"]} />);
		const [parent, child, sibling] = screen.getAllByRole("treeitem");

		parent.focus();
		fireEvent.keyDown(parent, { key: "ArrowRight" });
		expect(child).toHaveFocus();
		fireEvent.keyDown(child, { key: "ArrowDown" });
		expect(sibling).toHaveFocus();
		fireEvent.keyDown(sibling, { key: "Home" });
		expect(parent).toHaveFocus();
	});
});
