<template>
  <div class="min-h-[380px] m-5">
    <!-- SEO-friendly static content -->
    <noscript>
      <div class="seo-content">
        <h3>World in Conflict Community Events</h3>
        <p>
          Join our regular community events, tournaments, and special operations. We host weekly 2v2
          tournaments, monthly championships, and special holiday events with prizes including Steam
          gift cards and exclusive community roles.
        </p>
        <p>
          Check back regularly for upcoming tournaments, community game nights, and competitive
          events. All skill levels welcome - we offer both competitive and casual brackets to ensure
          everyone can participate.
        </p>
        <p>JavaScript is required to view live event schedules and countdown timers.</p>
      </div>
    </noscript>

    <!-- Animated loading skeleton -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-4"
      aria-label="Loading community events"
    >
      <div v-for="n in 3" :key="n" class="skeleton-card min-h-[340px] md:min-h-80 flex flex-col">
        <div class="h-[220px] md:h-[180px] skeleton-shimmer"></div>
        <div class="p-4 flex flex-col gap-3">
          <div class="h-7 w-[70%] skeleton-shimmer" :style="{ animationDelay: '0.1s' }"></div>
          <div class="h-[18px] w-full skeleton-shimmer" :style="{ animationDelay: '0.2s' }"></div>
          <div class="h-[18px] w-[60%] skeleton-shimmer" :style="{ animationDelay: '0.3s' }"></div>
          <div class="h-4 w-[40%] mt-2 skeleton-shimmer" :style="{ animationDelay: '0.4s' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>
