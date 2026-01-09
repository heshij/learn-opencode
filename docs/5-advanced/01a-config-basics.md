---
title: 5.1a 配置基础
subtitle: opencode.json 核心配置
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.1a"
duration: 15 分钟
level: 进阶
description: 学习 opencode.json 核心配置，控制 OpenCode 的基础行为，定制你的开发环境。
tags:
  - 配置
  - JSON
  - 基础
prerequisite:
  - 2.1 界面与基础操作
---

# 5.1a 配置基础

> 通过 opencode.json 配置文件，控制 OpenCode 的核心行为。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/config-basics-notes.mini.jpeg" alt="配置基础学霸笔记" data-zoom-src="/images/5-advanced/config-basics-notes.jpeg" />

---

## 学完你能做什么

- 理解配置文件的位置和优先级
- 掌握模型和 Provider 配置
- 使用变量替换动态配置
- 配置用户名和自动更新

---

## 你现在的困境

- 每次都要手动设置，不知道怎么保存配置
- API Key 不想明文写在配置里
- 不知道怎么配置多个 Provider

---

## 什么时候用这一招

- 当你需要：个性化定制 OpenCode 的行为
- 而且不想：每次启动都重新设置

---

## 配置文件位置

| 位置 | 优先级 | 说明 |
|-----|-------|------|
| `./opencode.json` | 高 | 项目级配置 |
| `~/.config/opencode/opencode.json` | 低 | 全局配置 |
| `OPENCODE_CONFIG` 环境变量 | 最高 | 自定义配置文件路径 |
| `OPENCODE_CONFIG_DIR` 环境变量 | - | 自定义配置目录 |

> 配置文件是**合并**的，不是覆盖。后面的配置会覆盖前面冲突的键，但非冲突的设置都会保留。

### 配置目录结构

```
~/.config/opencode/
├── opencode.json       # 全局配置
├── AGENTS.md           # 全局规则
├── agent/              # 全局 Agent
├── command/            # 全局命令
└── plugin/             # 全局插件

项目目录/
├── opencode.json       # 项目配置
├── AGENTS.md           # 项目规则
└── .opencode/
    ├── agent/          # 项目 Agent
    ├── command/        # 项目命令
    └── plugin/         # 项目插件
```

---

## 配置格式

支持 JSON 和 JSONC（带注释的 JSON）：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  // 这是注释，JSONC 格式支持
  "model": "anthropic/claude-opus-4-5-thinking"
}
```

> 配置文件名可以是 `opencode.json` 或 `opencode.jsonc`。

---

## 模型配置

### 主模型和小模型

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-opus-4-5-thinking",
  "small_model": "anthropic/claude-haiku-4-5"
}
```

| 字段 | 说明 |
|-----|------|
| `model` | 主模型（格式：provider/model） |
| `small_model` | 小模型，用于简单任务（如生成标题） |

> `small_model` 配置一个更便宜的模型用于轻量任务。如果不设置，OpenCode 会尝试使用 Provider 提供的便宜模型，否则回退到主模型。

### 默认 Agent

```json
{
  "default_agent": "build"
}
```

设置默认使用的 primary agent（必须是 primary 模式）。可选值：
- `"build"` - 默认，所有工具可用
- `"plan"` - 只读模式，编辑需确认
- 或你自定义的 primary agent 名称

---

## Provider 配置

### 基础配置

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}",
        "baseURL": "https://api.anthropic.com",
        "timeout": 600000,
        "setCacheKey": true
      }
    }
  }
}
```

> 注意：配置键是 `provider`（单数），不是 `providers`。

### options 字段说明

| 字段 | 类型 | 说明 |
|-----|------|------|
| `apiKey` | string | API 密钥 |
| `baseURL` | string | 自定义 API 地址（代理场景常用） |
| `timeout` | number \| false | 请求超时（毫秒），默认 300000，设为 false 禁用 |
| `setCacheKey` | boolean | 启用提示缓存键（默认 false） |

### Amazon Bedrock 特殊配置

Amazon Bedrock 支持 AWS 特定配置：

```json
{
  "provider": {
    "amazon-bedrock": {
      "options": {
        "region": "us-east-1",
        "profile": "my-aws-profile",
        "endpoint": "https://bedrock-runtime.us-east-1.vpce-xxxxx.amazonaws.com"
      }
    }
  }
}
```

| 字段 | 说明 |
|-----|------|
| `region` | AWS 区域（默认从 `AWS_REGION` 环境变量或 `us-east-1`） |
| `profile` | AWS 配置文件名（来自 `~/.aws/credentials`） |
| `endpoint` | 自定义端点 URL（用于 VPC 端点） |

### Provider 黑白名单

控制加载哪些 Provider：

```json
{
  "disabled_providers": ["openai", "gemini"],
  "enabled_providers": ["anthropic"]
}
```

| 字段 | 说明 |
|-----|------|
| `disabled_providers` | 禁用的 Provider 列表，即使有 API Key 也不加载 |
| `enabled_providers` | 只启用这些 Provider，其他全部忽略 |

> `disabled_providers` 优先级高于 `enabled_providers`。如果同时出现在两个列表中，会被禁用。

---

## 用户配置

### 自定义用户名

```json
{
  "username": "张三"
}
```

在对话中显示自定义用户名，而不是系统用户名。

---

## 主题配置

```json
{
  "theme": "tokyonight"
}
```

> 注意：配置键是 `theme`，不是 `tui.theme`。

---

## 自动更新

```json
{
  "autoupdate": true
}
```

| 值 | 说明 |
|-----|------|
| `true` | 启动时自动下载更新（默认） |
| `false` | 禁用自动更新 |
| `"notify"` | 只通知新版本，不自动更新 |

---

## 变量替换

配置中可以使用变量，动态获取值：

### 环境变量

使用 `{env:变量名}` 引用环境变量：

```json
{
  "model": "{env:OPENCODE_MODEL}",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

> 如果环境变量不存在，会被替换为空字符串。

### 文件内容

使用 `{file:路径}` 引用文件内容：

```json
{
  "provider": {
    "openai": {
      "options": {
        "apiKey": "{file:~/.secrets/openai-key}"
      }
    }
  }
}
```

文件路径支持：
- 相对于配置文件的路径
- 以 `/` 开头的绝对路径
- 以 `~` 开头的 home 目录路径

变量替换适用于：
- 保护敏感数据（API Key 放单独文件）
- 跨环境配置（开发/生产用不同变量）
- 共享配置片段

---

## 基础配置完整示例

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  
  // 模型
  "model": "anthropic/claude-opus-4-5-thinking",
  "small_model": "anthropic/claude-haiku-4-5",
  "default_agent": "build",
  
  // Provider
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}",
        "timeout": 600000
      }
    }
  },
  
  // Provider 控制
  "disabled_providers": ["gemini"],
  
  // 用户
  "username": "开发者",
  
  // 主题
  "theme": "catppuccin",
  
  // 自动更新
  "autoupdate": true
}
```

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 配置不生效 | 优先级问题 | 项目级配置优先于全局配置 |
| 变量替换失败 | 环境变量不存在 | 确认环境变量已设置 |
| JSON 解析错误 | 格式错误 | 使用 JSONC 格式或检查语法 |
| 用了 `providers` | 键名错误 | 应为 `provider`（单数） |
| Provider 不加载 | 在 disabled 列表中 | 检查 `disabled_providers` |

---

## 本课小结

你学会了：

1. 配置文件的位置和优先级
2. 模型配置（model、small_model、default_agent）
3. Provider 配置（options、黑白名单）
4. 变量替换（环境变量、文件内容）
5. 用户名、主题、自动更新配置

---

## 下一课预告

> 下一课我们将学习配置进阶，包括界面配置、行为配置、以及各类功能配置的详解。
