# 统计数据自动生成

## 功能说明

每次构建或启动开发服务器时，会自动运行 `scripts/stats.sh` 统计教程字数和 4K 笔记数量，并生成 `docs/data/stats.json` 文件。

## 统计规则

- **字数统计**（Word 风格）：
  - 中文：每个汉字算 1 字
  - 英文：每个单词算 1 字
  - 统计范围：`docs/` 下所有 `.md` 文件（排除 `.vitepress` 目录）

- **笔记统计**：
  - 统计 `docs/public/images` 下所有 `*-notes.jpeg` 文件
  - 排除 `*.mini.jpeg` 缩略图

## 数据格式

```json
{
  "wordCount": 138188,
  "notesCount": 66
}
```

## 使用方式

在首页 `docs/index.md` 中通过 Vue 脚本导入并使用：

```vue
<script setup>
import stats from './data/stats.json'
</script>

<span class="stat-number">{{ Math.round(stats.wordCount / 10000).toFixed(1) }}万</span>
<span class="stat-number">{{ stats.notesCount }}</span>
```

## 自动触发

```json
"scripts": {
  "dev": "bash scripts/stats.sh && vitepress dev docs",
  "build": "bash scripts/stats.sh && vitepress build docs"
}
```
