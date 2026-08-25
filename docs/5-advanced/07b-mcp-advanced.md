---
title: 5.7b MCP 进阶
subtitle: OAuth、权限管理与常用服务
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.7b"
duration: 20 分钟
practice: 20 分钟
level: 进阶
description: 学习 MCP OAuth 认证、权限管理、常用服务集成，构建安全的扩展体系。
tags:
  - MCP
  - OAuth
  - 权限管理
prerequisite:
  - 5.7a MCP 基础
  - 5.5 权限管控
---

# 5.7b MCP 进阶

> 💡 **一句话总结**：掌握 OAuth 认证、权限管理和常用 MCP 服务配置。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/07b-mcp-advanced-notes.mini.jpeg" alt="MCP进阶学霸笔记" data-zoom-src="/images/5-advanced/07b-mcp-advanced-notes.jpeg" />

---

## 学完你能做什么

- 使用 OAuth 认证连接安全服务
- 管理 MCP 工具的权限和启用状态
- 在规则文件中集成 MCP 使用
- 配置常用 MCP 服务

---

## OAuth 认证

OpenCode 自动处理 OAuth 认证流程：

1. 检测到 401 响应，启动 OAuth 流程
2. 使用 **动态客户端注册 (RFC 7591)**（如服务器支持）
3. Token 安全存储在 `~/.local/share/opencode/mcp-auth.json`

### 自动认证

大多数情况下无需特殊配置：

```jsonc
{
  "mcp": {
    "my-oauth-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp"
    }
  }
}
```

首次使用时 OpenCode 会自动提示认证。

### 预注册客户端

如果服务器不支持动态注册，需要配置客户端凭证：

```jsonc
{
  "mcp": {
    "my-oauth-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": {
        "clientId": "{env:MY_MCP_CLIENT_ID}",
        "clientSecret": "{env:MY_MCP_CLIENT_SECRET}",
        "scope": "tools:read tools:execute"
      }
    }
  }
}
```

### 管理命令

```bash
# 手动触发认证
opencode mcp auth my-oauth-server

# 查看所有服务器认证状态
opencode mcp auth list

# 列出所有 MCP 服务器
opencode mcp list

# 移除存储的凭据
opencode mcp logout my-oauth-server

# 调试连接和 OAuth 流程
opencode mcp debug my-oauth-server
```

### 调试命令详解

当 MCP 连接出问题时，用 `debug` 命令诊断：

```bash
opencode mcp debug my-oauth-server
```

**输出示例**：

```
MCP OAuth Debug

Server: my-oauth-server
URL: https://mcp.example.com/mcp
Auth status: ✓ authenticated
  Access token: eyJhbGciOiJSUzI1NiIs...
  Expires: 2026-02-15T12:00:00.000Z
  Refresh token: present

Testing connection...
HTTP response: 200 OK
✓ Server responded successfully
```

**状态含义**：

| 状态 | 说明 |
|------|------|
| `authenticated` | 已认证，可以正常使用 |
| `expired` | Token 已过期，需要重新认证 |
| `not authenticated` | 未认证，需要运行 `opencode mcp auth` |

### 服务器状态图标

`opencode mcp list` 输出中的图标含义：

| 图标 | 状态 | 说明 |
|------|------|------|
| ✓ | connected | 已连接，工具可用 |
| ○ | disabled | 已禁用，`enabled: false` |
| ⚠ | needs_auth | 需要 OAuth 认证 |
| ✗ | failed | 连接失败，查看错误信息 |

**示例输出**：

```
MCP Servers

✓ filesystem connected
    npx -y @modelcontextprotocol/server-filesystem /projects
✓ context7 connected
    https://mcp.context7.com/mcp
○ disabled-server disabled
    npx -y some-command
✗ failed-server failed
    Connection timeout
```

### 禁用 OAuth

如果服务器使用 API Key 而非 OAuth：

```jsonc
{
  "mcp": {
    "my-api-key-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": false,
      "headers": {
        "Authorization": "Bearer {env:MY_API_KEY}"
      }
    }
  }
}
```

---

## 工具权限管理

<AdInArticle />

MCP 工具注册时使用 `{服务器名}_{工具名}` 格式命名。

### 全局禁用

使用 `permission` 配置禁用 MCP 工具：

```jsonc
{
  "mcp": {
    "my-mcp-foo": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command-foo"]
    },
    "my-mcp-bar": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command-bar"]
    }
  },
  "permission": {
    "my-mcp-foo_*": "deny"
  }
}
```

使用通配符批量禁用：

```jsonc
{
  "permission": {
    "my-mcp*": "deny"
  }
}
```

### 按 Agent 启用

全局禁用后，在特定 Agent 中启用：

```jsonc
{
  "mcp": {
    "my-mcp": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command"]
    }
  },
  "permission": {
    "my-mcp*": "deny"
  },
  "agent": {
    "my-agent": {
      "permission": {
        "my-mcp*": "allow"
      }
    }
  }
}
```

### 通配符规则

- `*` 匹配零个或多个任意字符
- `?` 匹配正好一个字符
- 其他字符字面匹配

---

## 在规则文件中集成

在 `AGENTS.md` 或 `.opencode/agents/*.md` 中配置默认使用 MCP：

```markdown
## MCP 使用规则

当需要查询文档时，使用 `context7` 工具。

当不确定如何实现某功能时，使用 `gh_grep` 搜索 GitHub 代码示例。
```

这样 AI 会自动选择合适的 MCP 工具，无需每次在提示词中指定。

---

## 工具自动发现与更新

### 工具命名规则

MCP 工具注册时使用 `{服务器名}_{工具名}` 格式：

```
filesystem     服务器的 read_file 工具 → filesystem_read_file
context7 服务器的 search 工具  → context7_search
```

服务器名和工具名中的非字母、数字、下划线或连字符会替换为下划线。`v1.18.22` 使用的仍是上述旧格式；`mcp__服务器名__工具名` 只在开发过程中短暂出现过，随后已恢复，不能作为当前配置权限或提示词的依据。

源码：[当前工具名的清理与拼接规则](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/mcp/catalog.ts#L117-L119)。

### 自动发现机制

配置 MCP 服务器后，OpenCode 会**自动发现**服务器提供的所有工具：

1. 连接到 MCP 服务器
2. 调用 `listTools` 获取工具列表
3. 将工具转换为 OpenCode 可用格式
4. 添加到当前会话的工具集中

### 工具变更通知

如果 MCP 服务器的工具列表发生变化（新增/删除工具），OpenCode 会**自动接收通知并更新**：

- 服务器发送工具列表变更通知（`notifications/tools/list_changed`）
- OpenCode 重新获取工具列表
- 无需重启 OpenCode

这意味着：升级 MCP 服务器版本后，新工具会自动可用。

### 服务器 instructions

MCP 服务器可以在初始化结果中返回 instructions。OpenCode 会把已连接服务器的 instructions 加入系统提示词；如果服务器提供了工具，但这些工具全部被当前 Agent 或会话权限禁用，就不会注入这段说明。

源码：[instructions 的权限过滤与注入](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/system.ts#L119-L134)。

### Resources 与 templates

只要至少一个已连接服务器声明 `resources` capability，OpenCode 就会提供三个通用工具：

| 工具 | 用途 |
|------|------|
| `list_mcp_resources` | 列出全部或指定服务器的资源 |
| `list_mcp_resource_templates` | 列出带 URI 参数的资源模板 |
| `read_mcp_resource` | 按服务器名和精确 URI 读取资源 |

资源可以是文件、数据库 Schema 或服务自己的上下文。模板本身需要先填充 URI 参数，再把得到的 URI 交给 `read_mcp_resource`。应用界面也可以通过 `@` 补全并加入 MCP 资源。

源码：[工具名称](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/tools.ts#L27-L31)、[资源能力判断](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/tools.ts#L136-L155)、[templates](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/tools.ts#L222-L245)、[读取资源](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/tools.ts#L305-L325)、[应用内资源补全](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/app/src/components/prompt-input/slash-popover.tsx#L120-L163)。

---

## 实验性 MCP Code Mode

设置以下环境变量并重启 OpenCode：

```bash
export OPENCODE_EXPERIMENTAL_CODE_MODE=true
```

启用开关并不保证一定看到 `execute`。只有当前 Agent 和会话权限下至少一个 MCP 工具可见时，`execute` 才会注册给模型；启用后，普通 MCP 工具不再逐个直接暴露，而是由 `execute` 编排调用。

`execute` 运行的是受限解释器代码，不是普通 shell。它只能访问目录化后的可见 MCP 工具，并且每个实际 MCP 调用仍会经过原工具的权限检查。适合一次编排多个 MCP 调用，不适合执行任意本地程序或访问未授权工具。

源码：[筛选可见 MCP 工具](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/code-mode.ts#L188-L212)、[受限运行时](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/code-mode.ts#L239-L274)、[`execute` 可见条件](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/registry.ts#L280-L308)。

---

## 常用 MCP 推荐

### Sentry

连接 Sentry 监控平台，查询错误和问题：

```jsonc
{
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

首次使用需要认证：

```bash
opencode mcp auth sentry
```

使用示例：

```
use sentry 查看最近未解决的错误
```

### Context7

搜索各种库和框架的文档：

```jsonc
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

使用 API Key 获取更高速率限制：

```jsonc
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

使用示例：

```
use context7 查询 Cloudflare Worker 如何缓存 JSON 响应
```

### Grep by Vercel

搜索 GitHub 上的代码片段：

```jsonc
{
  "mcp": {
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    }
  }
}
```

使用示例：

```
use the gh_grep tool 搜索 SST 框架中如何配置自定义域名
```

### Filesystem

本地文件系统操作（沙箱模式）：

```jsonc
{
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": [
        "npx", "-y", "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    }
  }
}
```

### Postgres

直接查询 PostgreSQL 数据库：

```jsonc
{
  "mcp": {
    "postgres": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-postgres"],
      "environment": {
        "POSTGRES_CONNECTION_STRING": "{env:DATABASE_URL}"
      }
    }
  }
}
```

### Puppeteer

浏览器自动化和网页抓取：

```jsonc
{
  "mcp": {
    "puppeteer": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

### Memory

持久化键值存储：

```jsonc
{
  "mcp": {
    "memory": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

### SQLite

轻量级数据库操作：

```jsonc
{
  "mcp": {
    "sqlite": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-sqlite", "/path/to/database.db"]
    }
  }
}
```

### Slack

与 Slack 工作空间交互：

```jsonc
{
  "mcp": {
    "slack": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-slack"],
      "environment": {
        "SLACK_BOT_TOKEN": "{env:SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "{env:SLACK_TEAM_ID}"
      }
    }
  }
}
```

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| MCP 工具不出现 | 全局禁用或 Agent 未配置 | 检查 `permission` 配置 |
| OAuth 认证失败 | Token 过期或凭据无效 | 运行 `opencode mcp logout && opencode mcp auth` |
| 状态显示 `needs_client_registration` | 服务器不支持动态注册 | 在 `oauth` 中配置 `clientId` |
| 上下文快速耗尽 | 启用了太多 MCP 工具 | 禁用不常用的 MCP，使用按 Agent 启用 |
| 工具名称冲突 | 多个 MCP 有同名工具 | 使用 `{服务器名}_{工具名}` 格式区分 |
| 认证后仍显示 needs_auth | Token 存储失败 | 检查 `~/.local/share/opencode/mcp-auth.json` 权限 |
| **命令格式错误** | `command` 写成字符串而非数组 | ❌ `"command": "npx xxx"` → ✓ `"command": ["npx", "-y", "xxx"]` |
| **URL 格式错误** | URL 缺少协议前缀 | ❌ `"url": "example.com/mcp"` → ✓ `"url": "https://example.com/mcp"` |
| **浏览器无法自动打开** | 在 SSH/远程环境下 | OpenCode 会显示 URL，手动复制到浏览器打开 |
| **超时时间太短** | `timeout` 设为 1000ms | 远程服务器建议 2000+-10000ms，默认 30000ms |
| **忘记启用服务器** | `enabled: false` 但疑惑为什么不工作 | 默认就是启用的，检查是否误设为 `false` |

---

## 本课小结

你学会了：

1. **OAuth 认证**：自动处理或手动配置客户端凭证
2. **调试命令**：`opencode mcp debug` 诊断连接问题
3. **状态图标**：✓ ○ ⚠ ✗ 四种状态的含义
4. **权限管理**：使用 `permission` 控制工具访问
5. **工具自动发现**：工具命名规则和变更通知机制
6. **扩展上下文**：服务器 instructions、resources 与 templates
7. **Code Mode**：在受限环境中编排获准的 MCP 工具
8. **规则集成**：在 AGENTS.md 中配置默认 MCP 使用
9. **常用 MCP**：Sentry、Context7、Grep、Postgres 等

---

## 相关资源

- [5.7a MCP 基础](./07a-mcp-basics) - MCP 入门配置
- [5.1 配置全解](./01a-config-basics) - 配置文件基础
- [5.2 自定义 Agent](./02a-agent-quickstart) - Agent 工具配置
- [5.5 权限管控](./05-permissions) - 详细权限设置
- [官方 MCP 文档](https://opencode.ai/docs/mcp-servers/) - 英文原版

---

## 下一课预告

> 下一课我们将学习 **[Chrome DevTools MCP](./07c-mcp-chrome-devtools)**。
>
> 你会学到：
> - 让 AI 直接连接你的 Chrome 浏览器
> - 调试已登录的页面（无需重新登录）
> - 在 DevTools 中选中元素/请求让 AI 分析
> - 使用浏览器截图、执行脚本等功能
