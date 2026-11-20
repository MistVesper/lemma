---
name: lemma-commit
description: Use when writing or reviewing a git commit message or pull request body in Lemma — subject format, type and scope, body, footers, atomicity, PR summary/evidence/risk sections — or when merging a branch into `main`.
---

# Lemma Commit and Pull Request Standard

Write signal-dense commit messages and pull request bodies in English that record why changes exist and what invariants they maintain. Pull request structure adapted from `pr` in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, from Dex Horthy's `show-me`).

## Format

```
<type>(<scope>): <imperative summary, ≤72 chars, no trailing period>

<why this change exists — motivation, 1-2 sentences>

<what changed at a level the diff doesn't show — invariants, alternatives>

<notes/risks/follow-ups, optional>

Refs: #123
Fixes: #789
Risk: <if destructive or migration>
```

## Subject line

- **`<type>`:** lowercase, one of the types below.
- **`(<scope>)`:** lowercase kebab-case, closest meaningful unit (crate, package, feature, module); omit only when genuinely repo-wide.
- **Summary:** imperative mood completing "If applied, this commit will …", lowercase first letter, no trailing period, ≤ 72 chars total (aim for ≤ 50).
- **One concern:** split separable changes instead of joining them with "and", commas, or slashes.
- **Banned anywhere:** emoji prefixes, AI tool footers (`Generated with …`, `Co-Authored-By: <AI>` unless explicitly requested), marketing fluff, bare catch-all `chore: misc`, and WIP commits on shared branches.

## Type taxonomy

| Type       | Use when                                                   |
| ---------- | ---------------------------------------------------------- |
| `feat`     | New behavior, capability, surface visible to a user/caller |
| `fix`      | Bug fix — observable wrong behavior is now right           |
| `refactor` | Internal restructure with **no behavior change**           |
| `perf`     | Performance improvement, no behavior change                |
| `docs`     | Documentation only                                         |
| `test`     | Tests only                                                 |
| `style`    | Formatting, whitespace, lint. **No logic change.**         |
| `chore`    | Maintenance — deps, config, repo plumbing                  |
| `build`    | Build system, packaging                                    |
| `ci`       | CI pipeline only                                           |
| `revert`   | Reverts a previous commit; body references SHA             |

## Body and footers

Recommended for non-trivial changes; wrap at 72 chars (up to 100 for URLs/paths), 2–4 short paragraphs max:

- Lead with **why** (what was wrong before), then **what** the diff does not show (invariants, alternatives considered), then notes/risks if any. Do not restate the diff.
- Machine-parseable footers when applicable: `Refs: #123`, `Fixes: #789` / `Closes: #789`, `BREAKING CHANGE: <summary>`, `Risk: <risk + mitigation>`, `Verified: <extra verification>`, `Co-Authored-By: <human>`.

## Atomicity

- **One concern per commit.** Split changes that can be reviewed or reverted independently.
- **Split by scope, not by build state.** Only the branch tip must build and pass checks; order commits so dependencies come first.
- **Tests for behavior changes ship in the same commit.**
- **Squash WIP before push.** Never rewrite a published commit on `main`; follow up with a new commit instead.
- **Land on `main` through a merge commit, never a squash merge,** so split commits survive. The merge commit keeps Git's default title (`Merge pull request #N from …` or `Merge branch '…'`).
- **Catch up with `main` via `git rebase main`,** never by merging `main` into a feature branch. Pushing a rebased branch follows [lemma-pre-push-checks](../lemma-pre-push-checks/SKILL.md#push).

## Examples

```
fix(agent): escape turn ids in the outline scroll selector

Turn ids can contain characters outside CSS identifier syntax, which
threw SyntaxError in querySelector when jumping from the outline. Wrap
the id in CSS.escape before building the attribute selector.
```

```
refactor(adapter): drop unparsed web_search ToolSpec parameters

ExaSearchResult only parses highlights and DeepSeekSearchResult only
parses summary, so advertising contents.text and need_content in
web_search tool specs invited arguments whose responses were discarded.
```

## Pull requests

Write the pull request title and body in one language without a manual `<details>` translation block; [`.github/workflows/translation.yml`](../../../docs/i18n/README.md#github-issues-and-pull-requests) translates between English and Chinese automatically and leaves fenced code blocks untouched. Single-concern pull requests use the [subject line](#subject-line) format as the title; multi-commit pull requests use a concise imperative English summary.

Skip preambles, use domain terms from [glossary.md](../../../docs/glossary.md), and organize the body into three sections:

```markdown
## Summary

<smallest diagram, diff sketch, or tree that makes the change clear>

## Evidence

- **Before:** <screenshot, command output, or failing test>
- **After:** <screenshot, command output, or passing test>

## Merge Danger

**Door:** <two-way | one-way — state why when irreversible, such as SQLite migration, wire change, or persisted state>
**Blast Radius:** <affected runtimes, crates, packages, or user flows, and potential regressions>
```

Pick the smallest visual in `Summary` beside brief supporting prose, keeping only calls, files, props, states, and interfaces that carry the change:

- **Logic or state flow:** compact pseudocode, or a `diff` block over pseudocode or a call tree when surrounding control flow already exists.
- **Cross-crate, IPC, or RPC interaction:** a call tree or `mermaid` `sequenceDiagram`.
- **UI structure:** a component tree (or `diff` component tree) naming owning packages or routes, paired with before/after screenshots in `Evidence`.
- **Module or directory reorganization:** a shallow file tree (or `diff` tree) with one-phrase responsibilities.
