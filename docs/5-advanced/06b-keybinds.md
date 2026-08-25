---
title: 5.6b 快捷键
subtitle: 高效操作的肌肉记忆
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.6b"
duration: 10 分钟
practice: 15 分钟
level: 进阶
description: 自定义 60+ 快捷键，打造顺手的操作体验，提升效率。
tags:
  - 快捷键
  - 效率
  - TUI
prerequisite:
  - 5.1 配置全解
---

# 5.6b 快捷键

> 60+ 快捷键全自定义，打造顺手的操作体验。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/06b-keybinds-notes.mini.jpeg" alt="快捷键学霸笔记" data-zoom-src="/images/5-advanced/06b-keybinds-notes.jpeg" />

---

## 学完你能做什么

- 掌握 Leader 键机制
- 自定义任意快捷键
- 禁用不需要的快捷键
- 解决终端快捷键冲突

---

## Leader 键

OpenCode 使用 **Leader 键** 避免与终端快捷键冲突。

默认 Leader 键：<kbd>Ctrl</kbd>+<kbd>X</kbd>

**使用方式**：先按 Leader 键，松开，再按第二个键。

```
Ctrl+X → n    # 新建会话
Ctrl+X → l    # 会话列表
Ctrl+X → m    # 模型列表
```

---

## 快捷键配置

TUI 快捷键使用扁平的 `keybinds` 映射，配置在独立的 `tui.json` 或 `tui.jsonc` 中：

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  "keybinds": {
    // 修改 Leader 键
    "leader": "ctrl+x",
    
    // 自定义快捷键
    "session_new": "<leader>n",
    "model_list": "<leader>m",
    
    // 多个按键绑定同一功能（逗号分隔）
    "app_exit": "ctrl+c,ctrl+d,<leader>q",
    
    // 禁用快捷键
    "session_compact": false
  }
}
```

常用配置位置如下，后加载的配置覆盖先加载的配置：

1. 全局配置目录中的 `tui.json` / `tui.jsonc`
2. `OPENCODE_TUI_CONFIG` 指向的自定义文件
3. 从当前打开目录向文件系统根逐层发现，再按根侧到当前目录应用的 `tui.json` / `tui.jsonc`
4. 沿途 `.opencode/tui.json` / `.opencode/tui.jsonc`
5. `OPENCODE_CONFIG_DIR` 中的 TUI 配置

普通项目文件按根侧到当前目录应用，越近当前目录越优先；多个 `.opencode` 目录按当前侧到根侧合并，冲突时更靠根侧者后加载并取胜。`OPENCODE_CONFIG_DIR` 最后加载。

从旧版本升级时，启动 TUI 会检查全局、项目沿途、配置目录和 `OPENCODE_CONFIG` 指定的旧主配置，把其中的 `theme`、`keybinds` 和旧 `tui` 字段迁移到同目录的 `tui.json`。如果目标 `tui.json` 已存在，则跳过该目录；只有 `tui.jsonc` 不会阻止迁移。成功写入新文件并创建或复用 `.tui-migration.bak` 备份后，才从原配置删除旧字段。主配置已不再读取这些 TUI 字段。

### 禁用快捷键

设置为 `"none"` 或 `false` 均可禁用：

```jsonc
{
  "keybinds": {
    "session_compact": "none",
    "sidebar_toggle": false
  }
}
```

### 多键绑定

用逗号分隔多个按键：

```jsonc
{
  "keybinds": {
    "input_newline": "shift+return,ctrl+return,alt+return,ctrl+j"
  }
}
```

---

## 常用可配置快捷键

### 应用控制

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `leader` | `ctrl+x` | Leader 键 |
| `app_exit` | `ctrl+c,ctrl+d,<leader>q` | 退出应用 |
| `diff_open` | `none` | 打开 diff viewer（默认通过 `/diff` 或命令面板进入） |
| `terminal_suspend` | `ctrl+z` | 挂起终端 |
| `terminal_title_toggle` | `none` | 切换终端标题 |

### 界面控制

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `editor_open` | `<leader>e` | 打开外部编辑器 |
| `theme_list` | `<leader>t` | 主题列表 |
| `sidebar_toggle` | `<leader>b` | 切换侧边栏 |
| `scrollbar_toggle` | `none` | 切换滚动条 |
| `status_view` | `<leader>s` | 状态视图 |
| `tool_details` | `none` | 切换工具详情 |
| `tips_toggle` | `<leader>h` | 切换首页提示 |

### 会话管理

<AdInArticle />

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `session_new` | `<leader>n` | 新建会话 |
| `session_list` | `<leader>l` | 会话列表 |
| `session_export` | `<leader>x` | 导出会话 |
| `session_timeline` | `<leader>g` | 会话时间线 |
| `session_interrupt` | `escape` | 中断响应 |
| `session_background` | `ctrl+b` | 将同步运行的子 Agent 转入后台 |
| `session_compact` | `<leader>c` | 压缩上下文 |
| `session_fork` | `none` | 从消息分叉 |
| `session_rename` | `ctrl+r` | 重命名会话 |
| `session_share` | `none` | 分享会话 |
| `session_unshare` | `none` | 取消分享 |

### 会话导航

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `session_child_cycle` | `right` | 切换子会话 |
| `session_child_cycle_reverse` | `left` | 反向切换子会话 |
| `session_parent` | `up` | 返回父会话 |

### 消息操作

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `messages_copy` | `<leader>y` | 复制消息 |
| `messages_undo` | `<leader>u` | 撤销消息 |
| `messages_redo` | `<leader>r` | 重做消息 |
| `messages_toggle_conceal` | `<leader>h` | 切换代码块折叠 |

这里的 `messages_undo` / `messages_redo` 是会话级撤销与恢复：撤销会回到选定消息，并回滚其后的关联文件补丁；重做会恢复被撤销的状态。主配置 `opencode.json` / `opencode.jsonc` 中设置 `"snapshot": false` 时，消息仍可回退，但不会撤销或恢复文件改动。它们不同于输入框内的 `input_undo` / `input_redo`。

### Diff viewer

Diff viewer 默认启用，可通过 `/diff`、命令面板，或为 `diff_open` 自定义快捷键进入。它带文件树，可在工作区改动和最后一轮 AI 改动之间切换；当前分支不是默认分支时，还会提供与主分支比较。它支持按文件或 hunk 导航、单文件 patch、统一/分栏视图和已审阅标记。

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `diff_close` | `escape,q` | 关闭并返回上一屏 |
| `diff_toggle` | `enter,space` | 展开目录或选择文件 |
| `diff_expand` / `diff_collapse` | `right` / `left` | 展开或折叠文件树项目 |
| `diff_expand_all` | `E` | 展开全部目录 |
| `diff_switch_focus` | `tab` | 在文件树与 patch 区之间切换 |
| `diff_next_hunk` / `diff_previous_hunk` | `]` / `[` | 跳到下一个/上一个 hunk |
| `diff_next_file` / `diff_previous_file` | `n` / `p` | 跳到下一个/上一个文件 |
| `diff_toggle_file_tree` | `b` | 显示或隐藏文件树 |
| `diff_single_patch` | `s` | 在单个 patch 与全部 patch 之间切换 |
| `diff_switch_source` | `d` | 切换 diff 来源 |
| `diff_toggle_view` | `v` | 切换分栏或统一视图 |
| `diff_help` | `?` | 显示完整 diff 快捷键帮助 |

`m` 是 diff viewer 内置的“标记已审阅”按键，不属于 `keybinds` 配置项。

### 消息滚动

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `messages_page_up` | `pageup,ctrl+alt+b` | 向上翻页 |
| `messages_page_down` | `pagedown,ctrl+alt+f` | 向下翻页 |
| `messages_half_page_up` | `ctrl+alt+u` | 向上半页 |
| `messages_half_page_down` | `ctrl+alt+d` | 向下半页 |
| `messages_first` | `ctrl+g,home` | 跳到第一条 |
| `messages_last` | `ctrl+alt+g,end` | 跳到最后一条 |
| `messages_next` | `none` | 下一条消息 |
| `messages_previous` | `none` | 上一条消息 |
| `messages_last_user` | `none` | 最后一条用户消息 |

### 模型与 Agent

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `model_list` | `<leader>m` | 模型列表 |
| `model_cycle_recent` | `f2` | 切换最近模型 |
| `model_cycle_recent_reverse` | `shift+f2` | 反向切换 |
| `model_cycle_favorite` | `none` | 切换收藏模型 |
| `model_cycle_favorite_reverse` | `none` | 反向切换收藏 |
| `variant_cycle` | `ctrl+t` | 切换模型变体 |
| `agent_list` | `<leader>a` | Agent 列表 |
| `agent_cycle` | `tab` | 切换 Agent |
| `agent_cycle_reverse` | `shift+tab` | 反向切换 Agent |
| `command_list` | `ctrl+p` | 命令面板 |
| `prompt_skills` | `none` | 打开 Skill 选择器 |

### 输入区基础

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `input_submit` | `return` | 发送消息 |
| `input_newline` | `shift+return,ctrl+return,alt+return,ctrl+j` | 换行 |
| `input_clear` | `ctrl+c` | 清空输入 |
| `input_paste` | `ctrl+v` | 粘贴 |
| `input_undo` | `ctrl+-,super+z` | 撤销输入 |
| `input_redo` | `ctrl+.,super+shift+z` | 重做输入 |

### 输入区光标移动

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `input_move_left` | `left,ctrl+b` | 左移一字符 |
| `input_move_right` | `right,ctrl+f` | 右移一字符 |
| `input_move_up` | `up` | 上移一行 |
| `input_move_down` | `down` | 下移一行 |
| `input_word_forward` | `alt+f,alt+right,ctrl+right` | 前进一单词 |
| `input_word_backward` | `alt+b,alt+left,ctrl+left` | 后退一单词 |
| `input_line_home` | `ctrl+a` | 行首 |
| `input_line_end` | `ctrl+e` | 行尾 |
| `input_visual_line_home` | `alt+a` | 可视行首 |
| `input_visual_line_end` | `alt+e` | 可视行尾 |
| `input_buffer_home` | `home` | 缓冲区开头 |
| `input_buffer_end` | `end` | 缓冲区结尾 |

### 光标外观

光标外观不是键绑定，和 `keybinds` 同级配置：

```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  "cursor": {
    "style": "line",
    "blinking": true
  }
}
```

`style` 可设为 `block`、`underline`、`line` 或 `default`；`default` 保留终端设置，此时 `blinking` 不生效。

### 输入区选择

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `input_select_left` | `shift+left` | 向左选择 |
| `input_select_right` | `shift+right` | 向右选择 |
| `input_select_up` | `shift+up` | 向上选择 |
| `input_select_down` | `shift+down` | 向下选择 |
| `input_select_word_forward` | `alt+shift+f,alt+shift+right` | 选择下一单词 |
| `input_select_word_backward` | `alt+shift+b,alt+shift+left` | 选择上一单词 |
| `input_select_line_home` | `ctrl+shift+a` | 选择到行首 |
| `input_select_line_end` | `ctrl+shift+e` | 选择到行尾 |
| `input_select_visual_line_home` | `alt+shift+a` | 选择到可视行首 |
| `input_select_visual_line_end` | `alt+shift+e` | 选择到可视行尾 |
| `input_select_buffer_home` | `shift+home` | 选择到开头 |
| `input_select_buffer_end` | `shift+end` | 选择到结尾 |

### 输入区删除

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `input_backspace` | `backspace,shift+backspace` | 退格 |
| `input_delete` | `ctrl+d,delete,shift+delete` | 删除字符 |
| `input_delete_line` | `ctrl+shift+d` | 删除整行 |
| `input_delete_to_line_end` | `ctrl+k` | 删除到行尾 |
| `input_delete_to_line_start` | `ctrl+u` | 删除到行首 |
| `input_delete_word_forward` | `alt+d,alt+delete,ctrl+delete` | 删除下一单词 |
| `input_delete_word_backward` | `ctrl+w,ctrl+backspace,alt+backspace` | 删除上一单词 |

### 历史记录

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `history_previous` | `up` | 上一条历史 |
| `history_next` | `down` | 下一条历史 |

---

## Desktop 桌面版快捷键

OpenCode 桌面版的输入框支持 Readline/Emacs 风格快捷键（内置，不可通过配置修改）：

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+A` | 移到行首 |
| `Ctrl+E` | 移到行尾 |
| `Ctrl+B` | 后退一字符 |
| `Ctrl+F` | 前进一字符 |
| `Alt+B` | 后退一单词 |
| `Alt+F` | 前进一单词 |
| `Ctrl+D` | 删除当前字符 |
| `Ctrl+K` | 删除到行尾 |
| `Ctrl+U` | 删除到行首 |
| `Ctrl+W` | 删除上一单词 |
| `Alt+D` | 删除下一单词 |
| `Ctrl+T` | 交换字符 |
| `Ctrl+G` | 取消弹窗 / 中断响应 |

---

## 终端兼容性

### Shift+Enter 问题

部分终端默认不发送 `Shift+Enter` 修饰键。

**症状**：按 `Shift+Enter` 不换行，直接发送消息。

### Windows Terminal 配置

编辑 `settings.json`（路径：`%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json`）：

在 `actions` 数组添加：

```json
{
  "command": {
    "action": "sendInput",
    "input": "\u001b[13;2u"
  },
  "id": "User.sendInput.ShiftEnterCustom"
}
```

在 `keybindings` 数组添加：

```json
{
  "keys": "shift+enter",
  "id": "User.sendInput.ShiftEnterCustom"
}
```

保存后重启 Windows Terminal。

### 其他终端

- **iTerm2**：默认支持，无需配置
- **Alacritty**：默认支持
- **Kitty**：默认支持
- **GNOME Terminal**：可能需要更新到较新版本

---

## 常用场景配置

### Vim 风格

```jsonc
{
  "keybinds": {
    "leader": "space",
    "messages_page_up": "ctrl+u",
    "messages_page_down": "ctrl+d",
    "messages_first": "gg",
    "messages_last": "G"
  }
}
```

### 精简模式

禁用不常用的快捷键：

```jsonc
{
  "keybinds": {
    "sidebar_toggle": "none",
    "scrollbar_toggle": "none",
    "session_fork": "none",
    "session_share": "none",
    "session_unshare": "none",
    "tips_toggle": "none"
  }
}
```

### 单手操作

将常用操作集中到左手：

```jsonc
{
  "keybinds": {
    "session_new": "ctrl+n",
    "session_list": "ctrl+l",
    "model_list": "ctrl+m",
    "agent_cycle": "ctrl+tab"
  }
}
```

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 快捷键不生效 | 终端劫持了该按键 | 检查终端设置，或换个按键 |
| Shift+Enter 不换行 | 终端不发送修饰键 | 配置终端（见上文） |
| 配置了但没反应 | 用了 `keybind`（单数） | 应使用 `keybinds`（复数） |
| 用 `null` 禁用不行 | 语法错误 | 应使用 `"none"` 或 `false` |
| Leader 键冲突 | 和其他程序冲突 | 改用其他 Leader 键如 `ctrl+space` |
| Ctrl+C 不清空输入 | 被终端的 SIGINT 拦截 | 使用其他按键或接受默认行为 |

---

## 快捷键速记口诀

```
Tab 切 Agent，Ctrl+C 清
Leader 加字母，功能随便挑
n 新建 l 列表 m 模型
u 撤销 r 重做不用愁
方向键左右，子会话来回走
```

---

## 本课小结

你学会了：

1. 使用 Leader 键机制避免冲突
2. 在 `keybinds` 中自定义快捷键
3. 用 `"none"` 或 `false` 禁用不需要的快捷键
4. 用逗号分隔绑定多个按键
5. 解决终端 Shift+Enter 兼容性问题

---

## 相关资源

- [v1.18.22 快捷键定义](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/keybind.ts#L28-L75) - 扁平绑定、禁用值与 diff 默认键
- [v1.18.22 后台会话与 Skill 绑定](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/keybind.ts#L86-L98) / [Skill](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/keybind.ts#L153-L159) - 新增绑定及默认值
- [v1.18.22 光标配置](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/index.tsx#L33-L40) - 光标形状与闪烁
- [v1.18.22 TUI 配置加载顺序](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/tui.ts#L171-L209) - 全局、自定义、项目与 `.opencode` 配置
- [v1.18.22 TUI 配置迁移](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/tui-migrate.ts#L24-L67) - `opencode.json` 到 `tui.json` 的迁移行为
- [v1.18.22 diff viewer](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/feature-plugins/system/diff-viewer.tsx#L563-L704) - 导航、视图与来源切换
- [v1.18.22 会话撤销](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/revert.ts#L38-L98) - revert / unrevert 与文件补丁恢复
- [v1.18.22 snapshot 配置](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/config.ts#L52-L55) - `snapshot:false` 的文件恢复边界
- [速查/快捷键速查表](../appendix/keybinds) - 打印版速查表
- [5.6a 主题系统](./06a-themes) - 外观定制
- [5.1 配置全解](./01a-config-basics) - 完整配置说明
