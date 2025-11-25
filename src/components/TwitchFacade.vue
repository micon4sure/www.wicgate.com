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
  <div class="twitch-container">
    <div
      v-if="!isLoaded"
      class="absolute inset-0 cursor-pointer transition-all duration-300 ease-out group"
      @click="loadEmbed"
    >
      <img
        :src="previewUrl"
        :alt="`${channel} Twitch stream preview`"
        loading="lazy"
        class="w-full h-full object-cover block"
      />
      <div class="twitch-overlay">
        <button type="button" class="twitch-play-btn">
          <i
            class="fa-brands fa-twitch text-2.5xl md:text-2xl sm:text-2rem xs:text-[1.75rem]"
            aria-hidden="true"
          ></i>
          <span class="leading-none">Watch Live</span>
        </button>
      </div>
    </div>

    <iframe
      v-else
      :src="`https://player.twitch.tv/?channel=${props.channel}&parent=${host}&muted=${props.muted !== false}`"
      class="absolute inset-0 w-full h-full border-0"
      allowfullscreen
      loading="lazy"
      title="Twitch stream"
      referrerpolicy="strict-origin-when-cross-origin"
    />
  </div>
</template>
