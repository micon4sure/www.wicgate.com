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
  <div
    class="relative w-full pb-[56.25%] bg-graphite-light border border-mg rounded-none overflow-hidden"
  >
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
      <div
        class="absolute inset-0 bg-gradient-to-br from-black/30 to-black/60 flex items-center justify-center transition-all duration-300 ease-out group-hover:from-black/50 group-hover:to-black/75"
      >
        <button
          type="button"
          class="flex flex-col items-center gap-3 px-8 py-6 md:px-7 md:py-5 md:gap-3 sm:px-6 sm:py-4 sm:text-sm xs:px-6 xs:py-4 xs:text-[0.9rem] xs:gap-2 bg-twitch text-white rounded-none border-2 border-white/30 font-military font-semibold text-lg uppercase tracking-widest transition-all duration-300 ease-out shadow-[0_0_20px_rgba(145,70,255,0.5)] group-hover:scale-110 group-hover:bg-twitch-bright group-hover:shadow-[0_0_30px_rgba(145,70,255,0.8)] active:scale-[0.95]"
        >
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
