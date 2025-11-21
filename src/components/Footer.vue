<script setup lang="ts">
const year = new Date().getFullYear();

const socialLinks = [
  {
    name: 'Discord',
    href: 'https://discord.gg/wicgate',
    icon: 'fab fa-discord',
    color: 'discord',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@WiCGateOfficial',
    icon: 'fab fa-youtube',
    color: 'youtube',
  },
  {
    name: 'Twitch',
    href: 'https://twitch.tv/directory/game/World%20in%20Conflict',
    icon: 'fab fa-twitch',
    color: 'twitch',
  },
  {
    name: 'X',
    href: 'https://x.com/wicgate',
    icon: 'fab fa-x-twitter',
    color: 'x',
  },
];
</script>

<template>
  <footer class="relative overflow-hidden border-t-2 border-mg/50">
    <!-- Background gradient matching site theme -->
    <div class="absolute inset-0 bg-gradient-to-b from-panel/95 to-graphite-dark/98"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-graphite-dark/60 to-transparent"></div>

    <div class="relative z-10 max-w-4xl mx-auto px-5 py-10">
      <!-- Social Links -->
      <div class="flex justify-center gap-4 mb-6">
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="link.name"
          class="w-11 h-11 flex items-center justify-center bg-mg/30 border border-mg/50 rounded-none transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
          :class="{
            'hover:bg-discord/20 hover:border-discord/60 hover:shadow-[0_0_15px_rgba(88,101,242,0.4)]':
              link.color === 'discord',
            'hover:bg-youtube/20 hover:border-youtube/60 hover:shadow-[0_0_15px_rgba(229,57,53,0.4)]':
              link.color === 'youtube',
            'hover:bg-twitch/20 hover:border-twitch/60 hover:shadow-[0_0_15px_rgba(145,70,255,0.4)]':
              link.color === 'twitch',
            'hover:bg-white/10 hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]':
              link.color === 'x',
          }"
        >
          <i
            :class="[
              link.icon,
              'text-lg transition-colors duration-300',
              {
                'text-t-dim hover:text-discord': link.color === 'discord',
                'text-t-dim hover:text-youtube': link.color === 'youtube',
                'text-t-dim hover:text-twitch': link.color === 'twitch',
                'text-t-dim hover:text-white': link.color === 'x',
              },
            ]"
          ></i>
        </a>
      </div>

      <!-- Divider -->
      <div
        class="w-24 h-px bg-gradient-to-r from-transparent via-teal/40 to-transparent mx-auto mb-6"
      ></div>

      <!-- Server Status & Copyright -->
      <div class="text-center">
        <div class="flex items-center justify-center gap-2 mb-4">
          <span class="w-2 h-2 rounded-full bg-online animate-pulse-slow"></span>
          <span class="text-t-secondary text-sm font-body">WICGATE Servers Online</span>
        </div>

        <!-- Copyright & Disclaimer -->
        <p class="text-t-tertiary text-xs font-body leading-relaxed max-w-xl mx-auto">
          &copy; {{ year }} WICGATE Community &mdash; a non-commercial fan project. World in
          Conflict&trade; is a trademark of Ubisoft Entertainment. Not affiliated with or endorsed
          by Ubisoft or Massive Entertainment. All trademarks are property of their respective
          owners.
        </p>
      </div>
    </div>
  </footer>
</template>
