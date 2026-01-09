---
title: 5.14 GitHub 集成
subtitle: 在 GitHub Actions 中使用 OpenCode
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.14"
duration: 15 分钟
practice: 20 分钟
level: 进阶
description: 在 GitHub Actions 中使用 OpenCode，实现 Issue 分流、自动修复、PR 审查等功能。
tags:
  - GitHub
  - CI/CD
  - 自动化
prerequisite:
  - 5.9 远程开发
---

# GitHub 集成

OpenCode 与 GitHub 工作流深度集成。在 Issue 或 PR 的评论中提及 `/opencode` 或 `/oc`，OpenCode 将在你的 GitHub Actions runner 中执行任务。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/github-notes.mini.jpeg"
     alt="5.14 GitHub 集成学霸笔记"
     data-zoom-src="/images/5-advanced/github-notes.jpeg" />

## 功能

- **分流问题**：让 OpenCode 查看 Issue 并解释问题
- **修复和实现**：让 OpenCode 修复 Issue 或实现功能，它会在新分支中工作并提交 PR
- **审查 PR**：自动审查 Pull Request 代码质量
- **安全**：OpenCode 在你自己的 GitHub runner 中运行，代码不会离开你的环境

## 安装

在 GitHub 仓库的项目目录中运行：

```bash
opencode github install
```

这会引导你完成：安装 GitHub App、选择提供商和模型、创建 workflow 文件、设置 secrets。

### 手动设置

也可以手动设置：

**1. 安装 GitHub App**

前往 [github.com/apps/opencode-agent](https://github.com/apps/opencode-agent)，确保在目标仓库上安装。

**2. 添加 workflow**

在仓库的 `.github/workflows/opencode.yml` 添加以下内容：

```yaml
name: opencode

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  opencode:
    if: |
      contains(github.event.comment.body, ' /oc') ||
      startsWith(github.event.comment.body, '/oc') ||
      contains(github.event.comment.body, ' /opencode') ||
      startsWith(github.event.comment.body, '/opencode')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      pull-requests: read
      issues: read
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Run OpenCode
        uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
```

> **注意**：if 条件使用 `startsWith` 和 `contains(' /oc')` 的组合，确保触发短语在行首或前面有空格，避免误匹配 URL 或代码中的内容。

**3. 存储 API 密钥**

在组织或项目的 **Settings** > **Secrets and variables** > **Actions** 中添加所需的 API 密钥。

## 配置选项

| 选项 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `model` | **是** | - | 使用的模型，格式为 `provider/model` |
| `agent` | 否 | config 中的 `default_agent` 或 `"build"` | 使用的代理，必须是 primary 代理 |
| `share` | 否 | 公开仓库 `true` | 是否分享会话链接 |
| `prompt` | 否 | - | 自定义提示，覆盖默认行为（`schedule`/`workflow_dispatch`/`issues` 事件必填） |
| `use_github_token` | 否 | `false` | 使用 GITHUB_TOKEN 替代 OpenCode App 令牌交换，跳过 OIDC |
| `mentions` | 否 | `/opencode,/oc` | 自定义触发短语（逗号分隔，不区分大小写） |
| `oidc_base_url` | 否 | `https://api.opencode.ai` | 自定义 OIDC 令牌交换 API 地址，仅运行私有 GitHub App 时需要 |

来源：`opencode/github/action.yml:7-35`

### 关于 Token 来源

默认情况下，OpenCode 使用 OIDC 令牌交换从 OpenCode GitHub App 获取安装访问令牌，提交、评论和 PR 显示为来自该应用。

**替代方案 1：使用 GITHUB_TOKEN**

设置 `use_github_token: true` 可跳过 OIDC 令牌交换，直接使用 GitHub Action runner 的内置 GITHUB_TOKEN：

```yaml
- name: Run OpenCode
  uses: anomalyco/opencode/github@latest
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    model: anthropic/claude-sonnet-4-20250514
    use_github_token: true
```

需要在 workflow 中授予权限：

```yaml
permissions:
  id-token: write
  contents: write
  pull-requests: write
  issues: write
```

**替代方案 2：使用个人访问令牌 (PAT)**

也可以使用 [个人访问令牌](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)。

## 工作机制

### 事件分类

OpenCode 将 GitHub 事件分为两类，处理逻辑不同：

| 类别 | 事件类型 | 特点 |
|------|----------|------|
| **用户事件** | `issue_comment`、`pull_request_review_comment`、`issues`、`pull_request` | 有触发者信息，可以在 Issue/PR 上添加评论和 reaction |
| **仓库事件** | `schedule`、`workflow_dispatch` | 无 Issue/PR 上下文，输出仅记录到日志或创建 PR |

来源：`opencode/packages/opencode/src/cli/cmd/github.ts:141-143`

### 处理流程

```
1. 事件触发
   ↓
2. 检查触发短语 (/opencode 或 /oc)
   ↓
3. 获取访问令牌 (OIDC 交换 或 GITHUB_TOKEN)
   ↓
4. 权限验证 (仅用户事件，需要 admin 或 write 权限)
   ↓
5. 添加 👀 reaction (仅用户事件，表示正在处理)
   ↓
6. 根据事件类型处理：
   - Issue: 创建新分支 → 执行任务 → 提交 → 创建 PR
   - 本地 PR: 检出分支 → 执行任务 → 提交到同一 PR
   - Fork PR: 添加 fork remote → 执行任务 → 推送到 fork
   - 仓库事件: 创建新分支 → 执行任务 → 创建 PR
   ↓
7. 创建评论并移除 reaction
```

### 分支命名规则

OpenCode 自动创建的分支遵循以下命名规则：

| 场景 | 分支名格式 | 示例 |
|------|-----------|------|
| Issue 修复 | `opencode/issue{ID}-{timestamp}` | `opencode/issue42-20250108120000` |
| PR 操作 | `opencode/pr{ID}-{timestamp}` | `opencode/pr15-20250108120000` |
| 定时任务 | `opencode/schedule-{hex}-{timestamp}` | `opencode/schedule-a1b2c3-20250108120000` |
| 手动触发 | `opencode/dispatch-{hex}-{timestamp}` | `opencode/dispatch-d4e5f6-20250108120000` |

来源：`github.ts:1047-1059`

### Co-author 归属

OpenCode 提交的代码会自动添加 Co-authored-by 信息，将触发者标记为共同作者：

```
Fix authentication issue

Co-authored-by: username <username@users.noreply.github.com>
```

> **注意**：`schedule` 事件没有触发者，因此不会添加 Co-author 信息。

来源：`github.ts:1061-1100`

## 权限配置详解

根据使用场景，需要配置不同的权限级别：

### 只读场景（审查、分析）

```yaml
permissions:
  id-token: write      # OIDC 令牌交换必需
  contents: read       # 读取代码
  pull-requests: read  # 读取 PR 信息
  issues: read         # 读取 Issue 信息
```

### 写入场景（修复、实现）

```yaml
permissions:
  id-token: write       # OIDC 令牌交换必需
  contents: write       # 创建分支、提交代码
  pull-requests: write  # 创建/更新 PR
  issues: write         # 创建评论
```

> **提示**：使用 OpenCode GitHub App 时，权限由 App 控制。使用 `use_github_token: true` 时，需要在 workflow 中明确授予权限。

## 支持的事件

| 事件类型 | 触发方式 | 说明 |
|----------|----------|------|
| `issue_comment` | Issue 或 PR 上的评论 | 在评论中提及 `/opencode` 或 `/oc` |
| `pull_request_review_comment` | PR 中特定代码行的评论 | 代码审查时提及触发短语 |
| `issues` | Issue 创建或编辑 | 需要 `prompt` 输入 |
| `pull_request` | PR 创建或更新 | 用于自动审查 |
| `schedule` | 基于 cron 的定时任务 | 需要 `prompt` 输入，无评论输出 |
| `workflow_dispatch` | 从 GitHub UI 手动触发 | 需要 `prompt` 输入 |

### 定时任务示例

```yaml
name: Scheduled OpenCode Task

on:
  schedule:
    - cron: "0 9 * * 1" # 每周一 UTC 9:00

jobs:
  opencode:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
      issues: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Run OpenCode
        uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          prompt: |
            Review the codebase for any TODO comments and create a summary.
            If you find issues worth addressing, open an issue to track them.
```

> **注意**：定时事件需要 `prompt` 输入，因为没有评论可提取指令。输出记录到 Actions 日志，如有代码更改会创建 PR。

### PR 自动审查示例

```yaml
name: opencode-review

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      pull-requests: read
      issues: read
    steps:
      - uses: actions/checkout@v6
      - uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          prompt: |
            Review this pull request:
            - Check for code quality issues
            - Look for potential bugs
            - Suggest improvements
```

对于 `pull_request` 事件，如果未提供 `prompt`，OpenCode 默认审查 PR。

### Issue 分流示例

自动分流新 Issue，此示例过滤账号年龄超过 30 天的用户以减少垃圾信息：

```yaml
name: Issue Triage

on:
  issues:
    types: [opened]

jobs:
  triage:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
      issues: write
    steps:
      - name: Check account age
        id: check
        uses: actions/github-script@v7
        with:
          script: |
            const user = await github.rest.users.getByUsername({
              username: context.payload.issue.user.login
            });
            const created = new Date(user.data.created_at);
            const days = (Date.now() - created) / (1000 * 60 * 60 * 24);
            return days >= 30;
          result-encoding: string

      - uses: actions/checkout@v6
        if: steps.check.outputs.result == 'true'

      - uses: anomalyco/opencode/github@latest
        if: steps.check.outputs.result == 'true'
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          prompt: |
            Review this issue. If there's a clear fix or relevant docs:
            - Provide documentation links
            - Add error handling guidance for code examples
            Otherwise, do not comment.
```

## 自定义触发短语

使用 `mentions` 参数自定义触发短语：

```yaml
- uses: anomalyco/opencode/github@latest
  with:
    model: anthropic/claude-sonnet-4-20250514
    mentions: "/ai,/bot,/help"
```

现在可以使用 `/ai`、`/bot` 或 `/help` 触发 OpenCode。

> **注意**：触发短语匹配不区分大小写，多个短语用逗号分隔。

## Fork PR 处理

OpenCode 支持处理来自 Fork 仓库的 PR。处理逻辑与本地 PR 略有不同：

### 本地 PR vs Fork PR

| 对比项 | 本地 PR | Fork PR |
|--------|---------|---------|
| 分支来源 | 同一仓库 | Fork 仓库 |
| 检出方式 | `git fetch origin && git checkout` | `git remote add fork && git fetch fork` |
| 推送目标 | 原分支 | Fork 仓库的分支 |
| 分支名 | 保持原分支名 | 创建新的本地分支 `opencode/pr{ID}-{timestamp}` |

### 工作流程

1. 检测 PR 的 `headRepository` 是否与 `baseRepository` 不同
2. 添加 Fork 仓库作为 remote
3. 拉取 Fork 分支代码
4. 创建本地分支执行任务
5. 推送更改回 Fork 仓库的原分支

来源：`github.ts:1035-1045`

> **注意**：Fork PR 需要 Fork 仓库的维护者允许上游仓库推送更改（在 PR 页面勾选 "Allow edits from maintainers"）。

## CLI 命令

### opencode github install

交互式安装 GitHub Agent：

```bash
opencode github install
```

执行流程：
1. 检测当前目录的 Git 仓库信息
2. 引导安装 OpenCode GitHub App
3. 选择 AI 提供商和模型
4. 生成 `.github/workflows/opencode.yml` 文件
5. 提示配置 secrets

### opencode github run

在 GitHub Actions 中运行 Agent（通常不需要手动调用）：

```bash
opencode github run
```

#### 本地测试

用于开发调试时本地模拟 GitHub Actions 环境：

```bash
MODEL=anthropic/claude-sonnet-4-20250514 \
  ANTHROPIC_API_KEY=sk-ant-api03-xxxxx \
  GITHUB_RUN_ID=dummy \
  opencode github run \
    --token github_pat_xxxxx \
    --event '{"eventName":"issue_comment","repo":{"owner":"你的用户名","repo":"仓库名"},"actor":"触发者用户名","payload":{"issue":{"number":1},"comment":{"id":1,"body":"/opencode 解释这个问题"}}}'
```

参数说明：

| 环境变量/参数 | 说明 |
|--------------|------|
| `MODEL` | 使用的模型，格式 `provider/model` |
| `ANTHROPIC_API_KEY` | 模型提供商 API 密钥 |
| `GITHUB_RUN_ID` | 模拟 GitHub Actions 环境，本地测试可设为 `dummy` |
| `--token` | GitHub 个人访问令牌，用于验证权限和操作仓库 |
| `--event` | 模拟的 GitHub 事件 JSON |

#### 事件 JSON 模板

**Issue 评论事件：**

```json
{
  "eventName": "issue_comment",
  "repo": {"owner": "owner", "repo": "repo-name"},
  "actor": "username",
  "payload": {
    "issue": {"number": 42},
    "comment": {"id": 1, "body": "/opencode 解释这个问题"}
  }
}
```

**PR 评论事件：**

```json
{
  "eventName": "issue_comment",
  "repo": {"owner": "owner", "repo": "repo-name"},
  "actor": "username",
  "payload": {
    "issue": {"number": 15, "pull_request": {}},
    "comment": {"id": 1, "body": "/opencode 优化这段代码"}
  }
}
```

**PR 代码行评论事件：**

```json
{
  "eventName": "pull_request_review_comment",
  "repo": {"owner": "owner", "repo": "repo-name"},
  "actor": "username",
  "payload": {
    "pull_request": {"number": 15},
    "comment": {
      "id": 1,
      "body": "/opencode 添加错误处理",
      "path": "src/utils/api.ts",
      "diff_hunk": "@@ -10,6 +10,8 @@\n async function fetchData() {\n-  return fetch(url)\n+  const response = await fetch(url)\n+  return response.json()\n }",
      "line": 12,
      "original_line": 10,
      "position": 5,
      "commit_id": "abc123",
      "original_commit_id": "def456"
    }
  }
}
```

## 使用示例

### 解释 Issue

在 GitHub Issue 中添加评论：

```
/opencode explain this issue
```

OpenCode 会读取整个线程（包括所有评论）并回复解释。

### 修复 Issue

在 GitHub Issue 中：

```
/opencode fix this
```

OpenCode 会创建新分支、实现修改并打开 PR。

### 审查 PR 并修改

在 GitHub PR 中留下评论：

```
Delete the attachment from S3 when the note is removed /oc
```

OpenCode 会实现请求的更改并提交到同一 PR。

### 审查特定代码行

在 PR 的 "Files" 标签页中直接在代码行上留下评论。OpenCode 会自动检测文件、行号和 diff 上下文：

```
[在 Files 标签页的特定行上评论]
/oc add error handling here
```

在特定行评论时，OpenCode 接收：
- 正在审查的确切文件
- 特定的代码行
- 周围的 diff 上下文
- 行号信息

这允许更精准的请求，无需手动指定文件路径或行号。

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 报错 `Could not fetch an OIDC token` | workflow 缺少 `id-token: write` 权限 | 添加 `permissions: id-token: write` |
| `/opencode` 没有触发 | 评论中的触发短语格式不对（如在 URL 中间） | 确保触发短语在行首或前面有空格 |
| Fork PR 无法推送更改 | Fork 维护者未允许上游推送 | 联系 Fork 维护者开启 "Allow edits from maintainers" |
| Schedule 事件没有输出评论 | 定时任务无 Issue/PR 上下文 | 这是预期行为，输出记录到 Actions 日志 |
| 报错 `User xxx does not have write permissions` | 触发者没有仓库写入权限 | 只有 admin 或 write 权限的协作者才能触发 |
| 自定义 mentions 不生效 | 多个短语未正确用逗号分隔 | 使用 `mentions: "/ai,/bot"` 格式 |
| 使用 `use_github_token` 时权限不足 | 未授予必要的 workflow 权限 | 添加 `contents: write`、`pull-requests: write` 等权限 |

## 相关章节

- [5.15 GitLab 集成](./15-gitlab) - 如果你使用 GitLab，参考该章节了解配置方式
- [5.16 分享功能](./16-share) - 了解 OpenCode 会话分享
- [速查/CLI 参考](../appendix/cli) - 完整 CLI 命令列表
