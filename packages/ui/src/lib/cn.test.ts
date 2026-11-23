import { describe, expect, it } from "vitest";

import { cn, TYPE_ROLES } from "./cn";

describe("cn", () => {
    it("preserves text color utilities alongside every typography role", () => {
        for (const role of TYPE_ROLES) {
            expect(cn("text-foreground", `text-${role}`)).toBe(
                `text-foreground text-${role}`,
            );
            expect(cn(`text-${role}`, "text-muted-foreground")).toBe(
                `text-${role} text-muted-foreground`,
            );
        }
    });

    it("merges competing typography roles in favor of the last one", () => {
        expect(cn("text-body", "text-heading")).toBe("text-heading");
    });
});
