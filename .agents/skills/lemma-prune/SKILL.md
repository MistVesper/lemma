---
name: lemma-prune
description: Use when auditing Lemma code, APIs, proto contracts, configuration, tests, docs, or dependencies for removable maintenance obligations — unused or half-wired features, redundant states or caches, over-scoped capabilities, or replaceable dependencies — or when assessing a proposed removal.
---

# Pruning Lemma obligations

Find changes that remove maintained obligations — APIs, proto fields, states, configuration paths, dependencies, tests, or documentation — preferring a few well-evidenced candidates over raw deletion counts. Distinguish a survey from permission to implement its proposals; behavior-preserving code cleanup belongs to [lemma-refactor](../lemma-refactor/SKILL.md), and module interface deepening belongs to [lemma-improve-architecture](../lemma-improve-architecture/SKILL.md).

## Scope and settled boundaries

Read the root [AGENTS.md](../../../AGENTS.md), [architecture.md](../../../docs/architecture.md) (before judging crates), [testing.md](../../../docs/testing.md), the subtree `AGENTS.md`, and `git log` on the files involved. Treat the boundaries mapped in `architecture.md` — the host runtimes, engine and SQLite schema, provider adapters, and shared Connect contract — as intentional unless the user reopens them; unused members inside an intentional design remain removable when the design's purpose survives.

For broad surveys, split independent domains across subagents (turn loop and session tree; providers, adapters, and crypto; RPC crates and proto; web client; desktop shell; Android; scripts, CI, and docs) and require consumer evidence plus the strongest retention argument from each.

## Obligation probes

- **Complete effect path:** trace producer, transformations, and observable consumer effect, checking constructors and enum emitters alongside readers. Flag fields copied without a setter or reader, and RPCs or options accepted and ignored.
- **Actionable distinctions:** collapse public states or flags that trigger identical consumer behavior; retain distinctions governing authorization, durability, or ownership.
- **Subsystem vs. narrower behavior:** check whether a smaller explicit rule deletes a whole mechanism; when a production caller exists, present the capability trade-off to the user.
- **Single source of truth:** hunt hand-synchronized copies — client caches shadowing server state, parallel enums mapped 1:1, or prose inventories duplicating source or config.
- **Net maintenance cost:** trace pass-through config, duplicated component trees, and helpers with independent upgrade lifecycles; relocating complexity or adding a sync check is not a reduction.

## Reachability, ownership, and dependencies

Search exact symbols, field reads/writes, enum variants, generated proto fields across Rust/TypeScript/Kotlin, config keys, environment variables, and `justfile` recipes across the full [repository layout](../../../AGENTS.md#repository-layout), including `.github/workflows/` and `scripts/`. Tests and type declarations prove a contract, not a shipped producer or consumer. Removing a proto field requires `reserved` on its field number.

Classify each candidate with its owner, producer/consumer path, removed cost, remaining surface, and strongest retention argument:

- unreachable or unread behavior (safe removal);
- narrower behavior with an explicit capability loss (user decision);
- protected obligation or insufficient evidence (reject, along with changes that merely move complexity).

Preserve value ownership, trust boundaries, async task/channel cancellation, and user-started partial work (such as an interrupted turn's partial message). Replace a dependency or build custom glue only for a net reduction after checking existing workspace crates/packages, standard libraries, Node built-ins, cancellation/streaming bounds, and Android/Electron packaging.

## Report and implementation

Report each candidate's evidence, removed maintenance cost, capability given up (if any), and observable acceptance check; do not call an unverified search exhaustive. When implementing approved removals, update generated bindings, docs, and pairs in the same change ([lemma-doc](../lemma-doc/SKILL.md)) and verify via [lemma-pre-push-checks](../lemma-pre-push-checks/SKILL.md).
