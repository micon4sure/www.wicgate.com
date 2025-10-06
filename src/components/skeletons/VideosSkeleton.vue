<template>
  <div class="videos-placeholder">
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
    <div class="skeleton-videos" aria-label="Loading video content">
      <div v-for="n in 6" :key="n" class="skeleton-video-card">
        <div class="skeleton-video-thumb"></div>
        <div class="skeleton-video-info">
          <div class="skeleton-video-title"></div>
          <div class="skeleton-video-title short"></div>
          <div class="skeleton-video-meta"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.videos-placeholder {
  /* Reserve exact space to match real content - prevents layout shift */
  /* 6 video cards: thumbnail (225px) + info (85px) + gap = ~310px per card */
  min-height: 640px; /* Two rows of 3 cards on desktop */
  margin: 20px 0;
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

.skeleton-videos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.skeleton-video-card {
  background: linear-gradient(
    180deg,
    rgba(var(--panel-main-rgb), 0.96) 0%,
    rgba(var(--panel-dark-rgb), 0.98) 100%
  );
  border: 1px solid var(--divider-strong);
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(4, 9, 14, 0.55);
  /* Match exact height of real video cards to prevent layout shift */
  /* Thumbnail 16:9 (225px) + info padding (12px*2 + ~70px content) ≈ 310px */
  min-height: 310px;
}

.skeleton-video-thumb {
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio - matches real video thumbnails */
  background: linear-gradient(90deg, var(--s2) 0%, var(--mg-muted) 50%, var(--s2) 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  position: relative;
}

.skeleton-video-info {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-video-title {
  height: 20px;
  width: 90%;
  background: linear-gradient(90deg, var(--s2) 0%, var(--mg-muted) 50%, var(--s2) 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  animation-delay: 0.1s;
}

.skeleton-video-title.short {
  width: 60%;
  animation-delay: 0.2s;
}

.skeleton-video-meta {
  height: 14px;
  width: 50%;
  margin-top: 4px;
  background: linear-gradient(90deg, var(--s2) 0%, var(--mg-muted) 50%, var(--s2) 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  animation-delay: 0.3s;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive grid adjustments */
@media (min-width: 1024px) {
  .skeleton-videos {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .skeleton-videos {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .skeleton-videos {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
