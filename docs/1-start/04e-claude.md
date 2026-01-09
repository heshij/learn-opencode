---
title: 连接 Claude（Anthropic 官方）
subtitle: 代码能力强，但通常需要代理
course: OpenCode 中文实战课
stage: 第一阶段
lesson: "1.4e"
duration: 15 分钟
practice: 5 分钟
level: 新手
description: 获取 Anthropic API Key 并在 OpenCode 中连接 Claude。
tags:
  - 模型
  - Claude
  - Anthropic
  - API Key
prerequisite:
  - 1.2 安装
  - 1.3 网络配置
---

# 连接 Claude（Anthropic 官方）

> 预计时间：10-15 分钟

Claude 是 Anthropic 的模型，在复杂代码任务上表现出色。

在国内网络环境下，通常需要先完成 [1.3 网络配置](./03-network)，否则可能出现连接超时。

---

## 学完你能做什么

- 获取 Anthropic API Key
- 在 OpenCode 里连接 Anthropic（Claude）
- 发送第一句话并收到回复

---

## 🎒 开始前的准备

- [ ] 完成了 [1.2 安装](./02-install)，能运行 `opencode`
- [ ] 完成了 [1.3 网络配置](./03-network)（否则可能超时）
- [ ] 已能访问 `https://console.anthropic.com` 并拿到 API Key

---

## 跟我做

### 第 1 步：注册 Anthropic 账号

访问：https://console.anthropic.com

按页面提示注册并登录。

---

### 第 2 步：添加付款方式（通常必需）

Anthropic 通常要求绑定信用卡才能使用 API。

如果你没有可用的国际信用卡，可以考虑先使用国内直连模型（如 DeepSeek），或使用 [1.4a 免费模型](./04a-free-models)。

---

### 第 3 步：获取 API Key

进入 API Keys 页面：
- 左侧菜单：`API keys`
- 或直接访问：https://console.anthropic.com/settings/keys

创建 Key，并立刻复制保存。

---

### 第 4 步：在 OpenCode 中连接 Anthropic

启动 OpenCode：

```bash
opencode
```

输入：

```
/connect
```

选择 `Anthropic`，粘贴 API Key。

成功后会看到类似：

```
✓ Provider added successfully!
✓ Anthropic is now your active provider
```

---

### 第 5 步：发送第一句话（验证成功）

```
Hello, please introduce yourself
```

---

## 检查点 ✅

- [ ] 发送消息能收到 AI 回复
- [ ] 没有报错（如 `connection timeout` / `API key invalid`）

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|------|------|
| `connection timeout` | 网络代理问题 | 检查代理配置，参考 [1.3 网络配置](./03-network) |
| `API key invalid` | Key 格式错误 | Claude Key 通常以 `sk-ant-` 开头 |

---

## 下一步

- 回到 [1.4 总览](./04-connect) 选择下一条路线，或进入 [2.1 界面与基础操作](../2-daily/01-interface)

::: tip 遇到问题？
配置过程中卡住了？[加入社群](/community)，和 500+ 同路人一起交流，实时答疑。
:::