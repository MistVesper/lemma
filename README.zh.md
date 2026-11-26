# Lemma

[English](README.md) | 中文

Lemma 用同一套 Rust 核心为 Web、桌面与 Android 客户端运行 LLM agent，提供消息树会话、可配置的模型与 Web provider，以及本地文件与 shell 工具。

## 快速开始

安装 [mise](https://mise.jdx.dev/) 与 Rust 后执行：

```sh
mise install
rustup toolchain install
npm ci
just web-build
just rust-dev
```

`lemma-daemon` 默认打开 `./data`，并在 <http://127.0.0.1:1025> 提供 Web 客户端服务。

## 文档

- [架构](docs/architecture.zh.md)：crate 分层、运行时与一次 turn 的完整链路。
- [术语表](docs/glossary.zh.md)：共用的领域术语。
- [开发指南](docs/development.zh.md)：环境搭建、桌面与 Android 构建、Windows 说明与环境变量。
- [测试](docs/testing.zh.md)：测试分层与覆盖率。
- [双语文档](docs/i18n/README.zh.md)：中英文配对文档及其检查，以及 GitHub issue 与 PR 的翻译。
- [设计 token](design/README.zh.md)：各客户端共用的颜色、圆角、字号与动效 token，及其生成产物。
- [界面文案](i18n/README.zh.md)：客户端界面文案的 YAML 源文件，以及生成的 Web 与 Android 资源。
- [共享 UI 组件](packages/ui/README.zh.md)：`@lemma/ui` 控件、样式规则、设置页与动效工具类。
- [AGENTS.md](AGENTS.md)：仓库结构与工程约定。
- [Skills](.agents/skills/README.md)：agent skill 的目录结构与命名。
