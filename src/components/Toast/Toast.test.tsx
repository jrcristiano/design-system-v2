import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Toast } from "./Toast";

const toastContainerMock = vi.fn();

vi.mock("react-toastify", () => ({
	ToastContainer: (props: unknown) => {
		toastContainerMock(props);
		return null;
	},
}));

describe("Toast", () => {
	beforeEach(() => {
		toastContainerMock.mockClear();
	});

	it("uses floatingOn as the default position", () => {
		render(<Toast />);
		expect(toastContainerMock).toHaveBeenCalledTimes(1);
		expect(toastContainerMock.mock.calls[0]?.[0]).toEqual(
			expect.objectContaining({
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			}),
		);
	});

	it("prefers explicit position over floatingOn", () => {
		render(<Toast floatingOn="top-left" position="bottom-center" />);
		expect(toastContainerMock.mock.calls[0]?.[0]).toEqual(
			expect.objectContaining({
				position: "bottom-center",
			}),
		);
	});

	it("forwards props and allows overriding defaults", () => {
		render(
			<Toast
				autoClose={1000}
				hideProgressBar={false}
				closeOnClick={false}
				pauseOnHover={false}
				draggable={false}
				newestOnTop
			/>,
		);
		expect(toastContainerMock.mock.calls[0]?.[0]).toEqual(
			expect.objectContaining({
				position: "top-right",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: false,
				pauseOnHover: false,
				draggable: false,
				newestOnTop: true,
			}),
		);
	});
});
