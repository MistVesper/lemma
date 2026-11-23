import { Tooltip, TooltipContent, TooltipTrigger } from "@lemma/ui";

import { lastPathSegment } from "../tool-output";

interface SessionDirectoryBadgeProps {
    directory: string;
}

/** Read-only session directory badge shown in the composer footer of a bound session. */
export function SessionDirectoryBadge({
    directory,
}: SessionDirectoryBadgeProps) {
    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <span className="inline-flex h-7 max-w-48 items-center truncate rounded-md px-2 font-sans text-small text-subtle-foreground" />
                }
            >
                {lastPathSegment(directory)}
            </TooltipTrigger>
            <TooltipContent>{directory}</TooltipContent>
        </Tooltip>
    );
}
