---
title: 实验性功能汇总
description: OpenCode 实验性功能的完整列表、启用方式和使用场景
---

# 实验性功能汇总

> OpenCode 的实验性功能正在积极开发中，可能随时变更。本页汇总所有可用的实验性功能及其启用方式。

---

## 什么是实验性功能？

实验性功能是 OpenCode 团队正在开发的新特性，在正式发布前供用户提前体验和反馈。

**特点**：
- 功能可能不完善
- API 可能随时变更
- 部分功能需要额外依赖

**启用原则**：
- 按需启用，不需要全开
- 遇到问题可以先关闭
- 关注更新日志了解变化

---

## 快速启用

### 方式一：一键启用全部

```bash
# macOS / Linux：添加到 ~/.zshrc 或 ~/.bashrc
export OPENCODE_EXPERIMENTAL=true

# 然后重新加载
source ~/.zshrc
```

### 方式二：按需启用单个功能

```bash
# 只启用你需要的功能
export OPENCODE_EXPERIMENTAL_LSP_TOOL=true
export OPENCODE_EXPERIMENTAL_PLAN_MODE=true
export OPENCODE_EXPERIMENTAL_CODE_MODE=true
export OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true
```

---

## 实验性功能列表

### 🌐 网络搜索

| 变量 | 说明 | 相关教程 |
|------|------|---------|
| `OPENCODE_ENABLE_EXA` | 启用 websearch 工具，让 AI 能搜索互联网 | [5.23 网络搜索与获取](../5-advanced/23-web-search) |

**启用方式**：
```bash
export OPENCODE_ENABLE_EXA=true
```

**使用场景**：
- 查询最新的技术文档和 API 用法
- 搜索错误信息的解决方案
- 了解库的最新版本特性

::: tip Zen 用户
如果你使用 OpenCode Zen 托管模型，websearch 已经自动启用，无需配置。
:::

---

### 🔧 LSP 增强

| 变量 | 说明 | 相关教程 |
|------|------|---------|
| `OPENCODE_EXPERIMENTAL_LSP_TOOL` | 启用 LSP 工具（跳转定义、查找引用等） | [5.19 LSP 代码智能](../5-advanced/19-lsp) |
| `OPENCODE_EXPERIMENTAL_LSP_TY` | 启用实验性 ty Python 服务器（替代 pyright） | [5.19 LSP 代码智能](../5-advanced/19-lsp) |

**启用方式**：
```bash
export OPENCODE_EXPERIMENTAL_LSP_TOOL=true
export OPENCODE_EXPERIMENTAL_LSP_TY=true
```

**使用场景**：
- 让 AI 能执行「跳转到定义」「查找所有引用」等 LSP 操作
- Python 项目使用更快的类型检查器

---

### 📋 工作流增强

| 变量 | 说明 | 相关教程 |
|------|------|---------|
| `OPENCODE_EXPERIMENTAL_PLAN_MODE` | 在 CLI 中暴露实验性的 `plan_exit` 工具 | [3.1 规划与构建](../3-workflow/01-plan-build) |

**启用方式**：
```bash
export OPENCODE_EXPERIMENTAL_PLAN_MODE=true
```

**使用场景**：
- 大型重构任务：先让 AI 调研并生成计划，审核后再执行
- 不确定最佳方案：先规划多套方案，选择后再动手
- 需要人工审核：计划文件可以保存、分享、迭代

> Build 和 Plan Agent 无论是否设置这个变量都会存在，你仍可手动切换 Agent。这个变量只控制 CLI 工具列表是否加入 `plan_exit`。

**新增工具**：
- `plan_exit`：Plan Agent 完成计划后，询问是否切换到 Build

目标版本没有 `plan_enter` 工具。进入 Plan Agent 请使用 <kbd>Tab</kbd> 或配置的 Agent 切换键。

---

### MCP Code Mode

| 变量 | 说明 | 相关教程 |
|------|------|---------|
| `OPENCODE_EXPERIMENTAL_CODE_MODE` | 启用受限的 MCP 编排 `execute` 工具 | [5.7b MCP 进阶](../5-advanced/07b-mcp-advanced) |

**启用方式**：
```bash
export OPENCODE_EXPERIMENTAL_CODE_MODE=true
```

`execute` 只有在开关启用，并且当前 Agent 与会话权限下至少一个 MCP 工具可见时才会出现。它运行受限解释器代码，只能访问可见 MCP 工具组成的目录；不能当作 shell 使用，每次 MCP 调用仍执行原工具权限检查。

源码：[运行时开关](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/effect/runtime-flags.ts#L48)、[`execute` 可见条件](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/registry.ts#L280-L308)、[受限执行环境](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/code-mode.ts#L239-L274)。

---

### 后台 Subagent

| 变量 | 说明 |
|------|------|
| `OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS` | 允许 `task` 使用 `background: true`，并支持把运行中的同步子代理转入后台 |

**启用方式**：
```bash
export OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true
```

该开关只控制后台能力。子代理能否继续启动子代理由根级 `subagent_depth` 配置控制，默认值是 `1`，即主 Agent 可以启动一层子代理，但该子代理不能再嵌套启动子代理：

```jsonc
{
  "subagent_depth": 2
}
```

把深度调大前应确认权限边界和任务成本；达到上限后，`task` 会直接报错，而不是静默降级。

源码：[后台实验开关](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/effect/runtime-flags.ts#L43)、[后台检查与深度限制](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/task.ts#L96-L115)、[`subagent_depth` Schema](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L84-L86)。

---

### 🗂️ 工作区管理

| 变量 | 说明 |
|------|------|
| `OPENCODE_EXPERIMENTAL_WORKSPACES` | 在 TUI 中启用工作区（Workspaces）支持 |

**启用方式**：
```bash
export OPENCODE_EXPERIMENTAL_WORKSPACES=1
```

**使用场景**：
- 同时开发多个项目/仓库
- 使用 Git Worktree 在不同分支间切换
- 隔离不同任务的上下文

**TUI 操作**：
- 输入 `/workspaces` 打开工作区列表
- 或按 `Ctrl+P` 打开命令面板 → 输入 "workspace"
- 可以创建、切换、删除工作区

**当前支持的工作区类型**：
| 类型 | 说明 |
|------|------|
| `worktree` | Git Worktree（同一仓库的不同分支） |

---

### 🎨 界面与交互

| 变量 | 说明 |
|------|------|
| `OPENCODE_EXPERIMENTAL_ICON_DISCOVERY` | 自动发现项目图标（显示在界面） |
| `OPENCODE_EXPERIMENTAL_MARKDOWN` | 启用实验性 Markdown 渲染组件 |
| `OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT` | 禁用 TUI 中选中文本自动复制 |

**启用方式**：
```bash
export OPENCODE_EXPERIMENTAL_ICON_DISCOVERY=true
export OPENCODE_EXPERIMENTAL_MARKDOWN=true
```

---

### ⚡ 性能与格式化

| 变量 | 说明 | 相关教程 |
|------|------|---------|
| `OPENCODE_EXPERIMENTAL_OXFMT` | 启用 oxfmt 格式化器（Rust 编写，高性能） | [5.18 代码格式化器](../5-advanced/18-formatters) |
| `OPENCODE_EXPERIMENTAL_FILEWATCHER` | 为整个目录启用文件监视器 |
| `OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER` | 禁用文件监视器 |

**启用方式**：
```bash
export OPENCODE_EXPERIMENTAL_OXFMT=true
```

**使用 oxfmt 的前置条件**：
- 项目 `package.json` 中有 `oxfmt` 依赖
- 启用实验性标志

---

### ⏱️ 超时与限制

| 变量 | 类型 | 说明 |
|------|------|------|
| `OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS` | number | Bash 命令默认超时（毫秒） |
| `OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX` | number | LLM 响应最大输出 token 数 |

**示例**：
```bash
# 设置 bash 超时为 2 分钟
export OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS=120000

# 限制 LLM 输出最多 8192 token
export OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX=8192
```

---

## opencode.json 中的 experimental 配置

除了环境变量，`opencode.json` 中也有 `experimental` 字段，用于配置另一类实验性功能：

```json
{
  "experimental": {
    "batch_tool": true,           // 启用批量操作工具
    "openTelemetry": true,        // 启用 OpenTelemetry 链路追踪
    "disable_paste_summary": true, // 禁用粘贴大段文本自动摘要
    "continue_loop_on_deny": true, // 工具被拒绝时继续思考
    "primary_tools": ["tool1"],   // 仅限 Primary Agent 使用的工具
    "mcp_timeout": 30000          // MCP 请求超时（毫秒）
  }
}
```

| 字段 | 说明 |
|------|------|
| `batch_tool` | 启用批量工具，一次执行多个操作 |
| `openTelemetry` | 启用 OpenTelemetry，用于性能监控和链路追踪 |
| `disable_paste_summary` | 粘贴大段文本时不自动生成摘要 |
| `continue_loop_on_deny` | 当用户拒绝工具调用时，Agent 继续思考而不是中断 |
| `primary_tools` | 指定仅限 Primary Agent 使用的工具列表 |
| `mcp_timeout` | MCP 请求的全局超时时间（毫秒） |

---

## 完整配置示例

以下是一个「全功能」实验性配置示例，你可以按需复制：

```bash
# ═══════════════════════════════════════════════════════════════
# OpenCode 实验性功能配置
# 添加到 ~/.zshrc 或 ~/.bashrc，然后 source 一下
# ═══════════════════════════════════════════════════════════════

# 一键启用所有实验性功能（下面这些单独开关会自动被包含）
# export OPENCODE_EXPERIMENTAL=true

# ───────────────────────────────────────────────────────────────
# 网络搜索（需要 Exa API，或使用 Zen 托管模型自动启用）
# ───────────────────────────────────────────────────────────────
export OPENCODE_ENABLE_EXA=true           # 启用 websearch 工具

# ───────────────────────────────────────────────────────────────
# LSP（语言服务器协议）增强
# ───────────────────────────────────────────────────────────────
export OPENCODE_EXPERIMENTAL_LSP_TOOL=true  # 启用 LSP 工具
export OPENCODE_EXPERIMENTAL_LSP_TY=true    # 启用实验性 ty Python 服务器

# ───────────────────────────────────────────────────────────────
# 界面与交互
# ───────────────────────────────────────────────────────────────
export OPENCODE_EXPERIMENTAL_MARKDOWN=true         # 实验性 Markdown 渲染
export OPENCODE_EXPERIMENTAL_ICON_DISCOVERY=true   # 自动发现项目图标

# ───────────────────────────────────────────────────────────────
# 工作流增强
# ───────────────────────────────────────────────────────────────
export OPENCODE_EXPERIMENTAL_PLAN_MODE=true  # 在 CLI 中暴露 plan_exit 工具
export OPENCODE_EXPERIMENTAL_CODE_MODE=true  # 启用受限 MCP 编排工具
export OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true  # 启用后台子代理

# ───────────────────────────────────────────────────────────────
# 工作区管理
# ───────────────────────────────────────────────────────────────
export OPENCODE_EXPERIMENTAL_WORKSPACES=1    # 启用 TUI 工作区支持

# ───────────────────────────────────────────────────────────────
# 性能与格式化
# ───────────────────────────────────────────────────────────────
export OPENCODE_EXPERIMENTAL_OXFMT=true      # 启用 oxfmt 格式化器

# ───────────────────────────────────────────────────────────────
# 超时与限制（可选）
# ───────────────────────────────────────────────────────────────
# export OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS=120000
# export OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX=8192
```

---

## 常见问题

### 启用后没有效果？

1. **确认已重新加载配置**：
   ```bash
   source ~/.zshrc  # 或 source ~/.bashrc
   ```

2. **确认已重启 OpenCode**：环境变量在进程启动时读取

3. **确认变量已设置**：
   ```bash
   env | grep OPENCODE
   ```

### 功能不稳定？

实验性功能可能存在问题：
- 查看 [更新日志](../changelog/) 了解最新变化
- 遇到问题可以先关闭对应的功能
- 在 [GitHub Issues](https://github.com/anomalyco/opencode/issues) 反馈

### 如何关闭某个功能？

如果没有启用总开关 `OPENCODE_EXPERIMENTAL`，移除或注释对应的专用变量即可。若总开关为 `true`，专用变量未设置时会回退到总开关，此时要显式设为 `false`，或关闭总开关：
```bash
export OPENCODE_EXPERIMENTAL_PLAN_MODE=false
# 或移除/关闭 OPENCODE_EXPERIMENTAL=true
```

---

## 相关资源

- [CLI 环境变量参考](./cli) - 所有环境变量的完整列表
- [配置选项参考](./config-ref) - opencode.json 配置详解
- [更新日志](../changelog/) - 了解功能变化
