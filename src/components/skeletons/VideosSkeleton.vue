<template>
  <div class="min-h-[640px] m-5">
    <!-- SEO-friendly static content -->
    <noscript>
      <div class="seo-content">
        <h3>World in Conflict Video Content</h3>
        <p>
          Watch the latest World in Conflict gameplay videos, tutorials, and tournament highlights
          from our community creators. Our content includes strategy guides, tactical breakdowns,
          competitive match replays, and beginner-friendly tutorials.
        </p>
        <p>
          Subscribe to our YouTube channel for weekly uploads featuring high-level gameplay,
          tournament VODs, and community highlights. Learn from experienced players and improve your
          skills across all factions and game modes.
        </p>
        <p>JavaScript is required to view the video gallery and embedded players.</p>
      </div>
    </noscript>

    <!-- Animated loading skeleton -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-4"
      aria-label="Loading video content"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="bg-gradient-to-b from-panel/96 to-panel-dark/98 border border-divider-strong rounded-none overflow-hidden shadow-[0_12px_28px_rgba(4,9,14,0.55)] min-h-[310px] flex flex-col"
      >
        <div class="w-full pb-[56.25%] skeleton-shimmer relative"></div>
        <div class="p-3 flex flex-col gap-2">
          <div class="h-5 w-[90%] skeleton-shimmer" :style="{ animationDelay: '0.1s' }"></div>
          <div class="h-5 w-[60%] skeleton-shimmer" :style="{ animationDelay: '0.2s' }"></div>
          <div
            class="h-[14px] w-1/2 mt-1 skeleton-shimmer"
            :style="{ animationDelay: '0.3s' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
