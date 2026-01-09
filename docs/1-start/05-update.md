---
title: 自动更新：不用管它
subtitle: OpenCode 默认自动更新，但如果你想知道更多...
course: OpenCode 中文实战课
stage: 第一阶段
lesson: "1.5"
duration: 3 分钟
practice: 2 分钟
level: 新手
description: OpenCode 启动时自动检查并下载新版本，默认开启。本课教你手动更新和配置选项。
tags:
  - 更新
  - 升级
  - 维护
prerequisite:
  - 1.2 安装
---

# 自动更新：不用管它

## 学完你能做什么

- 知道 OpenCode 会自动更新（默认行为）
- 需要时手动更新到最新版本
- 了解如何关闭/开启自动更新

---

## 你现在的困境

- 担心旧版本有 Bug 或安全问题
- 看到有新版本提示，不知道怎么更新
- 想保持最新版本但又怕更新出问题

---

## 什么时候用这一招

- **默认情况**：不用管，OpenCode 会自动更新
- **特殊情况**：需要手动更新、指定版本、禁用自动更新

---

## 🎒 开始前的准备

> 确保你已经完成以下事项：

- [x] 已安装 OpenCode（[1.2 安装](/1-start/02-install)）

---

## 核心思路

1. **默认行为**：OpenCode 启动时自动检查并下载更新
2. **配置控制**：可通过配置文件的 `autoupdate` 选项控制
3. **手动更新**：`opencode upgrade` 命令

---

## 跟我做

### 重要提醒：可以跳过这节课

**为什么？**

OpenCode 默认安装方式（`curl | bash` 或 `brew install`）已经配置好了**自动更新**。每次启动时，它会：
1. 在后台检查新版本
2. 自动下载更新
3. 下次启动时使用新版本

**对你来说**：什么都不用做，它会保持最新版本。

**什么时候需要看这节课？**
- 你想知道更多细节（技术好奇）
- 你需要手动更新到特定版本
- 你想关闭自动更新

---

### 第 1 步：手动更新（可选）

**什么时候需要手动更新？**

- 自动更新失败（网络问题）
- 你想立即升级到最新版本
- 你想升级到特定版本

**升级到最新版本：**

```bash
opencode upgrade
```

**你会看到：**

```
┌  Upgrade
│
●  Using method: curl
●  From 1.1.5 → 1.1.6
◇  Upgrading...
│
└  Upgrade complete
```

**升级到指定版本：**

```bash
opencode upgrade 1.1.5
```

或带 `v` 前缀：

```bash
opencode upgrade v1.1.5
```

**使用特定安装方式更新：**

```bash
opencode upgrade --method npm
```

支持的安装方式：`curl`、`npm`、`pnpm`、`bun`、`brew`

---

### 第 2 步：配置自动更新（可选）

自动更新通过配置文件的 `autoupdate` 字段控制。

**编辑配置文件：**

**macOS/Linux：**

```bash
# 用你喜欢的编辑器打开
vim ~/.config/opencode/opencode.json
# 或
code ~/.config/opencode/opencode.json
```

**Windows：**

```powershell
notepad $env:USERPROFILE\.config\opencode\opencode.json
```

**配置内容：**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "autoupdate": false
}
```

三种值：
- `true`：自动下载更新（默认）
- `false`：不检查更新
- `"notify"`：通知有新版本，但不自动下载

::: tip 环境变量方式
也可以通过环境变量禁用自动更新：
```bash
export OPENCODE_DISABLE_AUTOUPDATE=true
```
:::

---

## 检查点 ✅

> 全部通过才能继续；任一项失败，看下面的"踩坑提醒"

- [ ] 知道 OpenCode 默认会自动更新
- [ ] （可选）知道 `opencode upgrade` 命令
- [ ] （可选）知道如何配置 `autoupdate`

---

## 踩坑提醒

### 问题 1：网络超时，下载失败

**现象：**

```
Error: connect ETIMEDOUT
```

**原因：**
网络不通或连接 GitHub 超时

**解决：**
1. 检查网络
2. 使用代理（见 [1.3 网络配置](./03-network)）
3. 或暂时关闭自动更新，等网络好了再手动更新

---

### 问题 2：想降级到旧版本

**场景：**
新版本有 Bug，想回退

**解决：**

```bash
opencode upgrade 1.1.5
```

降级和升级命令一样，指定旧版本号即可

---

### 问题 3：手动更新提示 "rate limit exceeded"

**现象：**

```
error: rate limit exceeded
```

**原因：**
GitHub API 有请求频率限制：
- 未认证请求：60 次/小时
- 认证请求：5000 次/小时

OpenCode 的 `opencode upgrade` 会调用 GitHub API 检查最新版本，如果短时间内多次调用，就会触发 rate limit 限制。

**解决方法（3 个选项）：**

**方法 1：等待约 1 小时后重试**

```bash
# GitHub API 的 rate limit 每小时重置一次
opencode upgrade
```

**方法 2：手动指定版本号（绕过 API 调用）**

```bash
# 直接指定版本号，不调用 latest() API
opencode upgrade 1.1.6
```

**方法 3：使用 npm 方式安装（如果有 Node.js）**

```bash
# npm registry 没有 rate limit 限制
npm install -g opencode-ai@latest
```

::: tip 如何避免这个问题
- 尽量使用 OpenCode 的自动更新功能，避免频繁手动执行 `opencode upgrade`
- 不要在短时间内多次执行 `opencode upgrade` 命令
:::

---

## 本课小结

你学会了：

1. OpenCode 默认会自动更新，大部分用户不需要关心
2. 需要时可用 `opencode upgrade` 手动更新
3. 可通过配置文件的 `autoupdate` 字段关闭/开启自动更新

---

## 下一课预告

> 下一课我们学习 **[2.1 界面与基础操作](/2-daily/01-interface.md)**，开始真正使用 OpenCode。
>
> 你会学到：
> - 认识 TUI 界面
> - 使用 `@` 引用文件
> - 使用 `!` 执行命令
> - 使用 `/` 斜杠命令
