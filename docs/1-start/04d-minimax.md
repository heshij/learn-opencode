---
title: 连接 MiniMax（M2.1）
subtitle: 9.9 元 Starter 月卡可选
course: OpenCode 中文实战课
stage: 第一阶段
lesson: "1.4d"
duration: 15 分钟
practice: 5 分钟
level: 新手
description: 获取 MiniMax API Key，并在 OpenCode 中连接使用 M2.1 等模型。
tags:
  - 模型
  - MiniMax
  - API Key
prerequisite:
  - 1.2 安装
---

# 连接 MiniMax（M2.1）

> 预计时间：10-15 分钟

MiniMax 提供 M2.1 等模型，并且有 **Coding Plan**（例如 Starter 月卡）适合尝鲜。

如果你还没看过“API Key 是什么”，建议先回到 [1.4 总览](./04-connect)。

---

## 学完你能做什么

- 获取 MiniMax API Key
- 在 OpenCode 里连接 MiniMax
- 选择模型并完成第一次对话

---

## 🎒 开始前的准备

- [ ] 完成了 [1.2 安装](./02-install)，能运行 `opencode`
- [ ] 已能访问 MiniMax 控制台并拿到 API Key

---

## 跟我做

### 第 1 步：注册并获取 API Key

访问 MiniMax 平台（以官网跳转为准）：
- https://platform.minimax.io
- https://platform.minimaxi.com

MiniMax 常见两种拿 Key 的方式：

- **Coding Plan（月卡/套餐）**：按页面提示订阅后，在套餐管理页复制专属 Key
- **按量计费**：在 API Key/接口密钥页面创建并复制 Key

---

### 第 2 步：在 OpenCode 中连接 MiniMax

方式 A（推荐优先尝试）：

1. 启动 OpenCode：
   ```bash
   opencode
   ```
2. 输入：
   ```
   /connect
   ```
3. 搜索并选择 `MiniMax`，粘贴 API Key

如果你的提供商列表里没有 MiniMax，或你需要自定义 Anthropic 兼容端点，可以使用方式 B。

---

### （可选）方式 B：手动配置自定义端点（Anthropic 兼容）

> 适用于：你需要指定 `baseURL`，或者你的版本里没有内置 MiniMax 入口。

1. 编辑 `~/.config/opencode/opencode.json`，添加 provider：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "minimax": {
      "npm": "@ai-sdk/anthropic",
      "options": {
        "baseURL": "https://api.minimaxi.com/anthropic/v1"
      },
      "models": {
        "MiniMax-M2.1": {
          "name": "MiniMax-M2.1"
        }
      }
    }
  }
}
```

2. 运行登录命令添加 Key：

```bash
opencode auth login
```

在交互界面里：选择 `Other` → 输入 provider ID：`minimax` → 粘贴你的 API Key。

::: warning 环境变量冲突
如果你之前设置过 `ANTHROPIC_AUTH_TOKEN` 或 `ANTHROPIC_BASE_URL`，可能会影响 Anthropic 兼容提供商（包括 MiniMax）。

可以先清理：

```bash
unset ANTHROPIC_AUTH_TOKEN
unset ANTHROPIC_BASE_URL
```
:::

---

### 第 3 步：选择模型并验证

输入：

```
/models
```

选择 `MiniMax-M2.1`（或你配置/列表中的其他模型），然后发送一句话验证：

```
你好，请介绍一下你自己
```

---

## 检查点 ✅

- [ ] `/models` 里能看到并选择 MiniMax 模型
- [ ] 发送消息能收到 AI 回复

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|------|------|
| `Cannot read properties of undefined` | 配置不完整或 Key 错误 | 检查 baseURL 和 apiKey 配置 |
| 没有响应 | 环境变量冲突 | 清除 `ANTHROPIC_AUTH_TOKEN` 等环境变量 |

---

## 下一步

- 回到 [1.4 总览](./04-connect) 选择下一条路线，或进入 [2.1 界面与基础操作](../2-daily/01-interface)