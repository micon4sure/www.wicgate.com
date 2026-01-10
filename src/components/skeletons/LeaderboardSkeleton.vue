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
    <div class="grid grid-cols-1 gap-6 py-5" aria-label="Loading player statistics">
      <!-- First dual container: High Scores + Total Scores -->
      <div class="leaderboard-dual-container">
        <div v-for="n in 2" :key="'top-' + n" class="skeleton-card">
          <div class="h-[50px] skeleton-shimmer mb-5 rounded-none"></div>
          <div class="flex flex-col gap-3">
            <div
              v-for="row in 5"
              :key="row"
              class="h-[45px] skeleton-shimmer rounded-none"
              :style="{ animationDelay: `${row * 0.1}s` }"
            ></div>
          </div>
        </div>
      </div>
      <!-- Second dual container: Player Leaderboard + Clan Leaderboard -->
      <div class="leaderboard-dual-container">
        <div v-for="n in 2" :key="'bottom-' + n" class="skeleton-card">
          <div class="h-[50px] skeleton-shimmer mb-5 rounded-none"></div>
          <div class="flex flex-col gap-3">
            <div
              v-for="row in 5"
              :key="row"
              class="h-[45px] skeleton-shimmer rounded-none"
              :style="{ animationDelay: `${row * 0.1}s` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
