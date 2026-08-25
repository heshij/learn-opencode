---
title: "CLI 自动化：让 OpenCode 跑在脚本里 | OpenCode 教程"
subtitle: "CLI 自动化"
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.24"
duration: 25 分钟
practice: 30 分钟
level: 进阶
description: 学习用命令行自动化 OpenCode，包括非交互模式、远程服务器、CI/CD 集成，让你的工作流全自动运转。
tags:
  - CLI
  - 自动化
  - CI/CD
  - 远程访问
prerequisite:
  - 5.1a 配置基础
  - 2.2 管理对话
---

# CLI 自动化：让 OpenCode 跑在脚本里

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/24-cli-automation-notes.mini.jpeg"
     alt="CLI 自动化学霸笔记"
     data-zoom-src="/images/5-advanced/24-cli-automation-notes.jpeg" />

---

## 学完你能做什么

- 在脚本里调用 OpenCode，无需人工干预
- 启动远程服务器，让团队成员共享同一个 AI 会话
- 把 OpenCode 嵌入 CI/CD 流水线，自动审查代码
- 一键拉取 PR 并启动对应的 OpenCode 会话

---

## 你现在的困境

- 每次都要打开 TUI 手动输入命令，重复劳动太多
- 想在服务器上跑 OpenCode，但没有图形界面
- CI/CD 里想自动让 AI 检查代码，不知道怎么集成
- 团队协作时，想让大家连到同一个 OpenCode 实例

---

## 什么时候用这一招

- **脚本自动化**：批量处理多个项目、定时任务
- **CI/CD 集成**：代码审查、自动修复、生成文档
- **远程开发**：在服务器上运行，本地终端连接
- **团队协作**：共享 OpenCode 实例，协同编辑

---

## 🎒 开始前的准备

- [ ] 完成了 [5.1a 配置基础](./01a-config-basics)
- [ ] 能在终端里运行 `opencode` 启动 TUI
- [ ] 了解基本的 Shell 命令（`cd`、`echo`、管道）

---

## 核心思路

OpenCode 提供了四类终端使用方式：

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        OpenCode 使用方式                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────┐              ┌─────────────────┐                  │
│   │   交互模式 TUI   │              │  非交互模式 CLI  │                  │
│   │                 │              │                 │                  │
│   │  opencode       │              │  opencode run   │                  │
│   │                 │              │                 │                  │
│   │  • 适合日常开发  │              │  • 适合脚本     │                  │
│   │  • 实时对话     │              │  • 适合 CI/CD   │                  │
│   │  • 人工决策     │              │  • 自动化流程   │                  │
│   └─────────────────┘              └─────────────────┘                  │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                      精简交互模式                                 │   │
│   │                                                                   │   │
│   │  opencode --mini   →  精简界面，适合连续对话与 Shell 操作         │   │
│   │                                                                   │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                      服务器模式                                   │   │
│   │                                                                   │   │
│   │  opencode serve    →  启动无头服务器（只有 API）                   │   │
│   │  opencode web      →  启动 Web 界面服务器                         │   │
│   │  opencode attach   →  连接远程服务器                              │   │
│   │                                                                   │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**关键区别**：

| 模式 | 命令 | 特点 |
|------|------|------|
| TUI | `opencode` | 交互式，适合人工操作 |
| Mini | `opencode --mini` | 精简交互界面，保留连续输入与会话回放 |
| Run | `opencode run` | 非交互式，执行完退出 |
| Serve | `opencode serve` | 无头服务器，只暴露 API |
| Web | `opencode web` | 带 Web 界面的服务器 |

### 精简交互模式：opencode --mini

`opencode --mini` 是精简交互界面的公开入口。不要写成 `opencode run --mini`；`opencode run` 默认仍是执行一次任务后退出的非交互命令。

```bash
# 启动精简交互界面
opencode --mini

# 继续最近会话；默认回放会话历史，并在终端缩放后重新回放
opencode --mini --continue

# 继续会话，但关闭历史回放
opencode --mini --continue --no-replay
```

在 Mini 输入框开头输入 `!` 会进入 **Shell mode**。继续输入命令并提交即可执行；按 <kbd>Esc</kbd> 可直接退出，或在光标位于输入开头时按 <kbd>Backspace</kbd> 退出。

---

## 第一部分：非交互模式 opencode run

### 1.1 基本用法

`opencode run` 是最常用的 CLI 命令。即使从终端直接运行，它默认也不会进入交互界面，而是执行完任务后自动退出。

```bash
# 最简单的用法
opencode run "列出这个项目里所有的 TypeScript 文件"

# 你会看到：
# > opencode · anthropic/claude-sonnet-4-5
# 
# ✱ Glob "**/*.ts" in . · 12 matches
# 
# 这个项目中有 12 个 TypeScript 文件：
# - src/index.ts
# - src/utils.ts
# ...
```

### 1.2 常用选项

| 选项 | 说明 | 示例 |
|------|------|------|
| `-m, --model` | 指定模型 | `-m anthropic/claude-opus-4-5` |
| `--agent` | 指定 Agent | `--agent code-reviewer` |
| `-f, --file` | 附加文件 | `-f src/main.ts -f package.json` |
| `-c, --continue` | 继续上次会话 | `-c` |
| `-s, --session` | 指定会话 ID | `-s session_abc123` |
| `--format json` | JSON 格式输出 | `--format json` |
| `--share` | 自动分享会话 | `--share` |
| `--title` | 设置会话标题 | `--title "修复登录 Bug"` |

### 1.3 实战示例

#### 示例 1：代码审查脚本

```bash
#!/bin/bash
# code-review.sh - 自动审查当前分支的变更

# 获取变更的文件列表
CHANGED_FILES=$(git diff --name-only main)

# 如果没有变更，退出
if [ -z "$CHANGED_FILES" ]; then
  echo "没有发现变更"
  exit 0
fi

# 对每个文件进行审查
for file in $CHANGED_FILES; do
  echo "审查: $file"
  opencode run -f "$file" "请审查这个文件的代码质量，重点关注：1) 潜在 Bug 2) 性能问题 3) 代码风格"
done
```

#### 示例 2：从 stdin 读取

```bash
# 管道输入
cat error.log | opencode run "分析这个错误日志，找出根本原因"

# 结合 git diff
git diff main | opencode run "检查这些变更是否有问题"
```

#### 示例 3：JSON 格式输出（适合脚本解析）

```bash
# 获取 JSON 格式的输出
opencode run --format json "列出所有 TODO 注释" > todos.json

# JSON 输出格式示例：
# {"type":"text","timestamp":1705316400000,"sessionID":"xxx","part":{"text":"找到 5 个 TODO..."}}
```

---

## 第二部分：服务器模式

### 2.1 启动远程服务器

::: info 🤔 什么时候需要远程服务器？
- **共享会话**：团队成员连接同一个 OpenCode 实例
- **服务器开发**：在远程服务器上运行，本地终端连接
- **避免冷启动**：保持 MCP 服务器常驻，`opencode run --attach` 直接连入
:::

#### opencode serve（无头模式）

```bash
# 启动无头服务器（只有 API，没有界面）
opencode serve

# 你会看到：
# Warning: OPENCODE_SERVER_PASSWORD is not set; server is unsecured.
# opencode server listening on http://localhost:4096
```

::: warning ⚠️ 安全警告
默认情况下，`opencode serve` **没有认证保护**。

但默认只监听 `127.0.0.1`（localhost），外部网络无法直接访问。只有当你：
- 使用 `--hostname 0.0.0.0` 开放所有网络接口
- 服务器有公网 IP 且防火墙开放端口

...才会面临安全风险。

**开放外网访问时必须设置密码**：
```bash
# 设置服务器密码
export OPENCODE_SERVER_PASSWORD=your-secure-password

# 然后启动
opencode serve
# 现在访问需要认证了
```
:::

#### opencode web（Web 界面模式）

```bash
# 启动带 Web 界面的服务器
opencode web

# 你会看到：
# Warning: OPENCODE_SERVER_PASSWORD is not set; server is unsecured.
# 
#   Local access:      http://localhost:4096
#   Network access:    http://192.168.1.100:4096
```

### 2.2 服务器选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--port` | 监听端口 | 自动（优先 4096） |
| `--hostname` | 监听地址 | 127.0.0.1 |
| `--mdns` | 启用 mDNS 服务发现 | false |
| `--mdns-domain` | mDNS 域名 | opencode.local |
| `--cors` | CORS 白名单域名 | - |

```bash
# 监听所有网络接口（允许局域网访问）
opencode serve --hostname 0.0.0.0

# 指定端口
opencode serve --port 8080

# 启用 mDNS 发现（局域网内可通过 opencode.local 访问）
opencode serve --hostname 0.0.0.0 --mdns
```

### 2.3 安全配置

**环境变量**：

| 变量 | 说明 |
|------|------|
| `OPENCODE_SERVER_PASSWORD` | 服务器密码 |
| `OPENCODE_SERVER_USERNAME` | 用户名（默认 opencode） |

```bash
# 设置密码和用户名
export OPENCODE_SERVER_USERNAME=admin
export OPENCODE_SERVER_PASSWORD=MySecurePassword123!

opencode serve --hostname 0.0.0.0
```

::: info 💡 为什么只能用环境变量？
密码相关的配置**不支持放在 `opencode.json` 配置文件中**，只能通过环境变量设置。

这是出于安全考虑——避免密码被意外提交到 Git 仓库。

全局配置文件 `~/.config/opencode/opencode.json` 只支持以下服务器选项：
```json
{
  "server": {
    "port": 4096,
    "hostname": "0.0.0.0",
    "mdns": true,
    "mdnsDomain": "opencode.local",
    "cors": ["http://example.com"]
  }
}
```
:::

### 2.4 连接远程服务器

#### 用 attach 连接

```bash
# 在本地连接远程服务器
opencode attach http://192.168.1.100:4096

# 指定工作目录
opencode attach http://192.168.1.100:4096 --dir /projects/myapp
```

#### 用 run 连接

```bash
# 先在服务器上启动
opencode serve --hostname 0.0.0.0

# 在另一台机器上连接并执行
opencode run --attach http://192.168.1.100:4096 "分析这个项目的架构"
```

---

## 第三部分：CI/CD 集成

### 3.1 GitHub Actions 示例

```yaml
# .github/workflows/ai-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup OpenCode
        run: |
          curl -fsSL https://raw.githubusercontent.com/anomalyco/opencode/main/install | bash
          echo "$HOME/.opencode/bin" >> $GITHUB_PATH
      
      - name: AI Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # 获取变更的文件
          FILES=$(git diff --name-only origin/main...HEAD | head -10)
          
          for file in $FILES; do
            echo "审查: $file"
            opencode run -f "$file" --title "AI Review: $file" \
              "作为代码审查员，审查这个文件的变更。关注：
              1. 潜在的 Bug 或安全问题
              2. 代码可读性和维护性
              3. 是否符合最佳实践
              
              输出格式：
              - 🟢 通过
              - 🟡 建议改进
              - 🔴 必须修复"
          done
```

### 3.2 GitLab CI 示例

```yaml
# .gitlab-ci.yml
ai-review:
  stage: test
  image: node:20
  script:
    - curl -fsSL https://raw.githubusercontent.com/anomalyco/opencode/main/install | bash
    - export PATH="$HOME/.opencode/bin:$PATH"
    - |
      git diff --name-only origin/main...$CI_COMMIT_SHA | while read file; do
        opencode run -f "$file" "审查代码：$file"
      done
  only:
    - merge_requests
```

### 3.3 自动化脚本模板

```bash
#!/bin/bash
# auto-fix.sh - 自动修复代码风格问题

set -e

# 检查是否有未提交的变更
if ! git diff --quiet; then
  echo "错误：有未提交的变更，请先提交或暂存"
  exit 1
fi

# 获取所有需要检查的文件
FILES=$(find src -name "*.ts" -o -name "*.tsx")

for file in $FILES; do
  echo "处理: $file"
  
  opencode run -f "$file" \
    "请修复这个文件的代码风格问题，但不要改变功能逻辑。重点关注：
    1. 变量命名规范
    2. 代码缩进和格式
    3. 移除未使用的导入
    4. 添加必要的注释"
done

echo "所有文件处理完成"
```

---

## 第四部分：opencode pr 命令

### 4.1 功能介绍

`opencode pr` 是一个专门处理 GitHub PR 的命令，它会：

1. 拉取指定的 PR 到本地
2. 自动创建分支 `pr/<PR号>`
3. 如果 PR 描述里有 OpenCode 会话链接，自动导入

```bash
# 拉取 PR 并启动 OpenCode
opencode pr 123

# 你会看到：
# Fetching and checking out PR #123...
# Successfully checked out PR #123 as branch 'pr/123'
# 
# Starting opencode...
```

### 4.2 使用场景

| 场景 | 说明 |
|------|------|
| 审查别人的 PR | 一键拉取，直接在 OpenCode 里审查 |
| 继续之前的会话 | PR 作者分享了会话链接，你可以恢复上下文 |
| 处理 Fork PR | 自动添加 Fork 远程仓库，正确设置上游 |

### 4.3 前置条件

```bash
# 确保已安装 gh CLI
gh --version

# 确保已认证
gh auth status
```

::: details 如何安装 gh CLI
```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Windows
winget install GitHub.cli
```
:::

---

## 第五部分：会话管理 CLI

### 5.1 列出会话

```bash
# 列出所有会话
opencode session list

# 你会看到：
# Session ID              Title                      Updated
# ─────────────────────────────────────────────────────────────
# session_abc123          Fix login bug              Today 14:30
# session_def456          Add user profile           Yesterday

# 限制数量
opencode session list -n 10

# JSON 格式（适合脚本）
opencode session list --format json
```

### 5.2 导出会话

```bash
# 导出指定会话
opencode export session_abc123 > backup.json

# 不指定 ID 会交互式选择
opencode export > backup.json
```

### 5.3 导入会话

```bash
# 从文件导入
opencode import backup.json

# 从分享链接导入
opencode import https://opncd.ai/share/abc123
```

---

## 第六部分：其他实用命令

### 6.1 opencode models

```bash
# 列出所有可用模型
opencode models

# 列出特定提供商的模型
opencode models anthropic

# 显示详细信息（包括价格）
opencode models --verbose

# 刷新模型缓存
opencode models --refresh
```

### 6.2 opencode stats

```bash
# 查看使用统计
opencode stats

# 查看最近 7 天
opencode stats --days 7

# 查看模型使用明细
opencode stats --models

# 只看当前项目
opencode stats --project ""
```

### 6.3 opencode upgrade / uninstall

```bash
# 升级到最新版本
opencode upgrade

# 升级到指定版本
opencode upgrade 0.1.50

# 使用指定方式安装
opencode upgrade --method npm

# 卸载（保留配置）
opencode uninstall --keep-config

# 预览将删除的内容
opencode uninstall --dry-run
```

---

## 检查点 ✅

- [ ] 能用 `opencode run` 执行一次性任务
- [ ] 能用 `opencode serve` 启动远程服务器并设置密码
- [ ] 能用 `opencode attach` 连接远程服务器
- [ ] 能用 `opencode pr` 拉取并处理 GitHub PR
- [ ] 能用 `opencode session list` 查看会话历史
- [ ] 能用 `opencode export/import` 备份恢复会话

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|------|------|------|
| `opencode serve` 报错 "address already in use" | 端口被占用 | 换个端口：`--port 8080` |
| 远程连接被拒绝 | 防火墙或 hostname 设置 | 确认 `--hostname 0.0.0.0`，检查防火墙 |
| `opencode pr` 报错 "gh CLI not found" | 未安装 GitHub CLI | 先安装 gh 并认证 |
| `opencode run` 一直等待 | AI 在执行长时间任务 | 脚本里加超时：`timeout 60 opencode run ...` |
| JSON 输出解析失败 | 输出包含多行 JSON | 按换行分割，每行是一个 JSON 对象 |
| 服务器无认证警告 | 没有设置密码 | `export OPENCODE_SERVER_PASSWORD=xxx` |

---

## 本课小结

你学会了：

1. **非交互模式**：用 `opencode run` 在脚本里调用 OpenCode
2. **服务器模式**：用 `opencode serve/web` 启动远程服务
3. **安全配置**：设置 `OPENCODE_SERVER_PASSWORD` 保护服务器
4. **CI/CD 集成**：把 OpenCode 嵌入自动化流程
5. **PR 处理**：用 `opencode pr` 一键拉取并处理 PR
6. **会话管理**：用 CLI 命令列出、导出、导入会话

---

## 下一课预告

> 本课是进阶手册的最后一课。接下来你可以：
> - 回顾 [速查手册](/appendix/) 中的 CLI 命令参考
> - 尝试 [场景实战](/4-scenarios/) 中的 CI/CD 集成案例
> - 深入学习 [SDK 开发](/5-advanced/10a-sdk-basics) 编写自己的集成工具

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 版本基准：[`v1.18.22`](https://github.com/anomalyco/opencode/tree/v1.18.22)

| 功能 | 文件路径 | 行号 |
|-----|---------|------|
| `run` 默认非交互与 Mini 入口 | [`packages/opencode/src/cli/cmd/run.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/run.ts#L3-L15) | 3-15 |
| `--mini`、`--no-replay` 参数与入口转发 | [`packages/opencode/src/cli/cmd/tui.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/tui.ts#L123-L175) | 123-175 |
| Mini Shell mode | [`packages/opencode/src/cli/cmd/run/footer.prompt.tsx`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/run/footer.prompt.tsx#L1055-L1094) | 1055-1094 |
| `opencode serve` 命令实现 | [`packages/opencode/src/cli/cmd/serve.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/serve.ts#L6-L24) | 6-24 |
| `opencode web` 命令实现 | [`packages/opencode/src/cli/cmd/web.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/web.ts#L31-L84) | 31-84 |
| `opencode pr` 命令实现 | [`packages/opencode/src/cli/cmd/pr.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/pr.ts#L8-L115) | 8-115 |
| 服务器认证环境变量 | [`packages/core/src/flag/flag.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/flag/flag.ts#L32-L33) | 32-33 |
| 服务器认证逻辑 | [`packages/opencode/src/server/auth.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/auth.ts#L17-L47) | 17-47 |

**关键环境变量**：
- `OPENCODE_SERVER_PASSWORD`：服务器密码
- `OPENCODE_SERVER_USERNAME`：服务器用户名（默认 opencode）

</details>
