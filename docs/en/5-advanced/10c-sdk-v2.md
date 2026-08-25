---
title: "SDK V2: Complete Guide to the Next-Generation API | OpenCode Tutorial"
subtitle: "Complete Guide to the Next-Generation SDK V2 API"
course: "OpenCode Practical Course"
stage: "Stage 5"
lesson: "5.10c"
duration: "30 minutes"
practice: "40 minutes"
level: "Advanced"
description: "Learn OpenCode SDK V2 (@opencode-ai/sdk/v2), including its two client layers, Permission and Question APIs, Session3, Sync, Worktree, and V1 coexistence."
tags:
  - "SDK"
  - "V2"
  - "API"
  - "Experimental"
prerequisite:
  - "5.10a SDK Basics"
  - "5.10b API Reference"
---

# 5.10c SDK V2: The Next-Generation API

> **One-line summary**: V2 is the next-generation OpenCode SDK entry point. It retains V1 while extending APIs for sessions, questions, the current location, event streams, paginated history, runtime operations, and permission requests.

::: warning ⚠️ Version boundary
`v1.18.22` exports both `@opencode-ai/sdk` and `@opencode-ai/sdk/v2`. V2 continues to evolve, so pin the SDK version when using it. V1 has **not been removed** from the target version, and existing integrations do not need to migrate immediately simply because V2 has expanded. This chapter is based specifically on `packages/sdk/js/src/v2/` at the `v1.18.22` tag.
:::

---

## What You'll Learn

- Distinguish V1 from V2 and choose the right one for each situation
- Create a client with `@opencode-ai/sdk/v2`
- Understand the two access layers, `client.*` and `client.v2.*`
- Use the standalone Permission and Question modules
- Call enhanced Session3 methods such as `interrupt`, `wait`, and `compact`
- Migrate from V1 to V2

---

## What Is V2?

### How V1 and V2 Fit Together

The OpenCode SDK package (`@opencode-ai/sdk`) exposes two entry points through the `exports` field in `package.json`:

| Entry Point | Version | Status | Best For |
| --- | --- | --- | --- |
| `@opencode-ai/sdk` | V1 | Retained | Existing integrations and code that uses legacy routes |
| `@opencode-ai/sdk/v2` | V2 | Coexists with V1 and continues to evolve | Advanced users who need new capabilities and are willing to pin and validate a version |

> Source: [`packages/sdk/js/package.json:12-20`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/package.json#L12-L20)

V2 redesigns the API structure and is not fully compatible with V1. Because `package.json` exports both `.` and `./v2`, both entry points coexist in `v1.18.22`.

### V2's Two-Layer Client Structure (Important)

The defining feature of the V2 client is its **two access layers**. Understanding them is the key to understanding V2:

```
client                         OpencodeClient (27 modules)
├── session  → Session2        Legacy routes /session/* (basic methods)
├── permission → Permission    /permission/* (cross-session permissions)
├── question → Question        /question/* (cross-session questions)
├── part     → Part            Message-part CRUD
├── sync     → Sync            Workspace synchronization
├── worktree → Worktree        Git worktrees
├── experimental → Experimental Experimental feature collection
├── ...
└── v2       → V2              New /api/* route namespace (17 submodules)
    ├── session    → Session3  /api/session/* (enhanced methods)
    ├── permission → Permission3 /api/session/{}/permission
    ├── question   → Question3 /api/session/{}/question
    ├── health     → Health    /api/health
    ├── agent      → Agent     /api/agent
    ├── model      → Model     /api/model
    ├── fs         → Fs        /api/fs/*
    └── ...
```

**Key distinctions**:

| Access Path | Class | Routes | Purpose |
| --- | --- | --- | --- |
| `client.session` | Session2 | `/session/*` | Basic methods: list, create, and prompt |
| `client.v2.session` | Session3 | `/api/session/*` | **Enhanced methods**: interrupt, wait, compact, and switchModel |
| `client.permission` | Permission | `/permission/*` | Cross-session permission management |
| `client.v2.permission` | Permission3 | `/api/session/{}/permission` | Session-level permissions |

> Source: [`sdk.gen.ts:6990-7075`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L6990-L7075) (V2 class), [`sdk.gen.ts:7077-7219`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L7077-L7219) (`OpencodeClient` class)

::: tip Remember it in one sentence
**Enhanced session methods live under `client.v2.session`**, not `client.session`. `client.session` provides the basic methods for compatibility with legacy routes.
:::

### Parameter Style: Follow the Generated Signature

Most V2 methods no longer use V1's generic `{ path: {...}, body: {...} }` structure. Instead, `buildClientParams` distributes fields among the path, query string, and body. However, not every parameter is flat: some endpoints still use a `body` wrapper or request-body types such as `worktreeCreateInput`. Always follow the generated TypeScript signature for the endpoint you are calling.

```typescript
// ❌ V1 style (not valid in V2)
client.permission.reply({
  path: { requestID: "req-1" },
  body: { response: "always" },
})

// ✅ V2 style (flat)
client.permission.reply({
  requestID: "req-1",
  reply: "always",
})
```

> Source: [`sdk.gen.ts:3121-3144`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L3121-L3144) (`buildClientParams` distribution)

---

## Getting Started with V2

### Installation

V1 and V2 ship in the same npm package, so no additional package is required:

```bash
npm install @opencode-ai/sdk
```

### Create a Client

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk/v2"

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
  directory: "/path/to/my-project",        // Project directory
  experimental_workspaceID: "ws-123",      // Optional: workspace identifier
})
```

**Client configuration options**:

| Option | Type | Description |
| --- | --- | --- |
| `baseUrl` | `string` | Server URL; defaults to `http://localhost:4096` |
| `directory` | `string` | Project directory, passed in the `X-Opencode-Directory` header |
| `experimental_workspaceID` | `string` | Workspace identifier, passed in the `X-Opencode-Workspace` header |
| `fetch` | `function` | Custom fetch implementation |
| `headers` | `object` | Custom request headers |

> Source: [`v2/client.ts:50-92`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/client.ts#L50-L92)

::: details How are directory and workspaceID transmitted?
After encoding, `directory` is placed in the `X-Opencode-Directory` header, while `experimental_workspaceID` is placed in `X-Opencode-Workspace`. For `GET` / `HEAD` requests, the client interceptor also adds them to the query string. For `/api/*`, it adds both the regular keys and `location[directory]` / `location[workspace]`; other methods still retain the headers.
:::

---

## Overview of the 27 OpencodeClient Modules

V2's `OpencodeClient` exposes 27 module properties.

> Source: [`sdk.gen.ts:7077-7219`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L7077-L7219)

### V1-Compatible Modules (19)

`global` `project` `pty` `config` `tool` `instance` `path` `vcs` `command` `provider` `find` `file` `app` `mcp` `lsp` `formatter` `tui` `auth` `event`

These modules are largely unchanged from V1. See [5.10b API Reference](/en/5-advanced/10b-sdk-reference) for usage.

### New or Enhanced V2 Modules (8)

| Module | Access Path | Description |
| --- | --- | --- |
| **session** | `client.session` / `client.v2.session` | Two layers: basic Session2 plus enhanced Session3 |
| **permission** | `client.permission` | Cross-session permission management |
| **question** | `client.question` | Cross-session question management |
| **part** | `client.part` | Message-part CRUD |
| **sync** | `client.sync` | Workspace synchronization |
| **worktree** | `client.worktree` | Git worktree management |
| **experimental** | `client.experimental` | Collection of experimental capabilities |
| **v2** | `client.v2` | Namespace for new `/api/*` routes, with 17 submodules |

The following sections cover each one in detail.

---

## Core V2 Capabilities

### 1. Standalone Permission Module

In V1, responding to a permission request requires the lengthy `postSessionIdPermissionsPermissionId()` method and can address only a request in a specific session. V2 promotes permission management to a standalone module that supports cross-session queries and responses.

| Method | Route | Description |
| --- | --- | --- |
| `permission.list()` | `GET /permission` | List pending permission requests from every session |
| `permission.reply()` | `POST /permission/{requestID}/reply` | Respond to a permission request |
| `permission.respond()` | `POST /session/{sessionID}/permissions/{permissionID}` | ⚠️ Deprecated; use `reply` instead |

> Source: [`sdk.gen.ts:3085-3193`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L3085-L3193)

```typescript
// List all pending permission requests across sessions
const pending = await client.permission.list()
for (const request of pending.data ?? []) {
  console.log(`[${request.sessionID}] ${request.permission}: ${request.patterns.join(", ")}`)
}

// Respond to a permission request (the field is reply, not response)
await client.permission.reply({
  requestID: "req-123",
  reply: "always",     // "once" | "always" | "reject"
})
```

::: warning Watch the field name
The body field for `reply()` is **`reply`**, not `response`. `response` belongs to the deprecated `respond()` method.
:::

**Compared with V1**:

| Operation | V1 | V2 |
| --- | --- | --- |
| List permission requests | ❌ Not supported | ✅ `permission.list()` |
| Respond to permission | `postSessionIdPermissionsPermissionId({path:{id,permissionID},body:{response}})` | `permission.reply({requestID, reply})` |
| Query across sessions | ❌ | ✅ |

### 2. Standalone Question Module

Agents can ask you questions through the `question` tool. V1 has no unified management API; V2 adds a standalone module.

| Method | Route | Description |
| --- | --- | --- |
| `question.list()` | `GET /question` | List all unanswered questions |
| `question.reply()` | `POST /question/{requestID}/reply` | Answer a question |
| `question.reject()` | `POST /question/{requestID}/reject` | Reject a question |

> Source: [`sdk.gen.ts:2982-3084`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L2982-L3084)

```typescript
// View every unanswered question
const questions = await client.question.list()
for (const q of questions.data ?? []) {
  console.log(`[${q.sessionID}] ${q.questions[0]?.header ?? "(no question)"}`)
}

// Answer a question
await client.question.reply({
  requestID: "q-456",
  answers: [["Option A"]],
})

// Reject a question
await client.question.reject({ requestID: "q-456" })
```

::: tip Permissions vs. questions
- **Permission**: The agent wants to perform an **operation**, such as running a command or editing a file, and asks for authorization.
- **Question**: The agent needs **information**, such as a choice or preference, and asks you for it.
:::

### 3. Enhanced Sessions (`client.v2.session`)

This is the easiest V2 detail to get wrong. Enhanced session methods belong to **`client.v2.session`** (the Session3 class), not `client.session` (the Session2 class).

**Session2 (`client.session`)**: Compatible with legacy `/session/*` routes and provides basic methods such as list, create, prompt, and messages.

**Session3 (`client.v2.session`)**: Uses the new `/api/session/*` routes. Along with control methods, the target version can create and retrieve sessions, list sessions and messages with cursors, manage session-level questions and permission requests, paginate history, and stream events. The current location belongs to `client.v2.location` in the same V2 namespace; it is not a Session3 method.

> Source: [`sdk.gen.ts:5038-5058`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5038-L5058) (current location), [`sdk.gen.ts:5171-5424`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5171-L5424) (permissions and questions), [`sdk.gen.ts:5426-5873`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5873) (Session3)

**New Session3 methods**:

| Method | Route | Description |
| --- | --- | --- |
| `interrupt()` | `POST /api/session/{sessionID}/interrupt` | Interrupt the current execution |
| `wait()` | `POST /api/session/{sessionID}/wait` | Wait for the session to become idle |
| `compact()` | `POST /api/session/{sessionID}/compact` | Trigger context compaction |
| `context()` | `GET /api/session/{sessionID}/context` | Get the current context |
| `history()` | `GET /api/session/{sessionID}/history` | Get history |
| `switchModel()` | `POST /api/session/{sessionID}/model` | Switch models |
| `switchAgent()` | `POST /api/session/{sessionID}/agent` | Switch agents |
| `events()` | `GET /api/session/{sessionID}/event` | Stream session-level events |

`list()` and `messages()` support cursor pagination. `history({ sessionID, limit, after })` returns a bounded page of events after a specified aggregate sequence number, while `events({ sessionID, after })` replays earlier events and then continues streaming new ones.

> Source: [`sdk.gen.ts:5426-5517`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5517), [`sdk.gen.ts:5715-5793`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5715-L5793)

```typescript
const sessionID = "sess-abc"

// Note: all these methods live under client.v2.session (Session3)
await client.v2.session.interrupt({ sessionID })
await client.v2.session.wait({ sessionID })
await client.v2.session.compact({ sessionID })

// Switch models
await client.v2.session.switchModel({
  sessionID,
  model: { providerID: "anthropic", id: "claude-sonnet-4-20250514" },
})

// Switch agents
await client.v2.session.switchAgent({ sessionID, agent: "plan" })

// Get the context
const ctx = await client.v2.session.context({ sessionID })
```

::: danger The most common mistake
Putting enhanced methods on `client.session` causes an error. Remember:
- `client.session.prompt()` ✅ (basic method on Session2)
- `client.v2.session.interrupt()` ✅ (enhanced method on Session3)
- `client.session.interrupt()` ❌ (Session2 has no such method)
:::

### 4. Part Module (Message-Part CRUD)

V2 adds fine-grained operations for message **parts**. A message contains multiple Parts, and V2 can update or delete an individual Part.

| Method | Route | Description |
| --- | --- | --- |
| `part.delete()` | `DELETE /session/{sessionID}/message/{messageID}/part/{partID}` | Delete a part |
| `part.update()` | `PATCH /session/{sessionID}/message/{messageID}/part/{partID}` | Update a part |

> Source: [`sdk.gen.ts:4330-4406`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4330-L4406)

```typescript
// Update a text part
await client.part.update({
  sessionID: "sess-abc",
  messageID: "msg-1",
  partID: "part-3",
  part: { type: "text", text: "Updated content" },
})

// Delete a part
await client.part.delete({
  sessionID: "sess-abc",
  messageID: "msg-1",
  partID: "part-3",
})
```

### 5. Sync Module (Workspace Synchronization)

Sync is V2's event-synchronization mechanism for multiple workspaces.

| Method | Route | Description |
| --- | --- | --- |
| `sync.start()` | `POST /sync/start` | Start the synchronization loop |
| `sync.replay()` | `POST /sync/replay` | Replay synchronization events |
| `sync.steal()` | `POST /sync/steal` | Transfer a session to the current workspace |
| `sync.history.list()` | `POST /sync/history` | List synchronization event history |

> Source: [`sdk.gen.ts:4448-4576`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4448-L4576) (Sync class), [`sdk.gen.ts:4407-4446`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4407-L4446) (History class)

::: tip Note
`sync.history` is a **getter property** that returns a History instance, not a method. Call `sync.history.list()`.
:::

```typescript
// Start synchronization
await client.sync.start()

// Read synchronization event history (history is a getter; then call list)
const history = await client.sync.history.list({
  body: { "sess-abc": 10 },  // Return events whose seq is greater than 10
})
```

::: details When would you use Sync?
If OpenCode is running in multiple workspaces, sessions may need to move between them. Sync provides an event log so those moves are traceable and replayable. It is designed for future distributed or clustered deployments and is generally unnecessary for single-machine users.

In the target version, adapters create and discover workspaces, and the built-in adapter is `worktree`. Session warp can use `copyChanges` to copy the current patch. The v1.16.0 release introduced managed cloning that preserved dirty and untracked files, but a later adapter/worktree implementation replaced that path. Do not treat the old behavior as current `v1.18.22` behavior.

> Current implementation: [`adapters/index.ts:5-18`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/index.ts#L5-L18), [`workspace.ts:492-538`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L492-L538), [`workspace.ts:559-620`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L559-L620), [`workspace.ts:728-739`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L728-L739). Historical boundary: [`v1.16.0 Release`](https://github.com/anomalyco/opencode/releases/tag/v1.16.0), commit `5661af203487b90cf9ee0844b198b03cce26c412`.
:::

### 6. Worktree Module (Git Worktree Management)

V2 adds a complete API for managing Git worktrees.

| Method | Route | Description |
| --- | --- | --- |
| `worktree.list()` | `GET /experimental/worktree` | List all worktrees |
| `worktree.create()` | `POST /experimental/worktree` | Create a worktree |
| `worktree.remove()` | `DELETE /experimental/worktree` | Delete a worktree and its branch |
| `worktree.reset()` | `POST /experimental/worktree/reset` | Reset to the default branch |

> Source: [`sdk.gen.ts:1582-1723`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1582-L1723), [`types.gen.ts:2167-2187`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/types.gen.ts#L2167-L2187)

```typescript
// List all worktrees
const worktrees = await client.worktree.list()

// Create a worktree
await client.worktree.create({
  worktreeCreateInput: { name: "feature-experiment" },
})

// Delete one
await client.worktree.remove({
  worktreeRemoveInput: { directory: "/path/to/worktree" },
})
```

::: tip Relationship to Lesson 5.25 on Git worktrees
This section covers the SDK programming interface. For manual worktree usage, see [5.25 Git Worktree Workflow](/en/5-advanced/25-git-worktree).
:::

### 7. Experimental Module Collection

`client.experimental` is an aggregate module containing leading-edge capabilities such as workspace, resource, capabilities, console, and control-plane APIs.

| Subfeature | Route Prefix | Description |
| --- | --- | --- |
| workspace | `/experimental/workspace` | Multi-workspace management |
| resource | `/experimental/resource` | MCP resource queries |
| capabilities | `/experimental/capabilities` | Capability declarations |
| console | `/experimental/console` | Console and organization switching |
| controlPlane | `/experimental/control-plane` | Control plane and session migration |
| session | `/experimental/session` | Experimental sessions and background subagents |

> Source: [`sdk.gen.ts:1243-1278`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1243-L1278)

The experimental session `background` method can detach a blocking subagent and let it continue in the background:

```typescript
// Move a blocking subagent to the background so it can continue running
await client.experimental.session.background({ sessionID: "sess-abc" })
```

This endpoint detaches only the synchronous subagent currently blocking the session. Background subagents still require `OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true` (or the global `OPENCODE_EXPERIMENTAL=true` switch); otherwise, the endpoint returns `false`. In addition, `subagent_depth` defaults to `1`, preventing subagents from launching more subagents. Increase it explicitly to allow deeper nesting.

> Source: [`runtime-flags.ts:10-14,43`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/effect/runtime-flags.ts#L10-L14), [`experimental handler:159-170`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/routes/instance/httpapi/handlers/experimental.ts#L159-L170), [`task.ts:96-115`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/task.ts#L96-L115), [`config.ts:84-86`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L84-L86), [`sdk.gen.ts:805-886`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L805-L886)

---

## Complete Example: Build an Automation Assistant with V2

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk/v2"

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
  directory: "/path/to/my-project",
})

async function runTask(task: string) {
  // 1. Create a session (client.session is Session2, for basic methods)
  const session = await client.session.create({
    title: task.slice(0, 50),
    agent: "build",
  })
  const sessionID = session.data!.id

  // 2. Send the task asynchronously (flat parameters)
  await client.session.promptAsync({
    sessionID,
    parts: [{ type: "text", text: task }],
    model: { providerID: "anthropic", modelID: "claude-sonnet-4-20250514" },
  })

  // 3. Poll permission requests and automatically allow read-only operations
  const poll = setInterval(async () => {
    const pending = await client.permission.list()
    for (const req of pending.data ?? []) {
      // permission is the operation type (such as "read" or "grep"); patterns contains match patterns
      if (req.permission === "read" || req.permission === "grep") {
        await client.permission.reply({
          requestID: req.id,
          reply: "always",   // Note that the field is named reply
        })
      }
    }
  }, 1000)

  // 4. Wait for the session to finish (enhanced methods are under client.v2.session)
  await client.v2.session.wait({ sessionID })
  clearInterval(poll)

  // 5. Get the result (return to client.session for the basic method)
  const messages = await client.session.messages({ sessionID })
  const last = messages.data?.at(-1)

  // 6. Read token usage and cost (supported by both V1 and V2)
  if (last?.info.role === "assistant") {
    console.log(`Cost: $${last.info.cost}`)
    console.log(`Tokens: input ${last.info.tokens.input} / output ${last.info.tokens.output}`)
  }

  return last
}

const result = await runTask("Analyze the project structure and generate a README")
console.log(result)
```

> **Key point**: Basic methods—create, promptAsync, and messages—live under `client.session`; enhanced methods—wait, interrupt, and compact—live under `client.v2.session`. Switch access paths carefully when combining them.

---

## V1 → V2 Migration Guide

### Import Path

```typescript
// V1
import { createOpencodeClient } from "@opencode-ai/sdk"

// V2
import { createOpencodeClient } from "@opencode-ai/sdk/v2"
```

### Parameter Structure

```typescript
// V1: nested structure
await client.session.create({ body: { title: "xxx" } })
await client.session.prompt({ path: { id: "sess-1" }, body: { parts: [...] } })

// V2: flat structure
await client.session.create({ title: "xxx" })
await client.session.prompt({ sessionID: "sess-1", parts: [...] })
```

### Permission Responses

```typescript
// V1: long method name and nested parameters
await client.postSessionIdPermissionsPermissionId({
  path: { id: sessionID, permissionID: "perm-1" },
  body: { response: "always" },
})

// V2: standalone module and flat parameters
await client.permission.reply({
  requestID: "req-1",
  reply: "always",   // Field renamed: response → reply
})
```

### Session Control

```typescript
// V1: interruption and compaction already exist under different method names
await client.session.abort({ path: { id: sessionID } })
await client.session.summarize({ path: { id: sessionID } })
// V1 has no wait method, so you must poll manually

// V2: enhanced methods live under client.v2.session
await client.v2.session.interrupt({ sessionID })
await client.v2.session.wait({ sessionID })
await client.v2.session.compact({ sessionID })
await client.v2.session.switchModel({ sessionID, model: { ... } })
await client.v2.session.switchAgent({ sessionID, agent: "plan" })
```

### Capability Comparison

| Capability | V1 | V2 |
| --- | --- | --- |
| Respond to permissions | `postSessionIdPermissionsPermissionId` | `permission.reply` |
| List permissions | ❌ | `permission.list` |
| Manage questions | ❌ | `question.list/reply/reject` |
| Interrupt a session | `session.abort` | `v2.session.interrupt` |
| Wait for completion | ❌ (poll manually) | `v2.session.wait` |
| Trigger compaction | `session.summarize` | `v2.session.compact` |
| Switch models | ❌ | `v2.session.switchModel` |
| Switch agents | ❌ | `v2.session.switchAgent` |
| Message-part CRUD | ❌ | `part.update/delete` |
| Worktrees | ❌ | `worktree.list/create/remove/reset` |
| Workspace synchronization | ❌ | `sync.start/replay/steal/history.list` |

---

## Common Pitfalls

| Symptom | Cause | Solution |
| --- | --- | --- |
| `createOpencodeClient is not exported` | Wrong import path | Use `@opencode-ai/sdk/v2` for V2 |
| `client.session.interrupt is not a function` | Wrong access path | Enhanced methods live under `client.v2.session` |
| Parameter type error | Reused another endpoint's parameter shape | Check that method's generated signature; most parameters are flat, but some retain request-body wrappers |
| `permission.reply` reports a field error | Used `response` as the field name | The V2 field is `reply` |
| `sync.history is not a function` | `history` is a getter, not a method | Call `sync.history.list()` |
| Request returns HTML | Connected to a V1 server that does not support `/api/*` | Confirm that the server version supports V2 |
| V2 method signature differs from the documentation | V2 is experimental and its API changes | Treat `sdk.gen.ts` as the source of truth |
| `v2.session.wait` blocks indefinitely | The session is still running | Call `v2.session.interrupt` first or set a timeout |

---

## Lesson Summary

You learned:

1. **V2 positioning**: An evolving next-generation API that coexists with V1 in the same npm package
2. **Two-layer structure**: `client.*` for basic methods and new concepts, and `client.v2.*` for new `/api/*` routes
3. **Parameter style**: Most methods use endpoint fields directly, while a few retain request-body wrappers; follow the generated signature
4. **Core new capabilities**: Standalone Permission and Question modules, enhanced Session3 methods under `client.v2.session`, Part CRUD, Sync, and Worktree
5. **Migration essentials**: Differences in import paths, parameter structures, permission field names, and session access paths

---

## Related Resources

- [5.10a SDK Basics](/en/5-advanced/10a-sdk-basics) - Introduction to the V1 SDK
- [5.10b API Reference](/en/5-advanced/10b-sdk-reference) - Complete V1 API documentation
- [V2 Type Definitions Source (v1.18.22)](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/types.gen.ts)
- [Generated V2 SDK Source (v1.18.22)](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts)

---

## Appendix: Source Reference

<details>
<summary><strong>Click to expand source locations</strong></summary>

> Target version: v1.18.22 (2026-08-24)

| Feature | File Path | Lines |
| --- | --- | --- |
| V1/V2 exports configuration | [`packages/sdk/js/package.json`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/package.json#L12-L20) | 12-20 |
| V2 index (`createOpencode`) | [`packages/sdk/js/src/v2/index.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/index.ts#L1-L23) | 1-23 |
| V2 client (`createOpencodeClient`) | [`packages/sdk/js/src/v2/client.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/client.ts#L50-L92) | 50-92 |
| V2 server (`ServerOptions`) | [`packages/sdk/js/src/v2/server.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/server.ts#L5-L30) | 5-30 |
| 27 `OpencodeClient` modules | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L7077-L7219) | 7077-7219 |
| V2 namespace (17 submodules) | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L6990-L7075) | 6990-7075 |
| Permission module | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L3085-L3193) | 3085-3193 |
| Question module | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L2982-L3084) | 2982-3084 |
| Session3 module | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L5426-L5873) | 5426-5873 |
| Session2 module (basic methods) | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L3362-L4329) | 3362-4329 |
| Part module (update/delete) | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4330-L4406) | 4330-4406 |
| Sync module and History class | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L4407-L4576) | 4407-4576 |
| Worktree module | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1582-L1723) | 1582-1723 |
| Workspace module (experimental) | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1006-L1242) | 1006-1242 |
| Experimental aggregate module | [`sdk.gen.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/sdk/js/src/v2/gen/sdk.gen.ts#L1243-L1278) | 1243-1278 |

**Key classes**:
- `OpencodeClient`: Main V2 client class with 27 module properties
- `V2`: The `client.v2` namespace with 17 `/api/*` submodules
- `Session2` (`client.session`): Basic methods for legacy routes
- `Session3` (`client.v2.session`): Enhanced methods for new routes: interrupt, wait, compact, switchModel, and switchAgent
- `Permission` (`client.permission`): Cross-session permission management
- `Question` (`client.question`): Cross-session question management

**Note**: `packages/client/` (`@opencode-ai/client`) is a private package generated from Effect HttpApi, not the public SDK, and is outside this chapter's scope.

</details>
