---
title: 连接 OpenAI（GPT-5.2 / Codex）
subtitle: 全球最知名的 AI 模型提供商
course: OpenCode 中文实战课
stage: 第一阶段
lesson: "1.4h"
duration: 10 分钟
practice: 5 分钟
level: 新手
description: 使用 ChatGPT 订阅或 API Key 连接 OpenAI，使用 GPT-5.2、Codex 等最新模型。
tags:
  - 模型
  - OpenAI
  - GPT-5.2
  - Codex
  - ChatGPT
prerequisite:
  - 1.2 安装
  - 1.3 网络配置
---

# 连接 OpenAI（GPT-5.2 / Codex）

> 预计时间：10 分钟

OpenAI 是 ChatGPT 背后的公司，提供目前最强的 AI 模型。2025年12月发布的 **GPT-5.2** 是当前最新的旗舰模型，而 **GPT-5.2-Codex** 则是专门为代码任务优化的版本。

::: warning 国内用户注意
OpenAI 需要代理才能访问。请先完成 [1.3 网络配置](./03-network)。

如果网络搞不定，建议使用 [DeepSeek](./04b-deepseek) 或 [智谱](./04c-zhipu) 等国产模型。
:::

---

## 学完你能做什么

- 用 ChatGPT 订阅直接登录 OpenCode
- 或用 API Key 连接 OpenAI
- 使用 GPT-5.2、GPT-5.2-Codex 等最新模型

---

## 两种登录方式

| 方式 | 适合谁 | 优点 |
|------|--------|------|
| **ChatGPT 订阅**（推荐） | 已有 Plus/Pro 会员 | 直接用，不用额外花钱 |
| **API Key** | 没有订阅的用户 | 按量付费，用多少花多少 |

---

## 方式一：ChatGPT 订阅登录（推荐）

如果你已经是 **ChatGPT Plus**（$20/月）或 **ChatGPT Pro**（$200/月）用户，可以直接用订阅登录，不需要单独买 API。

### 🎒 开始前的准备

- [ ] 完成了 [1.2 安装](./02-install)，能运行 `opencode`
- [ ] 完成了 [1.3 网络配置](./03-network)（国内用户必须）
- [ ] 有 ChatGPT Plus 或 Pro 订阅

### 跟我做

#### 第 1 步：启动 OpenCode

```bash
opencode
```

#### 第 2 步：连接 OpenAI

输入：

```
/connect
```

用方向键找到 **OpenAI**，按回车。

#### 第 3 步：选择登录方式

你会看到登录方式选择：

```
┌ Select auth method
│
│ ChatGPT Plus/Pro（推荐）
│ Create an API Key
│ Manually enter API Key
└
```

选择 **ChatGPT Plus/Pro**，按回车。

#### 第 4 步：浏览器授权

OpenCode 会自动打开浏览器，跳转到 OpenAI 登录页面。

1. 用你的 ChatGPT 账号登录
2. 点击 **授权**
3. 看到"授权成功"后，回到终端

#### 第 5 步：验证成功

回到 OpenCode，你会看到：

```
✓ Login successful
```

现在输入 `/models`，你应该能看到 OpenAI 的所有模型了！

---

## 方式二：API Key 登录

如果你没有 ChatGPT 订阅，可以用 API Key 方式，按量付费。

### 🎒 开始前的准备

- [ ] 完成了 [1.2 安装](./02-install)
- [ ] 完成了 [1.3 网络配置](./03-network)（国内用户必须）
- [ ] 有境外支付方式（Visa / Mastercard）

### 跟我做

#### 第 1 步：注册 OpenAI 账号

访问：https://platform.openai.com

点击 **Sign up**，按提示注册并登录。

#### 第 2 步：获取 API Key

1. 登录后，点击左侧菜单的 **API keys**
2. 或直接访问：https://platform.openai.com/api-keys
3. 点击 **Create new secret key**
4. 给 Key 起个名字（比如 `opencode`）
5. **立刻复制保存**

::: warning 只显示一次！
API Key 只会显示一次，关掉窗口后就看不到了。请立刻复制到安全的地方。
:::

#### 第 3 步：充值

1. 访问：https://platform.openai.com/settings/organization/billing
2. 点击 **Add payment method**
3. 添加信用卡并充值（建议先充 $5 试用）

#### 第 4 步：在 OpenCode 中连接

启动 OpenCode，输入：

```
/connect
```

选择 **OpenAI**，然后选择 **Manually enter API Key**。

粘贴你的 API Key：

```
┌ API key
│ sk-xxxxxxxxxxxxxxxxxxxxxxxx
└ 按回车确认
```

---

## 选择模型

连接成功后，输入：

```
/models
```

你会看到 OpenAI 的模型列表。以下是 2026年1月最新的模型推荐：

### GPT-5.2 系列（最新旗舰）

| 模型 | 特点 | 适合场景 |
|------|------|----------|
| `gpt-5.2-chat-latest` (Instant) | 快速响应，日常使用 | 问答、写文档、翻译 |
| `gpt-5.2` (Thinking) | 深度思考，复杂任务 | 分析、规划、难题 |
| `gpt-5.2-pro` | 最强最精准 | 专业工作、科研 |
| `gpt-5.2-codex` | **代码专用** | 写代码、重构、调试 |

### 如何选择？

- **日常使用**：`gpt-5.2-chat-latest`（快）
- **复杂任务**：`gpt-5.2`（强）
- **写代码**：`gpt-5.2-codex`（专业）

用方向键选择，按回车确认。

---

## GPT-5.2-Codex 详解

### 什么是 GPT-5.2-Codex？

GPT-5.2-Codex 是 OpenAI 在 2025年12月18日发布的**专业代码模型**，基于 GPT-5.2 进一步优化，专门针对软件工程任务。

它的特点是：

- **长时间任务**：支持上下文压缩，可以处理大型代码库
- **大规模重构**：擅长代码迁移、重构等复杂任务
- **更强的视觉理解**：能理解设计稿、截图、技术图表
- **网络安全能力**：在漏洞发现、代码审计方面表现出色

### 什么时候用 Codex？

| 场景 | 推荐模型 | 原因 |
|------|----------|------|
| 写复杂功能 | ✅ GPT-5.2-Codex | 长时间任务支持好 |
| 大规模重构 | ✅ GPT-5.2-Codex | 专门优化过 |
| 代码迁移 | ✅ GPT-5.2-Codex | 能处理大型代码库 |
| 调试 bug | ✅ GPT-5.2-Codex | 理解代码逻辑更深 |
| 日常问答 | GPT-5.2 Instant | 更快 |
| 写文档 | GPT-5.2 Instant | 通用能力足够 |

**简单说**：写代码用 Codex，其他用 GPT-5.2 Instant。

### 切换到 Codex

输入：

```
/models
```

用方向键找到 `openai / gpt-5.2-codex`，按回车确认。

### 动手试试 Codex

切换到 Codex 后，试试这个提示词：

```
帮我写一个 Node.js 函数，实现：
1. 读取指定目录下所有 .md 文件
2. 提取每个文件的标题（第一个 # 开头的行）
3. 生成一个目录索引文件 index.md
```

你会发现 Codex 在理解多步骤任务时特别清晰，生成的代码结构也很好。

### Codex 使用技巧

**1. 给足上下文**

Codex 越了解你的项目，输出越准确。用 `@` 引用相关文件：

```
@src/routes/user.ts @src/middleware/auth.ts

帮我给用户路由添加权限检查
```

**2. 描述清楚目标**

不要说"优化一下这个函数"，要说清楚优化什么：

```
这个函数有性能问题，数据量大时很慢。
请优化它，目标是：
1. 减少数据库查询次数
2. 添加缓存
3. 保持原有的接口不变
```

**3. 让它先分析再动手**

对于复杂任务，可以先让 Codex 分析：

```
先分析一下这个模块的代码结构，然后告诉我你打算怎么重构
```

等它分析完，你确认方向对了，再让它动手。

**4. 利用视觉能力**

Codex 能理解截图和设计稿，你可以：

```
@design.png

按照这个设计稿实现页面
```

---

## 检查点 ✅

- [ ] 能在 `/models` 里看到 OpenAI 的模型
- [ ] 发送消息能收到 AI 回复
- [ ] 能切换到 GPT-5.2-Codex 模型

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|------|------|
| 浏览器授权后没反应 | 网络问题 | 检查代理，刷新重试 |
| `connection timeout` | 网络问题 | 检查代理配置，参考 [1.3 网络配置](./03-network) |
| `API key invalid` | Key 复制错了 | 重新复制，确保没有多余空格 |
| `insufficient_quota` | 余额不足 | 去 OpenAI 控制台充值 |
| 页面打不开 | 代理没开或不稳定 | 换个代理节点试试 |

---

## 费用说明

### ChatGPT 订阅用户

- **Plus**：$20/月，包含 GPT-5.2 全系列模型
- **Pro**：$200/月，更高的使用额度，可用 GPT-5.2 Pro

### API 用户

按 token 计费（token ≈ 0.75 个英文单词 ≈ 0.5 个汉字）：

| 模型 | 输入价格 | 输出价格 |
|------|----------|----------|
| gpt-5.2 / gpt-5.2-chat-latest | $1.75/百万 | $14/百万 |
| gpt-5.2-pro | $21/百万 | $168/百万 |

普通使用一天大概 $0.1-0.5。

---

## 下一步

- 回到 [1.4 总览](./04-connect) 选择其他模型
- 或进入 [2.1 界面与基础操作](../2-daily/01-interface) 学习更多用法

::: tip 遇到问题？
配置过程中卡住了？[加入社群](/community)，和 500+ 同路人一起交流，实时答疑。
:::
