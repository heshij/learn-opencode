# 5.22 调试与诊断工具

> 像开发者一样剖析 OpenCode

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/22-debugging-notes.mini.jpeg"
     alt="调试与诊断工具学霸笔记"
     data-zoom-src="/images/5-advanced/22-debugging-notes.jpeg" />

---

## 🎒 开始前的准备

- 了解命令行基本操作
- 遇到过难以排查的 Bug 或配置问题

## 核心思路

OpenCode 内置了一套强大的调试工具箱 `opencode debug`。这些工具不仅用于开发调试，也能帮助高级用户诊断配置错误、文件系统问题和 AI 行为异常。

## 跟我做

### 1. 调试配置 (Config)

想知道你的配置到底怎么生效的？

**重要场景**：OpenCode 的主配置不仅来自 `opencode.json`，**插件也可以在启动时动态注入配置**。

如果你想确认：
- 某个插件注入的配置是否生效？
- 默认值、用户配置和插件配置合并后的**最终结果**是什么？

必须使用此命令：

```bash
opencode debug config
```

**输出示例**（截取）：
```json
{
  "$schema": "https://opencode.ai/config.json",
  // 这里列出配置中声明的 Agent
  "agent": {
    "coder": { ... },
    "writer": { ... },
    "my-custom-agent": { ... } // 确认自定义 Agent 是否存在
  },
  // 这里可能包含插件动态注入的配置
  "plugin_injected_config": { ... }
}
```

::: warning TUI 配置不在这里
`theme`、`keybinds` 和滚动、光标等界面设置已经移到独立的 `tui.json` / `tui.jsonc`。`opencode debug config` 读取的是主配置服务，因此输出中没有这些字段是正常现象；请直接检查对应层级的 TUI 配置文件及其 `https://opencode.ai/tui.json` Schema。
:::

如果旧主配置仍保留 `theme`、`keybinds` 或 `tui`，先检查同目录是否已有 `tui.json`：已有时自动迁移会跳过；只有 `tui.jsonc` 时不会跳过。没有目标文件时，启动 TUI 后应生成 `tui.json` 和 `<原主配置>.tui-migration.bak`；已有备份会被复用。只有新文件写入和备份成功后，旧字段才会从主配置删除。

> 源码依据：[debug config 只读取主配置服务](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/cli/cmd/debug/config.ts#L5-L13) 和 [TUI 迁移规则](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/config/tui-migrate.ts#L24-L67)。

::: tip 💡 怎么看加载了哪些 Agent？
`opencode debug config` 的 `agent` 字段只能确认配置中声明的 Agent，不能代表运行时完整列表；内置 Agent 会由 Agent 服务另行组装。要查看当前可用 Agent，请使用 TUI 的 Agent 列表或 Agent API。
:::

### 2. 调试文件系统 (File & Ripgrep)

OpenCode 依赖 ripgrep 进行极速搜索。如果搜索结果不符合预期，可以用这些命令排查。

**检查搜索底层行为**：
```bash
# 测试搜索
opencode debug rg search "关键词"

# 查看文件树（OpenCode 眼中的目录结构）
opencode debug rg tree
```

**检查文件读取**：
```bash
# 读取文件内容（以 JSON 格式，包含元数据）
opencode debug file read package.json
```

### 3. 调试 Agent 和 Skill

当你安装了大量插件或手动添加了很多 Skill 时，可能会遇到**"我装了但不知道生效没"**的情况。

**用了下面这个命令，就能快速知道 OpenCode 现在实际加载了哪些 Skill**。它会列出 Skill 的名称和物理路径，是排查冲突的终极手段。

**列出实际加载的 Skill**：
```bash
opencode debug skill
```

**输出示例**：
```json
[
  {
    "name": "fanyi",
    "description": "...",
    // 确认加载的是哪个路径下的文件
    "location": "/Users/user/.claude/skills/fanyi/SKILL.md"
  },
  {
    "name": "sync-changelog",
    // 确认是否覆盖了同名 Skill
    "location": "/Users/user/.config/opencode/skill/sync-changelog/SKILL.md"
  }
]
```

**查看 Agent 配置详情**：
```bash
# 查看 audit-gemini 的完整配置（含权限、Prompt）
opencode debug agent audit-gemini
```

**[高阶] 手动执行 Agent 工具**：
想测试 Agent 能否成功调用某个工具？可以直接测试：

```bash
# 测试 audit-gemini 使用 bash 工具
opencode debug agent audit-gemini --tool bash --params '{"command":"ls -la"}'
```

**列出所有 Skill**：
```bash
opencode debug skill
```

### 4. 调试 LSP (语言服务器)

如果代码补全、跳转定义不工作，可能是 LSP 出了问题。

```bash
# 获取文件的诊断信息（报错/警告）
opencode debug lsp diagnostics src/index.ts

# 搜索工作区符号
opencode debug lsp symbols "AppController"

# 获取单个文件的符号结构
opencode debug lsp document-symbols src/index.ts
```

### 5. 查看系统状态 (Paths & Scrap)

**查看关键路径**：
不知道数据存在哪？
```bash
opencode debug paths
```

**输出示例**：
```
data       /Users/username/.local/share/opencode
config     /Users/username/.config/opencode
log        /Users/username/.local/share/opencode/log
cache      /Users/username/.cache/opencode
```

**查看项目历史 (Scrap)**：
OpenCode 会记录你打开过的所有项目（Worktree）。
```bash
opencode debug scrap
```

### 6. 调试快照 (Snapshot)

OpenCode 的上下文压缩依赖快照机制。

```bash
# 追踪当前快照状态
opencode debug snapshot track

# 查看快照差异
opencode debug snapshot diff <hash>
```

## 命令速查表

| 命令 | 用途 | 典型场景 |
|------|------|----------|
| `debug config` | 查看最终主配置 | 检查模型、Agent、权限等主配置是否生效 |
| `debug agent <name>` | 查看 Agent 详情 | 检查 Prompt、权限、工具列表 |
| `debug agent --tool` | **手动执行工具** | 验证工具参数格式、测试工具权限 |
| `debug skill` | 列出 Skill | 确认 Skill 是否加载、查看加载路径 |
| `debug rg search` | 测试搜索 | 排查搜索不到文件的问题 |
| `debug file read` | 读取文件 | 检查文件内容读取是否包含元数据 |
| `debug file status` | 文件状态 | 查看 Git 状态集成 |
| `debug paths` | 查看路径 | 找日志文件、清空缓存时确认路径 |
| `debug lsp` | 调试 LSP | 排查代码补全/跳转失效问题 |
| `debug scrap` | 查看项目列表 | 找回历史项目 ID |

## 踩坑提醒

| 现象 | 原因 | 解决 |
|------|------|------|
| `command not found` | 旧版本 OpenCode | 升级到最新版 |
| 输出内容过多 | JSON 数据量大 | 配合 `> debug.txt` 重定向到文件查看 |
| `debug agent` 报错 | 未指定 Agent 名称 | 必须加名字，如 `opencode debug agent coder` |

## 本课小结

`opencode debug` 命令的核心价值在于**"运行时可见性"**：

1.  **Config**: 看到的是插件注入并合并后的**最终配置**，而非静态文件。
2.  **Skill**: 看到的是**实际加载**的清单和路径，确认没有被忽略或覆盖。
3.  **Agent**: 看到的是完整的上下文和权限，甚至可以模拟执行。

当你怀疑 OpenCode "坏了"的时候，先用这些命令照一照，通常能发现是配置问题还是真的 Bug。
