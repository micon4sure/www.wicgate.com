<template>
  <div class="events-placeholder">
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
    <div class="skeleton-events" aria-label="Loading community events">
      <div v-for="n in 3" :key="n" class="skeleton-event-card">
        <div class="skeleton-event-image"></div>
        <div class="skeleton-event-content">
          <div class="skeleton-event-title"></div>
          <div class="skeleton-event-desc"></div>
          <div class="skeleton-event-desc short"></div>
          <div class="skeleton-event-meta"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.events-placeholder {
  min-height: 400px;
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

.skeleton-events {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.skeleton-event-card {
  background: linear-gradient(
    180deg,
    rgba(var(--panel-main-rgb), 0.96) 0%,
    rgba(var(--panel-dark-rgb), 0.98) 100%
  );
  border: 1px solid var(--divider-strong);
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(4, 9, 14, 0.55);
}

.skeleton-event-image {
  height: 220px;
  background: linear-gradient(90deg, var(--s2) 0%, var(--mg-muted) 50%, var(--s2) 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-event-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-event-title {
  height: 28px;
  width: 70%;
  background: linear-gradient(90deg, var(--s2) 0%, var(--mg-muted) 50%, var(--s2) 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  animation-delay: 0.1s;
}

.skeleton-event-desc {
  height: 18px;
  width: 100%;
  background: linear-gradient(90deg, var(--s2) 0%, var(--mg-muted) 50%, var(--s2) 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  animation-delay: 0.2s;
}

.skeleton-event-desc.short {
  width: 60%;
  animation-delay: 0.3s;
}

.skeleton-event-meta {
  height: 16px;
  width: 40%;
  margin-top: 8px;
  background: linear-gradient(90deg, var(--s2) 0%, var(--mg-muted) 50%, var(--s2) 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  animation-delay: 0.4s;
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
  .skeleton-events {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .skeleton-event-image {
    height: 180px;
  }
}
</style>
