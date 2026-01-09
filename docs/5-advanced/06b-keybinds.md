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

在 `opencode.json` 中配置：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "keybinds": {
    // 修改 Leader 键
    "leader": "ctrl+x",
    
    // 自定义快捷键
    "session_new": "<leader>n",
    "model_list": "<leader>m",
    
    // 多个按键绑定同一功能（逗号分隔）
    "app_exit": "ctrl+c,ctrl+d,<leader>q",
    
    // 禁用快捷键
    "session_compact": "none"
  }
}
```

> **注意**：配置键是 `keybinds`（复数），这是唯一使用复数的配置键！

### 禁用快捷键

设置为 `"none"` 禁用：

```jsonc
{
  "keybinds": {
    "session_compact": "none",
    "sidebar_toggle": "none"
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

## 完整快捷键列表

### 应用控制

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `leader` | `ctrl+x` | Leader 键 |
| `app_exit` | `ctrl+c,ctrl+d,<leader>q` | 退出应用 |
| `terminal_suspend` | `ctrl+z` | 挂起终端 |
| `terminal_title_toggle` | `none` | 切换终端标题 |

### 界面控制

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `editor_open` | `<leader>e` | 打开外部编辑器 |
| `theme_list` | `<leader>t` | 主题列表 |
| `sidebar_toggle` | `<leader>b` | 切换侧边栏 |
| `scrollbar_toggle` | `none` | 切换滚动条 |
| `username_toggle` | `none` | 切换用户名显示 |
| `status_view` | `<leader>s` | 状态视图 |
| `tool_details` | `none` | 切换工具详情 |
| `tips_toggle` | `<leader>h` | 切换首页提示 |

### 会话管理

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `session_new` | `<leader>n` | 新建会话 |
| `session_list` | `<leader>l` | 会话列表 |
| `session_export` | `<leader>x` | 导出会话 |
| `session_timeline` | `<leader>g` | 会话时间线 |
| `session_interrupt` | `escape` | 中断响应 |
| `session_compact` | `<leader>c` | 压缩上下文 |
| `session_fork` | `none` | 从消息分叉 |
| `session_rename` | `none` | 重命名会话 |
| `session_share` | `none` | 分享会话 |
| `session_unshare` | `none` | 取消分享 |

### 会话导航

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `session_child_cycle` | `<leader>right` | 切换子会话 |
| `session_child_cycle_reverse` | `<leader>left` | 反向切换子会话 |
| `session_parent` | `<leader>up` | 返回父会话 |

### 消息操作

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `messages_copy` | `<leader>y` | 复制消息 |
| `messages_undo` | `<leader>u` | 撤销消息 |
| `messages_redo` | `<leader>r` | 重做消息 |
| `messages_toggle_conceal` | `<leader>h` | 切换代码块折叠 |

### 消息滚动

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `messages_page_up` | `pageup` | 向上翻页 |
| `messages_page_down` | `pagedown` | 向下翻页 |
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
| 用 `null` 禁用不行 | 语法错误 | 应使用 `"none"` 字符串 |
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
3. 用 `"none"` 禁用不需要的快捷键
4. 用逗号分隔绑定多个按键
5. 解决终端 Shift+Enter 兼容性问题

---

## 相关资源

- [速查/快捷键速查表](../appendix/keybinds) - 打印版速查表
- [5.6a 主题系统](./06a-themes) - 外观定制
- [5.1 配置全解](./01a-config-basics) - 完整配置说明
