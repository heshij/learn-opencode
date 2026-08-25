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
| `Leader` → `t` | 主题列表 | 等同于 /themes |
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
| `Ctrl+B` | 后台运行 | 将同步运行的子 Agent 转入后台 |

### Diff viewer

输入 `/diff` 或从命令面板打开 diff viewer；`diff_open` 默认未绑定按键，也可以自行配置。viewer 默认启用，支持文件树、文件/hunk 导航、单个或全部 patch、统一/分栏视图，以及工作区和最后一轮 AI 改动；当前分支不是默认分支时，还可选择主分支对比。

| 快捷键 | 功能 |
|--------|------|
| `Esc` / `q` | 关闭并返回上一屏 |
| `Tab` | 切换文件树与 patch 区焦点 |
| `]` / `[` | 下一个/上一个 hunk |
| `n` / `p` | 下一个/上一个文件 |
| `b` | 显示/隐藏文件树 |
| `s` | 切换单个/全部 patch |
| `d` | 切换 diff 来源 |
| `v` | 切换分栏/统一视图 |
| `m` | 标记或取消标记文件为已审阅 |
| `?` | 显示完整帮助 |

### 会话导航

| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `→` | 子会话 | 切换到子 Agent 会话 |
| `←` | 反向子会话 | 反向切换子会话 |
| `↑` | 父会话 | 返回父会话 |

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

<AdInArticle />

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

在独立的 `tui.json` 或 `tui.jsonc` 中配置扁平的 `keybinds` 映射：

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "keybinds": {
    "leader": "ctrl+x",
    "session_new": "<leader>n",
    "session_list": "<leader>l",
    "model_list": "<leader>m"
  }
}
```

### 禁用快捷键

设置为 `"none"` 或 `false` 禁用：

```json
{
  "keybinds": {
    "session_compact": false
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

### 配置位置与迁移

加载顺序为：全局配置目录、`OPENCODE_TUI_CONFIG`、普通项目 `tui.json` / `tui.jsonc`、沿途 `.opencode`、`OPENCODE_CONFIG_DIR`，后者优先。普通项目文件按根侧到当前目录应用，越近当前目录越优先；多个 `.opencode` 目录按当前侧到根侧合并，冲突时更靠根侧者后加载并取胜。`OPENCODE_CONFIG_DIR` 最后加载。

升级时，启动 TUI 会检查全局、项目沿途、配置目录和 `OPENCODE_CONFIG` 指定的旧主配置，把其中的 `theme`、`keybinds` 和 `tui` 字段迁到同目录的 `tui.json`。目标 `tui.json` 已存在时跳过；只有 `tui.jsonc` 不会阻止迁移。成功写入并创建或复用 `.tui-migration.bak` 后，才从原配置删除旧字段。主配置已不再读取这些字段。

### 光标外观

`cursor` 与 `keybinds` 同级；`style` 支持 `block`、`underline`、`line`、`default`，`blinking` 控制闪烁。`default` 会保留终端设置并忽略 `blinking`。

## 常用可配置键绑定

> 来源：[v1.18.22 `keybind.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/keybind.ts#L45-L75)
>
> 新增项：[后台会话](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/keybind.ts#L86-L98)、[Skill](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/keybind.ts#L153-L159)、[cursor](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/config/index.tsx#L33-L40)

### 基础键绑定

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `leader` | `ctrl+x` | Leader 键 |
| `app_exit` | `ctrl+c,ctrl+d,<leader>q` | 退出 |
| `diff_open` | `none` | 打开 diff viewer |

### 会话管理

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `session_new` | `<leader>n` | 新建会话 |
| `session_list` | `<leader>l` | 会话列表 |
| `session_export` | `<leader>x` | 导出会话 |
| `session_interrupt` | `escape` | 中断响应 |
| `session_background` | `ctrl+b` | 将同步子 Agent 转入后台 |
| `session_compact` | `<leader>c` | 压缩上下文 |
| `session_timeline` | `<leader>g` | 时间线 |
| `session_child_cycle` | `right` | 切换子会话 |
| `session_child_cycle_reverse` | `left` | 反向切换子会话 |
| `session_parent` | `up` | 返回父会话 |
| `session_fork` | `none` | 分叉会话 |
| `session_rename` | `ctrl+r` | 重命名会话 |
| `session_delete` | `ctrl+d` | 删除会话 |
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
| `prompt_skills` | `none` | 打开 Skill 选择器 |

### Diff viewer

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `diff_close` | `escape,q` | 关闭 viewer |
| `diff_toggle` | `enter,space` | 展开或选择项目 |
| `diff_expand` / `diff_collapse` | `right` / `left` | 展开或折叠项目 |
| `diff_expand_all` | `E` | 展开全部目录 |
| `diff_switch_focus` | `tab` | 切换焦点 |
| `diff_next_hunk` / `diff_previous_hunk` | `]` / `[` | 下一个/上一个 hunk |
| `diff_next_file` / `diff_previous_file` | `n` / `p` | 下一个/上一个文件 |
| `diff_toggle_file_tree` | `b` | 切换文件树 |
| `diff_single_patch` | `s` | 切换单个/全部 patch |
| `diff_switch_source` | `d` | 切换来源 |
| `diff_toggle_view` | `v` | 切换分栏/统一视图 |
| `diff_help` | `?` | 显示帮助 |

`m` 是 viewer 内置的“标记已审阅”按键，不属于 `keybinds` 配置项。

### 界面控制

| 键名 | 默认值 | 说明 |
|------|--------|------|
| `theme_list` | `<leader>t` | 主题列表 |
| `editor_open` | `<leader>e` | 打开编辑器 |
| `sidebar_toggle` | `<leader>b` | 切换侧边栏 |
| `scrollbar_toggle` | `none` | 切换滚动条 |
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
| `messages_page_up` | `pageup,ctrl+alt+b` | 向上翻页 |
| `messages_page_down` | `pagedown,ctrl+alt+f` | 向下翻页 |
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

- [v1.18.22 TUI 配置加载](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/tui.ts#L171-L209) - 配置位置和优先级
- [v1.18.22 TUI 配置迁移](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/tui-migrate.ts#L24-L67) - 自动迁移与跳过条件
- [v1.18.22 diff viewer](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/tui/src/feature-plugins/system/diff-viewer.tsx#L563-L704) - 当前导航、视图和来源能力
- [配置选项参考](./config-ref) - 完整配置说明
- [5.6b 快捷键](../5-advanced/06b-keybinds) - 快捷键定制教程
- [5.6a 主题系统](../5-advanced/06a-themes) - 主题定制教程
