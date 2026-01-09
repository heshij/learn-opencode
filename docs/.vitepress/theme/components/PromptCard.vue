<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  expected?: string
}>()

const copied = ref(false)
const contentRef = ref<HTMLElement | null>(null)

const copy = async () => {
  if (contentRef.value) {
    const text = contentRef.value.textContent || ''
    await navigator.clipboard.writeText(text.trim())
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<template>
  <div class="prompt-card">
    <div class="prompt-header">
      <span class="prompt-title">📋 {{ title }}</span>
      <button @click="copy" class="copy-btn">
        {{ copied ? '✅ 已复制' : '复制' }}
      </button>
    </div>
    <pre ref="contentRef" class="prompt-content"><slot /></pre>
    <div v-if="expected" class="prompt-expected">
      <strong>预期效果：</strong>{{ expected }}
    </div>
  </div>
</template>

<style scoped>
.prompt-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin: 1rem 0;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.prompt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
}

.prompt-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.copy-btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.prompt-content {
  margin: 0;
  padding: 1rem;
  font-size: 0.9rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--vp-c-text-1);
  background: transparent;
}

.prompt-expected {
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}
</style>
