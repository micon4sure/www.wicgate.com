<script setup lang="ts">
import TwitchEmbed from '../TwitchEmbed.vue';

withDefaults(defineProps<{ channels?: string[] }>(), {
  channels: () => ['kickapoo149', 'pontertwitch'],
});
</script>

<template>
  <section id="streams" class="community-module mb-xl">
    <div class="vid-hdr">
      <h3>Live Streams</h3>
    </div>
    <div class="live-streams-container">
      <div class="grid grid-2" style="gap: 30px">
        <a
          v-for="channel in channels"
          :key="channel"
          :href="`https://twitch.tv/${channel}`"
          target="_blank"
          class="card"
          style="padding: 0; overflow: hidden; text-decoration: none; color: inherit"
          :aria-label="`Watch ${channel} live on Twitch`"
        >
          <TwitchEmbed :channel="channel" muted />
          <div class="stream-card-footer">
            <strong>{{ channel }}</strong>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stream-card-footer {
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
}
</style>
