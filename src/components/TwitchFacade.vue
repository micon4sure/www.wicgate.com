<script setup lang="ts">
const props = defineProps<{ channel: string; muted?: boolean }>();

const host = typeof window !== 'undefined' ? window.location.hostname : 'wicgate.com';
</script>

<template>
  <div class="twitch-container">
    <iframe
      :src="`https://player.twitch.tv/?channel=${props.channel}&parent=${host}&muted=${props.muted !== false}`"
      class="absolute inset-0 w-full h-full border-0"
      allowfullscreen
      loading="lazy"
      title="Twitch stream"
      referrerpolicy="strict-origin-when-cross-origin"
    />
  </div>
</template>
