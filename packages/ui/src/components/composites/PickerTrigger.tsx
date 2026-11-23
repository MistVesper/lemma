import type { ComponentProps, ReactNode } from "react";

import { ChevronDownIcon } from "#icons/chevron-down";

type NativeTriggerProps = Pick<
    ComponentProps<"button">,
    | "id"
    | "ref"
    | "disabled"
    | "onClick"
    | "onKeyDown"
    | "onPointerDown"
    | "onFocus"
    | "onBlur"
    | "aria-label"
    | "aria-expanded"
    | "aria-controls"
    | "aria-haspopup"
>;

type PickerTriggerProps = NativeTriggerProps & {
    label: string;
    leading?: ReactNode;
    chevron?: boolean | undefined;
};

/** Compact sans-serif trigger pill for inline pickers and footer status toggles. */
export function PickerTrigger({
    label,
    leading,
    chevron = false,
    ...props
}: PickerTriggerProps) {
    return (
        <button
            type="button"
            data-slot="picker-trigger"
            className="inline-flex h-7 max-w-48 cursor-pointer items-center gap-1.5 rounded-md px-2 font-sans text-small text-muted-foreground transition-colors duration-base outline-none select-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 aria-expanded:bg-accent aria-expanded:text-foreground"
            {...props}
        >
            {leading !== undefined && (
                <span aria-hidden="true" className="inline-flex shrink-0">
                    {leading}
                </span>
            )}
            <span className="min-w-0 truncate">{label}</span>
            {chevron && (
                <span aria-hidden="true" className="inline-flex shrink-0">
                    <ChevronDownIcon size={14} />
                </span>
            )}
        </button>
    );
}
