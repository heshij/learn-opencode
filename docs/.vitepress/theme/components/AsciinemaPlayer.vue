<script setup lang="ts">
defineProps<{
  src: string
  cols?: number
  rows?: number
}>()
</script>

<template>
  <div class="asciinema-container">
    <div class="asciinema-placeholder">
      <div class="placeholder-icon">▶️</div>
      <div class="placeholder-text">终端录屏</div>
      <div class="placeholder-src">{{ src }}</div>
      <p class="placeholder-note">
        请安装 asciinema-player 并配置 cast 文件后显示
      </p>
    </div>
  </div>
</template>

<style scoped>
.asciinema-container {
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
}

.asciinema-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: #1e1e1e;
  color: #888;
  text-align: center;
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.placeholder-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ccc;
  margin-bottom: 0.5rem;
}

.placeholder-src {
  font-family: monospace;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;
}

.placeholder-note {
  font-size: 0.8rem;
  color: #555;
  margin: 0;
}
</style>
