import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./sheet";

it("opens a titled sheet on its side that Escape closes", async () => {
    const user = userEvent.setup();
    render(
        <Sheet defaultOpen>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
            </SheetContent>
        </Sheet>,
    );

    expect(
        (await screen.findByRole("dialog", { name: "Filters" })).dataset.side,
    ).toBe("right");

    await user.keyboard("{Escape}");

    await waitFor(() => {
        expect(screen.queryByRole("dialog")).toBeNull();
    });
});
