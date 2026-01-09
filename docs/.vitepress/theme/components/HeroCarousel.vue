<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const images = [
  '/hero/b1.png',
  '/hero/b2.png',
  '/hero/b3.png',
  '/hero/b4.png'
]

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.length
  }, 6000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="hero-carousel">
    <img
      v-for="(src, index) in images"
      :key="src"
      :src="src"
      :class="{ active: index === currentIndex }"
      alt="Hero Image"
    />
  </div>
</template>

<style scoped>
.hero-carousel {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.hero-carousel img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.hero-carousel img.active {
  position: relative;
  opacity: 1;
}
</style>
