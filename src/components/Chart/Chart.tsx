import React from "react";
import {
	VictoryChart,
	VictoryBar,
	VictoryLine,
	VictoryArea,
	VictoryScatter,
	VictoryPie,
	VictoryAxis,
	VictoryTheme,
	VictoryContainer,
	type VictoryThemeDefinition,
} from "victory";

// ========== TIPOS BASE ==========
type BaseDatum = {
	x: string | number;
	y: number;
	// Permite cor personalizada por item
	color?: string;
};

type ChartType = "bar" | "line" | "area" | "scatter" | "pie" | "bullet" | "gauge";

// ========== TOKENS DE DESIGN ==========
type TypographyTokens = {
	fontFamily?: string;
	fontSize: {
		xs?: number;
		sm?: number;
		base?: number;
		lg?: number;
		xl?: number;
	};
	fontWeight?: {
		normal?: number | string;
		semibold?: number | string;
		bold?: number | string;
	};
};

type ColorTokens = {
	primary: string;
	secondary: string;
	// Paleta de cores para gráficos com múltiplas séries
	palette?: string[];
	background: {
		muted: string;
		paper?: string;
		default?: string;
	};
	text?: {
		primary?: string;
		secondary?: string;
		muted?: string;
	};
	border?: {
		default?: string;
		muted?: string;
	};
};

type SpacingTokens = {
	xs?: number;
	sm?: number;
	md?: number;
	lg?: number;
	xl?: number;
};

type ChartTokens = {
	colors: ColorTokens;
	typography: TypographyTokens;
	spacing: SpacingTokens;
	borderRadius?: {
		sm?: number;
		md?: number;
		lg?: number;
	};
};

// ========== CONFIGURAÇÕES ESPECÍFICAS ==========
type ChartConfig = {
	bar?: {
		barWidth?: number;
		cornerRadius?: number;
	};
	line?: {
		strokeWidth?: number;
	};
	area?: {
		opacity?: number;
	};
	scatter?: {
		size?: number;
	};
	pie?: {
		innerRadius?: number;
		padAngle?: number;
		// Permite sobrescrever cores do pie
		colorScale?: string[];
		// Se deve usar cores individuais dos dados
		useDataColors?: boolean;
	};
	gauge?: {
		startAngle?: number;
		endAngle?: number;
		innerRadius?: number;
		maxValue?: number;
	};
	bullet?: {
		barWidth?: number;
		backgroundBarWidth?: number;
		maxValue?: number;
	};
	axis?: {
		grid?: {
			stroke?: string;
			strokeWidth?: number;
		};
		tickLabels?: {
			fontSize?: number;
			fill?: string;
			padding?: number;
		};
		axis?: {
			stroke?: string;
			strokeWidth?: number;
		};
	};
};

// ========== PROPS DO COMPONENTE ==========
type ChartProps = {
	type: ChartType;
	data: BaseDatum[];
	title?: string;
	height?: number;
	width?: number;

	/**
	 * Design System overrides
	 */
	tokens?: Partial<ChartTokens>;
	config?: Partial<ChartConfig>;
	theme?: VictoryThemeDefinition;
	containerStyle?: React.CSSProperties;
	className?: string;
};

// ========== TOKENS PADRÃO ==========
const DEFAULT_TOKENS: ChartTokens = {
	colors: {
		primary: "#017DA2",
		secondary: "#004ECC",
		// Paleta de cores padrão para múltiplas séries
		palette: [
			"#017DA2", // primary
			"#004ECC", // secondary
			"#EAB308", // yellow
			"#22C55E", // green
			"#EF4444", // red
			"#A855F7", // purple
			"#EC4899", // pink
			"#F97316", // orange
		],
		background: {
			muted: "#E5E7EB",
			paper: "#FFFFFF",
			default: "#F9FAFB",
		},
		text: {
			primary: "#111827",
			secondary: "#4B5563",
			muted: "#9CA3AF",
		},
		border: {
			default: "#D1D5DB",
			muted: "#E5E7EB",
		},
	},
	typography: {
		fontFamily: "system-ui, -apple-system, sans-serif",
		fontSize: {
			xs: 10,
			sm: 12,
			base: 14,
			lg: 18,
			xl: 24,
		},
		fontWeight: {
			normal: 400,
			semibold: 600,
			bold: 700,
		},
	},
	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 32,
	},
	borderRadius: {
		sm: 4,
		md: 8,
		lg: 12,
	},
};

// ========== CONFIGURAÇÃO PADRÃO ==========
const DEFAULT_CONFIG: ChartConfig = {
	bar: {
		barWidth: 40,
		cornerRadius: 4,
	},
	line: {
		strokeWidth: 2,
	},
	area: {
		opacity: 0.3,
	},
	scatter: {
		size: 4,
	},
	pie: {
		innerRadius: 0,
		padAngle: 0,
		useDataColors: true, // Por padrão, usa cores individuais se disponíveis
	},
	gauge: {
		startAngle: -90,
		endAngle: 90,
		innerRadius: undefined,
		maxValue: 100,
	},
	bullet: {
		barWidth: 100,
		backgroundBarWidth: 250,
		maxValue: 100,
	},
	axis: {
		grid: {
			stroke: "#E5E7EB",
			strokeWidth: 1,
		},
		tickLabels: {
			fontSize: 10,
			fill: "#666666",
			padding: 8,
		},
		axis: {
			stroke: "#999999",
			strokeWidth: 1,
		},
	},
};

// ========== COMPONENTE PRINCIPAL ==========
export const Chart: React.FC<ChartProps> = ({
	type,
	data,
	title,
	height = 300,
	width = 500,
	tokens,
	config,
	theme = VictoryTheme.material,
	containerStyle,
	className,
}) => {
	// Merge tokens e config com defaults
	const mergedTokens = mergeTokens(DEFAULT_TOKENS, tokens);
	const mergedConfig = { ...DEFAULT_CONFIG, ...config };

	// Estilos baseados em tokens
	const styles = createStyles(mergedTokens);

	// Função para determinar a escala de cores do pie
	const getPieColorScale = () => {
		// Se config tiver colorScale, usa ela
		if (mergedConfig.pie?.colorScale) {
			return mergedConfig.pie.colorScale;
		}

		// Se deve usar cores individuais e todos os itens têm cor, retorna undefined
		// (Victory vai usar a propriedade color de cada datum)
		if (mergedConfig.pie?.useDataColors && data.every((d) => d.color)) {
			return undefined;
		}

		// Caso contrário, usa a paleta de cores
		return mergedTokens.colors.palette || [mergedTokens.colors.primary];
	};

	const renderPie = () => {
		const colorScale = getPieColorScale();

		return (
			<VictoryPie
				data={data}
				height={height}
				width={width}
				colorScale={colorScale}
				// Se não temos colorScale e estamos usando cores individuais,
				// a função color vai ser chamada para cada item
				labels={({ datum }) => `${datum.x}: ${datum.y}`}
				innerRadius={mergedConfig.pie?.innerRadius}
				padAngle={mergedConfig.pie?.padAngle}
				style={{
					labels: {
						fill: mergedTokens.colors.text?.primary,
						fontFamily: mergedTokens.typography.fontFamily,
						fontSize: mergedTokens.typography.fontSize.sm,
					},
					data: {
						stroke: mergedTokens.colors.background.paper,
						strokeWidth: 1,
					},
				}}
			/>
		);
	};

	const renderGauge = () => {
		const value = data[0]?.y ?? 0;
		const max = mergedConfig.gauge?.maxValue ?? 100;

		// Calcula o inner radius baseado na altura
		const innerRadius = mergedConfig.gauge?.innerRadius ?? height * 0.43;

		return (
			<div style={{ position: "relative", width, height, ...styles.container }}>
				<VictoryPie
					height={height}
					width={width}
					startAngle={mergedConfig.gauge?.startAngle}
					endAngle={mergedConfig.gauge?.endAngle}
					innerRadius={innerRadius}
					data={[
						{ x: "value", y: value, color: mergedTokens.colors.secondary },
						{ x: "rest", y: Math.max(0, max - value), color: mergedTokens.colors.background.muted },
					]}
					colorScale={[mergedTokens.colors.secondary, mergedTokens.colors.background.muted]}
					labels={() => null}
				/>

				<div style={styles.gaugeLabel}>
					<span style={styles.gaugeLabelSmall}>Valor atual</span>
					<strong style={styles.gaugeLabelLarge}>{value.toFixed(1).replace(".", ",")}</strong>
				</div>
			</div>
		);
	};

	const renderBullet = () => {
		const datum = data[0];
		if (!datum) return null;

		const value = Math.min(datum.y, mergedConfig.bullet?.maxValue ?? 100);
		const max = mergedConfig.bullet?.maxValue ?? 100;

		return (
			<VictoryChart
				height={height}
				width={width}
				horizontal
				domain={{ y: [0, max] }}
				padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
				theme={theme}
				containerComponent={<VictoryContainer responsive />}
			>
				<VictoryAxis
					dependentAxis
					tickValues={[0, 20, 40, 60, 80, 100]}
					style={{
						axis: { stroke: mergedTokens.colors.border?.default },
						tickLabels: {
							fontSize: mergedTokens.typography.fontSize.xs,
							fill: mergedTokens.colors.text?.muted,
							fontFamily: mergedTokens.typography.fontFamily,
						},
						grid: {
							stroke: mergedConfig.axis?.grid?.stroke,
							strokeWidth: mergedConfig.axis?.grid?.strokeWidth,
						},
					}}
				/>

				<VictoryAxis
					tickValues={[]}
					style={{
						axis: { stroke: "transparent" },
						ticks: { stroke: "transparent" },
						tickLabels: { fill: "transparent" },
						grid: { stroke: "transparent" },
					}}
				/>

				<VictoryBar
					data={[{ x: 1, y: max }]}
					barWidth={mergedConfig.bullet?.backgroundBarWidth}
					style={{
						data: { fill: mergedTokens.colors.background.muted },
					}}
				/>

				<VictoryBar
					data={[{ x: 1, y: value }]}
					barWidth={mergedConfig.bullet?.barWidth}
					style={{
						data: { fill: mergedTokens.colors.primary },
					}}
				/>
			</VictoryChart>
		);
	};

	const renderCartesian = () => (
		<VictoryChart
			theme={theme}
			domainPadding={{ x: 20 }}
			height={height}
			width={width}
			containerComponent={<VictoryContainer responsive />}
		>
			<VictoryAxis
				style={{
					axis: { stroke: mergedTokens.colors.border?.default },
					tickLabels: {
						fill: mergedTokens.colors.text?.secondary,
						fontSize: mergedTokens.typography.fontSize.xs,
						fontFamily: mergedTokens.typography.fontFamily,
					},
					grid: { stroke: mergedConfig.axis?.grid?.stroke },
				}}
			/>
			<VictoryAxis
				dependentAxis
				style={{
					axis: { stroke: mergedTokens.colors.border?.default },
					tickLabels: {
						fill: mergedTokens.colors.text?.secondary,
						fontSize: mergedTokens.typography.fontSize.xs,
						fontFamily: mergedTokens.typography.fontFamily,
					},
					grid: { stroke: mergedConfig.axis?.grid?.stroke },
				}}
			/>

			{type === "bar" && (
				<VictoryBar
					data={data}
					barWidth={mergedConfig.bar?.barWidth}
					style={{
						data: {
							fill: mergedTokens.colors.primary,
							stroke: "none",
						},
					}}
				/>
			)}

			{type === "line" && (
				<VictoryLine
					data={data}
					style={{
						data: {
							stroke: mergedTokens.colors.primary,
							strokeWidth: mergedConfig.line?.strokeWidth,
						},
					}}
				/>
			)}

			{type === "area" && (
				<VictoryArea
					data={data}
					style={{
						data: {
							fill: mergedTokens.colors.primary,
							fillOpacity: mergedConfig.area?.opacity,
							stroke: mergedTokens.colors.primary,
							strokeWidth: mergedConfig.line?.strokeWidth,
						},
					}}
				/>
			)}

			{type === "scatter" && (
				<VictoryScatter
					data={data}
					size={mergedConfig.scatter?.size}
					style={{
						data: {
							fill: mergedTokens.colors.primary,
						},
					}}
				/>
			)}
		</VictoryChart>
	);

	const renderContent = () => {
		switch (type) {
			case "pie":
				return renderPie();
			case "gauge":
				return renderGauge();
			case "bullet":
				return renderBullet();
			default:
				return renderCartesian();
		}
	};

	return (
		<div
			className={className}
			style={{
				position: "relative",
				width,
				...styles.container,
				...containerStyle,
			}}
		>
			{title && (
				<small className="font-semibold" style={styles.title}>
					{title}
				</small>
			)}
			{renderContent()}
		</div>
	);
};

// ========== FUNÇÕES UTILITÁRIAS ==========
function mergeTokens(defaultTokens: ChartTokens, override?: Partial<ChartTokens>): ChartTokens {
	if (!override) return defaultTokens;

	return {
		colors: { ...defaultTokens.colors, ...override.colors },
		typography: { ...defaultTokens.typography, ...override.typography },
		spacing: { ...defaultTokens.spacing, ...override.spacing },
		borderRadius: { ...defaultTokens.borderRadius, ...override.borderRadius },
	};
}

function createStyles(tokens: ChartTokens) {
	return {
		container: {
			backgroundColor: tokens.colors.background.paper,
			borderRadius: tokens.borderRadius?.md,
		},
		title: {
			marginLeft: tokens.spacing.lg,
			marginTop: tokens.spacing.sm,
			marginBottom: tokens.spacing.xs,
			display: "block" as const,
			fontSize: tokens.typography.fontSize.sm,
			fontFamily: tokens.typography.fontFamily,
			fontWeight: tokens.typography.fontWeight?.semibold,
			color: tokens.colors.text?.primary,
		},
		gaugeLabel: {
			position: "absolute" as const,
			inset: 0,
			display: "flex" as const,
			flexDirection: "column" as const,
			justifyContent: "center" as const,
			alignItems: "center" as const,
			fontFamily: tokens.typography.fontFamily,
		},
		gaugeLabelSmall: {
			fontSize: tokens.typography.fontSize.sm,
			color: tokens.colors.text?.secondary,
		},
		gaugeLabelLarge: {
			fontSize: tokens.typography.fontSize.lg,
			fontWeight: tokens.typography.fontWeight?.bold,
			color: tokens.colors.text?.primary,
		},
	};
}
