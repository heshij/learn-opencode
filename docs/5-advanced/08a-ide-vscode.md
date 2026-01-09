---
title: 5.8a VS Code 扩展
subtitle: VS Code、Cursor 等编辑器集成
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.8a"
duration: 10 分钟
practice: 10 分钟
level: 进阶
description: 在 VS Code、Cursor 等编辑器中使用 OpenCode，无缝集成到你的开发流程。
tags:
  - IDE
  - VS Code
  - Cursor
prerequisite:
  - 2.1 界面与基础操作
---

# 5.8a VS Code 扩展

> 在 VS Code、Cursor 等编辑器中使用 OpenCode。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/08a-ide-vscode-notes.mini.jpeg" alt="VS Code扩展学霸笔记" data-zoom-src="/images/5-advanced/08a-ide-vscode-notes.jpeg" />

---

## 学完你能做什么

- 安装 VS Code 扩展
- 使用快捷键快速调用
- 发送选中代码给 OpenCode
- 配置外部编辑器

---

## 支持的编辑器

- VS Code
- Cursor
- Windsurf
- VSCodium

> 如果你使用 Zed、JetBrains、Neovim 等编辑器，请查看 [5.8b ACP 协议](./08b-acp)。

---

## 安装方式

### 自动安装（推荐）

1. 打开 VS Code
2. 打开**集成终端**（不是外部终端）
3. 运行 `opencode` - 扩展自动安装

### 手动安装

1. 打开扩展市场（`Cmd+Shift+X` / `Ctrl+Shift+X`）
2. 搜索 "OpenCode"
3. 点击安装

---

## 快捷键

| 功能 | macOS | Windows/Linux |
|------|-------|---------------|
| 打开面板 | `Cmd+Esc` | `Ctrl+Esc` |
| 新建会话 | `Cmd+Shift+Esc` | `Ctrl+Shift+Esc` |
| 插入文件引用 | `Cmd+Option+K` | `Alt+Ctrl+K` |

### 功能说明

- **打开面板**：打开 OpenCode 终端，或聚焦已有会话
- **新建会话**：启动新的 OpenCode 会话（即使已有会话）
- **插入文件引用**：插入当前文件引用，格式如 `@File#L37-42`

---

## 使用流程

1. `Cmd+Esc` 打开 OpenCode 面板
2. 在编辑器中选中代码
3. `Cmd+Option+K` 插入文件引用
4. 输入问题，回车发送

### Context Awareness

扩展会自动分享你当前的选择或标签页给 OpenCode，无需手动复制粘贴。

---

## 外部编辑器配置

当你在 TUI 中使用 `/editor` 或 `/export` 命令时，OpenCode 会打开外部编辑器。

### Linux / macOS

```bash
# VS Code
export EDITOR="code --wait"

# Cursor
export EDITOR="cursor --wait"

# Vim
export EDITOR="vim"

# Nano
export EDITOR="nano"
```

添加到你的 shell 配置（`~/.bashrc` 或 `~/.zshrc`）使其永久生效。

### Windows CMD

```cmd
set EDITOR=notepad

rem VS Code（需要 --wait）
set EDITOR=code --wait
```

使用 **系统属性** > **环境变量** 使其永久生效。

### Windows PowerShell

```powershell
$env:EDITOR = "notepad"

# VS Code（需要 --wait）
$env:EDITOR = "code --wait"
```

添加到 PowerShell profile 使其永久生效。

### 常用编辑器

| 编辑器 | 命令 | 需要 `--wait` |
|--------|------|---------------|
| VS Code | `code` | 是 |
| Cursor | `cursor` | 是 |
| Windsurf | `windsurf` | 是 |
| Neovim | `nvim` | 否 |
| Vim | `vim` | 否 |
| Nano | `nano` | 否 |
| Sublime Text | `subl` | 是 |
| Notepad | `notepad` | 否 |

> `--wait` 标志使编辑器进程阻塞直到关闭，这是 `/editor` 命令正常工作的必要条件。

---

## 故障排查

### 扩展未自动安装

确保满足以下条件：

1. 在 VS Code 的**集成终端**中运行 `opencode`（不是外部终端）
2. IDE CLI 已安装：
   - VS Code: `code` 命令可用
   - Cursor: `cursor` 命令可用
   - Windsurf: `windsurf` 命令可用
   - VSCodium: `codium` 命令可用

如果 CLI 未安装：
- `Cmd+Shift+P` (macOS) / `Ctrl+Shift+P` (Windows)
- 搜索 "Shell Command: Install 'code' command in PATH"

3. VS Code 有权限安装扩展

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 扩展没自动装 | 不在集成终端运行 | 在 VS Code 内置终端运行 `opencode` |
| 快捷键不生效 | 与其他扩展冲突 | 检查快捷键设置，修改冲突项 |
| 编辑器打不开 | EDITOR 变量没设 | 设置 `export EDITOR="code --wait"` |
| 编辑器打开后立即关闭 | 缺少 `--wait` 标志 | 添加 `--wait` 参数 |

---

## 延伸阅读

- [5.8b ACP 协议](./08b-acp) - Zed、JetBrains、Neovim 等编辑器集成
- [速查/快捷键](../appendix/keybinds) - 完整快捷键列表

---

## 本课小结

你学会了：

1. VS Code 扩展的安装方式（自动/手动）
2. 常用快捷键（打开面板、新建会话、插入引用）
3. 外部编辑器配置（支持多平台）
4. 常见问题排查

---

## 下一课预告

> 下一课我们将学习 ACP 协议，让你在 Zed、JetBrains、Neovim 等编辑器中使用 OpenCode。
