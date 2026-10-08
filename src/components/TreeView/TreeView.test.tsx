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

		// click expand button for Node 1
		const expandButtons = screen.getAllByRole("button", { name: /Expandir|Recolher/i });
		// find first visible expand button (for node with children)
		const btn =
			expandButtons.find((b) => b.getAttribute("aria-label")?.includes("Expand")) ||
			expandButtons[0];
		fireEvent.click(btn);
		expect(onExpandChange).toHaveBeenCalled();

		// click Node 2 to select
		fireEvent.click(screen.getByText("Node 2"));
		expect(onSelectionChange).toHaveBeenCalled();
	});
});
