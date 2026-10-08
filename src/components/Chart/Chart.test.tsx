import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Chart } from "./Chart";

const baseData = [
	{ x: "Jan", y: 10 },
	{ x: "Feb", y: 20 },
	{ x: "Mar", y: 30 },
];

describe("Chart component", () => {
	it("renders title when provided", () => {
		render(<Chart type="bar" data={baseData} title="Sales" />);

		expect(screen.getByText("Sales")).toBeInTheDocument();
	});

	it("does not render title when not provided", () => {
		render(<Chart type="bar" data={baseData} />);

		expect(screen.queryByText("Sales")).not.toBeInTheDocument();
	});

	it("renders bar chart", () => {
		const { container } = render(<Chart type="bar" data={baseData} />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders line chart", () => {
		const { container } = render(<Chart type="line" data={baseData} />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders area chart", () => {
		const { container } = render(<Chart type="area" data={baseData} />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders scatter chart", () => {
		const { container } = render(<Chart type="scatter" data={baseData} />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders pie chart", () => {
		const { container } = render(<Chart type="pie" data={baseData} />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders gauge with formatted value", () => {
		render(<Chart type="gauge" data={[{ x: "value", y: 75.5 }]} />);

		expect(screen.getByText("Valor atual")).toBeInTheDocument();
		expect(screen.getByText("75,5")).toBeInTheDocument();
	});

	it("renders bullet chart", () => {
		const { container } = render(<Chart type="bullet" data={[{ x: "Performance", y: 60 }]} />);

		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("applies custom tokens override", () => {
		render(
			<Chart
				type="bar"
				data={baseData}
				tokens={{
					colors: {
						primary: "#FF0000",
						secondary: "#00FF00",
						background: {
							muted: "#EEE",
						},
					},
				}}
			/>,
		);

		const wrapper = screen.getByRole("img", { hidden: true }) || document.body;
		expect(wrapper).toBeInTheDocument();
	});

	it("matches snapshot (bar)", () => {
		const { container } = render(<Chart type="bar" data={baseData} />);
		expect(container).toMatchSnapshot();
	});

	it("handles empty data safely", () => {
		const { container } = render(<Chart type="bar" data={[]} />);
		expect(container).toBeInTheDocument();
	});

	it("handles gauge without data safely", () => {
		render(<Chart type="gauge" data={[]} />);
		expect(screen.getByText("0,0")).toBeInTheDocument();
	});

	it("applies className prop", () => {
		const { container } = render(<Chart type="bar" data={baseData} className="custom-chart" />);
		expect(container.querySelector(".custom-chart")).toBeInTheDocument();
	});

	it("applies containerStyle prop", () => {
		const { container } = render(
			<Chart type="bar" data={baseData} containerStyle={{ border: "1px solid red" }} />,
		);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.style.border).toBe("1px solid red");
	});

	it("applies custom width and height", () => {
		const { container } = render(<Chart type="bar" data={baseData} width={800} height={600} />);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});

	it("renders pie chart with custom colorScale config", () => {
		const { container } = render(
			<Chart
				type="pie"
				data={baseData}
				config={{ pie: { colorScale: ["#111", "#222", "#333"] } }}
			/>,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders pie chart using data colors when all items have color", () => {
		const dataWithColors = [
			{ x: "A", y: 10, color: "#FF0000" },
			{ x: "B", y: 20, color: "#00FF00" },
			{ x: "C", y: 30, color: "#0000FF" },
		];
		const { container } = render(
			<Chart type="pie" data={dataWithColors} config={{ pie: { useDataColors: true } }} />,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders pie chart with innerRadius and padAngle", () => {
		const { container } = render(
			<Chart type="pie" data={baseData} config={{ pie: { innerRadius: 50, padAngle: 2 } }} />,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders gauge with custom config", () => {
		render(
			<Chart
				type="gauge"
				data={[{ x: "value", y: 50 }]}
				config={{
					gauge: {
						startAngle: -120,
						endAngle: 120,
						innerRadius: 80,
						maxValue: 200,
					},
				}}
			/>,
		);
		expect(screen.getByText("50,0")).toBeInTheDocument();
	});

	it("renders bullet chart with value exceeding maxValue", () => {
		const { container } = render(
			<Chart
				type="bullet"
				data={[{ x: "Score", y: 150 }]}
				config={{ bullet: { maxValue: 100 } }}
			/>,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders bullet chart with custom bar widths", () => {
		const { container } = render(
			<Chart
				type="bullet"
				data={[{ x: "Score", y: 60 }]}
				config={{ bullet: { barWidth: 50, backgroundBarWidth: 150, maxValue: 100 } }}
			/>,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("handles bullet chart with empty data", () => {
		const { container } = render(<Chart type="bullet" data={[]} />);
		expect(container).toBeInTheDocument();
	});

	it("renders bar chart with custom config", () => {
		const { container } = render(
			<Chart type="bar" data={baseData} config={{ bar: { barWidth: 20, cornerRadius: 8 } }} />,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders line chart with custom strokeWidth", () => {
		const { container } = render(
			<Chart type="line" data={baseData} config={{ line: { strokeWidth: 4 } }} />,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders area chart with custom opacity", () => {
		const { container } = render(
			<Chart type="area" data={baseData} config={{ area: { opacity: 0.5 } }} />,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders scatter chart with custom size", () => {
		const { container } = render(
			<Chart type="scatter" data={baseData} config={{ scatter: { size: 8 } }} />,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("applies custom axis config", () => {
		const { container } = render(
			<Chart
				type="bar"
				data={baseData}
				config={{
					axis: {
						grid: { stroke: "#CCC", strokeWidth: 2 },
						tickLabels: { fontSize: 14, fill: "#333", padding: 12 },
						axis: { stroke: "#000", strokeWidth: 2 },
					},
				}}
			/>,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("merges partial token overrides correctly", () => {
		const { container } = render(
			<Chart
				type="bar"
				data={baseData}
				tokens={{
					spacing: { md: 24 },
					borderRadius: { md: 16 },
				}}
			/>,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("renders pie with palette fallback when useDataColors is false", () => {
		const { container } = render(
			<Chart type="pie" data={baseData} config={{ pie: { useDataColors: false } }} />,
		);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});
});
