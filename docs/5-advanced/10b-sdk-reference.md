---
title: 5.10b API 参考
subtitle: SDK 完整 API 文档
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.10b"
duration: 30 分钟
practice: 40 分钟
level: 进阶
description: OpenCode SDK 提供 20 个 API 模块加 1 个权限响应方法、32 种事件类型，覆盖会话、文件、配置、MCP、LSP 等全部功能。
tags:
  - SDK
  - API
  - 参考文档
prerequisite:
  - 5.10a SDK 基础
---

# 5.10b API 参考

> **一句话总结**：OpenCode SDK 提供 20 个 API 模块加 1 个权限响应方法、32 种事件类型，覆盖会话、文件、配置、MCP、LSP 等全部功能。

---

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/10b-sdk-reference-notes.mini.jpeg"
     alt="5.10b API 参考学霸笔记"
     data-zoom-src="/images/5-advanced/10b-sdk-reference-notes.jpeg" />

---

## API 模块总览

SDK 客户端通过 `OpencodeClient` 类暴露以下模块：

::: info 版本边界
本章表格描述 V1 入口 `@opencode-ai/sdk`。`v1.18.22` 仍导出并保留 V1，同时通过 `@opencode-ai/sdk/v2` 扩展会话、问题、当前位置、事件流、历史分页、运行时操作和权限请求；V2 的平铺参数不能和本章 V1 的 `{ path, body }` 写法混用。
:::

> 来源：[`packages/sdk/js/package.json:12-20`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/package.json#L12-L20)、[`V1 OpencodeClient:1157-1197`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/gen/sdk.gen.ts#L1157-L1197)、[`V2 Session3:5426-5873`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5873)

| 模块 | 描述 | 来源 |
|------|------|------|
| `global` | 全局事件订阅 | `sdk.gen.ts:233-243` |
| `project` | 项目管理 | `sdk.gen.ts:245-265` |
| `session` | 会话管理（核心） | `sdk.gen.ts:431-700` |
| `file` | 文件操作 | `sdk.gen.ts:808-838` |
| `find` | 搜索功能 | `sdk.gen.ts:776-806` |
| `config` | 配置管理 | `sdk.gen.ts:337-371` |
| `app` | 应用信息 | `sdk.gen.ts:840-864` |
| `tui` | TUI 界面控制 | `sdk.gen.ts:1026-1143` |
| `event` | 事件订阅 | `sdk.gen.ts:1145-1155` |
| `auth` | 认证管理 | `sdk.gen.ts:866-926` |
| `provider` | 模型提供商 | `sdk.gen.ts:753-774` |
| `mcp` | MCP 服务器管理 | `sdk.gen.ts:928-974` |
| `lsp` | LSP 服务器状态 | `sdk.gen.ts:976-986` |
| `formatter` | 格式化器状态 | `sdk.gen.ts:988-998` |
| `command` | 命令列表 | `sdk.gen.ts:703-713` |
| `path` | 路径信息 | `sdk.gen.ts:407-417` |
| `vcs` | 版本控制信息 | `sdk.gen.ts:419-429` |
| `pty` | PTY 终端会话 | `sdk.gen.ts:267-335` |
| `tool` | 工具管理（实验性） | `sdk.gen.ts:373-393` |
| `instance` | 实例管理 | `sdk.gen.ts:395-405` |

---

<AdInArticle />

## Session 会话管理

会话是 SDK 最核心的模块，提供消息发送、历史管理等功能。

### 方法列表

| 方法 | 描述 | 返回类型 |
|------|------|----------|
| `session.list()` | 列出所有会话 | `Session[]` |
| `session.get({ path })` | 获取单个会话 | `Session` |
| `session.create({ body })` | 创建新会话 | `Session` |
| `session.delete({ path })` | 删除会话 | `boolean` |
| `session.update({ path, body })` | 更新会话属性 | `Session` |
| `session.status()` | 获取所有会话状态 | `{ [sessionID: string]: SessionStatus }` |
| `session.children({ path })` | 获取子会话列表 | `Session[]` |
| `session.todo({ path })` | 获取会话 Todo 列表 | `Todo[]` |
| `session.init({ path, body })` | 分析项目并创建 AGENTS.md | `boolean` |
| `session.fork({ path, body })` | 在指定消息处分叉会话 | `Session` |
| `session.abort({ path })` | 中止运行中的会话 | `boolean` |
| `session.share({ path })` | 分享会话 | `Session` |
| `session.unshare({ path })` | 取消分享 | `Session` |
| `session.diff({ path })` | 获取会话的文件变更 | `FileDiff[]` |
| `session.summarize({ path, body })` | 总结会话内容 | `boolean` |
| `session.messages({ path })` | 获取会话消息列表 | `{info: Message, parts: Part[]}[]` |
| `session.message({ path })` | 获取单条消息详情 | `{info: Message, parts: Part[]}` |
| `session.prompt({ path, body })` | 发送消息并等待响应 | `{info: AssistantMessage, parts: Part[]}` |
| `session.promptAsync({ path, body })` | 异步发送消息（不等待） | `204 No Content` |
| `session.command({ path, body })` | 发送命令 | `{info: AssistantMessage, parts: Part[]}` |
| `session.shell({ path, body })` | 运行 shell 命令 | `AssistantMessage` |
| `session.revert({ path, body })` | 撤销到指定消息 | `Session` |
| `session.unrevert({ path })` | 重做已撤销的消息与文件状态 | `Session` |

::: tip 权限响应
Session 类**没有** `permission()` 方法。响应权限请求请使用 `OpencodeClient` 上的直接方法：

```typescript
await client.postSessionIdPermissionsPermissionId({
  path: { id: "session-id", permissionID: "perm-id" },
  body: { response: "always" },  // "once" | "always" | "reject"
})
```
:::

### Undo / Revert / Redo

V1 的 `session.revert()` 对应 undo/revert：它会把会话边界移到指定 `messageID`（可细化到 `partID`），收集边界之后的 patch，并默认恢复关联文件 snapshot。`session.unrevert()` 对应 redo/unrevert：恢复原 snapshot 后清除 revert 状态。两者都会拒绝运行中的 session。

```typescript
// Undo：回到指定消息，并默认回滚该边界之后的文件补丁
await client.session.revert({
  path: { id: sessionID },
  body: { messageID: "msg-123" },
})

// Redo：恢复刚才撤销的消息与文件状态
await client.session.unrevert({ path: { id: sessionID } })
```

配置 `snapshot: false` 只禁用文件 snapshot 的 undo/redo，不会删除消息边界的 revert 能力。

> 来源：[`V1 sdk.gen.ts:678-700`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/gen/sdk.gen.ts#L678-L700)、[`session/revert.ts:38-98`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/revert.ts#L38-L98)、[`config.ts:52-55`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L52-L55)

### 代码示例

```typescript
// 创建会话
const session = await client.session.create({
  body: { title: "代码重构任务" },
})

// 发送消息
const result = await client.session.prompt({
  path: { id: session.data!.id },
  body: {
    model: { providerID: "anthropic", modelID: "claude-opus-4-5-thinking" },
    parts: [{ type: "text", text: "请帮我重构这个函数" }],
  },
})

// 获取消息列表
const messages = await client.session.messages({
  path: { id: session.data!.id },
})

// 获取 Todo 列表
const todos = await client.session.todo({
  path: { id: session.data!.id },
})

// 分叉会话
const forked = await client.session.fork({
  path: { id: session.data!.id },
  body: { messageID: "msg-123" },
})

// 获取文件变更
const diff = await client.session.diff({
  path: { id: session.data!.id },
})

// 中止会话
await client.session.abort({
  path: { id: session.data!.id },
})

// 分享会话（生成可访问的 URL）
const shared = await client.session.share({ path: { id: session.data!.id } })
console.log(`分享链接: ${shared.data?.share?.url}`)

// 取消分享
await client.session.unshare({ path: { id: session.data!.id } })
```

### prompt body 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `parts` | `Array<TextPartInput \| FilePartInput \| AgentPartInput \| SubtaskPartInput>` | 消息内容部分 |
| `model` | `{providerID, modelID}` | 指定模型 |
| `noReply` | `boolean` | 设为 `true` 则不触发 AI 响应（注入上下文） |
| `agent` | `string` | 使用指定 Agent |

### Token 消耗与费用

每次 AI 回复都会返回 token 消耗和费用，无需额外请求。`session.prompt()` 返回的 `info` 字段（类型 `AssistantMessage`）自带 `cost` 和 `tokens`：

```typescript
const result = await client.session.prompt({
  path: { id: sessionID },
  body: {
    parts: [{ type: "text", text: "分析这段代码" }],
  },
})

const info = result.data?.info  // AssistantMessage
if (info) {
  console.log(`费用: $${info.cost}`)
  console.log(`输入 token: ${info.tokens.input}`)
  console.log(`输出 token: ${info.tokens.output}`)
  console.log(`推理 token: ${info.tokens.reasoning}`)
  console.log(`缓存读取: ${info.tokens.cache.read}`)
  console.log(`缓存写入: ${info.tokens.cache.write}`)
}
```

> 来源：`types.gen.ts:112-141`（AssistantMessage 类型）

**按步统计**：如果模型分多步执行（如工具调用），每步结束时会产生一个 `StepFinishPart`，同样带 `cost` 和 `tokens` 字段，可以拿到**每一步**的消耗：

```typescript
// 遍历消息的所有 Part，统计每步消耗
const msg = await client.session.message({
  path: { id: sessionID, messageID: "msg-1" },
})

for (const part of msg.data?.parts ?? []) {
  if (part.type === "step-finish") {
    console.log(`步骤费用: $${part.cost}, 输出: ${part.tokens.output} tokens`)
  }
}
```

> 来源：`types.gen.ts:315-332`（StepFinishPart 类型）

::: tip 统计整个会话的累计消耗
遍历 `session.messages()` 返回的所有消息，把每条 `AssistantMessage` 的 `cost` 和 `tokens` 累加即可。
:::

### 工具调用监控

AI 回复中的 `ToolPart` 记录了每次工具调用的完整生命周期。通过 `part.state` 可以判断工具处于哪个阶段，拿到输入、输出和耗时：

```typescript
const msg = await client.session.message({
  path: { id: sessionID, messageID: "msg-1" },
})

for (const part of msg.data?.parts ?? []) {
  if (part.type !== "tool") continue
  console.log(`工具: ${part.tool}`)
  const state = part.state
  switch (state.status) {
    case "completed":
      console.log(`  结果: ${state.output}`)
      console.log(`  耗时: ${state.time.end - state.time.start}ms`)
      break
    case "error":
      console.log(`  错误: ${state.error}`)
      break
    case "running":
      console.log(`  正在执行...`)
      break
    case "pending":
      console.log(`  等待执行`)
      break
  }
}
```

工具调用的四种状态：

| 状态 | 说明 | 可用字段 |
|------|------|---------|
| `pending` | 等待执行 | `input`（参数）、`raw`（原始输入） |
| `running` | 正在执行 | `input`、`title`、`time.start` |
| `completed` | 已完成 | `input`、`output`（结果）、`title`、`time.{start,end}`、`attachments`（附件） |
| `error` | 出错 | `input`、`error`（错误信息）、`time.{start,end}` |

> 来源：`types.gen.ts:237-305`（ToolState 四种子类型 + ToolPart）

### 会话代码变更统计

`Session` 类型自带 `summary` 字段，记录这个会话修改了多少代码，无需手动 diff：

```typescript
const session = await client.session.get({ path: { id: sessionID } })
const summary = session.data?.summary
if (summary) {
  console.log(`修改文件: ${summary.files}`)
  console.log(`新增行: ${summary.additions}`)
  console.log(`删除行: ${summary.deletions}`)
  // summary.diffs 包含每个文件的差异
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `summary.files` | `number` | 修改的文件数 |
| `summary.additions` | `number` | 新增行数 |
| `summary.deletions` | `number` | 删除行数 |
| `summary.diffs` | `FileDiff[]?` | 每个文件的差异明细 |

> 来源：`types.gen.ts:533-560`（Session.summary 字段）

---

## Project 项目管理

| 方法 | 描述 | 返回类型 |
|------|------|----------|
| `project.list()` | 列出所有项目 | `Project[]` |
| `project.current()` | 获取当前项目 | `Project` |

```typescript
// 获取当前项目
const current = await client.project.current()
console.log(`项目路径: ${current.data?.worktree}`)

// 列出所有项目
const projects = await client.project.list()
```

### Project 类型

```typescript
type Project = {
  id: string
  worktree: string      // 工作目录
  vcsDir?: string       // VCS 目录（如 .git）
  vcs?: "git"           // 版本控制类型
  time: {
    created: number
    initialized?: number
  }
}
```

---

## File 文件操作

| 方法 | 描述 | 返回类型 |
|------|------|----------|
| `file.list({ query })` | 列出文件和目录 | `FileNode[]` |
| `file.read({ query })` | 读取文件内容 | `FileContent` |
| `file.status()` | 获取文件状态（git 变更） | `File[]` |

```typescript
// 列出目录内容
const nodes = await client.file.list({
  query: { path: "src" },
})

// 读取文件
const content = await client.file.read({
  query: { path: "src/index.ts" },
})
console.log(content.data?.content)

// 获取 git 状态
const status = await client.file.status()
for (const file of status.data ?? []) {
  console.log(`${file.status}: ${file.path} (+${file.added}/-${file.removed})`)
}
```

---

## Find 搜索功能

| 方法 | 描述 | 返回类型 |
|------|------|----------|
| `find.text({ query })` | 在文件内容中搜索文本 | 匹配结果数组 |
| `find.files({ query })` | 按名称查找文件/目录 | `string[]` |
| `find.symbols({ query })` | 查找工作区符号 | `Symbol[]` |

### find.files 查询参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `query` | `string` | 搜索模式（支持 glob，必填） |
| `dirs` | `"true" \| "false"` | 是否只返回目录（字符串，可选） |
| `directory` | `string` | 覆盖搜索根目录（可选） |

```typescript
// 搜索文本
const matches = await client.find.text({
  query: { pattern: "TODO|FIXME" },
})

// 查找文件
const tsFiles = await client.find.files({
  query: { query: "*.ts" },
})

// 只查找目录
const dirs = await client.find.files({
  query: { query: "src", dirs: "true" },
})

// 查找符号
const symbols = await client.find.symbols({
  query: { query: "handleRequest" },
})
```

---

## Config 配置管理

| 方法 | 描述 | 返回类型 |
|------|------|----------|
| `config.get()` | 获取当前配置 | `Config` |
| `config.update({ body })` | 更新配置 | `Config` |
| `config.providers()` | 获取提供商列表和默认模型 | `{providers, default}` |

```typescript
// 获取配置
const config = await client.config.get()
console.log(`当前模型: ${config.data?.model}`)

// 动态更新配置
await client.config.update({
  body: {
    model: "anthropic/claude-haiku-4-5",
    logLevel: "DEBUG",
  },
})

// 获取提供商信息
const { providers, default: defaults } = (await client.config.providers()).data!
```

---

## App 应用信息

| 方法 | 描述 | 返回类型 |
|------|------|----------|
| `app.log({ body })` | 写入日志条目 | `boolean` |
| `app.agents()` | 列出所有 Agent | `Agent[]` |

```typescript
// 写入日志
await client.app.log({
  body: {
    service: "my-plugin",
    level: "info",
    message: "操作完成",
  },
})

// 获取 Agent 列表
const agents = await client.app.agents()
for (const agent of agents.data ?? []) {
  console.log(`${agent.name}: ${agent.description}`)
}
```

---

## TUI 界面控制

| 方法 | 描述 | 返回类型 |
|------|------|----------|
| `tui.appendPrompt({ body })` | 向输入框追加文本 | `boolean` |
| `tui.submitPrompt()` | 提交当前输入 | `boolean` |
| `tui.clearPrompt()` | 清空输入框 | `boolean` |
| `tui.showToast({ body })` | 显示通知 | `boolean` |
| `tui.openHelp()` | 打开帮助对话框 | `boolean` |
| `tui.openSessions()` | 打开会话选择器 | `boolean` |
| `tui.openThemes()` | 打开主题选择器 | `boolean` |
| `tui.openModels()` | 打开模型选择器 | `boolean` |
| `tui.executeCommand({ body })` | 执行 TUI 命令 | `boolean` |
| `tui.publish({ body })` | 发布 TUI 事件 | `boolean` |
| `tui.control.next()` | 获取下一个 TUI 请求 | - |
| `tui.control.response()` | 提交 TUI 响应 | - |

### showToast 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `message` | `string` | 通知内容 |
| `title` | `string` | 通知标题（可选） |
| `variant` | `"info" \| "success" \| "warning" \| "error"` | 通知类型 |
| `duration` | `number` | 显示时长（毫秒） |

```typescript
// 显示成功通知
await client.tui.showToast({
  body: {
    title: "操作成功",
    message: "文件已保存",
    variant: "success",
    duration: 3000,
  },
})

// 执行命令
await client.tui.executeCommand({
  body: { command: "session.new" },
})
```

---

## Auth 认证管理

| 方法 | 描述 | 返回类型 |
|------|------|----------|
| `auth.set({ path, body })` | 设置认证凭据 | `boolean` |
| `auth.remove({ path })` | 移除 MCP OAuth 凭据 | `boolean` |
| `auth.start({ path })` | 启动 OAuth 流程 | - |
| `auth.callback({ path, body })` | OAuth 回调 | - |
| `auth.authenticate({ path })` | 自动 OAuth（打开浏览器） | - |

```typescript
// 设置 API Key
await client.auth.set({
  path: { id: "anthropic" },
  body: { type: "api", key: "sk-xxx" },
})

// 设置 OAuth 凭据
await client.auth.set({
  path: { id: "github" },
  body: {
    type: "oauth",
    access: "access-token",
    refresh: "refresh-token",
    expires: Date.now() + 3600000,
  },
})
```

---

## Provider 提供商管理

| 方法 | 描述 | 返回类型 |
|------|------|----------|
| `provider.list()` | 列出所有提供商 | `{ all: Provider[], default: Record<string, string>, connected: string[] }` |
| `provider.auth()` | 获取提供商认证方法 | `Record<string, ProviderAuthMethod[]>` |
| `provider.oauth.authorize({ path, body })` | OAuth 授权 | - |
| `provider.oauth.callback({ path, body })` | OAuth 回调 | - |

```typescript
// 获取提供商列表
const providers = await client.provider.list()
for (const p of providers.data?.all ?? []) {
  console.log(`${p.name} (${p.id}): ${Object.keys(p.models).length} 个模型`)
}

// 获取认证方法
const authMethods = await client.provider.auth()
for (const [providerID, methods] of Object.entries(authMethods.data ?? {})) {
  console.log(providerID, methods)
}
```

---

## MCP 服务器管理

| 方法 | 描述 | 返回类型 |
|------|------|----------|
| `mcp.status()` | 获取 MCP 服务器状态 | `Record<string, McpStatus>` |
| `mcp.add({ body })` | 动态添加 MCP 服务器 | - |
| `mcp.connect({ path })` | 连接 MCP 服务器 | - |
| `mcp.disconnect({ path })` | 断开 MCP 服务器 | - |
| `mcp.auth.*` | MCP OAuth 认证 | - |

### McpStatus 类型

```typescript
type McpStatus = 
  | { status: "connected" }
  | { status: "disabled" }
  | { status: "failed"; error: string }
  | { status: "needs_auth" }
  | { status: "needs_client_registration"; error: string }
```

```typescript
// 获取状态
const status = await client.mcp.status()
for (const [name, value] of Object.entries(status.data ?? {})) {
  console.log(name, value.status)
}

// 动态添加 MCP 服务器
await client.mcp.add({
  body: {
    name: "my-mcp",
    config: {
      type: "local",
      command: ["node", "mcp-server.js"],
    },
  },
})

// 连接/断开
await client.mcp.connect({ path: { name: "my-mcp" } })
await client.mcp.disconnect({ path: { name: "my-mcp" } })
```

---

## LSP 和 Formatter 状态

```typescript
// LSP 状态
const lspStatus = await client.lsp.status()
for (const lsp of lspStatus.data ?? []) {
  console.log(`${lsp.name}: ${lsp.status}`)
}

// 格式化器状态
const formatterStatus = await client.formatter.status()
for (const fmt of formatterStatus.data ?? []) {
  console.log(`${fmt.name}: ${fmt.enabled ? "启用" : "禁用"}`)
}
```

---

## PTY 终端会话

用于管理伪终端会话（实验性功能）。

| 方法 | 描述 | 返回类型 |
|------|------|----------|
| `pty.list()` | 列出所有 PTY 会话 | `Pty[]` |
| `pty.create({ body })` | 创建 PTY 会话 | `Pty` |
| `pty.get({ path })` | 获取 PTY 会话信息 | `Pty` |
| `pty.update({ path, body })` | 更新 PTY 会话 | `Pty` |
| `pty.remove({ path })` | 移除 PTY 会话 | `boolean` |
| `pty.connect({ path })` | 连接 PTY 会话 | `boolean` |

### Pty 类型

```typescript
type Pty = {
  id: string
  title: string
  command: string
  args: string[]
  cwd: string
  status: "running" | "exited"
  pid: number
}
```

```typescript
// 创建 PTY 会话
const pty = await client.pty.create({
  body: {
    command: "bash",
    cwd: "/home/user/project",
    title: "开发终端",
  },
})

// 更新窗口大小
await client.pty.update({
  path: { id: pty.data!.id },
  body: {
    size: { rows: 24, cols: 80 },
  },
})
```

---

## Tool 工具管理（实验性）

> 以下 API 位于 `/experimental/` 路径，可能在未来版本变更。

| 方法 | 描述 | 返回类型 |
|------|------|----------|
| `tool.ids()` | 列出所有工具 ID | `string[]` |
| `tool.list({ query })` | 获取工具的 JSON Schema | `ToolListItem[]` |

```typescript
// 获取所有工具 ID
const toolIds = await client.tool.ids()
console.log("可用工具:", toolIds.data)

// 获取工具详情（需指定模型）
const tools = await client.tool.list({
  query: {
    provider: "anthropic",
    model: "claude-opus-4-5-thinking",
  },
})
```

---

## Path 和 VCS 信息

```typescript
// 获取路径信息
const pathInfo = await client.path.get()
console.log(`状态目录: ${pathInfo.data?.state}`)
console.log(`配置目录: ${pathInfo.data?.config}`)
console.log(`工作树: ${pathInfo.data?.worktree}`)
console.log(`当前目录: ${pathInfo.data?.directory}`)

// 获取 VCS 信息
const vcsInfo = await client.vcs.get()
console.log(`当前分支: ${vcsInfo.data?.branch}`)
```

---

## Instance 实例管理

```typescript
// 销毁当前实例
await client.instance.dispose()
```

---

## Command 命令列表

```typescript
// 获取所有命令
const commands = await client.command.list()
for (const cmd of commands.data ?? []) {
  console.log(`/${cmd.name}: ${cmd.description}`)
}
```

---

## 事件类型完整列表

SDK 支持 32 种实时事件，通过 `client.event.subscribe()` 订阅。

### 服务器事件

| 事件类型 | 描述 | 属性 |
|----------|------|------|
| `server.connected` | 服务器已连接 | - |
| `server.instance.disposed` | 实例已销毁 | `directory` |

### 安装事件

| 事件类型 | 描述 | 属性 |
|----------|------|------|
| `installation.updated` | 安装已更新 | `version` |
| `installation.update-available` | 有可用更新 | `version` |

### 会话事件

| 事件类型 | 描述 | 属性 |
|----------|------|------|
| `session.created` | 会话已创建 | `info: Session` |
| `session.updated` | 会话已更新 | `info: Session` |
| `session.deleted` | 会话已删除 | `info: Session` |
| `session.status` | 会话状态变更 | `sessionID`, `status` |
| `session.idle` | 会话进入空闲 | `sessionID` |
| `session.compacted` | 会话已压缩 | `sessionID` |
| `session.diff` | 会话文件变更 | `sessionID`, `diff: FileDiff[]` |
| `session.error` | 会话错误 | `sessionID?`, `error` |

### 消息事件

| 事件类型 | 描述 | 属性 |
|----------|------|------|
| `message.updated` | 消息已更新 | `info: Message` |
| `message.removed` | 消息已删除 | `sessionID`, `messageID` |
| `message.part.updated` | 消息部分更新 | `part: Part`, `delta?: string` |
| `message.part.removed` | 消息部分删除 | `sessionID`, `messageID`, `partID` |

### 权限事件

| 事件类型 | 描述 | 属性 |
|----------|------|------|
| `permission.updated` | 权限请求待处理 | `Permission` |
| `permission.replied` | 权限已响应 | `sessionID`, `permissionID`, `response` |

### 文件事件

| 事件类型 | 描述 | 属性 |
|----------|------|------|
| `file.edited` | 文件已编辑 | `file` |
| `file.watcher.updated` | 文件监视器更新 | `file`, `event: "add" \| "change" \| "unlink"` |

### Todo 事件

| 事件类型 | 描述 | 属性 |
|----------|------|------|
| `todo.updated` | Todo 列表更新 | `sessionID`, `todos: Todo[]` |

### 命令事件

| 事件类型 | 描述 | 属性 |
|----------|------|------|
| `command.executed` | 命令已执行 | `name`, `sessionID`, `arguments`, `messageID` |

### VCS 事件

| 事件类型 | 描述 | 属性 |
|----------|------|------|
| `vcs.branch.updated` | 分支已切换 | `branch?` |

### LSP 事件

| 事件类型 | 描述 | 属性 |
|----------|------|------|
| `lsp.updated` | LSP 状态更新 | - |
| `lsp.client.diagnostics` | LSP 诊断信息 | `serverID`, `path` |

### TUI 事件

| 事件类型 | 描述 | 属性 |
|----------|------|------|
| `tui.prompt.append` | 输入框追加文本 | `text` |
| `tui.command.execute` | TUI 命令执行 | `command` |
| `tui.toast.show` | 显示通知 | `title?`, `message`, `variant`, `duration?` |

### PTY 事件

| 事件类型 | 描述 | 属性 |
|----------|------|------|
| `pty.created` | PTY 会话已创建 | `info: Pty` |
| `pty.updated` | PTY 会话已更新 | `info: Pty` |
| `pty.exited` | PTY 会话已退出 | `id`, `exitCode` |
| `pty.deleted` | PTY 会话已删除 | `id` |

### 事件监听示例

```typescript
const events = await client.event.subscribe()

for await (const event of events.stream) {
  switch (event.type) {
    case "message.part.updated":
      // 增量更新，可用于流式显示
      if (event.properties.delta) {
        process.stdout.write(event.properties.delta)
      }
      break
      
    case "session.status":
      const { sessionID, status } = event.properties
      if (status.type === "busy") {
        console.log(`会话 ${sessionID} 正在处理...`)
      } else if (status.type === "idle") {
        console.log(`会话 ${sessionID} 已完成`)
      } else if (status.type === "retry") {
        console.log(`会话 ${sessionID} 重试中 (${status.attempt})`)
      }
      break
      
    case "permission.updated":
      console.log(`权限请求: ${event.properties.title}`)
      // 可以自动响应权限请求
      await client.postSessionIdPermissionsPermissionId({
        path: {
          id: event.properties.sessionID,
          permissionID: event.properties.id,
        },
        body: { response: "always" },  // "once" 允许一次 | "always" 总是允许 | "reject" 拒绝
      })
      break
      
    case "file.edited":
      console.log(`文件已修改: ${event.properties.file}`)
      break
      
    case "todo.updated":
      console.log(`Todo 更新:`, event.properties.todos)
      break
  }
}
```

---

## 完整类型定义

### 核心类型

```typescript
// 会话
type Session = {
  id: string
  projectID: string
  directory: string
  parentID?: string
  title: string
  version: string
  summary?: {
    additions: number
    deletions: number
    files: number
    diffs?: FileDiff[]
  }
  share?: { url: string }
  time: {
    created: number
    updated: number
    compacting?: number
  }
  revert?: {
    messageID: string
    partID?: string
    snapshot?: string
    diff?: string
  }
}

// 会话状态
type SessionStatus =
  | { type: "idle" }
  | { type: "busy" }
  | { type: "retry"; attempt: number; message: string; next: number }

// 消息
type Message = UserMessage | AssistantMessage

type UserMessage = {
  id: string
  sessionID: string
  role: "user"
  agent: string
  model: { providerID: string; modelID: string }
  time: { created: number }
  summary?: { title?: string; body?: string; diffs: FileDiff[] }
  system?: string
  tools?: { [key: string]: boolean }
}

type AssistantMessage = {
  id: string
  sessionID: string
  role: "assistant"
  parentID: string
  modelID: string
  providerID: string
  mode: string
  path: { cwd: string; root: string }
  time: { created: number; completed?: number }
  error?: MessageError
  cost: number
  tokens: {
    input: number
    output: number
    reasoning: number
    cache: { read: number; write: number }
  }
  finish?: string
  summary?: boolean
}
```

### Part 类型

```typescript
type Part =
  | TextPart
  | ReasoningPart
  | FilePart
  | ToolPart
  | StepStartPart
  | StepFinishPart
  | SnapshotPart
  | PatchPart
  | AgentPart
  | RetryPart
  | CompactionPart
  | SubtaskPart

type TextPart = {
  id: string
  sessionID: string
  messageID: string
  type: "text"
  text: string
  synthetic?: boolean
  ignored?: boolean
  time?: { start: number; end?: number }
  metadata?: { [key: string]: unknown }
}

type ToolPart = {
  id: string
  sessionID: string
  messageID: string
  type: "tool"
  callID: string
  tool: string
  state: ToolState
  metadata?: { [key: string]: unknown }
}

type ToolState =
  | { status: "pending"; input: object; raw: string }
  | { status: "running"; input: object; title?: string; time: { start: number } }
  | { status: "completed"; input: object; output: string; title: string; time: { start: number; end: number } }
  | { status: "error"; input: object; error: string; time: { start: number; end: number } }
```

### 错误类型

```typescript
type MessageError =
  | ProviderAuthError
  | UnknownError
  | MessageOutputLengthError
  | MessageAbortedError
  | ApiError

type ApiError = {
  name: "APIError"
  data: {
    message: string
    statusCode?: number
    isRetryable: boolean
    responseHeaders?: { [key: string]: string }
    responseBody?: string
  }
}
```

`AssistantMessage.error` 可能是以下 5 种之一：

| 错误类型 | 含义 | 常见原因 |
|---------|------|---------|
| `ProviderAuthError` | 认证失败 | API Key 无效或过期 |
| `MessageOutputLengthError` | 输出超长 | 超过模型最大输出 token |
| `MessageAbortedError` | 被中断 | 用户调了 `session.abort()` 或超时 |
| `ApiError` | API 返回错误 | 速率限制（429）、服务端错误（500）等，看 `data.statusCode` 和 `data.isRetryable` |
| `UnknownError` | 未知错误 | 其他未分类错误 |

```typescript
const result = await client.session.prompt({ path: { id: sessionID }, body: { ... } })
const error = result.data?.info.error
if (error) {
  switch (error.name) {
    case "APIError":
      if (error.data.isRetryable) console.log("可重试，稍后再试")
      else console.log(`API 错误 ${error.data.statusCode}: ${error.data.message}`)
      break
    case "ProviderAuthError":
      console.log("API Key 问题，检查认证配置")
      break
    // ...
  }
}
```

> 来源：`types.gen.ts:70-110`（MessageError 五种子类型）

### 其他类型

```typescript
type Todo = {
  id: string
  content: string
  status: string  // pending, in_progress, completed, cancelled
  priority: string  // high, medium, low
}

type Permission = {
  id: string
  type: string
  pattern?: string | string[]
  sessionID: string
  messageID: string
  callID?: string
  title: string
  metadata: { [key: string]: unknown }
  time: { created: number }
}

type Agent = {
  name: string
  description?: string
  mode: "subagent" | "primary" | "all"
  builtIn: boolean
  topP?: number
  temperature?: number
  color?: string
  model?: { modelID: string; providerID: string }
  prompt?: string
  tools: { [key: string]: boolean }
  options: { [key: string]: unknown }
  maxSteps?: number
  permission: {
    edit: "ask" | "allow" | "deny"
    bash: { [key: string]: "ask" | "allow" | "deny" }
    webfetch?: "ask" | "allow" | "deny"
    doom_loop?: "ask" | "allow" | "deny"
    external_directory?: "ask" | "allow" | "deny"
  }
}

type FileDiff = {
  file: string
  before: string
  after: string
  additions: number
  deletions: number
}
```

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| `data` 返回 `undefined` | 请求失败，检查 `error` 字段 | 检查 `result.error` |
| 事件流断开 | 网络中断或服务器重启 | 实现重连逻辑 |
| `tool.list` 返回空 | 需要指定 `provider` 和 `model` | 添加 query 参数 |
| 权限请求无响应 | 需要手动响应 | 使用 `postSessionIdPermissionsPermissionId` |
| MCP 状态 `needs_auth` | MCP 服务器需要 OAuth 认证 | 调用 `mcp.auth.authenticate` |

---

## 本课小结

你学会了：
1. **20 个 API 模块加 1 个权限响应方法**的完整方法列表

2. **32 种事件类型**及其属性
3. **核心类型定义**：Session、Message、Part、Todo、Agent 等
4. **实验性 API**：Tool 管理、PTY 终端

---

## 下一课预告

> V1 讲完了，但 OpenCode 还并存一个持续演进的 V2 入口。下一课我们学习 **[5.10c SDK V2 下一代 API](./10c-sdk-v2)**。
>
> 你会学到：
> - 顶层兼容模块与 `client.v2.*` 命名空间
> - 独立的 Permission/Question 模块（跨 session 管理权限和提问）
> - Session3 增强方法（interrupt/wait/compact/切换模型/切换 agent）
> - Sync、Worktree、Workspace 等 V2 新概念
> - 从 V1 迁移到 V2 的完整指南

---

## 相关资源

- [5.10a SDK 基础](./10a-sdk-basics) - 入门教程
- [5.9 远程开发](./09a-remote-basics) - HTTP Server 详解
- [SDK 类型定义源码（v1.18.22）](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/gen/types.gen.ts)
