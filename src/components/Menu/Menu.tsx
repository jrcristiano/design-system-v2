import React, { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import type { IMenuProps } from "./Menu.interface";
import { Input } from "../Input/Input";
import { MagnifyingGlassIcon, CaretRightIcon } from "@phosphor-icons/react";
import { MenuContext } from "./MenuContext";
import AvatarImage from "../../assets/Avatar.png";

const responsiveTokens = {
	typography: {
		mobile: "text-sm leading-5",
		desktop: "text-base leading-6",
	},
	spacing: {
		mobile: "gap-1",
		desktop: "gap-2",
	},
	container: {
		open: "px-4 py-4",
		collapsed: "py-4",
	},
} as const;

const MenuFooterProfile: React.FC<{
	isCollapsed: boolean;
	size: "sm" | "md";
	avatarSrc: string;
	userName: string;
	userRole: string;
}> = React.memo(({ isCollapsed, size, avatarSrc, userName, userRole }) => {
	const isMd = size === "md";
	const avatarSize = isMd ? "w-10 h-10" : "w-8 h-8";
	const nameClasses = `${isMd ? responsiveTokens.typography.desktop : responsiveTokens.typography.mobile} font-semibold truncate`;
	const roleClasses = `${isMd ? "text-sm leading-[21px]" : "text-xs leading-[18px]"} font-normal truncate`;

	return (
		<div className={`${isCollapsed ? "flex justify-center" : responsiveTokens.container.open}`}>
			<div
				className={
					isCollapsed
						? undefined
						: `flex items-center ${responsiveTokens.spacing.mobile} md:${responsiveTokens.spacing.desktop}`
				}
			>
				<img
					src={avatarSrc}
					alt="Avatar"
					className={`${avatarSize} rounded-full object-cover border-[0.5px] border-[var(--ds-color-neutral-50)]`}
				/>
				{!isCollapsed && (
					<div className="flex flex-col min-w-0 font-poppins text-[var(--ds-color-neutral-10)]">
						<span className={nameClasses}>{userName}</span>
						<span className={roleClasses}>{userRole}</span>
					</div>
				)}
			</div>
		</div>
	);
});

export const Menu: React.FC<IMenuProps> = React.memo(
	({
		children,
		size = "sm",
		isCollapsed: isCollapsedProp = false,
		showSearch = false,
		searchPlaceholder = "Buscar...",
		onSearchChange,
		onCollapse,
		logo,
		logoCollapsed,
		avatarSrc = AvatarImage,
		userName = "Joanna Doe",
		userRole = "Coordenadora",
		...props
	}) => {
		const [isCollapsed, setIsCollapsed] = useState(isCollapsedProp);

		useEffect(() => {
			setIsCollapsed(isCollapsedProp);
		}, [isCollapsedProp]);

		const handleToggle = () => {
			const newState = !isCollapsed;
			setIsCollapsed(newState);
			onCollapse?.(newState);
		};

		const expandedWidth = size === "md" ? "260px" : "200px";

		const menuClasses = clsx(
			"flex flex-col",
			"transition-all duration-300 ease-in-out",
			"overflow-y-auto",
			"scrollbar-hide",
			"[&::-webkit-scrollbar]:hidden",
			"[-ms-overflow-style:none]",
			"[scrollbar-width:none]",
			"bg-[var(--ds-color-blue-40)]",
			"rounded-r-[24px]",
			"pt-8 pb-6",
			isCollapsed ? "px-0" : "pr-3",
			"gap-3",
		);

		const containerWidth = isCollapsed ? "80px" : expandedWidth;

		const contextValue = useMemo(() => ({ isCollapsed }), [isCollapsed]);

		return (
			<MenuContext.Provider value={contextValue}>
				<nav
					role="navigation"
					aria-label="Menu principal"
					className={menuClasses}
					style={{
						width: containerWidth,
						minWidth: containerWidth,
						minHeight: "100vh",
					}}
					{...props}
				>
					<div className={clsx("flex mb-3", isCollapsed ? "justify-center" : "ml-3")}>
						<button
							onClick={handleToggle}
							className={clsx(
								"w-5 h-5 flex items-center justify-center flex-shrink-0",
								"text-[var(--ds-color-neutral-white)] transition-transform duration-300",
								!isCollapsed && "rotate-180",
							)}
							aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
							aria-expanded={!isCollapsed}
						>
							<CaretRightIcon size={20} weight="bold" />
						</button>
					</div>{" "}
					{isCollapsed && logoCollapsed && (
						<div className="flex items-center justify-center flex-shrink-0 px-3">
							{logoCollapsed}
						</div>
					)}
					{logo && !isCollapsed && <div className="px-3 flex-shrink-0">{logo}</div>}
					{showSearch && !isCollapsed && (
						<div className="px-3 flex-shrink-0 [&_>div>div]:bg-[var(--ds-color-neutral-white)]">
							<Input
								label=""
								placeholder={searchPlaceholder}
								iconRight={<MagnifyingGlassIcon />}
								size="md"
								onChange={(e) => onSearchChange?.(e.target.value)}
								aria-label="Buscar no menu"
							/>
						</div>
					)}
					<div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-3">
						{children}
					</div>
					<div className="mt-auto flex-shrink-0">
						<MenuFooterProfile
							isCollapsed={isCollapsed}
							size={size}
							avatarSrc={avatarSrc}
							userName={userName}
							userRole={userRole}
						/>
					</div>
				</nav>
			</MenuContext.Provider>
		);
	},
);

Menu.displayName = "Menu";
