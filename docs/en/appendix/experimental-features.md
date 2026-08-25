---
title: "OpenCode Experimental Features: Complete Reference"
description: "Learn how to enable OpenCode experimental features. This guide covers LSP tools, MCP Code Mode, background subagents, workspaces, formatting, and limits."
---

# Experimental Features Overview

> OpenCode's experimental features are under active development and may change at any time. This page summarizes all available experimental features and how to enable them.

---

## What are Experimental Features?

Experimental features are new capabilities that the OpenCode team is developing, allowing users to experience and provide feedback before official release.

**Characteristics**:
- Features may be incomplete
- APIs may change at any time
- Some features require additional dependencies

**Enabling Principles**:
- Enable only what you need, not everything
- Disable if you encounter issues
- Follow the changelog to stay updated

---

## Quick Enable

### Option 1: Enable All at Once

```bash
# macOS / Linux: Add to ~/.zshrc or ~/.bashrc
export OPENCODE_EXPERIMENTAL=true

# Then reload
source ~/.zshrc
```

### Option 2: Enable Individual Features

```bash
# Enable only the features you need
export OPENCODE_EXPERIMENTAL_LSP_TOOL=true
export OPENCODE_EXPERIMENTAL_PLAN_MODE=true
export OPENCODE_EXPERIMENTAL_CODE_MODE=true
export OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true
```

---

## Experimental Features List

### 🌐 Web Search

| Variable | Description | Related Tutorial |
|----------|-------------|------------------|
| `OPENCODE_ENABLE_EXA` | Enable websearch tool, allowing AI to search the internet | [5.23 Web Search & Fetch](/en/5-advanced/23-web-search) |

**How to Enable**:
```bash
export OPENCODE_ENABLE_EXA=true
```

**Use Cases**:
- Look up the latest technical documentation and API usage
- Search for solutions to error messages
- Learn about the latest version features of libraries

::: tip Zen Users
If you use OpenCode Zen hosted models, websearch is automatically enabled with no configuration needed.
:::

---

### 🔧 LSP Enhancements

| Variable | Description | Related Tutorial |
|----------|-------------|------------------|
| `OPENCODE_EXPERIMENTAL_LSP_TOOL` | Enable LSP tools (go to definition, find references, etc.) | [5.19 LSP Code Intelligence](/en/5-advanced/19-lsp) |
| `OPENCODE_EXPERIMENTAL_LSP_TY` | Enable experimental ty Python server (replaces pyright) | [5.19 LSP Code Intelligence](/en/5-advanced/19-lsp) |

**How to Enable**:
```bash
export OPENCODE_EXPERIMENTAL_LSP_TOOL=true
export OPENCODE_EXPERIMENTAL_LSP_TY=true
```

**Use Cases**:
- Allow AI to perform LSP operations like "go to definition" and "find all references"
- Use a faster type checker for Python projects

---

### 📋 Workflow Enhancements

| Variable | Description | Related Tutorial |
|----------|-------------|------------------|
| `OPENCODE_EXPERIMENTAL_PLAN_MODE` | Expose the experimental `plan_exit` tool in the CLI | [3.1 Plan & Build](/en/3-workflow/01-plan-build) |

**How to Enable**:
```bash
export OPENCODE_EXPERIMENTAL_PLAN_MODE=true
```

**Use Cases**:
- Large refactoring tasks: Let AI research and generate a plan first, then execute after review
- Uncertain about best approach: Plan multiple options first, then choose before starting
- Need manual review: Plan files can be saved, shared, and iterated

> The Build and Plan Agents exist whether or not this variable is set, and you can still switch Agents manually. This variable controls only whether the CLI tool list includes `plan_exit`.

**New Tools**:
- `plan_exit`: Plan complete, ask whether to switch to build mode

The target version does not implement a `plan_enter` tool. Enter the Plan Agent with <kbd>Tab</kbd> or your configured Agent-switching key.

---

### MCP Code Mode

| Variable | Description | Related Tutorial |
| --- | --- | --- |
| `OPENCODE_EXPERIMENTAL_CODE_MODE` | Enable the restricted MCP orchestration `execute` tool | [5.7b Advanced MCP](/en/5-advanced/07b-mcp-advanced) |

**How to Enable**:
```bash
export OPENCODE_EXPERIMENTAL_CODE_MODE=true
```

`execute` appears only when the switch is enabled and at least one MCP tool is visible under the current Agent and session permissions. It runs code in a restricted interpreter and can access only the directory of visible MCP tools. It is not a shell, and every MCP invocation still performs the original tool's permission check.

Source: [runtime switch](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/effect/runtime-flags.ts#L48), [`execute` visibility conditions](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/registry.ts#L280-L308), and [restricted execution environment](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/code-mode.ts#L239-L274).

---

### Background Subagents

| Variable | Description |
| --- | --- |
| `OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS` | Allow `task` to use `background: true` and move a running synchronous subagent into the background |

**How to Enable**:
```bash
export OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true
```

This switch controls only background execution. Whether a subagent can launch another subagent is controlled by the root-level `subagent_depth` setting. Its default is `1`: a primary Agent can launch one level of subagents, but those subagents cannot launch nested subagents.

```jsonc
{
  "subagent_depth": 2
}
```

Before increasing the depth, confirm the permission boundaries and task cost. Once the limit is reached, `task` returns an error instead of silently degrading.

Source: [background experimental switch](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/effect/runtime-flags.ts#L43), [background check and depth limit](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/task.ts#L96-L115), and the [`subagent_depth` schema](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L84-L86).

---

### 🗂️ Workspace Management

| Variable | Description |
| --- | --- |
| `OPENCODE_EXPERIMENTAL_WORKSPACES` | Enable workspace support in the TUI |

**How to Enable**:
```bash
export OPENCODE_EXPERIMENTAL_WORKSPACES=1
```

**Use Cases**:
- Work on multiple projects or repositories at the same time
- Use Git Worktree to switch between branches
- Isolate context for different tasks

**TUI Operations**:
- Enter `/workspaces` to open the workspace list
- Or press `Ctrl+P` to open the command palette, then enter "workspace"
- Create, switch, and delete workspaces

**Currently Supported Workspace Types**:
| Type | Description |
| --- | --- |
| `worktree` | Git Worktree: different branches of the same repository |

---

### 🎨 UI & Interaction

| Variable | Description |
|----------|-------------|
| `OPENCODE_EXPERIMENTAL_ICON_DISCOVERY` | Auto-discover project icons (displayed in UI) |
| `OPENCODE_EXPERIMENTAL_MARKDOWN` | Enable experimental Markdown rendering component |
| `OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT` | Disable auto-copy when selecting text in TUI |

**How to Enable**:
```bash
export OPENCODE_EXPERIMENTAL_ICON_DISCOVERY=true
export OPENCODE_EXPERIMENTAL_MARKDOWN=true
```

---

### ⚡ Performance & Formatting

| Variable | Description | Related Tutorial |
|----------|-------------|------------------|
| `OPENCODE_EXPERIMENTAL_OXFMT` | Enable oxfmt formatter (written in Rust, high performance) | [5.18 Code Formatters](/en/5-advanced/18-formatters) |
| `OPENCODE_EXPERIMENTAL_FILEWATCHER` | Enable file watcher for entire directories |
| `OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER` | Disable file watcher |

**How to Enable**:
```bash
export OPENCODE_EXPERIMENTAL_OXFMT=true
```

**Prerequisites for oxfmt**:
- Project has `oxfmt` dependency in `package.json`
- Experimental flag is enabled

---

### ⏱️ Timeouts & Limits

| Variable | Type | Description |
|----------|------|-------------|
| `OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS` | number | Default timeout for Bash commands (milliseconds) |
| `OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX` | number | Maximum output tokens for LLM responses |

**Example**:
```bash
# Set bash timeout to 2 minutes
export OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS=120000

# Limit LLM output to max 8192 tokens
export OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX=8192
```

---

## experimental Configuration in opencode.json

Besides environment variables, `opencode.json` also has an `experimental` field for configuring another category of experimental features:

```json
{
  "experimental": {
    "batch_tool": true,           // Enable batch operation tools
    "openTelemetry": true,        // Enable OpenTelemetry tracing
    "disable_paste_summary": true, // Disable auto-summary for pasted text
    "continue_loop_on_deny": true, // Continue thinking when tool is denied
    "primary_tools": ["tool1"],   // Tools restricted to Primary Agent
    "mcp_timeout": 30000          // MCP request timeout (milliseconds)
  }
}
```

| Field | Description |
|-------|-------------|
| `batch_tool` | Enable batch tools for executing multiple operations at once |
| `openTelemetry` | Enable OpenTelemetry for performance monitoring and tracing |
| `disable_paste_summary` | Don't auto-generate summaries when pasting large text |
| `continue_loop_on_deny` | When user denies a tool call, Agent continues thinking instead of stopping |
| `primary_tools` | Specify a list of tools restricted to Primary Agent |
| `mcp_timeout` | Global timeout for MCP requests (milliseconds) |

---

## Complete Configuration Example

Here's a "full-featured" experimental configuration example. Copy what you need:

```bash
# ═══════════════════════════════════════════════════════════════
# OpenCode Experimental Features Configuration
# Add to ~/.zshrc or ~/.bashrc, then source it
# ═══════════════════════════════════════════════════════════════

# Enable all experimental features at once (the individual switches below are automatically included)
# export OPENCODE_EXPERIMENTAL=true

# ───────────────────────────────────────────────────────────────
# Web Search (requires Exa API, or use Zen hosted models for auto-enable)
# ───────────────────────────────────────────────────────────────
export OPENCODE_ENABLE_EXA=true           # Enable websearch tool

# ───────────────────────────────────────────────────────────────
# LSP (Language Server Protocol) Enhancements
# ───────────────────────────────────────────────────────────────
export OPENCODE_EXPERIMENTAL_LSP_TOOL=true  # Enable LSP tools
export OPENCODE_EXPERIMENTAL_LSP_TY=true    # Enable experimental ty Python server

# ───────────────────────────────────────────────────────────────
# UI & Interaction
# ───────────────────────────────────────────────────────────────
export OPENCODE_EXPERIMENTAL_MARKDOWN=true         # Experimental Markdown rendering
export OPENCODE_EXPERIMENTAL_ICON_DISCOVERY=true   # Auto-discover project icons

# ───────────────────────────────────────────────────────────────
# Workflow Enhancements
# ───────────────────────────────────────────────────────────────
export OPENCODE_EXPERIMENTAL_PLAN_MODE=true  # Expose the CLI plan_exit tool
export OPENCODE_EXPERIMENTAL_CODE_MODE=true  # Enable the restricted MCP orchestration tool
export OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true  # Enable background subagents

# ───────────────────────────────────────────────────────────────
# Workspace Management
# ───────────────────────────────────────────────────────────────
export OPENCODE_EXPERIMENTAL_WORKSPACES=1    # Enable TUI workspace support

# ───────────────────────────────────────────────────────────────
# Performance & Formatting
# ───────────────────────────────────────────────────────────────
export OPENCODE_EXPERIMENTAL_OXFMT=true      # Enable oxfmt formatter

# ───────────────────────────────────────────────────────────────
# Timeouts & Limits (optional)
# ───────────────────────────────────────────────────────────────
# export OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS=120000
# export OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX=8192
```

---

## FAQ

### No effect after enabling?

1. **Confirm configuration has been reloaded**:
   ```bash
   source ~/.zshrc  # or source ~/.bashrc
   ```

2. **Confirm OpenCode has been restarted**: Environment variables are read at process startup

3. **Confirm variable is set**:
   ```bash
   env | grep OPENCODE
   ```

### Feature is unstable?

Experimental features may have issues:
- Check the [Changelog](/en/changelog/) for latest changes
- Disable the problematic feature if issues occur
- Report issues on [GitHub Issues](https://github.com/anomalyco/opencode/issues)

### How to disable a feature?

If the master `OPENCODE_EXPERIMENTAL` switch is not enabled, remove or comment out the dedicated variable. If the master switch is `true`, an unset dedicated variable falls back to it. In that case, explicitly set the dedicated variable to `false`, or disable the master switch:
```bash
export OPENCODE_EXPERIMENTAL_PLAN_MODE=false
# Or remove/disable OPENCODE_EXPERIMENTAL=true
```

---

## Related Resources

- [CLI Environment Variables Reference](/en/appendix/cli) - Complete list of all environment variables
- [Configuration Options Reference](/en/appendix/config-ref) - opencode.json configuration details
- [Changelog](/en/changelog/) - Learn about feature changes
