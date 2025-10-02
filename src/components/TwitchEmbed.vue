<script setup lang="ts">
import { ref, onMounted } from 'vue';
const props = defineProps<{ channel: string; muted?: boolean }>();
const host = ref('');
onMounted(() => {
  host.value = window.location.hostname;
});
</script>
<template>
  <div class="twitch-embed">
    <iframe
      v-if="host"
      :src="`https://player.twitch.tv/?channel=${props.channel}&parent=${host}&muted=${props.muted !== false}`"
      allowfullscreen
      loading="lazy"
      title="Twitch stream"
      referrerpolicy="strict-origin-when-cross-origin"
    />
    <div v-else class="twitch-embed-loading text-muted">Loading…</div>
  </div>
</template>
<style scoped>
.twitch-embed {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: var(--s2);
  border: 1px solid var(--bd);
  border-radius: 0;
  overflow: hidden;
}

.twitch-embed iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.twitch-embed-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0;
  font-size: 0.85rem;
}
</style>
