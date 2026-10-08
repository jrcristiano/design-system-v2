import React, { useId, useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { CaretDownIcon } from "@phosphor-icons/react";
import type { IAccordionProps } from "./Accordion.interface";

export const Accordion: React.FC<IAccordionProps> = React.memo(
	({ title, children, isOpen: controlledIsOpen, className, ...props }) => {
		const panelId = useId();
		const headerId = `${panelId}-header`;

		const isControlled = controlledIsOpen !== undefined;
		const [internalIsOpen, setInternalIsOpen] = useState(false);
		const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

		const handleToggle = useCallback(() => {
			if (!isControlled) setInternalIsOpen((prev) => !prev);
		}, [isControlled]);

		const [hasBeenOpened, setHasBeenOpened] = useState(isOpen);

		useEffect(() => {
			if (isOpen) setHasBeenOpened(true);
		}, [isOpen]);

		const shouldRenderChildren = hasBeenOpened || isOpen ? children : null;

		/** ===== CLASSES ===== */
		const containerStyles =
			"w-full bg-[var(--ds-color-blue-90)] rounded-2xl transition-all duration-200 max-w-full";

		const outlineStyles = isOpen
			? "outline outline-2 outline-[var(--ds-color-blue-30)]"
			: "outline outline-2 outline-[var(--ds-color-neutral-50)] focus-within:outline-[var(--ds-color-blue-20)] focus-within:outline-offset-2";

		const headerStyles = clsx(
			"w-full flex items-center justify-between gap-2 px-6 py-3 transition-colors duration-200 cursor-pointer min-h-[60px] sm:min-h-[64px]",
		);

		const titleStyles = clsx(
			"flex-1 font-body font-[var(--ds-font-weight-semibold)] break-words text-left",
			"text-[length:var(--ds-font-size-14)] leading-[20px] sm:text-[length:var(--ds-font-size-16)] sm:leading-[22.4px]",
			isOpen ? "text-[var(--ds-color-blue-30)]" : "text-[var(--ds-color-blue-40)]",
		);

		const iconStyles = clsx(
			"transition-transform duration-300 flex-shrink-0 w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[var(--ds-color-neutral-10)]",
			isOpen && "rotate-180",
		);

		const contentStyles = clsx(
			"overflow-hidden transition-all duration-300 ease-in-out bg-[var(--ds-color-neutral-white)] rounded-b-2xl",
			isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0",
		);

		const contentLayout = clsx("px-6 py-8 sm:px-6 sm:py-8");

		return (
			<div className={clsx(containerStyles, outlineStyles, className)} {...props}>
				<button
					id={headerId}
					type="button"
					className={headerStyles}
					aria-expanded={isOpen}
					aria-controls={panelId}
					onClick={handleToggle}
				>
					<span className={titleStyles}>{title}</span>
					<div className={iconStyles} aria-hidden="true">
						<CaretDownIcon size="100%" weight="regular" />
					</div>
				</button>

				{/* Substituído role="region" por <section> com aria-labelledby */}
				<section id={panelId} aria-labelledby={headerId} className={contentStyles}>
					<div className={contentLayout} aria-hidden={!isOpen}>
						{shouldRenderChildren}
					</div>
				</section>
			</div>
		);
	},
);

Accordion.displayName = "Accordion";
