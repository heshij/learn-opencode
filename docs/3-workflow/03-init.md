---
title: 项目初始化：让 AI 读懂你的项目
subtitle: 用 /init 生成项目规则
course: OpenCode 中文实战课
stage: 第三阶段
lesson: "3.3"
duration: 10 分钟
practice: 15 分钟
level: 新手
description: 使用 /init 命令生成 AGENTS.md 规则文件，让 AI 自动了解你的项目规范和技术栈，避免重复介绍项目。
tags:
  - 初始化
  - AGENTS.md
  - 项目规则
prerequisite:
  - 3.2 认识 Agent
---

# 项目初始化：让 AI 读懂你的项目

> 💡 **一句话总结**：用 `/init` 命令生成 AGENTS.md，让 AI 了解你的项目规范和偏好。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/3-workflow/init-notes.mini.jpeg"
     alt="项目初始化：让 AI 读懂你的项目学霸笔记"
     data-zoom-src="/images/3-workflow/init-notes.jpeg" />

---

## 学完你能做什么

- 理解为什么需要项目初始化
- 用 `/init` 生成项目规则文件
- 审核和调整生成的规则
- 知道规则文件放在哪里

---

## 你现在的困境

- 每次对话都要重新介绍项目背景
- AI 不知道项目用什么技术栈、代码风格是什么
- 希望 AI 能"记住"项目规范

---

## 什么时候用这一招

- 当你需要：让 AI 自动了解项目背景和规范
- 而且不想：每次对话都从"这是一个 React 项目..."开始

---

## 🎒 开始前的准备

> 确保你已经完成以下事项：

- [ ] 完成了 [3.2 认识 Agent](./02-agents)
- [ ] 有一个真实项目目录
- [ ] 在项目根目录下启动 OpenCode

---

## 核心思路

### 为什么需要初始化

没有初始化时，你每次对话都要告诉 AI：
- 这是什么项目
- 用什么技术栈
- 代码风格是什么
- 有什么特殊规范

初始化后，这些信息会保存在 `AGENTS.md` 文件里，AI 每次都会自动读取。

### 规则文件位置

OpenCode 会按以下顺序查找规则文件：

| 位置 | 作用范围 |
|-----|---------|
| `项目根目录/AGENTS.md` | 当前项目 |
| `项目根目录/CLAUDE.md` | 兼容 Claude Code |
| `~/.config/opencode/AGENTS.md` | 全局（所有项目） |
| `~/.claude/CLAUDE.md` | 全局（兼容 Claude Code） |
| `$OPENCODE_CONFIG_DIR/AGENTS.md` | 全局（通过环境变量指定） |

::: tip 💡 查找机制
OpenCode 会从当前目录开始向上遍历，直到工作目录（worktree）的根目录，找到的第一个规则文件会被使用。全局规则会与项目规则合并。
:::

---

## 跟我做

### 第 1 步：进入项目目录

**为什么**  
在项目根目录下初始化，生成的规则才是针对这个项目的。

```bash
cd ~/your-project
opencode
```

### 第 2 步：执行初始化

**为什么**  
让 AI 分析项目并生成规则文件。

输入：

```
/init
```

**你应该看到**：AI 开始分析项目结构、技术栈、代码风格

#### 高级用法

**快捷键**：`ctrl+x i`

**带参数执行**：

```
/init 特别关注 TypeScript 类型安全和错误处理
```

`/init` 命令会：
- 扫描项目文件和目录结构
- 检测构建、测试、lint 命令
- 分析代码风格和命名规范
- 如果发现 Cursor 规则（`.cursor/rules/`、`.cursorrules`）或 Copilot 规则（`.github/copilot-instructions.md`），会自动整合
- 如果 `AGENTS.md` 已存在，会改进而非覆盖
- 生成约 150 行的规则文件，确保内容精炼实用

### 第 3 步：审核生成的规则

**为什么**  
AI 生成的规则可能不完全准确，需要人工审核。

AI 会生成一个 `AGENTS.md` 文件，内容类似：

```markdown
# SST v3 Monorepo Project

This is an SST v3 monorepo with TypeScript. The project uses bun workspaces for package management.

## Project Structure

- `packages/` - Contains all workspace packages (functions, core, web, etc.)
- `infra/` - Infrastructure definitions split by service (storage.ts, api.ts, web.ts)
- `sst.config.ts` - Main SST configuration with dynamic imports

## Code Standards

- Use TypeScript with strict mode enabled
- Shared code goes in `packages/core/` with proper exports configuration
- Functions go in `packages/functions/`
- Infrastructure should be split into logical files in `infra/`

## Monorepo Conventions

- Import shared modules using workspace names: `@my-app/core/example`
```

检查这些内容是否正确。完整的 AGENTS.md 示例可以参考官方文档：https://github.com/anomalyco/opencode/blob/dev/packages/web/src/content/docs/rules.mdx

---

### 进阶：使用 opencode.json 加载更多规则

除了 `AGENTS.md`，你还可以在配置中指定额外的规则文件：

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "CONTRIBUTING.md",
    "docs/guidelines.md",
    "packages/*/AGENTS.md"
  ]
}
```

**`instructions` 支持的特性**：

- **相对路径**：从项目目录向工作目录根查找，支持 glob 模式
- **Glob 模式**：如 `packages/*/AGENTS.md` 匹配多个文件
- **绝对路径**：直接指定完整路径
- **URL**：支持 `https://` 或 `http://` 加载远程规则（5 秒超时）
- **Home 目录**：以 `~/` 开头自动展开

示例：

```json title="opencode.json"
{
  "instructions": [
    "~/team-rules/typescript.md",
    "https://example.com/company-coding-standards.md",
    "docs/**/*.md"
  ]
}
```

所有通过 `instructions` 指定的文件会与 `AGENTS.md` 合并。

---

### 第 4 步：修改规则（如有需要）

**为什么**  
补充 AI 没发现的规范，或修正错误。

用编辑器打开 `AGENTS.md`，添加你的补充：

```markdown
## Additional Rules
- Always use Chinese comments
- Prefer async/await over callbacks
- Error messages should be user-friendly
```

### 第 5 步：验证规则生效

**为什么**  
确认 AI 真的读取了你的规则。

输入：

```
这个项目用的什么技术栈？
```

**你应该看到**：AI 回答的内容应该和 AGENTS.md 里定义的一致

---

## 规则文件的加载和合并

### 加载顺序

OpenCode 按以下顺序加载规则：

1. **项目规则**：从当前目录向上遍历到工作目录根，查找 `AGENTS.md` 或 `CLAUDE.md`
2. **全局规则**：加载 `~/.config/opencode/AGENTS.md` 或 `~/.claude/CLAUDE.md`
3. **自定义配置目录**：如果设置了 `OPENCODE_CONFIG_DIR` 环境变量，加载其中的 `AGENTS.md`
4. **配置规则**：加载 `opencode.json` 中 `instructions` 指定的所有文件

::: tip 💡 URL 超时
`instructions` 支持从远程 URL 加载规则文件，但会使用 5 秒超时限制。
:::

### 合并机制

所有找到的规则文件会被合并后一起提供给 AI。这意味着：

- 你可以在项目级规则中定义通用规范
- 在全局规则中定义个人偏好
- 在 `instructions` 中引用团队共享的标准文档
- 规则之间互不覆盖，全部生效

---

## 团队协作

### 提交 AGENTS.md 到 Git

::: tip 💡 团队协作
将项目的 `AGENTS.md` 提交到版本控制，确保团队成员使用相同的项目规范。
:::

### Monorepo 的处理

对于 Monorepo 项目，建议使用 `instructions` 配置统一加载所有子项目的规则：

```json title="opencode.json"
{
  "instructions": ["packages/*/AGENTS.md"]
}
```

这样每个子项目可以有自己的规则，同时又能被统一加载。

---

## 进阶技巧：在 AGENTS.md 中引用外部文件

虽然 OpenCode 不会自动解析文件引用，但你可以在 `AGENTS.md` 中显式指示 AI 读取外部文件：

```markdown title="AGENTS.md"
# 项目规则

## 外部文件引用

当遇到文件引用（如 `@docs/xxx.md`）时，使用 Read 工具按需加载：
- 不要预先加载所有引用，按实际需要懒加载
- 加载后的内容作为必须遵守的指令
- 必要时递归加载引用

## 技术规范

TypeScript 风格：@docs/typescript-guidelines.md
React 组件模式：@docs/react-patterns.md
REST API 设计：@docs/api-standards.md
测试策略：@test/testing-guidelines.md
```

这种方式让你可以：
- 创建模块化、可复用的规则文件
- 通过符号链接或 Git submodule 在项目间共享规则
- 保持 `AGENTS.md` 简洁，同时引用详细指南
- 确保只在需要时才加载相关规则

---

## 检查点 ✅

> 全部通过才能继续

- [ ] `/init` 能成功生成 AGENTS.md
- [ ] 文件内容正确描述了项目
- [ ] AI 能回答关于项目的问题

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| AI 不遵守规则 | 可能没在项目目录下启动 | 确认当前目录有 AGENTS.md |
| 规则内容不对 | AI 分析错误 | 手动修改 AGENTS.md |
| 想用全局规则 | 每个项目都适用 | 放到 `~/.config/opencode/AGENTS.md` 或 `~/.claude/CLAUDE.md` |
| 规则没生效 | 配置文件路径错误 | 检查 `opencode.json` 中的 `instructions` 路径 |
| 多个项目共用规则 | 复制规则文件不方便 | 使用 `instructions` 配置或符号链接 |

---

## 本课小结

你学会了：

1. 为什么需要项目初始化（避免重复介绍项目）
2. 用 `/init` 生成 AGENTS.md，包括带参数和快捷键
3. 规则文件的查找位置和加载顺序
4. 使用 `opencode.json` 的 `instructions` 加载更多规则
5. 规则文件的合并机制（项目 + 全局 + 配置）
6. 团队协作：提交 AGENTS.md 到 Git、Monorepo 处理
7. 在 AGENTS.md 中引用外部文件的方法

🎉 **恭喜你完成了必修阶段！** 接下来可以根据你的身份选择场景实战课程。

---

## 下一课预告

> 进入第四阶段【场景实战】，根据你的身份选择学习路线：
> - ✍️ 内容创作者 → [A1 创作工作流](/4-scenarios/writer-workflow)
> - 💻 程序员 → [B1 开发日常](/4-scenarios/coder-daily)
> - 📊 效率爱好者 → [C1 文件整理](/4-scenarios/office-files)
