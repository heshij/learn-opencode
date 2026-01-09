---
title: 常见问题（FAQ）
description: OpenCode 使用中的常见问题解答
---

# 常见问题（FAQ）

## 📝 课程笔记
本课核心知识点整理：

<img src="/images/appendix/faq-notes.mini.jpeg"
     alt="常见问题（FAQ）学霸笔记"
     data-zoom-src="/images/appendix/faq-notes.jpeg" />

> 遇到问题？先看这里

---

## 安装问题

### Q: 安装命令报错 "command not found"

**A**: 可能是 PATH 环境变量没有正确设置。

```bash
# 检查安装位置
which opencode

# 如果没有输出，手动添加到 PATH
# macOS/Linux
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 或者使用 npm 全局安装
npm install -g @anthropic-ai/opencode
```

---

### Q: Windows 上安装失败

**A**: 推荐使用包管理器安装：

```powershell
# 使用 Scoop
scoop install opencode

# 或使用 Chocolatey
choco install opencode

# 或使用 npm
npm install -g @anthropic-ai/opencode
```

确保以管理员权限运行终端。

---

### Q: macOS 提示"无法验证开发者"

**A**: 这是 macOS 的安全限制。

```bash
# 方法1：右键点击应用，选择"打开"
# 方法2：在终端运行
xattr -d com.apple.quarantine /path/to/opencode
```

---

### Q: 版本更新后功能异常

**A**: 尝试清除缓存并重新安装：

```bash
# 清除缓存
rm -rf ~/.cache/opencode

# 重新安装
opencode upgrade --force
```

---

## 网络问题

### Q: 连接超时，提示 "ETIMEDOUT" 或 "ECONNREFUSED"

**A**: 这是网络连接问题，国内用户常见。

**方案1：设置代理**
```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
opencode
```

**方案2：使用国产模型**
```bash
# 直接使用 DeepSeek，国内可直连
opencode
/connect  # 选择 DeepSeek
```

详见 [网络配置](../1-start/03-network)。

---

### Q: 代理设置了但还是连不上

**A**: 检查以下几点：

1. 确认代理软件正在运行
2. 确认代理端口正确
3. 检查是否需要设置 NO_PROXY
4. 尝试使用 `curl` 测试：

```bash
curl -x http://127.0.0.1:7890 https://api.anthropic.com
```

---

### Q: 公司网络需要证书怎么办

**A**: 设置自定义证书：

```bash
export NODE_EXTRA_CA_CERTS=/path/to/certificate.pem
opencode
```

或在配置文件中设置：

```json
{
  "network": {
    "ca_cert": "/path/to/certificate.pem"
  }
}
```

---

## 模型配置问题

### Q: API Key 设置了但提示"认证失败"

**A**: 检查以下几点：

1. **API Key 格式正确**：不同提供商格式不同
   - Anthropic: `sk-ant-xxx`
   - OpenAI: `sk-xxx`
   - DeepSeek: `sk-xxx`

2. **API Key 有效**：在提供商官网测试

3. **环境变量设置正确**：
   ```bash
   echo $ANTHROPIC_API_KEY  # 检查是否有值
   ```

4. **配置文件语法正确**：
   ```bash
   cat ~/.config/opencode/opencode.json | jq .  # 检查 JSON 格式
   ```

---

### Q: 提示"模型不可用"或"quota exceeded"

**A**: 

1. **额度用完**：检查提供商账户余额
2. **模型名称错误**：检查模型标识符是否正确
3. **账户限制**：某些模型需要付费账户

```bash
# 列出可用模型
opencode models list
```

---

### Q: 如何切换不同的模型

**A**: 

**方法1：TUI 中切换**
```
/models
```

**方法2：命令行指定**
```bash
opencode -m deepseek-chat
```

**方法3：配置文件设置默认值**
```json
{
  "model": "deepseek-chat"
}
```

---

### Q: 多个提供商如何配置

**A**: 在配置文件中添加多个提供商：

```json
{
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    },
    "deepseek": {
      "options": {
        "apiKey": "{env:DEEPSEEK_API_KEY}"
      }
    },
    "openai": {
      "options": {
        "apiKey": "{env:OPENAI_API_KEY}"
      }
    }
  }
}
```

然后用 `/models` 切换。

---

## 权限问题

### Q: 每次操作都要确认太烦了

**A**: 可以设置权限模式：

**方法1：本次会话自动允许**
- 按 `a` 键选择"始终允许"

**方法2：配置文件设置**
```json
{
  "permission": {
    "read": "allow",
    "edit": "allow",
    "bash": "allow"
  }
}
```

**方法3：细粒度控制**
```json
{
  "permission": {
    "read": "allow",
    "edit": "ask",
    "bash": "ask"
  }
}
```

---

### Q: AI 执行了不想执行的命令

**A**: 

1. 按 `Ctrl+C` 立即中断
2. 使用 `/undo` 撤销文件修改
3. 设置更严格的权限：

```json
{
  "permission": {
    "bash": "ask"
  }
}
```

---

### Q: 如何限制 AI 只读不写

**A**: 使用 Plan 模式：

1. 按 `Tab` 切换到 Plan 模式
2. 或启动时指定 Agent：
   ```bash
   opencode -a plan
   ```

---

## 性能问题

### Q: 响应很慢

**A**: 可能的原因和解决方案：

1. **网络延迟**：使用代理或切换到国产模型
2. **模型太大**：使用更小的模型（如 `small_model`）
3. **上下文太长**：使用 `/compact` 压缩上下文

---

### Q: 上下文太长导致报错

**A**: 

```bash
# 手动压缩
/compact

# 配置中的压缩选项
{
  "compaction": {
    "auto": true,
    "prune": true
  }
}
```

> `auto`：上下文满时自动压缩；`prune`：移除旧工具输出以节省 token

---

### Q: 内存占用过高

**A**: 

1. 关闭不用的会话
2. 配置文件监视忽略目录：
   ```json
   {
     "watcher": {
       "ignore": ["node_modules/**", "dist/**", ".git/**"]
     }
   }
   ```
3. 使用更小的模型

---

## 功能问题

### Q: 如何让 AI 记住我的偏好

**A**: 使用 AGENTS.md 或 CLAUDE.md 文件：

```markdown
<!-- AGENTS.md -->
# 项目规则

- 使用 TypeScript
- 使用 pnpm 而不是 npm
- 代码注释使用中文
- 遵循 ESLint 规则
```

或运行 `/init` 自动生成。

---

### Q: 历史会话找不到了

**A**: 

```bash
# 列出所有会话
opencode session list

# 在 TUI 中查看
/sessions
```

会话存储在 `~/.local/share/opencode/sessions/`。

---

### Q: 如何导出对话记录

**A**: 

```bash
# TUI 中导出
/export

# 命令行导出
opencode session export <session-id> -o conversation.md
```

---

### Q: 文件修改没有生效

**A**: 检查以下几点：

1. 确认在 Build 模式（不是 Plan 模式）
2. 检查文件权限
3. 查看是否有权限提示被忽略
4. 使用 `/details` 查看操作详情

---

### Q: Git 撤销/重做不工作

**A**: 

1. 确认项目是 Git 仓库
2. 确认有未提交的修改
3. 检查 Git 状态：
   ```bash
   git status
   ```

---

## 兼容性问题

### Q: 终端显示乱码

**A**: 

1. 使用推荐终端：WezTerm / Alacritty / iTerm2
2. 设置正确的编码：
   ```bash
   export LANG=en_US.UTF-8
   ```
3. 使用支持的字体（推荐 Nerd Fonts）

---

### Q: 快捷键不工作

**A**: 

1. 检查终端是否拦截了快捷键
2. 某些终端需要特殊配置
3. 尝试使用斜杠命令代替

---

### Q: VS Code 扩展找不到

**A**: 

```bash
# 手动安装扩展
code --install-extension anthropic.opencode

# 或在 VS Code 中搜索 "OpenCode"
```

---

## 其他问题

### Q: 如何获取帮助

**A**: 

1. 查看帮助：`/help`
2. 查看文档：[opencode.ai/docs](https://opencode.ai/docs)
3. 提交 Issue：[github.com/vbgate/learn-opencode](https://github.com/vbgate/learn-opencode)

---

### Q: 如何报告 Bug

**A**: 

1. 收集信息：
   ```bash
   opencode --version
   uname -a
   echo $SHELL
   ```

2. 复现步骤

3. 在 GitHub 提交 Issue

---

### Q: 如何贡献代码

**A**: 

1. Fork 仓库
2. 创建分支
3. 提交 PR
4. 等待审核

详见 [贡献指南](https://github.com/anomalyco/opencode/blob/dev/CONTRIBUTING.md)

---

## 相关资源

- [故障排除](./troubleshoot) - 详细故障排查
- [网络配置](../1-start/03-network) - 网络问题解决
- [模型提供商](./providers) - 可用模型列表

::: tip 没找到答案？
[加入社群](/community)，和 500+ 同路人一起交流，实时答疑。
:::
