import type { FC } from "react";
import type { AvatarProps } from "./Avatar.interface";
import { getInitials } from "../../utils/get.initials.util";
import type { IconSize } from "../../types/Commons.type";
import React, { useMemo } from "react";

// Constantes melhor tipadas
const FONT_SIZES: Record<IconSize, string> = {
	xs: "var(--ds-font-size-12)",
	sm: "var(--ds-font-size-14)",
	md: "var(--ds-font-size-16)",
	lg: "var(--ds-font-size-20)",
	xl: "var(--ds-font-size-24)",
} as const;

const AVATAR_SIZES: Record<IconSize, number> = {
	xs: 28,
	sm: 32,
	md: 40,
	lg: 48,
	xl: 56,
} as const;

const STATUS_SIZES: Record<IconSize, string> = {
	xs: "8px",
	sm: "10px",
	md: "12px",
	lg: "14px",
	xl: "16px",
} as const;

const STATUS_COLORS: Record<"available" | "away", string> = {
	available: "#338618",
	away: "#C1290B",
} as const;

// Componente UserIcon memoizado para performance
const UserIcon: FC<{ iconSize: IconSize }> = ({ iconSize }) => {
	const sizes = {
		xs: { w: 12, h: 12 },
		sm: { w: 13, h: 13 },
		md: { w: 19, h: 19 },
		lg: { w: 24, h: 24 },
		xl: { w: 32, h: 32 },
	};

	const { w, h } = sizes[iconSize];

	return (
		<svg
			width={w}
			height={h}
			viewBox="0 0 14 13"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			{" "}
			<path
				d="M12.9388 11.7517C11.9869 10.1061 10.52 8.92608 8.80815 8.3667C9.65492 7.86261 10.3128 7.0945 10.6808 6.18032C11.0488 5.26614 11.1065 4.25645 10.8451 3.3063C10.5837 2.35615 10.0176 1.51807 9.23376 0.920778C8.44994 0.323485 7.49173 0 6.50627 0C5.52082 0 4.5626 0.323485 3.77879 0.920778C2.99497 1.51807 2.42889 2.35615 2.16749 3.3063C1.90608 4.25645 1.96379 5.26614 2.33176 6.18032C2.69974 7.0945 3.35763 7.86261 4.2044 8.3667C2.49252 8.92545 1.02565 10.1055 0.0737727 11.7517C0.0388658 11.8086 0.0157123 11.872 0.00567824 11.938C-0.00435578 12.004 -0.00106704 12.0713 0.0153504 12.136C0.0317679 12.2008 0.0609815 12.2615 0.101268 12.3148C0.141554 12.368 0.192096 12.4127 0.249913 12.4461C0.30773 12.4795 0.371651 12.5009 0.437903 12.5092C0.504155 12.5175 0.571397 12.5125 0.635661 12.4943C0.699926 12.4762 0.759911 12.4454 0.812077 12.4038C0.864244 12.3621 0.907536 12.3104 0.939398 12.2517C2.1169 10.2167 4.19815 9.0017 6.50627 9.0017C8.8144 9.0017 10.8956 10.2167 12.0731 12.2517C12.105 12.3104 12.1483 12.3621 12.2005 12.4038C12.2526 12.4454 12.3126 12.4762 12.3769 12.4943C12.4411 12.5125 12.5084 12.5175 12.5746 12.5092C12.6409 12.5009 12.7048 12.4795 12.7626 12.4461C12.8204 12.4127 12.871 12.368 12.9113 12.3148C12.9516 12.2615 12.9808 12.2008 12.9972 12.136C13.0136 12.0713 13.0169 12.004 13.0069 11.938C12.9968 11.872 12.9737 11.8086 12.9388 11.7517ZM3.00627 4.5017C3.00627 3.80947 3.21154 3.13278 3.59613 2.5572C3.98071 1.98163 4.52734 1.53303 5.16688 1.26812C5.80642 1.00322 6.51016 0.933903 7.18909 1.06895C7.86802 1.204 8.49166 1.53734 8.98115 2.02683C9.47063 2.51631 9.80397 3.13995 9.93902 3.81888C10.0741 4.49782 10.0048 5.20155 9.73985 5.84109C9.47494 6.48063 9.02634 7.02726 8.45077 7.41184C7.8752 7.79643 7.19851 8.0017 6.50627 8.0017C5.57832 8.00071 4.68866 7.63164 4.0325 6.97548C3.37633 6.31932 3.00727 5.42965 3.00627 4.5017Z"
				fill="#014E65"
			/>{" "}
		</svg>
	);
};

// Memoizar o componente para evitar renderizações desnecessárias
const MemoizedUserIcon = React.memo(UserIcon);

export const Avatar: FC<AvatarProps> = ({
	avatarUserName,
	status = "available",
	bordered = false,
	iconSize = "md",
	className = "",
	...rest
}) => {
	// Calcula as classes do container usando useMemo para performance
	const containerClasses = useMemo(() => {
		const baseClasses =
			"relative inline-flex items-center justify-center rounded-full overflow-visible aspect-square";
		const borderClass = bordered ? "border border-[var(--ds-color-neutral-50)]" : "";
		return `${baseClasses} ${borderClass} ${className}`.trim();
	}, [bordered, className]);

	// Calcula as iniciais apenas se necessário
	const initials = useMemo(() => {
		return avatarUserName ? getInitials(avatarUserName) : null;
	}, [avatarUserName]);

	const hasUserName = Boolean(avatarUserName);

	// Props de acessibilidade calculadas dinamicamente
	const accessibilityProps = useMemo(() => {
		return hasUserName
			? { "aria-label": `Avatar do usuário ${avatarUserName}` }
			: { "aria-label": "Avatar de usuário genérico" };
	}, [hasUserName, avatarUserName]);

	return (
		<div
			className={containerClasses}
			style={{
				width: AVATAR_SIZES[iconSize],
				height: AVATAR_SIZES[iconSize],
				backgroundColor: hasUserName ? "var(--ds-color-neutral-10)" : "var(--ds-color-sky-90)",
				color: hasUserName ? "var(--ds-color-neutral-white)" : "var(--ds-color-sky-90)",
				fontWeight: "var(--ds-font-weight-semibold)",
			}}
			{...accessibilityProps}
			{...rest}
		>
			{hasUserName ? (
				<span
					style={{ fontSize: FONT_SIZES[iconSize] }}
					aria-hidden="true" // As iniciais são visuais, o texto alternativo está no container
				>
					{initials}
				</span>
			) : (
				<MemoizedUserIcon iconSize={iconSize} />
			)}

			{/* Indicador de status - apenas visual */}
			<span
				aria-hidden="true" // Removido role="presentation" pois é redundante com aria-hidden
				className="absolute rounded-full"
				style={{
					width: STATUS_SIZES[iconSize],
					height: STATUS_SIZES[iconSize],
					backgroundColor: STATUS_COLORS[status],
					right: 0,
					bottom: 0,
				}}
			/>
		</div>
	);
};

Avatar.displayName = "Avatar";

// Adicionar export default se necessário
export default Avatar;
