import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { Kbd } from "./kbd";

it("renders a sans-serif shortcut badge", () => {
    render(<Kbd>Ctrl N</Kbd>);

    const kbd = screen.getByText("Ctrl N");
    expect(kbd.tagName).toBe("KBD");
    expect(kbd.dataset.slot).toBe("kbd");
    expect(kbd.className).toContain("font-sans");
});
