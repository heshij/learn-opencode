---
title: 免费模型
subtitle: 无需登录，开箱即用
course: OpenCode 中文实战课
stage: 第一阶段
lesson: "1.4a"
duration: 5 分钟
practice: 2 分钟
level: 新手
description: 使用 OpenCode 内置的免费模型，无需注册账号，直接开始第一次对话。
tags:
  - 模型
  - 免费
  - OpenCode Zen
prerequisite:
  - 1.2 安装
---

# 免费模型

> 适合：你想 **0 成本、0 配置** 先跑通 OpenCode 的第一次对话。

OpenCode 内置了一批**完全免费**的模型，**无需注册账号、无需 API Key**，安装后直接可用。

---

## 当前免费模型

| 模型 ID | 名称 | 特点 |
|---------|------|------|
| `glm-4.7-free` | GLM-4.7 | 智谱出品，支持推理，中文表现优秀 |
| `minimax-m2.1-free` | MiniMax M2.1 | MiniMax 出品，支持推理，上下文 200K |
| `gpt-5-nano` | GPT-5 Nano | OpenAI 出品，轻量快速 |
| `grok-code` | Grok Code | xAI 出品，代码能力强 |
| `big-pickle` | Big Pickle | 隐藏模型，限时免费体验 |

::: tip 说明
免费模型列表会随时间调整，以 `/models` 命令显示的列表为准。

免费模型有 IP 级别的使用限额，适合体验和轻度使用。如需更高配额，可以登录 OpenCode Zen 获取 API Key。
:::

---

## 跟我做

### 第 1 步：启动 OpenCode

```bash
opencode
```

首次启动时，OpenCode 会自动加载免费模型，无需任何配置。

---

### 第 2 步：选择免费模型

输入：

```
/models
```

在列表里选择任意一个免费模型，例如：
- `opencode/glm-4.7-free`
- `opencode/minimax-m2.1-free`

::: tip 如何识别免费模型？
免费模型通常带有 `-free` 后缀，或在 `/models` 列表中显示价格为 `$0`。
:::

---

### 第 3 步：发送第一句话

```
你好，请介绍一下你自己
```

能收到回复就说明你已经跑通了"安装 → 选模型 → 对话"的完整流程。

---

## 检查点

- [ ] 输入 `/models` 能看到 `opencode/*-free` 或价格为 `$0` 的模型
- [ ] 发送消息能收到 AI 回复

---

## 常见问题

| 现象 | 原因 | 解决 |
|-----|------|------|
| `/models` 里看不到免费模型 | 网络问题或版本过旧 | 检查网络，运行 `opencode upgrade` 更新 |
| 请求被拒绝/报限流 | 免费模型有 IP 级别的配额限制 | 换一个免费模型或稍后再试 |
| 响应速度较慢 | 免费模型服务器负载较高 | 正常现象，耐心等待或换个模型 |

---

## 想要更多？

免费模型适合体验和轻度使用。如果你需要：
- 更高的请求配额
- 更多的模型选择（Claude、GPT-5 等）
- 更稳定的服务

可以登录 [OpenCode Zen](https://opencode.ai/zen) 获取 API Key，参考 [1.4 连接模型](./04-connect) 了解更多。

---

## 下一步

- 回到 [1.4 总览](./04-connect) 选择下一条路线
- 或直接进入 [2.1 界面与基础操作](../2-daily/01-interface) 开始学习日常使用
