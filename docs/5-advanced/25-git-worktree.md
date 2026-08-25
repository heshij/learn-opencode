---
title: Git Worktree：多分支并行开发的优雅姿势 | OpenCode 教程
subtitle: 告别 stash，一个仓库同时跑多个分支
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.25"
duration: 15 分钟
practice: 20 分钟
level: 进阶
description: 学习 Git Worktree，在同一个仓库中同时检出多个分支，告别频繁切换和 stash 冲突，配合 OpenCode 的 /workspaces 实现高效并行开发。
tags:
  - Git
  - worktree
  - 并行开发
  - 分支管理
prerequisite:
  - 2.2 管理对话
  - Git 基础操作
---

# Git Worktree：多分支并行开发

> 💡 **一句话总结**：`git worktree` 让你在同一个仓库中同时检出多个分支，切换就是 `cd`，不用 stash。

---

## 学完你能做什么

- 在不中断当前工作的情况下，切换到另一个分支处理紧急任务
- 同时开发多个功能分支，互不干扰
- 配合 OpenCode 的 `/workspaces` 快速切换工作区
- 理解 worktree 与 stash、clone 的区别，选择最适合的方案

---

## 你现在的困境

你正在 `feature/new-api` 分支开发新功能，代码改了一半。突然：

- 生产环境出 Bug，需要切到 `hotfix` 紧急修复
- 同事发来 PR，需要本地跑一下看看效果
- 想对比一下旧版本的某个实现细节

传统做法：

```bash
git stash          # 暂存当前修改
git checkout hotfix  # 切换分支
# ... 修复 bug ...
git checkout feature  # 切回来
git stash pop      # 恢复修改（可能冲突！）
```

**问题**：
- stash 可能冲突
- 上下文丢失，恢复心智成本高
- 每次切换都要重新建立状态

---

## 什么时候用这一招

- 当你需要：同时处理多个分支的任务
- 而且不想：反复 stash、切换、恢复

---

## 🎒 开始前的准备

> 确保你已经完成以下事项：

- [ ] 了解 Git 分支的基本操作
- [ ] Git 版本 >= 2.5（2015 年发布，基本都有）

```bash
git --version
# git version 2.43.0 (ok)
```

---

## 核心概念

### 什么是 Git Worktree？

**Git Worktree**（工作树）是 Git 2.5 引入的功能，允许**同一个仓库**拥有**多个工作目录**，每个目录可以检出不同的分支。

```
# 传统方式：一个目录，一次只能在一个分支
my-project/        ← 只能是 main 或 feature，不能同时

# Worktree 方式：多个目录，多个分支并行
my-project/        ← main 分支
my-project-hotfix/ ← hotfix 分支（独立的目录）
my-project-review/ ← PR 分支（独立的目录）
```

### 为什么比其他方案更好？

| 对比项 | git stash | git clone | git worktree |
|--------|-----------|-----------|--------------|
| 磁盘占用 | 无 | 高（完整复制） | 低（共享 .git） |
| 分支并行 | ❌ 串行 | ✅ 并行 | ✅ 并行 |
| 上下文保留 | ❌ 丢失 | ✅ 独立 | ✅ 独立 |
| 同步成本 | 无 | 高（分别 fetch） | 低（共享数据） |
| 适用场景 | 临时切换（几分钟） | 需要完全隔离 | 长期并行开发 |

### 工作原理

当你执行 `git worktree add ../hotfix hotfix-branch`：

1. **创建目录**：`../hotfix/`
2. **检出分支**：把 `hotfix-branch` 的文件放到这个目录
3. **建立链接**：新目录的 `.git` 是一个**文件**，指向主仓库

```bash
# 主仓库的 .git 是目录
ls -la project/.git
drwxr-xr-x  .git/

# worktree 的 .git 是文件
ls -la ../hotfix/.git
-rw-r--r--  .git  # 内容：gitdir: /path/to/project/.git/worktrees/hotfix
```

所有 worktree 共享同一份 Git 对象数据库：
- 在任意 worktree 提交，其他 worktree 立即可见
- `git fetch` 一次，全部更新

---

## 跟我做

### 第 1 步：查看当前 worktree

**为什么**  
了解当前仓库的工作树状态。

```bash
cd your-project
git worktree list
```

**你应该看到**：

```
/path/to/your-project  abc1234 [main]
```

只有一行，表示只有一个工作目录（默认的）。

---

### 第 2 步：创建一个新的 worktree

**为什么**  
在不影响当前工作的情况下，同时开发另一个分支。

假设你现在在 `main` 分支，需要去 `hotfix/login` 修 bug：

```bash
# 语法：git worktree add <路径> <分支名>
git worktree add ../my-project-hotfix hotfix/login
```

**你应该看到**：

```
Preparing worktree (checking out 'hotfix/login')
HEAD is now at abc1234 Fix login validation
```

::: tip 目录位置建议
把 worktree 放在**同级目录**（`../项目名-分支名`），而不是项目内部。

❌ 不要：`git worktree add ./hotfix`  
✅ 推荐：`git worktree add ../my-project-hotfix`
:::

---

### 第 3 步：在 worktree 中工作

**为什么**  
体验独立的开发环境，互不干扰。

```bash
# 切换到新目录
cd ../my-project-hotfix

# 现在你在 hotfix/login 分支
git branch
# * hotfix/login

# 正常开发、提交
git add .
git commit -m "Fix login validation bug"
git push
```

与此同时，你的**原目录**完全不受影响：

```bash
cd ../your-project
git status
# 仍然是之前的状态，未提交的改动都在
```

---

### 第 4 步：查看所有 worktree

**为什么**  
确认你的工作树列表。

```bash
git worktree list
```

**你应该看到**：

```
/path/to/your-project       abc1234 [main]
/path/to/my-project-hotfix  def5678 [hotfix/login]
```

---

### 第 5 步：删除 worktree

**为什么**  
任务完成后清理，避免工作树堆积。

```bash
# 回到主目录
cd /path/to/your-project

# 删除 worktree
git worktree remove ../my-project-hotfix
```

**你应该看到**：目录被删除，worktree 列表只剩一行。

如果有未提交的修改，需要强制删除：

```bash
git worktree remove --force ../my-project-hotfix
```

---

### 第 6 步：在 OpenCode 中使用工作区

**为什么**  
配合 OpenCode 的实验性工作区功能，在 TUI 中快速切换。`v1.18.22` 的 workspace 已采用 adapter 架构，内置 adapter 是 `worktree`；`/workspaces` 管理的是 adapter 创建或发现的 workspace，不是另一套独立的 clone 机制。

首先启用实验性功能：

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export OPENCODE_EXPERIMENTAL_WORKSPACES=1

# 重新加载
source ~/.zshrc
```

重启 `opencode`，输入：

```
/workspaces
```

**你应该看到**：工作区列表对话框，显示当前项目和所有 worktree。

| 操作 | 说明 |
|------|------|
| 选择工作区 | 切换到对应的 worktree 目录 |
| + New workspace | 创建新的 worktree |
| 按 Delete 键 | 删除选中的 worktree |

::: warning 当前实现与历史 Release 的边界
v1.16.0 Release 曾加入 managed workspace cloning，并宣传保留脏文件和未跟踪文件。到 `v1.18.22`，当前创建与发现路径已经是 workspace adapter + 内置 worktree adapter；会话移动时可选择通过 `copyChanges` 复制 Git 补丁，但这不等于继续提供历史 managed clone 的全部行为，尤其不要据此承诺复制未跟踪文件。
:::

> 当前实现：[`adapters/index.ts:5-18`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/index.ts#L5-L18)、[`adapters/worktree.ts:28-95`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/worktree.ts#L28-L95)、[`workspace.ts:559-620`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L559-L620)、[`workspace.ts:728-739`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L728-L739)。历史证据：[`v1.16.0 Release`](https://github.com/anomalyco/opencode/releases/tag/v1.16.0)、commit `5661af203487b90cf9ee0844b198b03cce26c412`。

---

## 检查点 ✅

- [ ] 理解了 worktree 是什么，为什么比 stash/clone 更好
- [ ] 能用 `git worktree add` 创建新的工作树
- [ ] 能用 `git worktree list` 查看所有工作树
- [ ] 能用 `git worktree remove` 删除工作树
- [ ] 启用了 OpenCode 工作区功能，能用 `/workspaces` 切换

---

## 进阶：最佳实践

### 1. 裸仓库模式（Bare Repo Pattern）

如果你长期需要多个 worktree，推荐使用「裸仓库」模式：

```bash
# 克隆为裸仓库（没有工作区）
git clone --bare git@github.com:user/repo.git repo.git

cd repo.git

# 创建 worktree（分支名作为目录名）
git worktree add main main
git worktree add ../feature feature-branch
git worktree add ../hotfix hotfix-branch
```

目录结构：

```
code/
├── repo.git/       # 裸仓库（只有 .git 数据）
│   └── main/       # worktree：main 分支
├── feature/        # worktree：feature 分支
└── hotfix/         # worktree：hotfix 分支
```

**优势**：
- 所有分支地位平等，无主副之分
- 目录结构清晰，分支名 = 目录名
- `fetch` 一次，全部 worktree 更新

### 2. 命名规范

| 风格 | 示例 | 适用场景 |
|------|------|---------|
| 项目-分支 | `my-project-hotfix` | 临时 worktree |
| 分支名直接用 | `feature/login` | 裸仓库模式 |
| 项目名 + 用途 | `my-project-review` | PR review 专用 |

### 3. 定期清理

养成习惯：合并完分支后立即删除 worktree。

```bash
# 删除已合并分支的 worktree
git worktree remove ../feature-done
git branch -d feature-done

# 清理孤立的 worktree 记录（比如手动 rm -rf 了目录）
git worktree prune
```

### 4. 配合 IDE

每个 worktree 可以作为**独立项目**打开：

```bash
# VS Code
code ../my-project-hotfix

# IntelliJ
# Open → 选择目录
```

这样每个分支有独立的：
- 运行配置
- 断点
- 打开的文件

---

## 踩坑提醒

### ⚠️ 同一分支不能同时检出

```bash
# 假设 main 已经在主目录检出
git worktree add ../another-main main
# fatal: 'main' is already checked out at '/path/to/project'
```

**解决方法**：创建新分支

```bash
git worktree add -b hotfix/from-main ../hotfix main
```

### ⚠️ worktree 目录不要放在项目内部

```bash
# ❌ 错误：会在项目内创建目录
git worktree add ./hotfix branch-name

# ✅ 正确：同级目录
git worktree add ../project-hotfix branch-name
```

放在内部会导致：
- Git 忽略规则混乱
- 工具脚本路径错误
- 心理上觉得「不属于这个项目」

### ⚠️ node_modules 会重复

每个 worktree 都是独立的工作目录，依赖需要**分别安装**：

```bash
cd ../project-hotfix
npm install  # 或 pnpm install
```

如果项目很大，这是主要的时间成本。

**缓解方法**：
- pnpm 全局 store（硬链接，省空间）
- 配置共享的缓存目录

### ⚠️ stash 是全局的

所有 worktree 共享同一个 stash 列表：

```bash
# 在 worktree A 中 stash
git stash push -m "WIP feature"

# 在 worktree B 中可以看到
git stash list
```

这可能导致混乱。建议：**用 worktree 就不要用 stash**。

---

## 实际应用场景

### 场景一：紧急 Bug 修复

```
你在 feature/new-api 开发新功能
→ 产品：「生产环境挂了！」
→ git worktree add ../hotfix hotfix/urgent
→ cd ../hotfix，修复，部署
→ cd ../feature，继续开发
```

### 场景二：PR Review

```
同事：「帮我 review 一下这个 PR」
→ git fetch origin
→ git worktree add ../review origin/their-branch
→ cd ../review，运行测试，查看代码
→ review 完成，删除 worktree
```

### 场景三：并行对比测试

```
想对比新旧实现的效果
→ git worktree add ../old-version v1.0.0
→ git worktree add ../new-version v2.0.0
→ 两个目录同时运行，对比结果
```

---

## 常用命令速查

| 命令 | 用途 |
|------|------|
| `git worktree add <path> <branch>` | 创建 worktree |
| `git worktree add -b <new-branch> <path>` | 创建新分支 + worktree |
| `git worktree list` | 列出所有 worktree |
| `git worktree remove <path>` | 删除 worktree |
| `git worktree remove --force <path>` | 强制删除（有未提交修改） |
| `git worktree prune` | 清理孤立记录 |
| `git worktree lock <path>` | 锁定（防止误删） |
| `git worktree move <path> <new-path>` | 移动 worktree |

---

## 本课小结

| 概念 | 要点 |
|------|------|
| **是什么** | 一个仓库，多个工作目录，共享 .git 数据 |
| **解决什么** | 分支切换成本高、stash 风险、clone 浪费空间 |
| **何时使用** | 紧急修复、并行开发、PR review、对比测试 |
| **最佳实践** | 裸仓库模式、规范命名、定期清理 |
| **OpenCode 集成** | `/workspaces` 快速切换 |

---

## 下一课预告

> 下一课我们学习 **[附录：实验性功能汇总](../appendix/experimental-features)**。
>
> 你会了解到：
> - 所有实验性功能的完整列表
> - 按需启用哪些功能
> - 环境变量配置技巧

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 目标版本：v1.18.22（2026-08-24）

| 功能 | 文件路径 | 行号 |
|-----|---------|------|
| Adapter 注册（内置 worktree） | [`src/control-plane/adapters/index.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/index.ts#L5-L18) | 5-18 |
| Worktree adapter | [`src/control-plane/adapters/worktree.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/worktree.ts#L28-L95) | 28-95 |
| Workspace 创建 | [`src/control-plane/workspace.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L492-L538) | 492-538 |
| Adapter 发现与登记 | [`src/control-plane/workspace.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L728-L739) | 728-739 |
| Workspace-aware 路由 | [`workspace-routing.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts#L148-L185) | 148-185 |
| 实验性开关 | [`src/effect/runtime-flags.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/effect/runtime-flags.ts#L43-L50) | 43-50 |
| TUI `/workspaces` 命令 | [`packages/tui/src/app.tsx`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/app.tsx#L610-L618) | 610-618 |

**关键环境变量**：
- `OPENCODE_EXPERIMENTAL_WORKSPACES=1`：启用 TUI 工作区支持

</details>
