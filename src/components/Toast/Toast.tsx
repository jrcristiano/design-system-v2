import React, { memo } from "react";
import { ToastContainer } from "react-toastify";
import type { ToastProps } from "./Toast.interface";
import "react-toastify/dist/ReactToastify.css";
import "./Toast.css";

export const Toast: React.FC<ToastProps> = memo(
	({ floatingOn = "top-right", position, ...props }) => (
		<ToastContainer
			position={position ?? floatingOn}
			autoClose={5000}
			hideProgressBar
			closeOnClick
			pauseOnHover
			draggable
			{...props}
		/>
	),
);
