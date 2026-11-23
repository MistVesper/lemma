const APPLE_PLATFORM_RE = /Mac|iPhone|iPad|iPod/iu;

/** Returns true when a global keyboard shortcut should be ignored (already handled, IME composing, or focused inside an editable control). */
export function isShortcutIgnored(event: KeyboardEvent): boolean {
    if (event.defaultPrevented || event.isComposing) {
        return true;
    }
    const target = event.target;
    return (
        target instanceof Element &&
        target.closest(
            'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
        ) !== null
    );
}

/** Formats a primary-modifier shortcut (`⌘K` on Apple platforms, `Ctrl K` elsewhere). */
export function formatModShortcut(
    key: string,
    platform = navigator.platform,
): string {
    const upper = key.toUpperCase();
    return APPLE_PLATFORM_RE.test(platform) ? `⌘${upper}` : `Ctrl ${upper}`;
}
