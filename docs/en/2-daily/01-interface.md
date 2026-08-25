---
title: "OpenCode Interface and Basic Operations | OpenCode Tutorial"
subtitle: "Master OpenCode's core operations"
course: "OpenCode Practical Course"
stage: "Stage 2"
lesson: "2.1"
duration: "15 min"
practice: "20 min"
level: "Beginner"
description: "Master OpenCode interface operations, learn @ file references, ! command execution, / slash commands, and get started quickly with your AI coding assistant."
tags:
  - "Interface"
  - "Shortcuts"
  - "Basic Operations"
prerequisite:
  - "1.4 Connect Model"
---

# Interface & Basic Operations

> 💡 **One-sentence Summary**: Master `@` file references, `!` command execution, and `/` slash commands, and you'll be able to harness OpenCode.

## 📝 Course Notes

Key knowledge points from this lesson:

<img src="/images/2-daily/interface-notes.mini.jpeg" 
     alt="Interface & Basic Operations Notes" 
     data-zoom-src="/images/2-daily/interface-notes.jpeg" />

---

## What You'll Be Able to Do

- Understand every area of the TUI interface
- Use `@` to reference project files
- Use `!` to execute system commands
- Use `/` to call slash commands
- Remember the most commonly used shortcuts

---

## Your Current Challenge

- Opened OpenCode, but don't know what each part of the interface does
- Know you can chat with AI, but don't know how to make it read files
- Don't know about shortcut operations, can only communicate by typing

---

## When to Use This

- When you need to: Efficiently use OpenCode for daily tasks
- And you don't want to: Type long paragraphs to explain context every time

---

## 🎒 Before You Start

> Make sure you've completed the following:

- [ ] Completed [1.4 Connect Model](/en/1-start/04-connect)
- [ ] OpenCode can have normal conversations with AI

---

## Core Concepts

<AdInArticle />

### TUI Interface Overview

After starting OpenCode, you'll see an interface like this:

```
┌─────────────────────────────────────────────────┐
│  OpenCode v1.0.0                    Build Mode  │  ← Status Bar/Header
├─────────────────────────────────────────────────┤
│                                                 │
│  AI: Hello! How can I help you?                 │  ← Chat Area
│                                                 │
├─────────────────────────────────────────────────┤
│  > Ask something...                             │  ← Input Area
└─────────────────────────────────────────────────┘
```

| Area | Purpose |
| --- | --- |
| Status Bar/Header | Shows version, current mode (Plan/Build), Token usage |
| Sidebar | Session list (auto-shows on wide screens, hides on narrow) |
| Chat Area | AI responses and your message history |
| Input Area | Where you type messages (different modes have different prompts) |

::: details Interface Display Rules

**1. Sidebar Auto Show/Hide**
- Auto-shows session list on wide screens (>120 columns)
- Auto-hides on narrow screens to save space

**2. Input Box Smart Prompts**
- Different modes show different placeholder prompts
- Normal mode: `Ask something...`
- Shell mode: `Enter shell command...`
- Comment summary mode: `Summarize comments...`
:::

### Core Operations Trio

| Symbol | Purpose | Example |
| --- | --- | --- |
| `@` | Reference file | `@src/main.ts What does this file do` |
| `!` | Execute command | `!ls -la` to view directory |
| `/` | Slash command | `/help` to view help |

---

## Follow Along

### Step 1: Start OpenCode and Enter Your Project

**Why**  
Only by starting in the project directory can AI see your code files.

```bash
cd ~/your-project  # Replace with your project path
opencode
```

### Step 2: Let AI Introduce Itself

**Why**  
Verify that basic conversation functionality works.

In the input area, type:

```
Hello, please briefly introduce yourself
```

Press <kbd>Enter</kbd> to send.

**You should see**: AI responds with a self-introduction

### Step 3: Use @ to Reference Files

**Why**  
This is OpenCode's most powerful feature—letting AI directly read your files.

Type:

```
@package.json What project does this file describe
```

::: tip 💡 Search Completion
After typing `@`, you'll see an Agent list (like `@explore`) and folders. **Continue typing part of the filename** (like `@pack`), and it will search and show matching files. Use arrow keys to select and press <kbd>Enter</kbd> to confirm.
:::

**You should see**: AI analyzes the package.json content and responds

### Step 4: Use ! to Execute Commands

**Why**  
Lets AI see the execution results of commands.

Type:

```
!ls -la
```

**You should see**: The file list of the current directory appears in the chat

You can also ask AI to execute commands:

```
Help me see what files are in the current directory
```

AI will automatically call the appropriate tool to execute.

### Step 5: Use / to Call Slash Commands

**Why**  
Slash commands are the entry point for OpenCode's built-in features.

Type:

```
/help
```

**You should see**: A list of all available slash commands

Common slash commands overview:

| Command | Purpose |
| --- | --- |
| `/help` | View help |
| `/new` | New session |
| `/models` | Switch model |
| `/themes` | Switch theme |
| `/exit` | Exit |

::: tip 💡 Command Palette
Press <kbd>Ctrl</kbd>+<kbd>P</kbd> to open the command palette. <kbd>Ctrl</kbd>+<kbd>X</kbd> is the Leader prefix and does not open the palette by itself.
:::

### Step 6: Learn Common Shortcuts

**Why**  
Shortcuts make you faster.

| Shortcut | Purpose |
| --- | --- |
| <kbd>Tab</kbd> | Toggle Plan/Build mode |
| <kbd>Esc</kbd> | Interrupt the current response or go back one level |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Clear the input; can also exit the application |
| <kbd>Ctrl</kbd>+<kbd>X</kbd> | Leader key (prefix key) |
| <kbd>Ctrl</kbd>+<kbd>X</kbd> <kbd>N</kbd> | New session |

### Step 7: Review Changes in the Diff Viewer

Enter `/diff`—or search for `Open diff viewer` in the command palette—to open the diff viewer, which is enabled by default. It organizes changes in a file tree and supports:

- Navigating by file and hunk
- Switching between a single patch and all patches
- Switching between unified and split views (narrow terminals display only the unified view)
- Viewing workspace changes and changes produced by the latest AI turn; when the current branch is not the default branch, you can also view its differences from the main branch

Common keys: <kbd>]</kbd> / <kbd>[</kbd> to move between hunks, <kbd>n</kbd> / <kbd>p</kbd> to move between files, <kbd>d</kbd> to switch sources, <kbd>v</kbd> to switch views, <kbd>m</kbd> to mark a file as reviewed, <kbd>?</kbd> to open the full help, and <kbd>Esc</kbd> / <kbd>q</kbd> to close the viewer and return to the previous screen.

> Source references: [v1.18.22 diff viewer navigation and sources](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/feature-plugins/system/diff-viewer.tsx#L563-L704) and [entry command](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/feature-plugins/system/diff-viewer.tsx#L1045-L1071).

::: details 📦 What is a Leader Key
A Leader key is a shortcut combination method. First press <kbd>Ctrl</kbd>+<kbd>X</kbd>, release, then press another key.

For example: <kbd>Ctrl</kbd>+<kbd>X</kbd> then <kbd>N</kbd> = New session

This allows more shortcut combinations without conflicting with system shortcuts.
:::

---

## Checklist ✅

> All items must pass before continuing

- [ ] Can reference project files with `@filename`
- [ ] Can execute system commands with `!command`
- [ ] Can see help information with `/help`
- [ ] <kbd>Tab</kbd> key can toggle Plan/Build mode
- [ ] `/diff` opens the diff viewer and lets you switch files or hunks

---

## Common Pitfalls

| Issue | Cause | Solution |
| --- | --- | --- |
| No file completion after `@` | Not in project directory | `cd` to project directory and restart |
| `!` command permission error | OpenCode blocked dangerous command | Confirm command is safe then press `y` to allow |
| Shortcuts not working | Terminal hijacked the keys | Check terminal settings or try another terminal |

---

## Lesson Summary

You learned:

1. Three areas of the TUI interface (status bar, chat area, input area)
2. Core operations trio (`@` reference, `!` execute, `/` command)
3. Most commonly used shortcuts

---

## Next Lesson Preview

> Next lesson we'll learn **[How to Copy Content](./01b-copy-paste)**.
>
> You'll learn:
> - Why Ctrl+C doesn't copy
> - How to copy with mouse on Win/Mac
> - How to copy AI's long code blocks
