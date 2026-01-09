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

<!-- 📹 演示位：模式切换演示 -->
<!-- TODO: 待录制演示 GIF -->
<!-- ![Plan vs Build 演示](/images/3-workflow/plan-build-demo.gif) -->

---

## 你现在的困境

- AI 一上来就改文件，有时候改得不对
- 想让 AI 先分析再动手，但不知道怎么控制
- 不知道什么时候该让 AI 只读，什么时候该让它写

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

Plan Agent 使用**权限询问**机制保护你的代码：

| 权限 | Plan Agent | Build Agent |
|------|-----------|------------|
| `edit`（写/改文件） | **ask**（询问） | allow |
| `bash`（执行命令） | **ask**（询问） | allow |
| `read`、`grep`、`glob` 等 | allow | allow |

`ask` 模式会在 Agent 尝试执行操作前提示你确认，可以选择：
- **allow**：允许这次操作
- **deny**：拒绝这次操作
- **allow all**：本次会话允许所有此类操作

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

---

## 可用工具

Plan Agent 可以使用只读工具，Build Agent 可以使用所有工具：

### 只读工具（Plan 和 Build 都可用）

| 工具 | 说明 |
|------|------|
| `read` | 读取文件内容 |
| `grep` | 搜索文件内容 |
| `glob` | 按模式查找文件 |
| `list` | 列出目录内容 |
| `webfetch` | 获取网页内容 |

### 读写工具（仅 Build 默认可用）

| 工具 | 说明 |
|------|------|
| `write` | 创建新文件 |
| `edit` | 修改现有文件 |
| `bash` | 执行 Shell 命令 |

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
        "edit": "ask",  // 写文件前询问
        "bash": "ask"   // 执行命令前询问
      }
    }
  }
}
```

**配置项说明**：

- `model`：使用的模型，格式为 `provider/model-id`
- `temperature`：控制随机性（0-1），值越低越专注
- `permission.edit`：文件编辑权限（`ask`/`allow`/`deny`）
- `permission.bash`：命令执行权限（`ask`/`allow`/`deny`）

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

**你应该看到**：AI 使用 `read` 工具读取文件，分析结构。由于 Plan Agent 的 `edit` 权限是 `ask`，AI 不会直接修改文件。

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

---

## 检查点 ✅

> 全部通过才能继续

- [ ] <kbd>Tab</kbd> 能在 Plan Agent 和 Build Agent 之间切换
- [ ] Plan Agent 默认 `ask` 权限，写文件/执行命令前会提示确认
- [ ] Build Agent 默认 `allow` 权限，可以自由修改文件和执行命令

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 想让 AI 改文件但没改 | 可能在 Plan Agent，权限是 `ask` | 按 Tab 切换到 Build |
| AI 改了不该改的文件 | 在 Build Agent，权限是 `allow` | 用 `/undo` 撤销，下次用 Plan 先分析 |
| Plan Agent 突然不再询问 | 可能之前选择了"允许所有" | 重新切换到 Plan 会重置权限 |

---

## 高级功能（了解即可）

### temperature：控制随机性

Plan Agent 通常使用较低的 `temperature`（如 0.1），输出更专注和确定；Build Agent 使用中等值（如 0.3），在专注和创造力之间平衡。

### maxSteps：限制迭代次数

可以设置 Agent 最多执行多少次工具调用，避免过度操作或产生过多费用。

```jsonc
{
  "agent": {
    "plan": {
      "steps": 5  // 最多 5 次工具调用
    }
  }
}
```

### 自定义快捷键

默认使用 <kbd>Tab</kbd> 切换 Agent，也可以在配置中修改 `agent_cycle` 键绑定：

```jsonc
{
  "keybinds": {
    "agent_cycle": "f1",        // 切换到下一个 Agent
    "agent_cycle_reverse": "shift+f1"  // 切换到上一个 Agent
  }
}
```

> 💡 这些功能进阶时再深入，当前阶段了解即可。

---

## 本课小结

你学会了：

1. Plan 和 Build 是两个 Primary Agents，Plan 使用权限询问机制保护代码
2. 用 <kbd>Tab</kbd> 键（或配置的 `agent_cycle`）在 Agents 之间切换
3. Plan 用于分析规划（只读工具可用），Build 用于开发执行（所有工具可用）
4. 权限系统有三种模式：`ask`（询问）、`allow`（允许）、`deny`（拒绝）

---

---

## 下一课预告

> 下一课我们将认识 Agent 系统，学会调用不同专家完成任务。
