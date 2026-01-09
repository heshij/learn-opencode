---
title: 5.2d Agent 高级技巧
subtitle: 工具接口设计、透传参数与调试
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.2d"
duration: 20 分钟
practice: 20 分钟
level: 进阶
description: 学习工具接口设计、ACI 透传参数、Agent 调试等高级技巧，打造更强大的自定义 Agent。
tags:
  - Agent
  - ACI
  - 调试
prerequisite:
  - 5.2a Agent 快速入门
  - 5.2c Agent 权限与安全
---

# 5.2d Agent 高级技巧

> 工具接口设计、Prompt 工程、透传参数与调试方法。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/02d-agent-advanced-notes.mini.jpeg" alt="Agent高级技巧学霸笔记" data-zoom-src="/images/5-advanced/02d-agent-advanced-notes.jpeg" />

---

## 学完你能做什么

- 设计优秀的工具接口（ACI）
- 编写高质量的 Agent Prompt
- 使用透传参数微调 Agent 行为
- 排查和调试 Agent 问题

---

## 工具接口设计（ACI）

> "像设计人机界面（HCI）一样投入精力设计 Agent-计算机界面（ACI）。" —— Anthropic

ACI（Agent-Computer Interface）是 Agent 与工具交互的接口。设计得好，Agent 能高效完成任务；设计得差，Agent 会频繁出错。

### 核心原则

#### 1. 给模型思考空间

避免设计会把 LLM "逼入死角"的格式。

```markdown
<!-- ❌ 不好：需要先知道行数才能写 -->
请输出：
- 第 1-5 行：导入语句
- 第 6-20 行：函数定义
- ...

<!-- ✅ 好：自然语言描述 -->
按以下结构组织代码：
1. 导入语句
2. 常量定义
3. 函数定义
4. 主逻辑
```

#### 2. 格式接近自然语言

模型在互联网上见过的格式更容易生成。

```markdown
<!-- ❌ 不好：需要精确的 JSON 转义 -->
输出格式：{"code": "function foo() {\n  return \"bar\";\n}"}

<!-- ✅ 好：Markdown 代码块（模型见过无数次） -->
输出格式：
```javascript
function foo() {
  return "bar";
}
```
```

#### 3. 描述要像优秀的 docstring

工具描述应该包含：
- **功能说明**：这个工具做什么
- **使用示例**：典型用法
- **边界情况**：什么时候不该用
- **输入格式**：参数要求

### Anthropic 的实际经验

> "在构建 SWE-bench Agent 时，我们花在优化工具上的时间比优化整体 prompt 还多。"

他们发现模型会在使用相对路径时出错（当 Agent 移出根目录后）。解决方案：改为要求**绝对路径**——模型完美执行。

**启示**：如果 Agent 频繁在某个工具上出错，问题可能在工具设计，而非 prompt。

---

## Prompt 工程

### 系统提示词结构

一个好的 Agent prompt 应该包含：

```markdown
---
description: 简短描述（影响自动选择）
mode: subagent
temperature: 0.2
---

# 角色定义
你是谁、擅长什么。

# 工作流程
1. 第一步做什么
2. 第二步做什么
3. ...

# 约束条件
- 不要做什么
- 什么情况下停止

# 输出格式
- 如何组织输出
- 包含哪些部分

# 自我检查（可选）
完成前问自己几个问题。
```

### 完整示例

```markdown
---
description: 安全审计专家，专注 OWASP Top 10 漏洞检测
mode: subagent
temperature: 0.1
steps: 30
permission:
  edit: deny
---

# 角色

你是安全审计专家，专注于发现 Web 应用中的安全漏洞。

主要检测：
- SQL 注入
- XSS（跨站脚本）
- CSRF（跨站请求伪造）
- 认证/授权问题
- 敏感数据泄露
- 依赖漏洞

# 工作流程

## 1. 信息收集
- 了解项目技术栈
- 识别入口点（API、表单、URL 参数）
- 查看认证机制

## 2. 漏洞扫描
按 OWASP Top 10 逐项检查：
1. 注入漏洞
2. 认证失效
3. 敏感数据暴露
4. XML 外部实体
5. 访问控制失效
6. 安全配置错误
7. XSS
8. 不安全的反序列化
9. 使用含有已知漏洞的组件
10. 日志记录和监控不足

## 3. 验证发现
- 确认漏洞可利用
- 评估影响程度
- 排除误报

# 输出格式

对每个发现的问题：

## 🔴 [严重程度] 问题标题

**位置**：文件路径:行号

**描述**：问题是什么

**影响**：可能造成什么后果

**修复建议**：
```代码示例```

**参考**：相关 CWE/CVE 编号

# 约束

- 不要修改任何代码
- 不要执行可能造成破坏的命令
- 发现严重漏洞立即报告，不要等到扫描完成

# 自我检查

完成前确认：
1. 是否检查了所有入口点？
2. 是否验证了每个发现？
3. 修复建议是否可行？
```

### 反思机制

在 prompt 中加入自我检查步骤，可以提高 Agent 的准确性。

```markdown
# 完成前的自我检查

在提交结果前，问自己：
1. 我是否完全理解了用户需求？
2. 我的方案是否完整？
3. 有没有遗漏的边界情况？
4. 如果我是用户，看到这个结果会满意吗？
```

---

## 透传参数（Additional Options）

Agent 配置中未知的字段会**透传给 provider**。这允许你使用 provider 特定的参数。

> 来源：`agents.mdx:569-591`，`config.ts:487`，`agent.ts:193`

### 配置示例

```jsonc
{
  "agent": {
    "deep-thinker": {
      "description": "深度思考，处理复杂问题",
      "model": "openai/o1",
      "reasoningEffort": "high",     // OpenAI 特定参数
      "textVerbosity": "low"          // OpenAI 特定参数
    },
    "quick-helper": {
      "description": "快速响应，处理简单问题",
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.3
    }
  }
}
```

### 常用透传参数

| 参数 | Provider | 说明 |
|------|----------|------|
| `reasoningEffort` | OpenAI o 系列 | `high` / `medium` / `low` |
| `textVerbosity` | OpenAI | 输出详细程度 |
| `top_k` | Anthropic | 采样参数 |
| `max_tokens` | 多数 provider | 最大输出 token |

> 具体支持哪些参数，请查阅对应 provider 的文档。

---

## 高级配置技巧

### 嵌套子目录 Agent

Agent 可以放在子目录中组织：

```
.opencode/agent/
├── review/
│   ├── security.md       → 名称: review/security
│   └── performance.md    → 名称: review/performance
├── docs/
│   └── api.md            → 名称: docs/api
└── translator.md         → 名称: translator
```

调用方式：

```
@review/security 帮我审计这段代码
```

> 来源：`config.ts:243-255`

### MCP 工具通配符控制

禁用某个 MCP server 的所有工具：

```jsonc
{
  "agent": {
    "safe-agent": {
      "permission": {
        "mymcp_*": "deny",           // 禁用 mymcp 的所有工具
        "postgres_query": "ask"       // 数据库查询需确认
      }
    }
  }
}
```

> 来源：`agents.mdx:366-379`

### steps 参数调优

```yaml
---
steps: 50  # 最大迭代步数
---
```

| 设置 | 行为 |
|------|------|
| 不设置 | 无限制，直到模型决定停止 |
| 设置数值 | 达到限制时，强制生成摘要并停止 |

**建议**：
- 简单任务：10-20 步
- 中等任务：30-50 步
- 复杂任务：50-100 步
- 不限制：适合需要彻底完成的任务

### color 自定义颜色

```yaml
---
color: "#FF5733"  # 十六进制颜色
---
```

在界面中区分不同 Agent，便于识别当前使用的是哪个。

### hidden 隐藏 Agent

```yaml
---
hidden: true  # 从 @ 菜单隐藏
---
```

适用场景：
- 内部工具 Agent，不需要用户直接调用
- 只通过 Task tool 被其他 Agent 调用
- 系统级 Agent

> 来源：`config.ts:468-471`

### name 覆盖文件名

```yaml
---
name: my-custom-name  # 覆盖文件名
description: ...
---
```

默认情况下，Agent 名称是文件名（不含 .md）。可以用 `name` 字段覆盖。

> 来源：`agent.ts:191`

---

## Agent 调试技巧

### 1. 查看实际对话

OpenCode 会话数据存储在 `.opencode/data/` 目录下。

```bash
# 查看最近的会话
ls -la .opencode/data/sessions/

# 查看具体会话的消息
cat .opencode/data/sessions/<session-id>/messages.json
```

### 2. 简化测试

当 Agent 行为异常时：

1. 创建一个**最简版本**的 prompt
2. 逐步添加复杂性
3. 找到导致问题的部分

```markdown
<!-- 最简版本 -->
---
description: 测试 Agent
mode: subagent
---

你是测试助手。回答用户问题。
```

### 3. 检查权限配置

权限问题是最常见的问题来源。

```bash
# 查看当前配置（包括合并后的权限）
opencode config
```

检查：
- 规则顺序是否正确（`*` 在前）
- 是否有冲突的规则
- Agent 级别是否覆盖了预期的全局规则

### 4. 验证模型能力

不同模型能力差异很大。

| 任务类型 | 推荐模型 |
|---------|---------|
| 复杂推理 | Claude Opus、GPT-4、o1 |
| 代码生成 | Claude Sonnet、GPT-4 |
| 简单任务 | Claude Haiku、GPT-4o-mini |

如果 Agent 表现不佳，尝试更强的模型。

### 5. 使用 steps 限制调试

设置较小的 `steps` 值，观察 Agent 的前几步行为：

```yaml
---
steps: 5  # 只执行 5 步就停止
---
```

---

## 扩展踩坑合集

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| Agent 不遵守指令 | prompt 太长/模糊 | 精简核心规则，使用结构化格式 |
| Agent 循环调用 subagent | 没有停止条件 | 设置 steps 限制或 task deny |
| 透传参数不生效 | provider 不支持 | 查阅 provider 文档确认 |
| 嵌套目录 Agent 找不到 | 路径格式错误 | 使用 / 分隔符：`folder/agent` |
| MCP 工具权限无效 | 通配符匹配失败 | 确认工具名前缀匹配 |
| temperature 无效 | 某些模型不支持/有固定值 | 检查模型文档 |
| description 没效果 | 内容太泛 | 具体说明**何时**使用这个 Agent |
| 自动选择错误 Agent | description 相似 | 让每个 Agent 的描述有明确区分 |
| hidden Agent 仍显示 | mode 不是 subagent | hidden 只对 subagent 有效 |
| steps 达到限制但任务未完成 | 限制太小 | 增加 steps 或优化 prompt |

---

## 高级用例示例

### 自动化代码审查机器人

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "pr-reviewer": {
      "description": "PR 审查机器人，自动审查代码变更",
      "mode": "primary",
      "model": "anthropic/claude-opus-4-5-thinking",
      "steps": 100,
      "temperature": 0.1,
      "prompt": "{file:./prompts/pr-reviewer.md}",
      "permission": {
        "edit": "deny",
        "bash": {
          "*": "deny",
          "git log*": "allow",
          "git diff*": "allow",
          "git show*": "allow",
          "npm test": "allow"
        },
        "task": {
          "*": "deny",
          "security-auditor": "allow",
          "performance-checker": "allow",
          "style-checker": "allow"
        }
      }
    }
  }
}
```

### 多模型协作

```jsonc
{
  "agent": {
    "planner": {
      "description": "规划者：分析需求，制定计划",
      "mode": "primary",
      "model": "anthropic/claude-opus-4-5-thinking",
      "temperature": 0.2,
      "steps": 20
    },
    "executor": {
      "description": "执行者：实现具体代码",
      "mode": "primary", 
      "model": "anthropic/claude-sonnet-4-20250514",
      "temperature": 0.3,
      "steps": 100
    },
    "reviewer": {
      "description": "审查者：检查代码质量",
      "mode": "subagent",
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1,
      "permission": {
        "edit": "deny"
      }
    }
  }
}
```

使用方式：
1. Tab 切换到 planner，制定计划
2. Tab 切换到 executor，执行实现
3. `@reviewer` 调用审查

---

## 本章小结

你学会了：

1. **ACI 设计原则**：给模型空间、自然格式、优秀描述
2. **Prompt 工程**：结构化、反思机制
3. **透传参数**：reasoningEffort、textVerbosity 等
4. **高级配置**：嵌套目录、MCP 通配符、steps、hidden
5. **调试技巧**：查看会话、简化测试、检查权限

---

## 延伸阅读

- [Anthropic: Building Effective Agents - Appendix 2](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenCode 官方文档：Agents](https://opencode.ai/docs/agents)

---

## Agent 系统学习完成

恭喜！你已经完成了 Agent 系统的全部学习：

| 章节 | 内容 |
|------|------|
| [5.2a 快速入门](./02a-agent-quickstart) | 创建第一个 Agent |
| [5.2b 设计模式](./02b-agent-patterns) | 五种 Workflow 模式 |
| [5.2c 权限与安全](./02c-agent-permissions) | 精确控制权限 |
| **5.2d 高级技巧**（本章） | ACI、透传参数、调试 |

---

## 下一课预告

> Agent 可以调用 Skill 来获取专业知识。下一课我们学习 Skill 系统。

**下一课**：[5.3 Skill](./03a-skills-basics)
