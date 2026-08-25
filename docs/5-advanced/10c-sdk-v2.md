---
title: "SDK V2：下一代 API 完整指南 | OpenCode 教程"
subtitle: SDK V2 下一代 API 完整指南
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.10c"
duration: 30 分钟
practice: 40 分钟
level: 进阶
description: 学习 OpenCode SDK V2（@opencode-ai/sdk/v2）。本教程覆盖两层客户端结构、Permission/Question、Session3、Sync/Worktree 等能力，并说明 V1 与 V2 的并存边界。
tags:
  - SDK
  - V2
  - API
  - 实验性
prerequisite:
  - 5.10a SDK 基础
  - 5.10b API 参考
---

# 5.10c SDK V2：下一代 API

> **一句话总结**：V2 是 OpenCode SDK 的下一代入口，在保留 V1 的同时扩展了会话、问题、当前位置、事件流、历史分页、运行时操作和权限请求等 API。

::: warning ⚠️ 版本边界
`v1.18.22` 同时导出 `@opencode-ai/sdk` 和 `@opencode-ai/sdk/v2`。V2 接口仍在演进，使用时应固定 SDK 版本；V1 在目标版本中**没有移除**，现有集成不必因为 V2 扩展而立即迁移。本章固定以 `v1.18.22` tag 的 `packages/sdk/js/src/v2/` 为准。
:::

---

## 学完你能做什么

- 区分 V1 和 V2，知道什么时候用哪个
- 用 `@opencode-ai/sdk/v2` 创建客户端
- 理解 `client.*` 和 `client.v2.*` 两层访问路径
- 使用 Permission、Question 独立模块
- 调用 Session3 的增强方法（interrupt、wait、compact 等）
- 从 V1 迁移到 V2

---

## V2 是什么

### V1 和 V2 的定位

OpenCode SDK 包（`@opencode-ai/sdk`）通过 `package.json` 的 `exports` 暴露两个入口：

| 入口路径 | 版本 | 状态 | 适合谁 |
|---------|------|------|--------|
| `@opencode-ai/sdk` | V1 | 保留 | 现有集成、使用旧路由的代码 |
| `@opencode-ai/sdk/v2` | V2 | 与 V1 并存、持续演进 | 需要新能力、愿意固定版本验证的进阶用户 |

> 来源：[`packages/sdk/js/package.json:12-20`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/package.json#L12-L20)

V2 重新设计了 API 结构，和 V1 不完全兼容。`package.json` 同时导出 `.` 和 `./v2`，因此两个入口在 `v1.18.22` 中并存。

### V2 的两层客户端结构（重要）

V2 客户端最大的特点是**两层访问路径**，理解这个就理解了 V2 的核心：

```
client                         OpencodeClient（27 个模块）
├── session  → Session2        旧路由 /session/*（基础方法）
├── permission → Permission    /permission/*（跨 session 权限）
├── question → Question        /question/*（跨 session 提问）
├── part     → Part            消息部件 CRUD
├── sync     → Sync            workspace 同步
├── worktree → Worktree        git worktree
├── experimental → Experimental 实验功能集合
├── ...
└── v2       → V2              新路由 /api/* 命名空间（17 个子模块）
    ├── session    → Session3  /api/session/*（增强方法）
    ├── permission → Permission3 /api/session/{}/permission
    ├── question   → Question3 /api/session/{}/question
    ├── health     → Health    /api/health
    ├── agent      → Agent     /api/agent
    ├── model      → Model     /api/model
    ├── fs         → Fs        /api/fs/*
    └── ...
```

**关键区分**：

| 访问路径 | 类 | 路由 | 用途 |
|---------|-----|------|------|
| `client.session` | Session2 | `/session/*` | 基础方法（list/create/prompt） |
| `client.v2.session` | Session3 | `/api/session/*` | **增强方法**（interrupt/wait/compact/switchModel） |
| `client.permission` | Permission | `/permission/*` | 跨 session 权限管理 |
| `client.v2.permission` | Permission3 | `/api/session/{}/permission` | session 级权限 |

> 来源：[`sdk.gen.ts:6990-7075`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L6990-L7075)（V2 类定义）、[`sdk.gen.ts:7077-7219`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L7077-L7219)（OpencodeClient 定义）

::: tip 一句话记忆
**增强的 session 方法在 `client.v2.session`**，不是 `client.session`。`client.session` 是兼容旧路由的基础方法。
:::

### 参数风格：以生成签名为准

V2 多数方法不再使用 V1 通用的 `{ path: {...}, body: {...} }` 结构，而是由 `buildClientParams` 把字段分发到 path、query 和 body。不过并非所有参数都平铺：部分端点仍使用 `body` 或 `worktreeCreateInput` 等请求体包装。调用时应以生成的 TypeScript 签名为准。

```typescript
// ❌ V1 风格（V2 中不适用）
client.permission.reply({
  path: { requestID: "req-1" },
  body: { response: "always" },
})

// ✅ V2 风格（平铺）
client.permission.reply({
  requestID: "req-1",
  reply: "always",
})
```

> 来源：[`sdk.gen.ts:3121-3144`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L3121-L3144)（`buildClientParams` 自动分发）

---

## 开始使用 V2

### 安装

V2 和 V1 在同一个 npm 包里，不需要额外安装：

```bash
npm install @opencode-ai/sdk
```

### 创建客户端

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk/v2"

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
  directory: "/path/to/my-project",        // 项目目录
  experimental_workspaceID: "ws-123",      // 可选：workspace 标识
})
```

**客户端配置参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `baseUrl` | `string` | 服务器 URL，默认 `http://localhost:4096` |
| `directory` | `string` | 项目目录，通过 `X-Opencode-Directory` header 传递 |
| `experimental_workspaceID` | `string` | workspace 标识，通过 `X-Opencode-Workspace` header 传递 |
| `fetch` | `function` | 自定义 fetch 实现 |
| `headers` | `object` | 自定义请求头 |

> 来源：[`v2/client.ts:50-92`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/client.ts#L50-L92)

::: details directory 和 workspaceID 怎么传递的？
`directory` 被编码后放入 `X-Opencode-Directory` header，`experimental_workspaceID` 放入 `X-Opencode-Workspace` header。对 `GET` / `HEAD` 请求，客户端拦截器还会把它们写入 query string；`/api/*` 会同时补普通键和 `location[directory]` / `location[workspace]`，其他方法仍保留 header。
:::

---

## OpencodeClient 27 个模块总览

V2 的 `OpencodeClient` 暴露 27 个模块属性。

> 来源：[`sdk.gen.ts:7077-7219`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L7077-L7219)

### 兼容 V1 的模块（19 个）

`global` `project` `pty` `config` `tool` `instance` `path` `vcs` `command` `provider` `find` `file` `app` `mcp` `lsp` `formatter` `tui` `auth` `event`

这些模块和 V1 基本一致，用法参考 [5.10b API 参考](./10b-sdk-reference)。

### V2 新增/增强的模块（8 个）

| 模块 | 访问路径 | 说明 |
|------|---------|------|
| **session** | `client.session` / `client.v2.session` | 两层：Session2 基础 + Session3 增强 |
| **permission** | `client.permission` | 跨 session 权限管理 |
| **question** | `client.question` | 跨 session 提问管理 |
| **part** | `client.part` | 消息部件 CRUD |
| **sync** | `client.sync` | workspace 同步 |
| **worktree** | `client.worktree` | git worktree 管理 |
| **experimental** | `client.experimental` | 实验功能集合 |
| **v2** | `client.v2` | /api/* 新路由命名空间（17 个子模块） |

下面逐一详解。

---

## V2 核心新能力详解

### 1. Permission 独立模块

V1 响应权限请求要用超长的 `postSessionIdPermissionsPermissionId()`，且只能响应特定 session 的请求。V2 把权限管理提升为独立模块，支持跨 session 查询和响应。

| 方法 | 路由 | 说明 |
|------|------|------|
| `permission.list()` | `GET /permission` | 列出所有 session 的待处理权限请求 |
| `permission.reply()` | `POST /permission/{requestID}/reply` | 响应权限请求 |
| `permission.respond()` | `POST /session/{sessionID}/permissions/{permissionID}` | ⚠️ 已废弃，用 `reply` 代替 |

> 来源：[`sdk.gen.ts:3085-3193`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L3085-L3193)

```typescript
// 列出所有待处理的权限请求（跨 session）
const pending = await client.permission.list()
for (const request of pending.data ?? []) {
  console.log(`[${request.sessionID}] ${request.permission}: ${request.patterns.join(", ")}`)
}

// 响应某个权限请求（注意：字段名是 reply，不是 response）
await client.permission.reply({
  requestID: "req-123",
  reply: "always",     // "once" | "always" | "reject"
})
```

::: warning 字段名注意
`reply()` 方法的 body 字段名是 **`reply`**（不是 `response`）。`response` 是已废弃的 `respond()` 方法的字段名。
:::

**和 V1 的对比**：

| 操作 | V1 | V2 |
|------|----|----|
| 列出权限请求 | ❌ 不支持 | ✅ `permission.list()` |
| 响应权限 | `postSessionIdPermissionsPermissionId({path:{id,permissionID},body:{response}})` | `permission.reply({requestID, reply})` |
| 跨 session 查询 | ❌ | ✅ |

### 2. Question 独立模块

Agent 可以通过 `question` 工具向你提问。V1 没有统一管理接口，V2 新增独立模块。

| 方法 | 路由 | 说明 |
|------|------|------|
| `question.list()` | `GET /question` | 列出所有待回答的提问 |
| `question.reply()` | `POST /question/{requestID}/reply` | 回答提问 |
| `question.reject()` | `POST /question/{requestID}/reject` | 拒绝提问 |

> 来源：[`sdk.gen.ts:2982-3084`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L2982-L3084)

```typescript
// 查看所有待回答的提问
const questions = await client.question.list()
for (const q of questions.data ?? []) {
  console.log(`[${q.sessionID}] ${q.questions[0]?.header ?? "(no question)"}`)
}

// 回答某个提问
await client.question.reply({
  requestID: "q-456",
  answers: [["选项 A"]],
})

// 拒绝提问
await client.question.reject({ requestID: "q-456" })
```

::: tip 权限和提问的区别
- **Permission**：Agent 要执行某个**操作**（如运行命令、编辑文件），请求你授权。
- **Question**：Agent 需要**信息**（如选择方案、确认偏好），向你提问。
:::

### 3. Session 增强（client.v2.session）

这是 V2 最容易踩坑的地方。增强的 session 方法在 **`client.v2.session`**（Session3 类），不是 `client.session`（Session2 类）。

**Session2（client.session）**：兼容旧路由 `/session/*`，有 list/create/prompt/messages 等基础方法。

**Session3（client.v2.session）**：新路由 `/api/session/*`。除控制方法外，目标版本还支持创建/获取会话、带游标的会话与消息列表、session 级问题和权限请求、历史分页及事件流。当前位置属于同一 V2 命名空间下的 `client.v2.location`，不是 Session3 方法。

> 来源：[`sdk.gen.ts:5038-5058`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5038-L5058)（当前位置）、[`sdk.gen.ts:5171-5424`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5171-L5424)（权限与问题）、[`sdk.gen.ts:5426-5873`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5873)（Session3）

**Session3 新增方法**：

| 方法 | 路由 | 说明 |
|------|------|------|
| `interrupt()` | `POST /api/session/{sessionID}/interrupt` | 中断当前执行 |
| `wait()` | `POST /api/session/{sessionID}/wait` | 等待 session 空闲 |
| `compact()` | `POST /api/session/{sessionID}/compact` | 触发上下文压缩 |
| `context()` | `GET /api/session/{sessionID}/context` | 获取当前上下文 |
| `history()` | `GET /api/session/{sessionID}/history` | 获取历史记录 |
| `switchModel()` | `POST /api/session/{sessionID}/model` | 切换模型 |
| `switchAgent()` | `POST /api/session/{sessionID}/agent` | 切换 agent |
| `events()` | `GET /api/session/{sessionID}/event` | session 级事件流 |

其中 `list()` 和 `messages()` 支持游标分页，`history({ sessionID, limit, after })` 返回指定聚合序号之后的有限事件页；`events({ sessionID, after })` 会先回放再持续推送事件。

> 来源：[`sdk.gen.ts:5426-5517`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5517)、[`sdk.gen.ts:5715-5793`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5715-L5793)

```typescript
const sessionID = "sess-abc"

// 注意：这些方法都在 client.v2.session（Session3）
await client.v2.session.interrupt({ sessionID })
await client.v2.session.wait({ sessionID })
await client.v2.session.compact({ sessionID })

// 切换模型
await client.v2.session.switchModel({
  sessionID,
  model: { providerID: "anthropic", id: "claude-sonnet-4-20250514" },
})

// 切换 agent
await client.v2.session.switchAgent({ sessionID, agent: "plan" })

// 获取上下文
const ctx = await client.v2.session.context({ sessionID })
```

::: danger 最常见的坑
把增强方法写在 `client.session` 上会报错。记住：
- `client.session.prompt()` ✅（基础方法在 Session2）
- `client.v2.session.interrupt()` ✅（增强方法在 Session3）
- `client.session.interrupt()` ❌（Session2 没有这个方法）
:::

### 4. Part 模块（消息部件 CRUD）

V2 新增了对消息**部件**（Part）的细粒度操作。一条消息由多个 Part 组成，V2 支持删除和更新单个 Part。

| 方法 | 路由 | 说明 |
|------|------|------|
| `part.delete()` | `DELETE /session/{sessionID}/message/{messageID}/part/{partID}` | 删除部件 |
| `part.update()` | `PATCH /session/{sessionID}/message/{messageID}/part/{partID}` | 更新部件 |

> 来源：[`sdk.gen.ts:4330-4406`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4330-L4406)

```typescript
// 更新某个文本部件
await client.part.update({
  sessionID: "sess-abc",
  messageID: "msg-1",
  partID: "part-3",
  part: { type: "text", text: "修改后的内容" },
})

// 删除某个部件
await client.part.delete({
  sessionID: "sess-abc",
  messageID: "msg-1",
  partID: "part-3",
})
```

### 5. Sync 模块（workspace 同步）

Sync 是 V2 的多 workspace 事件同步机制。

| 方法 | 路由 | 说明 |
|------|------|------|
| `sync.start()` | `POST /sync/start` | 启动同步循环 |
| `sync.replay()` | `POST /sync/replay` | 回放同步事件 |
| `sync.steal()` | `POST /sync/steal` | 将 session 转移到当前 workspace |
| `sync.history.list()` | `POST /sync/history` | 列出同步事件历史 |

> 来源：[`sdk.gen.ts:4448-4576`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4448-L4576)（Sync 类）、[`sdk.gen.ts:4407-4446`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4407-L4446)（History 类）

::: tip 注意
`sync.history` 是一个 **getter 属性**（返回 History 类实例），不是方法。要调用 `sync.history.list()`。
:::

```typescript
// 启动同步
await client.sync.start()

// 查看同步事件历史（history 是 getter，再调 list）
const history = await client.sync.history.list({
  body: { "sess-abc": 10 },  // 返回 seq > 10 的事件
})
```

::: details Sync 是什么场景用的？
当你同时在多个 workspace 运行 OpenCode，session 可能需要在不同 workspace 间迁移。Sync 提供事件日志机制，确保迁移可追溯、可回放。这是为未来的分布式/集群场景设计的，单机用户一般用不到。

目标版本的 workspace 由 adapter 负责创建与发现，内置 adapter 是 `worktree`；会话 warp 可用 `copyChanges` 复制当前补丁。v1.16.0 Release 曾加入保留脏文件和未跟踪文件的 managed clone，但该实现已被后续 adapter/worktree 路径取代，不能当作 `v1.18.22` 的当前行为。

> 当前实现：[`adapters/index.ts:5-18`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/index.ts#L5-L18)、[`workspace.ts:492-538`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L492-L538)、[`workspace.ts:559-620`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L559-L620)、[`workspace.ts:728-739`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L728-L739)。历史边界：[`v1.16.0 Release`](https://github.com/anomalyco/opencode/releases/tag/v1.16.0)、commit `5661af203487b90cf9ee0844b198b03cce26c412`。
:::

### 6. Worktree 模块（git worktree 管理）

V2 新增了 git worktree 的完整管理接口。

| 方法 | 路由 | 说明 |
|------|------|------|
| `worktree.list()` | `GET /experimental/worktree` | 列出所有 worktree |
| `worktree.create()` | `POST /experimental/worktree` | 创建 worktree |
| `worktree.remove()` | `DELETE /experimental/worktree` | 删除 worktree 及分支 |
| `worktree.reset()` | `POST /experimental/worktree/reset` | 重置到默认分支 |

> 来源：[`sdk.gen.ts:1582-1723`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1582-L1723)、[`types.gen.ts:2167-2187`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/types.gen.ts#L2167-L2187)

```typescript
// 列出所有 worktree
const worktrees = await client.worktree.list()

// 创建新 worktree
await client.worktree.create({
  worktreeCreateInput: { name: "feature-experiment" },
})

// 删除
await client.worktree.remove({
  worktreeRemoveInput: { directory: "/path/to/worktree" },
})
```

::: tip 和 5.25 Git Worktree 课程的关系
本节是 SDK 编程接口。手动使用 worktree 请参考 [5.25 Git Worktree 工作流](./25-git-worktree)。
:::

### 7. Experimental 模块集合

`client.experimental` 是聚合模块，包含 workspace、resource、capabilities、console、control-plane 等前沿功能。

| 子功能 | 路由前缀 | 说明 |
|--------|---------|------|
| workspace | `/experimental/workspace` | 多工作空间管理 |
| resource | `/experimental/resource` | MCP 资源查询 |
| capabilities | `/experimental/capabilities` | 能力声明 |
| console | `/experimental/console` | 控制台（组织切换） |
| controlPlane | `/experimental/control-plane` | 控制平面（session 迁移） |
| session | `/experimental/session` | 实验性会话（background 子代理） |

> 来源：[`sdk.gen.ts:1243-1278`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1243-L1278)

实验性 session 的 `background` 方法可以把阻塞的子代理转为后台执行：

```typescript
// 把阻塞的子代理转到后台继续运行
await client.experimental.session.background({ sessionID: "sess-abc" })
```

该接口只会分离当前阻塞 session 的同步子代理。后台子代理能力仍受 `OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true`（或总开关 `OPENCODE_EXPERIMENTAL=true`）控制；未启用时接口返回 `false`。此外，`subagent_depth` 默认是 `1`，会阻止子代理继续启动子代理；只有明确调高后才允许更深嵌套。

> 来源：[`runtime-flags.ts:10-14,43`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/effect/runtime-flags.ts#L10-L14)、[`experimental handler:159-170`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts#L159-L170)、[`task.ts:96-115`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/task.ts#L96-L115)、[`config.ts:84-86`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L84-L86)、[`sdk.gen.ts:805-886`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L805-L886)

---

## 完整示例：用 V2 构建自动化助手

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk/v2"

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
  directory: "/path/to/my-project",
})

async function runTask(task: string) {
  // 1. 创建 session（client.session 是 Session2，基础方法）
  const session = await client.session.create({
    title: task.slice(0, 50),
    agent: "build",
  })
  const sessionID = session.data!.id

  // 2. 异步发送任务（平铺参数）
  await client.session.promptAsync({
    sessionID,
    parts: [{ type: "text", text: task }],
    model: { providerID: "anthropic", modelID: "claude-sonnet-4-20250514" },
  })

  // 3. 轮询权限请求，自动允许只读操作
  const poll = setInterval(async () => {
    const pending = await client.permission.list()
    for (const req of pending.data ?? []) {
      // permission 是操作类型（如 "read"、"grep"），patterns 是匹配模式
      if (req.permission === "read" || req.permission === "grep") {
        await client.permission.reply({
          requestID: req.id,
          reply: "always",   // 注意字段名是 reply
        })
      }
    }
  }, 1000)

  // 4. 等待 session 完成（增强方法在 client.v2.session）
  await client.v2.session.wait({ sessionID })
  clearInterval(poll)

  // 5. 获取结果（基础方法回到 client.session）
  const messages = await client.session.messages({ sessionID })
  const last = messages.data?.at(-1)

  // 6. 读取 Token 消耗和费用（V1/V2 都支持）
  if (last?.info.role === "assistant") {
    console.log(`费用: $${last.info.cost}`)
    console.log(`Token: 输入 ${last.info.tokens.input} / 输出 ${last.info.tokens.output}`)
  }

  return last
}

const result = await runTask("分析项目结构并生成 README")
console.log(result)
```

> **核心要点**：基础方法（create/promptAsync/messages）在 `client.session`，增强方法（wait/interrupt/compact）在 `client.v2.session`。混用时注意切换路径。

---

## V1 → V2 迁移指南

### 导入路径

```typescript
// V1
import { createOpencodeClient } from "@opencode-ai/sdk"

// V2
import { createOpencodeClient } from "@opencode-ai/sdk/v2"
```

### 参数结构

```typescript
// V1：嵌套结构
await client.session.create({ body: { title: "xxx" } })
await client.session.prompt({ path: { id: "sess-1" }, body: { parts: [...] } })

// V2：平铺结构
await client.session.create({ title: "xxx" })
await client.session.prompt({ sessionID: "sess-1", parts: [...] })
```

### 权限响应

```typescript
// V1：超长方法名 + 嵌套参数
await client.postSessionIdPermissionsPermissionId({
  path: { id: sessionID, permissionID: "perm-1" },
  body: { response: "always" },
})

// V2：独立模块 + 平铺参数
await client.permission.reply({
  requestID: "req-1",
  reply: "always",   // 字段名变了：response → reply
})
```

### 会话控制

```typescript
// V1：已有中断和压缩能力，但方法名不同
await client.session.abort({ path: { id: sessionID } })
await client.session.summarize({ path: { id: sessionID } })
// V1 没有 wait，需要自行轮询

// V2：增强方法在 client.v2.session
await client.v2.session.interrupt({ sessionID })
await client.v2.session.wait({ sessionID })
await client.v2.session.compact({ sessionID })
await client.v2.session.switchModel({ sessionID, model: { ... } })
await client.v2.session.switchAgent({ sessionID, agent: "plan" })
```

### 能力对照表

| 功能 | V1 | V2 |
|------|----|----|
| 权限响应 | `postSessionIdPermissionsPermissionId` | `permission.reply` |
| 权限列表 | ❌ | `permission.list` |
| 提问管理 | ❌ | `question.list/reply/reject` |
| 中断会话 | `session.abort` | `v2.session.interrupt` |
| 等待完成 | ❌（自己轮询） | `v2.session.wait` |
| 触发压缩 | `session.summarize` | `v2.session.compact` |
| 切换模型 | ❌ | `v2.session.switchModel` |
| 切换 agent | ❌ | `v2.session.switchAgent` |
| 消息部件 CRUD | ❌ | `part.update/delete` |
| worktree | ❌ | `worktree.list/create/remove/reset` |
| workspace 同步 | ❌ | `sync.start/replay/steal/history.list` |

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| `createOpencodeClient is not exported` | 导入路径错了 | V2 用 `@opencode-ai/sdk/v2` |
| `client.session.interrupt is not a function` | 用错了访问路径 | 增强方法在 `client.v2.session` |
| 参数报类型错误 | 套用了另一端点的参数结构 | 查看该方法的生成签名；多数参数平铺，部分仍有请求体包装 |
| `permission.reply` 报字段错误 | 字段名写成了 `response` | V2 字段名是 `reply` |
| `sync.history is not a function` | `history` 是 getter 不是方法 | 调用 `sync.history.list()` |
| 请求返回 HTML | 连的是 V1 服务器，不支持 `/api/*` | 确认服务器版本支持 V2 |
| V2 方法签名和文档不一致 | V2 是实验性，API 会变 | 以源码 `sdk.gen.ts` 为准 |
| `v2.session.wait` 一直阻塞 | session 一直在运行 | 先 `v2.session.interrupt` 或设超时 |

---

## 本课小结

你学会了：

1. **V2 定位**：持续演进的下一代 API，和 V1 并存于同一个 npm 包
2. **两层结构**：`client.*`（基础 + 新概念）和 `client.v2.*`（/api/* 新路由）
3. **参数风格**：多数方法改为端点字段参数，少数仍保留请求体包装，以生成签名为准
4. **核心新能力**：Permission/Question 独立模块、Session3 增强方法（在 `client.v2.session`）、Part CRUD、Sync、Worktree
5. **迁移要点**：导入路径、参数结构、权限字段名、session 访问路径的差异

---

## 相关资源

- [5.10a SDK 基础](./10a-sdk-basics) - V1 SDK 入门
- [5.10b API 参考](./10b-sdk-reference) - V1 完整 API 文档
- [V2 类型定义源码（v1.18.22）](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/types.gen.ts)
- [V2 SDK 生成源码（v1.18.22）](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts)

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 目标版本：v1.18.22（2026-08-24）

| 功能 | 文件路径 | 行号 |
|-----|---------|------|
| V1/V2 exports 配置 | [`packages/sdk/js/package.json`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/package.json#L12-L20) | 12-20 |
| V2 index（createOpencode） | [`packages/sdk/js/src/v2/index.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/index.ts#L1-L23) | 1-23 |
| V2 客户端（createOpencodeClient） | [`packages/sdk/js/src/v2/client.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/client.ts#L50-L92) | 50-92 |
| V2 服务器（ServerOptions） | [`packages/sdk/js/src/v2/server.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/server.ts#L5-L30) | 5-30 |
| OpencodeClient 27 模块 | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L7077-L7219) | 7077-7219 |
| V2 命名空间（17 子模块） | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L6990-L7075) | 6990-7075 |
| Permission 模块 | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L3085-L3193) | 3085-3193 |
| Question 模块 | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L2982-L3084) | 2982-3084 |
| Session3 模块 | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5873) | 5426-5873 |
| Session2 模块（基础方法） | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L3362-L4329) | 3362-4329 |
| Part 模块（update/delete） | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4330-L4406) | 4330-4406 |
| Sync 模块 + History 类 | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4407-L4576) | 4407-4576 |
| Worktree 模块 | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1582-L1723) | 1582-1723 |
| Workspace 模块（experimental） | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1006-L1242) | 1006-1242 |
| Experimental 模块（聚合） | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1243-L1278) | 1243-1278 |

**关键类**：
- `OpencodeClient`：V2 客户端主类，27 个模块属性
- `V2`：`client.v2` 命名空间，17 个 /api/* 子模块
- `Session2`（`client.session`）：旧路由基础方法
- `Session3`（`client.v2.session`）：新路由增强方法（interrupt/wait/compact/switchModel/switchAgent）
- `Permission`（`client.permission`）：跨 session 权限管理
- `Question`（`client.question`）：跨 session 提问管理

**注意**：`packages/client/`（`@opencode-ai/client`）是私有包，基于 Effect HttpApi 生成，非公开 SDK，不在本章范围。

</details>
