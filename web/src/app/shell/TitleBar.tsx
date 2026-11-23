import { useTheme } from "next-themes";
import { useEffect } from "react";

import { getPlatform } from "@/platform/platform";

/** Transparent desktop drag strip; syncs Electron's native window control overlay to the active theme's canvas background. */
export function TitleBar() {
    const { titlebarHeight, window: windowCaps } = getPlatform();
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        windowCaps.setTitleBar({
            theme: resolvedTheme === "dark" ? "dark" : "light",
            surface: "background",
        });
    }, [windowCaps, resolvedTheme]);

    return titlebarHeight > 0 ? (
        <div
            className="app-titlebar"
            onDoubleClick={() => {
                windowCaps.toggleMaximize();
            }}
        />
    ) : null;
}
