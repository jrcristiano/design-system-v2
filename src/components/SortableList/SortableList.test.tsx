import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SortableList } from "./SortableList";
import type { ISortableItem } from "./SortableList.interface";

describe("SortableList", () => {
	const mockItems: ISortableItem<{ label: string }>[] = [
		{ id: "1", data: { label: "Item 1" } },
		{ id: "2", data: { label: "Item 2" } },
		{ id: "3", data: { label: "Item 3" } },
	];

	const mockRenderItem = (item: ISortableItem<{ label: string }>) => (
		<div data-testid={`item-${item.id}`}>{item.data.label}</div>
	);

	it("renders all items", () => {
		const onChange = vi.fn();
		render(<SortableList items={mockItems} onChange={onChange} renderItem={mockRenderItem} />);

		expect(screen.getByTestId("item-1")).toBeInTheDocument();
		expect(screen.getByTestId("item-2")).toBeInTheDocument();
		expect(screen.getByTestId("item-3")).toBeInTheDocument();
	});

	it("renders items with correct content", () => {
		const onChange = vi.fn();
		render(<SortableList items={mockItems} onChange={onChange} renderItem={mockRenderItem} />);

		expect(screen.getByText("Item 1")).toBeInTheDocument();
		expect(screen.getByText("Item 2")).toBeInTheDocument();
		expect(screen.getByText("Item 3")).toBeInTheDocument();
	});

	it("renders empty list when no items provided", () => {
		const onChange = vi.fn();
		const { container } = render(
			<SortableList items={[]} onChange={onChange} renderItem={mockRenderItem} />,
		);

		const list = container.querySelector("div");
		expect(list?.children.length).toBe(0);
	});

	it("applies custom className", () => {
		const onChange = vi.fn();
		const { container } = render(
			<SortableList
				items={mockItems}
				onChange={onChange}
				renderItem={mockRenderItem}
				className="custom-class"
			/>,
		);

		const list = container.querySelector(".custom-class");
		expect(list).toBeInTheDocument();
	});

	it("renders with custom render function", () => {
		const onChange = vi.fn();
		const customRenderItem = (item: ISortableItem<{ label: string }>) => (
			<div data-testid={`custom-${item.id}`}>
				<span>Custom: {item.data.label}</span>
			</div>
		);

		render(<SortableList items={mockItems} onChange={onChange} renderItem={customRenderItem} />);

		expect(screen.getByTestId("custom-1")).toBeInTheDocument();
		expect(screen.getByText("Custom: Item 1")).toBeInTheDocument();
	});
});
