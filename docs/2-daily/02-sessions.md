---
title: 管理对话
subtitle: 高效管理你的会话
course: OpenCode 中文实战课
stage: 第二阶段
lesson: "2.2"
duration: 15 分钟
practice: 20 分钟
level: 新手
description: 用 /new 新建会话、/sessions 切换、/undo 撤销、/export 导出，还能用 CLI 备份恢复和 Fork 分叉会话。
tags:
  - 会话
  - 撤销
  - 导出
  - 导入
  - Fork
prerequisite:
  - 2.1 界面与基础操作
---

# 管理对话

> 💡 **一句话总结**：用 `/new` 新建会话，用 `/sessions` 切换，用 `/undo` 撤销，用 `/export` 导出，用 `opencode import` 导入。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/2-daily/sessions-notes.mini.jpeg" 
     alt="管理对话学霸笔记" 
     data-zoom-src="/images/2-daily/sessions-notes.jpeg" />

---

## 学完你能做什么

- 创建和切换多个会话
- 撤销 AI 的错误操作
- 导出对话记录（Markdown 和 JSON 两种格式）
- 从文件或分享链接导入会话
- Fork 会话，从某个节点分叉出新对话
- 压缩过长的上下文

---

## 你现在的困境

- 对话越来越长，AI 开始混淆上下文
- AI 改错了代码，不知道怎么撤销
- 重要的对话想保存下来，不知道怎么导出
- 同事分享了一个会话链接，不知道怎么导入到本地继续
- 想从对话的某个节点尝试不同方向，但不想丢掉原来的进度

---

## 什么时候用这一招

- 当你需要：同时处理多个不同任务
- 而且不想：让 AI 把不相关的上下文混在一起

---

## 🎒 开始前的准备

> 确保你已经完成以下事项：

- [ ] 完成了 [2.1 界面与基础操作](./01-interface)
- [ ] 当前有一个进行中的对话

---

## 核心思路
<AdInArticle />

### 为什么需要多个会话

- **隔离上下文**：不同任务用不同会话，避免 AI 混淆
- **并行工作**：一边让 AI 写代码，一边让 AI 分析文档
- **保留历史**：重要对话可以保留，随时回看

### 会话存在哪里？

OpenCode 使用 SQLite 保存会话、消息和消息片段。默认数据库位于 OpenCode 数据目录中的 `opencode.db`：

```
~/.local/share/opencode/opencode.db
```

::: details 路径说明
示例路径来自 Linux 的 XDG 数据目录。实际位置由系统和环境决定；数据库中的会话仍关联各自项目，不要手工修改数据库文件。
:::

### 会话的一生

一个会话从创建到结束，经历这几个阶段：

```
创建 → 活跃对话 → 压缩（上下文太长时自动触发）→ 归档/删除
```

大多数时候你不需要关心这些，OpenCode 会自动处理。你只需要知道：对话太长时会自动压缩（详见 [5.20 上下文压缩](/5-advanced/20-compaction)），不用的会话可以删除。

### 会话管理命令速览

| 命令 | 作用 |
|-----|------|
| `/new` | 新建会话 |
| `/sessions` | 查看并切换会话 |
| `/undo` | 撤销上一步操作 |
| `/redo` | 重做被撤销的操作 |
| `/compact` | 压缩上下文 |
| `/export` | 导出对话记录 |
| `/share` | 分享会话（生成链接） |
| `opencode import` | 从文件或 URL 导入会话（CLI 命令） |
| `opencode export` | 导出会话为 JSON（CLI 命令） |

---

## 跟我做

### 第 1 步：新建一个会话

**为什么**  
开始新任务时，用新会话避免之前的上下文干扰。

输入：

```
/new
```

或使用快捷键：<kbd>Ctrl</kbd>+<kbd>X</kbd> <kbd>N</kbd>

**你应该看到**：界面清空，进入新会话

### 第 2 步：在新会话中对话

**为什么**  
让新会话有一些内容，方便后面切换查看。

输入：

```
你好，这是第二个会话
```

### 第 3 步：查看并切换会话

**为什么**  
学会在多个会话之间切换。

输入：

```
/sessions
```

**你应该看到**：会话列表，包含刚才的两个会话

用 <kbd>↑</kbd> <kbd>↓</kbd> 选择，按 <kbd>Enter</kbd> 切换。

### 第 4 步：测试撤销功能

**为什么**  
AI 可能会做错事，撤销能帮你恢复。

::: warning ⚠️ 前提条件
`/undo` 撤销**文件操作**（创建、修改、删除文件）需要项目是 **Git 仓库**。

| 项目类型 | 撤销文件操作 | 撤销对话记录 |
|---------|------------|------------|
| Git 项目 | ✅ 文件会被恢复 | ✅ |
| 非 Git 项目 | ❌ 文件不会变化 | ✅ |

下面的测试请在一个 Git 项目中进行。如果当前目录不是 Git 仓库，先执行 `git init`。
:::

先让 AI 做一个操作（比如创建文件）：

```
创建一个 test.txt 文件，内容写 "hello"
```

然后撤销：

```
/undo
```

**你应该看到**（Git 项目）：
- 文件被删除，恢复到操作前的状态
- 界面显示撤销确认

**你应该看到**（非 Git 项目）：
- 对话记录被撤销
- ⚠️ 文件**不会被删除**（因为没有 Git 快照）

### 第 5 步：压缩过长的上下文

**为什么**  
对话太长会占用 Token，压缩后可以节省成本。

输入：

```
/compact
```

**你应该看到**：AI 会总结之前的对话，然后清理旧消息

### 第 6 步：导出对话记录

**为什么**  
保存重要对话，方便日后查阅。

输入：

```
/export
```

**你应该看到**：对话被导出为 Markdown 文件

### 第 7 步：用 CLI 导出和导入会话

**为什么**  
TUI 里的 `/export` 导出的是 Markdown 格式，适合阅读。但如果你想备份完整数据、或者在另一台机器上恢复会话，需要用 CLI 命令导出 JSON 格式。

**导出**：

```bash
# 交互式选择会话导出
opencode export

# 指定会话 ID 导出，重定向到文件
opencode export session_abc123 > backup.json
```

不指定会话 ID 时，会弹出列表让你选：

```
Export session
◇ Select session to export
│   Fix authentication bug • 2026-02-14 10:30 • a1b2c3d4
│   Add new API endpoint • 2026-02-13 15:20 • e5f6g7h8
└   Update documentation • 2026-02-12 09:00 • i9j0k1l2
```

**导入**：

```bash
# 从本地文件导入
opencode import backup.json
```

**你应该看到**：`Imported session: session_abc123`

导入后，用 `/sessions` 就能看到恢复的会话。

### 第 8 步：从分享链接导入会话

**为什么**  
同事分享了一个 OpenCode 会话链接，你想在本地继续那个对话。

```bash
opencode import https://opncd.ai/share/abc123
```

::: tip 💡 URL 格式
分享链接的默认格式是 `https://opncd.ai/share/<slug>`。企业版用户的域名可能不同，取决于 `enterprise.url` 配置。如果 URL 格式不对，会提示错误。
:::

### 第 9 步：Fork 会话

**为什么**  
有时候你想从对话的某个节点"分叉"出去，尝试不同的方向，但又不想丢掉原来的对话。Fork 就是干这个的。

Fork 会复制当前会话的所有历史消息，创建一个新会话。新会话的标题会加上 `(fork #1)` 后缀，再次 Fork 则递增为 `(fork #2)`、`(fork #3)`……

**操作方式**：

Fork 没有默认快捷键，你可以在项目的 `tui.json` 或 `tui.jsonc` 中给它绑一个：

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  "keybinds": {
    "session_fork": "<leader>f"
  }
}
```

快捷键属于独立 TUI 配置，不要写入主 `opencode.json` / `opencode.jsonc`。源码见 v1.18.22 的 [TUI 快捷键 Schema](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/index.tsx#L61-L75)。

配置后，按 <kbd>Ctrl</kbd>+<kbd>X</kbd> <kbd>f</kbd> 就能 Fork 当前会话。

**你应该看到**：新会话出现，标题类似 `原标题 (fork #1)`

---

## 检查点 ✅

> 全部通过才能继续

- [ ] `/new` 能创建新会话
- [ ] `/sessions` 能看到会话列表并切换
- [ ] `/undo` 能撤销 AI 的操作（Git 项目可撤销文件）
- [ ] `/export` 能导出对话
- [ ] `opencode export` 能导出 JSON 格式的完整会话数据
- [ ] `opencode import` 能从文件导入会话

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| `/undo` 文件没恢复 | 当前目录不是 Git 仓库 | 切换到 Git 项目，或先执行 `git init` |
| `/undo` 撤销对话但文件还在 | 非 Git 项目不支持文件撤销 | 这是正常行为，只撤销对话记录 |
| 会话太多找不到 | 会话名都是默认的 | 养成用 `/new 任务名` 命名的习惯 |
| `/compact` 后丢了重要信息 | 压缩会删除详细对话 | 重要信息先 `/export` 备份 |
| `opencode import` 失败 | JSON 格式不对 | 只能导入 `opencode export` 导出的文件 |
| 分享 URL 导入失败 | URL 格式不对 | 格式必须是 `https://opncd.ai/share/<slug>` |

---

## 本课小结

你学会了：

1. 用 `/new` 新建会话
2. 用 `/sessions` 切换会话
3. 用 `/undo` `/redo` 撤销和重做
4. 用 `/compact` 压缩上下文
5. 用 `/export` 导出对话（Markdown 格式）
6. 用 `opencode export` / `opencode import` 备份和恢复完整会话（JSON 格式）
7. 从分享链接导入会话：`opencode import https://opncd.ai/share/xxx`
8. 用 Fork 从当前对话分叉出新会话

---

## 下一课预告

> 下一课我们学习 **[2.3 常用快捷键推荐](./03-shortcuts)**。
>
> 你会学到：
> - Leader 键机制（<kbd>Ctrl</kbd>+<kbd>X</kbd> 前缀）
> - 15 个最实用的快捷键
> - 程序员专属的 Readline 风格快捷键
