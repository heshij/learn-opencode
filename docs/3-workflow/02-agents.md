---
title: 认识 Agent：你的专属团队
subtitle: 不同专家，不同任务
course: OpenCode 中文实战课
stage: 第三阶段
lesson: "3.2"
duration: 12 分钟
practice: 15 分钟
level: 新手
description: OpenCode Agent 就像不同工种的专家，用 Tab 键切换主 Agent，用 @agent名 调用子 Agent，实现高效协作。
tags:
  - Agent
  - 子代理
  - 协作
prerequisite:
  - 3.1 Plan vs Build
---

# 认识 Agent：你的专属团队

> 💡 **一句话总结**：Agent 就像不同工种的专家，用 <kbd>Tab</kbd> 切换主 Agent，用 `@agent名` 调用子 Agent。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/3-workflow/agents-notes.mini.jpeg"
     alt="认识 Agent：你的专属团队学霸笔记"
     data-zoom-src="/images/3-workflow/agents-notes.jpeg" />

---

## 学完你能做什么

- 理解什么是 Agent（主代理 vs 子代理）
- 知道内置 Agent 各自擅长什么
- 能调用不同 Agent 完成任务
- 能在父子会话之间导航

---

<!-- 📹 演示位：Agent 调用演示 -->
<!-- TODO: 待录制演示 GIF -->
<!-- ![Agent 调用演示](/images/3-workflow/agents-demo.gif) -->

---

## 你现在的困境

- 每次都和同一个 AI 对话，不知道还有其他"专家"可用
- 遇到复杂任务，不知道怎么让多个 AI 协作
- 听说过 Agent，但不知道具体怎么用

---

## 什么时候用这一招

- 当你需要：让专业的 AI 做专业的事
- 而且不想：什么任务都丢给同一个通用 AI

---

## 🎒 开始前的准备

> 确保你已经完成以下事项：

- [ ] 完成了 [3.1 Plan vs Build](./01-plan-build)
- [ ] 有一个项目目录

---

## 核心思路

### 什么是 Agent

Agent 就像你的 AI 团队成员，每个人有不同的专长：

- **Build Agent**：全能开发者，能读写文件、执行命令
- **Plan Agent**：规划分析师，主要用于分析代码和提供建议（可写 `.opencode/plan/*.md` 保存方案）
- **Explore Agent**：代码探索者，快速理解代码库结构
- **General Agent**：通用助手，擅长复杂研究和多步骤任务

### 两种类型

| 类型 | 说明 | 调用方式 |
|-----|------|---------|
| **Primary Agent（主代理）** | 你直接对话的 Agent（Build、Plan） | <kbd>Tab</kbd> 切换 |
| **Subagent（子代理）** | 被主代理自动调用或你手动调用的专家（Explore、General） | `@agent名 任务` |

### 内置 Agent 速览

| Agent | 类型 | 擅长 | 默认权限 |
|-------|------|------|---------|
| Build | Primary | 全能开发（默认主 Agent） | 全能（可读写文件、执行命令） |
| Plan | Primary | 分析代码、规划方案、审查建议 | 受限（文件修改和命令执行会提示批准） |
| Explore | Subagent | 快速找到文件、搜索代码、回答代码库问题 | 只读（可搜索、浏览代码） |
| General | Subagent | 复杂研究、多步骤任务、不确定能否快速找到答案时 | 多任务执行（可用 Todo 工具） |

---

## 跟我做

### 第 1 步：查看当前 Agent

**为什么**  
了解现在是哪个 Agent 在工作。

看状态栏，会显示当前 Agent 名称（如 `Build` 或 `Plan`）。

### 第 2 步：用 Tab 切换主 Agent

**为什么**  
在 Build Agent 和 Plan Agent 之间切换。

按 <kbd>Tab</kbd> 键切换。

### 第 3 步：调用 Explore Agent

**为什么**  
让专业的代码探索 Agent 帮你理解项目。

输入：

```
@explore 帮我梳理这个项目的整体结构
```

**你应该看到**：Explore Agent 开始工作，分析项目结构

::: tip 💡 子代理会话
调用子代理后，会创建一个子会话。你可以用 `<leader>→` 进入子会话，用 `<leader>←` 返回父会话。（默认 leader 是 `Ctrl`+`X`）
:::

### 第 4 步：调用 General Agent

**为什么**  
General Agent 擅长复杂研究和多步骤任务。

输入：

```
@general 帮我研究 Node.js 和 Python 的性能对比，并输出总结报告
```

**你应该看到**：General Agent 并行执行多个研究任务，整合结果

### 第 5 步：让主 Agent 自动调用子 Agent

**为什么**  
主 Agent 会根据任务描述和 Agent 的 description 自动判断是否需要调用子 Agent。

输入一个复杂任务：

```
帮我分析这个项目的代码结构，然后添加一个 README.md
```

**你应该看到**：Build Agent 可能会自动调用 Explore Agent 分析项目结构，然后自己创建 README

::: tip 💡 自动调用规则
主 Agent 会根据子 Agent 的 `description` 决定何时调用。例如 Explore 的描述是"快速找到文件、搜索代码"，当任务涉及搜索或探索代码库时就会被调用。
:::

### 第 5.5 步：查看 Agent 列表

**为什么**  
了解当前有哪些 Agent 可用。

按 `<leader>a` 列出所有 Agent（默认 leader 是 `Ctrl`+`X`，即 `Ctrl`+`X`+`a`）

**你应该看到**：
- Primary Agents: build、plan
- Subagents: explore、general
- 以及你自定义的 Agent（如果有）

按 <kbd>Esc</kbd> 退出列表。

### 第 6 步：在父子会话间导航

**为什么**  
查看子 Agent 的详细工作过程，或在主会话和子会话之间切换。

- 按 `<leader>→` 进入下一个会话（父 → 子1 → 子2 → ... → 父）
- 按 `<leader>←` 返回上一个会话（父 ← 子1 ← 子2 ← ... ← 父）
- 按 `<leader>↑` 直接跳转到父会话

**会话层级示例**：
```
主会话 (Build)
  └── 子会话 (Explore)
        └── 孙会话 (General)
```

用导航快捷键可以在多层会话之间自由切换。

::: tip 💡 默认快捷键
- `leader` 键默认是 `Ctrl`+`X`
- `<leader>→` = `Ctrl`+`X`+`→`（右箭头）
- `<leader>←` = `Ctrl`+`X`+`←`（左箭头）
- `<leader>↑` = `Ctrl`+`X`+`↑`（上箭头）
:::

---

## 检查点 ✅

> 全部通过才能继续

- [ ] 知道当前是哪个 Agent（看状态栏）
- [ ] 能用 <kbd>Tab</kbd> 在 Build 和 Plan 之间切换
- [ ] 能用 `@explore` 和 `@general` 调用子 Agent
- [ ] 能用快捷键在父子会话间切换

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| `@agent名` 没反应 | Agent 名称拼错了或不是子代理 | 检查拼写，内置子代理有 `explore`、`general`。主代理（`build`、`plan`）只能用 <kbd>Tab</kbd> 切换 |
| 子会话看不到 | 没有展开或导航到错误的层级 | 用 `<leader>→` / `<leader>←` 导航，或者按 `<leader>↑` 返回父会话 |
| 想切换到 Explore，但 Tab 找不到 | <kbd>Tab</kbd> 只能在主代理（Primary Agent）之间切换 | Explore 是子代理（Subagent），只能用 `@explore` 调用 |
| 子 Agent 被中断后找不到 | 会话可能已关闭或导航到错误层级 | 按 `<leader>↑` 返回父会话，然后用 `<leader>→` 查找 |
| Plan Agent 提示"是否允许编辑" | Plan Agent 默认对文件修改和命令执行都设置为 `ask` | 这是正常行为，Plan 是用于分析的，执行操作前会请求批准 |
| General Agent 没有执行多步任务 | 任务描述不够清晰或任务不够复杂 | 在提示中明确说明需要执行哪些步骤，或确保任务确实需要多步执行 |

---

## 本课小结

你学会了：

1. Agent 是什么（不同专长的 AI 团队成员）
2. 主代理用 <kbd>Tab</kbd> 切换，子代理用 `@agent名` 调用
3. 用快捷键在父子会话间导航

::: tip 📚 深入学习

想要创建自己的 Agent 或深入了解 Agent 配置？
→ 继续阅读 **[5.2a Agent 快速入门](../5-advanced/02a-agent-quickstart)**
:::

---

## 下一课预告

> 下一课我们将学习项目初始化，用 `/init` 让 AI 更懂你的项目。
