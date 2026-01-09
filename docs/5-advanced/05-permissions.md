---
title: 5.5 权限管控
subtitle: 安全策略配置
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.5"
duration: 12 分钟
level: 进阶
description: 配置权限策略控制 AI 能做什么、不能做什么，确保操作安全。
tags:
  - 权限
  - 安全
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

---

## 你现在的困境

- 担心 AI 执行危险命令
- 每次写文件都要确认，太麻烦
- 想限制某些 Agent 的能力

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

### 支持细粒度规则的权限

这些权限可以使用对象语法配置不同模式的规则：

| 权限 | 描述 | 匹配内容 |
|------|------|---------|
| `read` | 读取文件 | 文件路径 |
| `edit` | 所有文件修改（涵盖 edit, write, patch, **multiedit**） | 文件路径 |
| `glob` | 文件通配符搜索 | glob 模式 |
| `grep` | 内容搜索 | 正则表达式模式 |
| `list` | 列出目录文件 | 目录路径 |
| `bash` | 运行 shell 命令 | 解析后的命令前缀 |
| `task` | 启动子代理 | 子代理类型 |
| `skill` | 加载技能 | 技能名称 |
| `lsp` | 运行 LSP 查询 | 当前**不支持**细粒度匹配 |
| `external_directory` | 访问项目外路径 | 路径 |

### 仅支持简单语法的权限

这些权限只能设置为 `allow`/`ask`/`deny`，不支持对象语法：

| 权限 | 描述 |
|------|------|
| `todoread` | 读取待办列表 |
| `todowrite` | 更新待办列表 |
| `webfetch` | 获取 URL 内容 |
| `websearch` | 网页搜索 |
| `codesearch` | 代码搜索 |
| `doom_loop` | 相同工具调用重复 3 次时触发 |

---

## 默认值

- 大多数权限默认为 `"allow"`
- `doom_loop` 和 `external_directory` 默认为 `"ask"`
- `.env` 文件默认被拒绝读取：

```jsonc
{
  "permission": {
    "read": {
      "*": "allow",
      "*.env": "deny",
      "*.env.*": "deny",
      "*.env.example": "allow"  // 示例文件允许读取
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

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 权限配置不生效 | 用了 `permissions`（复数） | 用 `permission`（单数） |
| 命令被意外拦截 | 规则顺序问题 | **最后匹配的规则生效**，把 `*` 放最前面 |
| 无法读取 .env | 默认被拒绝 | 显式添加 allow 规则 |
| `todowrite: {...}` 报错 | 只支持简单语法 | 改为 `todowrite: "allow"` |
| `git push` 被匹配为 `git` | 没有配置完整命令 | 配置 `"git push": "allow"` |
| Agent 权限不生效 | 嵌套层级错误 | 确保在 `agent.名称.permission` 下 |
| lsp 权限无法细粒度 | 当前版本不支持 | 只能设置 `lsp: "allow/ask/deny"` |

---

## 本课小结

你学会了：

1. 三种权限模式（allow/ask/deny）
2. 使用 `permission` 配置（单数）
3. 区分支持对象语法和简单语法的权限
4. Bash 命令的 Arity 解析机制
5. `always` 的模式匹配行为
6. Agent 级权限覆盖

---

## 相关资源

- [5.2 自定义 Agent](./02a-agent-quickstart) - Agent 配置
- [5.1a 配置基础](./01a-config-basics) - 配置文件入门

---

## 下一课预告

> 下一课我们将学习主题与快捷键定制。
