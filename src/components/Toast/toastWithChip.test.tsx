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
	toastWithChip,
	toastSuccessWithChip,
	toastErrorWithChip,
	toastWarningWithChip,
	toastInfoWithChip,
	toastLinkWithChip,
} from "./toastWithChip";

describe("toastWithChip utilities", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("calls toast with provided message and chip", () => {
		(toast as any).mockImplementation(() => "ok");
		toastWithChip("Hello", { children: "C" });
		expect(toast as any).toHaveBeenCalled();
		const firstArg = (toast as any).mock.calls[0][0];
		expect(firstArg.props.children[0].props.children).toBe("Hello");
	});

	it("calls toast.success when using toastSuccessWithChip", () => {
		const spy = vi.spyOn(toast as any, "success").mockImplementation(() => "ok");
		toastSuccessWithChip("Done", { children: "OK" });
		expect(spy).toHaveBeenCalled();
		const firstArg = (spy as any).mock.calls[0][0];
		expect((firstArg as any).props.children[0].props.children).toBe("Done");
		spy.mockRestore();
	});

	it("calls toast.error/warning/info accordingly", () => {
		const spyError = vi.spyOn(toast as any, "error").mockImplementation(() => "err");
		const spyWarn = vi.spyOn(toast as any, "warning").mockImplementation(() => "warn");
		const spyInfo = vi.spyOn(toast as any, "info").mockImplementation(() => "info");

		toastErrorWithChip("Err");
		expect(spyError).toHaveBeenCalled();

		toastWarningWithChip("W");
		expect(spyWarn).toHaveBeenCalled();

		toastInfoWithChip("I");
		expect(spyInfo).toHaveBeenCalled();

		spyError.mockRestore();
		spyWarn.mockRestore();
		spyInfo.mockRestore();
	});

	it("renders link content and chip when provided", () => {
		(toast as any).mockImplementation(() => "ok");
		toastLinkWithChip("Click", "https://example.com", { children: "chip" }, {
			className: "x",
		} as any);
		expect(toast as any).toHaveBeenCalled();
		const firstArg = (toast as any).mock.calls[0][0];
		expect(firstArg.props.children[0].props.children).toBe("Click");
	});
});
