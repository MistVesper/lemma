import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, it } from "vitest";

import { SearchInput } from "./SearchInput";

function Harness({ variant }: { variant?: "field" | "flush" }) {
    const [value, setValue] = useState("");
    return (
        <SearchInput
            variant={variant}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            placeholder="Filter items"
        />
    );
}

it("renders bordered and flush search inputs", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Harness />);

    const box = screen.getByRole("searchbox", { name: "Filter items" });
    expect(
        box.closest<HTMLElement>("[data-slot='search-input']")?.dataset.variant,
    ).toBe("field");
    await user.type(box, "abc");
    expect(box).toHaveProperty("value", "abc");

    rerender(<Harness variant="flush" />);
    expect(
        box.closest<HTMLElement>("[data-slot='search-input']")?.dataset.variant,
    ).toBe("flush");
});
