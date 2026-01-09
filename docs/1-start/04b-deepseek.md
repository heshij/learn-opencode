---
title: 连接 DeepSeek（首选推荐）
subtitle: 国内直连、便宜好用
course: OpenCode 中文实战课
stage: 第一阶段
lesson: "1.4b"
duration: 10 分钟
practice: 5 分钟
level: 新手
description: 获取 DeepSeek API Key，并在 OpenCode 中完成第一次对话。
tags:
  - 模型
  - DeepSeek
  - API Key
prerequisite:
  - 1.2 安装
---

# 连接 DeepSeek（首选推荐）

> 预计时间：5-10 分钟

DeepSeek 的特点很适合新手：国内直连、注册简单、价格极低、代码能力强。

如果你还没看过“API Key 是什么”，建议先回到 [1.4 总览](./04-connect) 把概念弄清楚，再继续。

---

## 学完你能做什么

- 获取 DeepSeek API Key
- 在 OpenCode 里连接 DeepSeek
- 发送第一句话并收到回复

---

## 🎒 开始前的准备

- [ ] 完成了 [1.2 安装](./02-install)，能运行 `opencode`
- [ ] 已能访问 `https://platform.deepseek.com`

---

## 跟我做

### 第 1 步：注册 DeepSeek 账号

访问：https://platform.deepseek.com

点击右上角的“登录/注册”，按提示用手机号/邮箱注册并登录。

---

### 第 2 步：获取 API Key

进入 API Keys 页面：
- 控制台左侧菜单：`API Keys`
- 或直接访问：https://platform.deepseek.com/api_keys

创建一个新的 Key，并**立刻复制保存**。

::: warning 只显示一次！
很多平台的 Key 只会显示一次。关掉窗口后就看不到完整 Key 了。

请立刻复制到安全的地方（密码管理器/备忘录），不要发群、不要截图、不要提交到 GitHub。
:::

---

### 第 3 步：（可选但推荐）充值

DeepSeek 对新用户通常会给少量额度，但很快会用完。充值 10 元左右就能用很久。

---

### 第 4 步：在 OpenCode 中连接 DeepSeek

启动 OpenCode：

```bash
opencode
```

在输入框输入：

```
/connect
```

在提供商列表里选择 `DeepSeek`，然后粘贴你的 API Key。

成功后你会看到类似提示：

```
✓ Provider added successfully!
✓ DeepSeek is now your active provider
```

---

### 第 5 步：发送第一句话（验证成功）

在输入框输入：

```
你好，请介绍一下你自己
```

能收到回复就说明连接成功。

---

## 检查点 ✅

- [ ] 发送消息能收到 AI 回复
- [ ] 没有报错（如 `API key invalid` / `insufficient balance` / `connection timeout`）

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|------|------|
| `API key invalid` | Key 复制错了或有空格 | 重新复制，确保没有多余空格 |
| `insufficient balance` | 余额不足 | 去控制台充值 |
| `connection timeout` | 网络波动 | 稍等一会再试 |

---

## 下一步

- 回到 [1.4 总览](./04-connect) 选择下一条路线，或进入 [2.1 界面与基础操作](../2-daily/01-interface)

::: tip 遇到问题？
配置过程中卡住了？[加入社群](/community)，和 500+ 同路人一起交流，实时答疑。
:::