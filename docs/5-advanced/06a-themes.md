---
title: 5.6a 主题系统
subtitle: 定制你的视觉体验
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.6a"
duration: 10 分钟
practice: 10 分钟
level: 进阶
description: 使用 50+ 内置主题或自定义颜色，打造个性化的终端视觉体验。
tags:
  - 主题
  - 外观
  - TUI
prerequisite:
  - 5.1 配置全解
---

# 5.6a 主题系统

> 50+ 内置主题随意切换，还能自定义每一个颜色。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/06a-themes-notes.mini.jpeg" alt="主题系统学霸笔记" data-zoom-src="/images/5-advanced/06a-themes-notes.jpeg" />

---

## 学完你能做什么

- 切换和设置主题
- 理解主题加载优先级
- 创建自定义主题
- 配置 TUI 滚动和 Diff 样式

---

## 终端要求

主题需要终端支持 **truecolor**（24位色）：

```bash
# 检查支持
echo $COLORTERM  # 应输出 truecolor 或 24bit

# 如不支持，添加到 shell 配置
export COLORTERM=truecolor
```

**兼容性说明**：
- 支持：iTerm2、Alacritty、Kitty、Windows Terminal、GNOME Terminal（新版）
- 不支持 truecolor 时，主题会降级到 256 色近似

---

## 切换主题

```
/theme
```

或使用快捷键：<kbd>Ctrl</kbd>+<kbd>X</kbd> → <kbd>T</kbd>

---

## 内置主题

OpenCode 内置 **32** 个主题：

| 主题 | 风格 | 来源 |
|-----|------|------|
| `opencode` | 默认主题，橙色调 | OpenCode 原创 |
| `system` | 自适应终端配色 | 特殊 |
| `tokyonight` | 暗色，蓝紫调 | [tokyonight.nvim](https://github.com/folke/tokyonight.nvim) |
| `catppuccin` | 暗色，柔和粉调 | [Catppuccin](https://github.com/catppuccin) |
| `catppuccin-macchiato` | 暗色，Macchiato 变体 | [Catppuccin](https://github.com/catppuccin) |
| `catppuccin-frappe` | 暗色，Frappe 变体 | [Catppuccin](https://github.com/catppuccin) |
| `gruvbox` | 暗色，复古暖调 | [Gruvbox](https://github.com/morhetz/gruvbox) |
| `nord` | 暗色，北欧冷调 | [Nord](https://github.com/nordtheme/nord) |
| `everforest` | 暗色，自然绿 | [Everforest](https://github.com/sainnhe/everforest) |
| `ayu` | 暗色，Ayu 风格 | [Ayu](https://github.com/ayu-theme) |
| `kanagawa` | 暗色，日式水墨 | [Kanagawa](https://github.com/rebelot/kanagawa.nvim) |
| `one-dark` | 暗色，Atom 风格 | [Atom One](https://github.com/Th3Whit3Wolf/one-nvim) |
| `dracula` | 暗色，紫色调 | Dracula |
| `matrix` | 黑客风格绿 | 经典 |
| `monokai` | 暗色，经典 Monokai | Monokai |
| `material` | 暗色，Material Design | Material |
| `solarized` | 暗色/亮色，Solarized | Solarized |
| `palenight` | 暗色，紫蓝调 | Palenight |
| `nightowl` | 暗色，适合夜间 | Night Owl |
| `rosepine` | 暗色，玫瑰调 | Rose Pine |
| `synthwave84` | 复古霓虹风 | Synthwave '84 |
| `cobalt2` | 暗色，钴蓝调 | Cobalt2 |
| `github` | GitHub 风格 | GitHub |
| `vercel` | 暗色，Vercel 风格 | Vercel |
| `cursor` | 暗色，Cursor 风格 | Cursor |
| `vesper` | 暗色，柔和 | Vesper |
| `aura` | 暗色，紫色调 | Aura |
| `flexoki` | 暗色，柔和墨水调 | Flexoki |
| `zenburn` | 暗色，低对比度护眼 | Zenburn |
| `mercury` | 暗色，银灰调 | Mercury |
| `orng` | 暗色，橙色调 | OpenCode |
| `lucent-orng` | 暗色，明亮橙色调 | OpenCode |
| `osaka-jade` | 暗色，翡翠绿调 | OpenCode |

> 输入 `/theme` 可实时预览所有主题效果。

---

## System 主题

`system` 是特殊主题，自动适配终端配色：

- **自动生成灰度**：根据终端背景色生成最佳对比度的灰度
- **使用 ANSI 颜色**：使用标准 ANSI 颜色（0-15），跟随终端配色
- **保留终端默认**：文字和背景使用 `none`，保持终端原生外观

**适合人群**：

- 希望 OpenCode 匹配终端外观的用户
- 使用自定义终端配色方案的用户
- 追求所有终端程序风格统一的用户

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "theme": "system"
}
```

---

## 配置默认主题

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "theme": "tokyonight"
}
```

> **注意**：配置键是 `theme`，不是 `tui.theme`。

---

## 自定义主题

### 主题加载顺序

优先级从低到高（后加载的覆盖前面的）：

1. **内置主题** - 嵌入二进制文件中
2. **用户配置目录** - `~/.config/opencode/themes/*.json` 或 `$XDG_CONFIG_HOME/opencode/themes/*.json`
3. **项目根目录** - `<project-root>/.opencode/themes/*.json`
4. **当前工作目录** - `./.opencode/themes/*.json`

同名主题会被覆盖。例如创建 `~/.config/opencode/themes/tokyonight.json` 可以覆盖内置的 tokyonight 主题。

### 创建主题

**用户全局主题**：

```bash
mkdir -p ~/.config/opencode/themes
vim ~/.config/opencode/themes/my-theme.json
```

**项目专属主题**：

```bash
mkdir -p .opencode/themes
vim .opencode/themes/my-theme.json
```

### 主题 JSON 格式

```jsonc
{
  "$schema": "https://opencode.ai/theme.json",
  "defs": {
    // 颜色定义（可选），用于复用
    "bg": "#1a1b26",
    "fg": "#c0caf5",
    "blue": "#7aa2f7",
    "green": "#9ece6a",
    "red": "#f7768e"
  },
  "theme": {
    // 必须定义的颜色属性
    "primary": { "dark": "blue", "light": "#3b7dd8" },
    "text": { "dark": "fg", "light": "#1a1a1a" },
    "background": { "dark": "bg", "light": "#ffffff" }
    // ... 其他属性
  }
}
```

### 颜色格式

| 格式 | 示例 | 说明 |
|------|------|------|
| Hex | `"#ffffff"` | 标准十六进制颜色 |
| ANSI | `3` | 0-255 ANSI 颜色码 |
| 引用 | `"primary"` | 引用 `defs` 中定义的颜色 |
| 明暗变体 | `{"dark": "#000", "light": "#fff"}` | 深色/浅色模式分别设置 |
| 无色 | `"none"` | 使用终端默认色（透明） |

### 完整主题属性

主题包含以下颜色属性（均需提供 dark/light 变体）：

**基础颜色**：

| 属性 | 说明 |
|------|------|
| `primary` | 主色调，用于强调元素 |
| `secondary` | 次要色调 |
| `accent` | 点缀色 |
| `error` | 错误提示色 |
| `warning` | 警告提示色 |
| `success` | 成功提示色 |
| `info` | 信息提示色 |

**文字与背景**：

| 属性 | 说明 |
|------|------|
| `text` | 主文字颜色 |
| `textMuted` | 次要/灰色文字 |
| `background` | 主背景色 |
| `backgroundPanel` | 面板背景色 |
| `backgroundElement` | 元素背景色 |

**边框**：

| 属性 | 说明 |
|------|------|
| `border` | 普通边框 |
| `borderActive` | 激活状态边框 |
| `borderSubtle` | 柔和边框 |

**Diff 视图**：

| 属性 | 说明 |
|------|------|
| `diffAdded` | 新增行文字色 |
| `diffRemoved` | 删除行文字色 |
| `diffContext` | 上下文行文字色 |
| `diffHunkHeader` | Hunk 头部文字色 |
| `diffHighlightAdded` | 新增高亮 |
| `diffHighlightRemoved` | 删除高亮 |
| `diffAddedBg` | 新增行背景 |
| `diffRemovedBg` | 删除行背景 |
| `diffContextBg` | 上下文背景 |
| `diffLineNumber` | 行号颜色 |
| `diffAddedLineNumberBg` | 新增行号背景 |
| `diffRemovedLineNumberBg` | 删除行号背景 |

**Markdown 渲染**：

| 属性 | 说明 |
|------|------|
| `markdownText` | 正文 |
| `markdownHeading` | 标题 |
| `markdownLink` | 链接 URL |
| `markdownLinkText` | 链接文字 |
| `markdownCode` | 行内代码 |
| `markdownBlockQuote` | 引用块 |
| `markdownEmph` | 斜体 |
| `markdownStrong` | 粗体 |
| `markdownHorizontalRule` | 水平线 |
| `markdownListItem` | 列表标记 |
| `markdownListEnumeration` | 有序列表数字 |
| `markdownImage` | 图片链接 |
| `markdownImageText` | 图片说明 |
| `markdownCodeBlock` | 代码块文字 |

**语法高亮**：

| 属性 | 说明 |
|------|------|
| `syntaxComment` | 注释 |
| `syntaxKeyword` | 关键字 |
| `syntaxFunction` | 函数名 |
| `syntaxVariable` | 变量名 |
| `syntaxString` | 字符串 |
| `syntaxNumber` | 数字 |
| `syntaxType` | 类型 |
| `syntaxOperator` | 操作符 |
| `syntaxPunctuation` | 标点 |

### 完整示例

以 Nord 主题为例：

```jsonc
{
  "$schema": "https://opencode.ai/theme.json",
  "defs": {
    "nord0": "#2E3440",
    "nord1": "#3B4252",
    "nord4": "#D8DEE9",
    "nord8": "#88C0D0",
    "nord11": "#BF616A",
    "nord14": "#A3BE8C"
  },
  "theme": {
    "primary": { "dark": "nord8", "light": "#5E81AC" },
    "secondary": { "dark": "#81A1C1", "light": "#81A1C1" },
    "error": { "dark": "nord11", "light": "nord11" },
    "success": { "dark": "nord14", "light": "nord14" },
    "text": { "dark": "nord4", "light": "nord0" },
    "background": { "dark": "nord0", "light": "#ECEFF4" },
    "diffAdded": { "dark": "nord14", "light": "nord14" },
    "diffRemoved": { "dark": "nord11", "light": "nord11" },
    "syntaxKeyword": { "dark": "#81A1C1", "light": "#81A1C1" },
    "syntaxString": { "dark": "nord14", "light": "nord14" }
    // ... 其他属性
  }
}
```

---

## TUI 配置

除了主题颜色，还可以配置 TUI 行为：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "tui": {
    // 滚动速度（最小 0.001，默认 Unix 为 1，Windows 为 3）
    "scroll_speed": 3,
    
    // 滚动加速度（启用后覆盖 scroll_speed）
    "scroll_acceleration": {
      "enabled": true
    },
    
    // Diff 渲染样式
    // "auto": 根据终端宽度自适应
    // "stacked": 始终单列显示
    "diff_style": "auto"
  }
}
```

**参数说明**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `scroll_speed` | number | 1 (Unix) / 3 (Windows) | 滚动速度，最小 0.001 |
| `scroll_acceleration.enabled` | boolean | false | 启用 macOS 风格滚动加速 |
| `diff_style` | `"auto"` \| `"stacked"` | `"auto"` | Diff 渲染样式 |

> **注意**：启用 `scroll_acceleration` 后，`scroll_speed` 设置将被忽略。

---

## 编辑器设置

OpenCode 支持打开外部编辑器编辑长文本：

```bash
# 设置编辑器（添加到 ~/.zshrc 或 ~/.bashrc）
export EDITOR="code --wait"  # VS Code
export EDITOR="cursor --wait" # Cursor
export EDITOR="vim"          # Vim
export EDITOR="nano"         # Nano
```

在 OpenCode 中使用：

```
/editor
```

或快捷键：<kbd>Ctrl</kbd>+<kbd>X</kbd> → <kbd>E</kbd>

> **注意**：GUI 编辑器（VS Code、Cursor 等）需要 `--wait` 参数，让 OpenCode 等待编辑器关闭。

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 颜色显示不对/降级 | 终端不支持 truecolor | 设置 `COLORTERM=truecolor` |
| `/themes` 命令不存在 | 命令名错了 | 使用 `/theme`（无 s） |
| 主题配置不生效 | 用了 `tui.theme` | 应直接用 `theme` |
| 自定义主题没加载 | 路径不对 | 确认放在 `.opencode/themes/` 或 `~/.config/opencode/themes/` |
| 编辑器打不开 | EDITOR 变量不对 | 确认编辑器命令可用，GUI 编辑器加 `--wait` |
| 滚动太快/太慢 | 默认速度不合适 | 调整 `tui.scroll_speed` 或启用加速 |

---

## 本课小结

你学会了：

1. 使用 `/theme` 切换 32+ 内置主题
2. 理解 `system` 主题的自适应机制
3. 在配置中设置 `theme` 指定默认主题
4. 创建自定义主题 JSON 文件
5. 配置 TUI 滚动和 Diff 样式
6. 设置外部编辑器

---

## 下一课预告

> 下一课我们将学习快捷键定制。

→ [5.6b 快捷键](./06b-keybinds)
