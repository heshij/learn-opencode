# 图片资源目录

此目录用于存放课程中使用的图片资源。

## 目录结构

```
public/images/
├── 1-start/        # 第一阶段：快速起步
├── 2-daily/        # 第二阶段：日常使用
├── 3-workflow/     # 第三阶段：高效工作流
├── 4-scenarios/    # 第四阶段：场景实战
├── 5-advanced/     # 第五阶段：深度定制
└── appendix/       # 速查手册
```

## 命名规范

- 格式：`功能点.png` 或 `功能点.gif`
- 示例：
  - `install-success.png` - 安装成功截图
  - `writer-workflow-demo.gif` - 写作工作流动画演示

## 引用方式

在 Markdown 中引用时，**不要**包含 `public` 前缀：

```markdown
![安装成功](/images/1-start/install-success.svg)
```

## 待添加图片

课程中标注 `<!-- 📹 演示位 -->` 的位置需要添加对应图片/GIF。
