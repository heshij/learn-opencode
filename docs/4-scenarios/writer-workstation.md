---
title: A9 打造创作工作站
subtitle: 创建专属 Agent、Skill 和命令
course: OpenCode 中文实战课
stage: 第四阶段
lesson: "A9"
duration: 25 分钟
practice: 30 分钟
level: 进阶
description: 创建专属创作 Agent、自定义 Skill 和斜杠命令，打造你的个人 AI 创作工作站。
tags:
  - Agent
  - Skill
  - 命令
  - 工作站
prerequisite:
  - A1 创作工作流
  - 3.2 认识 Agent
---

# A9 打造创作工作站

> 💡 **一句话总结**：创建专属创作 Agent、Skill 和快捷命令，固化你的内容生产工作流。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/4-scenarios/writer-workstation-notes.mini.jpeg"
     alt="A9 打造创作工作站学霸笔记"
     data-zoom-src="/images/4-scenarios/writer-workstation-notes.jpeg" />

---

## 学完你能做什么

- 创建专属创作 Agent（公众号/小红书/小说/编剧）
- 创建创作 Skill（选题规划/批量生成/风格检查）
- 创建快捷命令（/公众号、/小红书、/润色）
- 搭建个人创作工作站

---

## 为什么用 OpenCode，而不是网页版 AI？

| 能力 | 网页版 AI | OpenCode |
|-----|----------|----------|
| 自定义 Agent | ❌ 只能用通用 AI | ✅ 创建专属人格，永久生效 |
| 快捷命令 | ❌ 每次重新输入 | ✅ `/公众号` 一键触发完整流程 |
| Skill 复用 | ❌ | ✅ 复杂指令封装成 Skill，随时调用 |
| 工作流固化 | ❌ | ✅ 流程、风格、模板全部持久化 |
| 团队共享 | ❌ | ✅ 配置文件版本化，团队复用 |

**这是 OpenCode 的终极价值** —— 不只是用 AI，而是打造你自己的 AI 工作站。

---

## 你现在的困境

- 每次写作都要重复输入相同的提示词
- 常用的写作流程没法固化下来
- 希望有个"专属写作助手"懂我的风格

---

## 什么时候用这一招

- 当你需要：固化写作流程，提高效率
- 而且不想：每次都从零开始教 AI 你的偏好

---

## 🎒 开始前的准备

> 确保你已经完成以下事项：

- [ ] 完成了 [A1 创作工作流](./writer-workflow)
- [ ] 完成了 [3.2 认识 Agent](../3-workflow/02-agents)
- [ ] 有一个写作项目文件夹

---

## 核心思路

### 写作工作站三要素

| 要素 | 作用 | 示例 |
|-----|------|------|
| Agent | 专属 AI 人格 | 小说家 Agent、编剧 Agent |
| Skill | 复杂指令封装 | 角色设计技能、情节生成技能 |
| 命令 | 快捷触发 | /角色、/场景、/润色 |

---

## Agent 常用字段

Frontmatter 中可以配置的字段：

| 字段 | 类型 | 说明 | 示例 |
|-----|------|------|-------|
| `name` | 字符串（必需） | Agent 名称，文件名即名称 |
| `description` | 字符串（必需） | Agent 功能描述，显示在菜单中 |
| `mode` | `"primary"` 或 `"subagent"` | 主 agent 可通过 Tab 切换，子 agent 通过 @ 调用 |
| `temperature` | 数字（0.0-1.0） | 控制随机性：0.0-0.2 专注，0.3-0.5 平衡，0.6-1.0 创意 |
| `model` | 字符串 | 覆盖默认模型，格式：`provider/model-id` |
| `permission` | 对象 | 精细权限控制，如 `{ "edit": "ask" }` |
| `hidden` | 布尔值 | 隐藏子 agent（不显示在 @ 自动补全） |
| `color` | 十六进制颜色 | 自定义 Agent 显示颜色，如 `#FF5733` |
| `steps` | 正整数 | 最大迭代次数，防止无限循环 |
| `disable` | 布尔值 | 设置为 `true` 禁用该 agent |
| `options` | 对象 | 传递给 provider 的额外模型选项，如 OpenAI 的 `reasoningEffort` |
| `disable` | 布尔值 | 禁用该 Agent |

> 💡 所有未列出的字段会直接传递给 provider 作为模型选项（如 OpenAI 的 `reasoningEffort`）

---

## 跟我做

### 第 1 步：创建写作 Agent

**为什么**  
专属 Agent 理解你的写作风格和偏好。

```bash
mkdir -p ~/.config/opencode/agent
```

创建 Agent 配置文件。注意：

- **文件名就是 Agent 名称**，例如 `novelist.md`
- frontmatter 中使用 `mode` 字段（不是 `agent`）

```bash
opencode
```

```
帮我创建一个写作 Agent，保存到 ~/.config/opencode/agent/novelist.md，内容如下：

---
name: novelist
description: 专业小说创作助手，擅长构思情节、设计角色、润色文字
mode: subagent
temperature: 0.8
---

# 小说家 Agent

你是一位经验丰富的小说创作导师，擅长：
- 故事结构设计（三幕结构、英雄之旅）
- 角色塑造（性格、动机、弧光）
- 情节发展（冲突、转折、高潮）
- 文字润色（节奏、意境、对话）

## 工作原则
1. 先理解作者意图，再提供建议
2. 建议具体可操作，附带示例
3. 尊重作者风格，不强加己见
4. 鼓励创新，避免套路化
```

### 第 2 步：创建写作 Skill

**为什么**  
Skill 封装复杂的写作指令，一键调用。

**重要**：Skill 目录结构必须是 `skill/<名称>/SKILL.md`

```bash
mkdir -p .opencode/skill/character-design
```

创建角色设计 Skill：

```
帮我创建一个角色设计 Skill，保存到 .opencode/skill/character-design/SKILL.md：

> ⚠️ **命名规则**
> - 必须小写字母、数字、连字符
> - 1-64 个字符
> - 不以连字符开头或结尾
> - 不包含连续连字符（`--`）
> - 必须与目录名一致
> - 正则：`^[a-z0-9]+(-[a-z0-9]+)*$`

---
name: character-design
description: 生成详细的小说角色卡
---

# 角色设计技能

根据用户提供的角色类型，生成完整的角色卡。

## 输出格式

### 基本信息
- 姓名、年龄、职业、外貌

### 性格光谱
- 3 个正面特质
- 2 个负面特质

### 背景故事
- 影响性格形成的关键事件

### 核心动机
- 外在目标
- 内在需求

### 人物弧光
- 起点状态 → 终点状态

### 标志性特征
- 口头禅或小动作
```

### Skill 权限控制

你可以通过配置控制哪些 Skill 可以被 agent 使用。在 `opencode.json` 中配置：

```json
{
  "permission": {
    "skill": {
      "character-design": "allow",
      "internal-*": "deny",
      "*": "allow"
    }
  }
}
```

| 权限 | 行为 |
|------|------|
| `allow` | Skill 立即加载 |
| `deny` | Skill 对 agent 隐藏，拒绝访问 |
| `ask` | 加载前请求用户批准 |

支持通配符模式：`internal-*` 匹配所有以 `internal-` 开头的 skill。

### 第 3 步：创建快捷命令

**为什么**  
快捷命令让常用操作一键触发。

```bash
mkdir -p .opencode/command
```

创建 /角色 命令：

```
帮我创建一个快捷命令，保存到 .opencode/command/角色.md：

---
description: 快速生成角色卡
agent: novelist
---

请使用 character-design 技能，为我设计一个角色：

角色类型：$ARGUMENTS
```

创建 /润色 命令：

```
帮我创建一个快捷命令，保存到 .opencode/command/润色.md：

---
description: 润色选中的文本
---

请润色以下内容，提升文字表现力，保持原意：

$ARGUMENTS
```

---

## Command 高级特性

除了 `$ARGUMENTS`，还支持以下高级用法：

### 位置参数

访问单独的参数：

| 参数 | 说明 |
|-----|------|
| `$1` | 第一个参数 |
| `$2` | 第二个参数 |
| `$3` | 第三个参数 |
| ... | 依此类推 |

示例：

```md
---
description: 创建文件并写入内容
---

创建文件名为 $1 的文件，目录为 $2，内容为：
$3
```

运行：`/创建-file config.json src "{ \"key\": \"value\" }"`

### 子任务模式

使用 `subtask: true` 强制命令作为子任务执行，不污染主上下文。

```md
---
description: 深度分析代码
subtask: true
---

执行深度代码分析：
$ARGUMENTS
```

### Shell 输出注入

使用 `!command` 将 bash 命令输出注入到命令模板。

示例：分析测试结果

```md
---
description: 分析测试覆盖率
---

当前测试结果：
!`npm test`

基于结果建议优化方案。
```

示例：审查最近更改

```md
---
description: 审查最近的更改
---

最近的 Git 提交：
!`git log --oneline -10`

审查并建议改进。
```

### 第 4 步：测试写作工作站

**为什么**  
确认配置生效。

重启 OpenCode：

```bash
opencode
```

测试 Agent：

```
按 Tab 切换，看看是否有 "小说家" Agent
```

测试命令：

```
/角色 霸道总裁
```

**你应该看到**：AI 用小说家 Agent 和角色设计 Skill 生成角色卡

---

## 高级配置技巧

### 权限控制

Agent 可以精细控制工具和技能的访问权限。在 agent 的 frontmatter 中配置：

```markdown
---
name: readonly-reviewer
description: 只读代码审查
permission:
  edit: deny
  bash:
    "*": ask
    "git diff": allow
    "git log*": allow
  webfetch: deny
---

只分析代码，不修改。
```

权限选项：
- `"ask"` — 执行前请求批准
- `"allow"` — 允许所有操作无需批准
- `"deny"` — 禁用工具

### 嵌套 Agent

你可以将 agent 放在子文件夹中组织，例如：

```
.opencode/agent/
  ├── writing/
  │   ├── novelist.md
  │   └── copywriter.md
  └── coding/
      ├── frontend.md
      └── backend.md
```

这样可以通过 `@writing/novelist` 或 `@coding/frontend` 来调用。

---

## 检查点 ✅

> 全部通过才能继续

- [ ] 创建了写作 Agent
- [ ] 创建了至少一个 Skill
- [ ] 创建了至少一个快捷命令
- [ ] 命令能正常调用

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| Agent 没生效 | 配置文件位置不对 | 确认放在 `~/.config/opencode/agent/` 或 `.opencode/agent/`，文件名就是 agent 名称 |
| Agent frontmatter 报错 | 使用了错误字段 | frontmatter 中使用 `mode` 而非 `agent`，必需字段是 `name` 和 `description` |
| Skill 找不到 | 目录结构不对 | 确认目录是 `skill/<名称>/SKILL.md`（小写），不是 `skill/<名称>/SKILL.md` |
| Skill 命名不合规 | 命名规则错误 | 小写字母数字、1-64 字符、不以连字符开头结尾、不含连续连字符 |
| 命令报错 | 参数语法错误 | 检查 `$ARGUMENTS`、`$1` 等占位符的使用 |

---

## 本课小结

你学会了：

1. 创建专属写作 Agent
2. 创建封装复杂指令的 Skill
3. 创建快捷命令一键触发
4. 三者组合搭建写作工作站

🎉 **恭喜你完成了写作线全部课程！**

---

## 下一步建议

- 想学更多定制技巧？→ [第五阶段：深度定制](/5-advanced/)
- 想试试其他场景？→ [程序员线](/4-scenarios/coder-daily) 或 [效率提升线](/4-scenarios/office-files)
