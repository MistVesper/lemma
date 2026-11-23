import { Popover } from "@base-ui/react/popover";
import {
    isValidElement,
    useId,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from "react";

import {
    AnchoredPickerGroupView,
    type AnchoredPickerGroup,
    type AnchoredPickerItem,
} from "./AnchoredPickerGroupView";
import { SearchInput } from "./SearchInput";

export type {
    AnchoredPickerGroup,
    AnchoredPickerItem,
} from "./AnchoredPickerGroupView";

type AnchoredPickerFooterAction = {
    label: string;
    onSelect: () => void;
};

type AnchoredPickerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger: ReactNode;
    searchPlaceholder: string;
    emptyText: string;
    groups: AnchoredPickerGroup[];
    footerAction?: AnchoredPickerFooterAction | undefined;
    side?: "top" | "bottom" | undefined;
};

/** 340px anchored searchable picker popover with grouped options and keyboard navigation. */
export function AnchoredPicker({
    open,
    onOpenChange,
    trigger,
    searchPlaceholder,
    emptyText,
    groups,
    footerAction,
    side = "bottom",
}: AnchoredPickerProps) {
    const baseId = useId();
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setQuery("");
            setActiveIndex(0);
        }
        onOpenChange(nextOpen);
    };

    const { groupedEntries, flatItems } = useMemo(() => {
        const needle = query.trim().toLowerCase();
        const filtered =
            needle === ""
                ? groups.filter(
                      (group) =>
                          group.items.length > 0 ||
                          (group.actionLabel !== undefined &&
                              group.onAction !== undefined),
                  )
                : groups
                      .map((group) => ({
                          ...group,
                          items: group.items.filter(
                              (item) =>
                                  item.label.toLowerCase().includes(needle) ||
                                  (item.sublabel
                                      ?.toLowerCase()
                                      .includes(needle) ??
                                      false),
                          ),
                      }))
                      .filter((group) => group.items.length > 0);
        const flat: AnchoredPickerItem[] = [];
        const entries = filtered.map((group) => {
            const offset = flat.length;
            flat.push(...group.items);
            return { group, offset };
        });
        return { groupedEntries: entries, flatItems: flat };
    }, [groups, query]);

    const safeIndex =
        flatItems.length === 0
            ? -1
            : Math.min(activeIndex, flatItems.length - 1);
    const activeItem = flatItems[safeIndex];
    const activeOptionId =
        activeItem === undefined ? undefined : `${baseId}-opt-${activeItem.id}`;

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
            event.preventDefault();
            handleOpenChange(false);
            return;
        }
        if (event.key === "ArrowDown" && flatItems.length > 0) {
            event.preventDefault();
            setActiveIndex((current) => (current + 1) % flatItems.length);
        } else if (event.key === "ArrowUp" && flatItems.length > 0) {
            event.preventDefault();
            setActiveIndex(
                (current) =>
                    (current - 1 + flatItems.length) % flatItems.length,
            );
        } else if (
            event.key === "Enter" &&
            event.target instanceof HTMLInputElement &&
            activeItem !== undefined
        ) {
            event.preventDefault();
            activeItem.onSelect();
            handleOpenChange(false);
        }
    };

    return (
        <Popover.Root open={open} onOpenChange={handleOpenChange}>
            {isValidElement(trigger) ? (
                <Popover.Trigger render={trigger} />
            ) : (
                <Popover.Trigger>{trigger}</Popover.Trigger>
            )}
            <Popover.Portal>
                <Popover.Positioner
                    align="start"
                    side={side}
                    sideOffset={6}
                    className="isolate z-50 outline-none"
                >
                    <Popover.Popup
                        initialFocus={searchInputRef}
                        onKeyDown={handleKeyDown}
                        className="w-85 origin-(--transform-origin) overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-overlay duration-base ease-enter outline-none data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:duration-fast data-closed:ease-exit data-closed:fade-out-0 data-closed:zoom-out-95"
                    >
                        <SearchInput
                            inputRef={searchInputRef}
                            variant="flush"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.currentTarget.value);
                                setActiveIndex(0);
                            }}
                            placeholder={searchPlaceholder}
                            aria-controls={`${baseId}-list`}
                        />
                        <div
                            id={`${baseId}-list`}
                            role="listbox"
                            tabIndex={-1}
                            aria-label={searchPlaceholder}
                            aria-activedescendant={activeOptionId}
                            className="max-h-72 overflow-y-auto p-1"
                        >
                            {groupedEntries.length === 0 ? (
                                <div
                                    role="presentation"
                                    className="px-2 py-6 text-center text-small text-muted-foreground"
                                >
                                    {emptyText}
                                </div>
                            ) : (
                                groupedEntries.map(({ group, offset }) => (
                                    <AnchoredPickerGroupView
                                        key={group.id}
                                        baseId={baseId}
                                        group={group}
                                        offset={offset}
                                        safeIndex={safeIndex}
                                        onHoverIndex={setActiveIndex}
                                        onSelectItem={(item) => {
                                            item.onSelect();
                                            handleOpenChange(false);
                                        }}
                                    />
                                ))
                            )}
                        </div>
                        {footerAction !== undefined && (
                            <div className="border-t border-border p-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        footerAction.onSelect();
                                        handleOpenChange(false);
                                    }}
                                    className="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-left text-small text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
                                >
                                    {footerAction.label}
                                </button>
                            </div>
                        )}
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    );
}
