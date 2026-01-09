---
title: 快捷键速查表
description: OpenCode 所有快捷键的完整参考
---

---
title: 快捷键速查表
description: OpenCode 所有快捷键的完整参考
---

# 快捷键速查表

> 打印这页贴在显示器旁边，三天就能肌肉记忆

---

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/appendix/keybinds-notes.mini.jpeg"
     alt="快捷键速查表学霸笔记"
     data-zoom-src="/images/appendix/keybinds-notes.jpeg" />

---

## Leader 键

OpenCode 使用 **Leader 键** 避免与终端快捷键冲突。

默认 Leader 键：`Ctrl+X`

使用方式：先按 `Ctrl+X`，松开，再按第二个键。

---

## TUI 快捷键

### 基础操作

| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Enter` | 发送消息 | 发送当前输入 |
| `Shift+Enter` | 换行 | 在输入框中换行 |
| `Tab` | 切换 Agent | 在 primary agent 间切换 |
| `Shift+Tab` | 反向切换 | 反向切换 primary agent |
| `Escape` | 中断 | 停止当前 AI 响应 |
| `Ctrl+C` | 清空输入 | 清空输入框内容 |
| `Ctrl+D` | 退出 | 关闭 OpenCode |
| `Ctrl+P` | 命令列表 | 打开命令面板 |

### Leader 键操作

| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Leader` → `n` | 新建会话 | 等同于 /new |
| `Leader` → `l` | 会话列表 | 等同于 /sessions |
| `Leader` → `m` | 模型列表 | 等同于 /models |
| `Leader` → `a` | Agent 列表 | 选择 Agent |
| `Leader` → `t` | 主题列表 | 等同于 /theme |
| `Leader` → `e` | 编辑器 | 打开外部编辑器 |
| `Leader` → `c` | 压缩 | 压缩当前会话上下文 |
| `Leader` → `u` | 撤销 | 撤销上一次修改 |
| `Leader` → `r` | 重做 | 重做上一次撤销 |
| `Leader` → `x` | 导出 | 导出当前会话 |
| `Leader` → `s` | 状态 | 查看状态视图 |
| `Leader` → `b` | 侧边栏 | 切换侧边栏显示 |
| `Leader` → `g` | 时间线 | 会话时间线 |
| `Leader` → `y` | 复制 | 复制消息 |
| `Leader` → `h` | 隐藏详情 | 切换详情显示 |
| `Leader` → `q` | 退出 | 关闭 OpenCode |

### 会话导航

| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Leader` → `→` | 子会话 | 切换到子 Agent 会话 |
| `Leader` → `←` | 反向子会话 | 反向切换子会话 |
| `Leader` → `↑` | 父会话 | 返回父会话 |

### 消息滚动

| 快捷键 | 功能 |
|--------|------|
| `Page Up` | 向上翻页 |
| `Page Down` | 向下翻页 |
| `Ctrl+Alt+U` | 向上半页 |
| `Ctrl+Alt+D` | 向下半页 |
| `Ctrl+G` / `Home` | 跳到顶部 |
| `Ctrl+Alt+G` / `End` | 跳到底部 |

### 输入区操作

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+A` | 光标移到行首 |
| `Ctrl+E` | 光标移到行尾 |
| `Ctrl+B` | 光标后退一字符 |
| `Ctrl+F` | 光标前进一字符 |
| `Alt+B` | 光标后退一单词 |
| `Alt+F` | 光标前进一单词 |
| `Ctrl+K` | 删除到行尾 |
| `Ctrl+U` | 删除到行首 |
| `Ctrl+W` | 删除前一单词 |
| `Alt+D` | 删除后一单词 |
| `Ctrl+D` | 删除当前字符 |
| `↑` / `↓` | 浏览输入历史 |

### 模型切换

| 快捷键 | 功能 |
|--------|------|
| `F2` | 切换最近模型 |
| `Shift+F2` | 反向切换 |
| `Ctrl+T` | 切换变体 |

### 权限确认

| 快捷键 | 功能 |
|--------|------|
| `y` | 允许 |
| `n` | 拒绝 |
| `a` | 始终允许（本会话） |

---

## IDE 扩展快捷键

### VS Code / Cursor

| 快捷键 (macOS) | 快捷键 (Win/Linux) | 功能 |
|----------------|---------------------|------|
| `Cmd+Esc` | `Ctrl+Esc` | 打开 OpenCode 面板 |
| `Cmd+Shift+Esc` | `Ctrl+Shift+Esc` | 新建会话 |
| `Cmd+Option+K` | `Alt+Ctrl+K` | 插入文件引用 |

---

## Desktop 输入快捷键

OpenCode 桌面应用的输入框支持 Readline/Emacs 风格快捷键，这些快捷键内置且不可通过 `opencode.json` 配置：

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+A` | 移动到当前行开头 |
| `Ctrl+E` | 移动到当前行结尾 |
| `Ctrl+B` | 光标后退一字符 |
| `Ctrl+F` | 光标前进一字符 |
| `Alt+B` | 光标后退一单词 |
| `Alt+F` | 光标前进一单词 |
| `Ctrl+D` | 删除光标下字符 |
| `Ctrl+K` | 删除到行尾 |
| `Ctrl+U` | 删除到行首 |
| `Ctrl+W` | 删除前一单词 |
| `Alt+D` | 删除后一单词 |
| `Ctrl+T` | 交换字符 |
| `Ctrl+G` | 取消弹窗 / 中断响应 |

---

## 自定义快捷键

在 `opencode.json` 中配置：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "keybinds": {
    "leader": "ctrl+x",
    "session_new": "<leader>n",
    "session_list": "<leader>l",
    "model_list": "<leader>m"
  }
}
```

### 禁用快捷键

设置为 `"none"` 禁用：

```json
{
  "keybinds": {
    "session_compact": "none"
  }
}
```

### 多键绑定

用逗号分隔多个按键：

```json
{
  "keybinds": {
    "app_exit": "ctrl+c,ctrl+d,<leader>q"
  }
}
```

---

## 所有可配置的键绑定

> 来源：[keybinds.mdx](https://github.com/anomalyco/opencode/blob/dev/packages/web/src/content/docs/keybinds.mdx)

### 基础键绑定

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `leader` | `ctrl+x` | Leader 键 |
| `app_exit` | `ctrl+c,ctrl+d,<leader>q` | 退出 |

### 会话管理

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `session_new` | `<leader>n` | 新建会话 |
| `session_list` | `<leader>l` | 会话列表 |
| `session_export` | `<leader>x` | 导出会话 |
| `session_interrupt` | `escape` | 中断响应 |
| `session_compact` | `<leader>c` | 压缩上下文 |
| `session_timeline` | `<leader>g` | 时间线 |
| `session_child_cycle` | `<leader>right` | 切换子会话 |
| `session_child_cycle_reverse` | `<leader>left` | 反向切换子会话 |
| `session_parent` | `<leader>up` | 返回父会话 |
| `session_fork` | `none` | 分叉会话 |
| `session_rename` | `none` | 重命名会话 |
| `session_share` | `none` | 分享会话 |
| `session_unshare` | `none` | 取消分享 |

### 模型与 Agent

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `model_list` | `<leader>m` | 模型列表 |
| `model_cycle_recent` | `f2` | 切换最近模型 |
| `model_cycle_recent_reverse` | `shift+f2` | 反向切换最近模型 |
| `model_cycle_favorite` | `none` | 切换收藏模型 |
| `model_cycle_favorite_reverse` | `none` | 反向切换收藏模型 |
| `variant_cycle` | `ctrl+t` | 切换模型变体 |
| `agent_list` | `<leader>a` | Agent 列表 |
| `agent_cycle` | `tab` | 切换 Agent |
| `agent_cycle_reverse` | `shift+tab` | 反向切换 Agent |

### 界面控制

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `theme_list` | `<leader>t` | 主题列表 |
| `editor_open` | `<leader>e` | 打开编辑器 |
| `sidebar_toggle` | `<leader>b` | 切换侧边栏 |
| `scrollbar_toggle` | `none` | 切换滚动条 |
| `username_toggle` | `none` | 切换用户名显示 |
| `status_view` | `<leader>s` | 状态视图 |
| `tool_details` | `none` | 工具详情 |
| `command_list` | `ctrl+p` | 命令面板 |
| `tips_toggle` | `<leader>h` | 切换提示显示 |

### 消息操作

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `messages_undo` | `<leader>u` | 撤销 |
| `messages_redo` | `<leader>r` | 重做 |
| `messages_copy` | `<leader>y` | 复制 |
| `messages_toggle_conceal` | `<leader>h` | 切换详情隐藏 |
| `messages_next` | `none` | 下一条消息 |
| `messages_previous` | `none` | 上一条消息 |
| `messages_last_user` | `none` | 跳到最后用户消息 |
| `messages_page_up` | `pageup` | 向上翻页 |
| `messages_page_down` | `pagedown` | 向下翻页 |
| `messages_half_page_up` | `ctrl+alt+u` | 向上半页 |
| `messages_half_page_down` | `ctrl+alt+d` | 向下半页 |
| `messages_first` | `ctrl+g,home` | 跳到顶部 |
| `messages_last` | `ctrl+alt+g,end` | 跳到底部 |

### 输入框操作

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `input_submit` | `return` | 发送 |
| `input_newline` | `shift+return,ctrl+return,alt+return,ctrl+j` | 换行 |
| `input_clear` | `ctrl+c` | 清空输入 |
| `input_paste` | `ctrl+v` | 粘贴 |
| `input_move_left` | `left,ctrl+b` | 光标左移 |
| `input_move_right` | `right,ctrl+f` | 光标右移 |
| `input_move_up` | `up` | 光标上移 |
| `input_move_down` | `down` | 光标下移 |
| `input_select_left` | `shift+left` | 选中左移 |
| `input_select_right` | `shift+right` | 选中右移 |
| `input_select_up` | `shift+up` | 选中上移 |
| `input_select_down` | `shift+down` | 选中下移 |
| `input_line_home` | `ctrl+a` | 行首 |
| `input_line_end` | `ctrl+e` | 行尾 |
| `input_select_line_home` | `ctrl+shift+a` | 选中到行首 |
| `input_select_line_end` | `ctrl+shift+e` | 选中到行尾 |
| `input_visual_line_home` | `alt+a` | 可视行首 |
| `input_visual_line_end` | `alt+e` | 可视行尾 |
| `input_select_visual_line_home` | `alt+shift+a` | 选中到可视行首 |
| `input_select_visual_line_end` | `alt+shift+e` | 选中到可视行尾 |
| `input_buffer_home` | `home` | 缓冲区开头 |
| `input_buffer_end` | `end` | 缓冲区结尾 |
| `input_select_buffer_home` | `shift+home` | 选中到缓冲区开头 |
| `input_select_buffer_end` | `shift+end` | 选中到缓冲区结尾 |
| `input_delete_line` | `ctrl+shift+d` | 删除行 |
| `input_delete_to_line_end` | `ctrl+k` | 删除到行尾 |
| `input_delete_to_line_start` | `ctrl+u` | 删除到行首 |
| `input_backspace` | `backspace,shift+backspace` | 退格 |
| `input_delete` | `ctrl+d,delete,shift+delete` | 删除 |
| `input_undo` | `ctrl+-,super+z` | 撤销输入 |
| `input_redo` | `ctrl+.,super+shift+z` | 重做输入 |
| `input_word_forward` | `alt+f,alt+right,ctrl+right` | 下一个单词 |
| `input_word_backward` | `alt+b,alt+left,ctrl+left` | 上一个单词 |
| `input_select_word_forward` | `alt+shift+f,alt+shift+right` | 选中下一个单词 |
| `input_select_word_backward` | `alt+shift+b,alt+shift+left` | 选中上一个单词 |
| `input_delete_word_forward` | `alt+d,alt+delete,ctrl+delete` | 删除下一个单词 |
| `input_delete_word_backward` | `ctrl+w,ctrl+backspace,alt+backspace` | 删除上一个单词 |

### 历史与终端

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `history_previous` | `up` | 上一条历史 |
| `history_next` | `down` | 下一条历史 |
| `terminal_suspend` | `ctrl+z` | 挂起终端 |
| `terminal_title_toggle` | `none` | 切换终端标题 |

---

## Shift+Enter 配置

部分终端默认不发送 `Shift+Enter`。

### Windows Terminal 配置

编辑 `settings.json`：

```json
{
  "actions": [
    {
      "command": {
        "action": "sendInput",
        "input": "\u001b[13;2u"
      },
      "id": "User.sendInput.ShiftEnterCustom"
    }
  ],
  "keybindings": [
    {
      "keys": "shift+enter",
      "id": "User.sendInput.ShiftEnterCustom"
    }
  ]
}
```

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

## 相关资源

- [配置选项参考](./config-ref) - 完整配置说明
- [5.6b 快捷键](../5-advanced/06b-keybinds) - 快捷键定制教程
- [5.6a 主题系统](../5-advanced/06a-themes) - 主题定制教程
