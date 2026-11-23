import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

import { Checkbox } from "./checkbox";
import { FieldDescription, FieldError } from "./field";
import { Input } from "./input";
import { Label } from "./label";
import { Switch } from "./switch";

it("describes a labeled control and reports its error", async () => {
    const user = userEvent.setup();
    render(
        <>
            <Label htmlFor="name">Name</Label>
            <Input id="name" aria-invalid />
            <FieldDescription>Shown to you only.</FieldDescription>
            <FieldError>Name is taken</FieldError>
        </>,
    );

    await user.type(screen.getByRole("textbox", { name: "Name" }), "Acme");

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveProperty(
        "value",
        "Acme",
    );
    expect(screen.getByText("Shown to you only.")).toBeDefined();
    expect(screen.getByRole("alert").textContent).toBe("Name is taken");
});

it("toggles labeled checkboxes and switches", async () => {
    const user = userEvent.setup();
    render(
        <>
            <Checkbox id="agree" />
            <Label htmlFor="agree">Agree</Label>
            <Label htmlFor="enabled">Enabled</Label>
            <Switch id="enabled" />
        </>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Agree" });
    const toggle = screen.getByRole("switch", { name: "Enabled" });

    await user.click(checkbox);
    await user.click(toggle);

    expect(checkbox.getAttribute("aria-checked")).toBe("true");
    expect(toggle.getAttribute("aria-checked")).toBe("true");
});
