import { defineConfig } from 'vitepress'

// 页面路径判断：是否为英文版
const isEnglishPage = (relativePath: string) => relativePath.startsWith('en/')

// 不需要 hreflang 的页面（内容不对等）
const noHreflangPages = [
  'en/4-scenarios/writer-wechat.md',      // stub: WeChat
  'en/4-scenarios/writer-xiaohongshu.md', // stub: Xiaohongshu
  'en/4-scenarios/writer-webnovel.md',    // stub: Web Novel
  'en/4-scenarios/writer-blog.md',        // new: English only
  'en/4-scenarios/writer-social.md',      // new: English only
  'en/community.md',                       // rewritten: different content
  '4-scenarios/writer-wechat.md',
  '4-scenarios/writer-xiaohongshu.md',
  '4-scenarios/writer-webnovel.md',
  'community.md',
]

export default defineConfig({
  title: 'OpenCode 中文教程',
  titleTemplate: ':title - AI 编程助手实战指南',
  description: 'OpenCode 是终端 AI 编程助手，本教程从零基础到进阶，教你用 AI 写代码、改 Bug、自动化办公。支持智谱、DeepSeek 等国产模型，完全免费开源。',
  lang: 'zh-CN',
  
  // 构建配置：启用死链接检查（开发时检查 404）
  ignoreDeadLinks: false,

  // 站点地图（多语言支持）
  sitemap: {
    hostname: 'https://learnopencode.com',
    transformItems(items) {
      return items.map(item => ({
        ...item,
        links: [
          { lang: 'zh-CN', url: item.url.replace(/^\/en\//, '/') },
          { lang: 'en', url: item.url.startsWith('/en/') ? item.url : `/en${item.url}` }
        ]
      }))
    }
  },

  head: [
    // 基础
    ['link', { rel: 'icon', href: '/favicon.png', type: 'image/png' }],
    ['meta', { name: 'theme-color', content: '#10b981' }],
    ['meta', { name: 'author', content: 'OpenCode 中文社区' }],
    ['meta', { name: 'keywords', content: 'OpenCode,AI编程,AI编程助手,OpenCode教程,AI写代码,智谱,DeepSeek,Claude' }],

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:site_name', content: 'OpenCode 中文教程' }],
    ['meta', { property: 'og:title', content: 'OpenCode 中文教程 - AI 编程助手实战指南' }],
    ['meta', { property: 'og:description', content: 'OpenCode 是终端 AI 编程助手，本教程从零基础到进阶，教你用 AI 写代码、改 Bug、自动化办公。支持智谱、DeepSeek 等国产模型，完全免费开源。' }],
    ['meta', { property: 'og:image', content: 'https://learnopencode.com/og-image.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'OpenCode 中文教程 - AI 编程助手实战指南' }],
    ['meta', { name: 'twitter:description', content: 'OpenCode 是终端 AI 编程助手，本教程从零基础到进阶，教你用 AI 写代码、改 Bug、自动化办公。' }],
    ['meta', { name: 'twitter:image', content: 'https://learnopencode.com/og-image.png' }],

    // 结构化数据 JSON-LD（中文版）
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "OpenCode 中文教程",
      "alternateName": "OpenCode 中文实战课",
      "url": "https://learnopencode.com",
      "description": "OpenCode 是终端 AI 编程助手，本教程从零基础到进阶，教你用 AI 写代码、改 Bug、自动化办公。",
      "inLanguage": "zh-CN",
      "publisher": {
        "@type": "Organization",
        "name": "OpenCode 中文社区",
        "logo": {
          "@type": "ImageObject",
          "url": "https://learnopencode.com/logo.svg"
        }
      }
    })],

    // Google AdSense
    ['script', {
      async: 'true',
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1238777311285568',
      crossorigin: 'anonymous'
    }],

    // Google Analytics
    ['script', { async: 'true', src: 'https://www.googletagmanager.com/gtag/js?id=G-1R6TQGK2HZ' }],
    ['script', {}, `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-1R6TQGK2HZ');
    `],

    // Baidu Analytics（仅中文版加载，通过 transformHead 控制）
  ],

  transformHead({ pageData }) {
    const head: any[] = []
    const relativePath = pageData.relativePath
    
    // Canonical URL
    const canonicalUrl = `https://learnopencode.com/${relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '.html')
    
    head.push(['link', { rel: 'canonical', href: canonicalUrl }])
    head.push(['meta', { property: 'og:url', content: canonicalUrl }])

    // 英文版特殊处理
    if (isEnglishPage(relativePath)) {
      // 英文版 OG locale
      head.push(['meta', { property: 'og:locale', content: 'en_US' }])
      
      // 英文版 JSON-LD
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "OpenCode Tutorial",
        "alternateName": "OpenCode Practical Guide",
        "url": "https://learnopencode.com/en/",
        "description": "OpenCode is a terminal-based AI coding assistant. This tutorial covers everything from basics to advanced usage.",
        "inLanguage": "en-US",
        "publisher": {
          "@type": "Organization",
          "name": "OpenCode Community",
          "logo": {
            "@type": "ImageObject",
            "url": "https://learnopencode.com/logo.svg"
          }
        }
      })])

      // 英文版不加载百度统计（通过客户端脚本控制）
      head.push(['script', {}, `
        (function() {
          // Disable Baidu Analytics for English pages
          window._hmt = window._hmt || [];
          window._hmt.push(['_setAutoPageview', false]);
        })();
      `])
    }

    // hreflang 标签（不对等的页面不加）
    if (!noHreflangPages.includes(relativePath)) {
      const basePath = relativePath.replace(/^en\//, '').replace(/\.md$/, '')
      const zhUrl = `https://learnopencode.com/${basePath}`
      const enUrl = `https://learnopencode.com/en/${basePath}`
      
      head.push(['link', { rel: 'alternate', hreflang: 'zh-CN', href: zhUrl }])
      head.push(['link', { rel: 'alternate', hreflang: 'en', href: enUrl }])
      head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: zhUrl }])
    }

    return head
  },

  markdown: {
    config(md) {
      const originalFence = md.renderer.rules.fence
      md.renderer.rules.fence = (...args) => {
        const html = originalFence ? originalFence(...args) : ''
        return html
          .replace(/<div class="language-/g, '<div v-pre class="language-')
          .replace(/<code(?![^>]*v-pre)/g, '<code v-pre')
      }

      const originalInline = md.renderer.rules.code_inline
      md.renderer.rules.code_inline = (...args) => {
        const html = originalInline ? originalInline(...args) : ''
        return html.replace(/<code(?![^>]*v-pre)/g, '<code v-pre')
      }
    },
  },

  themeConfig: {
    logo: {
      light: '/logo-light.png',  // 浅色主题 → 浅色背景 logo
      dark: '/logo-dark.png',    // 深色主题 → 深色背景 logo
    },

    nav: [
      { text: '开始学习', link: '/1-start/' },
      { text: '场景实战', link: '/4-scenarios/' },
      { text: '进阶手册', link: '/5-advanced/' },
      { text: '速查手册', link: '/appendix/' },
      { text: '加入社群', link: '/community' },
    ],

    sidebar: [
      {
        text: '🚀 快速起步',
        collapsed: false,
        items: [
          { text: '阶段导读', link: '/1-start/' },
          { text: '1.1 这是什么', link: '/1-start/01-intro' },
          {
            text: '1.2 安装',
            collapsed: true,
            items: [
              { text: '安装：5 分钟搞定', link: '/1-start/02-install' },
              { text: '备用安装方式', link: '/1-start/02a-install-alternatives' },
              { text: '装不上怎么办？', link: '/1-start/02b-install-troubleshoot' },
            ]
          },
          { text: '1.3 网络配置', link: '/1-start/03-network' },
          {
            text: '1.4 连接模型',
            collapsed: true,
            items: [
              { text: '总览：第一次对话', link: '/1-start/04-connect' },
              { text: '[推荐] MiniMax（M2.7）', link: '/1-start/04d-minimax' },
              { text: '免费模型（OpenCode Zen）', link: '/1-start/04a-free-models' },
              { text: '智谱 GLM-5', link: '/1-start/04c-zhipu' },
              { text: 'DeepSeek', link: '/1-start/04b-deepseek' },
              { text: 'Claude（Anthropic）', link: '/1-start/04e-claude' },
              { text: 'Claude Code 中转', link: '/1-start/04f-claudecode-relay' },
              { text: 'Ollama（本地）', link: '/1-start/04g-ollama' },
              { text: 'OpenAI（GPT / Codex）', link: '/1-start/04h-openai' },
              { text: '通义千问', link: '/1-start/04i-alibaba' },
              { text: 'GitHub Copilot', link: '/1-start/04j-github-copilot' },
            ]
          },
          { text: '1.5 自动更新', link: '/1-start/05-update' },
        ]
      },
      {
        text: '💪 日常使用',
        collapsed: false,
        items: [
          { text: '阶段导读', link: '/2-daily/' },
          { text: '2.1 界面与操作', link: '/2-daily/01-interface' },
          { text: '2.1b 如何复制内容', link: '/2-daily/01b-copy-paste' },
          { text: '2.1c AI 的基础工具', link: '/2-daily/01c-basic-tools' },
          { text: '2.1d 使用图片与 AI 对话', link: '/2-daily/01d-images' },
          { text: '2.2 管理对话', link: '/2-daily/02-sessions' },
          { text: '2.3 常用快捷键', link: '/2-daily/03-shortcuts' },
          { text: '2.4 全局提示词', link: '/2-daily/04-global-rules' },
          { text: '2.5 环境管理', link: '/2-daily/05-env-management' },
          { text: '2.6 Git 入门', link: '/2-daily/06-git-basics' },
        ]
      },
      {
        text: '⚡ 高效工作流',
        collapsed: false,
        items: [
          { text: '阶段导读', link: '/3-workflow/' },
          { text: '3.1 Plan vs Build', link: '/3-workflow/01-plan-build' },
          { text: '3.2 认识 Agent', link: '/3-workflow/02-agents' },
          { text: '3.3 项目初始化', link: '/3-workflow/03-init' },
        ]
      },
      {
        text: '🎯 场景实战',
        collapsed: false,
        items: [
          { text: '选择你的路线', link: '/4-scenarios/' },
          {
            text: '✍️ 内容创作',
            collapsed: false,
            items: [
              { text: 'A1 创作工作流', link: '/4-scenarios/writer-workflow' },
              { text: 'A2 公众号创作', link: '/4-scenarios/writer-wechat' },
              { text: 'A3 小红书运营', link: '/4-scenarios/writer-xiaohongshu' },
              { text: 'A4 营销文案', link: '/4-scenarios/writer-copywriting' },
              { text: 'A5 翻译润色', link: '/4-scenarios/writer-translate' },
              { text: 'A6 小说创作', link: '/4-scenarios/writer-novel' },
              { text: 'A7 剧本写作', link: '/4-scenarios/writer-script' },
              { text: 'A8 网文创作', link: '/4-scenarios/writer-webnovel' },
              { text: 'A9 创作工作站', link: '/4-scenarios/writer-workstation' },
            ]
          },
          {
            text: '💻 我是程序员',
            collapsed: false,
            items: [
              { text: 'B1 开发日常', link: '/4-scenarios/coder-daily' },
              { text: 'B2 重构与测试', link: '/4-scenarios/coder-refactor' },
              { text: 'B3 文档与 Git', link: '/4-scenarios/coder-docs-git' },
              { text: 'B4 CI/CD 集成', link: '/4-scenarios/coder-cicd' },
              { text: 'B5 专属 Agent', link: '/4-scenarios/coder-agents' },
              { text: 'B6 内网/离线部署', link: '/4-scenarios/coder-intranet' },
            ]
          },
          {
            text: '📊 效率提升',
            collapsed: false,
            items: [
              { text: 'C1 文件整理', link: '/4-scenarios/office-files' },
              { text: 'C2 数据处理', link: '/4-scenarios/office-data' },
              { text: 'C3 AI 学编程', link: '/4-scenarios/office-learn' },
              { text: 'C4 自动化脚本', link: '/4-scenarios/office-automation' },
              { text: 'C5 网页画图自动化', link: '/4-scenarios/mcp-web-image-gen' },
            ]
          },
        ]
      },
      {
        text: '🔧 进阶手册',
        collapsed: false,
        items: [
          { text: '阶段导读', link: '/5-advanced/' },
          { 
            text: '5.1 配置全解',
            collapsed: true,
            items: [
              { text: '5.1a 配置基础', link: '/5-advanced/01a-config-basics' },
              { text: '5.1b 配置进阶', link: '/5-advanced/01b-config-advanced' },
            ]
          },
          { 
            text: '5.2 Agent 系统',
            collapsed: true,
            items: [
              { text: '5.2a 快速入门', link: '/5-advanced/02a-agent-quickstart' },
              { text: '5.2b 设计模式', link: '/5-advanced/02b-agent-patterns' },
              { text: '5.2c 权限与安全', link: '/5-advanced/02c-agent-permissions' },
              { text: '5.2d 高级技巧', link: '/5-advanced/02d-agent-advanced' },
            ]
          },
          { 
            text: '5.3 Skill',
            collapsed: true,
            items: [
              { text: '5.3a Skill 基础', link: '/5-advanced/03a-skills-basics' },
              { text: '5.3b Skill 进阶', link: '/5-advanced/03b-skills-advanced' },
              { text: '5.3c 高级模式', link: '/5-advanced/03c-skills-patterns' },
            ]
          },
          { text: '5.4 快捷命令', link: '/5-advanced/04-commands' },
          { text: '5.5 权限管控', link: '/5-advanced/05-permissions' },
          { 
            text: '5.6 主题与快捷键',
            collapsed: true,
            items: [
              { text: '5.6a 主题系统', link: '/5-advanced/06a-themes' },
              { text: '5.6b 快捷键', link: '/5-advanced/06b-keybinds' },
            ]
          },
          { text: '5.7 MCP 扩展', 
            collapsed: true,
            items: [
              { text: '5.7a MCP 基础', link: '/5-advanced/07a-mcp-basics' },
              { text: '5.7b MCP 进阶', link: '/5-advanced/07b-mcp-advanced' },
              { text: '5.7c AI 控制浏览器', link: '/5-advanced/07c-mcp-chrome-devtools' },
            ]
          },
          {
            text: '5.8 IDE 集成',
            collapsed: true,
            items: [
              { text: '5.8a VS Code 扩展', link: '/5-advanced/08a-ide-vscode' },
              { text: '5.8b ACP 协议', link: '/5-advanced/08b-acp' },
            ]
          },
          { 
            text: '5.9 远程模式',
            collapsed: true,
            items: [
              { text: '5.9a 远程基础', link: '/5-advanced/09a-remote-basics' },
              { text: '5.9b API 参考', link: '/5-advanced/09b-remote-api' },
            ]
          },
          { 
            text: '5.10 SDK 开发',
            collapsed: true,
            items: [
              { text: '5.10a SDK 基础', link: '/5-advanced/10a-sdk-basics' },
              { text: '5.10b API 参考', link: '/5-advanced/10b-sdk-reference' },
              { text: '5.10c SDK V2 下一代 API', link: '/5-advanced/10c-sdk-v2' },
            ]
          },
          { text: '5.11 企业版', link: '/5-advanced/11-enterprise' },
          { text: '5.11a 企业认证集成', link: '/5-advanced/11a-enterprise-auth' },
          { 
            text: '5.12 插件开发',
            collapsed: true,
            items: [
              { text: '5.12a 插件基础', link: '/5-advanced/12a-plugins-basics' },
              { text: '5.12b 插件进阶', link: '/5-advanced/12b-plugins-advanced' },
              { text: '5.12c Hook 教程', link: '/5-advanced/12c-hooks' },
            ]
          },
          { text: '5.13 自定义工具', link: '/5-advanced/13-custom-tools' },
          { text: '5.14 GitHub 集成', link: '/5-advanced/14-github' },
          { text: '5.15 GitLab 集成', link: '/5-advanced/15-gitlab' },
          { text: '5.16 会话分享', link: '/5-advanced/16-share' },
          { text: '5.17 内置工具', link: '/5-advanced/17-tools' },
          { text: '5.18 代码格式化器', link: '/5-advanced/18-formatters' },
          { text: '5.19 LSP 代码智能', link: '/5-advanced/19-lsp' },
          { text: '5.20 上下文压缩', link: '/5-advanced/20-compaction' },
          { text: '5.21 思考深度配置', link: '/5-advanced/21-thinking-depth' },
          { text: '5.22 调试与诊断', link: '/5-advanced/22-debugging' },
          { text: '5.23 网络搜索与获取', link: '/5-advanced/23-web-search' },
          { text: '5.24 CLI 自动化', link: '/5-advanced/24-cli-automation' },
          { text: '5.25 Git Worktree', link: '/5-advanced/25-git-worktree' },
        ]
      },
      {
        text: '📚 速查手册',
        collapsed: false,
        items: [
          { text: '速查总览', link: '/appendix/' },
          { text: 'A. 快捷键速查', link: '/appendix/keybinds' },
          { text: 'B. 斜杠命令', link: '/appendix/commands' },
          { text: 'C. CLI 参考', link: '/appendix/cli' },
          { text: 'D. 配置选项', link: '/appendix/config-ref' },
          { text: 'E. 模型提供商', link: '/appendix/providers' },
          { text: 'F. Prompt 模板库', link: '/appendix/prompts' },
          { text: 'G. 常见问题', link: '/appendix/faq' },
          { text: 'H. 故障排除', link: '/appendix/troubleshoot' },
          { text: 'I. 生态系统', link: '/appendix/ecosystem' },
          { text: 'J. 迁移指南', link: '/appendix/migration' },
          { text: 'K. OpenCode Zen', link: '/appendix/zen' },
          { text: 'L. 实验性功能', link: '/appendix/experimental-features' },
        ]
      },
      {
        text: '📝 OpenCode 更新日志',
        collapsed: true,
        items: [
          { text: '更新日志', link: '/changelog/' },
          ...[
            'v1.18.22', 'v1.18.21', 'v1.18.20', 'v1.18.19', 'v1.18.18', 'v1.18.17', 'v1.18.16', 'v1.18.15', 'v1.18.14', 'v1.18.13', 'v1.18.12', 'v1.18.11', 'v1.18.10', 'v1.18.9', 'v1.18.8', 'v1.18.7', 'v1.18.6', 'v1.18.5', 'v1.18.4', 'v1.18.3', 'v1.18.2', 'v1.18.1', 'v1.18.0',
            'v1.17.20', 'v1.17.19', 'v1.17.18', 'v1.17.17', 'v1.17.16', 'v1.17.15', 'v1.17.14', 'v1.17.13', 'v1.17.12', 'v1.17.11', 'v1.17.10', 'v1.17.9', 'v1.17.8', 'v1.17.7', 'v1.17.6', 'v1.17.5', 'v1.17.4', 'v1.17.3', 'v1.17.2', 'v1.17.1', 'v1.17.0',
            'v1.16.2', 'v1.16.0',
            'v1.15.13', 'v1.15.12', 'v1.15.11', 'v1.15.10', 'v1.15.9', 'v1.15.7', 'v1.15.6', 'v1.15.5', 'v1.15.4', 'v1.15.3', 'v1.15.2', 'v1.15.1', 'v1.15.0',
            'v1.14.51', 'v1.14.50', 'v1.14.49', 'v1.14.48', 'v1.14.47', 'v1.14.46', 'v1.14.45', 'v1.14.44', 'v1.14.43', 'v1.14.42', 'v1.14.41', 'v1.14.40', 'v1.14.39', 'v1.14.38', 'v1.14.37', 'v1.14.35', 'v1.14.34', 'v1.14.33', 'v1.14.32', 'v1.14.31', 'v1.14.30', 'v1.14.29', 'v1.14.28', 'v1.14.27', 'v1.14.26', 'v1.14.25', 'v1.14.24', 'v1.14.23', 'v1.14.22', 'v1.14.21', 'v1.14.20', 'v1.14.19', 'v1.14.18', 'v1.14.17',
            'v1.4.11', 'v1.4.10', 'v1.4.9', 'v1.4.8', 'v1.4.7', 'v1.4.6', 'v1.4.5', 'v1.4.4', 'v1.4.3', 'v1.4.2', 'v1.4.1', 'v1.4.0',
            'v1.3.17', 'v1.3.16', 'v1.3.15', 'v1.3.14', 'v1.3.13', 'v1.3.12', 'v1.3.11', 'v1.3.10', 'v1.3.9', 'v1.3.8', 'v1.3.7', 'v1.3.6', 'v1.3.5', 'v1.3.4', 'v1.3.3', 'v1.3.2', 'v1.3.1', 'v1.3.0',
            'v1.2.27', 'v1.2.26', 'v1.2.25', 'v1.2.24', 'v1.2.23', 'v1.2.22', 'v1.2.21', 'v1.2.20', 'v1.2.19', 'v1.2.18', 'v1.2.17', 'v1.2.16', 'v1.2.15', 'v1.2.14', 'v1.2.13', 'v1.2.12', 'v1.2.11', 'v1.2.10', 'v1.2.9', 'v1.2.8', 'v1.2.7', 'v1.2.6', 'v1.2.5', 'v1.2.4', 'v1.2.3', 'v1.2.2', 'v1.2.1', 'v1.2.0',
            'v1.1.65', 'v1.1.64', 'v1.1.63', 'v1.1.62', 'v1.1.61', 'v1.1.60', 'v1.1.59', 'v1.1.58', 'v1.1.57', 'v1.1.56', 'v1.1.55', 'v1.1.54', 'v1.1.53', 'v1.1.52', 'v1.1.51', 'v1.1.50', 'v1.1.49', 'v1.1.48', 'v1.1.47', 'v1.1.46', 'v1.1.45', 'v1.1.44', 'v1.1.43', 'v1.1.42', 'v1.1.41', 'v1.1.40', 'v1.1.39', 'v1.1.38', 'v1.1.37', 'v1.1.36', 'v1.1.35', 'v1.1.34', 'v1.1.33', 'v1.1.32', 'v1.1.31', 'v1.1.30', 'v1.1.29', 'v1.1.28', 'v1.1.27', 'v1.1.26', 'v1.1.25', 'v1.1.24', 'v1.1.23', 'v1.1.21', 'v1.1.20', 'v1.1.19', 'v1.1.18', 'v1.1.17', 'v1.1.16', 'v1.1.15', 'v1.1.14', 'v1.1.13', 'v1.1.12', 'v1.1.11', 'v1.1.10', 'v1.1.8', 'v1.1.7', 'v1.1.6', 'v1.1.4', 'v1.1.3', 'v1.1.2', 'v1.1.1',
          ].map(version => ({ text: version, link: `/changelog/${version}` })),
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vbgate/learn-opencode' },
    ],

    footer: {
      message: `<span title="未经授权，禁止将本站内容用于付费课程、付费专栏、出版物或其他商业用途。">本教程采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a> 许可协议 | <a href="/privacy">隐私政策</a> | © ${new Date().getFullYear()} LearnOpenCode</span>`,
    },

    // 本地搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换' },
              },
            },
          },
          en: {
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Clear search query',
                footer: { selectText: 'Select', navigateText: 'Navigate' },
              },
            },
          },
        },
      },
    },

    // 文档页脚导航
    docFooter: {
      prev: '上一课',
      next: '下一课',
    },

    outline: {
      label: '本页目录',
      level: [2, 3],
    },

    lastUpdated: {
      text: '最后更新',
    },

    editLink: {
      pattern: 'https://github.com/vbgate/learn-opencode/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
  },

  // 多语言配置
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Start', link: '/en/1-start/' },
          { text: 'Scenarios', link: '/en/4-scenarios/' },
          { text: 'Advanced', link: '/en/5-advanced/' },
          { text: 'Reference', link: '/en/appendix/' },
          { text: 'Community', link: '/en/community' },
        ],
        sidebar: [
          {
            text: '🚀 Quick Start',
            collapsed: false,
            items: [
              { text: 'Phase Guide', link: '/en/1-start/' },
              { text: '1.1 What is OpenCode', link: '/en/1-start/01-intro' },
              {
                text: '1.2 Installation',
                collapsed: true,
                items: [
                  { text: 'Install in 5 Minutes', link: '/en/1-start/02-install' },
                  { text: 'Alternative Methods', link: '/en/1-start/02a-install-alternatives' },
                  { text: 'Troubleshooting', link: '/en/1-start/02b-install-troubleshoot' },
                ]
              },
              { text: '1.3 Network Config', link: '/en/1-start/03-network' },
              {
                text: '1.4 Connect Models',
                collapsed: true,
                items: [
                  { text: 'Overview: First Chat', link: '/en/1-start/04-connect' },
                  { text: '[Recommended] MiniMax (M2.7)', link: '/en/1-start/04d-minimax' },
                  { text: 'Free Models (OpenCode Zen)', link: '/en/1-start/04a-free-models' },
                  { text: '[Recommended] Claude', link: '/en/1-start/04e-claude' },
                  { text: 'Claude Code Relay', link: '/en/1-start/04f-claudecode-relay' },
                  { text: 'OpenAI (GPT / Codex)', link: '/en/1-start/04h-openai' },
                  { text: 'Ollama (Local)', link: '/en/1-start/04g-ollama' },
                  { text: 'DeepSeek', link: '/en/1-start/04b-deepseek' },
                  { text: 'GLM (Zhipu)', link: '/en/1-start/04c-zhipu' },
                  { text: 'Qwen (Alibaba)', link: '/en/1-start/04i-alibaba' },
                  { text: 'GitHub Copilot', link: '/en/1-start/04j-github-copilot' },
                ]
              },
              { text: '1.5 Auto Update', link: '/en/1-start/05-update' },
            ]
          },
          {
            text: '💪 Daily Usage',
            collapsed: false,
            items: [
              { text: 'Phase Guide', link: '/en/2-daily/' },
              { text: '2.1 Interface & Controls', link: '/en/2-daily/01-interface' },
              { text: '2.1b Copy & Paste', link: '/en/2-daily/01b-copy-paste' },
              { text: '2.1c AI Basic Tools', link: '/en/2-daily/01c-basic-tools' },
              { text: '2.2 Session Management', link: '/en/2-daily/02-sessions' },
              { text: '2.3 Keyboard Shortcuts', link: '/en/2-daily/03-shortcuts' },
              { text: '2.4 Global Rules', link: '/en/2-daily/04-global-rules' },
              { text: '2.5 Environment Mgmt', link: '/en/2-daily/05-env-management' },
              { text: '2.6 Git Basics', link: '/en/2-daily/06-git-basics' },
            ]
          },
          {
            text: '⚡ Efficient Workflow',
            collapsed: false,
            items: [
              { text: 'Phase Guide', link: '/en/3-workflow/' },
              { text: '3.1 Plan vs Build', link: '/en/3-workflow/01-plan-build' },
              { text: '3.2 Understanding Agents', link: '/en/3-workflow/02-agents' },
              { text: '3.3 Project Init', link: '/en/3-workflow/03-init' },
            ]
          },
          {
            text: '🎯 Scenarios',
            collapsed: false,
            items: [
              { text: 'Choose Your Path', link: '/en/4-scenarios/' },
              {
                text: '✍️ Content Creation',
                collapsed: false,
                items: [
                  { text: 'A1 Writing Workflow', link: '/en/4-scenarios/writer-workflow' },
                  { text: 'A2 Blog & Newsletter', link: '/en/4-scenarios/writer-blog' },
                  { text: 'A3 Social Content', link: '/en/4-scenarios/writer-social' },
                  { text: 'A4 Marketing Copy', link: '/en/4-scenarios/writer-copywriting' },
                  { text: 'A5 Translation', link: '/en/4-scenarios/writer-translate' },
                  { text: 'A6 Novel Writing', link: '/en/4-scenarios/writer-novel' },
                  { text: 'A7 Script Writing', link: '/en/4-scenarios/writer-script' },
                  { text: 'A8 Web Novel (CN Only)', link: '/en/4-scenarios/writer-webnovel' },
                  { text: 'A9 Writing Station', link: '/en/4-scenarios/writer-workstation' },
                ]
              },
              {
                text: '💻 For Developers',
                collapsed: false,
                items: [
                  { text: 'B1 Daily Coding', link: '/en/4-scenarios/coder-daily' },
                  { text: 'B2 Refactor & Test', link: '/en/4-scenarios/coder-refactor' },
                  { text: 'B3 Docs & Git', link: '/en/4-scenarios/coder-docs-git' },
                  { text: 'B4 CI/CD Integration', link: '/en/4-scenarios/coder-cicd' },
                  { text: 'B5 Custom Agents', link: '/en/4-scenarios/coder-agents' },
                  { text: 'B6 Air-gapped Deploy', link: '/en/4-scenarios/coder-intranet' },
                ]
              },
              {
                text: '📊 Productivity',
                collapsed: false,
                items: [
                  { text: 'C1 File Management', link: '/en/4-scenarios/office-files' },
                  { text: 'C2 Data Processing', link: '/en/4-scenarios/office-data' },
                  { text: 'C3 Learn Coding w/ AI', link: '/en/4-scenarios/office-learn' },
                  { text: 'C4 Automation', link: '/en/4-scenarios/office-automation' },
                ]
              },
            ]
          },
          {
            text: '🔧 Advanced Guide',
            collapsed: false,
            items: [
              { text: 'Phase Guide', link: '/en/5-advanced/' },
              { 
                text: '5.1 Configuration',
                collapsed: true,
                items: [
                  { text: '5.1a Basics', link: '/en/5-advanced/01a-config-basics' },
                  { text: '5.1b Advanced', link: '/en/5-advanced/01b-config-advanced' },
                ]
              },
              { 
                text: '5.2 Agent System',
                collapsed: true,
                items: [
                  { text: '5.2a Quickstart', link: '/en/5-advanced/02a-agent-quickstart' },
                  { text: '5.2b Patterns', link: '/en/5-advanced/02b-agent-patterns' },
                  { text: '5.2c Permissions', link: '/en/5-advanced/02c-agent-permissions' },
                  { text: '5.2d Advanced', link: '/en/5-advanced/02d-agent-advanced' },
                ]
              },
              { 
                text: '5.3 Skills',
                collapsed: true,
                items: [
                  { text: '5.3a Basics', link: '/en/5-advanced/03a-skills-basics' },
                  { text: '5.3b Advanced', link: '/en/5-advanced/03b-skills-advanced' },
                  { text: '5.3c Patterns', link: '/en/5-advanced/03c-skills-patterns' },
                ]
              },
              { text: '5.4 Slash Commands', link: '/en/5-advanced/04-commands' },
              { text: '5.5 Permissions', link: '/en/5-advanced/05-permissions' },
              { 
                text: '5.6 Themes & Keys',
                collapsed: true,
                items: [
                  { text: '5.6a Themes', link: '/en/5-advanced/06a-themes' },
                  { text: '5.6b Keybinds', link: '/en/5-advanced/06b-keybinds' },
                ]
              },
              { text: '5.7 MCP Extension', 
                collapsed: true,
                items: [
                  { text: '5.7a Basics', link: '/en/5-advanced/07a-mcp-basics' },
                  { text: '5.7b Advanced', link: '/en/5-advanced/07b-mcp-advanced' },
                ]
              },
              {
                text: '5.8 IDE Integration',
                collapsed: true,
                items: [
                  { text: '5.8a VS Code', link: '/en/5-advanced/08a-ide-vscode' },
                  { text: '5.8b ACP Protocol', link: '/en/5-advanced/08b-acp' },
                ]
              },
              { 
                text: '5.9 Remote Mode',
                collapsed: true,
                items: [
                  { text: '5.9a Basics', link: '/en/5-advanced/09a-remote-basics' },
                  { text: '5.9b API Ref', link: '/en/5-advanced/09b-remote-api' },
                ]
              },
              { 
                text: '5.10 SDK Dev',
                collapsed: true,
                items: [
                  { text: '5.10a Basics', link: '/en/5-advanced/10a-sdk-basics' },
                  { text: '5.10b API Ref', link: '/en/5-advanced/10b-sdk-reference' },
                ]
              },
              { text: '5.11 Enterprise', link: '/en/5-advanced/11-enterprise' },
              { text: '5.11a Enterprise Auth', link: '/en/5-advanced/11a-enterprise-auth' },
              { 
                text: '5.12 Plugins',
                collapsed: true,
                items: [
                  { text: '5.12a Basics', link: '/en/5-advanced/12a-plugins-basics' },
                  { text: '5.12b Advanced', link: '/en/5-advanced/12b-plugins-advanced' },
                  { text: '5.12c Hooks', link: '/en/5-advanced/12c-hooks' },
                ]
              },
              { text: '5.13 Custom Tools', link: '/en/5-advanced/13-custom-tools' },
              { text: '5.14 GitHub Integration', link: '/en/5-advanced/14-github' },
              { text: '5.15 GitLab Integration', link: '/en/5-advanced/15-gitlab' },
              { text: '5.16 Session Sharing', link: '/en/5-advanced/16-share' },
              { text: '5.17 Built-in Tools', link: '/en/5-advanced/17-tools' },
              { text: '5.18 Formatters', link: '/en/5-advanced/18-formatters' },
              { text: '5.19 LSP Intelligence', link: '/en/5-advanced/19-lsp' },
              { text: '5.20 Context Compaction', link: '/en/5-advanced/20-compaction' },
              { text: '5.21 Thinking Depth', link: '/en/5-advanced/21-thinking-depth' },
              { text: '5.22 Debugging', link: '/en/5-advanced/22-debugging' },
              { text: '5.23 Web Search', link: '/en/5-advanced/23-web-search' },
              { text: '5.24 CLI Automation', link: '/en/5-advanced/24-cli-automation' },
            ]
          },
          {
            text: '📚 Quick Reference',
            collapsed: false,
            items: [
              { text: 'Reference Overview', link: '/en/appendix/' },
              { text: 'A. Keyboard Shortcuts', link: '/en/appendix/keybinds' },
              { text: 'B. Slash Commands', link: '/en/appendix/commands' },
              { text: 'C. CLI Reference', link: '/en/appendix/cli' },
              { text: 'D. Config Options', link: '/en/appendix/config-ref' },
              { text: 'E. Model Providers', link: '/en/appendix/providers' },
              { text: 'F. Prompt Library', link: '/en/appendix/prompts' },
              { text: 'G. FAQ', link: '/en/appendix/faq' },
              { text: 'H. Troubleshooting', link: '/en/appendix/troubleshoot' },
              { text: 'I. Ecosystem', link: '/en/appendix/ecosystem' },
              { text: 'J. Migration Guide', link: '/en/appendix/migration' },
              { text: 'K. OpenCode Zen', link: '/en/appendix/zen' },
              { text: 'L. Experimental', link: '/en/appendix/experimental-features' },
            ]
          },
          {
            text: '📝 Changelog',
            collapsed: true,
            items: [
              { text: 'Changelog', link: '/en/changelog/' },
              { text: 'v1.14.39', link: '/en/changelog/v1.14.39' },
              { text: 'v1.14.38', link: '/en/changelog/v1.14.38' },
              { text: 'v1.14.37', link: '/en/changelog/v1.14.37' },
              { text: 'v1.14.35', link: '/en/changelog/v1.14.35' },
              { text: 'v1.14.34', link: '/en/changelog/v1.14.34' },
              { text: 'v1.14.33', link: '/en/changelog/v1.14.33' },
              { text: 'v1.14.32', link: '/en/changelog/v1.14.32' },
              { text: 'v1.14.31', link: '/en/changelog/v1.14.31' },
              { text: 'v1.14.30', link: '/en/changelog/v1.14.30' },
              { text: 'v1.14.29', link: '/en/changelog/v1.14.29' },
              { text: 'v1.14.28', link: '/en/changelog/v1.14.28' },
              { text: 'v1.14.27', link: '/en/changelog/v1.14.27' },
              { text: 'v1.14.26', link: '/en/changelog/v1.14.26' },
              { text: 'v1.14.25', link: '/en/changelog/v1.14.25' },
              { text: 'v1.14.24', link: '/en/changelog/v1.14.24' },
              { text: 'v1.14.23', link: '/en/changelog/v1.14.23' },
              { text: 'v1.14.22', link: '/en/changelog/v1.14.22' },
              { text: 'v1.14.21', link: '/en/changelog/v1.14.21' },
              { text: 'v1.14.20', link: '/en/changelog/v1.14.20' },
              { text: 'v1.14.19', link: '/en/changelog/v1.14.19' },
              { text: 'v1.14.18', link: '/en/changelog/v1.14.18' },
              { text: 'v1.14.17', link: '/en/changelog/v1.14.17' },
              { text: 'v1.4.11', link: '/en/changelog/v1.4.11' },
              { text: 'v1.4.10', link: '/en/changelog/v1.4.10' },
              { text: 'v1.4.9', link: '/en/changelog/v1.4.9' },
              { text: 'v1.4.8', link: '/en/changelog/v1.4.8' },
              { text: 'v1.4.7', link: '/en/changelog/v1.4.7' },
              { text: 'v1.4.6', link: '/en/changelog/v1.4.6' },
              { text: 'v1.4.5', link: '/en/changelog/v1.4.5' },
              { text: 'v1.4.4', link: '/en/changelog/v1.4.4' },
              { text: 'v1.4.3', link: '/en/changelog/v1.4.3' },
              { text: 'v1.4.2', link: '/en/changelog/v1.4.2' },
              { text: 'v1.4.1', link: '/en/changelog/v1.4.1' },
              { text: 'v1.4.0', link: '/en/changelog/v1.4.0' },
              { text: 'v1.3.17', link: '/en/changelog/v1.3.17' },
              { text: 'v1.3.16', link: '/en/changelog/v1.3.16' },
              { text: 'v1.3.15', link: '/en/changelog/v1.3.15' },
              { text: 'v1.3.14', link: '/en/changelog/v1.3.14' },
              { text: 'v1.3.13', link: '/en/changelog/v1.3.13' },
              { text: 'v1.3.12', link: '/en/changelog/v1.3.12' },
              { text: 'v1.3.11', link: '/en/changelog/v1.3.11' },
              { text: 'v1.3.10', link: '/en/changelog/v1.3.10' },
              { text: 'v1.3.9', link: '/en/changelog/v1.3.9' },
              { text: 'v1.3.8', link: '/en/changelog/v1.3.8' },
              { text: 'v1.3.7', link: '/en/changelog/v1.3.7' },
              { text: 'v1.3.6', link: '/en/changelog/v1.3.6' },
              { text: 'v1.3.5', link: '/en/changelog/v1.3.5' },
              { text: 'v1.3.4', link: '/en/changelog/v1.3.4' },
              { text: 'v1.3.3', link: '/en/changelog/v1.3.3' },
              { text: 'v1.3.2', link: '/en/changelog/v1.3.2' },
              { text: 'v1.3.1', link: '/en/changelog/v1.3.1' },
              { text: 'v1.3.0', link: '/en/changelog/v1.3.0' },
              { text: 'v1.2.27', link: '/en/changelog/v1.2.27' },
              { text: 'v1.2.26', link: '/en/changelog/v1.2.26' },
              { text: 'v1.2.25', link: '/en/changelog/v1.2.25' },
              { text: 'v1.2.24', link: '/en/changelog/v1.2.24' },
              { text: 'v1.2.23', link: '/en/changelog/v1.2.23' },
              { text: 'v1.2.22', link: '/en/changelog/v1.2.22' },
              { text: 'v1.2.21', link: '/en/changelog/v1.2.21' },
              { text: 'v1.2.20', link: '/en/changelog/v1.2.20' },
              { text: 'v1.2.19', link: '/en/changelog/v1.2.19' },
              { text: 'v1.2.18', link: '/en/changelog/v1.2.18' },
              { text: 'v1.2.17', link: '/en/changelog/v1.2.17' },
              { text: 'v1.2.16', link: '/en/changelog/v1.2.16' },
              { text: 'v1.2.15', link: '/en/changelog/v1.2.15' },
              { text: 'v1.2.14', link: '/en/changelog/v1.2.14' },
              { text: 'v1.2.13', link: '/en/changelog/v1.2.13' },
              { text: 'v1.2.12', link: '/en/changelog/v1.2.12' },
              { text: 'v1.2.11', link: '/en/changelog/v1.2.11' },
              { text: 'v1.2.10', link: '/en/changelog/v1.2.10' },
              { text: 'v1.2.9', link: '/en/changelog/v1.2.9' },
              { text: 'v1.2.8', link: '/en/changelog/v1.2.8' },
              { text: 'v1.2.7', link: '/en/changelog/v1.2.7' },
              { text: 'v1.2.6', link: '/en/changelog/v1.2.6' },
              { text: 'v1.2.5', link: '/en/changelog/v1.2.5' },
              { text: 'v1.2.4', link: '/en/changelog/v1.2.4' },
              { text: 'v1.2.3', link: '/en/changelog/v1.2.3' },
              { text: 'v1.2.2', link: '/en/changelog/v1.2.2' },
              { text: 'v1.2.1', link: '/en/changelog/v1.2.1' },
              { text: 'v1.2.0', link: '/en/changelog/v1.2.0' },
              { text: 'v1.1.65', link: '/en/changelog/v1.1.65' },
              { text: 'v1.1.64', link: '/en/changelog/v1.1.64' },
              { text: 'v1.1.63', link: '/en/changelog/v1.1.63' },
              { text: 'v1.1.62', link: '/en/changelog/v1.1.62' },
              { text: 'v1.1.61', link: '/en/changelog/v1.1.61' },
              { text: 'v1.1.60', link: '/en/changelog/v1.1.60' },
              { text: 'v1.1.59', link: '/en/changelog/v1.1.59' },
              { text: 'v1.1.58', link: '/en/changelog/v1.1.58' },
              { text: 'v1.1.57', link: '/en/changelog/v1.1.57' },
              { text: 'v1.1.56', link: '/en/changelog/v1.1.56' },
              { text: 'v1.1.55', link: '/en/changelog/v1.1.55' },
              { text: 'v1.1.54', link: '/en/changelog/v1.1.54' },
              { text: 'v1.1.53', link: '/en/changelog/v1.1.53' },
              { text: 'v1.1.52', link: '/en/changelog/v1.1.52' },
              { text: 'v1.1.51', link: '/en/changelog/v1.1.51' },
              { text: 'v1.1.50', link: '/en/changelog/v1.1.50' },
              { text: 'v1.1.49', link: '/en/changelog/v1.1.49' },
              { text: 'v1.1.48', link: '/en/changelog/v1.1.48' },
              { text: 'v1.1.47', link: '/en/changelog/v1.1.47' },
              { text: 'v1.1.46', link: '/en/changelog/v1.1.46' },
              { text: 'v1.1.45', link: '/en/changelog/v1.1.45' },
              { text: 'v1.1.44', link: '/en/changelog/v1.1.44' },
              { text: 'v1.1.43', link: '/en/changelog/v1.1.43' },
              { text: 'v1.1.42', link: '/en/changelog/v1.1.42' },
              { text: 'v1.1.41', link: '/en/changelog/v1.1.41' },
              { text: 'v1.1.40', link: '/en/changelog/v1.1.40' },
              { text: 'v1.1.39', link: '/en/changelog/v1.1.39' },
              { text: 'v1.1.38', link: '/en/changelog/v1.1.38' },
              { text: 'v1.1.37', link: '/en/changelog/v1.1.37' },
              { text: 'v1.1.36', link: '/en/changelog/v1.1.36' },
              { text: 'v1.1.35', link: '/en/changelog/v1.1.35' },
              { text: 'v1.1.34', link: '/en/changelog/v1.1.34' },
              { text: 'v1.1.33', link: '/en/changelog/v1.1.33' },
              { text: 'v1.1.32', link: '/en/changelog/v1.1.32' },
              { text: 'v1.1.31', link: '/en/changelog/v1.1.31' },
              { text: 'v1.1.30', link: '/en/changelog/v1.1.30' },
              { text: 'v1.1.29', link: '/en/changelog/v1.1.29' },
              { text: 'v1.1.28', link: '/en/changelog/v1.1.28' },
              { text: 'v1.1.27', link: '/en/changelog/v1.1.27' },
              { text: 'v1.1.26', link: '/en/changelog/v1.1.26' },
              { text: 'v1.1.25', link: '/en/changelog/v1.1.25' },
              { text: 'v1.1.24', link: '/en/changelog/v1.1.24' },
              { text: 'v1.1.23', link: '/en/changelog/v1.1.23' },
              { text: 'v1.1.21', link: '/en/changelog/v1.1.21' },
              { text: 'v1.1.20', link: '/en/changelog/v1.1.20' },
              { text: 'v1.1.19', link: '/en/changelog/v1.1.19' },
              { text: 'v1.1.18', link: '/en/changelog/v1.1.18' },
              { text: 'v1.1.17', link: '/en/changelog/v1.1.17' },
              { text: 'v1.1.16', link: '/en/changelog/v1.1.16' },
              { text: 'v1.1.15', link: '/en/changelog/v1.1.15' },
              { text: 'v1.1.14', link: '/en/changelog/v1.1.14' },
              { text: 'v1.1.13', link: '/en/changelog/v1.1.13' },
              { text: 'v1.1.12', link: '/en/changelog/v1.1.12' },
              { text: 'v1.1.11', link: '/en/changelog/v1.1.11' },
              { text: 'v1.1.10', link: '/en/changelog/v1.1.10' },
              { text: 'v1.1.8', link: '/en/changelog/v1.1.8' },
              { text: 'v1.1.7', link: '/en/changelog/v1.1.7' },
              { text: 'v1.1.6', link: '/en/changelog/v1.1.6' },
              { text: 'v1.1.4', link: '/en/changelog/v1.1.4' },
              { text: 'v1.1.3', link: '/en/changelog/v1.1.3' },
              { text: 'v1.1.2', link: '/en/changelog/v1.1.2' },
              { text: 'v1.1.1', link: '/en/changelog/v1.1.1' },
            ]
          },
        ],
        footer: {
          message: 'Released under the <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">CC BY-NC-SA 4.0</a> License. | <a href="/en/privacy">Privacy Policy</a> | © 2024 LearnOpenCode',
        },
        docFooter: {
          prev: 'Previous',
          next: 'Next',
        },
        outline: {
          label: 'On this page',
        },
        lastUpdated: {
          text: 'Last updated',
        },
        editLink: {
          pattern: 'https://github.com/vbgate/learn-opencode/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },
      }
    },
  },
})
