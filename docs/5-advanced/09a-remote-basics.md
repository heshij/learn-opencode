---
title: 5.9a 远程模式基础
subtitle: 服务器启动、Web 界面与远程连接
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.9a"
duration: 20 分钟
level: 进阶
description: OpenCode 支持无头服务器模式，可通过 Web 界面或远程终端访问。
tags:
  - 服务器
  - 远程
  - Web
prerequisite:
  - 5.1 配置全解
---

# 5.9a 远程模式基础

> 💡 **一句话总结**：OpenCode 支持无头服务器模式，可通过 Web 界面或远程终端访问。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/remote-basics-notes.mini.jpeg" alt="远程模式基础学霸笔记" data-zoom-src="/images/5-advanced/remote-basics-notes.jpeg" />

---

## 学完你能做什么

- 在服务器上运行 OpenCode 后台服务
- 通过浏览器访问 OpenCode Web 界面
- 从任意设备远程连接到 OpenCode
- 配置代理和自定义证书

---

## 你现在的困境

- 只能在本地终端用，想在服务器上运行
- 想通过浏览器或手机访问 OpenCode
- 想从其他设备远程连接
- 公司网络有代理，连不上 API

---

## 架构原理

当你运行 `opencode` 时，实际上启动了两个组件：

1. **服务器**：HTTP 服务，提供 OpenAPI 3.1 规范的 REST API
2. **TUI**：终端用户界面，作为客户端与服务器通信

这种架构的好处：
- 支持多客户端（TUI、Web、IDE 插件）同时连接
- 可以编程方式与 OpenCode 交互
- 支持远程访问

```
┌──────────────────────────────────────────────────────┐
│                  OpenCode 服务器                      │
│  ┌────────────────────────────────────────────────┐  │
│  │              HTTP API (OpenAPI 3.1)            │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
         ▲              ▲              ▲
         │              │              │
    ┌────┴────┐    ┌────┴────┐    ┌────┴────┐
    │   TUI   │    │   Web   │    │   IDE   │
    └─────────┘    └─────────┘    └─────────┘
```

---

## 三种运行模式

| 命令 | 用途 | 界面 |
|------|------|------|
| `opencode` | 日常使用 | TUI（自动启动本地服务器） |
| `opencode serve` | 无头服务 | 无（纯 API 服务） |
| `opencode web` | Web 访问 | 浏览器界面 |

---

## 启动无头服务器

### 基本命令

```bash
opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]
```

### 命令行选项

| 参数 | 描述 | 默认值 |
|------|------|--------|
| `--port` | 监听端口 | `4096` |
| `--hostname` | 监听主机名 | `127.0.0.1` |
| `--mdns` | 启用 mDNS 服务发现 | `false` |
| `--cors` | 允许的额外 CORS 来源 | `[]` |

> 来源：`opencode/packages/opencode/src/cli/network.ts:4-26`

### 示例

```bash
# 默认配置启动（端口 4096 或随机）
opencode serve

# 指定端口和地址，允许局域网访问
opencode serve --port 4096 --hostname 0.0.0.0

# 允许多个 CORS 来源
opencode serve --cors http://localhost:5173 --cors https://app.example.com

# 启用 mDNS 发现（自动将 hostname 设为 0.0.0.0）
opencode serve --mdns
```

启动后会输出：

```
opencode server listening on http://0.0.0.0:4096
```

---

## 配置文件方式

除了命令行参数，也可以通过配置文件设置服务器参数：

```jsonc
// opencode.json
{
  "server": {
    "port": 4096,           // 监听端口
    "hostname": "0.0.0.0",  // 监听地址
    "mdns": true,           // 启用 mDNS
    "cors": [               // CORS 白名单
      "http://localhost:5173",
      "https://my-app.example.com"
    ]
  }
}
```

> 来源：`opencode/packages/opencode/src/config/config.ts:701-711`

**优先级规则**：命令行参数 > 配置文件 > 默认值

---

## 启动 Web 界面

```bash
opencode web
```

这会启动 HTTP 服务器并自动打开浏览器访问 Web 界面。

### 选项

与 `serve` 命令相同：

| 参数 | 描述 |
|------|------|
| `--port` | 监听端口 |
| `--hostname` | 监听主机名 |
| `--mdns` | 启用 mDNS 发现 |
| `--cors` | 允许的额外 CORS 来源 |

### 局域网访问

当 hostname 设为 `0.0.0.0` 时，会显示所有可用的访问地址：

```bash
opencode web --hostname 0.0.0.0 --port 4096
```

输出：

```
  Local access:      http://localhost:4096
  Network access:    http://192.168.1.100:4096
```

> 来源：`opencode/packages/opencode/src/cli/cmd/web.ts:41-68`

---

## 远程连接

### 使用 attach 命令

可以将 TUI 连接到已运行的 OpenCode 服务器：

```bash
# 终端 1：启动后端服务器
opencode web --port 4096 --hostname 0.0.0.0

# 终端 2：从另一台机器连接
opencode attach http://192.168.1.100:4096
```

### attach 选项

| 参数 | 短写 | 描述 |
|------|------|------|
| `--dir` | | 启动 TUI 的工作目录 |
| `--session` | `-s` | 要继续的会话 ID |

> 来源：`opencode/packages/opencode/src/cli/cmd/tui/attach.ts:4-31`

### 使用 run --attach

`run` 命令也支持连接到运行中的服务器，适合自动化场景：

```bash
# 终端 1：启动无头服务器
opencode serve

# 终端 2：通过 attach 运行命令（避免 MCP 冷启动）
opencode run --attach http://localhost:4096 "解释 JavaScript 中的闭包"
```

这种方式的好处是每次运行不需要重新启动 MCP 服务器，大幅减少响应时间。

> 来源：`opencode/packages/web/src/content/docs/cli.mdx:325-333`

---

## mDNS 服务发现

启用 mDNS 后，同一局域网的设备可以通过 `.local` 域名访问服务器：

```bash
opencode web --mdns
```

输出：

```
  Local access:      http://localhost:4096
  Network access:    http://192.168.1.100:4096
  mDNS:              opencode.local
```

**注意事项**：
- mDNS 仅在 hostname 非回环地址时生效
- 实际发布的 mDNS 名称格式为 `opencode-{port}`
- 需要网络支持 mDNS（大多数家庭/办公网络支持）

> 来源：`opencode/packages/opencode/src/server/server.ts:2853-2862`

---

## 网络代理配置

OpenCode 支持标准代理环境变量：

```bash
# HTTPS 代理（推荐）
export HTTPS_PROXY=https://proxy.example.com:8080

# HTTP 代理
export HTTP_PROXY=http://proxy.example.com:8080

# 绕过代理的地址（必须包含本地地址）
export NO_PROXY=localhost,127.0.0.1
```

> ⚠️ **重要**：TUI 与本地服务器通信时必须绕过代理，否则会导致连接失败。

### 代理认证

如果代理需要认证，在 URL 中包含凭据：

```bash
export HTTPS_PROXY=http://username:password@proxy.example.com:8080
```

> ⚠️ 避免在脚本中硬编码密码，使用环境变量或安全的凭据存储。

> 来源：`opencode/packages/web/src/content/docs/network.mdx:10-45`

---

## 自定义证书

企业环境中如果使用自签名 CA 证书，需要配置 Node.js 信任：

```bash
export NODE_EXTRA_CA_CERTS=/path/to/ca-cert.pem
```

这同时适用于代理连接和直接 API 访问。

> 来源：`opencode/packages/web/src/content/docs/network.mdx:49-57`

---

## API 文档入口

服务器发布 OpenAPI 3.1 规范，可在浏览器中查看：

```
http://<hostname>:<port>/doc
```

例如：`http://localhost:4096/doc`

可以用于：
- 查看所有可用 API
- 生成客户端代码
- 在 Swagger 工具中探索

完整 API 参考见 [5.9b API 参考](./09b-remote-api)。

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 远程连不上 | 防火墙拦截 | 开放对应端口（如 4096） |
| CORS 错误 | 未配置来源 | 添加 `--cors <your-origin>` 或配置文件 |
| 端口冲突 | 默认端口被占用 | 使用 `--port` 指定其他端口 |
| 本地连接失败 | 代理拦截本地请求 | 设置 `NO_PROXY=localhost,127.0.0.1` |
| mDNS 不生效 | hostname 是回环地址 | 使用 `--hostname 0.0.0.0` |
| HTTPS 证书错误 | 企业自签名证书 | 设置 `NODE_EXTRA_CA_CERTS` |

---

## 本课小结

你学会了：

1. **serve 命令**：启动无头 HTTP 服务
2. **web 命令**：启动带 Web 界面的服务
3. **attach 命令**：远程连接到已运行的服务器
4. **run --attach**：在自动化脚本中复用服务器
5. **配置文件**：通过 `server` 块配置服务器参数
6. **网络配置**：代理和自定义证书设置

---

## 相关资源

- [5.9b API 参考](./09b-remote-api) - 完整 HTTP API 文档
- [5.10 SDK](./10a-sdk-basics) - JavaScript/TypeScript SDK
- [CLI 命令](../appendix/cli) - 完整命令参考

---

## 下一课预告

> 下一课我们将学习完整的 HTTP API 接口，了解如何编程方式与 OpenCode 交互。
