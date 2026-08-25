---
title: "Git Worktree: Parallel Development | OpenCode Tutorial"
subtitle: "Stop stashing and work on multiple branches from one repository"
course: "OpenCode Practical Course"
stage: "Stage 5"
lesson: "5.25"
duration: "15 minutes"
practice: "20 minutes"
level: "Advanced"
description: "Learn Git Worktree for parallel branch development. This tutorial covers multiple working directories, OpenCode workspaces, cleanup, and proven best practices."
tags:
  - "Git"
  - "worktree"
  - "Parallel Development"
  - "Branch Management"
prerequisite:
  - "2.2 Managing Conversations"
  - "Git Basics"
---

# Git Worktree: Parallel Branch Development

> 💡 **In one sentence**: `git worktree` lets you check out multiple branches from the same repository at once. Switching is just `cd`—no stash required.

---

## What You'll Learn

- Switch to another branch for urgent work without interrupting your current task
- Develop multiple feature branches at the same time without interference
- Switch workspaces quickly with OpenCode's `/workspaces`
- Understand how worktrees differ from stash and clone, and choose the right approach

---

## The Problem

You are halfway through a feature on `feature/new-api`. Suddenly:

- Production has a bug and you need to switch to `hotfix`
- A teammate sends you a PR that you need to run locally
- You want to compare an implementation detail with an older version

The traditional approach:

```bash
git stash            # Stash current changes
git checkout hotfix  # Switch branches
# ... fix the bug ...
git checkout feature # Switch back
git stash pop        # Restore changes (and possibly hit conflicts!)
```

**Problems**:
- A stash can conflict
- You lose context and pay the mental cost of restoring it
- Every switch requires rebuilding your working state

---

## When to Use This

- When you need to work on tasks across multiple branches at once
- And you do not want to keep stashing, switching, and restoring

---

## 🎒 Prerequisites

> Make sure you have completed the following:

- [ ] Understand basic Git branch operations
- [ ] Git 2.5 or later (released in 2015, so nearly every installation qualifies)

```bash
git --version
# git version 2.43.0 (ok)
```

---

## Core Concepts

### What Is Git Worktree?

**Git Worktree**, introduced in Git 2.5, allows a **single repository** to have **multiple working directories**, each with a different branch checked out.

```
# Traditional: one directory can have only one branch checked out at a time
my-project/        ← main or feature, but not both

# Worktrees: multiple directories and branches in parallel
my-project/        ← main branch
my-project-hotfix/ ← hotfix branch (independent directory)
my-project-review/ ← PR branch (independent directory)
```

### Why Is It Better Than the Alternatives?

| Comparison | git stash | git clone | git worktree |
| --- | --- | --- | --- |
| Disk usage | None | High (full copy) | Low (shared `.git`) |
| Parallel branches | ❌ Sequential | ✅ Parallel | ✅ Parallel |
| Context retained | ❌ Lost | ✅ Independent | ✅ Independent |
| Synchronization cost | None | High (fetch separately) | Low (shared data) |
| Best for | Brief switches lasting minutes | Complete isolation | Long-running parallel development |

### How It Works

When you run `git worktree add ../hotfix hotfix-branch`:

1. **Create a directory**: `../hotfix/`
2. **Check out the branch**: place the files from `hotfix-branch` in that directory
3. **Create a link**: `.git` in the new directory is a **file** that points to the main repository

```bash
# .git is a directory in the main repository
ls -la project/.git
drwxr-xr-x  .git/

# .git is a file in a worktree
ls -la ../hotfix/.git
-rw-r--r--  .git  # Contents: gitdir: /path/to/project/.git/worktrees/hotfix
```

All worktrees share one Git object database:
- A commit made in any worktree is immediately visible to the others
- Run `git fetch` once and every worktree is updated

---

## Follow Along

### Step 1: Inspect the Current Worktrees

**Why**
To understand the repository's current working-tree state.

```bash
cd your-project
git worktree list
```

**You should see**:

```
/path/to/your-project  abc1234 [main]
```

One line means there is only the default working directory.

---

### Step 2: Create a Worktree

**Why**
To work on another branch without disturbing your current work.

Suppose you are on `main` and need to fix a bug on `hotfix/login`:

```bash
# Syntax: git worktree add <path> <branch>
git worktree add ../my-project-hotfix hotfix/login
```

**You should see**:

```
Preparing worktree (checking out 'hotfix/login')
HEAD is now at abc1234 Fix login validation
```

::: tip Recommended directory layout
Put worktrees in a **sibling directory** (`../project-branch`), not inside the project.

❌ Avoid: `git worktree add ./hotfix`
✅ Recommended: `git worktree add ../my-project-hotfix`
:::

---

### Step 3: Work in the Worktree

**Why**
To use an independent development environment without interference.

```bash
# Switch to the new directory
cd ../my-project-hotfix

# You are now on hotfix/login
git branch
# * hotfix/login

# Develop and commit as usual
git add .
git commit -m "Fix login validation bug"
git push
```

Meanwhile, the **original directory** remains untouched:

```bash
cd ../your-project
git status
# Still in its previous state, including every uncommitted change
```

---

### Step 4: List All Worktrees

**Why**
To verify your working-tree list.

```bash
git worktree list
```

**You should see**:

```
/path/to/your-project       abc1234 [main]
/path/to/my-project-hotfix  def5678 [hotfix/login]
```

---

### Step 5: Remove a Worktree

**Why**
To clean up after the task and prevent worktrees from accumulating.

```bash
# Return to the main directory
cd /path/to/your-project

# Remove the worktree
git worktree remove ../my-project-hotfix
```

**You should see**: the directory is removed and only one line remains in the worktree list.

If it contains uncommitted changes, force removal:

```bash
git worktree remove --force ../my-project-hotfix
```

---

### Step 6: Use Workspaces in OpenCode

**Why**
To switch quickly from the TUI with OpenCode's experimental workspace feature. In `v1.18.22`, workspaces use an adapter architecture and the built-in adapter is `worktree`. `/workspaces` manages workspaces created or discovered by adapters; it is not a separate cloning mechanism.

First, enable the experimental feature:

```bash
# Add to ~/.zshrc or ~/.bashrc
export OPENCODE_EXPERIMENTAL_WORKSPACES=1

# Reload the file
source ~/.zshrc
```

Restart `opencode` and enter:

```
/workspaces
```

**You should see**: a workspace dialog listing the current project and every worktree.

| Action | Description |
| --- | --- |
| Select a workspace | Switch to that worktree directory |
| + New workspace | Create a new worktree |
| Press Delete | Remove the selected worktree |

::: warning Current implementation versus historical releases
The v1.16.0 release introduced managed workspace cloning and advertised preservation of dirty and untracked files. By `v1.18.22`, creation and discovery use the workspace adapter architecture with the built-in worktree adapter. When moving a session, `copyChanges` can copy a Git patch, but that does not mean all historical managed-clone behavior remains available. In particular, do not promise that untracked files will be copied.
:::

> Current implementation: [`adapters/index.ts:5-18`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/index.ts#L5-L18), [`adapters/worktree.ts:28-95`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/worktree.ts#L28-L95), [`workspace.ts:559-620`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L559-L620), and [`workspace.ts:728-739`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L728-L739). Historical evidence: the [`v1.16.0` release](https://github.com/anomalyco/opencode/releases/tag/v1.16.0) and commit `5661af203487b90cf9ee0844b198b03cce26c412`.

---

## Checklist ✅

- [ ] Understand what a worktree is and why it can be better than stash or clone
- [ ] Can create a worktree with `git worktree add`
- [ ] Can list worktrees with `git worktree list`
- [ ] Can remove a worktree with `git worktree remove`
- [ ] Enabled OpenCode workspaces and can switch with `/workspaces`

---

## Advanced: Best Practices

### 1. Bare Repository Pattern

If you regularly maintain several worktrees, use the bare repository pattern:

```bash
# Clone as a bare repository (no working tree)
git clone --bare git@github.com:user/repo.git repo.git

cd repo.git

# Create worktrees (using branch names as directory names)
git worktree add main main
git worktree add ../feature feature-branch
git worktree add ../hotfix hotfix-branch
```

Directory structure:

```
code/
├── repo.git/       # Bare repository (.git data only)
│   └── main/       # worktree: main branch
├── feature/        # worktree: feature branch
└── hotfix/         # worktree: hotfix branch
```

**Advantages**:
- Every branch is equal; there is no primary or secondary worktree
- The directory structure is clear: branch name = directory name
- One `fetch` updates every worktree

### 2. Naming Conventions

| Style | Example | Use Case |
| --- | --- | --- |
| Project-branch | `my-project-hotfix` | Temporary worktree |
| Branch name directly | `feature/login` | Bare repository pattern |
| Project + purpose | `my-project-review` | Dedicated PR review worktree |

### 3. Clean Up Regularly

Build the habit of removing a worktree immediately after its branch is merged.

```bash
# Remove the worktree for a merged branch
git worktree remove ../feature-done
git branch -d feature-done

# Remove orphaned records (for example, after manually running rm -rf on a directory)
git worktree prune
```

### 4. Use It with an IDE

Each worktree can be opened as an **independent project**:

```bash
# VS Code
code ../my-project-hotfix

# IntelliJ
# Open → select the directory
```

Each branch then has independent:
- Run configurations
- Breakpoints
- Open files

---

## Common Pitfalls

### ⚠️ One Branch Cannot Be Checked Out Twice

```bash
# Suppose main is already checked out in the primary directory
git worktree add ../another-main main
# fatal: 'main' is already checked out at '/path/to/project'
```

**Solution**: create a new branch.

```bash
git worktree add -b hotfix/from-main ../hotfix main
```

### ⚠️ Do Not Put Worktree Directories Inside the Project

```bash
# ❌ Wrong: creates the directory inside the project
git worktree add ./hotfix branch-name

# ✅ Correct: use a sibling directory
git worktree add ../project-hotfix branch-name
```

Putting it inside causes:
- Confusing Git ignore behavior
- Incorrect paths in tooling scripts
- The mental mismatch that it “doesn't belong to this project”

### ⚠️ node_modules Is Duplicated

Every worktree is an independent working directory, so dependencies must be **installed separately**:

```bash
cd ../project-hotfix
npm install  # or pnpm install
```

For large projects, this is the main time cost.

**Mitigations**:
- Use pnpm's global store, which saves space through hard links
- Configure a shared cache directory

### ⚠️ stash Is Global

All worktrees share one stash list:

```bash
# Stash in worktree A
git stash push -m "WIP feature"

# See it from worktree B
git stash list
```

This can become confusing. Recommendation: **if you use worktrees, avoid stash**.

---

## Real-World Scenarios

### Scenario 1: Urgent Bug Fix

```
You are developing feature/new-api
→ Product: “Production is down!”
→ git worktree add ../hotfix hotfix/urgent
→ cd ../hotfix, fix, deploy
→ cd ../feature, continue developing
```

### Scenario 2: PR Review

```
Teammate: “Can you review this PR?”
→ git fetch origin
→ git worktree add ../review origin/their-branch
→ cd ../review, run tests, inspect code
→ Finish the review and remove the worktree
```

### Scenario 3: Parallel Comparison Testing

```
You want to compare old and new implementations
→ git worktree add ../old-version v1.0.0
→ git worktree add ../new-version v2.0.0
→ Run both directories simultaneously and compare the results
```

---

## Command Cheat Sheet

| Command | Purpose |
| --- | --- |
| `git worktree add <path> <branch>` | Create a worktree |
| `git worktree add -b <new-branch> <path>` | Create a new branch and worktree |
| `git worktree list` | List all worktrees |
| `git worktree remove <path>` | Remove a worktree |
| `git worktree remove --force <path>` | Force removal when uncommitted changes exist |
| `git worktree prune` | Remove orphaned records |
| `git worktree lock <path>` | Lock a worktree to prevent accidental removal |
| `git worktree move <path> <new-path>` | Move a worktree |

---

## Lesson Summary

| Concept | Key Point |
| --- | --- |
| **What it is** | One repository, multiple working directories, shared `.git` data |
| **What it solves** | Expensive branch switching, stash risk, and wasted disk space from clones |
| **When to use it** | Urgent fixes, parallel development, PR reviews, and comparison testing |
| **Best practices** | Bare repository pattern, consistent naming, and regular cleanup |
| **OpenCode integration** | Switch quickly with `/workspaces` |

---

## Next Lesson

> Next, we'll cover the **[Experimental Features Overview](/en/appendix/experimental-features)**.
>
> You'll learn:
> - The complete list of experimental features
> - Which features to enable as needed
> - Environment-variable configuration techniques

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Target version: v1.18.22 (2026-08-24)

| Feature | File Path | Lines |
| --- | --- | --- |
| Adapter registration (built-in worktree) | [`src/control-plane/adapters/index.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/index.ts#L5-L18) | 5-18 |
| Worktree adapter | [`src/control-plane/adapters/worktree.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/adapters/worktree.ts#L28-L95) | 28-95 |
| Workspace creation | [`src/control-plane/workspace.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L492-L538) | 492-538 |
| Adapter discovery and registration | [`src/control-plane/workspace.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/control-plane/workspace.ts#L728-L739) | 728-739 |
| Workspace-aware routing | [`workspace-routing.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/server/routes/instance/httpapi/middleware/workspace-routing.ts#L148-L185) | 148-185 |
| Experimental switch | [`src/effect/runtime-flags.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/effect/runtime-flags.ts#L43-L50) | 43-50 |
| TUI `/workspaces` command | [`packages/tui/src/app.tsx`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/app.tsx#L610-L618) | 610-618 |

**Key environment variable**:
- `OPENCODE_EXPERIMENTAL_WORKSPACES=1`: enable TUI workspace support

</details>
