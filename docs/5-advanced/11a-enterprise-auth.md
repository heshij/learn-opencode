---
title: 5.11a 企业认证集成
subtitle: 对接自有统一认证与组织默认配置
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.11a"
duration: 30 分钟
practice: 35 分钟
level: 进阶
description: 对接公司统一认证，把登录时保存的 token 注入配置变量替换映射，并下发组织默认配置（短期 token 用插件实现续期）。
tags:
  - 企业
  - 认证
  - 配置
  - 插件
prerequisite:
  - 5.1 配置全解
  - 5.11 企业版功能
---

# 企业认证集成

> 💡 **一句话总结**：把公司统一登录拿到的 Token 接进 OpenCode，让团队不用手填 Key，默认就能走内网模型干活。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/enterprise-auth-notes.mini.jpeg"
     alt="5.11a 企业认证集成学霸笔记"
     data-zoom-src="/images/5-advanced/enterprise-auth-notes.jpeg" />

---

你可以把这节课当成一件事：**让 OpenCode 在公司内网“开箱即用”**。

本课会给你 3 条路（从最省事到最灵活）：

1）环境变量：你们自己注入 Token，OpenCode 读取即可

2）well-known：登录时执行一次 `auth.command` 保存 token；后续启动注入已保存 token，并加载内嵌 `config` 或 `remote_config` 指向的独立 JSON（不自动续期）

3）认证插件：需要 OAuth/刷新/签名/改 headers/params 时，用插件实现

::: tip 💡 本课怎么读最快
- 先看“3 种接入方式对比图”，选你们团队最像的那条路
- 然后直接跳到对应步骤：方式 A（环境变量）/ 方式 B（well-known）/ 方式 C（插件认证）
:::

## 学完你能做什么

- 把公司统一认证的 Token 接进 OpenCode（不用每个人手填 Key）
- 用 `/.well-known/opencode` 给团队下发默认配置（比如强制走内部 AI 网关）
- 分清楚：什么时候用环境变量就够了，什么时候用 well-known，什么时候必须写认证插件

<img src="/images/5-advanced/11a-auth-3ways.mini.jpeg"
     alt="三种接入方式对比"
     data-zoom-src="/images/5-advanced/11a-auth-3ways.jpeg" />

---

## 你现在的困境

- 公司有统一认证（SSO/统一网关），但 OpenCode 默认是按 Provider Key 来配
- 让每个同学自己复制粘贴 Token：麻烦、易过期、也容易泄漏
- 你希望：团队机器一跑 OpenCode，就自动带上公司凭据，并且默认只用内网模型

---

## 什么时候用这一招

- 你们能用一条命令获取 Token（例如 `corpctl token`、`sso login --print-token`）
- 你们有一个内部域名能提供 `https://<host>/.well-known/opencode`
- 你希望把“默认模型、默认 Provider、禁用外网 Provider”等配置集中管理

---

## 🎒 开始前的准备

- [ ] 读过 [5.1 配置全解](./01a-config-basics)
- [ ] 准备一个内部域名，例如 `https://ai.company.internal`
- [ ] 准备一个获取 Token 的命令（推荐非交互：直接输出 token 到 stdout，不依赖 stdin 交互）

::: info ℹ️ 这里的“Token”指什么？
OpenCode 的 Provider 最终需要的通常就是一段字符串：API Key、Bearer Token、或网关发的临时凭据。

这节课的目标是：把这段字符串自动放进某个环境变量里，让 OpenCode 的 Provider 能读到它。
:::

---

## 核心思路

OpenCode 有一个很适合企业内网的入口：`opencode auth login <url>`。

- 它会请求 `<url>/.well-known/opencode`，读到 `auth.command` 和 `auth.env`，然后在本机执行 `auth.command` 取回 Token 并保存（源码：[`providers.ts:325-350`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/providers.ts#L325-L350)）。
- OpenCode 启动加载配置时，如果发现你保存过这种 `type: "wellknown"` 的凭据，会把 token 放进仅供配置变量替换使用的环境映射，并合并 `<url>/.well-known/opencode` 里的 `config`。如果响应包含 `remote_config`，还会拉取其 `url` 指向的独立 JSON；远程 JSON 的字段覆盖内嵌 `config`（源码：[`config.ts:356-393`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/config.ts#L356-L393)）。

企业里最常见的对接方式，其实有 3 种（按“需要你改多少东西”从少到多）：

1. 环境变量：你们自己把 Token 注入到环境变量，OpenCode 只负责读取
2. well-known：OpenCode 负责“获取 Token + 注入 env + 下发默认配置”
3. 认证插件：当你们需要 OAuth/刷新/签名/改请求头时，用插件实现登录流程和请求改写

::: info 🤔 什么是 well-known？
`/.well-known/` 是一个约定俗成的“固定目录”，常用来放**服务发现**信息：客户端只要访问一个固定路径，就能拿到机器可读的配置。

OpenCode 在企业场景里约定了一个端点：`/.well-known/opencode`。

它返回一个 JSON，通常包含两块：

- `auth`：告诉 OpenCode 用什么命令拿到 Token（`auth.command`），以及把 Token 注入到哪个环境变量（`auth.env`）
- `config`：直接内嵌的组织默认配置
- `remote_config`：可选，使用 `{ "url": "...", "headers": { ... } }` 指向独立配置 JSON；URL 和 header 值支持配置变量替换

注意：OpenCode 会直接运行 `auth.command`，而且启动时也会拉取 `config` / `remote_config` 并合并。只应信任可控的企业域名。

`config` 里如果包含 `plugin`，OpenCode 可能会自动安装插件包并 `import()` 执行（源码：`packages/opencode/src/plugin/index.ts`）。

简单说：把 `/.well-known/opencode` 当成“组织发给开发机的配置入口”，只应该部署在你们可控、可信的内网域名上。
:::

::: details 📦 well-known 下发的是“默认值”，不是“强制策略”
OpenCode v1 loader 的配置合并顺序（低 → 高）是：

1）远程 `/.well-known/opencode`（组织默认）

2）全局配置（依次读取旧版 `config.json`、`opencode.json`、`opencode.jsonc`；新建全局配置默认写 `opencode.jsonc`）

3）自定义配置路径（`OPENCODE_CONFIG`）

4）项目配置（`opencode.json{,c}`）

5）`.opencode/` 目录配置（包含 `.opencode/opencode.json{,c}` 和 `.opencode/plugin/` 等）

5.1）你也可以用 `OPENCODE_CONFIG_DIR` 指定一个额外的配置目录（它会被当成目录来源的一部分加载）

6）内联配置（`OPENCODE_CONFIG_CONTENT`）

（企业版）managed config 目录会覆盖以上所有来源。

`remote_config` 与内嵌 `wellknown.config` 在全局、项目和 `.opencode/` 之前加载，所以它们提供的是组织默认值，后续本地来源仍可覆盖。对应实现见 [`config.ts:356-429`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/config.ts#L356-L429)；managed config 最后合并见 [`config.ts:525-534`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/config.ts#L525-L534)。

所以 `wellknown.config` 更适合做“团队默认开箱体验”。

但有个例外：`plugin`/`instructions` 这类数组字段在合并时是“合并并去重”，不是简单覆盖（源码：`packages/opencode/src/config/config.ts` 的 merge 逻辑：用 `Set` 按完整字符串值去重）。

其中 `plugin` 还会再做一次“按插件名去重”，并且高优先级来源会覆盖低优先级来源的同名插件（源码：`packages/opencode/src/config/config.ts` 的 `deduplicatePlugins()`）。

如果你要强制所有人只能走内网网关，通常需要企业版集中管理，或配合 IT/镜像/权限策略把本机覆盖入口限制住。
:::

---

## 跟我做

### 第 1 步：先选你要用的接入方式

**为什么**  
选对方式，后面就不会走冤枉路。

| 你们的现状 | 选哪种 |
|---|---|
| 已经有固定 Key（或你能在 K8s/CI 里很方便注入 Token） | 环境变量 |
| 能用一条命令输出 Token，且想把默认配置统一下发 | well-known |
| 必须走 OAuth/设备码/需要自动刷新/需要签名或改 headers/params | 认证插件 |

### 第 2 步（方式 A）：只用环境变量接入（最省事）

**为什么**  
如果你们已经能把 Token 放到环境变量里（本机 / K8s / CI），OpenCode 不需要任何额外认证机制。

1）在 `opencode.json` 配一个内网 provider，并明确它从哪个环境变量读 key：

```jsonc
// opencode.json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "corp-gateway": {
      "name": "Company AI Gateway",
      "env": ["COMPANY_AI_TOKEN"],
      "api": "https://ai-gateway.company.internal/v1",
      "npm": "@ai-sdk/openai-compatible",
      "models": {
        "qwen2.5-72b": {
          "name": "Qwen 2.5 72B",
          "tool_call": true,
          "reasoning": true,
          "temperature": true,
          "limit": { "context": 128000, "output": 8192 }
        }
      }
    }
  },
  "model": "corp-gateway/qwen2.5-72b"
}
```

2）运行前注入环境变量并验证：

::: code-group
```bash [macOS/Linux]
export COMPANY_AI_TOKEN="<your-token>"
opencode run -m corp-gateway/qwen2.5-72b "ping"
```

```powershell [Windows PowerShell]
$env:COMPANY_AI_TOKEN = "<your-token>"
opencode run -m corp-gateway/qwen2.5-72b "ping"
```
:::

**你应该看到**：`opencode run` 能返回模型输出。

::: tip 💡 适合 K8s/CI
把 `COMPANY_AI_TOKEN` 做成 K8s Secret 或 CI Secret 注入就行，不需要每个人在本机登录。
:::

### 第 3 步（方式 B）：用 well-known 做“统一登录 + 下发组织配置”

**为什么**  
well-known 把“拿 Token + 默认配置”集中到一个组织入口：`https://<host>/.well-known/opencode`。

::: warning ⚠️ Token 续期的边界
well-known 的 `auth.command` 只在你执行 `opencode auth login <url>` 时运行一次，并把 token 保存到本机。

后续启动 OpenCode 时，只会注入这份“已保存的 token”，不会自动刷新/续期。

如果你们的 token 很短期（比如 1 小时过期），更适合走方式 C：用插件实现刷新/签名流程。

如果受 SSO 保护的 well-known 或 `remote_config` 返回 HTML 登录页而不是 JSON，OpenCode 会把它识别为认证缺失或过期，并提示重新执行 `opencode auth login <url>`。该命令的 URL 登录路径不会先加载使用旧 token 的项目实例，因此可以直接完成重新认证。
:::

<img src="/images/5-advanced/11a-auth-wellknown-flow.mini.jpeg"
     alt="well-known 工作流"
     data-zoom-src="/images/5-advanced/11a-auth-wellknown-flow.jpeg" />

#### 3.1 准备 `/.well-known/opencode` 响应

**为什么**  
`opencode auth login <url>` 的行为完全由这个 JSON 驱动：它告诉 OpenCode 用什么命令获取 Token、把 Token 放到哪个环境变量，以及要下发哪些组织默认配置。

下面是一个最小可用的示例（你们需要在 `https://ai.company.internal/.well-known/opencode` 返回它）：

```jsonc
{
  "auth": {
    "command": ["corpctl", "ai", "token", "--format=plain"],
    "env": "COMPANY_AI_TOKEN"
  },

  // 可选：把组织配置放在独立服务中。远程 JSON 会覆盖下面同名的 config 字段
  "remote_config": {
    "url": "https://config.company.internal/opencode.json",
    "headers": {
      "Authorization": "Bearer {env:COMPANY_AI_TOKEN}"
    }
  },

  "config": {
    "$schema": "https://opencode.ai/config.json",

    // 可选：强制禁用外网 Provider（示例）
    "disabled_providers": ["openai", "anthropic", "openrouter"],

    // 配置公司内部 AI 网关（OpenAI Compatible）
    "provider": {
      "corp-gateway": {
        "name": "Company AI Gateway",
        "api": "https://ai-gateway.company.internal/v1",
        "npm": "@ai-sdk/openai-compatible",
        "options": {
          "apiKey": "{env:COMPANY_AI_TOKEN}"
        },
        "models": {
          "qwen2.5-72b": {
            "name": "Qwen 2.5 72B",
            "tool_call": true,
            "reasoning": true,
            "temperature": true,
            "limit": { "context": 128000, "output": 8192 }
          }
        }
      }
    },

    // 让团队默认就用内网模型
    "model": "corp-gateway/qwen2.5-72b"
  }
}
```

**你应该看到**：浏览器访问 `https://ai.company.internal/.well-known/opencode` 能返回上面的 JSON。

::: warning ⚠️ 关键点
- `auth.command` 必须能在开发机/容器里运行；它的 stdout 会被当成 Token。
- `auth.env` 是配置变量名。OpenCode 启动时把已保存 token 放进本次配置加载的虚拟环境映射，供 `{env:COMPANY_AI_TOKEN}` 替换使用；它不会修改当前进程或系统 shell 的 `process.env`。
:::

#### 3.2 用 `opencode auth login` 把凭据写入本机

**为什么**  
这一步会把 `type: "wellknown"` 的凭据落到本机的 `auth.json` 里。之后每次启动 OpenCode，它都会把 token 提供给配置变量替换，并拉取远程 `config` / `remote_config`。

```bash
opencode auth login https://ai.company.internal
```

**你应该看到**：终端提示类似：

- `Running \`corpctl ai token --format=plain\``
- `Logged into https://ai.company.internal`

#### 3.3 确认凭据已经存在

**为什么**  
你要先确认 OpenCode 真的保存了 well-known 凭据，避免后面“怎么配置都不生效”。

```bash
opencode auth list
```

**你应该看到**：列表里包含一条 `https://ai.company.internal wellknown`（provider 名称可能直接显示成 URL）。

#### 3.4 验证组织默认配置已生效（跑一次 `run`）

**为什么**  
最快的验证方式是：直接跑一次 `opencode run`，看它能否用你们的内网模型完成任务。

```bash
opencode run -m corp-gateway/qwen2.5-72b "用 3 句话解释这段话的要点：……"
```

**你应该看到**：能正常返回模型输出；如果失败，通常会提示认证/模型不存在/网络错误。

### 第 4 步（方式 C）：写插件对接统一认证（最灵活）

**为什么**  
当你们不是“跑命令吐 Token”，而是需要 OAuth、自动刷新、请求签名、动态改 headers/params，插件是最靠谱的落点。

::: info v1 Provider 认证与 v2 connector 的边界
当前兼容接口仍通过插件 `auth.methods` 声明 `api` 或 `oauth` 方法，`oauth` 可选择自动回调或手工输入授权码；`loader` 再把保存的凭据转换为 Provider 配置。类型定义见 [`packages/plugin/src/index.ts:88-180`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/plugin/src/index.ts#L88-L180)。

`v1.18.22` 同时提供 v2 integration connector：一个 integration 可注册 `key`、`env`、`oauth` 方法，连接层负责保存和解析凭据，并可在 OAuth 凭据临近过期时调用 `refresh`。它是 v2 插件接口，不要把 `context.integration` 示例直接混进下面的 v1 `Plugin` 骨架。接口见 [`packages/plugin/src/v2/effect/integration.ts:15-62`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/plugin/src/v2/effect/integration.ts#L15-L62)，连接与刷新流程见 [`packages/core/src/integration.ts:380-457`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/integration.ts#L380-L457)。
:::

#### 4.1 写一个认证插件骨架

把文件放到 `.opencode/plugin/corp-auth.ts`：

```ts
import type { Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = async () => {
  return {
    auth: {
      // 这里要和你配置的 provider id 一致
      provider: "corp-gateway",
      methods: [
        {
          type: "api",
          label: "Login with Company SSO",
          async authorize() {
            // 换成你们的取 token 逻辑：命令行/HTTP/本地缓存等
            const token = "<replace-me>"
            return { type: "success", key: token }
          },
        },
      ],
      async loader(getAuth) {
        const auth = await getAuth()
        if (!auth || auth.type !== "api") return {}
        return {
          apiKey: auth.key,
          // headers: { "X-Tenant": "..." },
        }
      },
    },

    // 真要改 headers/params/签名，走这些 hook 更直接
    // "chat.headers": async (_input, output) => { output.headers["X-Sign"] = "..." },
    // "chat.params": async (_input, output) => { output.options["seed"] = 1 },
  }
}

export default plugin
```

#### 4.2 让 OpenCode 加载你的插件

**推荐做法**：你把插件文件放到 `.opencode/plugin/` 目录后，OpenCode 会自动扫描并加载（不需要额外写 `opencode.json`）。

::: details 📦 我就是想写进 opencode.json
可以写相对路径，让 OpenCode 在加载配置时解析成可导入的 `file://...` URL：

```jsonc
// opencode.json
{
  "plugin": ["./.opencode/plugin/corp-auth.ts"]
}
```
:::

#### 4.3 用 `opencode auth login` 走插件登录

```bash
opencode auth login
```

**你应该看到**：

- 选择器里的 provider 来自 models.dev 列表；你的自定义 provider（比如 `corp-gateway`）通常不会出现在这里
- 所以一般做法是：先选 `Other`，再输入 provider id：`corp-gateway`，然后进入你插件 `methods` 定义的登录流程

---

## 检查点 ✅

- [ ] 方式 A：注入环境变量后，`opencode run -m corp-gateway/qwen2.5-72b ...` 能跑通
- [ ] 方式 B：`https://<host>/.well-known/opencode` 能返回 JSON，且 `opencode auth login <url>` 能成功
- [ ] 方式 C：启用插件后，`opencode auth login` 能走插件登录并保存凭据
- [ ] 团队默认模型已经指向内网 Provider（`model: "corp-gateway/..."`）

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|---|---|---|
| 登录后在另一个终端里 `echo $COMPANY_AI_TOKEN` 没有值 | well-known token 只进入配置变量替换映射，不会写入 `process.env` 或你的 `.zshrc/.bashrc` | 在 Provider 配置中使用 `options.apiKey: "{env:COMPANY_AI_TOKEN}"`；用 `opencode run -m corp-gateway/...` 验证 |
| `opencode auth login` 直接报 404/2000+ | `/.well-known/opencode` 不可达 | 先用浏览器/curl 验证 URL 可访问 |
| 提示 `Failed` / 没有 `Logged into ...` | `auth.command` 退出码非 0 | 确保命令能在当前机器运行，且 stdout 输出 Token |
| 提示远程配置返回登录页 | well-known 或 `remote_config` 位于 SSO 后，保存的 token 已缺失或过期 | 按错误提示执行 `opencode auth login <url>` 重新认证 |
| OpenCode 启动时报其他远程配置错误 | well-known / `remote_config` 不可达、返回非 JSON 或配置格式无效 | 检查远程端点和 JSON；必要时用 `opencode auth logout` 移除这条 URL 凭据再排障 |
| `opencode auth login` 找不到你们的 provider | 你们的 provider 不在 models.dev 列表 | 选 `Other`，手动输入 provider id（例如 `corp-gateway`） |
| 登录成功但配置不生效 | 只保存了 Token，没有返回 `config` | 在 well-known JSON 里补上 `config` 字段 |
| 容器里能登录，本地不行（或反过来） | 命令/证书链差异 | 确保容器和本机都装了公司根证书，并且 `auth.command` 在两边都可用 |
| 内网网关返回 401 | Token 未被 provider 读取到或已过期 | 检查 `auth.env` 名称是否一致；用第 4 步 `opencode run -m ...` 复测；必要时重新 `opencode auth login <url>` |
| 插件放进 `.opencode/plugin/` 但没生效 | 依赖准备未完成：OpenCode 会对扫描到的目录调用 `installDependencies(dir)`。目录里没有 `package.json`/`.gitignore` 才会写入；并尝试执行 `bun add @opencode-ai/plugin@<version> --exact` 与 `bun install`（两条 `bun` 命令失败会被吞；写文件没有 catch）。只有当 `<dir>/node_modules` 不存在时才会等待安装流程；如果已存在则安装会后台触发、不等待完成 | 确保能访问 npm/内网镜像；必要时手动进对应目录执行 `bun install`，或把依赖提前打进镜像/缓存（源码：`packages/opencode/src/config/config.ts` 的 `installDependencies()`） |
| 担心 well-known 不安全 | 远程 JSON 既能下发 `auth.command`（会在本机执行），也能下发 `config`（启动时会被拉取并合并；其中 `plugin` 可能触发插件安装与执行） | 把 `/.well-known/opencode` 当成“组织发配置的入口”：只部署在可信内网域名；限制访问；对返回内容做审计；非必要不要在远程 config 里下发 `plugin` |

---

## 本课小结

你学会了：

1. 环境变量：最省事，适合 K8s/CI
2. well-known：最适合团队推广，统一登录和下发默认配置
3. 认证插件：最灵活，适合 OAuth/刷新/签名/改 headers/params

---

## 下一课预告

> 下一课我们会把认证和网关能力做得更灵活：学会插件系统后，你可以写出真正“企业级”的自定义登录流程和请求改写。
>
> 下一课：**[5.12a 插件基础](./12a-plugins-basics)**。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 基准版本：OpenCode `v1.18.22`

| 功能 | 文件路径 | 行号 |
|---|---|---|
| well-known 的 `config` / `remote_config` Schema | [`packages/core/src/v1/config/config.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L22-L25) | 22-25 |
| 登录 URL：执行 `auth.command` 并保存 well-known 凭据 | [`packages/opencode/src/cli/cmd/providers.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/providers.ts#L325-L350) | 325-350 |
| `remote_config` URL 与 headers 的变量替换 | [`packages/opencode/src/config/config.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/config.ts#L64-L98) | 64-98 |
| well-known 远程配置加载及合并顺序 | [`packages/opencode/src/config/config.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/config.ts#L356-L429) | 356-429 |
| 远程配置返回登录页时提示重新认证 | [`packages/opencode/src/cli/error.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/error.ts#L97-L106) | 97-106 |
| 全局旧配置兼容与默认 `opencode.jsonc` | [`packages/opencode/src/config/config.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/config.ts#L139-L147) | 139-147 |
| 插件认证钩子 `auth` 的类型定义（`methods` / `loader`） | [`packages/plugin/src/index.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/plugin/src/index.ts#L88-L180) | 88-180 |
| v2 integration connector 的方法与连接接口 | [`packages/plugin/src/v2/effect/integration.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/plugin/src/v2/effect/integration.ts#L15-L62) | 15-62 |

**关键类型**：
- `Auth.WellKnown`：`{ type: "wellknown", key: string, token: string }`
- `AuthHook`：插件认证接口，支持 `api` / `oauth` 两种 methods

</details>
