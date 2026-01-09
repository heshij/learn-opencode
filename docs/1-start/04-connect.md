---
title: 连接模型：第一次对话
subtitle: 发送你的第一句话
course: OpenCode 中文实战课
stage: 第一阶段
lesson: "1.4"
duration: 15 分钟
practice: 10 分钟
level: 新手
description: 选择一个模型提供商并连接到 OpenCode（支持免费模型、DeepSeek、智谱、MiniMax、Claude、Ollama，以及 Anthropic 兼容中转）。
tags:
  - 模型
  - API Key
  - DeepSeek
  - 智谱
  - MiniMax
  - Claude
  - Ollama
prerequisite:
  - 1.2 安装
---

# 连接模型：第一次对话

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/1-start/connect-notes.mini.jpeg" 
     alt="连接模型：第一次对话学霸笔记" 
     data-zoom-src="/images/1-start/connect-notes.jpeg" />

---

## 这是第一阶段的终点

学完这一课，你就能和 AI 对话了。

前面三课是准备工作。这一课是见证成果的时刻。

---

## 学完你能做什么

- 理解什么是 API Key（不只是"知道"，是真的理解）
- 成功配置至少一个模型提供商
- 发送第一句话，看到 AI 回复
- 知道怎么选适合自己的模型路线

---

## 🎒 开始前的准备

> 确保你已经完成：

- [ ] 完成了 [1.2 安装](./02-install)，`opencode --version` 能看到版本号
- [ ] 如果你要用国际模型或境外中转，完成了 [1.3 网络配置](./03-network)

---

## 先帮你做个决策：选哪条路线？

你只需要完成下面任意一个子章节，就能完成“第一次对话”。

| 路线 | 费用/门槛 | 网络要求 | 适合你 | 去哪里 |
|---|---|---|---|---|
| OpenCode Zen 免费模型 | 限时免费 | 通常可直连 | 想 0 成本先跑通流程 | [1.4a 免费模型](./04a-free-models) |
| DeepSeek | 极便宜 | 国内直连 | 国内用户首选、日常开发 | [1.4b 连接 DeepSeek](./04b-deepseek) |
| 智谱 Z.AI / GLM | 套餐/按量 | 国内直连 | 中文强、Coding Plan | [1.4c 连接智谱](./04c-zhipu) |
| MiniMax | 9.9 元起/按量 | 国内直连 | 想尝鲜对比、多模型 | [1.4d 连接 MiniMax](./04d-minimax) |
| Claude（Anthropic 官方） | 较贵 | 常需代理 | 复杂任务、英文项目 | [1.4e 连接 Claude](./04e-claude) |
| 第三方中转（Claude Code 兼容） | 取决于中转 | 取决于中转 | 有 `baseURL + key`，想走中转 | [1.4f 第三方中转](./04f-claudecode-relay) |
| Ollama 本地模型 | 免费 | 离线 | 隐私敏感、离线场景 | [1.4g 连接 Ollama](./04g-ollama) |
| 通义千问（阿里云） | 中等 | 国内直连 | 全能通用、阿里生态 | [1.4h 连接通义千问](./04i-alibaba) |

::: tip 一句话推荐
- **国内用户**：先用 DeepSeek（便宜、好用、少踩坑）
- **只想先体验**：先用 OpenCode Zen 免费模型跑通流程
:::

---

## 国产模型对比

配置完模型后，你可能会想：哪个模型更适合我？

| 模型 | 特点 | 价格 | 适合场景 |
|-----|------|------|---------|
| DeepSeek | 性价比之王、代码能力强 | 极低 | 日常开发、写作 |
| 智谱 GLM | 长上下文、稳定 | 中等 | 长文档分析、中文写作 |
| MiniMax | 多模态、创意强 | 中等 | 创意写作、对话 |
| 通义千问 | 阿里系、全能 | 中等 | 通用任务、企业场景 |

---

## 切换模型

配置完多个模型后，用 `/models` 命令随时切换：

```
/models
```

用 <kbd>↑</kbd> <kbd>↓</kbd> 选择，按 <kbd>Enter</kbd> 确认。

::: tip 设置默认模型
在 `opencode.json` 中配置 `model` 字段，可以设置默认使用的模型：

```json
{
  "model": "deepseek/deepseek-chat"
}
```
:::

---

## 核心概念：什么是 API Key？

在配置之前，先理解一个概念。

### API Key 是什么

简单说：**API Key 是你访问 AI 服务的"身份凭证"。**

更准确地说：
- AI 公司（DeepSeek、智谱、MiniMax 等）提供 AI 服务
- 你想用这个服务，需要有个身份标识
- API Key 就是这个身份标识
- 它还用于计费（用多少，扣多少钱）

### API Key 的注意事项

::: danger 重要：保护好你的 Key
- **不要分享给别人**：有了 Key 就能用你的账户消费
- **不要提交到 GitHub**：有人专门扫描 GitHub 盗用 Key
- **不要截图发社交媒体**：你懂的

万一泄露了，立刻去官网删掉旧 Key，创建新的。
:::

---

## 在 OpenCode 里你会用到的两个命令

- `/connect`：添加/切换提供商并录入 API Key
- `/models`：选择具体模型（不同提供商会提供不同模型）

> 提示：凭证通常会被安全保存到本地（例如 `~/.local/share/opencode/auth.json`）。

---

## 检查点 ✅

完成任意一个子章节后，你应该能做到：

- [ ] 输入 `/models` 能看到已配置的模型
- [ ] 发送消息后能收到 AI 回复
- [ ] 没有报错（如 `API key invalid` 或 `connection error`）

---

## 下一步该学什么？

当你已经成功完成第一次对话，就可以进入第二阶段：

- [2.1 界面与基础操作](../2-daily/01-interface)
- [2.2 管理对话](../2-daily/02-sessions)
- [3.1 Plan vs Build](../3-workflow/01-plan-build)

::: tip 遇到问题？
连接模型时卡住了？[加入社群](/community)，和 500+ 同路人一起交流，实时答疑。
:::
