<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ channel: string; muted?: boolean }>();

const isLoaded = ref(false);
const host = typeof window !== 'undefined' ? window.location.hostname : 'wicgate.com';

// Twitch static preview image (shows stream thumbnail if live, placeholder if offline)
const previewUrl = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${props.channel}-640x360.jpg`;

function loadEmbed() {
  isLoaded.value = true;
}
</script>

<template>
  <div class="twitch-facade">
    <div v-if="!isLoaded" class="twitch-preview" @click="loadEmbed">
      <img :src="previewUrl" :alt="`${channel} Twitch stream preview`" loading="lazy" />
      <div class="preview-overlay">
        <div class="play-button">
          <i class="fa-brands fa-twitch" aria-hidden="true"></i>
          <span>Watch Live</span>
        </div>
      </div>
    </div>

    <iframe
      v-else
      :src="`https://player.twitch.tv/?channel=${props.channel}&parent=${host}&muted=${props.muted !== false}`"
      allowfullscreen
      loading="lazy"
      title="Twitch stream"
      referrerpolicy="strict-origin-when-cross-origin"
    />
  </div>
</template>

<style scoped>
.twitch-facade {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: var(--s2);
  border: 1px solid var(--bd);
  border-radius: 0;
  overflow: hidden;
}

.twitch-facade iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.twitch-preview {
  position: absolute;
  inset: 0;
  cursor: pointer;
  transition: var(--tr);
}

.twitch-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--tr);
}

@media (hover: hover) {
  .twitch-preview:hover .preview-overlay {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.75) 100%);
  }

  .twitch-preview:hover .play-button {
    transform: scale(1.1);
    background: var(--brand-twitch-bright);
    box-shadow: 0 0 30px rgba(var(--brand-twitch-rgb), 0.8);
  }
}

.twitch-preview:active .play-button {
  transform: scale(0.95);
}

.play-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
  background: var(--brand-twitch);
  color: #fff;
  border-radius: 0;
  border: 2px solid rgba(255, 255, 255, 0.3);
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  transition: var(--tr);
  box-shadow: 0 0 20px rgba(var(--brand-twitch-rgb), 0.5);
}

.play-button i {
  font-size: 2.5rem;
}

.play-button span {
  line-height: 1;
}

@media (max-width: 768px) {
  .play-button {
    padding: 20px 28px;
    font-size: 1rem;
  }

  .play-button i {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .play-button {
    padding: 16px 24px;
    font-size: 0.9rem;
  }

  .play-button i {
    font-size: 1.75rem;
  }
}
</style>
