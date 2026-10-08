import type { ToastContainerProps } from "react-toastify";

export type ToastFloatingOn =
	"top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";

export type ToastProps = ToastContainerProps & {
	floatingOn?: ToastFloatingOn;
};
