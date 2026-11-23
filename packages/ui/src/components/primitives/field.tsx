import { cn } from "#lib/cn";

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (
        <p
            data-slot="field-description"
            className={cn(
                "text-left text-small font-normal text-muted-foreground [[data-variant=legend]+&]:-mt-1.5",
                "last:mt-0 nth-last-2:-mt-1",
                "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
                className,
            )}
            {...props}
        />
    );
}

function FieldError({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            role="alert"
            data-slot="field-error"
            className={cn(
                "animate-in text-small font-normal text-destructive duration-base ease-enter fade-in-0 slide-in-from-bottom-1",
                className,
            )}
            {...props}
        />
    );
}

export { FieldDescription, FieldError };
