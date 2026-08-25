---
title: "5.7c Chrome DevTools MCP：让 AI 调试浏览器 | OpenCode 教程"
subtitle: Chrome DevTools MCP 实战
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.7c"
duration: 15 分钟
practice: 20 分钟
level: 进阶
description: 学习使用 Chrome DevTools MCP，让 AI 直接连接浏览器会话，调试网页、分析性能、操作 DevTools。
tags:
  - MCP
  - Chrome
  - 调试
  - 浏览器
prerequisite:
  - 5.7a MCP 基础
---

# 5.7c Chrome DevTools MCP 实战

> 💡 **一句话总结**：让 AI 直接连接你的 Chrome 浏览器，调试网页、分析性能、操作 DOM。

---

## 学完你能做什么

- 配置 Chrome DevTools MCP 服务器
- 让 AI 连接到你正在使用的浏览器会话
- 在 DevTools 中选中元素/请求，让 AI 分析
- 无需重复登录，直接调试已登录页面

---

## 你现在的困境

- 想让 AI 帮忙调试网页，但需要反复截图或复制代码
- 登录后的页面问题，AI 无法访问（需要重新登录）
- 在 DevTools 发现问题，要手动复制信息给 AI 解释
- 明明 Chrome 已经开着，MCP 还是报 `chrome-beta` 找不到

---

## 什么是 Chrome DevTools MCP

Chrome DevTools MCP 是 Google 官方的浏览器 MCP。结果就三件事：

1. **直接接管你当前的 Chrome**
2. **复用你已经登录的状态**
3. **把 DevTools 能看到的信息交给 AI**

### 和传统浏览器自动化有什么不同

| 对比项 | Chrome DevTools MCP | Puppeteer / Playwright / Selenium |
|------|------|------|
| 登录状态 | 直接复用当前浏览器 | 通常要自己维护 cookie / token |
| 浏览器实例 | 连已打开的 Chrome | 常常新开一个实例 |
| 元素定位 | `uid`（a11y tree） | CSS / XPath |
| 调试视角 | 更像“看页面语义” | 更像“查 DOM 节点” |

::: info 什么是 `uid`？
这里的 `uid` 是页面快照里的临时标识，来自可访问性树，不是 CSS 选择器。

它的好处是不依赖页面 class 名。缺点也很直接：**页面一刷新，uid 可能就变了，不能硬编码。**
:::

```
┌─────────────────────────────────────────────────────────────┐
│                    Chrome DevTools MCP                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   你的浏览器 ◄──────────► MCP 服务器 ◄──────────► OpenCode   │
│   (已登录状态)              (本地)              (AI Agent)   │
│                                                              │
│   ✓ 无需重新登录                                            │
│   ✓ 访问当前会话                                            │
│   ✓ DevTools 功能                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 典型使用场景

| 场景 | 传统方式 | 使用 MCP |
|------|---------|---------|
| 调试登录后页面 | 截图 + 复制代码 | AI 直接访问浏览器 |
| 分析网络请求 | 手动复制请求信息 | AI 读取 Network 面板 |
| 检查 DOM 结构 | 复制 HTML 代码 | AI 直接操作元素面板 |
| 性能分析 | 导出报告给 AI | AI 直接读取性能数据 |

---

## 前置条件

::: tip 先记住这一句就够了
浏览器用 **Chrome 146+**，配置里不要写 `beta`。你平时用稳定版 Chrome，就配稳定版。
:::

### 步骤 1：确保 Chrome 版本 ≥ 146

**macOS / Windows / Linux**：

访问 [Chrome 下载页面](https://www.google.com/chrome/) 下载安装最新版本。

确保版本号 ≥ 146：在 Chrome 地址栏输入 `chrome://version` 查看。

### 步骤 2：启用远程调试

1. 打开 Chrome
2. 在地址栏输入：
   ```
   chrome://inspect/#remote-debugging
   ```
3. 点击 **启用** 远程调试

页面大概长这样：

![Chrome 远程调试开关页面](/images/mcp-chrome-remote-debugging.png)

**你应该看到**：

```
┌─────────────────────────────────────────────────────────────┐
│  Remote debugging                                           │
│                                                             │
│  [✓] Discover network targets                              │
│                                                             │
│  Remote debugging is enabled                               │
│                                                             │
│  When MCP servers request a debugging session, Chrome      │
│  will show a permission dialog.                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 配置 MCP 服务器

直接配全局文件 `~/.config/opencode/opencode.json`：

### 方法一：手动编辑配置文件

编辑 `~/.config/opencode/opencode.json` 或项目目录下的 `.opencode/opencode.json`：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "chrome-devtools": {
      "type": "local",
      "command": ["npx", "-y", "chrome-devtools-mcp@latest", "--autoConnect", "--channel=stable"],
      "enabled": true
    }
  }
}
```

**参数说明**：

| 参数 | 说明 |
|------|------|
| `--autoConnect` | 自动连接到当前活动的 Chrome 实例 |
| `--channel=stable` | 明确使用稳定版 Chrome，省掉版本混淆 |

如果你更喜欢交互式配置，也可以用：

```bash
opencode mcp add
```

---

## 验证连接

### 检查 MCP 状态

```bash
opencode mcp list
```

**你应该看到**：

```
✓ chrome-devtools connected
    npx -y chrome-devtools-mcp@latest --autoConnect
```

### 在 OpenCode 中测试

重启 OpenCode 后，输入：

```
列出当前打开的浏览器标签页
```

不用刻意写 `use chrome-devtools`。正常和 OpenCode 说人话就行，它该用 MCP 时会自己调用。

**首次连接时**，Chrome 会弹出权限对话框：

```
┌─────────────────────────────────────────────────────────────┐
│  Chrome                                                     │
│                                                             │
│  "chrome-devtools-mcp" wants to start a remote debugging   │
│  session with Chrome.                                       │
│                                                             │
│  [Allow]  [Block]                                          │
└─────────────────────────────────────────────────────────────┘
```

点击 **Allow** 允许连接。

连接成功后，Chrome 顶部会显示：

```
┌─────────────────────────────────────────────────────────────┐
│  Chrome is being controlled by automated test software.     │
└─────────────────────────────────────────────────────────────┘
```

::: tip 如果改完配置还不生效
先退出 OpenCode，再重新打开。很多时候是旧的 MCP 进程还没退掉。
:::

---

## 这个 MCP 到底能干嘛

别把它只当成“给 AI 一个浏览器”。它真正强的地方，分成三类。

### 直接操作页面

- 打开网页、切标签页、前进后退、刷新
- 截图、读取页面快照、点击、输入、按键
- 上传文件、处理弹窗、拖拽元素

这是最直观的自动化：本来你手点，现在 AI 帮你点。

### 直接读调试信息

- 看控制台报错
- 看网络请求和响应
- 看页面结构和可访问性树
- 跑 Lighthouse 审计
- 跑性能追踪、分析 LCP / INP / CLS
- 做内存快照

这类能力最适合调试前端问题。以前你要截图、复制报错、导 HAR。现在 AI 直接看现场。

### 直接复用你当前浏览器的登录状态

- 不用额外传 cookie
- 不用重新登录
- 不用单独维护 token / session
- 浏览器里能看到的页面，AI 基本都能接着操作

这才是它最强的地方。很多网页任务，难点不是“点按钮”，而是“先登录进去，再拿到真实页面状态”。

以前做这类事，你常常要：

- 自己抓 cookie
- 处理登录过期
- 处理双重验证或风控
- 想办法把页面信息转给 AI

现在的思路反过来了：**你先正常登录，AI 直接接你的浏览器继续做。**

### 和传统浏览器自动化比，真正强在哪

- 传统自动化常常要新开浏览器、重新维护登录态
- Chrome DevTools MCP 直接接你的现有会话
- 传统工具更偏脚本和选择器
- 这个 MCP 更适合让 AI 一边看页面，一边做判断，再继续操作

一句话说，传统自动化更像“你写脚本指挥浏览器”，Chrome DevTools MCP 更像“AI 直接接手你已经打开的浏览器”。

### 最实用的场景

- **调试登录后页面**：后台、控制台、会员页、已登录工作台
- **排查网页问题**：看 Network、Console、Elements、Performance
- **内容运营**：发帖、整理时间线、收集信息、做 Markdown 摘要
- **表单和后台操作**：重复填报、批量录入、上传附件
- **网页巡检**：截图、性能审计、回归检查
- **把网页当工作流节点**：先问网页里的 AI，再继续自动操作

### 再往上走一步：它能组成完整工作流

最强的不是单个动作，而是串起来：

1. 打开页面
2. 读取页面状态
3. 判断下一步
4. 点击或输入
5. 再读结果
6. 继续操作或产出报告

所以它不只是“浏览器自动化”，更像是一个带视觉上下文的网页工作流引擎。

### 这次实际跑通的案例

| 案例 | 实际结果 | 用到的能力 |
|------|------|------|
| 连接当前 Chrome | 成功列出 28 个标签页 | `list_pages` |
| 读取当前页面 | 成功拿到页面快照 | `take_snapshot` |
| 在 X 发帖 | 成功发出一条测试帖 | 导航、点击、输入 |
| 整理 X 时间线 | 抓取 14 条内容并写成 `x_timeline.md` | 导航、等待、快照、写文件 |
| 问 Grok 并关注账号 | 让 Grok 推荐 AI 从业者，再去关注 | 多步页面操作 |

### 先记这 4 个结论

| 现象 | 真正该做的事 |
|------|-------------|
| 报 `chrome-beta` 找不到 | 配置别写 beta，直接用稳定版 Chrome |
| 用户说“Chrome 已经开了” | 先确认开的是不是同一个版本的 Chrome |
| 改完配置还是老错误 | 优先怀疑旧 MCP 进程没退出，先重启 OpenCode |
| `list_pages` 成功了 | 再补一个 `take_snapshot` 或截图，确认真的连通 |

---

## 实战示例

<AdInArticle />

### 示例 1：查看浏览器标签页

```
列出当前所有打开的标签页
```

AI 会调用 `chrome-devtools_list_pages` 工具，返回类似：

```json
[
  { "pageId": 1, "title": "OpenCode Tutorial", "url": "https://learnopencode.com" },
  { "pageId": 2, "title": "GitHub", "url": "https://github.com" }
]
```

### 示例 2：截图当前页面

```
对当前页面截图
```

AI 会调用 `chrome-devtools_take_screenshot`，返回页面截图。

### 示例 3：直接发一条 X 帖子

这次真实跑通过一条：

```text
在 x 的首页，帮我发个帖子，说：这条消息是 OpenCode 连 MCP 发出的
```

结果：成功发出帖子。

这个例子最能说明一件事：**它不是只能“看网页”，而是真的能操作你当前登录的浏览器。**

::: warning 做自动化操作时，记得主动限速
AI 默认不会天然按“人类速度”操作。像发帖、点赞、关注、批量点击、批量填表这类动作，如果连续太快，容易触发平台风控。

推荐你直接在提示词里写清楚：

```text
帮我操作慢一点，模拟真人节奏。每一步之间停 2-3 秒，不要连续快速点击。
```

如果是更敏感的平台，可以再保守一点：

```text
这次操作尽量像真人，页面变化后先等待，再继续下一步；每次点击后停 3-5 秒。
```
:::

### 示例 4：分析网络请求

在 Chrome DevTools 的 Network 面板中选中一个请求，然后问 AI：

```
我选中了一个失败的 API 请求，帮我分析一下为什么会失败
```

AI 可以读取你选中的请求信息，分析问题原因。

**你可以这样问得更具体一点**：

```text
我在 Network 面板里选中了一个 401 请求，帮我看是 Cookie、Authorization 头，还是 CORS 出了问题。
```

### 示例 5：检查页面元素

在 Elements 面板中选中一个元素：

这招很适合排查：按钮为什么点不到、样式为什么被覆盖、间距为什么不对。

```
我选中了一个按钮元素，帮我看看它的 CSS 样式有什么问题
```

### 示例 6：执行 JavaScript

```
在当前页面执行 console.log('Hello from OpenCode')
```

### 示例 7：调试登录后页面

```
帮我检查当前页面的登录状态是否正常
```

AI 可以直接访问你已登录的会话，无需重新登录。

这也是它最实用的地方之一。很多问题只会在“登录后、带真实数据、带真实权限”的页面里出现，这时候截图和口述都不如直接把浏览器交给 AI 看。

### 示例 8：把时间线整理成 Markdown

这次还实际做过一件很适合内容工作流的事：

```text
把我 X 上正在关注的时间线，整理成一个 md
```

结果：抓取时间线内容，整理成了 `x_timeline.md`。

如果你平时做信息收集、行业跟踪、内容摘录，这个用法很实在。

### 示例 9：让 AI 借助网页里的 AI 再做事

这次还做过一套组合动作：

1. 打开 X 里的 Grok
2. 问它推荐几个值得关注的 AI 行业账号
3. 再去把这些账号关注掉

这说明 Chrome DevTools MCP 不只是“自动化点击”，还可以把网页本身当作工作流的一部分。

---

## 常用工具示例

Chrome DevTools MCP 的工具很多，下面先记这批高频的就够用了：

| 工具 | 功能 |
|------|------|
| `list_pages` | 列出所有打开的标签页 |
| `select_page` | 选择一个标签页 |
| `navigate_page` | 导航到 URL / 前进 / 后退 / 刷新 |
| `take_snapshot` | 获取页面快照（可访问性树） |
| `take_screenshot` | 截取页面或元素截图 |
| `click` | 点击元素 |
| `fill` | 填写表单 |
| `type_text` | 输入文本 |
| `press_key` | 按键操作 |
| `hover` | 悬停在元素上 |
| `evaluate_script` | 执行 JavaScript |
| `list_network_requests` | 列出网络请求 |
| `get_network_request` | 获取请求详情 |
| `list_console_messages` | 列出控制台消息 |
| `lighthouse_audit` | 运行 Lighthouse 审计 |
| `performance_start_trace` | 开始性能追踪 |
| `performance_stop_trace` | 停止性能追踪 |

如果你准备把它用到更完整的工作流里，下面这批也值得认识：

| 工具 | 什么时候用 |
|------|------|
| `new_page` | 需要新开标签页做搜索、登录、跳转测试 |
| `close_page` | 标签页太多，想收口当前流程 |
| `wait_for` | 等页面加载、等按钮出现、等结果出来 |
| `drag` | 拖拽上传区、排序组件、滑块类交互 |
| `fill_form` | 一次填多个表单项，比一个个 `fill` 更省事 |
| `handle_dialog` | 处理 `alert`、`confirm`、`prompt` 这类弹窗 |
| `upload_file` | 网页上传图片、PDF、附件 |
| `emulate` | 模拟移动端、弱网、地理位置、明暗模式 |
| `get_console_message` | 某条控制台报错要看完整内容时 |
| `performance_analyze_insight` | 已经跑完性能 trace，继续深挖某个性能洞察 |
| `take_memory_snapshot` | 怀疑页面有内存泄漏，想抓堆快照 |

你可以把它们理解成 3 类：

- **流程控制**：`new_page`、`close_page`、`wait_for`
- **复杂交互**：`drag`、`fill_form`、`handle_dialog`、`upload_file`
- **深度诊断**：`emulate`、`get_console_message`、`performance_analyze_insight`、`take_memory_snapshot`

::: details 为什么工具名都带 `chrome-devtools_` 前缀？
OpenCode 会把 MCP 工具注册成“服务器名 + 下划线 + 工具名”的形式。

所以你在配置里把服务器命名为 `chrome-devtools`，最终看到的工具就是 `chrome-devtools_list_pages`、`chrome-devtools_take_snapshot` 这种格式。这样做是为了避免不同 MCP 服务器的工具重名。

`v1.18.22` 已恢复并继续使用这个旧格式。开发过程中短暂出现过 `mcp__chrome-devtools__list_pages` 形式，但它不是目标版本的当前命名，不要据此修改权限规则或提示词。
:::

---

## 其他启动方式

除了 `--autoConnect`，Chrome DevTools MCP 还支持其他连接方式：

### 方式 1：独立用户配置

使用 MCP 专用的 Chrome 配置（干净环境）：

```jsonc
{
  "mcp": {
    "chrome-devtools": {
      "type": "local",
      "command": ["npx", "-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

这种方式会启动一个新的 Chrome 实例，使用临时配置文件。

### 方式 2：连接到远程调试端口

先关闭当前 Chrome，再用一个单独的 profile 启动远程调试。这样更安全，也更符合 Chrome 现在的要求：

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile

# Linux
google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile

# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir=%TEMP%\chrome-profile
```

然后配置 MCP 连接：

```jsonc
{
  "mcp": {
    "chrome-devtools": {
      "type": "local",
      "command": ["npx", "-y", "chrome-devtools-mcp@latest", "--browser-url=http://127.0.0.1:9222"]
    }
  }
}
```

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|------|------|------|
| 找不到 DevToolsActivePort for chrome-beta | 工具误连到了 beta 配置目录 | 显式加 `--channel=stable` |
| 改完配置还是继续找 beta | OpenCode 里的旧 MCP 进程还没退出 | 重启 OpenCode 后再试 |
| 连接超时 | 远程调试未启用 | 访问 `chrome://inspect/#remote-debugging` 启用 |
| 权限对话框不出现 | Chrome 版本不支持 | 升级到 Chrome 144+，建议最新稳定版 |
| 连接后立即断开 | 同时有其他调试客户端 | 关闭其他 DevTools 连接 |
| npx 下载慢 | 网络问题 | 使用代理或预先安装 `npm i -g chrome-devtools-mcp` |
| 网页操作太快被风控 | AI 连续点击、输入太快 | 在提示词里明确要求“每步停 2-5 秒，模拟真人操作” |

---

## 安全注意事项

::: warning 授权提示
每次 MCP 请求连接时，Chrome 都会弹出授权对话框。只有你点击"允许"后，AI 才能访问浏览器。

调试会话期间，Chrome 顶部会显示"Chrome 正受到自动测试软件的控制"横幅。
:::

1. **只允许可信的 MCP** - 不要随便允许未知来源的连接请求
2. **调试完成后断开** - 可以关闭 OpenCode 或重启浏览器
3. **敏感操作需谨慎** - AI 可以访问你已登录的所有网站

---

## 本课小结

你学会了：

1. **Chrome DevTools MCP** - 让 AI 直接连接浏览器会话
2. **前置条件** - Chrome 144+ + 启用远程调试
3. **配置方法** - 先用 `--autoConnect`，遇到误连 beta 再补 `--channel=stable`
4. **排错思路** - 看到 `chrome-beta` 报错，先检查 channel 和 `DevToolsActivePort`
5. **首次连接** - Chrome 会弹出授权对话框
6. **实战场景** - 调试登录后页面、分析网络请求、检查元素
7. **可用工具** - 截图、导航、执行脚本、性能分析等

---

## 相关资源

- [5.7a MCP 基础](./07a-mcp-basics) - MCP 入门配置
- [5.7b MCP 进阶](./07b-mcp-advanced) - OAuth 认证、权限管理
- [Chrome DevTools MCP 官方文档](https://developer.chrome.com/blog/chrome-devtools-mcp-debug-your-browser-session)
- [Chrome DevTools MCP GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)

---

## 下一课预告

> 下一课我们将学习 **IDE 集成**，让 OpenCode 与 VS Code、JetBrains 等编辑器无缝协作。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 对应版本：OpenCode v1.18.22

| 功能 | 文件路径 | 行号 |
|-----|---------|------|
| 客户端 capabilities 与 roots | [`src/mcp/index.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/mcp/index.ts#L38-L80) | 38-80 |
| Local MCP 的 workspace-relative `cwd` | [`src/mcp/index.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/mcp/index.ts#L340-L357) | 340-357 |
| MCP 工具命名规则（服务器名前缀） | [`src/mcp/catalog.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/mcp/catalog.ts#L117-L119) | 117-119 |
| 服务器 instructions 注入 | [`src/session/system.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/system.ts#L119-L134) | 119-134 |
| MCP resources/templates 工具 | [`src/session/tools.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/opencode/src/session/tools.ts#L27-L31) | 27-31 |
| MCP 本地/远程配置 Schema | [`src/v1/config/mcp.ts`](https://github.com/anomalyco/opencode/blob/v1.18.22/packages/core/src/v1/config/mcp.ts#L6-L23) | 6-23 |

**关键常量**：
- `DEFAULT_TIMEOUT = 30000`：MCP 连接默认超时时间（30秒）

**关键函数**：
- `create()`：按 local / remote 两种类型创建 MCP 客户端
- `status()`：汇总当前 MCP 服务器状态
- `tools()`：把 MCP 工具注册成 `服务器名_工具名` 的形式

</details>
