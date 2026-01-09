---
title: OpenCode Zen
description: OpenCode 团队精选的模型服务
---

# OpenCode Zen

OpenCode Zen 是由 OpenCode 团队测试和验证的精选模型服务。

> OpenCode Zen 目前处于 Beta 阶段。

Zen 像 OpenCode 中的其他提供商一样工作。你登录 OpenCode Zen 获取 API 密钥。它是**完全可选的**，不使用它也可以正常使用 OpenCode。

## 背景

市面上有大量模型，但只有少数能作为编程代理良好工作。此外，大多数提供商配置差异很大，导致性能和质量参差不齐。

> 我们测试了一组与 OpenCode 配合良好的模型和提供商。

如果你通过 OpenRouter 等服务使用模型，无法确定是否获得了最佳版本。

为此，我们做了几件事：

1. 测试了一组精选模型，并与团队讨论如何最佳运行
2. 与几家提供商合作，确保正确提供服务
3. 对模型/提供商组合进行基准测试，得出推荐列表

OpenCode Zen 是一个 AI 网关，让你可以访问这些模型。

## 使用方法

OpenCode Zen 像其他提供商一样工作：

1. 登录 [OpenCode Zen 控制台](https://console.opencode.ai)，添加付款信息，复制 API 密钥
2. 在 TUI 中运行 `/connect` 命令，选择 OpenCode Zen，粘贴 API 密钥
3. 在 TUI 中运行 `/models` 查看推荐模型列表

按请求计费，可向账户添加额度。

## API 端点

也可以通过以下 API 端点访问模型：

| 模型 | 模型 ID | 端点 | AI SDK 包 |
|------|---------|------|-----------|
| GPT 5.2 | gpt-5.2 | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.1 | gpt-5.1 | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.1 Codex | gpt-5.1-codex | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.1 Codex Max | gpt-5.1-codex-max | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.1 Codex Mini | gpt-5.1-codex-mini | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5 | gpt-5 | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5 Codex | gpt-5-codex | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5 Nano | gpt-5-nano | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| Claude Sonnet 4.5 | claude-sonnet-4-5 | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Sonnet 4 | claude-sonnet-4 | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Haiku 4.5 | claude-haiku-4-5 | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Haiku 3.5 | claude-3-5-haiku | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Opus 4.5 | claude-opus-4-5 | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Opus 4.1 | claude-opus-4-1 | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| MiniMax M2.1 | minimax-m2.1-free | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Gemini 3 Pro | gemini-3-pro | `https://opencode.ai/zen/v1/models/gemini-3-pro` | `@ai-sdk/google` |
| Gemini 3 Flash | gemini-3-flash | `https://opencode.ai/zen/v1/models/gemini-3-flash` | `@ai-sdk/google` |
| GLM 4.6 | glm-4.6 | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| GLM 4.7 | glm-4.7-free | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Kimi K2 | kimi-k2 | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Kimi K2 Thinking | kimi-k2-thinking | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Qwen3 Coder 480B | qwen3-coder | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Grok Code Fast 1 | grok-code | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Big Pickle | big-pickle | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |

OpenCode 配置中的模型 ID 使用格式 `opencode/<model-id>`。例如 GPT 5.1 Codex 使用 `opencode/gpt-5.1-codex`。

### 获取模型列表

获取可用模型及其元数据：

```
https://opencode.ai/zen/v1/models
```

## 定价

按请求付费。以下是**每 100 万 token** 的价格：

| 模型 | 输入 | 输出 | 缓存读取 | 缓存写入 |
|------|------|------|----------|----------|
| Big Pickle | 免费 | 免费 | 免费 | - |
| Grok Code Fast 1 | 免费 | 免费 | 免费 | - |
| MiniMax M2.1 | 免费 | 免费 | 免费 | - |
| GLM 4.7 | 免费 | 免费 | 免费 | - |
| GLM 4.6 | $0.60 | $2.20 | $0.10 | - |
| Kimi K2 | $0.40 | $2.50 | - | - |
| Kimi K2 Thinking | $0.40 | $2.50 | - | - |
| Qwen3 Coder 480B | $0.45 | $1.50 | - | - |
| Claude Sonnet 4.5 (≤ 200K tokens) | $3.00 | $15.00 | $0.30 | $3.75 |
| Claude Sonnet 4.5 (> 200K tokens) | $6.00 | $22.50 | $0.60 | $7.50 |
| Claude Sonnet 4 (≤ 200K tokens) | $3.00 | $15.00 | $0.30 | $3.75 |
| Claude Sonnet 4 (> 200K tokens) | $6.00 | $22.50 | $0.60 | $7.50 |
| Claude Haiku 4.5 | $1.00 | $5.00 | $0.10 | $1.25 |
| Claude Haiku 3.5 | $0.80 | $4.00 | $0.08 | $1.00 |
| Claude Opus 4.5 | $5.00 | $25.00 | $0.50 | $6.25 |
| Claude Opus 4.1 | $15.00 | $75.00 | $1.50 | $18.75 |
| Gemini 3 Pro (≤ 200K tokens) | $2.00 | $12.00 | $0.20 | - |
| Gemini 3 Pro (> 200K tokens) | $4.00 | $18.00 | $0.40 | - |
| Gemini 3 Flash | $0.50 | $3.00 | $0.05 | - |
| GPT 5.2 | $1.75 | $14.00 | $0.175 | - |
| GPT 5.1 | $1.07 | $8.50 | $0.107 | - |
| GPT 5.1 Codex | $1.07 | $8.50 | $0.107 | - |
| GPT 5.1 Codex Max | $1.25 | $10.00 | $0.125 | - |
| GPT 5.1 Codex Mini | $0.25 | $2.00 | $0.025 | - |
| GPT 5 | $1.07 | $8.50 | $0.107 | - |
| GPT 5 Codex | $1.07 | $8.50 | $0.107 | - |
| GPT 5 Nano | 免费 | 免费 | 免费 | - |

使用历史中可能看到 _Claude Haiku 3.5_，这是用于生成会话标题的低成本模型。

> 信用卡费用按成本传递（每笔 4.4% + $0.30），我们不收取额外费用。

免费模型说明：

- **Grok Code Fast 1**：限时免费，xAI 团队正在收集反馈以改进 Grok Code
- **GLM 4.7**：限时免费，团队正在收集反馈以改进模型
- **MiniMax M2.1**：限时免费，团队正在收集反馈以改进模型
- **Big Pickle**：隐身模型，限时免费，团队正在收集反馈以改进模型

### 自动充值

余额低于 $5 时，Zen 会自动充值 $20。

可以更改自动充值金额，也可以完全禁用自动充值。

### 月度限额

可以为整个工作区和每个团队成员设置月度使用限额。

例如，设置月度限额为 $20，Zen 每月不会使用超过 $20。但如果启用了自动充值，余额低于 $5 时可能会充值超过 $20。

## 隐私

所有模型托管在美国。提供商遵循零保留策略，不使用你的数据进行模型训练，但有以下例外：

- **Grok Code Fast 1**：免费期间收集的数据可能用于改进 Grok Code
- **GLM 4.7**：免费期间收集的数据可能用于改进模型
- **MiniMax M2.1**：免费期间收集的数据可能用于改进模型
- **Big Pickle**：免费期间收集的数据可能用于改进模型
- **OpenAI API**：请求根据 [OpenAI 数据政策](https://platform.openai.com/docs/guides/your-data) 保留 30 天
- **Anthropic API**：请求根据 [Anthropic 数据政策](https://docs.anthropic.com/en/docs/claude-code/data-usage) 保留 30 天

## 团队功能

Zen 非常适合团队使用。可以邀请队友、分配角色、管理团队使用的模型等。

> Beta 期间工作区管理免费。

### 角色

可以邀请队友并分配角色：

- **Admin**：管理模型、成员、API 密钥和账单
- **Member**：只能管理自己的 API 密钥

管理员还可以为每个成员设置月度消费限额。

### 模型访问控制

管理员可以为工作区启用或禁用特定模型。向禁用模型发送的请求会返回错误。

这适用于禁止使用收集数据的模型。

### 自带密钥

可以使用自己的 OpenAI 或 Anthropic API 密钥，同时访问 Zen 中的其他模型。

使用自己的密钥时，token 直接由提供商计费，而非 Zen。

例如，你的组织可能已有 OpenAI 或 Anthropic 密钥，想使用它而非 Zen 提供的密钥。

## 目标

我们创建 OpenCode Zen 是为了：

1. **基准测试**编程代理的最佳模型/提供商
2. 访问**最高质量**选项，不降级性能或路由到更便宜的提供商
3. 按成本**传递价格下降**，唯一加价是处理费用
4. **无锁定**，允许与任何其他编程代理一起使用，也允许在 OpenCode 中使用任何其他提供商
