---
title: B4 CI/CD 集成
subtitle: 在流水线中使用 OpenCode
course: OpenCode 中文实战课
stage: 第四阶段
lesson: "B4"
duration: 20 分钟
practice: 25 分钟
level: 进阶
description: 用 GitHub Agent 把 OpenCode 接入仓库，在 Issue/PR 评论用 /oc 或 /opencode 触发，让任务在 GitHub Actions runner 中自动执行。
tags:
  - CI/CD
  - GitHub Actions
  - 自动化
prerequisite:
  - B1 开发日常
---

# B4 CI/CD 集成

> 💡 **一句话总结**：用 GitHub Agent 把 OpenCode 接入仓库；在评论里用 `/oc` 或 `/opencode` 触发。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/4-scenarios/coder-cicd-notes.mini.jpeg"
     alt="B4 CI/CD 集成学霸笔记"
     data-zoom-src="/images/4-scenarios/coder-cicd-notes.jpeg" />

---

## 学完你能做什么

- 一键安装 GitHub Agent（自动生成 workflow）
- 在 Issue/PR 评论中触发 OpenCode 自动执行任务
- 用 GitHub Secrets 管理 API Key（不硬编码）

---

## 核心思路（最佳实践）

- **优先用 GitHub Agent**：不自己在 workflow 里手写“安装 CLI + 跑脚本 + 发评论”的胶水代码。
- **触发方式统一**：在评论里写 `/oc` 或 `/opencode`，让 Actions runner 执行。

官方说明：https://opencode.ai/docs/github

---

## 跟我做

### 第 1 步：运行安装向导

在你的 GitHub 仓库根目录执行：

```bash
opencode github install
```

安装向导会引导你完成：安装 GitHub App、生成 workflow 文件、提示需要配置哪些 secrets。

### 第 2 步：提交并推送 workflow

把生成的 workflow 文件提交并推送到仓库（通常是 `.github/workflows/opencode.yml`）。

### 第 3 步：用评论触发

在 Issue 或 PR 里评论（示例）：

```text
/oc summarize
```

或者：

```text
/opencode summarize
```

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 评论里写了内容但没触发 | 没用 `/oc` 或 `/opencode` | 把触发短语写在评论里（例如 `/oc summarize`） |
| Action 运行但提示缺少 API Key | 没把 provider 的 API key 配到 GitHub Secrets | 按安装向导提示，把密钥加到仓库/组织的 Secrets，再重试 |
| 你担心权限太大 | workflow 权限配置不明确 | 先按官方文档示例配置，再按你的仓库策略收紧 |

---

## 延伸阅读

- 官方 GitHub 集成文档：https://opencode.ai/docs/github
- CLI `opencode run`（非 GitHub 场景的脚本自动化）：[附录/CLI 命令参考](../appendix/cli)

---

## 下一课预告

> 下一课我们将学习如何创建专属开发 Agent，如 Code Reviewer、Security Auditor。