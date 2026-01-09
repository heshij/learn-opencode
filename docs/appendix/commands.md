---
title: 斜杠命令速查表
description: OpenCode 所有斜杠命令的完整参考
---

# 斜杠命令速查表

> 在输入框输入 `/` 即可触发命令菜单，或按 `Ctrl+P` 打开命令面板

---

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/appendix/commands-notes.mini.jpeg"
     alt="斜杠命令速查表学霸笔记"
     data-zoom-src="/images/appendix/commands-notes.jpeg" />

---

## 内置命令一览

| 命令 | 功能 | 说明 |
|------|------|------|
| `/new` | 新建会话 | 创建新对话 |
| `/sessions` | 会话列表 | 查看历史会话 |
| `/models` | 模型切换 | 选择模型 |
| `/connect` | 添加提供商 | 配置 API Key |
| `/undo` | 撤销 | 撤销文件修改 |
| `/redo` | 重做 | 重做撤销的修改 |
| `/share` | 分享 | 生成分享链接 |
| `/unshare` | 取消分享 | 取消分享 |
| `/compact` | 压缩 | 压缩上下文 |
| `/editor` | 编辑器 | 打开外部编辑器 |
| `/export` | 导出 | 导出会话 |
| `/theme` | 主题 | 切换主题 |
| `/init` | 初始化 | 生成项目规则 |
| `/help` | 帮助 | 显示帮助 |

> 注意：命令没有短别名。例如 `/themes` 应为 `/theme`。

---

## 命令详解

### /new - 新建会话

创建一个新的对话会话，清空当前上下文。

```
/new
```

**使用场景**：
- 开始新任务时
- 当前对话太长需要重新开始
- 切换到不相关的话题

---

### /sessions - 会话管理

打开会话列表，可以切换到历史会话。

```
/sessions
```

**功能**：
- 查看所有历史会话
- 快速切换会话
- 删除不需要的会话

---

### /models - 模型切换

切换当前使用的 AI 模型。

```
/models
```

**功能**：
- 查看可用模型列表
- 切换主模型

---

### /connect - 添加提供商

交互式配置新的模型提供商。

```
/connect
```

凭证存储在 `~/.local/share/opencode/auth.json`。

**支持的提供商**：
- DeepSeek、Moonshot、MiniMax、Z.AI 等
- Anthropic、OpenAI、Google 等
- Ollama 等本地模型

详见 [模型提供商列表](./providers)

---

### /undo 和 /redo - 撤销重做

撤销或重做 AI 对文件的修改。

```
/undo   # 撤销上一次修改
/redo   # 重做撤销的修改
```

**原理**：
- 基于 Git 实现
- 每次文件修改自动创建检查点
- 可以多次撤销/重做

---

### /share 和 /unshare - 分享会话

生成会话分享链接，或取消分享。

```
/share     # 生成分享链接
/unshare   # 取消分享
```

**注意**：
- 分享后任何人都可以查看会话内容
- 不会分享敏感信息（API Key 等）
- 取消分享后链接立即失效

---

### /compact - 压缩上下文

当对话太长时，压缩历史消息以节省 Token。

```
/compact
```

**使用场景**：
- 对话超过上下文限制
- 想节省 API 费用
- AI 开始"遗忘"早期内容

**原理**：
- AI 总结历史对话
- 保留关键信息
- 删除冗余内容

---

### /editor - 外部编辑器

打开外部编辑器编辑长文本。

```
/editor
```

**使用场景**：
- 输入大段代码或文本
- 需要复杂的编辑功能

**配置**：
```bash
export EDITOR="code --wait"   # VS Code
export EDITOR=vim             # Vim
```

---

### /export - 导出会话

将当前会话导出为 JSON 文件。

```
/export
```

---

### /theme - 主题切换

切换 TUI 界面主题。

```
/theme
```

**内置主题**：
- `opencode` - 默认
- `system` - 自适应终端
- `tokyonight` - 东京之夜
- `catppuccin` - 猫布奇诺
- `gruvbox` - Gruvbox
- `nord` - 北欧

> 注意：命令是 `/theme`，不是 `/themes`。

---

### /init - 项目初始化

为当前项目生成规则文件。

```
/init
```

**功能**：
- 分析项目结构
- 生成项目规则
- 创建 .opencode/ 目录

详见 [项目初始化](../3-workflow/03-init)

---

### /help - 帮助

显示帮助信息和可用命令。

```
/help
```

---

## 自定义命令

可以创建自己的斜杠命令，详见 [快捷命令](../5-advanced/04-commands)。

### 命令文件位置

```
项目级：.opencode/command/*.md
全局级：~/.config/opencode/command/*.md
```

### 示例：创建 /review 命令

```markdown title=".opencode/command/review.md"
---
description: 代码审查
---

请审查以下代码：
$ARGUMENTS
```

使用方式：

```
/review @src/main.ts
```

### 命令参数

| 占位符 | 说明 |
|--------|------|
| `$ARGUMENTS` | 全部参数 |
| `$1`, `$2`, ... | 第 N 个参数 |
| `!`command`` | Shell 命令输出 |
| `@file` | 文件引用 |

### JSON 配置方式

> 来源：[commands.mdx](https://github.com/anomalyco/opencode/blob/dev/packages/web/src/content/docs/commands.mdx)

```json title="opencode.json"
{
  "command": {
    "test": {
      "template": "运行测试并报告失败的用例",
      "description": "运行测试",
      "agent": "build",
      "model": "anthropic/claude-sonnet-4-20250514",
      "subtask": false
    }
  }
}
```

### 配置选项

| 选项 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `template` | string | ✅ | 发送给 LLM 的提示词 |
| `description` | string | 可选 | TUI 中显示的命令描述 |
| `agent` | string | 可选 | 执行命令的 Agent |
| `model` | string | 可选 | 覆盖默认模型 |
| `subtask` | boolean | 可选 | 强制作为子任务执行（不污染主上下文） |

> **subtask 说明**：如果命令指定的 agent 是 subagent，默认会触发子任务调用。设置 `subtask: false` 可禁用此行为；设置 `subtask: true` 则强制以子任务方式执行，即使 agent 的 mode 是 primary。

---

## 命令速记表

| 我要... | 输入 |
|---------|------|
| 开始新对话 | `/new` |
| 看历史对话 | `/sessions` |
| 换个模型 | `/models` |
| 添加提供商 | `/connect` |
| 撤销修改 | `/undo` |
| 压缩对话 | `/compact` |
| 换个主题 | `/theme` |
| 分享会话 | `/share` |

---

## 相关资源

- [CLI 命令参考](./cli) - 命令行参数
- [快捷命令](../5-advanced/04-commands) - 创建自定义命令
- [快捷键速查表](./keybinds) - 键盘快捷键
