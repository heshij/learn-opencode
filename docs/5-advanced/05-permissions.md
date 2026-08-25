---
title: 5.5 权限管控
subtitle: 安全策略配置
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.5"
duration: 15 分钟
level: 进阶
description: 配置权限策略控制 AI 能做什么、不能做什么，确保操作安全。包括外部目录访问控制。
tags:
  - 权限
  - 安全
  - external_directory
prerequisite:
  - 5.1 配置全解
---

# 5.5 权限管控

> 💡 **一句话总结**：通过权限配置控制 AI 能做什么、不能做什么。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/05-permissions-notes.mini.jpeg" alt="权限管控学霸笔记" data-zoom-src="/images/5-advanced/05-permissions-notes.jpeg" />

---

## 学完你能做什么

- 理解三种权限模式
- 配置全局权限
- 配置细粒度规则
- 配置 Agent 级权限
- 理解 Bash 命令如何被匹配
- 配置外部目录访问权限（`external_directory`）

---

## 你现在的困境

- 担心 AI 执行危险命令
- 每次写文件都要确认，太麻烦
- 想限制某些 Agent 的能力
- AI 访问项目外的文件时总是弹出确认框

---

## 什么时候用这一招

- 当你需要：精细控制 AI 能做什么
- 而且不想：让 AI 有太大的自由度

---

## 权限模式

| 模式 | 说明 |
|-----|------|
| `allow` | 允许执行，不询问 |
| `ask` | 每次询问用户确认 |
| `deny` | 禁止执行 |

---

## 自动批准模式的边界

标准 TUI 和非交互 `run` 都公开提供 `--auto`：

```bash
# 标准 TUI
opencode --auto

# 非交互任务
opencode run --auto "运行测试并修复失败项"
```

它只会自动批准原本会进入 `ask` 流程的权限请求，**不会覆盖显式 `deny` 规则**。例如配置了 `"rm *": "deny"` 后，即使使用 `--auto`，匹配的删除命令仍会被拒绝。

目标版本还接受隐藏的 `--yolo` 作为兼容别名，并将它与 `--auto` 映射到同一自动批准行为；新命令和脚本应使用公开参数 `--auto`。这个开关适用于标准 TUI 与 `opencode run`，`opencode --mini` 入口不会转发它。

> **源码（v1.18.22）**：[`tui.ts:108-121`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/tui.ts#L108-L121)、[`tui.ts:287-295`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/tui.ts#L287-L295)、[`run.ts:242-274`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/run.ts#L242-L274)

---

## 全局权限配置

在 `opencode.json` 中使用 `permission`（注意是**单数**）：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "*": "ask",          // 默认所有操作需确认
    "bash": "allow",     // Bash 命令自动放行
    "edit": "deny"       // 禁止编辑文件
  }
}
```

一次性设置所有权限：

```jsonc
{
  "permission": "allow"  // 所有操作自动放行
}
```

---

## 细粒度规则（对象语法）

可以根据工具输入应用不同的操作：

```jsonc
{
  "permission": {
    "bash": {
      "*": "ask",                    // 默认需确认
      "git *": "allow",              // git 命令放行
      "npm *": "allow",              // npm 命令放行
      "rm *": "deny"                 // 禁止 rm 命令
    },
    "edit": {
      "*": "deny",                   // 默认禁止编辑
      "packages/web/src/content/docs/*.mdx": "allow"  // 只允许编辑文档
    }
  }
}
```

**规则优先级**：按模式匹配求值，**最后匹配的规则生效**。

常见模式是把通配符 `"*"` 规则放在前面，更具体的规则放在后面。

---

## 通配符

- `*` 匹配零个或多个任意字符
- `?` 匹配正好一个字符
- 其他字符按字面匹配

---

## 可用权限列表

<AdInArticle />

### 支持细粒度规则的权限

这些权限可以使用对象语法配置不同模式的规则：

| 权限 | 描述 | 匹配内容 |
|------|------|---------|
| `read` | 读取文件 | 文件路径 |
| `edit` | 文件修改权限（涵盖 edit、write 和 patch） | 文件路径 |
| `glob` | 文件通配符搜索 | glob 模式 |
| `grep` | 内容搜索 | 正则表达式模式 |
| `list` | 列出目录文件 | 目录路径 |
| `bash` | 运行 shell 命令 | 解析后的命令前缀 |
| `task` | 启动子代理 | 子代理名称 |
| `skill` | 加载技能 | 技能名称 |
| `lsp` | 运行 LSP 查询 | 支持细粒度匹配 |
| `external_directory` | 访问项目外路径 | 目录路径 |

> 📝 注：目标版本没有 `multiedit` 工具；文件创建、编辑和补丁操作统一受 `edit` 权限控制。

### 仅支持简单语法的权限

这些权限只能设置为 `allow`/`ask`/`deny`，不支持对象语法：

| 权限 | 描述 |
|------|------|
| `todowrite` | 更新待办列表 |
| `webfetch` | 获取 URL 内容（运行时会传递 URL 用于 always 批准） |
| `websearch` | 网页搜索（运行时会传递查询用于 always 批准） |
| `doom_loop` | 相同工具调用重复 3 次时触发 |

> ⚠️ 注意：目标版本没有 `plan_enter` 工具实现；配置同名权限键不会产生可调用动作。实验性 `plan_exit` 工具存在，出现时会按正常权限规则求值，用户规则可以覆盖内置默认值。

> **来源**：`opencode/packages/opencode/src/config/config.ts:621-652`

---

## 默认值

- 大多数权限默认为 `"allow"`
- `doom_loop` 和 `external_directory` 默认为 `"ask"`
- `.env` 文件默认需询问（`ask`），非直接拒绝：

```jsonc
{
  "permission": {
    "read": {
      "*": "allow",
      "*.env": "ask",
      "*.env.*": "ask",
      "*.env.example": "allow"  // 示例文件允许读取
    }
  }
}
```

> **来源**：`opencode/packages/opencode/src/agent/agent.ts:46-57`

---

## Agent 权限矩阵

OpenCode 内置四种主要 Agent，每种有不同的默认权限：

| 工具/权限 | build | plan | general | explore |
|----------|-------|------|---------|---------|
| 文件读取 | ✅ | ✅ | ✅ | ✅ |
| 文件编辑 | ✅ | ❌（仅项目或全局计划文件允许） | ✅ | ❌ |
| Shell 命令 | ✅ | ✅ | ✅ | ✅ |
| 网页搜索/获取 | ✅ | ✅ | ✅ | ✅ |
| 代码搜索 | ✅ | ✅ | ✅ | ✅ |
| TODO 管理 | ✅ | ✅ | ❌ | ❌ |
| 提问工具 | ✅ | ✅ | ❌ | ❌ |
| `plan_exit` | ❌ | ✅ | ❌ | ❌ |
| 外部目录访问 | ⚠️（默认 ask） | ⚠️（默认 ask；另允许全局 plans 目录） | ⚠️（默认 ask） | ⚠️（默认 ask；继承通用白名单） |

::: details 📝 注：外部目录权限说明
所有 Agent 访问外部目录默认都需要用户确认（ask），并继承临时截断目录、临时目录、Skill 与 Reference 目录等通用白名单。部分 Agent 还有例外：
- **build**：默认 ask
- **plan**：默认 ask，另允许访问全局数据目录中的 `plans/*`；项目 `.opencode/plans/*.md` 属于 edit 白名单，不是外部目录例外
- **general**：默认 ask
- **explore**：默认 ask，继承截断输出、临时目录、Skill 与 Reference 目录等通用白名单
:::

::: details 📝 注：各 Agent 详细说明

### Build Agent（默认）
- **模式**：`primary`
- **权限**：全部允许
- **用途**：默认开发 Agent，所有工具可用

### Plan Agent
- **模式**：`primary`
- **权限**：edit 默认禁止，仅允许编辑项目或全局计划文件
- **用途**：只读规划，不修改代码，确保分析阶段专注思考

### General Agent
- **模式**：`subagent`
- **权限**：默认禁止 `todowrite` 和 `question`
- **用途**：通用研究，多步任务

### Explore Agent
- **模式**：`subagent`
- **权限**：默认禁止所有工具（`"*": "deny"`），只放行用于探索的读取、搜索和 shell 能力
- **用途**：快速代码探索

:::

> **来源**：`opencode/packages/opencode/src/agent/agent.ts:92-155`

---

## Plan 模式特殊规则

当 AI 尝试访问**项目工作目录之外**的文件时，会触发 `external_directory` 权限检查。

### 触发场景

以下工具在访问项目外路径时会触发此权限：

| 工具 | 触发条件 |
|------|---------|
| `read` | 读取项目外的文件 |
| `edit` | 编辑项目外的文件 |
| `write` | 写入项目外的文件 |
| `patch` | 修补项目外的文件 |
| `bash` | 命令涉及项目外路径（如 `cd ..`、`rm /tmp/file`） |

### 检测逻辑

OpenCode 使用相对路径判断文件是否在项目内：

```typescript
// 来源：opencode/packages/opencode/src/util/filesystem.ts:25-27
export function contains(parent: string, child: string) {
  return !relative(parent, child).startsWith("..")
}
```

如果相对路径以 `..` 开头，说明文件在项目目录之外。

### 默认行为

```jsonc
{
  "permission": {
    "external_directory": "ask"  // 默认值：对白名单之外的外部路径询问用户确认
  }
}
```

### 常用配置：允许访问外部文件夹

如果你希望 OpenCode 访问外部文件夹时**不需要每次授权**，添加以下配置：

```jsonc
// opencode.json
{
  "permission": {
    "external_directory": "allow"
  }
}
```

这是最常用的配置之一，特别适合以下场景：
- 需要频繁访问 `~/.config/` 等配置目录
- 项目依赖其他目录的文件
- 使用 monorepo 但只在子目录启动 OpenCode

### 细粒度控制（按路径）

`external_directory` 支持对象语法，可以按路径配置：

```jsonc
{
  "permission": {
    "external_directory": {
      "*": "ask",                    // 默认需确认
      "/tmp/*": "allow",             // /tmp 目录允许
      "/home/user/shared/*": "allow", // 共享目录允许
      "/etc/*": "deny"               // 系统配置禁止
    }
  }
}
```

### 配置方式汇总

| 方式 | 配置位置 | 示例 |
|------|---------|------|
| 全局配置 | `~/.config/opencode/opencode.json` | `"external_directory": "allow"` |
| 项目配置 | `项目根目录/opencode.json` | `"external_directory": "allow"` |
| 环境变量 | `OPENCODE_PERMISSION` | `export OPENCODE_PERMISSION='{"external_directory": "allow"}'` |
| Agent 级别 | `agent.xxx.permission` | 见下方示例 |

### Agent 级别配置

```jsonc
{
  "agent": {
    "file-manager": {
      "description": "文件管理 Agent，可访问外部目录",
      "permission": {
        "external_directory": "allow"
      }
    },
    "safe-agent": {
      "description": "安全 Agent，禁止访问外部目录",
      "permission": {
        "external_directory": "deny"
      }
    }
  }
}
```

---

## Bash 命令如何被匹配

OpenCode 会将 Bash 命令解析为**可读的命令前缀**再进行匹配。解析规则基于命令的"arity"（参数数量）。

### 解析示例

| 输入命令 | 解析后的匹配模式 |
|---------|----------------|
| `git checkout main` | `git checkout` |
| `npm install` | `npm install` |
| `npm run dev` | `npm run dev` |
| `docker compose up` | `docker compose up` |
| `rm -rf node_modules` | `rm` |

### 常见命令 Arity

| 命令前缀 | Arity | 说明 |
|---------|-------|------|
| `git` | 2 | 匹配 `git <子命令>` |
| `npm` | 2 | 匹配 `npm <子命令>` |
| `npm run` | 3 | 匹配 `npm run <脚本名>` |
| `docker` | 2 | 匹配 `docker <子命令>` |
| `docker compose` | 3 | 匹配 `docker compose <子命令>` |
| `rm` | 1 | 只匹配 `rm` |

> **来源**：`opencode/packages/opencode/src/permission/arity.ts`

### 实用配置示例

```jsonc
{
  "permission": {
    "bash": {
      "*": "ask",
      "git status": "allow",
      "git diff": "allow",
      "git log*": "allow",
      "npm run*": "allow",
      "rm*": "deny"           // 禁止所有删除操作
    }
  }
}
```

---

## Ask 的行为

当 OpenCode 提示批准时，提供三种选项：

| 选项 | 行为 |
|------|------|
| `once` | 仅批准此次请求 |
| `always` | 批准匹配**建议模式**的未来请求（当前会话） |
| `reject` | 拒绝请求 |

### `always` 如何工作

选择 `always` 时，OpenCode 会使用**工具建议的安全模式**来批准后续请求。

例如，批准 `git status --porcelain` 时，建议的模式可能是 `git status*`，这样后续所有 `git status` 相关命令都会自动放行。

### 拒绝时的反馈

用户拒绝时，可以选择：
- **直接拒绝**：AI 收到"用户拒绝了此工具调用"，会尝试其他方法
- **附带反馈**：可以告诉 AI 为什么拒绝，引导它调整方向

---

## Agent 级权限

可以按代理覆盖权限，代理规则**优先于**全局配置：

```jsonc
{
  "permission": {
    "bash": {
      "*": "ask",
      "git status": "allow"
    }
  },
  "agent": {
    "deploy": {
      "permission": {
        "bash": {
          "*": "ask",
          "git status": "allow",
          "git push": "allow"     // 仅 deploy agent 可以 push
        }
      }
    }
  }
}
```

### Markdown Agent 配置

在 Markdown 代理中配置权限：

```markdown
---
description: 只读代码审查
mode: subagent
permission:
  edit: deny
  bash: ask
  webfetch: deny
---

只分析代码并建议更改，不执行任何修改。
```

> **注意**：Agent 权限会与全局权限**合并**，Agent 中的规则优先。

---

## 废弃配置迁移

自 v1.1.1 起，旧的 `tools` 配置已被废弃，迁移到 `permission`：

```jsonc
// ❌ 旧语法（已废弃，但仍向后兼容）
{
  "tools": {
    "bash": true,
    "edit": false
  }
}

// ✅ 新语法
{
  "permission": {
    "bash": "allow",
    "edit": "deny"
  }
}
```

> 旧配置仍然可用，OpenCode 会自动转换为新格式。

---

## 安全最佳实践

### 1. 保护敏感文件

```jsonc
{
  "permission": {
    "read": {
      "*": "allow",
      "*.env": "deny",
      "*.env.*": "deny",
      "*.key": "deny",
      "*.pem": "deny",
      "credentials/*": "deny"
    }
  }
}
```

::: tip .env 文件保护
OpenCode 默认保护所有 `.env` 和 `.env.*` 文件，但允许直接访问 `.env.example`（示例文件不含敏感信息）。
:::

### 2. 限制危险命令

```jsonc
{
  "permission": {
    "bash": {
      "*": "ask",
      "git *": "allow",
      "npm *": "allow",
      "rm -rf *": "deny",
      "sudo *": "ask",
      "chmod *": "ask"
    }
  }
}
```

### 3. 企业环境配置

在全局配置文件 `~/.config/opencode/opencode.json` 中配置严格权限：

```jsonc
{
  "permission": {
    "external_directory": "deny",
    "bash": "ask",
    "websearch": "deny",
    "webfetch": "deny"
  }
}
```

### 4. 开发环境配置

在项目 `.opencode/opencode.json` 中配置宽松权限：

```jsonc
{
  "permission": {
    "read": {
      "*": "allow"
    },
    "edit": {
      "src/*": "allow",
      "test/*": "allow",
      "*.md": "allow"
    },
    "external_directory": "allow"
  }
}
```

---

## 权限问题排查

### 问题：操作被意外拒绝

1. 检查是否在 Plan 模式（Plan 模式禁止编辑源代码）
2. 检查 `opencode.json` 中的权限配置
3. 检查是否触发了文件模式匹配（检查 .env 等敏感文件规则）

### 问题：频繁弹出确认框

1. 使用「始终允许」减少重复确认
2. 在配置中添加 `allow` 规则覆盖默认
3. 使用通配符匹配一类操作

### 问题：权限配置不生效

1. 检查 JSON 语法是否正确
2. 确认配置文件路径（项目 vs 全局）
3. 确保使用 `permission`（单数）而非 `permissions`（复数）
4. 重启 OpenCode 使配置生效

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 权限配置不生效 | 用了 `permissions`（复数） | 用 `permission`（单数） |
| 命令被意外拦截 | 规则顺序问题 | **最后匹配的规则生效**，把 `*` 放最前面 |
| 无法读取 .env | 默认被拒绝 | 显式添加 allow 规则 |
| `todowrite: {...}` 报错 | 只支持简单语法 | 改为 `todowrite: "allow"` |
| `git push` 被匹配为 `git` | 没有配置完整命令 | 配置 `"git push": "allow"` |
| Agent 权限不生效 | 嵌套层级错误 | 确保在 `agent.名称.permission` 下 |
| 访问外部文件总是弹确认 | `external_directory` 默认 `ask` | 设置 `"external_directory": "allow"` |
| 想禁止访问某些外部路径 | 需要细粒度控制 | 使用对象语法按路径配置 |

---

## 本课小结

你学会了：

1. 三种权限模式（allow/ask/deny）
2. 使用 `permission` 配置（单数）
3. 区分支持对象语法和简单语法的权限
4. **常用权限字段列表**（read, edit, glob, grep, list, bash, task, skill, lsp, external_directory, todowrite, webfetch, websearch, doom_loop, question）
   - 注：`write` 和 `patch` 操作使用 `edit` 权限
5. **四种内置 Agent 的权限矩阵**（build/plan/general/explore）
6. Bash 命令的 Arity 解析机制
7. `always` 的模式匹配行为
8. Agent 级权限覆盖
9. **外部目录访问权限**（`external_directory`）的配置方法
10. **安全最佳实践**（保护敏感文件、限制危险命令、企业/开发环境配置）
11. **权限问题排查**（操作被拒绝、频繁弹确认框、配置不生效）

---

## 相关资源

- [5.2 自定义 Agent](./02a-agent-quickstart) - Agent 配置
- [5.1a 配置基础](./01a-config-basics) - 配置文件入门

---

## 下一课预告

> 下一课我们将学习主题与快捷键定制。
