import React, { useState, useMemo, type ElementType, type ReactNode } from "react";
import clsx from "clsx";
import type { IMenuItemProps } from "./Menu.interface";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useMenuContext } from "./MenuContext";
import "./MenuItem.inline.css";

interface MenuItemContentProps {
	LeftIcon?: ElementType;
	RightIcon?: ElementType;
	label: ReactNode;
	iconSize: number;
	menuIsCollapsed: boolean;
	hasSubmenu: boolean;
	isExpanded: boolean;
}

const MenuItemContent: React.FC<MenuItemContentProps> = React.memo(
	({ LeftIcon, RightIcon, label, iconSize, menuIsCollapsed, hasSubmenu, isExpanded }) => (
		<>
			{LeftIcon && (
				<span className="flex-shrink-0 pointer-events-none" aria-hidden="true">
					<LeftIcon size={iconSize} weight="regular" />
				</span>
			)}
			{!menuIsCollapsed && (
				<div className="flex flex-col items-start min-w-0 pointer-events-none">
					<span className="text-[var(--ds-font-size-16)] font-[var(--ds-font-weight-regular)] leading-[20px] truncate menuitem-inline-1">
						{label}
					</span>
				</div>
			)}{" "}
			{!menuIsCollapsed && RightIcon && (
				<span className="flex-shrink-0 pointer-events-none" aria-hidden="true">
					<RightIcon size={iconSize} weight="regular" />
				</span>
			)}
			{!menuIsCollapsed && hasSubmenu && !RightIcon && (
				<span
					className={clsx(
						"flex-shrink-0 ml-auto transition-transform duration-200 pointer-events-none",
						isExpanded && "rotate-180",
					)}
					aria-hidden="true"
				>
					<CaretDownIcon size={iconSize} weight="regular" />
				</span>
			)}
		</>
	),
);

MenuItemContent.displayName = "MenuItemContent";

type StateStyleKey =
	| "collapsed"
	| "collapsedDisabled"
	| "submenuDefault"
	| "submenuDisabled"
	| "submenuActive"
	| "submenuFocused"
	| "submenuHovered"
	| "mainDisabled"
	| "mainActive"
	| "mainFocused"
	| "mainPressed"
	| "mainHovered"
	| "mainDefault";

const STATE_STYLES: Record<StateStyleKey, string> = {
	collapsed: "bg-transparent text-[var(--ds-color-neutral-white)] border-none",
	collapsedDisabled: "bg-transparent text-[var(--ds-color-neutral-80)] cursor-not-allowed",
	submenuDefault: "bg-transparent text-[var(--ds-color-neutral-white)] rounded-r-[24px]",
	submenuDisabled:
		"bg-transparent text-[var(--ds-color-neutral-80)] cursor-not-allowed rounded-r-[24px]",
	submenuActive: "bg-transparent text-[var(--ds-color-neutral-white)] rounded-r-[24px]",
	submenuFocused: "bg-transparent text-[var(--ds-color-neutral-white)] rounded-r-[24px]",
	submenuHovered: "bg-transparent text-[var(--ds-color-neutral-60)] rounded-r-[24px]",
	mainDisabled:
		"bg-[var(--ds-color-neutral-80)] text-[var(--ds-color-neutral-40)] cursor-not-allowed border-l-[9px] border-[var(--ds-color-neutral-40)] rounded-r-[24px]",
	mainActive:
		"bg-[var(--ds-color-blue-90)] text-[var(--ds-color-blue-30)] border-l-[9px] border-[var(--ds-color-blue-30)] rounded-r-[24px]",
	mainFocused:
		"bg-[var(--ds-color-blue-90)] text-[var(--ds-color-blue-10)] border-l-[9px] border-[var(--ds-color-blue-10)] rounded-r-[24px]",
	mainPressed:
		"bg-[var(--ds-color-blue-90)] text-[var(--ds-color-blue-10)] border-l-[9px] border-[var(--ds-color-blue-10)] rounded-r-[24px]",
	mainHovered:
		"bg-[var(--ds-color-blue-90)] text-[var(--ds-color-blue-20)] border-l-[9px] border-[var(--ds-color-neutral-50)] rounded-r-[24px]",
	mainDefault:
		"bg-[var(--ds-color-blue-90)] text-[var(--ds-color-neutral-10)] border-l-[9px] border-[var(--ds-color-neutral-50)] rounded-r-[24px]",
};

const getSubmenuStateKey = (
	disabled: boolean,
	isActive: boolean,
	isFocused: boolean,
	isHovered: boolean,
): StateStyleKey => {
	if (disabled) return "submenuDisabled";
	if (isActive) return "submenuActive";
	if (isFocused) return "submenuFocused";
	if (isHovered) return "submenuHovered";
	return "submenuDefault";
};

const getMainStateKey = (
	disabled: boolean,
	isActive: boolean,
	isFocused: boolean,
	isPressed: boolean,
	isHovered: boolean,
): StateStyleKey => {
	if (disabled) return "mainDisabled";
	if (isActive) return "mainActive";
	if (isFocused) return "mainFocused";
	if (isPressed) return "mainPressed";
	if (isHovered) return "mainHovered";
	return "mainDefault";
};

const getStateStyleKey = (
	menuIsCollapsed: boolean,
	isSubmenuItem: boolean,
	disabled: boolean,
	isActive: boolean,
	isFocused: boolean,
	isPressed: boolean,
	isHovered: boolean,
): StateStyleKey => {
	if (menuIsCollapsed) return disabled ? "collapsedDisabled" : "collapsed";
	if (isSubmenuItem) return getSubmenuStateKey(disabled, isActive, isFocused, isHovered);
	return getMainStateKey(disabled, isActive, isFocused, isPressed, isHovered);
};

export const MenuItem: React.FC<IMenuItemProps> = React.memo(
	({
		label,
		leftIcon: LeftIcon,
		rightIcon: RightIcon,
		isActive = false,
		disabled = false,
		onClick,
		href,
		className,
		children,
		isSubmenuItem = false,
		...props
	}) => {
		const { isCollapsed: menuIsCollapsed } = useMenuContext();
		const [isHovered, setIsHovered] = useState(false);
		const [isPressed, setIsPressed] = useState(false);
		const [isFocused, setIsFocused] = useState(false);
		const [isExpanded, setIsExpanded] = useState(false);

		const hasSubmenu = React.Children.count(children) > 0;

		const getLayoutStyles = () => {
			if (menuIsCollapsed) return "justify-center p-3";
			if (isSubmenuItem) return "px-4 py-3 h-10 gap-1 md:gap-2 justify-start";
			return "px-4 py-3 gap-1 md:gap-2 justify-start";
		};

		const baseStyles = clsx(
			"w-full flex items-center",
			getLayoutStyles(),
			"transition-all duration-200",
			"relative",
			!disabled && "cursor-pointer",
		);
		const stateStyles = useMemo(() => {
			const key = getStateStyleKey(
				menuIsCollapsed,
				isSubmenuItem,
				disabled,
				isActive,
				isFocused,
				isPressed,
				isHovered,
			);
			return STATE_STYLES[key];
		}, [disabled, isActive, isPressed, isHovered, isSubmenuItem, menuIsCollapsed, isFocused]);

		const finalClasses = clsx(baseStyles, stateStyles, className);

		const handleClick = () => {
			if (disabled) return;

			if (hasSubmenu) {
				setIsExpanded(!isExpanded);
			}

			onClick?.();
		};

		const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (disabled) return;

			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				if (hasSubmenu) {
					setIsExpanded(!isExpanded);
				}
				onClick?.();
			} else if (e.key === "ArrowDown" && hasSubmenu && !isExpanded) {
				e.preventDefault();
				setIsExpanded(true);
			} else if (e.key === "ArrowUp" && hasSubmenu && isExpanded) {
				e.preventDefault();
				setIsExpanded(false);
			}
		};

		const handleMouseEnter = () => !disabled && setIsHovered(true);
		const handleMouseLeave = () => {
			setIsHovered(false);
			setIsPressed(false);
		};

		const handleMouseDown = () => !disabled && setIsPressed(true);
		const handleMouseUp = () => setIsPressed(false);

		const handleFocus = () => !disabled && setIsFocused(true);
		const handleBlur = () => setIsFocused(false);

		const isTopLevel = !isSubmenuItem;
		const iconSize = menuIsCollapsed && isTopLevel ? 24 : 12;

		const contentProps = {
			LeftIcon,
			RightIcon,
			label,
			iconSize,
			menuIsCollapsed,
			hasSubmenu,
			isExpanded,
		};
		const commonProps = {
			className: finalClasses,
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
			onMouseDown: handleMouseDown,
			onMouseUp: handleMouseUp,
			onFocus: handleFocus,
			onBlur: handleBlur,
			"aria-label": `Ir para ${label}`,
		};

		const renderMenuElement = () => {
			if (hasSubmenu) {
				return (
					<button
						type="button"
						{...commonProps}
						onClick={handleClick}
						onKeyDown={handleKeyDown}
						disabled={disabled}
						aria-disabled={disabled}
						aria-expanded={isExpanded}
						{...props}
					>
						<MenuItemContent {...contentProps} />
					</button>
				);
			}

			if (href) {
				return (
					<a
						href={href}
						{...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
						{...commonProps}
						onClick={(e) => {
							if (disabled) {
								e.preventDefault();
								return;
							}
							onClick?.();
						}}
						aria-disabled={disabled || undefined}
						tabIndex={disabled ? -1 : props.tabIndex}
						style={disabled ? { ...props.style, pointerEvents: "none" } : props.style}
					>
						<MenuItemContent {...contentProps} />
					</a>
				);
			}

			return (
				<button
					type="button"
					{...commonProps}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					disabled={disabled}
					aria-disabled={disabled}
					{...props}
				>
					<MenuItemContent {...contentProps} />
				</button>
			);
		};

		return (
			<div>
				{renderMenuElement()}

				{children && (
					<nav
						aria-label={`Submenu de ${label}`}
						aria-hidden={!isExpanded}
						inert={!isExpanded}
						className={clsx(
							"overflow-hidden transition-all duration-300 ease-in-out",
							"flex flex-col gap-2",
							isExpanded ? "max-h-[2000px] opacity-100 pt-3" : "max-h-0 opacity-0 pt-0",
						)}
					>
						{React.Children.map(children, (child) => {
							if (React.isValidElement(child)) {
								return React.cloneElement(child, { isSubmenuItem: true } as any);
							}
							return child;
						})}
					</nav>
				)}
			</div>
		);
	},
);

MenuItem.displayName = "MenuItem";
