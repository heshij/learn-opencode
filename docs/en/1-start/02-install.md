---
title: "Installation: Done in 5 Minutes"
subtitle: "One-click installation to your local machine"
course: "OpenCode Practical Course"
stage: "Stage 1"
lesson: "1.2"
duration: "5 min"
practice: "5 min"
level: "Beginner"
description: "One-click install OpenCode AI coding assistant. Supports macOS, Windows, and Linux. Complete installation and setup in 5 minutes."
tags:
  - "Installation"
  - "macOS"
  - "Windows"
  - "Linux"
prerequisite:
  - "1.1 What is This"
---

# Installation: Done in 5 Minutes

## 📝 Course Notes

Key takeaways from this lesson:

<img src="/images/1-start/install-notes.mini.jpeg" 
     alt="Installation: Done in 5 Minutes - Notes" 
     data-zoom-src="/images/1-start/install-notes.jpeg" />

---

## What You'll Be Able to Do

- Type `opencode --version` in your terminal and see the version number

---

## Core Concept

Installing OpenCode is just three steps:

1. Run the installation command
2. Restart your terminal (to apply PATH changes)
3. Verify the installation

---

## Follow Along
<AdInArticle />

### macOS / Linux Users

Copy the command below, paste it into your terminal, and press Enter:

```bash
curl -fsSL https://opencode.ai/install | bash
```

::: details What You'll See (Success Case)
```
Installing OpenCode...

→ Detected: macOS arm64
→ Downloading opencode-darwin-arm64...
  ████████████████████████████████████████ 100%
→ Installing to ~/.opencode/bin/opencode...
→ Updating shell configuration...

✓ Installation complete!

To get started, restart your terminal and run:

  opencode
```
:::

When you see `Installation complete!`, you're all set.

---

### Windows Users

We recommend installing via **Scoop** on Windows (no admin rights required).

**If you already have Scoop:**

```powershell
scoop install opencode
```

::: details Don't Have Scoop? Click to Expand Installation Steps
Open **PowerShell** (regular user permissions recommended), and **run these commands one by one in order**:

**Step 1: Allow Script Execution (Only Needed Once)**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Step 2: Install Scoop**

```powershell
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

> **⚠️ Running as Administrator?**
>
> If your PowerShell is running with **administrator privileges** (window title shows "Administrator"), the above command will fail. Use this command instead:
>
> ```powershell
> iex "& {$(irm get.scoop.sh)} -RunAsAdmin"
> ```

**Step 3: Install Git (Scoop needs Git to add buckets)**

```powershell
scoop install git
```

**Step 4: Install OpenCode**

```powershell
scoop install opencode
```
:::

::: tip Other Windows Installation Methods
If you prefer Chocolatey, npm, Docker, or other methods, see [1.2a Alternative Installation Methods](./02a-install-alternatives).
:::

---

### Restart Your Terminal

**Why Restart?**

The installation script modified your environment variables (PATH), but your current terminal is still using the old configuration. Only after restarting will it recognize the `opencode` command.

**How to Restart:**

1. Close your current terminal window (click the X, or press Cmd+Q / Alt+F4)
2. Open a new terminal

::: details Don't Want to Close the Window?
You can also manually reload the configuration:

**macOS/Linux (zsh):**
```bash
source ~/.zshrc
```

**macOS/Linux (bash):**
```bash
source ~/.bashrc
```

But I recommend just restarting - it's more reliable.
:::

---

### Verify Installation

Type:

```bash
opencode --version
```

**You Should See:**

```
opencode x.x.x
```

The version number will change with updates. As long as it displays a version number, the installation was successful.

---

## Checklist ✅

> All items must pass before continuing

- [ ] Typing `opencode --version` in terminal shows the version number
- [ ] No `command not found` error

---

## Having Issues?

If you encounter problems during installation (command not found, network timeout, permission denied, etc.), see [1.2b Installation Troubleshooting](./02b-install-troubleshoot)

---

## 🚀 Want to Try It Now? (Optional)

After successful installation, you can start OpenCode directly to try the free models:

```bash
opencode
```

Once started, type `/models`, select a free model with the `-free` suffix (like `opencode/glm-4.7-free`), then send any message to start chatting.

::: tip Note
Free models require no registration or API Key, perfect for quick testing. See [1.4a Free Models](./04a-free-models) for details.
:::

---

## 🖥️ Desktop App (Optional)

If you prefer a graphical interface, OpenCode also offers a desktop application.

### Download and Install

| Platform | Download Method |
|----------|-----------------|
| **macOS (Apple Silicon)** | Download `opencode-desktop-darwin-aarch64.dmg` from [GitHub Releases](https://github.com/anomalyco/opencode/releases) |
| **macOS (Intel)** | Download `opencode-desktop-darwin-x64.dmg` |
| **Windows** | Download `opencode-desktop-windows-x64.exe` |
| **Linux** | `.deb`, `.rpm`, or AppImage |

**Package Manager Installation:**

```bash
# macOS Homebrew
brew install --cask opencode-desktop

# Windows Scoop
scoop bucket add extras
scoop install extras/opencode-desktop
```

### Desktop vs Terminal Version

| Feature | Terminal (TUI) | Desktop |
|---------|----------------|---------|
| Interface | Command line | Graphical window |
| System Notifications | ✅ Supported, disabled by default | ✅ Auto-notify on task completion |
| Multiple Windows | ❌ Single window | ✅ Supports multiple tabs |
| Installation Complexity | Simple | Slightly complex (need to download installer) |

::: tip Recommendation
Install both. Use the terminal version for daily work (more efficient), and the desktop version for long-running tasks (can minimize, notifies you when done).
:::

To enable terminal notifications, set `attention.enabled: true` in `tui.json`. Use `attention.notifications` to choose which events—such as questions, permission requests, completion, and errors—trigger notifications. This feature is disabled by default.

---

## Lesson Summary

You learned:

1. Install OpenCode with a single command
2. Verify the installation was successful
3. Know about the desktop app (optional)

---

## Next Lesson Preview

> In the next lesson, we'll configure networking so OpenCode can connect to AI services.
>
> **Note for users in China**: If you plan to use models like Zhipu, DeepSeek, or other domestic providers, you can skip the networking lesson and go directly to "Connect to Models".

::: tip Having Issues?
Stuck during installation? [Join the community](/en/community) to connect with 2000+ fellow learners and get real-time help.
:::
