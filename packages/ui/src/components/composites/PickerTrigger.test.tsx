import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";

import { PickerTrigger } from "./PickerTrigger";

it("renders leading adornment, chevron, and click handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn<() => void>();
    const { rerender } = render(
        <PickerTrigger label="Default workspace" chevron onClick={onClick} />,
    );

    const button = screen.getByRole("button", { name: "Default workspace" });
    expect(button.dataset.slot).toBe("picker-trigger");
    expect(button.querySelectorAll("svg")).toHaveLength(1);
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
        <PickerTrigger label="2 paths" leading={<span data-testid="dot" />} />,
    );
    expect(screen.getByTestId("dot")).toBeDefined();
    expect(
        screen.getByRole("button", { name: "2 paths" }).querySelectorAll("svg"),
    ).toHaveLength(0);
});
