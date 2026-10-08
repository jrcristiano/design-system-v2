import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import "./../../tokens/typography.css";
import "./../../tokens/colors.css";
import { Button } from "../Button/Button";

type TypographyRow = {
	name: string;
	className: string;
	size: string;
	weight: string;
	lineHeight: string;
	details: string;
	description: string;
};

type ActiveTypography = "ef" | "em" | null;

interface PlaygroundHeaderProps {
	pretitle: string;
	title: string;
	description?: string;
}

const WEIGHTS = [
	{ name: "Regular", weight: 400 },
	{ name: "Medium", weight: 500 },
	{ name: "Semibold", weight: 600 },
	{ name: "Bold", weight: 700 },
] as const;

const HEADLINES_ROWS: TypographyRow[] = [
	{
		name: "headline-1",
		className: "var(--ds-headline-1-size)",
		size: "64px",
		weight: "Bold",
		lineHeight: "110%",
		details: "Heros, páginas de entrada",
		description: "Usado em páginas principais com impacto visual forte.",
	},
	{
		name: "headline-2",
		className: "var(--ds-headline-2-size)",
		size: "48px",
		weight: "Bold",
		lineHeight: "120%",
		details: "Títulos de dashboards",
		description: "Ideal para sessões amplas como dashboards e capítulos.",
	},
	{
		name: "headline-3",
		className: "var(--ds-headline-3-size)",
		size: "40px",
		weight: "Bold",
		lineHeight: "120%",
		details: "Títulos de seções",
		description: "Abertura de blocos, forte mas equilibrado.",
	},
	{
		name: "headline-4",
		className: "var(--ds-headline-1-size)",
		size: "24px",
		weight: "Semibold",
		lineHeight: "120%",
		details: "Headers de componente",
		description: "Ideal para cards e seções internas.",
	},
];

const BODY_ROWS: TypographyRow[] = [
	{
		name: "body-1",
		className: "body-1",
		size: "20px",
		weight: "Regular",
		lineHeight: "70px",
		details: "Corpo de texto principal",
		description:
			"Ideal para textos informativos ou conteúdos de leitura mais fluida. Visualmente firme e confortável.",
	},
	{
		name: "body-2",
		className: "body-2",
		size: "18px",
		weight: "Regular",
		lineHeight: "50px",
		details: "Texto padrão secundário",
		description:
			"Funciona bem em textos corridos, ajuda visual e instruções em tela. Boa leitura em blocos médios.",
	},
	{
		name: "body-3",
		className: "body-3",
		size: "16px",
		weight: "Regular",
		lineHeight: "60px",
		details: "Título de seções principais",
		description:
			"Complementa o título principal ou abre novos blocos. Ainda forte, mas menos chamativo que o anterior.",
	},
	{
		name: "body-4",
		className: "body-4",
		size: "14px",
		weight: "Regular",
		lineHeight: "10px",
		details: "Títulos menores, headers de componente, labels",
		description:
			"Ideal para cards, seções internas e layouts de conteúdo. Ainda com presença, mas mais leve.",
	},
];

const CAPTION_ROWS: TypographyRow[] = [
	{
		name: "caption-1",
		className: "--ds-caption-1",
		size: "12px",
		weight: "Regular",
		lineHeight: "10px",
		details: "Legendas e metadados",
		description: "Para datas, créditos, dicas rápidas. Pequeno, mas legível.",
	},
	{
		name: "caption-2",
		className: "caption-2",
		size: "10px",
		weight: "Regular",
		lineHeight: "20px",
		details: "Observações mínimas",
		description: "Só para casos extremos (labels de tabela, notas técnicas). Evite textos longos.",
	},
];

const LABEL_ROWS: TypographyRow[] = [
	{
		name: "label-1",
		className: "label-1",
		size: "14px",
		weight: "Medium",
		lineHeight: "20px",
		details: "Labels de campo / chips",
		description: "Rótulos claros e concisos em formulários, filtros e chips.",
	},
	{
		name: "label-2",
		className: "label-2",
		size: "12px",
		weight: "Semibold",
		lineHeight: "15px",
		details: "Tags menores / estados",
		description: "Para estados, badges e etiquetas compactas com boa leitura.",
	},
];

const BUTTON_ROWS: TypographyRow[] = [
	{
		name: "button-lg",
		className: "button-lg",
		size: "16px",
		weight: "Medium",
		lineHeight: "10px",
		details: "CTA principal",
		description: "Toque/Click seguro; alto contraste.",
	},
	{
		name: "button-md",
		className: "button-md",
		size: "14px",
		weight: "Semibold",
		lineHeight: "10px",
		details: "Botão padrão",
		description: "Uso geral na UI.",
	},
	{
		name: "button-sm",
		className: "button-sm",
		size: "12px",
		weight: "Semibold",
		lineHeight: "20px",
		details: "Ações menores",
		description: "Tags clicáveis, micro-ações.",
	},
];

const LINK_ROWS: TypographyRow[] = [
	{
		name: "link-md",
		className: "link-md",
		size: "16px",
		weight: "Medium",
		lineHeight: "50px",
		details: "Link em texto",
		description: "Inline em parágrafos/cards; underline no estado padrão.",
	},
	{
		name: "link-sm",
		className: "link-sm",
		size: "14px",
		weight: "Medium",
		lineHeight: "10px",
		details: "Link menor",
		description: "Listas, tabelas; realce por cor/underline.",
	},
];

const PlaygroundHeader = memo<PlaygroundHeaderProps>(({ pretitle, title, description }) => (
	<div className="mb-6">
		<div className="flex flex-col">
			<div className="text-[13px] font-semibold text-[var(--ds-color-neutral-30)] uppercase tracking-[0.04em] mb-1.5">
				{pretitle}
			</div>
			<div className="text-[var(--ds-font-size-28)] leading-[1.1] font-bold">{title}</div>
			{description && (
				<div className="mt-2 text-[var(--ds-color-neutral-40)] max-w-[760px]">{description}</div>
			)}
		</div>
	</div>
));

PlaygroundHeader.displayName = "PlaygroundHeader";

const TypographyTable = memo<{ title: string; rows: TypographyRow[] }>(({ title, rows }) => (
	<section className="mb-12">
		<h2 className="bg-[var(--ds-color-neutral-95)] text-[var(--ds-body-4-line)] px-4 py-2 rounded-t-lg border border-[var(--ds-color-neutral-90)]">
			{title}
		</h2>

		<div className="overflow-x-auto">
			<table className="w-full border-collapse text-[var(--ds-color-neutral-10)]">
				<thead className="bg-[var(--ds-color-neutral-95)] text-left">
					<tr className="border-b border-[var(--ds-color-neutral-90)]">
						<th className="py-2 px-3 text-sm font-semibold whitespace-nowrap">Nome</th>
						<th className="py-2 px-3 text-sm font-semibold whitespace-nowrap">Tamanho (px)</th>
						<th className="py-2 px-3 text-sm font-semibold whitespace-nowrap">Peso</th>
						<th className="py-2 px-3 text-sm font-semibold whitespace-nowrap">Line height</th>
						<th className="py-2 px-3 text-sm font-semibold whitespace-nowrap">Detalhes</th>
						<th className="py-2 px-3 text-sm font-semibold whitespace-nowrap">Descrição de uso</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((r) => (
						<tr
							style={{
								fontSize: r.size,
								fontWeight: r.weight,
							}}
							key={r.name}
							className="bg-[var(--ds-color-neutral-white)] even:bg-[var(--ds-color-neutral-98)] hover:bg-[var(--ds-color-neutral-95)] transition"
						>
							<td className={`py-3 px-4 ${r.className} whitespace-nowrap`}>{r.name}</td>
							<td className={`py-3 px-4 ${r.className} whitespace-nowrap`}>{r.size}</td>
							<td className={`py-3 px-4 ${r.className} whitespace-nowrap`}>{r.weight}</td>
							<td className={`py-3 px-4 ${r.className} whitespace-nowrap`}>{r.lineHeight}</td>
							<td className={`py-3 px-4 ${r.className}`}>{r.details}</td>
							<td className={`py-3 px-4 ${r.className}`}>{r.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</section>
));

TypographyTable.displayName = "TypographyTable";

const TypefaceAndWeights = memo<{ active: ActiveTypography }>(({ active }) => {
	const headingFont = useMemo(
		() => (active === "em" ? "var(--ds-font-family-montserrat)" : "var(--ds-font-family-fredoka)"),
		[active],
	);

	const bodyFont = useMemo(
		() => (active === "em" ? "var(--ds-font-family-montserrat)" : "var(--ds-font-family-poppins)"),
		[active],
	);

	const fontName = useMemo(() => (active === "em" ? "Montserrat" : "Fredoka"), [active]);

	return (
		<div className="flex flex-col lg:flex-row gap-10 items-start mb-12">
			<div className="flex-1">
				<div className="flex items-center gap-3 mb-6">
					<h3 className="text-4xl font-bold" style={{ fontFamily: headingFont }}>
						{fontName}
					</h3>
				</div>
				<div
					className="text-[112px] text-[var(--ds-color-neutral-10)] leading-none"
					style={{ fontFamily: headingFont }}
				>
					Ag
				</div>

				<p
					className="text-4xl mt-6 text-[var(--ds-color-neutral-30)]"
					style={{ fontFamily: bodyFont, lineHeight: "60px" }}
				>
					ABCDEFGHIJKLMNOPQRSTUVWXYZ
					<br />
					abcdefghijklmnopqrstuvwxyz
					<br />
					0123456789 !@#$%^&*()
				</p>
			</div>

			<div className="w-full lg:w-[520px] flex flex-col gap-5">
				{WEIGHTS.map((w) => (
					<div
						key={w.name}
						className="flex items-center gap-4 bg-[var(--ds-color-neutral-white)] rounded-xl p-4 border border-[var(--ds-color-neutral-90)] shadow-sm"
					>
						<div
							className="text-[60px] text-[var(--ds-color-neutral-10)]"
							style={{ fontFamily: headingFont, fontWeight: w.weight }}
						>
							Aa
						</div>
						<div>
							<div className={`text-xl ${w.name}`} style={{ fontFamily: headingFont }}>
								{w.name}
							</div>
							<div
								className="text-sm text-[var(--ds-color-neutral-50)]"
								style={{ fontFamily: bodyFont }}
							>
								Font weight: {w.weight}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});

TypefaceAndWeights.displayName = "TypefaceAndWeights";

export const Typography: React.FC = () => {
	const [active, setActive] = useState<ActiveTypography>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const applyTypography = useCallback((kind: "ef" | "em") => {
		const root = document.documentElement;
		const comp = getComputedStyle(root);
		const target = containerRef.current || root;

		if (kind === "ef") {
			const headingVal = comp.getPropertyValue("--ds-font-family-fredoka") || "Fredoka, sans-serif";
			const bodyVal = comp.getPropertyValue("--ds-font-family-poppins") || "Poppins, sans-serif";

			target.style.setProperty("--ds-font-family-heading", headingVal);
			target.style.setProperty("--ds-font-family-body", bodyVal);
			target.style.setProperty("--ds-font-family-ui", bodyVal);

			localStorage.setItem("ds-typography", "ef");
			localStorage.setItem("ds-font-token", "--ds-font-family-fredoka");

			setActive("ef");
		} else {
			const val = comp.getPropertyValue("--ds-font-family-montserrat") || "Montserrat, sans-serif";
			target.style.setProperty("--ds-font-family-heading", val);
			target.style.setProperty("--ds-font-family-body", val);
			target.style.setProperty("--ds-font-family-ui", val);

			localStorage.setItem("ds-typography", "em");
			localStorage.setItem("ds-font-token", "--ds-font-family-montserrat");

			setActive("em");
		}
	}, []);

	useEffect(() => {
		const saved = localStorage.getItem("ds-typography") as ActiveTypography;
		if (saved) {
			applyTypography(saved);
		}
	}, [applyTypography]);

	const fontToken = useMemo(
		() => localStorage.getItem("ds-font-token") || "--ds-font-family-body",
		[],
	);

	const containerStyle = useMemo(
		() => ({
			fontFamily: `var(${fontToken})`,
		}),
		[fontToken],
	);

	return (
		<div
			ref={containerRef}
			className="p-8 bg-[var(--ds-color-neutral-white)] text-[var(--ds-color-neutral-10)]"
			style={containerStyle}
		>
			<PlaygroundHeader
				pretitle="Tipografia"
				title="Estados, tamanhos e variantes"
				description="Exemplos de estados, tamanhos e variantes para os componentes Button do design system."
			/>

			<div className="flex gap-3 mt-6 mb-10">
				<Button
					onClick={() => applyTypography("ef")}
					variant={active === "ef" ? "primary" : "outline"}
					size="md"
				>
					Ensino Fundamental
				</Button>
				<Button
					onClick={() => applyTypography("em")}
					variant={active === "em" ? "primary" : "outline"}
					size="md"
				>
					Ensino Médio
				</Button>
			</div>

			<TypefaceAndWeights active={active} />

			<TypographyTable title="Headlines" rows={HEADLINES_ROWS} />
			<TypographyTable title="Body" rows={BODY_ROWS} />
			<TypographyTable title="Caption" rows={CAPTION_ROWS} />
			<TypographyTable title="Label" rows={LABEL_ROWS} />
			<TypographyTable title="Button" rows={BUTTON_ROWS} />
			<TypographyTable title="Link" rows={LINK_ROWS} />
		</div>
	);
};
