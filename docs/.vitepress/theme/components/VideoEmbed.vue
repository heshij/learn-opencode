<script setup lang="ts">
defineProps<{
  platform: 'bilibili' | 'youtube'
  id: string
}>()
</script>

<template>
  <div class="video-embed">
    <iframe
      v-if="platform === 'bilibili'"
      :src="`//player.bilibili.com/player.html?bvid=${id}&page=1&high_quality=1`"
      scrolling="no"
      border="0"
      frameborder="no"
      framespacing="0"
      allowfullscreen="true"
    ></iframe>
    <iframe
      v-else-if="platform === 'youtube'"
      :src="`https://www.youtube.com/embed/${id}`"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<style scoped>
.video-embed {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 */
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}

.video-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
