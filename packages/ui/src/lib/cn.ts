import { createCn } from "cn/config";

export const TYPE_ROLES = [
    "caption",
    "small",
    "body",
    "reading",
    "title",
    "heading",
    "display",
] as const;

/** Joins class names and resolves Tailwind conflicts, treating the theme's type roles as font sizes rather than text colors. */
export const cn = createCn({
    extend: {
        classGroups: {
            "font-size": [
                {
                    text: [...TYPE_ROLES],
                },
            ],
        },
    },
});
