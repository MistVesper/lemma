# Lemma

English | [中文](README.zh.md)

Lemma runs LLM agents for web, desktop, and Android clients from one Rust core, with message-tree sessions, configurable model and web providers, and local file/shell tools.

## Quick start

With [mise](https://mise.jdx.dev/) and Rust installed:

```sh
mise install
rustup toolchain install
npm ci
just web-build
just rust-dev
```

`lemma-daemon` opens `./data` by default and serves the web client at <http://127.0.0.1:1025>.

## Documentation

- [Architecture](docs/architecture.md): crate layers, runtimes, and the path of one turn.
- [Glossary](docs/glossary.md): shared domain terms.
- [Development](docs/development.md): setup, desktop and Android builds, Windows notes, and environment variables.
- [Testing](docs/testing.md): test tiers and coverage.
- [Bilingual documentation](docs/i18n/README.md): English and Chinese document pairs, their check, and translation of GitHub issues and pull requests.
- [Design tokens](design/README.md): colors, radii, typography, and motion shared by all clients, and their generated outputs.
- [Interface strings](i18n/README.md): YAML sources of the clients' UI text and the generated web and Android resources.
- [Shared UI components](packages/ui/README.md): `@lemma/ui` controls, styling rules, settings pages, and motion utilities.
- [AGENTS.md](AGENTS.md): repository layout and engineering conventions.
- [Skills](.agents/skills/README.md): layout and naming of agent skills.
