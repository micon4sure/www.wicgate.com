<template>
  <div class="calendar-card">
    <!-- SEO-friendly static content -->
    <noscript>
      <div class="seo-content">
        <h3>World in Conflict Community Events</h3>
        <p>
          Stay updated with upcoming World in Conflict community events, tournaments, and
          gatherings. Our events calendar features scheduled matches, clan wars, community game
          nights, and special tournaments organized by the WiC community.
        </p>
        <p>
          JavaScript is required to view the interactive events calendar with countdowns and event
          details.
        </p>
      </div>
    </noscript>

    <!-- Animated loading skeleton -->
    <div aria-label="Loading events calendar">
      <!-- Calendar Header -->
      <div class="h-[50px] skeleton-shimmer"></div>

      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 gap-px bg-divider">
        <div
          v-for="n in 7"
          :key="'weekday-' + n"
          class="h-8 skeleton-shimmer"
          :style="{ animationDelay: `${n * 0.02}s` }"
        ></div>
      </div>

      <!-- Calendar Grid (6 rows x 7 columns = 42 days) -->
      <div class="grid grid-cols-7 gap-px bg-divider">
        <div v-for="row in 6" :key="'row-' + row" class="contents">
          <div
            v-for="col in 7"
            :key="'day-' + row + '-' + col"
            class="min-h-[44px] sm:min-h-[48px] skeleton-shimmer"
            :style="{ animationDelay: `${row * 0.05}s` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
