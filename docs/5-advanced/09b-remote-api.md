---
title: 5.9b HTTP API 参考
subtitle: OpenCode 服务器完整 API 文档
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.9b"
duration: 25 分钟
level: 进阶
description: OpenCode 服务器提供完整的 REST API，支持编程方式与 OpenCode 交互。
tags:
  - API
  - HTTP
  - REST
prerequisite:
  - 5.9a 远程模式基础
---

# 5.9b HTTP API 参考

> 💡 **一句话总结**：OpenCode 服务器提供完整的 REST API，支持编程方式与 OpenCode 交互。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/remote-api-notes.mini.jpeg"
     alt="5.9b HTTP API 参考学霸笔记"
     data-zoom-src="/images/5-advanced/remote-api-notes.jpeg" />

---

## 学完你能做什么

- 理解 OpenCode API 的整体结构
- 使用 API 管理会话和消息
- 通过 API 执行命令和操作文件
- 监听 SSE 事件流

---

## API 概览

OpenCode 服务器发布 OpenAPI 3.1 规范，可在以下地址查看交互式文档：

```
http://<hostname>:<port>/doc
```

例如：`http://localhost:4096/doc`

本章下面的大部分 `/session`、`/file`、`/event` 路径属于 V1 API。`v1.18.22` 同时保留 V1，并通过 `/api/*` 扩展 V2；升级不会自动把现有 V1 调用改成 V2。

> 来源：[`packages/sdk/js/package.json:12-20`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/package.json#L12-L20)、[`V1 sdk.gen.ts:431-700`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/gen/sdk.gen.ts#L431-L700)、[`V2 sdk.gen.ts:5426-5873`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5873)

### V2 API 扩展

V2 不只是模型目录。目标版本已经扩展到会话、问题、当前位置、事件流、历史分页、运行时操作和权限请求：

| 方法 | 路径 | 描述 |
|------|------|------|
| `GET` | `/api/location` | 解析当前 directory/workspace 位置 |
| `GET` / `POST` | `/api/session` | 带分页的会话列表 / 创建会话 |
| `GET` | `/api/session/:sessionID` | 获取会话 |
| `GET` | `/api/session/:sessionID/history` | 按 `after` 和 `limit` 读取有限事件页 |
| `GET` | `/api/session/:sessionID/event` | 回放后持续订阅该会话事件 |
| `POST` | `/api/session/:sessionID/interrupt` | 中断当前进程拥有的活动执行 |
| `GET` | `/api/session/:sessionID/question` | 列出 session 的待处理问题 |
| `POST` | `/api/session/:sessionID/question/:requestID/reply` | 回答待处理问题 |
| `POST` | `/api/session/:sessionID/question/:requestID/reject` | 拒绝待处理问题 |
| `GET` / `POST` | `/api/session/:sessionID/permission` | 列出或创建 session 级权限请求 |
| `GET` | `/api/permission/request` | 按位置列出待处理权限请求 |
| `GET` | `/api/event` | V2 服务器事件 SSE |

> 来源：[`sdk.gen.ts:5038-5058`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5038-L5058)、[`sdk.gen.ts:5171-5424`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5171-L5424)、[`sdk.gen.ts:5426-5793`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5793)、[`sdk.gen.ts:6319-6405`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L6319-L6405)、[`sdk.gen.ts:6549-6559`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L6549-L6559)

---

## 认证

如果服务器设置了 `OPENCODE_SERVER_PASSWORD` 环境变量，所有 API 请求都需要 HTTP Basic Auth 认证。

### curl 示例

```bash
# 带 Basic Auth 认证
curl -u opencode:your-password http://localhost:4096/global/health

# 或手动设置 Authorization header
curl -H "Authorization: Basic $(echo -n 'opencode:your-password' | base64)" \
  http://localhost:4096/global/health
```

### 认证参数

| 参数 | 说明 |
|------|------|
| 用户名 | 默认 `opencode`，或 `OPENCODE_SERVER_USERNAME` 环境变量的值 |
| 密码 | `OPENCODE_SERVER_PASSWORD` 环境变量的值 |

---

## 全局 API

<AdInArticle />

### /global

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `GET` | `/global/health` | 服务器健康状态 | `{ healthy: true, version: string }` |
| `GET` | `/global/event` | 全局事件流（SSE） | Event stream |

**示例**：

```bash
# 未配置服务器密码时
curl http://localhost:4096/global/health

# 配置 OPENCODE_SERVER_PASSWORD 后，health 也需要 Basic Auth
curl -u opencode:your-password http://localhost:4096/global/health
```

响应：

```json
{
  "healthy": true,
  "version": "1.0.48"
}
```

> 来源：`opencode/packages/opencode/src/server/server.ts:131-150`

---

## 项目 API

### /project

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `GET` | `/project` | 列出所有项目 | `Project[]` |
| `GET` | `/project/current` | 获取当前项目 | `Project` |

> 来源：`opencode/packages/web/src/content/docs/server.mdx:88-94`

---

## 路径与版本控制 API

### /path, /vcs

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `GET` | `/path` | 获取当前路径 | `Path` |
| `GET` | `/vcs` | 获取当前项目的 VCS 信息 | `VcsInfo` |

> 来源：`opencode/packages/web/src/content/docs/server.mdx:97-103`

---

## 实例 API

### /instance

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `POST` | `/instance/dispose` | 销毁当前实例 | `boolean` |

> 来源：`opencode/packages/web/src/content/docs/server.mdx:106-111`

---

## 配置 API

### /config

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `GET` | `/config` | 获取配置信息 | `Config` |
| `PATCH` | `/config` | 更新配置 | `Config` |
| `GET` | `/config/providers` | 列出提供商和默认模型 | `{ providers: Provider[], default: Record<string, string> }` |

> 来源：`opencode/packages/web/src/content/docs/server.mdx:114-121`

---

## 提供商 API

### /provider

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `GET` | `/provider` | 列出所有提供商 | `{ all: Provider[], default: {...}, connected: string[] }` |
| `GET` | `/provider/auth` | 获取提供商认证方式 | `{ [providerID: string]: ProviderAuthMethod[] }` |
| `POST` | `/provider/{id}/oauth/authorize` | 发起 OAuth 授权 | `ProviderAuthAuthorization` |
| `POST` | `/provider/{id}/oauth/callback` | 处理 OAuth 回调 | `boolean` |

> 来源：`opencode/packages/web/src/content/docs/server.mdx:124-132`

---

## 会话 API

### /session

这是最常用的 API，用于管理对话会话。

| 方法 | 路径 | 描述 | 备注 |
|------|------|------|------|
| `GET` | `/session` | 列出所有会话 | 返回 `Session[]` |
| `POST` | `/session` | 创建新会话 | body: `{ parentID?, title? }` |
| `GET` | `/session/status` | 获取所有会话状态 | `{ [sessionID: string]: SessionStatus }` |
| `GET` | `/session/:id` | 获取会话详情 | 返回 `Session` |
| `DELETE` | `/session/:id` | 删除会话及其数据 | 返回 `boolean` |
| `PATCH` | `/session/:id` | 更新会话属性 | body: `{ title? }` |
| `GET` | `/session/:id/children` | 获取子会话 | 返回 `Session[]` |
| `GET` | `/session/:id/todo` | 获取会话的待办列表 | 返回 `Todo[]` |
| `POST` | `/session/:id/init` | 分析应用并创建 AGENTS.md | body: `{ messageID, providerID, modelID }` |
| `POST` | `/session/:id/fork` | 从指定消息分叉会话 | body: `{ messageID? }` |
| `POST` | `/session/:id/abort` | 中止运行中的会话 | 返回 `boolean` |
| `POST` | `/session/:id/share` | 分享会话 | 返回 `Session` |
| `DELETE` | `/session/:id/share` | 取消分享 | 返回 `Session` |
| `GET` | `/session/:id/diff` | 获取会话的文件差异 | query: `messageID?` |
| `POST` | `/session/:id/summarize` | 总结会话 | body: `{ providerID, modelID }` |
| `POST` | `/session/:id/revert` | 撤销到指定消息/部件，并默认回滚关联文件补丁 | body: `{ messageID, partID? }` |
| `POST` | `/session/:id/unrevert` | 重做已撤销的消息与文件状态 | 返回 `Session` |
| `POST` | `/session/:id/permissions/:permissionID` | 响应权限请求 | body: `{ response }` |

> 来源：`opencode/packages/web/src/content/docs/server.mdx:135-157`

`revert` 不是只隐藏聊天消息：服务会定位目标边界、收集之后的 patch、恢复 snapshot 并更新会话 diff；`unrevert` 会恢复原 snapshot 并清除 revert 状态。两者都要求 session 不在运行中。配置 `snapshot: false` 只会禁用文件 snapshot 的 undo/redo，消息边界的撤销语义仍然存在。

> 来源：[`session/revert.ts:38-98`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/revert.ts#L38-L98)、[`config.ts:52-55`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L52-L55)、[`V1 sdk.gen.ts:678-700`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/gen/sdk.gen.ts#L678-L700)

**示例 - 创建新会话**：

```bash
curl -X POST http://localhost:4096/session \
  -H "Content-Type: application/json" \
  -d '{"title": "代码审查会话"}'
```

---

## Workspace API（实验性）

`v1.18.22` 的 workspace 是 adapter 驱动的：内置 adapter 为 `worktree`，API 支持列出 adapter、创建/发现 workspace、查看连接状态和 warp session。请求可通过 `directory` / `workspace` query 进行 workspace-aware 路由；`warp` 的 `copyChanges` 会复制 Git patch。

| 方法 | 路径 | 描述 |
|------|------|------|
| `GET` | `/experimental/workspace/adapter` | 列出当前项目可用 adapter |
| `GET` / `POST` | `/experimental/workspace` | 列出 / 创建 workspace |
| `POST` | `/experimental/workspace/sync-list` | 注册 adapter 发现但尚未登记的 workspace |
| `GET` | `/experimental/workspace/status` | 获取连接状态 |
| `POST` | `/experimental/workspace/warp` | 移动 session，可选 `copyChanges` |

::: warning 历史边界
v1.16.0 Release 的 managed workspace cloning 曾承诺保留脏文件和未跟踪文件；目标 tag 的当前路径已经是 adapter/worktree。该历史能力不能直接视为 `v1.18.22` 当前 API 的行为，`copyChanges` 的实现证据是 Git patch，不含“复制所有未跟踪文件”的承诺。
:::

> 当前实现：[`workspace API 路径:12-47`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/routes/instance/httpapi/groups/workspace.ts#L12-L47)、[`workspace API 端点:53-127`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/routes/instance/httpapi/groups/workspace.ts#L53-L127)、[`workspace.ts:492-538`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L492-L538)、[`workspace.ts:559-620`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L559-L620)、[`workspace-routing.ts:148-185`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts#L148-L185)。历史证据：[`v1.16.0 Release`](https://github.com/anomalyco/opencode/releases/tag/v1.16.0)、commit `5661af203487b90cf9ee0844b198b03cce26c412`。

---

## 消息 API

### /session/:id/message

| 方法 | 路径 | 描述 | 备注 |
|------|------|------|------|
| `GET` | `/session/:id/message` | 列出消息 | query: `limit?` |
| `POST` | `/session/:id/message` | 发送消息并等待响应 | body 见下方 |
| `GET` | `/session/:id/message/:messageID` | 获取消息详情 | 返回 `{ info, parts }` |
| `POST` | `/session/:id/prompt_async` | 异步发送消息（不等待） | 返回 `204 No Content` |
| `POST` | `/session/:id/command` | 执行斜杠命令 | body: `{ command, arguments, ... }` |
| `POST` | `/session/:id/shell` | 运行 shell 命令 | body: `{ agent, model?, command }` |

### 发送消息的请求体

```typescript
{
  messageID?: string,     // 可选，消息 ID
  model?: {               // 可选，指定模型
    providerID: string,
    modelID: string
  },
  agent?: string,         // 可选，指定 agent
  noReply?: boolean,      // 可选，不等待回复
  system?: string,        // 可选，系统提示
  tools?: Record<string, boolean>, // 已废弃，优先使用 permission 配置
  parts: Part[]           // 消息内容
}
```

> 来源：`opencode/packages/web/src/content/docs/server.mdx:160-170`

**示例 - 发送消息**：

```bash
curl -X POST http://localhost:4096/session/abc123/message \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [
      {"type": "text", "text": "解释这段代码的作用"}
    ]
  }'
```

---

## 命令 API

### /command

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `GET` | `/command` | 列出所有命令 | `Command[]` |

> 来源：`opencode/packages/web/src/content/docs/server.mdx:173-178`

---

## 文件 API

### /find, /file

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `GET` | `/find?pattern=<pat>` | 搜索文件内容 | 匹配结果数组 |
| `GET` | `/find/file?query=<q>` | 按名称查找文件 | `string[]`（路径） |
| `GET` | `/find/symbol?query=<q>` | 查找工作区符号 | `Symbol[]` |
| `GET` | `/file?path=<path>` | 列出目录内容 | `FileNode[]` |
| `GET` | `/file/content?path=<p>` | 读取文件内容 | `FileContent` |
| `GET` | `/file/status` | 获取已跟踪文件的状态 | `File[]` |

### /find/file 查询参数

| 参数 | 必需 | 描述 |
|------|------|------|
| `query` | 是 | 搜索字符串（模糊匹配） |
| `type` | 否 | 限制为 `"file"` 或 `"directory"` |
| `directory` | 否 | 覆盖项目根目录 |
| `limit` | 否 | 最大结果数（1-200） |
| `dirs` | 否 | 旧参数，`"false"` 只返回文件 |

> 来源：`opencode/packages/web/src/content/docs/server.mdx:181-199`

**示例 - 搜索文件**：

```bash
# 搜索文件名包含 "config" 的文件
curl "http://localhost:4096/find/file?query=config&limit=10"

# 搜索文件内容
curl "http://localhost:4096/find?pattern=TODO"
```

---

## 工具 API（实验性）

### /experimental/tool

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `GET` | `/experimental/tool/ids` | 列出所有工具 ID | `ToolIDs` |
| `GET` | `/experimental/tool?provider=<p>&model=<m>` | 获取模型可用的工具及 JSON Schema | `ToolList` |

> 来源：`opencode/packages/web/src/content/docs/server.mdx:202-208`

---

## LSP、格式化器与 MCP API

### /lsp, /formatter, /mcp

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `GET` | `/lsp` | 获取 LSP 服务器状态 | `LSPStatus[]` |
| `GET` | `/formatter` | 获取格式化器状态 | `FormatterStatus[]` |
| `GET` | `/mcp` | 获取 MCP 服务器状态 | `{ [name: string]: MCPStatus }` |
| `POST` | `/mcp` | 动态添加 MCP 服务器 | body: `{ name, config }` |
| `POST` | `/mcp/:name/auth` | 启动 MCP OAuth 认证 | `{ authorizationUrl: string }` |
| `POST` | `/mcp/:name/auth/callback` | 处理 MCP OAuth 回调 | `boolean` |

> 来源：`opencode/packages/web/src/content/docs/server.mdx:211-218`, `server.ts:2197-2230`

---

## Agent API

### /agent

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `GET` | `/agent` | 列出所有可用 agent | `Agent[]` |

> 来源：`opencode/packages/web/src/content/docs/server.mdx:222-227`

---

## 日志 API

### /log

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `POST` | `/log` | 写入日志条目 | `boolean` |

请求体：

```typescript
{
  service: string,           // 服务名称
  level: "debug" | "info" | "warn" | "error",
  message: string,           // 日志消息
  extra?: Record<string, any> // 附加元数据
}
```

> 来源：`opencode/packages/web/src/content/docs/server.mdx:230-235`

---

## TUI 控制 API

### /tui

用于远程控制 TUI 界面，IDE 插件主要使用这些接口。

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `POST` | `/tui/append-prompt` | 向提示框追加文本 | `boolean` |
| `POST` | `/tui/open-help` | 打开帮助对话框 | `boolean` |
| `POST` | `/tui/open-sessions` | 打开会话选择器 | `boolean` |
| `POST` | `/tui/open-themes` | 打开主题选择器 | `boolean` |
| `POST` | `/tui/open-models` | 打开模型选择器 | `boolean` |
| `POST` | `/tui/submit-prompt` | 提交当前提示 | `boolean` |
| `POST` | `/tui/clear-prompt` | 清空提示框 | `boolean` |
| `POST` | `/tui/execute-command` | 执行命令 | body: `{ command }` |
| `POST` | `/tui/show-toast` | 显示提示通知 | body: `{ title?, message, variant }` |
| `GET` | `/tui/control/next` | 等待下一个控制请求 | Control request object |
| `POST` | `/tui/control/response` | 响应控制请求 | body: `{ body }` |

> 来源：`opencode/packages/web/src/content/docs/server.mdx:238-253`

**示例 - 远程控制 TUI**：

```bash
# 向提示框添加文本
curl -X POST http://localhost:4096/tui/append-prompt \
  -H "Content-Type: application/json" \
  -d '{"text": "请帮我审查这段代码"}'

# 提交提示
curl -X POST http://localhost:4096/tui/submit-prompt

# 显示通知
curl -X POST http://localhost:4096/tui/show-toast \
  -H "Content-Type: application/json" \
  -d '{"message": "操作完成", "variant": "success"}'
```

---

## 认证 API

### /auth

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `PUT` | `/auth/:id` | 设置认证凭据 | `boolean` |

请求体必须匹配对应提供商的 schema。

> 来源：`opencode/packages/web/src/content/docs/server.mdx:256-261`

---

## 事件流 API

### /event

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `GET` | `/event` | SSE 事件流 | Server-sent events |

连接后，首先收到 `server.connected` 事件，之后是各种总线事件。

> 来源：`opencode/packages/web/src/content/docs/server.mdx:264-269`

**示例 - 监听事件**：

```bash
curl -N http://localhost:4096/event
```

输出示例：

```
event: server.connected
data: {}

event: session.created
data: {"id":"abc123","title":"新会话"}

event: message.created
data: {"sessionID":"abc123","content":"..."}
```

---

## API 文档

### /doc

| 方法 | 路径 | 描述 | 响应 |
|------|------|------|------|
| `GET` | `/doc` | OpenAPI 3.1 规范文档 | HTML 页面 |

> 来源：`opencode/packages/web/src/content/docs/server.mdx:272-277`

---

## 类型定义

完整的 TypeScript 类型定义可在 SDK 中查看：

```
https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/gen/types.gen.ts
```

常用类型：
- `Session` - 会话信息
- `Message` - 消息信息
- `Part` - 消息内容部分
- `Provider` - 提供商信息
- `Agent` - Agent 信息
- `Config` - 配置信息

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 请求返回 CORS 错误 | 客户端来源未在白名单 | 启动时添加 `--cors <origin>` |
| 消息发送后无响应 | 使用了 `prompt_async` | 改用 `/session/:id/message` 同步接口 |
| SSE 连接频繁断开 | 网络超时或代理问题 | 检查代理设置，增加超时时间 |
| 404 错误 | 会话或消息 ID 不存在 | 先通过 GET 接口确认资源存在 |
| 实验性 API 不可用 | 功能可能变更或移除 | 查看最新文档确认 |

---

## 本课小结

你学会了：

1. **API 结构**：19 个 API 分类，覆盖会话、消息、文件、工具等
2. **会话管理**：创建、查询、分叉、分享会话
3. **消息交互**：同步/异步发送消息，执行命令
4. **文件操作**：搜索、读取、列出文件
5. **TUI 控制**：远程操控 TUI 界面
6. **事件监听**：通过 SSE 接收实时事件

---

## 相关资源

- [5.9a 远程模式基础](./09a-remote-basics) - 服务器启动与远程连接
- [5.10 SDK](./10a-sdk-basics) - JavaScript/TypeScript SDK
- [官方 API 文档](https://opencode.ai/docs/server) - 完整英文文档

---

## 下一课预告

> 下一课我们将学习如何使用 SDK 进行开发。
