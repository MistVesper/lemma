import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, it } from "vitest";

import { Button } from "./button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./dialog";

function RenameDialog(props: { closeLabel?: string; size?: "default" | "lg" }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Rename</Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent {...props}>
                    <DialogHeader>
                        <DialogTitle>Rename provider</DialogTitle>
                        <DialogDescription>Pick a new name.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline" />}>
                            Cancel
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

const closed = () =>
    waitFor(() => {
        expect(screen.queryByRole("dialog")).toBeNull();
    });

it("opens a titled, described dialog that its footer button closes", async () => {
    const user = userEvent.setup();
    render(<RenameDialog />);

    await user.click(screen.getByRole("button", { name: "Rename" }));

    const element = await screen.findByRole("dialog", {
        name: "Rename provider",
    });
    expect(screen.getByText("Pick a new name.").id).toBe(
        element.getAttribute("aria-describedby"),
    );
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await closed();
});

it("exposes the large width variant", async () => {
    const user = userEvent.setup();
    render(<RenameDialog size="lg" />);

    await user.click(screen.getByRole("button", { name: "Rename" }));

    expect((await screen.findByRole("dialog")).dataset.size).toBe("lg");
});

it("closes from its labeled close button", async () => {
    const user = userEvent.setup();
    render(<RenameDialog closeLabel="Close" />);
    await user.click(screen.getByRole("button", { name: "Rename" }));

    await user.click(await screen.findByRole("button", { name: "Close" }));

    await closed();
    expect(screen.queryByRole("dialog")).toBeNull();
});
