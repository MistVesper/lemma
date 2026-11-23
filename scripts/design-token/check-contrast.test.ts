import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { ROOT_DIR } from "../shared/repository.ts";
import { checkThemeContrast, contrastRatio } from "./check-contrast.ts";
import { readThemes } from "./read-theme.ts";
import { readTokenFile } from "./token-tree.ts";

void test("contrastRatio computes WCAG luminance ratios", () => {
    assert.equal(contrastRatio("#ffffff", "#000000"), 21);
    assert.equal(contrastRatio("#161618", "#161618"), 1);
});

void test("repository tokens pass 4.5:1 contrast across all surfaces", () => {
    const tokensPath = path.join(ROOT_DIR, "design/tokens.json");
    const themes = readThemes(readTokenFile(tokensPath), tokensPath);
    assert.doesNotThrow(() => checkThemeContrast(themes));
});

void test("checkThemeContrast rejects low-contrast text roles", () => {
    const tokensPath = path.join(ROOT_DIR, "design/tokens.json");
    const themes = readThemes(readTokenFile(tokensPath), tokensPath);
    themes.light.set("link", "#8abfff");
    assert.throws(
        () => checkThemeContrast(themes),
        /light: link \(#8abfff\) on background/u,
    );
});
