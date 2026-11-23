import {
    formatModShortcut,
    Kbd,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@lemma/ui";
import { useTranslation } from "react-i18next";

import { useStartSession } from "./useStartSession";

/** The sidebar button that opens the home view for a new session, showing a hover-revealed platform shortcut badge. */
export function NewSessionButton() {
    const { t } = useTranslation();
    const start = useStartSession();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    aria-keyshortcuts="Control+N Meta+N"
                    className="justify-between"
                    onClick={start}
                >
                    <span className="truncate">
                        {t("sidebar.startSession")}
                    </span>
                    <span
                        aria-hidden="true"
                        className="opacity-0 transition-opacity duration-fast group-hover/menu-button:opacity-100 group-focus-visible/menu-button:opacity-100"
                    >
                        <Kbd>{formatModShortcut("n")}</Kbd>
                    </span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
