<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppDataStore } from '../stores/appDataStore';
import { useEvents } from '../composables/useEvents';
import { useYoutube } from '../composables/useYoutube';
import RankInsignia from './RankInsignia.vue';
import type { LadderEntry } from '../api-types';
import { isSubsection, getSectionFromSubsection } from '../types/navigation';
import { scrollToSection } from '../utils/scroll';

const router = useRouter();
const route = useRoute();
const store = useAppDataStore();
const { playerCount, loading: storeLoading, data } = store;
const { events } = useEvents();
const { videosSorted } = useYoutube();

// SSR detection
const isSSR = import.meta.env.SSR;

// Widget data computed properties
const activeServers = computed(() => {
  if (!data.value.servers || !data.value.profiles) return [];

  // Group players by server and get servers with players
  const serverMap = new Map<number, { name: string; count: number }>();

  data.value.profiles.forEach((profile) => {
    const serverId = Number(profile.serverId);
    const server = data.value.servers?.find((s) => s.serverId === serverId);
    if (server) {
      const existing = serverMap.get(serverId);
      if (existing) {
        existing.count++;
      } else {
        serverMap.set(serverId, { name: server.serverName, count: 1 });
      }
    }
  });

  // Convert to array and sort by player count
  return Array.from(serverMap.entries())
    .map(([id, info]) => ({ id, ...info }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
});

const activeServerCount = computed(() => activeServers.value.length);

const topLadderPlayers = computed(() => {
  if (!data.value.ladder) return [];
  return data.value.ladder.slice(0, 3);
});

const latestVideos = computed(() => videosSorted.value.slice(0, 3));

const nextEvent = computed(() => {
  if (!events.value || events.value.length === 0) return null;
  const upcoming = events.value.find((e) => new Date(e.start).getTime() > Date.now());
  return upcoming || events.value[0];
});

// Navigation functions - support both sections and subsections
// Mimics Navigation.vue dropdown behavior for consistency
function goToSection(sectionOrSubsection: string) {
  if (isSubsection(sectionOrSubsection)) {
    // Get parent section for this subsection
    const parentSection = getSectionFromSubsection(sectionOrSubsection);
    const currentRoute = route.path.substring(1) || 'hero'; // Remove leading '/', default to 'hero' for '/'

    if (currentRoute === parentSection) {
      // Already on parent route - just scroll (same as Navigation.vue dropdown)
      scrollToSection(sectionOrSubsection);
    } else {
      // Navigate to parent route first, then scroll after route change
      router.push(`/${parentSection}`).then(() => {
        // Wait for route change and DOM update (slightly more than router's 400ms delay)
        setTimeout(() => {
          scrollToSection(sectionOrSubsection);
        }, 450);
      });
    }
  } else {
    // Main section - navigate normally
    router.push(`/${sectionOrSubsection}`);
  }
}

// Format clan tag like leaderboard
function formatClanTag(entry: LadderEntry): string {
  if (entry.tagFormat && entry.shortName) {
    return entry.tagFormat.replace('C', entry.shortName).replace('P', '');
  }
  return '';
}
</script>

<template>
  <section id="hero" class="widget-hero">
    <div class="container">
      <!-- Hero Header -->
      <div class="widget-hero-header">
        <div class="hero-tag">THE WAR CONTINUES</div>
        <h1 class="military-title">
          World in Conflict<br /><span class="hero-subtitle">is Live Again</span>
        </h1>
        <p class="hero-description">
          Join our community in epic Cold War battles. Fully restored multiplayer servers with the
          real Massgate code.
        </p>
      </div>

      <!-- Widget Grid -->
      <div class="widget-grid">
        <!-- Quick Start Widget -->
        <div class="widget widget-primary" @click="goToSection('getting-started')">
          <div class="widget-header">
            <div class="widget-icon">
              <i class="fa-solid fa-rocket" aria-hidden="true"></i>
            </div>
            <h3>Quick Start</h3>
          </div>
          <div class="widget-body">
            <div class="widget-stat-large">Ready in 5 minutes</div>
            <p class="widget-desc">Install WICGATE and join the battlefield</p>
          </div>
          <div class="widget-footer">
            <span class="widget-action">Get Started <i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </div>

        <!-- Live Servers Widget -->
        <div class="widget" @click="goToSection('multiplayer-servers')">
          <div class="widget-header">
            <div class="widget-icon">
              <i class="fa-solid fa-server" aria-hidden="true"></i>
            </div>
            <h3>Live Servers</h3>
          </div>
          <div class="widget-body">
            <div v-if="isSSR || storeLoading" class="widget-skeleton">
              <div class="skeleton-line"></div>
              <div class="skeleton-line"></div>
            </div>
            <template v-else>
              <div class="widget-stats-row">
                <div class="widget-stat">
                  <span class="stat-number">{{ playerCount }}</span>
                  <span class="stat-label">Players Online</span>
                </div>
                <div class="widget-stat">
                  <span class="stat-number">{{ activeServerCount }}</span>
                  <span class="stat-label">Active Servers</span>
                </div>
              </div>
              <div v-if="activeServers.length > 0" class="server-list">
                <div v-for="server in activeServers" :key="server.id" class="server-item">
                  <span class="server-dot"></span>
                  <span class="server-name">{{ server.name }}</span>
                  <span class="server-count">{{ server.count }}/16</span>
                </div>
              </div>
              <div v-else class="widget-empty">No active servers</div>
            </template>
          </div>
          <div class="widget-footer">
            <span class="widget-action">View All <i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </div>

        <!-- Community Widget -->
        <div class="widget" @click="goToSection('community-events')">
          <div class="widget-header">
            <div class="widget-icon widget-icon-discord">
              <i class="fa-brands fa-discord" aria-hidden="true"></i>
            </div>
            <h3>Community</h3>
          </div>
          <div class="widget-body">
            <div class="widget-stat">
              <span class="stat-number">287</span>
              <span class="stat-label">Discord Members</span>
            </div>
            <div v-if="nextEvent" class="widget-highlight">
              <i class="fa-regular fa-calendar" aria-hidden="true"></i>
              <span>{{ nextEvent.name }}</span>
            </div>
            <div v-else class="widget-desc">Join our active community</div>
          </div>
          <div class="widget-footer">
            <span class="widget-action">Explore <i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </div>

        <!-- Statistics Widget -->
        <div class="widget" @click="goToSection('multiplayer-statistics')">
          <div class="widget-header">
            <div class="widget-icon">
              <i class="fa-solid fa-trophy" aria-hidden="true"></i>
            </div>
            <h3>Top Players</h3>
          </div>
          <div class="widget-body">
            <div v-if="isSSR || storeLoading" class="widget-skeleton">
              <div class="skeleton-line"></div>
              <div class="skeleton-line"></div>
            </div>
            <template v-else>
              <div v-if="topLadderPlayers.length > 0" class="ladder-list">
                <div
                  v-for="(player, i) in topLadderPlayers"
                  :key="player.profileId"
                  class="ladder-item"
                  :class="`rank-${i + 1}`"
                >
                  <span class="ladder-rank">{{ i + 1 }}</span>
                  <div class="player-cell-content">
                    <RankInsignia :rank="player.rank || 0" :size="20" />
                    <span v-if="formatClanTag(player)" class="clan-tag">{{
                      formatClanTag(player)
                    }}</span>
                    <span class="player-name">{{ player.profileName }}</span>
                  </div>
                  <span class="ladder-score">{{ player.high }}</span>
                </div>
              </div>
              <div v-else class="widget-empty">No rankings yet</div>
            </template>
          </div>
          <div class="widget-footer">
            <span class="widget-action">Leaderboards <i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </div>

        <!-- Latest Content Widget -->
        <div class="widget" @click="goToSection('community-videos')">
          <div class="widget-header">
            <div class="widget-icon widget-icon-youtube">
              <i class="fa-brands fa-youtube" aria-hidden="true"></i>
            </div>
            <h3>Latest Videos</h3>
          </div>
          <div class="widget-body">
            <div v-if="isSSR" class="widget-skeleton">
              <div class="skeleton-line"></div>
              <div class="skeleton-line"></div>
            </div>
            <template v-else>
              <div v-if="latestVideos.length > 0" class="video-list">
                <div
                  v-for="video in latestVideos"
                  :key="video.id"
                  class="video-item"
                  @click.stop="window.open(video.videoUrl, '_blank')"
                >
                  <img :src="video.thumbnailUrl" :alt="video.title" loading="lazy" />
                  <span class="video-title">{{ video.title }}</span>
                </div>
              </div>
              <div v-else class="widget-empty">No videos yet</div>
            </template>
          </div>
          <div class="widget-footer">
            <span class="widget-action">Watch More <i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </div>

        <!-- Getting Help Widget -->
        <div class="widget" @click="goToSection('faq')">
          <div class="widget-header">
            <div class="widget-icon">
              <i class="fa-solid fa-circle-question" aria-hidden="true"></i>
            </div>
            <h3>Getting Help</h3>
          </div>
          <div class="widget-body">
            <div class="help-list">
              <div class="help-item">
                <i class="fa-solid fa-book" aria-hidden="true"></i>
                <span>Installation Guide</span>
              </div>
              <div class="help-item">
                <i class="fa-solid fa-wrench" aria-hidden="true"></i>
                <span>Troubleshooting</span>
              </div>
              <div class="help-item">
                <i class="fa-brands fa-discord" aria-hidden="true"></i>
                <span>Community Support</span>
              </div>
            </div>
          </div>
          <div class="widget-footer">
            <span class="widget-action">View FAQ <i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </div>
      </div>

      <!-- CTA Buttons -->
      <div class="widget-cta">
        <a
          href="#getting-started"
          class="btn btn-download"
          @click.prevent="goToSection('getting-started')"
        >
          <i class="fa-solid fa-download" aria-hidden="true"></i> INSTALL WICGATE
        </a>
        <a
          href="https://discord.gg/WnxwfMTyBe"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-d"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path
              d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"
            />
          </svg>
          Join Discord
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Component-specific styles - global styles in widget-dashboard.css */
.widget {
  cursor: pointer;
}

.video-item {
  cursor: pointer;
}

/* Podium styling for rank numbers */
.ladder-item.rank-1 .ladder-rank {
  color: var(--medal-gold);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  font-size: 1.05rem;
}

.ladder-item.rank-2 .ladder-rank {
  color: var(--medal-silver);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  font-size: 1rem;
}

.ladder-item.rank-3 .ladder-rank {
  color: var(--medal-bronze);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  font-size: 0.95rem;
}

/* Podium styling for scores - matches leaderboard */
.ladder-item.rank-1 .ladder-score {
  color: var(--medal-gold);
  font-weight: 600;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
}

.ladder-item.rank-2 .ladder-score {
  color: var(--medal-silver);
  font-weight: 600;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
}

.ladder-item.rank-3 .ladder-score {
  color: var(--medal-bronze);
  font-weight: 600;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
}

/* Player cell content - matches leaderboard layout */
.player-cell-content {
  display: flex;
  align-items: center;
  /* NO gap property - matches leaderboard */
  flex: 1;
  overflow: hidden;
  line-height: 1;
}

.player-cell-content .rank-insignia {
  flex-shrink: 0;
  margin: 0 6px 0 0; /* Only rank insignia gets right margin */
}

.clan-tag {
  font-family: 'Courier New', monospace;
  color: var(--sw);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.3px;
  flex-shrink: 0;
}

.player-name {
  font-family: 'Rajdhani', sans-serif;
  color: var(--t);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
