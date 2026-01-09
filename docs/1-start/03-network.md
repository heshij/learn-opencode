---
title: 网络配置：代理与环境变量
subtitle: 让 OpenCode 顺畅连接
course: OpenCode 中文实战课
stage: 第一阶段
lesson: "1.3"
duration: 10 分钟
practice: 10 分钟
level: 新手
description: 配置 OpenCode 网络连接，支持代理设置，解决国内网络访问问题，快速连接 AI 模型。
tags:
  - 网络
  - 代理
  - 环境变量
prerequisite:
  - 1.2 安装
---

# 网络配置：代理与环境变量

::: tip 合规提示
请遵守所在地区法律法规及所属组织的网络使用政策。本课程仅介绍代理环境变量的配置方法。
:::

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/1-start/network-notes.mini.jpeg" 
     alt="网络配置：代理与环境变量学霸笔记" 
     data-zoom-src="/images/1-start/network-notes.jpeg" />

---

## 这一课讲什么

有些网络环境下，访问外部服务需要通过代理。这一课教你怎么配置环境变量，让 OpenCode 能正常连接 AI 服务。

---

## 先判断：你需要看这一课吗？

**如果你打算用 DeepSeek、智谱、通义千问等国产模型**：可以跳过这一课，直接去 [1.4 连接模型](./04-connect)。国产模型在国内可以直接访问。

**如果你需要使用 Claude、GPT 等国际模型**：请继续阅读。

---

## 学完你能做什么

- 配置 HTTP 代理环境变量
- 验证网络配置是否生效
- 遇到网络问题时，知道怎么排查

---

## 你现在的困境

- 安装成功了，但连接模型时报 `connection timeout`
- 公司/学校网络需要配置代理，但不知道怎么让 OpenCode 使用
- 配了代理还是连不上，不知道哪里出问题

---

## 什么时候用这一招

- 当你需要：通过代理访问外部服务
- 而且不想：每次都看到连接超时错误

---

## 🎒 开始前的准备

> 确保你有以下条件：

- [ ] 完成了 [1.2 安装](./02-install)
- [ ] 你的网络环境支持访问目标服务（或已有代理服务）
- [ ] 知道代理的地址和端口（不知道的话，请咨询你的网络管理员或 IT 部门）

---

## 核心概念

### 什么是代理

代理服务器是一个"中转站"。你的请求先发给代理，代理再转发给目标服务器，响应原路返回。

很多场景需要代理：
- 企业内网需要通过网关访问外部
- 学校网络有访问限制
- 需要使用特定线路访问某些服务

### OpenCode 怎么使用代理

OpenCode 通过**环境变量**读取代理配置。你需要设置：

- `HTTP_PROXY`：HTTP 请求的代理地址
- `HTTPS_PROXY`：HTTPS 请求的代理地址

格式：`http://代理地址:端口号`

设置好后，OpenCode 和大部分命令行工具都会自动走代理。

---

## 跟我做

### 第 0 步：确认你的代理信息

你需要知道两个信息：
1. **代理地址**：通常是 `127.0.0.1`（本地代理）或公司提供的地址
2. **端口号**：一个数字，如 `7890`、`8080` 等

::: tip 💡 不知道端口号？
打开你的代理软件，在"设置"或"偏好设置"里找"HTTP 端口"或"本地监听端口"。

如果是公司/学校提供的代理，请咨询 IT 部门。
:::

---

### 第 1 步：测试代理是否可用

先确认代理本身能工作。

在终端输入（把地址和端口换成你自己的）：

```bash
curl -x http://127.0.0.1:7890 -I https://httpbin.org/ip
```

**成功的情况：**

```
HTTP/1.1 200 Connection established

HTTP/2 200
content-type: application/json
...
```

看到 `HTTP/2 200` 说明代理工作正常。

**失败情况 1：连接被拒绝**

```
curl: (7) Failed to connect to 127.0.0.1 port 7890: Connection refused
```

原因：代理服务没有运行，或端口号不对。请确认代理软件已启动，端口号正确。

**失败情况 2：超时**

```
curl: (28) Operation timed out
```

原因：代理服务有问题，或目标地址不可达。请检查代理配置。

---

### 第 2 步：设置环境变量（临时）

先临时设置，确认能用后再写入配置文件。

::: code-group

```bash [macOS / Linux]
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
```

```powershell [Windows (PowerShell)]
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
```

:::

::: warning ⚠️ 注意
把 `127.0.0.1:7890` 换成你实际的代理地址和端口。
:::

**验证设置成功：**

```bash
echo $HTTP_PROXY
```

应该输出你设置的值。Windows 上用 `$env:HTTP_PROXY`。

---

### 第 3 步：验证环境变量生效

现在测试不带 `-x` 参数，看环境变量是否自动生效：

```bash
curl -I https://httpbin.org/ip
```

如果返回 `HTTP/2 200`，说明环境变量配置成功，curl 自动走了代理。

---

### 第 4 步：写入配置文件（永久生效）

临时设置只对当前终端窗口有效。写入配置文件后，每次打开终端都自动生效。

::: code-group

```bash [macOS / Linux (zsh)]
# 编辑配置文件
nano ~/.zshrc

# 在文件末尾添加：
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890

# 保存退出（Ctrl+X → Y → Enter）
# 重新加载配置
source ~/.zshrc
```

```bash [macOS / Linux (bash)]
nano ~/.bashrc

# 在文件末尾添加：
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890

# 保存退出，重新加载
source ~/.bashrc
```

```powershell [Windows (永久设置)]
# 设置用户级环境变量
[Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://127.0.0.1:7890", "User")
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://127.0.0.1:7890", "User")

# 重启 PowerShell 生效
```

:::

::: tip 💡 怎么知道用的是 zsh 还是 bash？
```bash
echo $SHELL
```
输出包含 `zsh` 就是 zsh，包含 `bash` 就是 bash。macOS 新版本默认是 zsh。
:::

---

## 检查点 ✅

> 全部通过才能继续

- [ ] 代理服务正在运行
- [ ] `curl -I https://httpbin.org/ip` 返回 200 状态码
- [ ] `echo $HTTP_PROXY` 有输出

---

## 踩坑提醒

### 问题 1：`Connection refused`

**完整错误：**
```
curl: (7) Failed to connect to 127.0.0.1 port 7890: Connection refused
```

**排查步骤：**

1. 代理软件启动了吗？检查任务栏/菜单栏图标
2. 端口号对吗？打开代理软件设置确认
3. 有些软件需要手动开启"允许局域网连接"或"HTTP 代理"选项

---

### 问题 2：`Operation timed out`

**完整错误：**
```
curl: (28) Operation timed out after 30001 milliseconds
```

**排查步骤：**

1. 代理软件连接正常吗？检查代理软件状态
2. 目标服务可达吗？换个地址测试（如 https://httpbin.org）
3. 如果使用的是远程代理，检查网络连接

---

### 问题 3：环境变量不生效

**现象**：设置了变量，但 curl 还是超时

**排查步骤：**

1. 确认变量设置成功：`echo $HTTP_PROXY`
2. 有些工具同时需要大小写变量：
   ```bash
   export http_proxy=http://127.0.0.1:7890
   export https_proxy=http://127.0.0.1:7890
   export HTTP_PROXY=http://127.0.0.1:7890
   export HTTPS_PROXY=http://127.0.0.1:7890
   ```
3. 写入配置文件后，需要 `source` 或新开终端才生效

---

### 问题 4：只有部分请求走代理

**现象**：有些网站能访问，有些不行

**可能原因：**
- 代理服务的路由规则问题
- 某些地址被排除在代理之外

**解决**：检查代理软件的规则设置，或咨询网络管理员。

---

## 不需要代理的情况

如果你只打算使用国产模型（DeepSeek、智谱、通义千问等），不需要配置代理，可以直接跳到下一课。

国产模型的 API 服务在国内有服务器，可以直接访问。

---

## 本课小结

你学会了：

1. 理解代理的作用
2. 通过环境变量配置代理
3. 验证代理是否生效
4. 常见问题的排查方法

---

## 下一课预告

> 下一课是第一阶段的高潮：连接 AI 模型，发送你的第一句话。
>
> 我会告诉你：
> - 什么是 API Key，怎么获取
> - 多种模型路线怎么选（免费、国产、国际、本地）
> - 发送第一句话，看到 AI 回复

::: tip 遇到问题？
网络配置卡住了？[加入社群](/community)，和 500+ 同路人一起交流，实时答疑。
:::
