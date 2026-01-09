---
title: 5.1b 配置进阶
subtitle: opencode.json 完整参考
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.1b"
duration: 20 分钟
level: 进阶
description: 掌握 OpenCode 的全部配置项，打造完全定制化的开发环境和 AI 工具。
tags:
  - 配置
  - JSON
  - 进阶
prerequisite:
  - 5.1a 配置基础
---

# 5.1b 配置进阶

> 掌握 OpenCode 的全部配置项，打造完全定制化的开发环境。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/config-advanced-notes.mini.jpeg" alt="配置进阶学霸笔记" data-zoom-src="/images/5-advanced/config-advanced-notes.jpeg" />

---

## 学完你能做什么

- 配置界面（TUI、快捷键、服务器）
- 配置行为（分享、压缩、监视器）
- 配置功能（工具、权限、Agent、命令、MCP 等）
- 使用实验性功能

---

## 你现在的困境

- 想自定义快捷键
- 想控制 AI 能用哪些工具
- 想批量禁用某些 MCP 工具
- 想知道还有什么隐藏配置

---

## 什么时候用这一招

- 当你需要：完全掌控 OpenCode 的行为
- 而且不想：被默认配置限制

---

## 界面配置

### TUI 配置

```json
{
  "tui": {
    "scroll_speed": 3,
    "scroll_acceleration": {
      "enabled": true
    },
    "diff_style": "auto"
  }
}
```

| 字段 | 说明 | 默认值 |
|-----|------|-------|
| `scroll_speed` | 滚动速度倍数（最小 0.001） | 1 |
| `scroll_acceleration.enabled` | 启用 macOS 风格加速滚动 | false |
| `diff_style` | 差异显示样式 | `"auto"` |

> `scroll_acceleration.enabled` 优先于 `scroll_speed`。启用后会忽略 scroll_speed。

`diff_style` 选项：
- `"auto"` - 根据终端宽度自适应
- `"stacked"` - 始终单列显示

### Keybinds 配置

自定义快捷键：

```json
{
  "keybinds": {
    "leader": "ctrl+x",
    "session_new": "<leader>n",
    "session_compact": "<leader>c",
    "model_list": "<leader>m",
    "agent_list": "<leader>a",
    "session_interrupt": "escape"
  }
}
```

> 注意：配置键是 `keybinds`（**复数**！），这与 permission/agent 用单数不同。

#### Leader 键

大多数快捷键使用 `leader` 键前缀，避免与终端冲突：

```json
{
  "keybinds": {
    "leader": "ctrl+x"
  }
}
```

默认 `ctrl+x`。按下 leader 键后再按快捷键，如 `ctrl+x` 然后 `n` 创建新会话。

#### 禁用快捷键

将值设为 `"none"` 禁用：

```json
{
  "keybinds": {
    "session_compact": "none"
  }
}
```

#### 常用快捷键

| 配置键 | 默认值 | 说明 |
|--------|--------|------|
| `app_exit` | `ctrl+c,ctrl+d,<leader>q` | 退出应用 |
| `session_new` | `<leader>n` | 新建会话 |
| `session_list` | `<leader>l` | 会话列表 |
| `session_interrupt` | `escape` | 中断当前操作 |
| `session_compact` | `<leader>c` | 压缩会话 |
| `model_list` | `<leader>m` | 模型列表 |
| `agent_list` | `<leader>a` | Agent 列表 |
| `agent_cycle` | `tab` | 切换 Agent |
| `command_list` | `ctrl+p` | 命令列表 |
| `messages_undo` | `<leader>u` | 撤销消息 |
| `messages_redo` | `<leader>r` | 重做消息 |

完整快捷键列表见 [速查/快捷键](../appendix/keybinds)。

### Server 配置

配置 `opencode serve` 和 `opencode web` 命令的服务器：

```json
{
  "server": {
    "port": 4096,
    "hostname": "0.0.0.0",
    "mdns": true,
    "cors": ["http://localhost:5173"]
  }
}
```

| 字段 | 说明 |
|-----|------|
| `port` | 监听端口 |
| `hostname` | 监听地址（启用 mdns 时默认 `0.0.0.0`） |
| `mdns` | 启用 mDNS 服务发现（局域网设备可发现） |
| `cors` | 允许的 CORS 来源列表 |

---

## 行为配置

### Share 配置

控制会话分享行为：

```json
{
  "share": "manual"
}
```

| 值 | 说明 |
|-----|------|
| `"manual"` | 手动分享（默认），使用 `/share` 命令 |
| `"auto"` | 自动分享新会话 |
| `"disabled"` | 禁用分享功能 |

### Compaction 配置

控制上下文压缩行为：

```json
{
  "compaction": {
    "auto": true,
    "prune": true
  }
}
```

| 字段 | 说明 | 默认值 |
|-----|------|-------|
| `auto` | 上下文满时自动压缩 | true |
| `prune` | 删除旧工具输出节省 token | true |

### Watcher 配置

配置文件监视器忽略模式：

```json
{
  "watcher": {
    "ignore": ["node_modules/**", "dist/**", ".git/**", "*.log"]
  }
}
```

使用 glob 语法排除噪声目录，减少文件监视开销。

### Instructions 配置

指定额外的指令文件（与 AGENTS.md 合并）：

```json
{
  "instructions": [
    "CONTRIBUTING.md",
    "docs/guidelines.md",
    ".cursor/rules/*.md",
    "packages/*/AGENTS.md"
  ]
}
```

支持 glob 模式。适用于：
- 复用现有规则文件（如 Cursor 的 rules）
- 共享团队编码规范
- monorepo 中引入子项目规则

---

## 功能配置

### Tools 配置

控制 LLM 可用的工具：

```json
{
  "tools": {
    "write": false,
    "bash": false,
    "webfetch": true
  }
}
```

默认所有工具启用。设为 `false` 禁用。

#### 通配符

使用通配符批量控制：

```json
{
  "tools": {
    "mymcp_*": false
  }
}
```

禁用名为 `mymcp` 的 MCP 服务器的所有工具。

#### Tools vs Permission

`tools` 是遗留配置，会自动转换为 `permission`：

| tools 设置 | 等效 permission |
|-----------|-----------------|
| `"write": false` | `"edit": "deny"` |
| `"bash": false` | `"bash": "deny"` |

> 推荐使用 `permission` 配置，提供更细粒度控制（allow/ask/deny）。详见 [5.5 权限管控](./05-permissions)。

### Permission 配置

细粒度权限控制：

```json
{
  "permission": {
    "edit": "ask",
    "bash": {
      "*": "ask",
      "git *": "allow",
      "npm *": "allow",
      "rm *": "deny"
    }
  }
}
```

> 注意：配置键是 `permission`（单数），不是 `permissions`。

详细配置见 [5.5 权限管控](./05-permissions)。

### Agent 配置

配置 Agent 行为：

```jsonc
{
  "agent": {
    "code-reviewer": {
      "description": "代码审查专家",
      "mode": "subagent",
      "model": "anthropic/claude-opus-4-5-thinking",
      "prompt": "你是代码审查专家...",
      
      // 高级配置
      "temperature": 0.3,
      "top_p": 0.9,
      "steps": 50,
      "color": "#FF5733",
      "hidden": true,
      
      // 权限
      "permission": {
        "edit": "deny"
      }
    }
  }
}
```

> 注意：配置键是 `agent`（单数），不是 `agents`。

#### 高级配置字段

| 字段 | 类型 | 说明 |
|-----|------|------|
| `temperature` | number | 创造性参数（0-1），越低越确定 |
| `top_p` | number | 核采样参数（0-1） |
| `steps` | number | 最大迭代步数 |
| `color` | string | 十六进制颜色（如 `#FF5733`） |
| `hidden` | boolean | 从 @ 菜单隐藏（仅 subagent 生效） |

> `maxSteps` 已废弃，请使用 `steps`。

详细配置见 [5.2 自定义 Agent](./02a-agent-quickstart)。

### Command 配置

在配置文件中定义命令：

```jsonc
{
  "command": {
    "test": {
      "template": "运行测试并显示失败结果",
      "description": "运行测试",
      "agent": "build",
      "model": "anthropic/claude-opus-4-5-thinking"
    },
    "component": {
      "template": "创建名为 $ARGUMENTS 的 React 组件",
      "description": "创建新组件"
    }
  }
}
```

> 注意：配置键是 `command`（单数），不是 `commands`。

| 字段 | 说明 |
|-----|------|
| `template` | 命令模板，`$ARGUMENTS` 代表参数 |
| `description` | 命令描述 |
| `agent` | 使用的 Agent |
| `model` | 使用的模型 |
| `subtask` | 是否作为子任务运行 |

详细配置见 [5.4 快捷命令](./04-commands)。

### Formatter 配置

配置代码格式化器：

```json
{
  "formatter": {
    "prettier": {
      "disabled": true
    },
    "custom-prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    }
  }
}
```

> 注意：配置键是 `formatter`（单数），不是 `formatters`。

设为 `false` 完全禁用格式化：

```json
{
  "formatter": false
}
```

详细配置见 [5.18 格式化器](./18-formatters)。

### MCP 配置

配置 MCP 服务器：

```json
{
  "mcp": {
    "context7": {
      "type": "local",
      "command": ["npx", "-y", "@upstash/context7-mcp"]
    },
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

详细配置见 [5.7 MCP 扩展](./07a-mcp-basics)。

### Plugin 配置

加载 npm 插件：

```json
{
  "plugin": ["opencode-helicone-session", "@my-org/custom-plugin"]
}
```

也可以在 `.opencode/plugin/` 目录放置本地插件（`.ts` 或 `.js` 文件）。

详细配置见 [5.12 插件系统](./12a-plugins-basics)。

### LSP 配置

配置 LSP 服务器：

```json
{
  "lsp": {
    "typescript": {
      "disabled": true
    },
    "custom-lsp": {
      "command": ["my-lsp-server", "--stdio"],
      "extensions": [".custom", ".myext"],
      "env": {
        "DEBUG": "true"
      },
      "initialization": {
        "settings": {}
      }
    }
  }
}
```

| 字段 | 说明 |
|-----|------|
| `disabled` | 禁用此 LSP |
| `command` | 启动命令 |
| `extensions` | 文件扩展名（自定义 LSP 必填） |
| `env` | 环境变量 |
| `initialization` | LSP 初始化配置 |

设为 `false` 禁用所有 LSP：

```json
{
  "lsp": false
}
```

详细配置见 [5.19 LSP 服务器](./19-lsp)。

---

## 实验性功能

```json
{
  "experimental": {
    "hook": {
      "file_edited": {
        "*.ts": [
          {
            "command": ["prettier", "--write", "$FILE"],
            "environment": {}
          }
        ]
      },
      "session_completed": [
        {
          "command": ["notify-send", "OpenCode", "会话完成"]
        }
      ]
    },
    "batch_tool": true,
    "openTelemetry": true,
    "chatMaxRetries": 3,
    "continue_loop_on_deny": false
  }
}
```

| 字段 | 说明 |
|-----|------|
| `hook.file_edited` | 文件编辑后触发的钩子 |
| `hook.session_completed` | 会话完成后触发的钩子 |
| `batch_tool` | 启用批量工具 |
| `openTelemetry` | 启用 OpenTelemetry 追踪 |
| `chatMaxRetries` | 聊天失败重试次数 |
| `continue_loop_on_deny` | 工具被拒绝时继续循环 |

> ⚠️ 实验性功能可能随时变更或移除。

---

## 完整配置示例

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  
  // === 模型 ===
  "model": "anthropic/claude-opus-4-5-thinking",
  "small_model": "anthropic/claude-haiku-4-5",
  "default_agent": "build",
  
  // === Provider ===
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}",
        "timeout": 600000,
        "setCacheKey": true
      }
    }
  },
  "disabled_providers": ["gemini"],
  
  // === 用户 ===
  "username": "开发者",
  
  // === 界面 ===
  "theme": "catppuccin",
  "tui": {
    "scroll_speed": 3,
    "diff_style": "auto"
  },
  "keybinds": {
    "leader": "ctrl+x",
    "session_new": "<leader>n"
  },
  
  // === 服务器 ===
  "server": {
    "port": 4096,
    "hostname": "localhost"
  },
  
  // === 行为 ===
  "share": "manual",
  "compaction": {
    "auto": true,
    "prune": true
  },
  "autoupdate": true,
  "watcher": {
    "ignore": ["node_modules/**", "dist/**"]
  },
  "instructions": ["CONTRIBUTING.md"],
  
  // === 权限 ===
  "permission": {
    "edit": "ask",
    "bash": {
      "*": "ask",
      "git *": "allow"
    }
  },
  
  // === Agent ===
  "agent": {
    "code-reviewer": {
      "description": "代码审查专家",
      "mode": "subagent",
      "temperature": 0.2,
      "permission": {
        "edit": "deny"
      }
    }
  },
  
  // === 命令 ===
  "command": {
    "test": {
      "template": "运行测试",
      "description": "运行测试套件"
    }
  },
  
  // === 格式化器 ===
  "formatter": {
    "prettier": {
      "disabled": false
    }
  },
  
  // === MCP ===
  "mcp": {
    "context7": {
      "type": "local",
      "command": ["npx", "-y", "@upstash/context7-mcp"]
    }
  }
}
```

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 用了 `keybind` | 键名错误 | 应为 `keybinds`（**复数**） |
| 用了 `permissions` | 键名错误 | 应为 `permission`（单数） |
| 用了 `agents` | 键名错误 | 应为 `agent`（单数） |
| 用了 `commands` | 键名错误 | 应为 `command`（单数） |
| 用了 `formatters` | 键名错误 | 应为 `formatter`（单数） |
| 用了 `tui.theme` | 键名错误 | 应直接用 `theme` |
| tools 配置不生效 | 遗留配置 | 推荐使用 `permission` |
| 快捷键冲突 | 与终端冲突 | 使用 leader 键前缀 |
| LSP 自定义失败 | 缺少 extensions | 自定义 LSP 必须指定 extensions |

---

## 配置键名速查表

| 配置项 | 正确键名 | 常见错误 |
|--------|----------|----------|
| Provider | `provider` | ~~providers~~ |
| Permission | `permission` | ~~permissions~~ |
| Agent | `agent` | ~~agents~~ |
| Command | `command` | ~~commands~~ |
| Formatter | `formatter` | ~~formatters~~ |
| **Keybinds** | `keybinds` | ~~keybind~~ |
| Theme | `theme` | ~~tui.theme~~ |

---

## 本课小结

你学会了：

1. 界面配置：TUI、快捷键、服务器
2. 行为配置：分享、压缩、监视器、指令文件
3. 功能配置：工具、权限、Agent、命令、格式化器、MCP、插件、LSP
4. 实验性功能：钩子、OpenTelemetry 等

---

## 相关资源

- [5.1a 配置基础](./01a-config-basics) - 核心配置
- [5.2 自定义 Agent](./02a-agent-quickstart) - Agent 详细配置
- [5.4 快捷命令](./04-commands) - 命令详细配置
- [5.5 权限管控](./05-permissions) - 权限详细配置
- [5.7 MCP 扩展](./07a-mcp-basics) - MCP 详细配置
- [速查/快捷键](../appendix/keybinds) - 完整快捷键列表
- [速查/配置参考](../appendix/config-ref) - 配置速查表

---

## 下一课预告

> 下一课我们将学习如何创建自定义 Agent。
