---
title: 5.16 会话分享
subtitle: 创建公开对话链接
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.16"
duration: 10 分钟
level: 进阶
description: 创建 OpenCode 对话的公开链接，便于团队协作和寻求帮助。
tags:
  - 分享
  - 协作
prerequisite:
  - 5.1 配置全解
---

# 会话分享

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/share-notes.mini.jpeg" 
     alt="5.16 会话分享学霸笔记" 
     data-zoom-src="/images/5-advanced/share-notes.jpeg" />

OpenCode 的分享功能允许你创建对话的公开链接，便于与团队协作或寻求帮助。

> 分享的对话可被任何拥有链接的人公开访问。

## 工作原理

分享对话时，OpenCode 会：

1. 为会话创建唯一的公开 URL
2. 将对话历史同步到服务器
3. 通过可分享链接访问对话：`opncd.ai/s/<share-id>`

## 分享模式

OpenCode 支持三种分享模式：

### 手动模式（默认）

默认使用手动分享模式。会话不会自动分享，但你可以使用 `/share` 命令手动分享：

```
/share
```

这会生成一个唯一 URL 并复制到剪贴板。

在配置文件中明确设置手动模式：

```json
{
  "$schema": "https://opncd.ai/config.json",
  "share": "manual"
}
```

### 自动分享

通过在配置文件中将 `share` 设置为 `"auto"` 来启用所有新对话的自动分享：

```json
{
  "$schema": "https://opncd.ai/config.json",
  "share": "auto"
}
```

启用自动分享后，每个新对话都会自动分享并生成链接。

### 禁用分享

通过将 `share` 设置为 `"disabled"` 完全禁用分享：

```json
{
  "$schema": "https://opncd.ai/config.json",
  "share": "disabled"
}
```

要在团队中强制执行此设置，可将其添加到项目的 `opencode.json` 并提交到 Git。

## 取消分享

要停止分享对话并从公开访问中移除：

```
/unshare
```

这会移除分享链接并删除与对话相关的数据。

## 隐私注意事项

分享对话时需要注意：

### 数据保留

分享的对话在你明确取消分享前保持可访问，包括：

- 完整对话历史
- 所有消息和响应
- 会话元数据

### 建议

- 只分享不包含敏感信息的对话
- 分享前检查对话内容
- 协作完成后取消分享
- 避免分享包含专有代码或机密数据的对话
- 对于敏感项目，完全禁用分享

## 企业版

对于企业部署，分享功能可以：

- **完全禁用**以符合安全合规
- **限制**为仅通过 SSO 认证的用户可用
- **自托管**在你自己的基础设施上

了解更多关于 [企业版](11-enterprise.md) 的信息。
