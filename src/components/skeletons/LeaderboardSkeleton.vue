<template>
  <div class="leaderboards-placeholder">
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
    <div class="skeleton-leaderboards" aria-label="Loading player statistics">
      <div v-for="n in 3" :key="n" class="skeleton-board">
        <div class="skeleton-header"></div>
        <div class="skeleton-table">
          <div v-for="row in 5" :key="row" class="skeleton-row"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leaderboards-placeholder {
  min-height: 600px;
}

.seo-content {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  color: var(--t2);
  line-height: 1.6;
}

.seo-content h3 {
  color: var(--t);
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.seo-content p {
  margin-bottom: 15px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
}

.skeleton-leaderboards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.skeleton-board {
  background: linear-gradient(
    180deg,
    rgba(var(--panel-main-rgb), 0.96) 0%,
    rgba(var(--panel-dark-rgb), 0.98) 100%
  );
  border: 1px solid var(--divider-strong);
  border-radius: 0;
  padding: 20px;
  box-shadow: 0 12px 28px rgba(4, 9, 14, 0.55);
}

.skeleton-header {
  height: 50px;
  background: linear-gradient(90deg, var(--s2) 0%, var(--mg-muted) 50%, var(--s2) 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  margin-bottom: 20px;
  border-radius: 0;
}

.skeleton-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-row {
  height: 45px;
  background: linear-gradient(90deg, var(--s2) 0%, var(--mg-muted) 50%, var(--s2) 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 0;
}

.skeleton-row:nth-child(1) {
  animation-delay: 0.1s;
}

.skeleton-row:nth-child(2) {
  animation-delay: 0.2s;
}

.skeleton-row:nth-child(3) {
  animation-delay: 0.3s;
}

.skeleton-row:nth-child(4) {
  animation-delay: 0.4s;
}

.skeleton-row:nth-child(5) {
  animation-delay: 0.5s;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .skeleton-leaderboards {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .skeleton-board {
    padding: 16px;
  }
}
</style>
