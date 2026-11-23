# Measured passes

Run each pass independently from the repository root so `.jscpd.json` and `knip.json` apply; pass a positional path to narrow scope. Always cite the exact flags alongside reported counts.

## 1. Duplication pass

`.jscpd.json` excludes tests, JSON, TOML, XML, and Markdown (`minTokens` `70`, `minLines` `8`). Handle exact clones (`just dup-check` or `npx --no-install jscpd --reporters ai --summary --no-tips`) before normalized runs, one detector family at a time:

```sh
npx --no-install jscpd --reporters ai --no-tips --ignore-identifiers --min-tokens 90
npx --no-install jscpd --reporters ai --no-tips --max-gap-lines 1 --similarity 0.85
```

1. Rank by large files with high `dup%`, read only the reported line ranges, and diff what diverges in `(renamed)`, `[~N gap]`, and `[~N ast]` pairs.
2. **Skip and record why** when: the blocks operate on distinct domain types/enums despite shared structure; the repetition is intentional boilerplate (proto-to-domain mappings, SeaORM entities/migrations, vendor provider adapters, per-feature store setup in `web/src/features/*/store.ts`, route/RPC registration); the file is generated (`web/src/gen`, `desktop/src/gen`, proto/UniFFI bindings, `LemmaTokens.kt`); the abstraction would force a vague name (`processData`); or the pair is under ~10 lines.
3. **Refactor by clone kind** (place shared code per [lemma-code-style](../../lemma-code-style/SKILL.md#source-files), using an existing shared crate rather than creating a new crate):
   - **Exact block:** extract a function named for its behavior, or a module when spanning features.
   - **Literal-only `(renamed)`:** extract a constant; **identifier `(renamed)`:** parameterize what varies (many in one file usually signal one missing data structure or helper).
   - **`[~N gap]`:** extract the shared body and pass the divergent step in or hoist it to callers; if the gap changes semantics, extract only the shared halves.
   - **`[~N ast]`:** extract the skeleton and pass differences as parameters or closures (pairs below `0.8` usually share only an idiom).
4. Re-run jscpd **with the same flags** (`(renamed)` clones require `--ignore-identifiers` to re-verify) and confirm `dup%` dropped.

## 2. Dead-code pass

Tools traverse from entry points, so deleting one dead item exposes its callees; loop in small batches until clean.

- **TypeScript (`web`, `desktop`, `packages`, `scripts`):** run `just deadcode-check` (`knip`). Never use `jscpd --dead-code` for TypeScript — it misses Electron and script entries.
- **Rust:** with user consent to compile ([AGENTS.md](../../../../AGENTS.md#verification)), run:

  ```sh
  cargo check --workspace --message-format=json | npx --no-install jscpd --dead-code --rust-diagnostics - --reporters ai --no-tips
  ```

  Cross-crate `pub` items emit no compiler warning; check references across `crates/` before deleting.

Before every deletion (unused file, export/`pub` visibility, symbol, import, or manifest dependency + lockfile), search the whole repository including `justfile`, `.github/workflows/`, `scripts/`, `proto/`, string lookups, UniFFI consumers in `mobile/`, Node-API consumers in `desktop/`, `web/index.html`, and Electron Forge config. Hand declared capabilities with no consumer (RPC fields, config keys) to [lemma-prune](../../lemma-prune/SKILL.md) instead of deleting them silently.

## 3. Complexity pass

```sh
npx --no-install jscpd --complexity --reporters ai --summary-top 10 --no-tips
npx --no-install jscpd --reporters ai --summary --summary-by complexity --no-tips
```

`cx` estimates cyclomatic complexity (`50+` marks a health-score hotspot; large files with low `cx` are size splits rather than branch complexity). Read top files, name the driver, and apply the matching fix without rewriting behavior:

- **Deep nesting:** guard clauses and early returns (`?` and `let ... else` in Rust; keep braces on `if`).
- **Multi-responsibility function:** extract one function per responsibility.
- **Repeated branching over fixed cases:** exhaustive `match` / union `switch` or a lookup table.
- **Multi-concern file:** split along responsibility seams per [lemma-code-style](../../lemma-code-style/SKILL.md#source-files).

Re-run `--complexity` on touched files and confirm per-function `cx` dropped rather than merely moving across files.
