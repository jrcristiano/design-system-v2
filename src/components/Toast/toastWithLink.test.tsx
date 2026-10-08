import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("react-toastify", () => ({
	toast: Object.assign(vi.fn(), {
		info: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		warning: vi.fn(),
	}),
}));

import { toast } from "react-toastify";
import {
	toastWithLink,
	toastSuccessWithLink,
	toastErrorWithLink,
	toastWarningWithLink,
	toastInfoWithLink,
} from "./toastWithLink";

describe("toastWithLink utilities", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("calls toast with message and link when provided", () => {
		(toast as any).mockImplementation(() => "ok");
		toastWithLink("More", { text: "click", href: "https://ex" } as any);
		expect(toast as any).toHaveBeenCalled();
		const firstArg = (toast as any).mock.calls[0][0];
		expect(firstArg.props.children[0].props.children).toBe("More");
	});

	it("preserves the non-wrapping link attributes", () => {
		(toast as any).mockImplementation(() => "ok");
		toastWithLink("More", { text: "click", href: "https://example.com" });

		const link = (toast as any).mock.calls[0][0].props.children[1];
		expect(link.props).toMatchObject({
			href: "https://example.com",
			target: "_blank",
			rel: "noopener noreferrer",
			style: {
				color: "#fff",
				fontStyle: "italic",
				textDecoration: "underline",
				whiteSpace: "nowrap",
			},
		});
	});

	it("calls toast.success/error/warning/info variants", () => {
		const spySuccess = vi.spyOn(toast as any, "success").mockImplementation(() => "ok");
		const spyError = vi.spyOn(toast as any, "error").mockImplementation(() => "ok");
		const spyWarn = vi.spyOn(toast as any, "warning").mockImplementation(() => "ok");
		const spyInfo = vi.spyOn(toast as any, "info").mockImplementation(() => "ok");

		toastSuccessWithLink("S", { text: "c", href: "h" } as any);
		expect(spySuccess).toHaveBeenCalled();

		toastErrorWithLink("E", { text: "c", href: "h" } as any);
		expect(spyError).toHaveBeenCalled();

		toastWarningWithLink("W", { text: "c", href: "h" } as any);
		expect(spyWarn).toHaveBeenCalled();

		toastInfoWithLink("I", { text: "c", href: "h" } as any);
		expect(spyInfo).toHaveBeenCalled();

		spySuccess.mockRestore();
		spyError.mockRestore();
		spyWarn.mockRestore();
		spyInfo.mockRestore();
	});
});
