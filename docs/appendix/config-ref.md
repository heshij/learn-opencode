---
title: 配置选项参考
description: opencode.json 所有配置项的完整说明
---

# 配置选项参考

> `opencode.json` 所有配置项的完整说明

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/appendix/config-ref-notes.mini.jpeg"
     alt="配置选项参考学霸笔记"
     data-zoom-src="/images/appendix/config-ref-notes.jpeg" />

---

## 配置文件位置

| 类型 | 路径 | 说明 |
|------|------|------|
| 项目级 | `./opencode.json` | 项目根目录或 Git 目录 |
| 全局级 | `~/.config/opencode/opencode.json` | 用户全局配置 |
| 环境变量 | `OPENCODE_CONFIG` 指定的路径 | 自定义路径 |
| 自定义目录 | `OPENCODE_CONFIG_DIR` 指定的目录 | 自定义配置目录 |

配置合并规则：自定义路径 > 项目级 > 全局级（后者覆盖前者的冲突键）

---

## 配置格式

OpenCode 支持 **JSON** 和 **JSONC**（带注释的 JSON）格式：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  // 主题配置
  "theme": "opencode",
  "model": "anthropic/claude-sonnet-4-5",
  "autoupdate": true
}
```

---

## 完整配置示例

```json
{
  "$schema": "https://opencode.ai/config.json",
  
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5",
  "default_agent": "build",
  "theme": "tokyonight",
  "autoupdate": true,
  "share": "manual",
  
  "provider": {
    "anthropic": {
      "options": {
        "timeout": 600000
      }
    }
  },
  
  "permission": {
    "edit": "ask",
    "bash": "ask"
  },
  
  "server": {
    "port": 4096,
    "hostname": "127.0.0.1"
  }
}
```

---

## 配置项详解

### 模型配置

#### model

主模型，用于复杂任务。格式为 `provider/model`。

```json
{
  "model": "anthropic/claude-sonnet-4-5"
}
```

#### small_model

小模型，用于快速任务（如标题生成）。默认自动选择便宜模型。

```json
{
  "small_model": "anthropic/claude-haiku-4-5"
}
```

#### default_agent

默认代理。必须是 primary 代理（非 subagent）。

```json
{
  "default_agent": "build"
}
```

可选值：`build`、`plan` 或自定义代理名称。

---

### provider

模型提供商配置。**注意是单数形式**。

```json
{
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}",
        "timeout": 600000,
        "setCacheKey": true
      },
      "models": {
        "claude-sonnet-4-5": {
          "options": {
            "thinking": {
              "type": "enabled",
              "budgetTokens": 16000
            }
          }
        }
      }
    }
  }
}
```

#### 提供商选项

| 字段 | 类型 | 说明 |
|------|------|------|
| `options.apiKey` | string | API 密钥 |
| `options.baseURL` | string | 自定义 API 端点 |
| `options.timeout` | number/false | 请求超时（毫秒），默认 300000 |
| `options.setCacheKey` | boolean | 确保设置缓存键 |
| `models` | object | 模型特定配置 |

#### Amazon Bedrock 特殊配置

```json
{
  "provider": {
    "amazon-bedrock": {
      "options": {
        "region": "us-east-1",
        "profile": "my-aws-profile",
        "endpoint": "https://bedrock-runtime.us-east-1.vpce-xxxxx.amazonaws.com"
      }
    }
  }
}
```

---

### theme

主题配置。**注意是顶层配置，不是 `tui.theme`**。

```json
{
  "theme": "tokyonight"
}
```

可用主题请参考 [主题配置](../5-advanced/06a-themes)。

---

### tui

TUI 界面配置。

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

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `scroll_speed` | number | 1 | 滚动速度（启用加速时忽略） |
| `scroll_acceleration.enabled` | boolean | - | 启用 macOS 风格滚动加速 |
| `diff_style` | string | `auto` | Diff 渲染样式：`auto`/`stacked` |

---

### server

服务器模式配置。

```json
{
  "server": {
    "port": 4096,
    "hostname": "127.0.0.1",
    "mdns": true,
    "cors": ["http://localhost:5173"]
  }
}
```

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `port` | number | `4096` | 监听端口 |
| `hostname` | string | `127.0.0.1` | 监听地址 |
| `mdns` | boolean | `false` | 启用 mDNS 发现 |
| `cors` | string[] | `[]` | 允许的 CORS 源 |

---

### permission

权限控制配置。**注意是单数形式**。

```json
{
  "permission": {
    "edit": "ask",
    "bash": "ask",
    "write": "allow",
    "read": "allow"
  }
}
```

| 值 | 说明 |
|----|------|
| `allow` | 自动允许 |
| `ask` | 每次询问 |
| `deny` | 拒绝 |

可配置的工具：`bash`、`read`、`write`、`edit`、`glob`、`grep`、`webfetch`、`skill` 等。

详见 [权限配置](../5-advanced/05-permissions.md)。

---

### tools

工具启用/禁用配置。

```json
{
  "tools": {
    "write": false,
    "bash": false,
    "mymcp_*": false
  }
}
```

支持通配符匹配 MCP 工具。

---

### agent

Agent 配置。**注意是单数形式**。

```json
{
  "agent": {
    "code-reviewer": {
      "description": "Reviews code for best practices",
      "model": "anthropic/claude-sonnet-4-5",
      "prompt": "You are a code reviewer.",
      "tools": {
        "write": false,
        "edit": false
      }
    }
  }
}
```

详见 [自定义 Agent](../5-advanced/02a-agent-quickstart)。

---

### command

自定义命令配置。**注意是单数形式**。

```json
{
  "command": {
    "test": {
      "template": "Run the full test suite with coverage.",
      "description": "Run tests with coverage",
      "agent": "build",
      "model": "anthropic/claude-haiku-4-5"
    }
  }
}
```

详见 [自定义命令](../5-advanced/04-commands.md)。

---

### share

会话分享配置。

```json
{
  "share": "manual"
}
```

| 值 | 说明 |
|----|------|
| `manual` | 手动分享（默认） |
| `auto` | 自动分享新会话 |
| `disabled` | 禁用分享 |

---

### formatter

格式化器配置。**注意是单数形式**。

```json
{
  "formatter": {
    "prettier": {
      "disabled": true
    },
    "custom-formatter": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    }
  }
}
```

设置 `"formatter": false` 禁用所有格式化器。

---

### lsp

LSP 服务器配置。

```json
{
  "lsp": {
    "typescript": {
      "disabled": true
    },
    "custom-lsp": {
      "command": ["custom-lsp-server", "--stdio"],
      "extensions": [".custom"],
      "env": {},
      "initialization": {}
    }
  }
}
```

设置 `"lsp": false` 禁用所有 LSP 服务器。

---

### mcp

MCP 服务器配置。**注意结构：直接在 `mcp` 下定义服务器**。

> 来源：[config.ts](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts)

```json
{
  "mcp": {
    "context7": {
      "type": "local",
      "command": ["npx", "-y", "@context7/mcp-server"],
      "enabled": true,
      "timeout": 10000
    },
    "filesystem": {
      "type": "local",
      "command": ["npx", "-y", "@anthropic/mcp-server-filesystem"],
      "environment": {
        "ALLOWED_DIRS": "/home/user/projects"
      }
    },
    "remote-server": {
      "type": "remote",
      "url": "https://mcp.example.com",
      "headers": {
        "Authorization": "Bearer xxx"
      },
      "oauth": {
        "clientId": "xxx",
        "scope": "read write"
      },
      "timeout": 5000
    }
  }
}
```

#### 本地 MCP 服务器

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `"local"` | 本地服务器类型 |
| `command` | string[] | 启动命令（数组形式） |
| `environment` | object | 环境变量 |
| `enabled` | boolean | 是否在启动时启用（可选） |
| `timeout` | number | 获取工具的超时时间（毫秒），默认 5000 |

#### 远程 MCP 服务器

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `"remote"` | 远程服务器类型 |
| `url` | string | 服务器 URL |
| `headers` | object | 自定义请求头（可选） |
| `oauth` | object/false | OAuth 配置，设为 false 禁用自动检测 |
| `enabled` | boolean | 是否在启动时启用（可选） |
| `timeout` | number | 获取工具的超时时间（毫秒），默认 5000 |

#### OAuth 配置

| 字段 | 类型 | 说明 |
|------|------|------|
| `clientId` | string | OAuth 客户端 ID（可选，不提供则尝试动态注册） |
| `clientSecret` | string | OAuth 客户端密钥（可选） |
| `scope` | string | 请求的 OAuth 范围（可选） |

详见 [MCP 配置](../5-advanced/07a-mcp-basics)。

---

### plugin

插件配置。

```json
{
  "plugin": ["opencode-helicone-session", "@my-org/custom-plugin"]
}
```

详见 [插件开发](../5-advanced/12a-plugins-basics)。

---

### instructions

自定义指令文件。

```json
{
  "instructions": ["CONTRIBUTING.md", "docs/guidelines.md", ".cursor/rules/*.md"]
}
```

支持 glob 模式。

---

### keybinds

快捷键配置。

```json
{
  "keybinds": {
    "leader": "ctrl+x",
    "switch_agent": "tab",
    "new_session": "ctrl+n"
  }
}
```

详见 [快捷键配置](./keybinds.md)。

---

### compaction

上下文压缩配置。

```json
{
  "compaction": {
    "auto": true,
    "prune": true
  }
}
```

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `auto` | boolean | `true` | 上下文满时自动压缩 |
| `prune` | boolean | `true` | 移除旧工具输出以节省 token |

---

### watcher

文件监视配置。

```json
{
  "watcher": {
    "ignore": ["node_modules/**", "dist/**", ".git/**"]
  }
}
```

---

### autoupdate

自动更新配置。

```json
{
  "autoupdate": true
}
```

| 值 | 说明 |
|----|------|
| `true` | 自动下载更新 |
| `false` | 禁用自动更新 |
| `"notify"` | 仅通知有新版本 |

---

### disabled_providers / enabled_providers

提供商启用/禁用。

```json
{
  "disabled_providers": ["openai", "gemini"],
  "enabled_providers": ["anthropic", "opencode"]
}
```

`disabled_providers` 优先级高于 `enabled_providers`。

---

### experimental

实验性配置。

```json
{
  "experimental": {}
}
```

> 实验性选项不稳定，可能随时变更或移除。

---

## 变量替换

### 环境变量

使用 `{env:VARIABLE_NAME}` 替换环境变量：

```json
{
  "model": "{env:OPENCODE_MODEL}",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

### 文件内容

使用 `{file:path/to/file}` 替换文件内容：

```json
{
  "provider": {
    "openai": {
      "options": {
        "apiKey": "{file:~/.secrets/openai-key}"
      }
    }
  }
}
```

文件路径可以是相对路径（相对于配置文件）或绝对路径（以 `/` 或 `~` 开头）。

---

## 相关资源

- [CLI 命令参考](./cli.md) - 命令行选项
- [模型提供商列表](./providers.md) - 可用提供商
- [配置全解](../5-advanced/01a-config-basics) - 详细教程
