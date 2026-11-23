import type { ComponentProps, Ref } from "react";

import { SearchIcon } from "#icons/search";
import { cn } from "#lib/cn";

type SearchFieldProps = Pick<
    ComponentProps<"input">,
    | "id"
    | "value"
    | "onChange"
    | "onKeyDown"
    | "placeholder"
    | "aria-label"
    | "aria-controls"
    | "disabled"
>;

type SearchInputProps = SearchFieldProps & {
    inputRef?: Ref<HTMLInputElement> | undefined;
    variant?: "field" | "flush" | undefined;
};

/** Search box with a leading magnifier icon, either bordered (`field`) or divider-bottom (`flush`) inside popovers. */
export function SearchInput({
    inputRef,
    variant = "field",
    placeholder,
    "aria-label": ariaLabel,
    ...props
}: SearchInputProps) {
    return (
        <div
            data-slot="search-input"
            data-variant={variant}
            className={cn(
                "flex items-center gap-2 transition-colors duration-base",
                variant === "flush"
                    ? "border-b border-border px-3 py-2"
                    : "h-8 rounded-md border border-input bg-control px-2.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25",
            )}
        >
            <SearchIcon
                aria-hidden="true"
                className="size-3.5 shrink-0 text-subtle-foreground"
            />
            <input
                ref={inputRef}
                type="search"
                placeholder={placeholder}
                aria-label={ariaLabel ?? placeholder}
                className="min-w-0 flex-1 bg-transparent text-body text-foreground outline-none placeholder:text-subtle-foreground disabled:cursor-not-allowed disabled:opacity-50"
                {...props}
            />
        </div>
    );
}
