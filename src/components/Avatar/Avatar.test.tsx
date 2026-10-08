import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Avatar } from "./Avatar";
import * as initialsUtil from "../../utils/get.initials.util";

describe("<Avatar />", () => {
	it("renders with avatarUserName and displays initials", () => {
		vi.spyOn(initialsUtil, "getInitials").mockReturnValue("AB");

		render(<Avatar avatarUserName="Alice Bob" iconSize="md" />);

		const container = screen.getByLabelText("Avatar do usuário Alice Bob");
		expect(container).toBeInTheDocument();

		const initials = screen.getByText("AB");
		expect(initials).toBeInTheDocument();
	});

	it("renders generic avatar when no avatarUserName is provided", () => {
		render(<Avatar iconSize="sm" />);

		const container = screen.getByLabelText("Avatar de usuário genérico");
		expect(container).toBeInTheDocument();

		const svgIcon = container.querySelector("svg");
		expect(svgIcon).toBeInTheDocument();
	});

	it("applies bordered class when bordered prop is true", () => {
		render(<Avatar bordered avatarUserName="Test" />);
		const container = screen.getByLabelText("Avatar do usuário Test");
		expect(container.className).toContain("border");
	});

	it("renders status indicator with correct color", () => {
		render(<Avatar avatarUserName="User" status="away" iconSize="md" />);
		const container = screen.getByLabelText("Avatar do usuário User");

		const statusSpan = container.querySelector("span[aria-hidden='true']:last-child");
		expect(statusSpan).toHaveStyle(`background-color: ${"#C1290B"}`);
	});

	it("renders different sizes correctly", () => {
		render(<Avatar avatarUserName="User" iconSize="xl" />);
		const container = screen.getByLabelText("Avatar do usuário User");
		expect(container).toHaveStyle({ width: "56px", height: "56px" });
	});

	it("forwards additional props to container", () => {
		render(<Avatar avatarUserName="User" data-testid="avatar-test" />);
		expect(screen.getByTestId("avatar-test")).toBeInTheDocument();
	});
});
