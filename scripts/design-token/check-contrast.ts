import { THEMES, type Theme, type ThemeName } from "./read-theme.ts";

const MIN_CONTRAST = 4.5;

const SURFACE_ROLES = [
    "background",
    "card",
    "popover",
    "muted",
    "sidebar",
    "control",
    "accent",
    "selected",
] as const;

const TEXT_ROLES = [
    "foreground",
    "muted-foreground",
    "subtle-foreground",
    "link",
    "primary",
    "destructive",
    "success",
    "warning",
] as const;

const PRIMARY_SURFACES = ["primary", "primary-hover"] as const;

/** Verifies every text and status role reaches at least 4.5:1 contrast across all theme surfaces, and `primary-foreground` reaches 4.5:1 on `primary` and `primary-hover`. */
export function checkThemeContrast(themes: Record<ThemeName, Theme>): void {
    const failures: string[] = [];
    for (const themeName of THEMES) {
        const theme = themes[themeName];
        for (const textRole of TEXT_ROLES) {
            const fg = requireOpaqueColor(theme, themeName, textRole);
            for (const surfaceRole of SURFACE_ROLES) {
                const bg = requireOpaqueColor(theme, themeName, surfaceRole);
                const ratio = contrastRatio(fg, bg);
                if (ratio < MIN_CONTRAST) {
                    failures.push(
                        `${themeName}: ${textRole} (${fg}) on ${surfaceRole} (${bg}) is ${ratio.toFixed(2)}:1 (< ${MIN_CONTRAST}:1)`,
                    );
                }
            }
        }
        const primaryFg = requireOpaqueColor(
            theme,
            themeName,
            "primary-foreground",
        );
        for (const primarySurface of PRIMARY_SURFACES) {
            const bg = requireOpaqueColor(theme, themeName, primarySurface);
            const ratio = contrastRatio(primaryFg, bg);
            if (ratio < MIN_CONTRAST) {
                failures.push(
                    `${themeName}: primary-foreground (${primaryFg}) on ${primarySurface} (${bg}) is ${ratio.toFixed(2)}:1 (< ${MIN_CONTRAST}:1)`,
                );
            }
        }
    }
    if (failures.length > 0) {
        throw new Error(
            `Theme contrast check failed:\n  ${failures.join("\n  ")}`,
        );
    }
}

/** Computes the WCAG 2.1 contrast ratio between two `#rrggbb` colors. */
export function contrastRatio(hexA: string, hexB: string): number {
    const lumA = relativeLuminance(hexA);
    const lumB = relativeLuminance(hexB);
    return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
}

function requireOpaqueColor(
    theme: Theme,
    themeName: ThemeName,
    role: string,
): string {
    const hex = theme.get(role);
    if (hex === undefined || hex.length !== 7) {
        throw new Error(
            `${themeName}.${role} must be defined as an opaque #rrggbb color`,
        );
    }
    return hex;
}

function relativeLuminance(hex: string): number {
    const r = channelLuminance(Number.parseInt(hex.slice(1, 3), 16) / 255);
    const g = channelLuminance(Number.parseInt(hex.slice(3, 5), 16) / 255);
    const b = channelLuminance(Number.parseInt(hex.slice(5, 7), 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function channelLuminance(srgb: number): number {
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}
