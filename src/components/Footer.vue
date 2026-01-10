<script setup lang="ts">
const year = new Date().getFullYear();

const socialLinks = [
  {
    name: 'Discord',
    href: 'https://discord.gg/Udbv9UDBBb',
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
    <div class="absolute inset-0 bg-gradient-to-b from-panel/95 to-dark-navy-dark/98"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-dark-navy-dark/60 to-transparent"></div>

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
          :title="`Visit ${link.name} (opens in new tab)`"
          class="social-link"
          :class="`social-link-${link.color}`"
        >
          <i :class="link.icon"></i>
        </a>
      </div>

      <!-- Divider -->
      <div
        class="w-24 h-px bg-gradient-to-r from-transparent via-teal/40 to-transparent mx-auto mb-6"
      ></div>

      <!-- Copyright & Disclaimer -->
      <div class="text-center">
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
