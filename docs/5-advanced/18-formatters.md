---
title: 5.18 代码格式化器
subtitle: 自动代码格式化配置
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.18"
duration: 10 分钟
level: 进阶
description: 配置 OpenCode 使用 Prettier、Biome、gofmt 等格式化器，自动格式化代码。
tags:
  - 格式化
  - 代码风格
  - Prettier
prerequisite:
  - 5.1 配置全解
---

# 代码格式化器

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/formatters-notes.mini.jpeg" 
     alt="5.18 代码格式化器学霸笔记" 
     data-zoom-src="/images/5-advanced/formatters-notes.jpeg" />

OpenCode 在文件写入或编辑后自动使用语言特定的格式化器进行格式化。这确保生成的代码遵循项目的代码风格。

## 内置格式化器

OpenCode 内置了多种流行语言和框架的格式化器：

| 格式化器 | 扩展名 | 要求 |
|----------|--------|------|
| gofmt | .go | `gofmt` 命令可用 |
| mix | .ex, .exs, .eex, .heex, .leex, .neex, .sface | `mix` 命令可用 |
| prettier | .js, .jsx, .ts, .tsx, .html, .css, .md, .json, .yaml 等 | `package.json` 中有 `prettier` 依赖 |
| biome | .js, .jsx, .ts, .tsx, .html, .css, .md, .json, .yaml 等 | 存在 `biome.json(c)` 配置文件 |
| zig | .zig, .zon | `zig` 命令可用 |
| clang-format | .c, .cpp, .h, .hpp, .ino 等 | 存在 `.clang-format` 配置文件 |
| ktlint | .kt, .kts | `ktlint` 命令可用 |
| ruff | .py, .pyi | `ruff` 命令可用且有配置 |
| rustfmt | .rs | `rustfmt` 命令可用 |
| uv | .py, .pyi | `uv` 命令可用 |
| rubocop | .rb, .rake, .gemspec, .ru | `rubocop` 命令可用 |
| standardrb | .rb, .rake, .gemspec, .ru | `standardrb` 命令可用 |
| htmlbeautifier | .erb, .html.erb | `htmlbeautifier` 命令可用 |
| air | .R | `air` 命令可用 |
| dart | .dart | `dart` 命令可用 |
| ocamlformat | .ml, .mli | `ocamlformat` 命令可用且有 `.ocamlformat` 配置 |
| terraform | .tf, .tfvars | `terraform` 命令可用 |
| gleam | .gleam | `gleam` 命令可用 |
| nixfmt | .nix | `nixfmt` 命令可用 |
| shfmt | .sh, .bash | `shfmt` 命令可用 |
| oxfmt（实验性） | .js, .jsx, .ts, .tsx | `package.json` 中有 `oxfmt` 依赖且启用实验性环境变量 |

如果项目的 `package.json` 中有 `prettier`，OpenCode 会自动使用它。

## 工作原理

当 OpenCode 写入或编辑文件时：

1. 根据文件扩展名检查所有已启用的格式化器
2. 运行相应的格式化命令
3. 自动应用格式化更改

这个过程在后台进行，确保代码风格得以维护而无需手动操作。

## 配置

通过配置文件的 `formatter` 部分自定义格式化器：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {}
}
```

每个格式化器配置支持以下选项：

| 属性 | 类型 | 说明 |
|------|------|------|
| `disabled` | boolean | 设为 `true` 禁用该格式化器 |
| `command` | string[] | 格式化命令 |
| `environment` | object | 运行格式化器时的环境变量 |
| `extensions` | string[] | 该格式化器处理的文件扩展名 |

### 禁用格式化器

全局禁用**所有**格式化器：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": false
}
```

禁用**特定**格式化器：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {
    "prettier": {
      "disabled": true
    }
  }
}
```

### 自定义格式化器

可以覆盖内置格式化器或添加新的：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {
    "prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    },
    "custom-markdown-formatter": {
      "command": ["deno", "fmt", "$FILE"],
      "extensions": [".md"]
    }
  }
}
```

命令中的 **`$FILE` 占位符**会被替换为正在格式化的文件路径。

## 相关资源

- [LSP 服务器](19-lsp.md) - 代码智能支持
- [配置参考](../appendix/config-ref.md) - 完整配置选项
