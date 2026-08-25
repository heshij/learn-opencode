---
title: Plan vs Build：规划与执行
subtitle: 两种模式，两种用法
course: OpenCode 中文实战课
stage: 第三阶段
lesson: "3.1"
duration: 10 分钟
practice: 15 分钟
level: 新手
description: 理解 Plan Agent（只读分析）和 Build Agent（读写执行），掌握权限询问机制，用 Tab 键灵活切换，掌握高效 AI 编程工作流。
tags:
  - Plan
  - Build
  - 模式
prerequisite:
  - 2.1 界面与基础操作
---

# Plan vs Build：规划与执行

> 💡 **一句话总结**：Plan Agent 只读分析，Build Agent 读写执行。按 <kbd>Tab</kbd> 切换。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/3-workflow/plan-build-notes.mini.jpeg"
     alt="Plan vs Build：规划与执行学霸笔记"
     data-zoom-src="/images/3-workflow/plan-build-notes.jpeg" />

---

## 学完你能做什么

- 理解 Plan 和 Build 两个 Primary Agents 的区别
- 知道什么场景用 Plan，什么场景用 Build
- 能熟练用 <kbd>Tab</kbd> 切换 Agent
- 让 AI 用 TODO 跟踪复杂任务的进度

<!-- 📹 演示位：模式切换演示 -->
<!-- TODO: 待录制演示 GIF -->
<!-- ![Plan vs Build 演示](/images/3-workflow/plan-build-demo.gif) -->

---

## 你现在的困境

- AI 一上来就改文件，有时候改得不对
- 想让 AI 先分析再动手，但不知道怎么控制
- 不知道什么时候该让 AI 只读，什么时候该让它写
- 复杂任务执行了一半，不知道 AI 做到哪了

---

## 什么时候用这一招

- 当你需要：控制 AI 是否修改文件
- 而且不想：AI 在你还没想清楚时就动手改代码

---

## 🎒 开始前的准备

> 确保你已经完成以下事项：

- [ ] 完成了 [2.1 界面与基础操作](../2-daily/01-interface)
- [ ] 有一个包含代码的项目目录

---

## 核心思路

### Plan 和 Build 是什么

Plan 和 Build 是 OpenCode 内置的两个 **Primary Agents**（主要助手）。

- **Primary Agent**：你可以直接对话的主助手，用 <kbd>Tab</kbd> 切换
- **Subagent**：由 Primary Agent 调用的专家助手，用 `@` 提及（详见 [3.2 认识 Agent](./02-agents)）

OpenCode 默认提供两个 Primary Agents：

| Agent | 类型 | 说明 |
|-------|------|------|
| **Build** | Primary | 默认助手，所有工具可用，适合开发工作 |
| **Plan** | Primary | 受限助手，权限询问，适合分析和规划 |

### 权限系统

Plan Agent 使用**权限隔离**机制保护你的代码——它被禁止编辑源代码，只能编辑计划文件：

| 权限 | Plan Agent | Build Agent |
|------|-----------|------------|
| `edit`（写/改文件） | **deny**（禁止源代码，仅允许计划文件） | allow |
| `bash`（执行命令） | allow | allow |
| `read`、`grep`、`glob` 等 | allow | allow |

> ⚠️ **注意**：Plan Agent 可以编辑 `.opencode/plans/*.md` 计划文件，但不能编辑项目源代码。

### 什么时候用 Plan

- 分析代码结构，但**不要改动**
- 让 AI 做规划和设计
- 代码审查
- 理解陌生代码库

### 什么时候用 Build

- 让 AI 写新功能
- 让 AI 修 Bug
- 让 AI 重构代码
- 让 AI 创建/修改文件

### 模式选择速查表

| 你的需求 | 推荐模式 | 原因 |
|---------|---------|------|
| 写新功能 | Build | 直接开发效率高 |
| 修简单 Bug | Build | 影响范围明确 |
| 重构核心模块 | 先 Plan 后 Build | 先分析影响，再动手 |
| 学习新代码库 | Plan | 安全探索，不会误改 |
| 不确定改动影响 | Plan | 分析完再决定 |
| 快速原型验证 | Build | 迭代速度优先 |
| 团队协作任务 | 先 Plan 后 Build | 计划可审核，执行可追溯 |
| 代码审查 | Plan | 只读分析，不修改 |

**简单口诀**：不确定 → 先用 Plan；确定了 → 直接 Build

---

## 可用工具
<AdInArticle />

Plan Agent 可以读取、搜索和执行 Shell 命令，但默认不能编辑源代码；Build Agent 可以使用所有工具：

### 只读工具（Plan 和 Build 都可用）

| 工具 | 说明 |
|------|------|
| `read` | 读取文件内容 |
| `grep` | 搜索文件内容 |
| `glob` | 按模式查找文件 |
| `list` | 列出目录内容 |
| `webfetch` | 获取网页内容 |

### 写入工具（仅 Build 默认可用）

| 工具 | 说明 |
|------|------|
| `write` | 创建新文件 |
| `edit` | 修改现有文件 |

### 执行工具（Plan 和 Build 都可用）

| 工具 | 说明 |
|------|------|
| `bash` | 执行 Shell 命令；是否允许具体命令仍受权限规则控制 |

---

## 配置说明（可选）

默认配置已经足够日常使用。如果需要自定义 Agent 行为，可以在 `opencode.jsonc` 中配置：

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    // Build Agent 配置
    "build": {
      "mode": "primary",
      "model": "anthropic/claude-opus-4-5-thinking",
      "temperature": 0.3,
      "permission": {
        "edit": "allow",
        "bash": "allow"
      }
    },
    // Plan Agent 配置
    "plan": {
      "mode": "primary",
      "model": "anthropic/claude-opus-4-5-thinking",
      "temperature": 0.1,
      "permission": {
        "edit": {
          "*": "deny",                    // 禁止编辑所有源代码
          ".opencode/plans/*.md": "allow" // 只允许编辑计划文件
        },
        "bash": "allow"
      }
    }
  }
}
```

**配置项说明**：

- `model`：使用的模型，格式为 `provider/model-id`
- `temperature`：控制随机性的有限数字；实际可用范围由模型与 Provider 决定，常见模型通常是值越低越专注
- `permission.edit`：文件编辑权限
  - `"allow"`：允许编辑
  - `"deny"`：禁止编辑
  - 也可以指定路径规则，如 `{ "*": "deny", ".opencode/plans/*.md": "allow" }`
- `permission.bash`：命令执行权限（`allow`/`deny`）

> 💡 **提示**：配置文件支持 JSONC 格式，可以添加 `//` 注释。

---

## 跟我做

### 第 1 步：确认当前 Agent

**为什么**  
先看清现在使用的是哪个 Agent。

看状态栏右侧，会显示 `Plan` 或 `Build`。

### 第 2 步：切换到 Plan Agent

**为什么**  
准备做只读分析。

按 <kbd>Tab</kbd> 键，直到状态栏显示 `Plan`。

### 第 3 步：用 Plan Agent 分析代码

**为什么**  
体验只读分析，AI 不会修改任何文件。

输入：

```
@src/main.ts 分析这个文件的结构，列出所有函数和它们的作用
```

**你应该看到**：AI 使用 `read` 工具读取文件，分析结构。由于 Plan Agent 被禁止编辑源代码，AI 不会直接修改文件。

### 第 4 步：切换到 Build Agent

**为什么**  
准备让 AI 动手改代码。

按 <kbd>Tab</kbd> 键，状态栏显示 `Build`。

### 第 5 步：用 Build Agent 重构代码

**为什么**  
体验读写模式，AI 会实际修改文件。

输入：

```
给 @src/main.ts 添加详细的 JSDoc 注释
```

**你应该看到**：AI 使用 `edit` 工具修改文件，添加注释。你可以审核更改后决定是否接受。

### 第 6 步：撤销更改（可选）

**为什么**  
如果不满意，可以撤销。

```
/undo
```

`/undo` 会回到上一条用户消息，并回滚该消息之后关联的文件补丁；如果撤销过头，可用 `/redo` 恢复会话和文件。文件恢复依赖快照：`snapshot: false` 只关闭文件的撤销/重做，不会关闭会话消息的 undo/redo。

---

## 技巧：让 AI 跟踪任务进度

复杂任务时，可以明确告诉 AI 用 TODO 跟踪进度：

| 你说的话 | AI 会做什么 |
|---------|------------|
| "用 TODO 跟踪进度" | 创建任务列表，逐步更新状态 |
| "分步骤完成" | 自动拆分任务，边做边更新 |
| "当前进度怎么样？" | 汇报已完成/进行中/待处理 |

**示例对话**：

```
你: 帮我重构用户认证模块，用 TODO 跟踪进度

AI: 好的，我先创建任务列表：
    ✅ 1. 分析现有代码结构
    🔄 2. 设计新的认证流程
    ⏳ 3. 重写认证逻辑
    ⏳ 4. 更新测试用例
    ⏳ 5. 验证功能

    开始执行第一项...

你: 当前进度？

AI: 让我查看一下...
    ✅ 1. 分析现有代码结构（已完成）
    ✅ 2. 设计新的认证流程（已完成）
    🔄 3. 重写认证逻辑（进行中，预计 5 分钟）
    ⏳ 4. 更新测试用例
    ⏳ 5. 验证功能
```

**什么时候用这个技巧**：

- 任务需要 3 步以上
- 你中途可能离开，回来想知道进度
- 你想让 AI 有条理地执行，不遗漏步骤

> 💡 **原理**：AI 使用 `todowrite` 工具维护和读取当前待办列表。你不用管工具细节，只需要在提示词里说“用 TODO 跟踪”即可。

---

## 检查点 ✅

> 全部通过才能继续

- [ ] <kbd>Tab</kbd> 能在 Plan Agent 和 Build Agent 之间切换
- [ ] Plan Agent 禁止编辑源代码，默认只能编辑项目或全局计划文件
- [ ] Build Agent 可以自由修改文件和执行命令
- [ ] 知道怎么让 AI 用 TODO 跟踪任务进度

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 想让 AI 改文件但没改 | 可能在 Plan Agent，它被禁止编辑源代码 | 按 Tab 切换到 Build |
| AI 改了不该改的文件 | 在 Build Agent，权限是 `allow` | 用 `/undo` 撤销，下次用 Plan 先分析 |
| Plan Agent 无法编辑源代码 | 这是设计如此，Plan 默认只能编辑项目或全局计划文件 | 切换到 Build 执行修改 |

---

## 高级功能（了解即可）

### temperature：控制随机性

Plan Agent 通常使用较低的 `temperature`（如 0.1），输出更专注和确定；Build Agent 使用中等值（如 0.3），在专注和创造力之间平衡。

### steps：限制自动迭代次数

可以用正整数设置 Agent 的最大自动迭代步数。达到上限后，Agent 会改为输出最终纯文本响应。一次迭代可能包含多个工具调用，所以它不是工具调用次数的硬上限。

```jsonc
{
  "agent": {
    "plan": {
      "steps": 5  // 最多 5 次自动迭代
    }
  }
}
```

### 自定义快捷键

默认使用 <kbd>Tab</kbd> 切换 Agent，也可以在独立的 `tui.jsonc` 中修改 `agent_cycle` 键绑定：

```jsonc title="tui.jsonc"
{
  "$schema": "https://opencode.ai/tui.json",
  "keybinds": {
    "agent_cycle": "tab",           // 切换到下一个 Agent（默认值）
    "agent_cycle_reverse": "shift+tab"  // 切换到上一个 Agent（默认值）
  }
}
```

从 v1.17.0 起，`theme`、`keybinds` 和旧的 `tui` 字段不再属于主 `opencode.json`/`opencode.jsonc`。TUI 启动时会按配置目录迁移这些旧字段：如果目标 `tui.json` 已存在则跳过；写入成功后，会备份原主配置并删除其中的旧字段。独立 TUI 配置继续按全局、自定义、项目和 `.opencode` 层级加载，也可以直接使用 `tui.jsonc`。

### plan_exit：让 Plan Agent 请求开始执行

::: warning ⚠️ 实验性功能
`plan_exit` 目前是**实验性功能**，需要同时满足以下条件才能使用：

1. 启用实验模式：设置 `OPENCODE_EXPERIMENTAL=true` 或 `OPENCODE_EXPERIMENTAL_PLAN_MODE=true`
2. 使用 CLI 客户端：在终端中运行 OpenCode（非 Web/IDE 集成）

未来版本可能会正式开放，届时本教程会更新。
:::

进入 Plan Agent 请手动按 <kbd>Tab</kbd>（或使用你配置的 Agent 切换键）。目标版本没有 `plan_enter` 工具。Plan Agent 完成规划后，可以调用 `plan_exit` 请求回到 Build：

| 工具 | 作用 | 可用 Agent |
|------|------|-----------|
| `plan_exit` | 退出 Plan 模式，回到 Build | Plan Agent 可用 |

**工作流程**：

```
你: [按 Tab 切换到 Plan Agent]
    → AI 在 Plan 模式下分析代码
    → 生成计划文件 .opencode/plans/xxx.md

你: 计划看起来不错，开始实施吧

AI: [调用 plan_exit 工具]
    → 弹出确认框：是否切换到 Build 模式？
    → 你选择 Yes
    → AI 在 Build 模式下执行修改
```

**Plan 模式下 AI 默认只能编辑项目或全局计划文件**，不能修改源代码。这确保了“规划”和“执行”的安全隔离。

### 计划文件存储位置

Plan 模式下，AI 生成的计划文件会保存到以下位置：

| 级别 | 路径 | 说明 |
|------|------|------|
| 项目级 | `.opencode/plans/<created>-<slug>.md` | 保存在项目目录，跟随项目 |
| 全局级 | `<Global.Path.data>/plans/<created>-<slug>.md` | 保存在 OpenCode 全局数据目录，跨项目共享 |

> `created` 是 13 位毫秒时间戳，`slug` 是计划标题的 URL 友好格式。例如：`1736854321000-refactor-auth.md`。Linux 常见默认数据目录是 `~/.local/share/opencode`，但实际路径会受平台和 XDG 环境变量影响，可用 `opencode debug paths` 查看 `data`。

::: tip 存储位置判断规则
- **项目有 Git（或其他版本控制）** → 保存在项目级 `.opencode/plans/`
- **项目无版本控制** → 保存在 `<Global.Path.data>/plans/`
:::

查看计划文件：

```bash
# 查看项目级计划
cat .opencode/plans/*.md

# 查看全局数据目录；在输出的 data 路径后追加 plans/
opencode debug paths
```

> 💡 这些功能进阶时再深入，当前阶段了解即可。

---

## 本课小结

你学会了：

1. Plan 和 Build 是两个 Primary Agents
2. 用 <kbd>Tab</kbd> 键（或配置的 `agent_cycle`）在 Agents 之间切换
3. Plan 用于分析规划（禁止编辑源代码），Build 用于开发执行（所有工具可用）
4. Plan Agent 默认只能编辑项目或全局计划文件，不能编辑源代码
5. 复杂任务可以告诉 AI "用 TODO 跟踪进度"，让 AI 有条理地执行

---

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|-----|---------|------|
| Build Agent 定义 | [`packages/opencode/src/agent/agent.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/agent/agent.ts#L77-L91) | 77-91 |
| Plan Agent 定义 | [`packages/opencode/src/agent/agent.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/agent/agent.ts#L92-L114) | 92-114 |
| 默认权限规则 | [`packages/opencode/src/agent/agent.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/agent/agent.ts#L55-L73) | 55-73 |
| plan_exit 工具 | [`packages/opencode/src/tool/plan.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/plan.ts#L13-L79) | 13-79 |
| Plan 模式提示词 | [`packages/opencode/src/session/prompt.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/session/prompt.ts#L1451-L1455) | 1451-1455 |
| undo/revert 与文件补丁回滚 | [`packages/opencode/src/session/revert.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/revert.ts#L38-L88) | 38-88 |
| redo/unrevert 与文件恢复 | [`packages/opencode/src/session/revert.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/revert.ts#L91-L98) | 91-98 |
| `snapshot: false` 的边界 | [`packages/core/src/v1/config/config.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L52-L55) | 52-55 |
| TUI 配置自动迁移 | [`packages/opencode/src/config/tui-migrate.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/tui-migrate.ts#L24-L67) | 24-67 |
| TUI 配置加载层级 | [`packages/opencode/src/config/tui.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/tui.ts#L171-L209) | 171-209 |

**关键常量**：
- `plan_exit`：从 Plan 切换到 Build 的工具

**权限动作**：
- `allow`：允许执行
- `deny`：拒绝执行
- `ask`：询问用户确认

**Plan Agent 权限配置**（源码定义）：
```typescript
{
  question: "allow",                        // 可以向你提问
  plan_exit: "allow",                       // 可以退出 Plan 模式
  external_directory: {
    [Global.Path.data + "/plans/*"]: "allow",  // 允许访问全局计划目录
  },
  edit: {
    "*": "deny",                           // 禁止编辑所有文件
    ".opencode/plans/*.md": "allow",       // 允许编辑项目计划文件
    [Global.Path.data + "/plans/*.md"]: "allow", // 允许编辑全局计划文件
  },
}
```

</details>

---

## 下一课预告

> 下一课我们将认识 Agent 系统，学会调用不同专家完成任务。
