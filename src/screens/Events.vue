<script setup lang="ts">
import { computed } from 'vue'
import { useEvents } from '../composables/useEvents'

const { events, isLoading, formatDate, getCountdown } = useEvents()

// Split events into ongoing (big hero) and upcoming (grid)
const ongoingEvents = computed(() =>
  events.value.filter(e => new Date(e.start).getTime() <= Date.now())
)
const upcomingEvents = computed(() =>
  events.value.filter(e => new Date(e.start).getTime() > Date.now())
)
</script>

<template>
  <section id="events" class="section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>Events</h2>
        <p class="section-lead">Tournaments, community nights, and special operations</p>
      </div>
      <!-- Ongoing (Hero) -->
      <div v-if="!isLoading && ongoingEvents.length" class="evt-heroes">
        <component v-for="e in ongoingEvents" :key="'hero-' + e.id" :is="e.link ? 'a' : 'div'" :href="e.link"
          target="_blank" class="card evt-hero">
          <div class="evt-hero-cover" :style="{ backgroundImage: e.coverUrl ? 'url(' + e.coverUrl + ')' : undefined }">
            <div class="evt-hero-overlay" />
            <div class="evt-hero-badges">
              <span class="live-badge">LIVE NOW</span>
              <span class="evt-start">Started: {{ formatDate(e.start) }}</span>
            </div>
            <div class="evt-hero-content">
              <h3 class="evt-hero-title">{{ e.name }}</h3>
              <p class="evt-hero-desc">{{ e.description }}</p>
              <div v-if="e.link" class="evt-hero-link">Open details →</div>
            </div>
          </div>
        </component>
      </div>

      <!-- Loading skeletons -->
      <div v-if="isLoading" class="grid grid-3">
        <div v-for="n in 3" :key="'s' + n" class="card evt-card skeleton">
          <div class="evt-cover" />
          <div class="evt-info">
            <div class="skeleton-line" style="width:70%" />
            <div class="skeleton-line" style="width:50%;margin-top:6px" />
          </div>
        </div>
      </div>

      <!-- Events list -->
      <div v-else class="grid grid-3">
        <component v-for="e in upcomingEvents" :key="e.id" :is="e.link ? 'a' : 'div'" :href="e.link" target="_blank"
          class="card evt-card">
          <div class="evt-cover" :style="{ backgroundImage: e.coverUrl ? 'url(' + e.coverUrl + ')' : undefined }">
            <div class="evt-badge">
              <span class="evt-date">{{ formatDate(e.start) }}</span>
              <span class="evt-count">⏳ {{ getCountdown(e.start) }}</span>
            </div>
          </div>
          <div class="evt-info">
            <h3 class="evt-title">{{ e.name }}</h3>
            <p class="evt-desc text-muted">{{ e.description }}</p>
            <div class="evt-link" v-if="e.link">Open details →</div>
          </div>
        </component>
      </div>

      <div v-if="!isLoading && upcomingEvents.length === 0 && ongoingEvents.length === 0" class="text-muted">No events
        to show</div>
    </div>
  </section>

</template>

<style scoped>
.evt-heroes {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px
}

.evt-hero {
  padding: 0;
  overflow: hidden;
  text-decoration: none;
  color: inherit
}

.evt-hero-cover {
  position: relative;
  background: linear-gradient(135deg, rgba(0, 0, 0, .25), rgba(0, 0, 0, .5));
  background-size: cover;
  background-position: center;
  min-height: 320px
}

.evt-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, .55) 60%, rgba(0, 0, 0, .75) 100%)
}

.evt-hero-badges {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  gap: 10px;
  z-index: 2
}

.live-badge {
  background: #e53935;
  color: #fff;
  font-weight: 700;
  font-size: .8rem;
  padding: 6px 10px;
  border-radius: 999px;
  letter-spacing: .02em;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .35)
}

.evt-start {
  background: rgba(0, 0, 0, .5);
  color: #fff;
  font-size: .8rem;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, .15)
}

.evt-hero-content {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 16px;
  z-index: 2;
  max-width: 900px
}

.evt-hero-title {
  margin: 0 0 8px;
  font-size: clamp(1.6rem, 3.2vw, 2.2rem);
  line-height: 1.15
}

.evt-hero-desc {
  margin: 0 0 10px;
  font-size: clamp(.95rem, 1.6vw, 1.05rem);
  color: var(--t2)
}

.evt-hero-link {
  font-size: .95rem;
  color: #fff;
  opacity: .9
}

.evt-card {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.evt-cover {
  position: relative;
  background: linear-gradient(135deg, rgba(0, 0, 0, .2), rgba(0, 0, 0, .4));
  background-size: cover;
  background-position: center;
  padding-bottom: 48%;
}

.evt-badge {
  position: absolute;
  left: 12px;
  bottom: 12px;
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, .55);
  border: 1px solid rgba(255, 255, 255, .15);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: .8rem;
}

.evt-date {
  color: #fff
}

.evt-count {
  color: var(--mg);
  font-weight: 600
}

.evt-info {
  padding: 14px 16px 16px
}

.evt-title {
  margin: 0 0 6px;
  font-size: 1.05rem;
  line-height: 1.35
}

.evt-desc {
  margin: 0 0 8px;
  font-size: .92rem
}

.evt-link {
  font-size: .85rem;
  color: var(--t2)
}

/* Skeleton helpers (rely on global .skeleton styles present elsewhere) */
.skeleton .evt-cover {
  background: rgba(255, 255, 255, 0.06)
}

.skeleton-line {
  height: 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px
}
</style>
