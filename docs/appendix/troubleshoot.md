---
title: 故障排除
description: OpenCode 常见故障的诊断和解决方法
---

# 故障排除

> 系统性地诊断和解决问题

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/appendix/troubleshoot-notes.mini.jpeg"
     alt="故障排除学霸笔记"
     data-zoom-src="/images/appendix/troubleshoot-notes.jpeg" />

---

## 日志和存储位置

### 日志文件

| 平台 | 路径 |
|------|------|
| macOS/Linux | `~/.local/share/opencode/log/` |
| Windows | `%USERPROFILE%\.local\share\opencode\log\` |

日志文件以时间戳命名（如 `2025-01-09T123456.log`），保留最近 10 个。

```bash
# 查看最新日志
ls -lt ~/.local/share/opencode/log/ | head

# 开启调试日志
opencode --log-level DEBUG

# 打印日志到终端
opencode --print-logs
```

### 存储位置

| 数据类型 | 路径 |
|----------|------|
| 配置文件 | `~/.config/opencode/opencode.json` |
| 认证信息 | `~/.local/share/opencode/auth.json` |
| 日志 | `~/.local/share/opencode/log/` |
| 项目数据 | `~/.local/share/opencode/project/` |
| 缓存 | `~/.cache/opencode/` |

---

## 启动问题

### 无法启动 / 命令找不到

**症状**：
```
zsh: command not found: opencode
```

**诊断步骤**：

```bash
# 1. 检查是否安装
which opencode
npm list -g opencode-ai

# 2. 检查 PATH
echo $PATH | tr ':' '\n' | grep -E "(npm|bin)"
```

**解决方案**：

```bash
# 重新安装
npm install -g opencode-ai

# 手动添加到 PATH
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

---

### 启动崩溃 / 白屏

**症状**：启动后立即退出或显示空白屏幕

**诊断步骤**：

```bash
# 1. 查看错误日志
opencode --print-logs 2>&1 | head -50

# 2. 清除缓存重试
rm -rf ~/.cache/opencode
opencode

# 3. 重置配置
mv ~/.config/opencode/opencode.json ~/.config/opencode/opencode.json.bak
opencode
```

**常见原因**：
- 配置文件语法错误
- 终端不兼容
- 缓存损坏

---

### ProviderInitError

**症状**：
```
ProviderInitError: Failed to initialize provider
```

**诊断步骤**：

```bash
# 1. 验证提供商配置
opencode auth list

# 2. 清除存储重试
rm -rf ~/.local/share/opencode
```

**解决方案**：

1. 确认按照 [提供商指南](./providers) 正确设置
2. 重新使用 `/connect` 配置

---

## 认证问题

### API Key 无效

**症状**：
```
AuthenticationError: Invalid API key
```

**诊断步骤**：

```bash
# 检查已配置的凭证
opencode auth list

# 检查环境变量
env | grep API_KEY
```

**解决方案**：

```bash
# 重新配置
opencode auth login
# 或在 TUI 中
/connect
```

---

### Token 配额超限

**症状**：
```
RateLimitError: quota exceeded
```

**解决方案**：
1. 等待配额重置
2. 升级账户计划
3. 切换到其他提供商/模型

```bash
# 切换模型
opencode -m deepseek/deepseek-chat
```

---

## 模型问题

### AI_APICallError

**症状**：
```
AI_APICallError: API call failed
```

**诊断步骤**：

```bash
# 1. 检查网络
curl -I https://api.anthropic.com

# 2. 清除提供商包缓存
rm -rf ~/.cache/opencode

# 3. 重启 opencode
```

**常见原因**：
- 网络问题
- API Key 无效
- 提供商包版本过旧

---

### ProviderModelNotFoundError

**症状**：
```
ProviderModelNotFoundError: Model not found
```

**原因**：模型引用格式错误

**正确格式**：`<providerId>/<modelId>`

**示例**：
- `anthropic/claude-sonnet-4-20250514`
- `openai/gpt-4o`
- `deepseek/deepseek-chat`

**解决方案**：

```bash
# 查看可用模型
opencode models
```

---

### 模型响应空白

**症状**：AI 没有回复或回复为空

**可能原因**：
1. 上下文超长被截断
2. 内容过滤触发
3. 模型负载过高

**解决方案**：

```
# 压缩上下文
/compact

# 新建会话
/new

# 切换模型
/models
```

---

## 网络问题

### 连接超时

**症状**：
```
ETIMEDOUT / ECONNREFUSED / ECONNRESET
```

**诊断步骤**：

```bash
# 1. 测试基本网络
ping api.anthropic.com

# 2. 测试 HTTPS
curl -v https://api.anthropic.com

# 3. 测试代理
curl -x http://127.0.0.1:7890 https://api.anthropic.com
```

**解决方案**：

```bash
# 设置代理
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890

# 或使用国产模型（无需代理）
/connect  # 选择 DeepSeek
```

---

### SSL/TLS 错误

**症状**：
```
UNABLE_TO_VERIFY_LEAF_SIGNATURE
CERT_HAS_EXPIRED
```

**解决方案**：

```bash
# 企业证书
export NODE_EXTRA_CA_CERTS=/path/to/cert.pem

# 临时禁用验证（不推荐生产使用）
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

---

## 文件操作问题

### 文件写入失败

**症状**：AI 说修改了文件但实际没变

**诊断步骤**：

```bash
# 1. 检查文件权限
ls -la path/to/file

# 2. 检查 OpenCode 权限设置
cat ~/.config/opencode/opencode.json | jq .permission
```

**解决方案**：
- 确保文件可写
- 检查权限设置为 `allow` 或 `ask`
- 在权限提示时按 `y` 确认

---

### Git 撤销不工作

**症状**：`/undo` 没有效果

**诊断步骤**：

```bash
# 确认是 Git 仓库
git status
```

**解决方案**：
- 确保在 Git 仓库中
- 确保有可撤销的修改

---

## 界面问题

### 乱码显示

**症状**：界面显示方框或乱码

**解决方案**：

```bash
# 设置正确编码
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# 使用推荐终端
# WezTerm / Alacritty / iTerm2

# 使用 Nerd Fonts 字体
```

---

### 颜色不正确

**症状**：颜色显示异常或没有颜色

**解决方案**：

```bash
# 设置 truecolor
export COLORTERM=truecolor

# 设置终端类型
export TERM=xterm-256color

# 切换主题
/theme
```

---

## Linux 特有问题

### 剪贴板不工作

**症状**：复制粘贴失败

**解决方案**：

```bash
# X11
sudo apt install xclip
# 或
sudo apt install xsel

# Wayland
sudo apt install wl-clipboard

# 无头环境
sudo apt install xvfb
Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
export DISPLAY=:99.0
```

---

### 权限拒绝

**症状**：
```
EACCES: permission denied
```

**解决方案**：

```bash
# 修复 npm 权限
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 重新安装
npm install -g opencode-ai
```

---

## 诊断命令汇总

```bash
# 版本信息
opencode --version

# 系统信息
uname -a

# 调试日志
opencode --log-level DEBUG --print-logs

# 查看已认证的提供商
opencode auth list

# 查看可用模型
opencode models
```

---

## 获取帮助

如果以上方法都无法解决问题：

1. **收集信息**：
   ```bash
   opencode --version > debug.txt
   uname -a >> debug.txt
   cat ~/.config/opencode/opencode.json >> debug.txt 2>/dev/null
   ls -la ~/.local/share/opencode/log/ >> debug.txt
   ```

2. **提交 Issue**：[github.com/anomalyco/opencode/issues](https://github.com/anomalyco/opencode/issues)

---

## 相关资源

- [网络配置](../1-start/03-network) - 网络设置详解
- [配置选项](./config-ref) - 配置参考

::: tip 还是搞不定？
[加入社群](/community)，和 500+ 同路人一起交流，实时答疑。
:::
