---
name: lemma-refactor
description: Use when simplifying or refactoring Lemma code without changing behavior — either polishing recently changed files or diffs (flattening deep nesting, removing forwarding wrappers, clarifying names, deleting leftover dead code) or running measured cleanup passes across an area or the repository with jscpd, knip, and Rust compiler diagnostics.
---

# Refactoring Lemma code

Clean up code that stays so it is faster to read and cheaper to maintain, while keeping behavior identical. Adapted from `code-simplification` in [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT), `dry-refactoring`, `codebase-refactoring`, and `jscpd` in [kucherenko/jscpd](https://github.com/kucherenko/jscpd) (MIT), and `ai-slop-cleaner` in [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) (MIT).

Restructuring modules across interfaces belongs to [lemma-improve-architecture](../lemma-improve-architecture/SKILL.md), and removing unused or low-value features, fields, or configuration belongs to [lemma-prune](../lemma-prune/SKILL.md).

## Modes

- **Diff or file cleanup** (default after finishing a change, `git diff` against base, or when the user names files): inspect each block's responsibility, callers, callees, tests, and `git log` rationale first. Target deep nesting, multi-responsibility functions, boolean mode flags, forwarding wrappers, single-implementation indirection, checks already excluded by types, vague names, and orphaned code.
- **Measured passes** (when cleaning up accumulated debt across a directory or the repository): run `npx --no-install jscpd --health --reporters ai --no-tips` from the repository root (`.jscpd.json`), then run one pass at a time — duplication, dead code, complexity — per [references/passes.md](references/passes.md) and [references/jscpd.md](references/jscpd.md). Merging clones first updates the call sites dead-code tracing follows, and removing dead code first keeps complexity rankings on live files. Defer findings of another kind to their own pass so every edit has one cause.

Entry points outside `package.json` must appear in both `.jscpd.json` (`deadCode.entry`) and `knip.json`, or Electron and `scripts/` files and their imports report as dead. No tool detects dead Kotlin code in `mobile/`; search by hand or state that `mobile/` was skipped.

## Invariants

- **Preserve behavior and contracts.** Outputs, errors, side effects, ordering, and validation, authorization, error-propagation, or cancellation guards stay unchanged. Skip any step whose equivalence is uncertain; stop and ask the user if cleanup exposes a behavior question.
- **Clarity over fewer lines.** Keep helpers whose names carry domain concepts, prefer flat `if` / `match` control flow over dense one-liners, and follow [lemma-code-style](../lemma-code-style/SKILL.md) and the subtree `AGENTS.md` rather than personal preference.
- **Keep tests behavioral.** Existing tests pass unmodified; changing a test to pass signals a behavior change. Extracted helpers stay covered through caller tests unless edge cases warrant dedicated tests ([testing.md](../../../docs/testing.md)).

## Workflow

1. **Plan before editing:** list each planned change in the conversation with its file and lines, the tool flags that surfaced it (for measured passes), skipped candidates with reasons, order from safest deletions to riskiest consolidations, and the verification check (or manual verification when untested). Append mid-pass discoveries to the plan before editing.
2. **Apply incrementally:** apply one simplification (or small dead-code batch), update every call site, remove orphaned imports and helpers, and run the narrowest owning check ([lemma-pre-push-checks](../lemma-pre-push-checks/SKILL.md)); use AST codemods for repetitive multi-file edits. Revert a failing simplification instead of debugging forward. Keep refactoring separate from feature or bug-fix changes.
3. **Hand off to a read-only review:** self-review and revert anything not genuinely clearer, then pass the diff, plan, tool outputs (if measured), and executed checks to a fresh read-only pass (a subagent when available) to verify preserved behavior, intact safety guards, complete caller updates, clean file placement, and matching re-run flags. Route follow-ups back to a writing pass.
4. **Confirm and report:** for measured passes, re-run `--health` and the pass command with identical flags (note when file sets or dimensions differ), return to any pass whose metric regressed, and report before/after numbers with flags plus skipped candidates.
