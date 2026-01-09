---
title: 5.15 GitLab 集成
subtitle: 在 GitLab CI/CD 中使用 OpenCode
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.15"
duration: 15 分钟
practice: 20 分钟
level: 进阶
description: 通过 GitLab CI/CD 流水线或 GitLab Duo 集成，在 GitLab Runner 中使用 OpenCode。
tags:
  - GitLab
  - CI/CD
  - 自动化
prerequisite:
  - 5.14 GitHub 集成
---

# GitLab 集成

OpenCode 通过 GitLab CI/CD 流水线或 GitLab Duo 集成到 GitLab 工作流中。两种方式下，OpenCode 都在你的 GitLab Runner 上运行。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/gitlab-notes.mini.jpeg"
     alt="GitLab 集成学霸笔记"
     data-zoom-src="/images/5-advanced/gitlab-notes.jpeg" />

## 与 GitHub 集成的区别

在深入配置之前，了解 GitLab 和 GitHub 集成的差异很重要：

| 特性 | GitHub 集成 | GitLab 集成 |
|------|------------|-------------|
| 安装方式 | 官方命令 `opencode github install` | 手动配置或社区组件 |
| 官方支持 | OpenCode 官方 GitHub App | 社区维护的 CI 组件 |
| 触发词 | `/opencode` 或 `/oc` | `@opencode`（可配置） |
| Action/组件 | `anomalyco/opencode/github@latest` | `nagyv/gitlab-opencode@2` |

::: tip 选择建议
如果你同时使用 GitHub 和 GitLab，GitHub 的集成体验更"开箱即用"。GitLab 集成需要更多手动配置，但灵活性更高。参考 [5.14 GitHub 集成](./14-github) 了解 GitHub 的设置流程。
:::

---

## GitLab CI

OpenCode 在常规 GitLab 流水线中工作。可以作为 [CI 组件](https://docs.gitlab.com/ee/ci/components/) 构建到流水线中。

这里使用社区创建的 CI/CD 组件：[nagyv/gitlab-opencode](https://gitlab.com/nagyv/gitlab-opencode)。

### 功能

- **自定义配置**：每个 job 可使用自定义配置目录（如 `./config/#custom-directory`）启用或禁用功能
- **最小化设置**：CI 组件在后台设置 OpenCode，你只需创建配置和初始提示
- **灵活**：CI 组件支持多种输入参数自定义行为

### 设置

**1. 存储认证信息**

将 OpenCode 认证 JSON 作为 **File 类型** 的 CI 环境变量存储：

- 进入 **Settings** > **CI/CD** > **Variables**
- 添加变量，类型选择 **File**
- 确保勾选 **Masked and hidden**

认证 JSON 示例（根据你使用的模型提供商选择）：

```jsonc
// Anthropic
{
  "anthropic": {
    "type": "api",
    "key": "sk-ant-api03-xxx..."
  }
}

// OpenAI
{
  "openai": {
    "type": "api",
    "key": "sk-xxx..."
  }
}

// 多个提供商
{
  "anthropic": {
    "type": "api",
    "key": "sk-ant-api03-xxx..."
  },
  "openai": {
    "type": "api",
    "key": "sk-xxx..."
  }
}
```

**2. 配置 .gitlab-ci.yml**

在 `.gitlab-ci.yml` 添加以下内容：

```yaml
include:
  - component: $CI_SERVER_FQDN/nagyv/gitlab-opencode/opencode@2
    inputs:
      config_dir: ${CI_PROJECT_DIR}/opencode-config
      auth_json: $OPENCODE_AUTH_JSON  # 上一步创建的变量名
      command: optional-custom-command
      message: "Your prompt here"
```

::: tip 组件版本
`@2` 是当前主要版本。查看 [组件 Catalog](https://gitlab.com/explore/catalog/nagyv/gitlab-opencode) 获取最新版本和完整输入参数列表。
:::

---

## GitLab Duo

OpenCode 集成到 GitLab 工作流中。在评论中提及 `@opencode`，OpenCode 将在 GitLab CI 流水线中执行任务。

### 功能

- **分流问题**：让 OpenCode 查看 Issue 并解释
- **修复和实现**：让 OpenCode 修复 Issue 或实现功能，它会创建新分支并提交 Merge Request
- **安全**：OpenCode 在你的 GitLab Runner 上运行

### 设置

OpenCode 在 GitLab CI/CD 流水线中运行，设置步骤：

::: tip 官方文档
查看 [GitLab 官方文档](https://docs.gitlab.com/user/duo_agent_platform/agent_assistant/) 获取最新说明。
:::

1. 配置 GitLab 环境
2. 设置 CI/CD
3. 获取 AI 模型提供商 API 密钥
4. 创建服务账号
5. 配置 CI/CD 变量
6. 创建 flow 配置文件

### glab CLI

Flow 配置中使用了 [glab](https://gitlab.com/gitlab-org/cli)——GitLab 官方命令行工具。它提供了与 GitLab API 交互的能力，包括：

- 列出/创建/管理 Issue
- 操作 Merge Request
- 查看 CI/CD 状态

OpenCode 通过 glab 读取 GitLab 数据并执行操作。

<details>
<summary>Flow 配置示例</summary>

```yaml
image: node:22-slim
commands:
  - echo "Installing opencode"
  - npm install --global opencode-ai
  - echo "Installing glab"
  - export GITLAB_TOKEN=$GITLAB_TOKEN_OPENCODE
  - apt-get update --quiet && apt-get install --yes curl wget gpg git && rm --recursive --force /var/lib/apt/lists/*
  - curl --silent --show-error --location "https://raw.githubusercontent.com/upciti/wakemeops/main/assets/install_repository" | bash
  - apt-get install --yes glab
  - echo "Configuring glab"
  - echo $GITLAB_HOST
  - echo "Creating OpenCode auth configuration"
  - mkdir --parents ~/.local/share/opencode
  - |
    cat > ~/.local/share/opencode/auth.json << EOF
    {
      "anthropic": {
        "type": "api",
        "key": "$ANTHROPIC_API_KEY"
      }
    }
    EOF
  - echo "Configuring git"
  - git config --global user.email "opencode@gitlab.com"
  - git config --global user.name "OpenCode"
  - echo "Testing glab"
  - glab issue list
  - echo "Running OpenCode"
  - |
    opencode run "
    You are an AI assistant helping with GitLab operations.

    Context: $AI_FLOW_CONTEXT
    Task: $AI_FLOW_INPUT
    Event: $AI_FLOW_EVENT

    Please execute the requested task using the available GitLab tools.
    Be thorough in your analysis and provide clear explanations.

    <important>
    Please use the glab CLI to access data from GitLab. The glab CLI has already been authenticated. You can run the corresponding commands.

    If you are asked to summarize an MR or issue or asked to provide more information then please post back a note to the MR/Issue so that the user can see it.
    You don't need to commit or push up changes, those will be done automatically based on the file changes you make.
    </important>
    "
  - git checkout --branch $CI_WORKLOAD_REF origin/$CI_WORKLOAD_REF
  - echo "Checking for git changes and pushing if any exist"
  - |
    if ! git diff --quiet || ! git diff --cached --quiet || [ --not --zero "$(git ls-files --others --exclude-standard)" ]; then
      echo "Git changes detected, adding and pushing..."
      git add .
      if git diff --cached --quiet; then
        echo "No staged changes to commit"
      else
        echo "Committing changes to branch: $CI_WORKLOAD_REF"
        git commit --message "OpenCode changes"
        echo "Pushing changes up to $CI_WORKLOAD_REF"
        git push https://gitlab-ci-token:$GITLAB_TOKEN@$GITLAB_HOST/$CI_PROJECT_PATH.git $CI_WORKLOAD_REF
        # 注意：官方示例使用硬编码路径，这里改用 $CI_PROJECT_PATH 变量更通用
        echo "Changes successfully pushed"
      fi
    else
      echo "No git changes detected, skipping push"
    fi
variables:
  - ANTHROPIC_API_KEY
  - GITLAB_TOKEN_OPENCODE
  - GITLAB_HOST
```

</details>

::: info 配置说明
- `$AI_FLOW_CONTEXT`、`$AI_FLOW_INPUT`、`$AI_FLOW_EVENT` 是 GitLab Duo 注入的环境变量
- `$CI_PROJECT_PATH` 是 GitLab 预定义变量，表示 `<namespace>/<project>`
- 更多 GitLab 预定义变量参考 [GitLab CI/CD 变量文档](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)
:::

详细说明请参考 [GitLab CLI agents 文档](https://docs.gitlab.com/user/duo_agent_platform/agent_assistant/)。

---

## 使用示例

::: tip 自定义触发词
可以配置使用不同于 `@opencode` 的触发词。
:::

### 解释 Issue

在 GitLab Issue 中添加评论：

```
@opencode explain this issue
```

OpenCode 会读取 Issue 并回复解释。

### 修复 Issue

在 GitLab Issue 中：

```
@opencode fix this
```

OpenCode 会创建新分支、实现修改并打开 Merge Request。

### 审查 Merge Request

在 GitLab Merge Request 中留下评论：

```
@opencode review this merge request
```

OpenCode 会审查 Merge Request 并提供反馈。

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| CI 组件找不到 | 私有 GitLab 实例可能无法访问 gitlab.com 上的组件 | Fork 组件到你的 GitLab 实例，或下载后本地引用 |
| `OPENCODE_AUTH_JSON` 无效 | 变量类型错误（应为 File 而非 Variable） | 在 CI/CD Variables 中删除重建，确保选择 **File** 类型 |
| glab 认证失败 | `GITLAB_TOKEN` 权限不足 | 确保 Token 有 `api`、`read_repository`、`write_repository` 权限 |
| git push 被拒绝 | 分支保护规则 | 在 Settings > Repository > Protected Branches 中配置允许 bot 推送 |
| OpenCode 无响应 | Runner 网络问题或 API 密钥无效 | 检查 Runner 日志，验证 API 密钥是否正确 |

---

## 相关章节

- [5.14 GitHub 集成](./14-github) - GitHub Actions 集成方式
- [5.1a 配置基础](./01a-config-basics) - 了解 OpenCode 配置文件格式
