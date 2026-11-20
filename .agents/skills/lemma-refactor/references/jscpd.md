# jscpd reference

Options and output used by measured passes (jscpd 5.4; `npx --no-install jscpd --help` lists all options).

## AI reporter output

```text
Clones:
src/ foo.ts:10-25 ~ bar.ts:42-57
src/cart/ basket.ts:1-9 ~ cart.ts:1-9 (renamed)
src/api/ save-account.ts:1-12 ~ save-user.ts:1-11 [~0.91 gap]
src/billing/ orders.ts:1-14 ~ refunds.ts:1-15 [~0.85 ast]
---
5 clones · 4.2% duplication
```

Shared path prefixes print once. No suffix = exact copy; `(renamed)` = differs only in names, literals, or annotations; `[~N gap]` = exact clones merged across unmatched lines (`N` = matched tokens over span); `[~N ast]` = functions sharing `N` of their normalized syntax subtrees.

## Options

| Option | Effect |
| --- | --- |
| `--reporters ai` | Compact clone list for agents (`json` writes a parseable report) |
| `--no-tips` | Omit output tips |
| `--min-tokens N` / `--min-lines N` | Smallest clone reported (`.jscpd.json` sets `70` and `8`) |
| `--format "list"` | Restrict languages, e.g. `typescript,rust,kotlin` |
| `--ignore-identifiers` | Match names one-to-one (renamed clones) |
| `--ignore-literals` | Match strings to strings and numbers to numbers (renamed clones) |
| `--ignore-annotations` | Ignore `@Name` annotations in Kotlin and TypeScript |
| `--max-gap-lines N` | Merge exact clones separated by at most `N` unmatched lines (gap clones) |
| `--similarity [RATIO]` | Pair functions sharing `RATIO` (default `0.8`) of normalized subtrees across TS, Rust, Kotlin; excludes tests |
| `--min-nodes N` | Smallest function AST `--similarity` compares (default `20`) |
| `--kind list` | Filter output to `exact`, `renamed`, `similar`, `gap`, or `ast` (never enables a detector) |
| `--summary` | Append top files and folders by tokens, lines, size, `cx`, and `dup%` |
| `--summary-by metric` / `--summary-top N` | Rank summary by `tokens`, `lines`, `size`, or `complexity` (default top `10`) |
| `--complexity` | Complexity tables only, without clone detection |
| `--health` | `0–100` score and grade from duplication, dead code, and complexity |
| `--dashboard` | Single-screen summary of score, size, duplication, complexity, and dead code |
| `--dead-code` | Unused files, exports, symbols, and imports; `--rust-diagnostics -` reads Cargo JSON diagnostics from stdin |

## Noise in normalized runs

Normalized runs ignore identifiers, literals, or gaps that often separate distinct domain logic, so treat every hit as a lead. Start tight (`--ignore-identifiers` alone, `--max-gap-lines` `1`–`2`, `--similarity` `0.85+`) and widen only when empty. Normalized fingerprints differ from exact runs; CI gates on exact runs (`just dup-check`) only.
