---
title: 连接通义千问（阿里云）
subtitle: 阿里系、全能通用
course: OpenCode 中文实战课
stage: 第一阶段
lesson: "1.4i"
duration: 10 分钟
practice: 5 分钟
level: 新手
description: 获取阿里云百炼 API Key，并在 OpenCode 中使用通义千问模型。
tags:
  - 模型
  - 通义千问
  - 阿里云
  - DashScope
  - API Key
prerequisite:
  - 1.2 安装
---

# 连接通义千问（阿里云）

> 预计时间：5-10 分钟

通义千问是阿里云推出的大模型，通过百炼平台（DashScope）提供 API 服务。特点是能力全面、生态完善、模型种类丰富。

如果你还没看过"API Key 是什么"，建议先回到 [1.4 总览](./04-connect) 把概念弄清楚。

---

## 学完你能做什么

- 获取阿里云百炼 API Key
- 在 OpenCode 里连接通义千问
- 根据场景选择合适的模型
- 发送第一句话并收到回复

---

## 🎒 开始前的准备

- [ ] 完成了 [1.2 安装](./02-install)，能运行 `opencode`
- [ ] 已有阿里云账号（或能注册）

---

## 跟我做

### 第 1 步：注册阿里云账号

访问：https://bailian.console.aliyun.com

如果没有阿里云账号，按页面提示注册并完成实名认证。

---

### 第 2 步：开通百炼服务

1. 进入百炼控制台
2. 按提示开通 DashScope 服务
3. 同意服务协议

---

### 第 3 步：获取 API Key

1. 进入 API-KEY 管理页面
   - 或直接访问：https://bailian.console.aliyun.com/#/api-key
2. 创建一个新的 API Key
3. **立刻复制保存**

::: warning 只显示一次！
API Key 只会显示一次。关掉窗口后就看不到完整 Key 了。

请立刻复制到安全的地方，不要发群、不要截图、不要提交到 GitHub。
:::

---

### 第 4 步：在 OpenCode 中连接通义千问

启动 OpenCode：

```bash
opencode
```

输入：

```
/connect
```

在提供商列表里搜索并选择：

- **中国大陆用户**：选择 `Alibaba (China)` 或搜索 `alibaba-china`
- **海外/国际用户**：选择 `Alibaba` 或搜索 `alibaba`

然后粘贴你的 API Key。

成功后会看到类似：

```
✓ Provider added successfully!
```

::: tip 国际版 vs 中国版
两个版本使用不同的 API 端点：
- 中国版（`alibaba-china`）：`dashscope.aliyuncs.com`
- 国际版（`alibaba`）：`dashscope-intl.aliyuncs.com`

如果你在中国大陆，选错版本可能导致连接超时或失败。
:::

---

### 第 5 步：选择模型并验证

输入：

```
/models
```

根据你的使用场景选择合适的模型：

| 场景 | 推荐模型 | 说明 |
|------|---------|------|
| 编程开发 | `qwen3-coder-flash` | 1M context，65K output，代码专用 |
| 通用对话 | `qwen-plus`、`qwen-turbo` | 性价比高，支持推理 |
| 深度推理 | `qwq-plus` | 支持 reasoning，适合复杂问题 |
| 视觉理解 | `qwen-vl-max` | 支持图片输入 |

选择模型后，发送一句话验证：

```
你好，请介绍一下你自己
```

能收到回复就说明连接成功。

---

## 使用环境变量（可选）

除了通过 `/connect` 命令配置，你也可以使用环境变量：

```bash
# 方式一：启动时设置
DASHSCOPE_API_KEY=sk-xxx opencode

# 方式二：写入 shell 配置文件
echo 'export DASHSCOPE_API_KEY=sk-xxx' >> ~/.zshrc
source ~/.zshrc
```

---

## 通过配置文件自定义（进阶）

如果你需要自定义 baseURL 或添加额外模型，可以在 `opencode.json` 中配置：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "alibaba-china": {
      "options": {
        "baseURL": "https://dashscope.aliyuncs.com/compatible-mode/v1"
      }
    }
  }
}
```

---

## 检查点 ✅

- [ ] `/models` 里能看到通义千问模型
- [ ] 发送消息能收到 AI 回复
- [ ] 没有报错（如 `API key invalid` / `connection error`）

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|------|------|
| `API key invalid` | Key 复制错误或未开通服务 | 确认已开通百炼服务，重新获取 Key |
| 找不到 Alibaba 选项 | OpenCode 版本太旧 | 升级 OpenCode：`opencode upgrade` |
| 报余额不足 | 免费额度用完 | 去控制台充值 |
| 提示需要实名认证 | 阿里云要求实名 | 完成实名认证后重试 |
| 连接超时 | 选错了国际版/中国版 | 中国大陆用户请选 `alibaba-china` |
| 某些模型不支持 tool_call | 并非所有模型都支持工具调用 | 换用 `qwen-plus` 或 `qwen3-coder-flash` |

---

## 下一步

- 回到 [1.4 总览](./04-connect) 选择下一条路线，或进入 [2.1 界面与基础操作](../2-daily/01-interface)
