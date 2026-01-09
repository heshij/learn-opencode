---
title: 5.4 快捷命令
subtitle: 一键触发常用任务
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.4"
duration: 15 分钟
practice: 15 分钟
level: 进阶
description: 自定义斜杠命令，用 /命令名 一键触发复杂任务，提升操作效率。
tags:
  - 命令
  - 快捷
prerequisite:
  - 5.2 自定义 Agent
---

# 5.4 快捷命令

> **一句话总结**：自定义斜杠命令，用 `/命令名` 一键触发复杂任务。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/04-commands-notes.mini.jpeg" alt="快捷命令学霸笔记" data-zoom-src="/images/5-advanced/04-commands-notes.jpeg" />

---

## 学完你能做什么

- 创建自定义斜杠命令（JSON 或 Markdown 两种方式）
- 使用参数、变量和 Shell 输出
- 指定命令使用的 Agent 和模型
- 覆盖内置命令

---

## 你现在的困境

- 常用操作没有快捷方式
- 每次都要输入完整的提示词
- 内置命令不够用，想自己加

---

## 什么时候用这一招

- 当你需要：一键触发常用任务
- 而且不想：每次都手打一长串命令

---

## 命令文件位置

| 位置 | 作用范围 | 说明 |
|-----|---------|------|
| `.opencode/command/**/*.md` | 当前项目 | 支持嵌套目录 |
| `.opencode/commands/**/*.md` | 当前项目 | `commands` 复数形式也支持 |
| `~/.config/opencode/command/**/*.md` | 全局 | 所有项目共享 |

> **来源**：[config.ts#L191](https://github.com/anomalyco/opencode/blob/main/packages/opencode/src/config/config.ts#L191)

嵌套目录示例：

```
.opencode/
└── command/
    ├── review.md           → /review
    ├── git/
    │   ├── commit.md       → /git/commit
    │   └── changelog.md    → /git/changelog
    └── test/
        └── coverage.md     → /test/coverage
```

---

## 两种配置方式

### 方式一：Markdown 文件（推荐）

创建 `.opencode/command/test.md`：

```markdown
---
description: 运行测试并显示覆盖率
agent: build
model: anthropic/claude-opus-4-5-thinking
---

运行完整的测试套件，生成覆盖率报告。
重点关注失败的测试并提供修复建议。
```

使用：`/test`

### 方式二：JSON 配置

在 `opencode.jsonc` 中配置：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "command": {
    // 键名就是命令名
    "test": {
      // template 是必需字段
      "template": "运行完整的测试套件，生成覆盖率报告。\n重点关注失败的测试并提供修复建议。",
      "description": "运行测试并显示覆盖率",
      "agent": "build",
      "model": "anthropic/claude-opus-4-5-thinking"
    }
  }
}
```

使用：`/test`

> **两种方式对比**：Markdown 更适合复杂提示词（多行、格式化）；JSON 适合简单命令或批量管理。

---

## 配置选项详解

### template（必需）

命令执行时发送给 LLM 的提示词模板。

- **JSON 配置**：必需字段
- **Markdown 配置**：文件正文就是 template，无需显式声明

> **来源**：[config.ts#L450](https://github.com/anomalyco/opencode/blob/main/packages/opencode/src/config/config.ts#L450)

### description（可选）

命令描述，显示在 TUI 的命令列表中。

```markdown
---
description: 快速代码审查
---
```

### agent（可选）

指定执行此命令的 Agent。

```markdown
---
agent: plan
---
```

**行为规则**：

- 如果指定的是 subagent（mode=subagent），命令默认触发子代理调用
- 未指定时使用当前活跃的 Agent

> **来源**：[官方文档 - Agent](https://opencode.ai/docs/commands#agent)

### model（可选）

覆盖此命令使用的模型。

```markdown
---
model: anthropic/claude-opus-4-5-thinking
---
```

### subtask（可选）

强制命令作为子任务运行。

```markdown
---
subtask: true
---
```

**使用场景**：

- 不希望命令执行过程污染主对话上下文
- 即使 agent 的 mode 设置为 `primary`，也强制作为 subagent 执行

> **来源**：[官方文档 - Subtask](https://opencode.ai/docs/commands#subtask)

---

## 提示词模板语法

### $ARGUMENTS - 全部参数

将命令后的所有内容作为参数传入。

```markdown
---
description: 创建 React 组件
---

创建一个名为 $ARGUMENTS 的 React 组件，包含 TypeScript 类型支持。
```

使用：`/component Button` → 将 `$ARGUMENTS` 替换为 `Button`

### $1, $2, $3... - 位置参数

按位置引用各个参数。

```markdown
---
description: 创建指定文件
---

在目录 $2 中创建名为 $1 的文件，内容为：$3
```

使用：

```bash
/create-file config.json src "{ \"key\": \"value\" }"
```

替换结果：

- `$1` → `config.json`
- `$2` → `src`
- `$3` → `{ "key": "value" }`

### !`command` - Shell 命令输出

执行 Shell 命令并将输出嵌入提示词。

```markdown
---
description: 分析测试覆盖率
---

当前测试结果：
!`npm test`

根据这些结果，建议提升覆盖率的方法。
```

另一个示例：

```markdown
---
description: 审查最近变更
---

最近的 Git 提交：
!`git log --oneline -10`

请审查这些变更并提出改进建议。
```

> 命令在项目根目录执行，输出成为提示词的一部分。

### @file - 文件引用

引用文件内容。

```markdown
---
description: 审查组件
---

审查 @src/components/Button.tsx 组件。
检查性能问题并提出改进建议。
```

**支持的写法**：

- `@src/file.ts` - 相对路径
- `@./relative/path.ts` - 显式相对路径

> **来源**：[markdown.ts#L6](https://github.com/anomalyco/opencode/blob/main/packages/opencode/src/config/markdown.ts#L6)

---

## 完整示例

### 代码审查命令

`.opencode/command/review.md`：

```markdown
---
description: 审查指定文件的代码质量
agent: plan
---

@$1

请审查这个文件的代码质量，重点关注：
1. 代码规范和命名
2. 潜在 Bug
3. 性能问题
4. 可维护性
```

使用：`/review src/main.ts`

### 智能 Commit 命令

`.opencode/command/commit.md`：

```markdown
---
description: 根据变更生成 Commit 消息
---

根据以下变更生成 commit 消息：

!`git diff --staged`

要求：
- 遵循 Conventional Commits 规范
- 简洁明了，说明"为什么"而非"做了什么"
```

使用：`/commit`

### 翻译命令

`.opencode/command/translate.md`：

```markdown
---
description: 翻译为中文
subtask: true
---

请将以下内容翻译为中文：

$ARGUMENTS
```

使用：`/translate Hello World`

> 使用 `subtask: true` 避免翻译内容污染主对话上下文。

---

## 覆盖内置命令

创建同名文件即可覆盖内置命令。

### 可覆盖的内置命令

| 命令 | 功能 | 别名 |
|-----|------|------|
| `/connect` | 添加 Provider | - |
| `/compact` | 压缩当前会话 | `/summarize` |
| `/details` | 切换工具执行详情 | - |
| `/editor` | 打开外部编辑器 | - |
| `/exit` | 退出 OpenCode | `/quit`, `/q` |
| `/export` | 导出对话为 Markdown | - |
| `/help` | 显示帮助 | - |
| `/init` | 创建/更新 AGENTS.md | - |
| `/models` | 列出可用模型 | - |
| `/new` | 新建会话 | `/clear` |
| `/redo` | 重做 | - |
| `/sessions` | 列出/切换会话 | `/resume`, `/continue` |
| `/share` | 分享会话 | - |
| `/themes` | 列出主题 | - |
| `/undo` | 撤销 | - |
| `/unshare` | 取消分享 | - |

> **来源**：[官方文档 - TUI Commands](https://opencode.ai/docs/tui#commands)

### 覆盖示例

`.opencode/command/help.md`：

```markdown
---
description: 项目专属帮助
---

这是项目专属的帮助信息。

## 常用命令

- /review <file> - 代码审查
- /commit - 智能 Commit
- /translate <text> - 翻译
```

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 命令不显示 | 文件不在正确目录 | 确保在 `command/` 或 `commands/` 目录下 |
| 命令名错误 | 文件名包含特殊字符 | 命令名来自文件路径，用 `-` 代替空格 |
| 参数不生效 | 语法错误 | 使用 `$ARGUMENTS` 或 `$1`、`$2` |
| JSON 配置报错 | 缺少 template | `template` 是 JSON 配置的必需字段 |
| 嵌套目录命令名 | 不了解规则 | 路径 `git/commit.md` → 命令 `/git/commit` |
| 覆盖命令失败 | 优先级问题 | 项目级命令优先于全局命令 |
| Shell 命令失败 | 路径问题 | 命令在项目根目录执行 |

---

## 本课小结

你学会了：

1. 两种配置方式：Markdown 文件和 JSON 配置
2. 使用参数（`$ARGUMENTS`、`$1`）和 Shell 输出（`` !`cmd` ``）
3. 配置选项：`description`、`agent`、`model`、`subtask`
4. 覆盖内置命令

---

## 下一课预告

> 下一课我们将学习权限管控。
