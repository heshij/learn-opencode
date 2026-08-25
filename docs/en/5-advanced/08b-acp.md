---
title: "5.8b ACP Protocol"
subtitle: "Zed, JetBrains, Neovim, and other editor integrations"
course: "OpenCode Practical Course"
stage: "Stage 5"
lesson: "5.8b"
duration: "15 minutes"
practice: "20 minutes"
level: "Advanced"
description: "Use OpenCode in Zed, JetBrains, Neovim, and other editors through the ACP protocol."
tags:
  - "ACP"
  - "Zed"
  - "JetBrains"
  - "Neovim"
prerequisite:
  - "5.8a VS Code Extension"
---

# 5.8b ACP Protocol

> Use OpenCode in Zed, JetBrains, Neovim, and other editors through the ACP protocol.

## 📝 Course Notes

Key points from this lesson:

<img src="/images/5-advanced/08b-acp-notes.mini.jpeg" alt="ACP Protocol Course Notes" data-zoom-src="/images/5-advanced/08b-acp-notes.jpeg" />

---

## What You'll Learn

- Understand what ACP is
- Configure OpenCode in Zed
- Configure OpenCode in JetBrains IDE
- Configure OpenCode in Neovim

---

## What is ACP

**ACP** (Agent Client Protocol) is an open protocol that standardizes communication between code editors and AI coding agents.

- Official website: [agentclientprotocol.com](https://agentclientprotocol.com)
- Supported editors list: [ACP Progress Report](https://zed.dev/blog/acp-progress-report#available-now)

### How It Works

```
Editor ←→ JSON-RPC (stdio) ←→ opencode acp
```

The editor starts `opencode acp` as a child process and communicates via stdin/stdout using nd-JSON (newline-delimited JSON) format for JSON-RPC communication.

Some transitional releases called this new implementation `acp-next`. By `v1.18.22`, it had become the official `opencode acp` implementation; there is no separate `opencode acp-next` command to start. Source: [ACP command entry point](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/acp.ts#L9-L25) and [current Agent implementation](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/acp/agent.ts#L32-L85).

---

## Start the ACP Service

```bash
opencode acp
```

### Command Arguments

| Argument | Description | Example |
|----------|-------------|---------|
| `--cwd` | Working directory | `--cwd /path/to/project` |
| `--port` | Listen port | `--port 4096` |
| `--hostname` | Listen hostname | `--hostname 0.0.0.0` |

> Source: `cli.mdx:481-487`, `acp.ts:16-20`

---

## Zed Configuration

The OpenCode repository once bundled a Zed extension, but that extension has been removed. With `v1.18.22`, start `opencode acp` through Zed's ACP `agent_servers` configuration. Do not look for or install the old bundled extension from the repository.

Add to [Zed](https://zed.dev) configuration file `~/.config/zed/settings.json`:

```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "opencode",
      "args": ["acp"]
    }
  }
}
```

### Usage

<AdInArticle />

1. Open the command palette
2. Run `agent: new thread`

### Bind Keyboard Shortcut (Optional)

Edit `keymap.json`:

```json
[
  {
    "bindings": {
      "cmd-alt-o": [
        "agent::NewExternalAgentThread",
        {
          "agent": {
            "custom": {
              "name": "OpenCode",
              "command": {
                "command": "opencode",
                "args": ["acp"]
              }
            }
          }
        }
      ]
    }
  }
]
```

---

## JetBrains IDE Configuration

Supports all JetBrains IDEs (IntelliJ IDEA, WebStorm, PyCharm, etc.).

Create `acp.json` according to [official documentation](https://www.jetbrains.com/help/ai-assistant/acp.html):

```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "/absolute/path/bin/opencode",
      "args": ["acp"]
    }
  }
}
```

> **Note**: JetBrains requires the **absolute path** to opencode.

### Finding the opencode Path

```bash
# macOS / Linux
which opencode

# Windows
where opencode
```

### Usage

Select "OpenCode" in the AI Chat agent selector.

---

## Neovim Configuration

### Avante.nvim

Add to [Avante.nvim](https://github.com/yetone/avante.nvim) configuration:

```lua
{
  acp_providers = {
    ["opencode"] = {
      command = "opencode",
      args = { "acp" }
    }
  }
}
```

To pass environment variables:

```lua
{
  acp_providers = {
    ["opencode"] = {
      command = "opencode",
      args = { "acp" },
      env = {
        OPENCODE_API_KEY = os.getenv("OPENCODE_API_KEY")
      }
    }
  }
}
```

### CodeCompanion.nvim

Add to [CodeCompanion.nvim](https://github.com/olimorris/codecompanion.nvim) configuration:

```lua
require("codecompanion").setup({
  strategies = {
    chat = {
      adapter = {
        name = "opencode",
        model = "claude-sonnet-4",
      },
    },
  },
})
```

To pass environment variables, refer to [CodeCompanion documentation](https://codecompanion.olimorris.dev/configuration/adapters#environment-variables-setting-an-api-key).

---

## Supported Features

The ACP implementation in `v1.18.22` is not equivalent to the complete TUI, but it covers the core session capabilities:

| Feature | Supported |
|---------|-----------|
| Send prompts and stream messages, tool calls, and permission requests | ✅ |
| Discover and run currently available slash commands | ✅ |
| Create, list, load, replay, resume, and close sessions | ✅ |
| Cancel a running prompt | ✅ |
| Select a model | ✅ |
| Select an Agent (shown as Session Mode in ACP) | ✅ |
| Select a model variant (shown as Effort in ACP) | ✅ |
| Register MCP servers supplied by the client | ✅ |

For the Agent entry methods, see [`acp/agent.ts:43-84`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/acp/agent.ts#L43-L84). For session loading, message replay, and command submission, see [`acp/service.ts:211-235`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/acp/service.ts#L211-L235) and [`acp/service.ts:494-543`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/acp/service.ts#L494-L543). For the Model, Effort, and Session Mode options, see [`acp/config-option.ts:38-109`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/acp/config-option.ts#L38-L109).

### Unsupported Features

Do not assume the TUI command list is also the ACP slash-command list. The following TUI-specific commands are not available in ACP mode:

- `/undo` - Undo message
- `/redo` - Redo message

> Source: `acp.mdx:147-149`

---

## Troubleshooting

| Symptom | Cause | Solution |
|---------|-------|----------|
| JetBrains can't find command | Using relative path | Use absolute path for opencode |
| Zed not responding | opencode not installed or not in PATH | Confirm `which opencode` returns correct path |
| Neovim environment variables not working | Not passing env correctly | Use `env = { ... }` configuration |
| `/undo` not working | ACP doesn't support this command | This is expected behavior, use editor's built-in undo |

---

## Further Reading

- [5.8a VS Code Extension](/en/5-advanced/08a-ide-vscode) - VS Code/Cursor extension installation
- [Cheatsheet / CLI Reference](/en/appendix/cli) - Complete command-line options
- [ACP Official Website](https://agentclientprotocol.com) - Protocol specification

---

## Lesson Summary

You learned:

1. Basic concepts of ACP protocol
2. Zed editor configuration (settings.json + keymap)
3. JetBrains IDE configuration (requires absolute path)
4. Neovim configuration (Avante.nvim, CodeCompanion.nvim)
5. ACP mode feature limitations

---

## Next Lesson Preview

> In the next lesson, we'll learn about remote mode, running OpenCode on a server and accessing it through a web interface.
