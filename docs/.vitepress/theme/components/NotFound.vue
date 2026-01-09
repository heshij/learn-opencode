<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vitepress'

// 获取当前路由
const route = useRoute()

// 打字机效果
const displayText = ref('')
const fullText = '404：AI 也不是万能的...'
const showCursor = ref(true)
const typingComplete = ref(false)

onMounted(() => {
  let i = 0
  const typeWriter = () => {
    if (i < fullText.length) {
      displayText.value += fullText.charAt(i)
      i++
      setTimeout(typeWriter, 100)
    } else {
      typingComplete.value = true
    }
  }
  
  // 延迟开始打字效果
  setTimeout(typeWriter, 500)
  
  // 光标闪烁
  setInterval(() => {
    showCursor.value = !showCursor.value
  }, 530)
})
</script>

<template>
  <div class="not-found">
    <!-- 可爱的机器人表情 -->
    <div class="robot-face">
      <div class="robot-eyes">
        <span class="eye left">●</span>
        <span class="eye right">●</span>
      </div>
      <div class="robot-mouth">︵</div>
    </div>
    
    <!-- 打字机效果标题 -->
    <h1 class="title">
      <span class="typed-text">{{ displayText }}</span>
      <span class="cursor" :class="{ hidden: !showCursor }">▌</span>
    </h1>
    
    <!-- 副标题 -->
    <p class="subtitle" :class="{ visible: typingComplete }">
      这个页面可能去学 AI 编程了，暂时找不到它
    </p>
    
    <!-- 操作按钮 -->
    <div class="actions" :class="{ visible: typingComplete }">
      <a href="/" class="btn primary">
        <span class="icon">🏠</span>
        返回首页
      </a>
      <a href="/1-start/01-intro.html" class="btn secondary">
        <span class="icon">🚀</span>
        开始学习
      </a>
    </div>
    
    <!-- 搜索提示 -->
    <div class="search-hint" :class="{ visible: typingComplete }">
      <p>💡 试试按 <kbd>Ctrl</kbd> + <kbd>K</kbd> 搜索你想要的内容</p>
    </div>
    
    <!-- 装饰性代码块 -->
    <div class="code-decoration" :class="{ visible: typingComplete }">
      <pre><code>$ opencode find --page "{{ route.path }}"
<span class="error">Error: PageNotFoundException</span>
<span class="hint">Hint: 页面可能已移动或删除</span></code></pre>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem;
  text-align: center;
}

/* 机器人表情 */
.robot-face {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

.robot-eyes {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.eye {
  display: inline-block;
  color: var(--vp-c-brand-1);
  animation: blink 4s ease-in-out infinite;
}

.eye.left {
  animation-delay: 0.1s;
}

.robot-mouth {
  font-size: 3rem;
  margin-top: -0.5rem;
  color: var(--vp-c-text-2);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes blink {
  0%, 45%, 55%, 100% { opacity: 1; }
  50% { opacity: 0.1; }
}

/* 打字机标题 */
.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 1rem 0;
  font-family: var(--vp-font-family-mono);
}

.typed-text {
  color: var(--vp-c-brand-1);
}

.cursor {
  color: var(--vp-c-brand-1);
  animation: none;
  transition: opacity 0.1s;
}

.cursor.hidden {
  opacity: 0;
}

/* 副标题 */
.subtitle {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0.5rem 0 2rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.5s ease;
}

.subtitle.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 按钮 */
.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.5s ease 0.2s;
}

.actions.visible {
  opacity: 1;
  transform: translateY(0);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s ease;
}

.btn .icon {
  font-size: 1.1rem;
}

.btn.primary {
  background: var(--vp-c-brand-1);
  color: white;
}

.btn.primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn.secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.btn.secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

/* 搜索提示 */
.search-hint {
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.5s ease 0.4s;
}

.search-hint.visible {
  opacity: 1;
  transform: translateY(0);
}

.search-hint p {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.search-hint kbd {
  display: inline-block;
  padding: 0.15em 0.4em;
  font-size: 0.85em;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  box-shadow: 0 1px 0 var(--vp-c-divider);
}

/* 装饰性代码块 */
.code-decoration {
  max-width: 500px;
  text-align: left;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.5s ease 0.6s;
}

.code-decoration.visible {
  opacity: 1;
  transform: translateY(0);
}

.code-decoration pre {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.85rem;
  font-family: var(--vp-font-family-mono);
  overflow-x: auto;
}

.code-decoration code {
  color: var(--vp-c-text-2);
}

.code-decoration .error {
  color: #ef4444;
}

.code-decoration .hint {
  color: var(--vp-c-brand-1);
}

/* 响应式 */
@media (max-width: 640px) {
  .title {
    font-size: 1.5rem;
  }
  
  .robot-face {
    font-size: 3rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
