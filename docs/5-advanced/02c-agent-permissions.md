---
title: 5.2c Agent 权限与安全
subtitle: 精确控制 Agent 能做什么
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.2c"
duration: 25 分钟
practice: 20 分钟
level: 进阶
description: 精确控制 Agent 可以做什么、不可以做什么，确保 AI 操作的安全性。
tags:
  - Agent
  - 权限
  - 安全
  - TaskTool
prerequisite:
  - 5.2a Agent 快速入门
---

# 5.2c Agent 权限与安全

> 精确控制 Agent 可以做什么、不可以做什么。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/02c-agent-permissions-notes.mini.jpeg" alt="Agent权限与安全学霸笔记" data-zoom-src="/images/5-advanced/02c-agent-permissions-notes.jpeg" />

---

## 学完你能做什么

- 理解权限系统架构
- 配置 bash/edit/task/skill 权限
- 设计安全的 Agent 系统
- 实现最小权限原则

---

## 权限系统架构

### 三种权限动作

| 动作 | 说明 | 效果 |
|------|------|------|
| `allow` | 允许 | 直接执行，无需确认 |
| `ask` | 询问 | 弹出确认框，用户决定 |
| `deny` | 禁止 | 拒绝执行，Agent 收到错误 |

### 权限配置层级

```
默认权限（源码定义）
    ↓ 覆盖
全局配置 permission
    ↓ 覆盖
Agent 级别 permission
```

**后面的覆盖前面的**。

> 来源：`packages/core/src/v1/config/permission.ts`（Schema 定义）、`packages/opencode/src/agent/agent.ts:145`（Permission.merge 调用）

### 规则优先级：最后匹配获胜

这是最重要的规则！当多个规则都匹配时，**最后一个匹配的规则生效**。

```jsonc
{
  "permission": {
    "bash": {
      "*": "ask",           // 规则 1：所有命令需确认
      "git *": "allow",     // 规则 2：git 命令允许
      "git push*": "deny"   // 规则 3：git push 禁止
    }
  }
}
```

执行 `git push origin main`：
1. 匹配规则 1（`*`）→ ask
2. 匹配规则 2（`git *`）→ allow
3. 匹配规则 3（`git push*`）→ deny
4. **最终结果：deny**（规则 3 在最后）

> 来源：`agents.mdx:473`，`permissions.mdx:70`

---

## 可配置的权限类型

| 权限 | 匹配对象 | 说明 |
|------|---------|------|
| `read` | 文件路径 | 读取文件 |
| `edit` | 文件路径 | 所有文件修改（edit/write/patch） |
| `glob` | glob 模式 | 文件搜索 |
| `grep` | 正则表达式 | 内容搜索 |
| `list` | 目录路径 | 列出目录内容 |
| `bash` | 命令字符串 | 执行 shell 命令 |
| `task` | subagent 名称 | 调用子 Agent |
| `skill` | skill 名称 | 加载技能 |
| `lsp` | - | LSP 查询（目前不支持细粒度） |
| `todowrite` | - | 待办列表读写（门控 `todowrite` 工具） |
| `webfetch` | URL | 获取网页内容 |
| `websearch` | 查询字符串 | 网页搜索 |
| `external_directory` | - | 访问项目目录之外的路径 |
| `doom_loop` | - | 检测重复调用（同一工具连续调用 3 次相同输入） |
| `question` | - | 向用户提问（默认 deny，防止 subagent 打扰用户） |
| `plan_exit` | - | 退出计划模式，切换到 build agent |

> 来源：`packages/core/src/v1/config/permission.ts:17-36`

---

## 权限配置语法

### 简单语法：单一动作

```jsonc
{
  "permission": {
    "edit": "allow",      // 所有文件编辑允许
    "bash": "ask",        // 所有命令需确认
    "webfetch": "deny"    // 禁止获取网页
  }
}
```

### 全局设置

```jsonc
{
  "permission": "allow"   // 所有权限都允许
}
```

### 对象语法：细粒度控制

```jsonc
{
  "permission": {
    "bash": {
      "*": "ask",              // 默认需确认
      "git status": "allow",   // git status 允许
      "git log*": "allow",     // git log 开头的允许
      "rm -rf*": "deny"        // rm -rf 禁止
    }
  }
}
```

### 通配符

| 符号 | 含义 | 示例 |
|------|------|------|
| `*` | 匹配任意字符（0个或多个） | `git *` 匹配 `git status`、`git log` |
| `?` | 匹配单个字符 | `file?.txt` 匹配 `file1.txt` |

---

## bash 权限详解

<AdInArticle />

bash 权限匹配的是**解析后的命令字符串**。

### 常见配置

```jsonc
{
  "permission": {
    "bash": {
      "*": "ask",                    // 默认需确认

      // Git 命令
      "git status": "allow",
      "git log*": "allow",
      "git diff*": "allow",
      "git branch*": "allow",
      "git checkout*": "ask",        // 切换分支要确认
      "git push*": "ask",            // 推送要确认
      "git reset --hard*": "deny",   // 硬重置禁止

      // 包管理
      "npm install*": "allow",
      "npm run*": "allow",
      "npm publish*": "deny",        // 发布禁止

      // 危险命令
      "rm -rf*": "deny",
      "sudo*": "deny",
      "chmod 777*": "deny"
    }
  }
}
```

### Plan Agent 的最佳实践

```jsonc
{
  "agent": {
    "plan": {
      "permission": {
        "bash": {
          "*": "deny",               // 默认禁止
          "git log*": "allow",       // 只读命令允许
          "git diff*": "allow",
          "git status": "allow",
          "ls*": "allow",
          "cat*": "allow",
          "head*": "allow",
          "tail*": "allow"
        }
      }
    }
  }
}
```

---

## edit 权限详解

edit 权限控制**所有文件修改操作**，包括：
- `edit` 工具
- `write` 工具
- `patch` 工具

### 常见配置

```jsonc
{
  "permission": {
    "edit": {
      "*": "allow",                    // 默认允许

      // 敏感文件
      "*.env": "deny",
      "*.env.*": "deny",
      "*.env.example": "allow",        // 示例文件允许
      ".env.local": "deny",

      // 系统文件
      "package-lock.json": "deny",     // 锁文件不要改
      "pnpm-lock.yaml": "deny",
      "yarn.lock": "deny",

      // 目录
      "node_modules/*": "deny",
      ".git/*": "deny",
      "dist/*": "deny"
    }
  }
}
```

### 只读 Agent 配置

```jsonc
{
  "agent": {
    "readonly-auditor": {
      "description": "只读代码审计，不修改任何文件",
      "mode": "subagent",
      "permission": {
        "edit": "deny"                 // 禁止所有编辑
      }
    }
  }
}
```

---

## task 权限：控制 subagent 调用

task 权限控制 **Agent 可以调用哪些 subagent**。

### 工作原理

当设置 `task: deny` 时：
1. 该 subagent 从 Task tool 的描述中**完全移除**
2. 模型不会尝试调用它（因为看不到）

> 注意：用户仍可通过 `@agent-name` 手动调用任何 subagent。task 权限只影响 Agent 自动调用。
> 
> 来源：`agents.mdx:557-565`

### 配置示例

```jsonc
{
  "agent": {
    "safe-orchestrator": {
      "description": "安全编排器，只能调用指定的 subagent",
      "mode": "primary",
      "permission": {
        "task": {
          "*": "deny",                   // 禁止所有
          "docs-writer": "allow",        // 允许文档
          "code-reviewer": "allow",      // 允许审查
          "dangerous-agent": "deny"      // 显式禁止
        }
      }
    }
  }
}
```

### 通配符使用

```jsonc
{
  "agent": {
    "orchestrator": {
      "permission": {
        "task": {
          "*": "deny",
          "safe-*": "allow",            // 所有 safe- 开头的允许
          "internal/*": "allow",        // 嵌套目录的允许
          "code-reviewer": "ask"        // 需要确认
        }
      }
    }
  }
}
```
 
### TaskTool 参数详解

Task 工具的完整参数定义如下：

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `description` | string | 是 | 任务描述（3-5 个词），用作子会话标题 |
| `prompt` | string | 是 | 子代理要执行的任务提示 |
| `subagent_type` | string | 是 | 要调用的子代理名称（必须是非 primary agent） |
| `task_id` | string | 否 | 继续之前的任务；传入上次返回的 `task_id` 后，会复用同一个子代理会话 |
| `command` | string | 否 | 触发此任务的命令（用于调试） |
| `background` | boolean | 否 | 在后台运行；需启用 `OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true` |

### 执行流程

TaskTool 的工作流程如下：

```
主 Agent (Build)
    ↓
    1. 权限检查
       - 检查调用者是否有 task 权限
       - 过滤可访问的 subagent
       ↓
     2. 创建子会话
        - 在主会话下创建独立 session
        - 标题：描述 + (@subagent subagent)
        - 使用子代理自己的权限，并继承父会话 deny 与 external_directory 规则
       ↓
    3. 调用子代理
       - 子代理在独立 session 中执行
       - 上下文仅包含传入的 prompt
       - 监听 PartUpdated 事件获取进度
       ↓
    4. 返回结果
       - 收集所有工具调用摘要
       - 生成对话摘要
       - 返回给主 Agent
```

> **关键点**：子代理运行在**独立的 Session** 中，看不到主 Agent 的对话历史。调用时必须提供完整上下文。

### 后台执行与嵌套深度

后台子代理仍是实验功能。启用后，Task tool 可传 `background: true`；TUI 也可以把当前阻塞会话的同步子代理转到后台，完成结果会自动通知父会话，不应轮询进度。

```bash
export OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true
```

子代理嵌套深度由顶层 `subagent_depth` 控制，默认是 `1`，即默认不允许子代理继续创建子代理。需要嵌套时，应同时提高深度并在对应子代理自己的权限中显式配置 `task`：

```jsonc
{
  "subagent_depth": 2
}
```

> 来源：[`runtime-flags.ts:43`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/effect/runtime-flags.ts#L43)、[`task.ts:43-61`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/task.ts#L43-L61)、[`task.ts:96-117`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/task.ts#L96-L117)、[`config.ts:84-86`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L84-L86)

### 实际使用示例

#### 配置允许调用特定子代理

```jsonc
{
  "agent": {
    "orchestrator": {
      "description": "任务编排 Agent，可调用专门子代理",
      "mode": "primary",
      "permission": {
        "task": {
          "docs-writer": "allow",      // 允许文档写作
          "code-reviewer": "allow",    // 允许代码审查
          "general": "allow",           // 允许通用任务
          "*": "deny"                 // 其他禁止
        }
      }
    }
  }
}
```

#### Agent 内部调用 TaskTool

```markdown
# 伪代码示例
主 Agent 收到：帮我写 API 文档

1. 分析任务类型 → 确定需要 docs-writer 子代理
2. 调用 TaskTool：
   - description: "编写 API 文档"
   - prompt: "为以下函数编写文档..."
   - subagent_type: "docs-writer"
3. 子代理执行 → 返回文档内容
4. 主 Agent 接收结果 → 继续对话
```

#### 继续任务

当子代理需要分步执行时，可以传递上次返回的 `task_id` 继续之前的工作：

```
TaskTool(
  description: "完善文档",
  prompt: "检查文档完整性并补充缺失内容",
  subagent_type: "docs-writer",
  task_id: "abc123"  // 继续之前的任务
)
```

> **来源**：[`packages/opencode/src/tool/task.ts:43-172`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/task.ts#L43-L172)

---

## skill 权限：控制技能加载

skill 权限控制 Agent 可以加载哪些技能。

### 配置示例

```jsonc
{
  "agent": {
    "restricted-agent": {
      "description": "受限 Agent，只能使用指定技能",
      "mode": "subagent",
      "permission": {
        "skill": {
          "*": "deny",                   // 禁止所有技能
          "docs-writer": "allow",        // 只允许文档技能
          "translator": "allow"
        }
      }
    }
  }
}
```

> 来源：`skill.ts:15-21`

---

## 内置安全规则

OpenCode 默认配置了一些安全规则：

### .env 文件保护

```jsonc
// 内置默认配置
{
  "permission": {
    "read": {
      "*": "allow",
      "*.env": "ask",           // .env 文件需确认（安全考虑）
      "*.env.*": "ask",         // .env.xxx 也需确认
      "*.env.example": "allow"  // 示例文件允许
    }
  }
}
```

> 来源：`agent.ts:130-135`

### doom_loop 检测

当同一工具被连续调用 3 次，且输入完全相同时，触发 doom_loop 检测。

```jsonc
{
  "permission": {
    "doom_loop": "ask"    // 默认值：提示用户确认
  }
}
```

### question 权限

控制 Agent 是否能使用 question 工具向用户提问。

| 默认值 | 说明 |
|--------|------|
| subagent: `deny` | 防止 subagent 随意打扰用户 |
| build agent: `allow` | 主 Agent 可以提问 |

**使用场景**：当你需要 subagent 在遇到不确定时向你确认，可以设为 `allow`。

```jsonc
{
  "agent": {
    "interactive-helper": {
      "permission": {
        "question": "allow"    // 允许这个 subagent 提问
      }
    }
  }
}
```

> 来源：`agent.ts:126`、`question.ts`

### external_directory 保护

当 Agent 尝试访问项目目录之外的路径时：

```jsonc
{
  "permission": {
    "external_directory": "ask"    // 默认值：提示用户确认
  }
}
```

### plan_enter / plan_exit 权限

控制 Agent 是否能切换计划模式：

- **`plan_enter`**：进入计划模式（保留为权限键，但源码中无对应工具实现；用户通过 Tab 键切换到 plan agent 进入）
- **`plan_exit`**：退出计划模式，切换到 build agent（有 `PlanExitTool` 工具实现）

目标版本没有 `plan_enter` 工具，所以保留同名权限键也不能让 Build Agent 主动切换。Plan Agent 的 `plan_exit` 用于请求回到 Build，并按正常权限规则求值。

```jsonc
{
  "agent": {
    "plan": {
      "permission": {
        "plan_exit": "allow"      // 允许 Plan Agent 请求回到 Build
      }
    }
  }
}
```

> 来源：[`plan.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/plan.ts#L13-L79)、[`registry.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/registry.ts#L215-L248)

### 废弃字段：tools

⚠️ **`tools` 字段已废弃**，请使用 `permission` 字段代替。

**旧写法（已废弃）**：

```jsonc
{
  "agent": {
    "my-agent": {
      "tools": {
        "bash": false,      // 禁用 bash
        "edit": true        // 允许编辑
      }
    }
  }
}
```

**新写法**：

```jsonc
{
  "agent": {
    "my-agent": {
      "permission": {
        "bash": "deny",     // 禁用 bash
        "edit": "allow"     // 允许编辑
      }
    }
  }
}
```

**迁移说明**：
- `tools` 中的 `write`/`edit`/`patch` 映射到 `edit` 权限
- 其他旧工具名可能被转换为同名 permission 键，但目标版本没有对应工具时不会产生可调用能力
- `true` → `"allow"`，`false` → `"deny"`
- 系统会自动转换旧配置，但建议手动更新

> 来源：`packages/core/src/v1/config/agent.ts:71-76`

### 子代理权限继承

通过 Task tool 创建子会话时，能力以**子代理自己的权限**为基础，不会继承父 Agent 的 `allow` / `ask`。为避免子代理绕过父会话的安全边界，还会继承父会话的所有 `deny` 规则和全部 `external_directory` 规则。

此外还有两项默认拒绝：

- 如果子代理自己的规则没有配置 `todowrite`，自动追加 `todowrite: deny`。
- 如果子代理自己的规则没有配置 `task`，自动追加 `task: deny`。

这两项不是不可覆盖的硬编码禁用。显式配置对应权限后仍需满足 `subagent_depth`。配置在 `experimental.primary_tools` 中的工具则会继续对 Task 子会话追加 deny。

> 来源：[`subagent-permissions.ts:4-26`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/agent/subagent-permissions.ts#L4-L26)、[`task.ts:139-170`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/tool/task.ts#L139-L170)

---

## Agent 级别权限覆盖

在 Agent 配置中设置的权限会**覆盖**全局权限。

### JSON 配置

```jsonc
{
  "permission": {
    "bash": {
      "*": "ask",
      "git status": "allow"
    }
  },
  "agent": {
    "build": {
      "permission": {
        "bash": {
          "git push": "allow"       // build agent 额外允许 push
        }
      }
    },
    "plan": {
      "permission": {
        "bash": {
          "*": "deny",              // plan agent 禁止所有命令
          "git log*": "allow"       // 除了查看日志
        }
      }
    }
  }
}
```

### Markdown 配置

```markdown
---
description: 只读审计 Agent
mode: subagent
permission:
  edit: deny
  bash:
    "*": deny
    "git log*": allow
    "git diff*": allow
  webfetch: deny
---

只分析代码，不做任何修改。
```

---

## 安全最佳实践

### 1. 最小权限原则

只授予 Agent 完成任务所需的最小权限。

```jsonc
// ❌ 不好：过于宽松
{
  "agent": {
    "my-agent": {
      "permission": "allow"
    }
  }
}

// ✅ 好：明确列出需要的权限
{
  "agent": {
    "my-agent": {
      "permission": {
        "read": "allow",
        "edit": {
          "docs/*": "allow"
        },
        "bash": "deny"
      }
    }
  }
}
```

### 2. 显式列出允许的命令

```jsonc
// ❌ 不好：允许所有，然后禁止危险的
{
  "permission": {
    "bash": {
      "*": "allow",
      "rm -rf*": "deny"
    }
  }
}

// ✅ 好：禁止所有，然后允许需要的
{
  "permission": {
    "bash": {
      "*": "deny",
      "git status": "allow",
      "npm test": "allow"
    }
  }
}
```

### 3. 敏感操作设为 ask

```jsonc
{
  "permission": {
    "bash": {
      "*": "allow",
      "git push*": "ask",        // 推送需确认
      "npm publish*": "ask",     // 发布需确认
      "docker *": "ask"          // Docker 操作需确认
    }
  }
}
```

### 4. 定期审查权限配置

检查清单：
- [ ] 是否有不再需要的权限？
- [ ] 敏感操作是否都设为 ask？
- [ ] 新增的 Agent 权限是否合理？

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 权限不生效 | 规则顺序错误 | `*` 放最前面，具体规则放后面 |
| subagent 仍能被调用 | 用户 @ 调用不受限 | task 权限只影响 Task tool |
| bash 命令匹配失败 | 匹配的是解析后的命令 | 检查实际命令格式（含参数） |
| .env 无需确认就读取 | 自定义规则覆盖了默认 | 如需保护，设为 .env ask |
| 权限太严格 | 设了 `*: deny` 忘了允许必要的 | 逐条添加允许规则 |

---

## 与 5.5 权限管控的关系

本章专注于 **Agent 级别的权限配置**。

全局权限配置和更多细节，请参考 [5.5 权限管控](./05-permissions)。

---

## 本课小结

你学会了：

1. **权限系统架构**：三种动作、配置层级、最后匹配获胜
2. **常用权限类型**：bash、edit、task、skill、question、plan_exit 等
3. **细粒度控制**：使用对象语法和通配符
4. **TaskTool 机制**：子代理调用、参数定义、执行流程
5. **子代理边界**：使用自身权限，继承父会话 deny / external_directory，并受默认深度限制
6. **内置安全规则**：.env 保护、doom_loop、external_directory
7. **安全最佳实践**：最小权限、显式允许、敏感操作 ask

---

## 下一课预告

> 配置好权限，还有更多高级技巧：工具接口设计、透传参数、调试方法。

**下一课**：[5.2d Agent 高级技巧](./02d-agent-advanced)
