---
title: 装不上怎么办？
subtitle: 安装问题排查指南
course: OpenCode 中文实战课
stage: 第一阶段
lesson: "1.2b"
duration: 10 分钟
level: 新手
description: OpenCode 安装常见问题解决：command not found、网络超时、权限不足、PATH 配置等。
tags:
  - 安装
  - 排错
  - 故障排除
prerequisite:
  - 1.2 安装
---

# 装不上怎么办？

> 安装过程遇到问题？这里有系统的排查方法。

---

## 问题 1：`command not found` / `opencode 不是内部或外部命令`

**症状：**

```bash
zsh: command not found: opencode
# 或 Windows 上
'opencode' is not recognized as an internal or external command
```

**排查步骤：**

### 1. 确认重启了终端

真的关掉窗口重新打开了吗？不是新建标签页，是关掉整个窗口。

### 2. 检查 OpenCode 装在哪了

**macOS/Linux（官方脚本安装）：**

```bash
ls -la ~/.opencode/bin/opencode
```

如果显示文件存在，说明安装成功了，只是 PATH 没配好。

**查看 PATH 是否包含安装目录：**

```bash
echo $PATH | tr ':' '\n' | grep opencode
```

如果没有输出，说明 PATH 没配好。

### 3. 手动添加到 PATH

**macOS/Linux (zsh)：**

```bash
echo 'export PATH="$HOME/.opencode/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**macOS/Linux (bash)：**

```bash
echo 'export PATH="$HOME/.opencode/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**Windows（Scoop 安装）：**

Scoop 会自动配置 PATH，如果没生效，重启 PowerShell。

---

## 问题 2：网络错误 / 下载超时

**症状：**

```
curl: (7) Failed to connect to opencode.ai port 443
# 或
Error: connect ETIMEDOUT
```

**排查步骤：**

### 1. 确认网络正常

```bash
curl -I https://www.baidu.com
```

如果百度也连不上，那是网络问题，不是 OpenCode 的问题。

### 2. 检查是否需要代理

如果你在公司/学校网络，可能需要配置代理。请看 [1.3 网络配置](./03-network)。

### 3. 换其他安装方式

官方脚本从 GitHub 下载，如果 GitHub 访问不畅，可以试试：

- **npm 安装**（npm 有国内镜像）：
  ```bash
  npm install -g opencode-ai
  ```

- **Homebrew 安装**（brew 有国内镜像）：
  ```bash
  brew install anomalyco/tap/opencode
  ```

更多安装方式见 [1.2a 备用安装方式](./02a-install-alternatives)。

---

## 问题 3：GitHub API 限流

**症状：**

```
error: rate limit exceeded
```

**原因：**

GitHub API 对匿名请求有频率限制（60 次/小时）。

**解决方案：**

1. 等一小时后重试
2. 或者用其他安装方式（npm、Homebrew 等）

---

## 问题 4：安装脚本提示缺少工具

**症状：**

```
Error: 'tar' is required but not installed.
# 或
Error: 'unzip' is required but not installed.
```

**解决方案：**

安装缺少的工具：

```bash
# macOS（一般自带）
# 如果没有，安装 Xcode 命令行工具：
xcode-select --install

# Ubuntu/Debian
sudo apt install -y tar unzip

# CentOS/RHEL
sudo yum install -y tar unzip
```

---

## 问题 5：Windows 执行策略限制

**症状（安装 Scoop 时）：**

```
Running scripts is disabled on this system
```

**解决方案：**

运行以下命令（只需一次）：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

如果公司策略不允许修改执行策略，可以用 Chocolatey（需要管理员权限）或直接下载二进制文件。

---

## 问题 6：想定位二进制文件在哪

```bash
# macOS/Linux
which opencode

# Windows PowerShell
Get-Command opencode | Select-Object Source
```

---

## 问题 7：想干净卸载重装

OpenCode 提供了卸载命令：

```bash
opencode uninstall
```

会提示你要删除哪些内容（配置、数据、缓存等）。

如果 `opencode` 命令都跑不了，可以手动删除：

**macOS/Linux（官方脚本安装）：**

```bash
# 删除二进制
rm -rf ~/.opencode/bin

# 删除配置
rm -rf ~/.config/opencode

# 删除数据和缓存
rm -rf ~/.local/share/opencode
rm -rf ~/.cache/opencode
```

**Homebrew 安装：**

```bash
brew uninstall opencode
```

**npm 安装：**

```bash
npm uninstall -g opencode-ai
```

**Scoop 安装：**

```powershell
scoop uninstall opencode
```

**Chocolatey 安装：**

```powershell
choco uninstall opencode
```

---

## 还是搞不定？

1. 查看 [官方故障排除文档](https://opencode.ai/docs/troubleshooting/)
2. 在 [GitHub Issues](https://github.com/anomalyco/opencode/issues) 搜索或提问

---

## 下一步

问题解决后，回到 [1.2 安装](./02-install) 验证安装是否成功。

::: tip 还是搞不定？
[加入社群](/community)，和 500+ 同路人一起交流，实时答疑。
:::
