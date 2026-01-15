<template>
  <div class="min-h-[600px]">
    <!-- SEO-friendly static content -->
    <noscript>
      <div class="seo-content">
        <h3>World in Conflict Player Leaderboards</h3>
        <p>
          View real-time rankings for World in Conflict players across all game modes including
          Domination, Assault, and Tug of War. Our competitive community features skilled players
          battling for top positions on the leaderboards. Rankings update after each match based on
          performance and opponent skill levels.
        </p>
        <p>
          JavaScript is required to view live leaderboard data. Enable JavaScript to see current
          player rankings, statistics, and competitive standings.
        </p>
      </div>
    </noscript>

    <!-- Animated loading skeleton -->
    <div class="grid grid-cols-1 gap-6 pt-5" aria-label="Loading player statistics">
      <!-- First dual container: High Scores + Total Scores (with tabs) -->
      <div class="leaderboard-dual-container">
        <div v-for="n in 2" :key="'top-' + n" class="skeleton-card">
          <!-- Header placeholder (~75px) -->
          <div class="h-[75px] skeleton-shimmer mb-0 rounded-none"></div>
          <!-- Tabs placeholder (~45px) -->
          <div class="h-[45px] skeleton-shimmer rounded-none"></div>
          <!-- Table header -->
          <div class="h-[40px] skeleton-shimmer mt-0 rounded-none"></div>
          <!-- 10 rows at 56px each -->
          <div class="flex flex-col">
            <div
              v-for="row in 10"
              :key="row"
              class="h-14 skeleton-shimmer rounded-none border-b border-white/5"
              :style="{ animationDelay: `${row * 0.05}s` }"
            ></div>
          </div>
        </div>
      </div>
      <!-- Second dual container: Player Leaderboard + Clan Leaderboard (no tabs) -->
      <div class="leaderboard-dual-container">
        <div v-for="n in 2" :key="'bottom-' + n" class="skeleton-card">
          <!-- Header placeholder (~75px) - full width, no tabs -->
          <div class="h-[75px] skeleton-shimmer mb-0 rounded-none"></div>
          <!-- Table header -->
          <div class="h-[40px] skeleton-shimmer rounded-none"></div>
          <!-- 10 rows at 56px each -->
          <div class="flex flex-col">
            <div
              v-for="row in 10"
              :key="row"
              class="h-14 skeleton-shimmer rounded-none border-b border-white/5"
              :style="{ animationDelay: `${row * 0.05}s` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
