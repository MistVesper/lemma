# Bilingual documentation

English | [中文](README.zh.md)

Lemma's documentation is maintained in English and Simplified Chinese. This page defines the pairing contract, its check, and its scope, and the translation of GitHub issues and pull requests; [terminology.md](terminology.md) is the terminology source of truth.

## The pairing contract

- **Both languages carry equal authority.** A document may be written in either language first, and the counterpart is translated from it. The two files say the same thing.
- **A pair is three sibling files.** The English `foo.md`, the Chinese `foo.zh.md`, and a consistency record `foo.i18n.yaml` sit in the same directory. A commit that changes one side updates the other side and the record.
- **The consistency record.** `foo.i18n.yaml` holds one entry per heading section. The key is the section's English heading-slug path (`/` for text before the first heading; a repeated path gets `~2`, `~3`, …), and the entry holds a hash of the section's English text and of its Chinese text, code blocks included:

  ```yaml
  /bilingual-documentation/the-pairing-contract:
    en: 0b5c1e0e3f1a2d47
    zh: 9a4e8c2f71d03b65
  ```

  Section `i` of one side corresponds to section `i` of the other. Edits to different sections change separate record lines, so a record conflicts in a merge only when both branches changed the same section; resolve the Markdown, then re-record the pair. Recording a pair states that its two sides say the same thing at these exact contents.
- **Language switcher.** The line after the H1 is `English | [中文](foo.zh.md)` in the English file and `[English](foo.md) | 中文` in the Chinese file.
- **Structure mirrors the counterpart.** Heading levels and order, list kinds and item counts, table rows and columns, and link targets match one to one. Code blocks match line for line; only comments may be translated. Links from a Chinese file to a paired document target its `.zh.md` side.

## The check

`just docs-pairing-check` checks every pair:

1. Every document in scope has its counterpart and its record.
2. Both sides have the same heading levels in the same order.
3. The record equals the one computed from the current contents, so a change to either side that has not been re-recorded fails.
4. Excluded documents have no `.zh.md` and no `.i18n.yaml`.

`just docs-pairing-check <file>...` checks only the named pairs; any file of a pair names it. Spec CI runs the full check.

The check compares hashes and heading structure only. A recorded pair can still differ in meaning, terminology, lists, tables, or links; confirm those before recording.

## Updating a pair

1. Run `just docs-brief`, or `just docs-brief <file>...` for named pairs. For each pair out of sync it prints a translation brief. When one side changed some sections, the brief holds each changed section's last committed source text that matched the record, its current source text, the current counterpart text with line numbers, and the [terminology](terminology.md) rows the change touches. A new pair, an unrecorded pair, a change on both sides, or added and removed sections get a whole-document brief instead.
2. Edit the counterpart. Change only what the source change covers, and keep the reviewed wording elsewhere.
3. Record the pair with `just docs-pairing <file>`, then check it with `just docs-pairing-check <file>`. `just docs-pairing --all` records every pair at once.

## Scope and exclusions

**Scope**: human-facing Markdown documentation — `README.md` files (outside `.agents/skills/`) and `docs/`.

**Excluded** (never paired; the check rejects a `.zh.md` or `.i18n.yaml` for them):

- All `AGENTS.md` files (root and subtree), which are English-only agent instructions.
- Everything under `.agents/skills/` (`README.md`, `SKILL.md`, and `references/`), which tools and agents consume verbatim in English.
- Generated files.
- [terminology.md](terminology.md), which is bilingual by construction.

## GitHub issues and pull requests

The Translation workflow (`.github/workflows/translation.yml`) keeps the title and body of each issue and pull request, and each comment on them, in both languages:

- **Triggers:** opening or editing an issue or pull request, or creating or editing a comment, translates that item. A manual dispatch (`gh workflow run translation.yml`) translates every open issue and pull request and all their comments. Items written by bots are skipped, and the title and body of a pull request opened from a fork are translated only by a manual dispatch.
- **Layout:** the workflow sets an issue or pull request title to English and rewrites the body as the English text, a `---` rule, a collapsed `🌐 中文` block holding the Chinese title and text, and a hidden `<!-- lemma-translation … -->` comment recording a hash of each side. Text written in Chinese moves into the block and its English translation takes its place; text in another language is replaced by its English and Chinese translations.
- **Edits:** the title and the text above the block form the English side and the block forms the Chinese side, with title and text tracked separately. When the English side differs from its recorded hash, it becomes the new source in whatever language it is written and both sides are regenerated from it, discarding any edit to the block. When only the Chinese side changed, the English side is translated from it. An item whose sides match their record is left untouched.
- **Failures:** fenced code blocks pass through untranslated. Any translation error, including a translation that loses or adds an inline code span or URL, or a translation into English that still comes back in Chinese after one retry, leaves its item unchanged and fails the run; the other items in the run are still rewritten.
- **Configuration:** the workflow reaches the model through an OpenAI-compatible `/chat/completions` endpoint set by the Actions variables `TRANSLATE_BASE_URL` and `TRANSLATE_MODEL` and the Actions secret `TRANSLATE_API_KEY`. It runs the script from the default branch, so changes to `scripts/github-translation/` take effect once merged there.
