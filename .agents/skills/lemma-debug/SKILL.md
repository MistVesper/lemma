---
name: lemma-debug
description: Use when diagnosing hard, flaky, or cross-layer bugs and performance regressions in Lemma — when the user asks to debug or diagnose, or when a failure or slowdown has no obvious cause.
---

# Debugging Lemma

Discipline for hard bugs and performance regressions: build a failing check before theorizing, isolate the cause through falsifiable predictions, and lock the fix at a public interface. Adapted from `diagnosing-bugs` in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT).

Read [architecture.md](../../../docs/architecture.md), [glossary.md](../../../docs/glossary.md), the subtree `AGENTS.md`, and `git log` on the involved files before forming hypotheses. Redact secrets, tokens, and auth headers as `<REDACTED>` in every command, captured payload, and log snippet shown; pass credentials through environment variables, and ask the user if redaction hides the needed signal.

## Workflow

1. **Build a tight red loop:** Construct one unattended, fast, deterministic command that exercises the failing path and asserts the user's exact symptom before reading code to theorize. Prefer the narrowest check in [testing.md](../../../docs/testing.md) — `cargo nextest run -p <crate> <test>`, a single Vitest file, an `InProcessEngine` or loopback HTTP test, a captured vendor SSE or Connect payload replay, a property loop, or `git bisect run` — while respecting the workspace and Android build consent rule in [AGENTS.md](../../../AGENTS.md#verification). Tighten slow or broad loops; for non-deterministic failures, repeat or stress the trigger and narrow timing windows until the failure rate is high enough to test against. If no local loop can reproduce the symptom, list what was tried and ask the user for environment access, a redacted trace/log artifact, or temporary instrumentation instead of guessing.
2. **Reproduce and minimize:** Run the loop and confirm it fails with the reported symptom rather than an adjacent error. Shrink inputs, callers, configuration, and steps one cut at a time, re-running the loop after each cut, until removing any remaining element makes the loop pass.
3. **Hypothesize:** Write 3–5 ranked, falsifiable hypotheses before probing (`If <X> causes this, changing <Y> removes the failure / changing <Z> worsens it`). Share the ranked list with the user so domain context can re-order it; continue with the top hypothesis if the user is away.
4. **Instrument or measure:** Test one prediction at a time with a debugger or targeted probes prefixed `[DEBUG-<id>]` at the boundaries that separate hypotheses — never broad log dumps. For performance regressions, establish a baseline timing, profile, or `EXPLAIN QUERY PLAN` measurement first and bisect against it instead of logging.
5. **Fix and pin at the interface:** Turn the minimized reproduction into a failing test at the owning public interface ([deepening.md](../lemma-improve-architecture/references/deepening.md)), watch it fail (diffing against `HEAD` if a code or fixture mutation proved the test goes red), apply the fix, watch it pass, and re-run the un-minimized reproduction loop. When shallow module structure prevents exercising the real call pattern through a public interface, report that gap instead of asserting against internals.
6. **Clean up:** Grep and remove every `[DEBUG-…]` probe, delete temporary harnesses and scratch files ([AGENTS.md](../../../AGENTS.md#conventions)), run the relevant checks in [lemma-pre-push-checks](../lemma-pre-push-checks/SKILL.md), and state the confirmed root cause in the commit body ([lemma-commit](../lemma-commit/SKILL.md)).
