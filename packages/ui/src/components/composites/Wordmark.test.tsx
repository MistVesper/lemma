import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { Wordmark } from "./Wordmark";

it("renders vector wordmark scales with accessible label and brand dot", () => {
    const { rerender } = render(<Wordmark label="Lemma" />);

    const wordmark = screen.getByRole("img", { name: "Lemma" });
    expect(wordmark.dataset.slot).toBe("wordmark");
    expect(wordmark.dataset.size).toBe("default");
    expect(wordmark.querySelector("circle")?.getAttribute("class")).toContain(
        "fill-brand",
    );

    rerender(<Wordmark label="Lemma" size="lg" />);
    expect(screen.getByRole("img", { name: "Lemma" }).dataset.size).toBe("lg");

    rerender(<Wordmark label="Lemma" size="splash" />);
    expect(screen.getByRole("img", { name: "Lemma" }).dataset.size).toBe(
        "splash",
    );
});
