<script setup lang="ts">
import { communityCards } from '../content/content';
import { useYoutube } from '../composables/useYoutube';
import TwitchEmbed from '../components/TwitchEmbed.vue';

const { ytVideosSorted: videos, loading: ytVidsLoading } = useYoutube();

const twitchUsernames = ['kickapoo149', 'pontertwitch'];
</script>

<template>
  <section id="community" class="com-hub section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>Community</h2>
        <p class="section-lead">Join the conversation across all
          platforms</p>
      </div>

      <div class="grid grid-3 mb-xl">
        <div v-for="c in communityCards" :key="c.title" class="card com-card" :class="c.cls">
          <div class="com-card-color-bar" />
          <div class="card-icon">{{ c.icon }}</div>
          <h3>{{ c.title }}</h3>
          <div class="card-stats">
            <div>
              <div class="stat-val">{{ c.members }}</div>
              <div class="stat-lbl">{{ c.stat1 }}</div>
            </div>
            <div>
              <div class="stat-val">{{ c.online }}</div>
              <div class="stat-lbl">{{ c.stat2 }}</div>
            </div>
          </div>
          <p class="card-desc">{{ c.desc }}</p>
          <a :href="c.link" target="_blank" class="card-act">{{ c.action }} <span>→</span></a>
        </div>
      </div>

      <!-- Live Streams -->
      <div class="mb-xl">
        <div class="vid-hdr">
          <h3>Live Streams</h3>
          <a href="https://twitch.tv/directory/game/World%20in%20Conflict" target="_blank" class="card-act">Browse Twitch →</a>
        </div>
        <div class="grid grid-2" style="gap:30px">
          <div v-for="u in twitchUsernames" :key="u" class="card" style="padding:0;overflow:hidden">
            <TwitchEmbed :channel="u" muted />
            <div style="padding:12px 16px;display:flex;justify-content:space-between;align-items:center">
              <strong style="font-size:.9rem">{{ u }}</strong>
              <a :href="`https://twitch.tv/${u}`" target="_blank" class="card-act" style="font-size:.75rem">Open →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Latest Videos -->
      <div class="vid-section mb-xl">
        <div class="vid-hdr">
          <h3>Latest Videos</h3>
          <a href="https://youtube.com/@wicgate" target="_blank" class="card-act">View Channel →</a>
        </div>

        <div v-if="ytVidsLoading" class="grid grid-3">
          <div v-for="n in 6" :key="n" class="card vid-card skeleton">
            <div class="vid-thumb" />
            <div class="vid-info">
              <div class="skeleton-line" style="width:80%"></div>
              <div class="skeleton-line" style="width:60%;margin-top:6px"></div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-3">
          <div v-for="v in videos" :key="v.id" class="card vid-card">
            <a :href="v.videoUrl" target="_blank" style="text-decoration:none;color:inherit;display:block">
              <div class="vid-thumb" :style="{ backgroundImage: 'url(' + v.thumbnailUrl + ')' }">
                <div class="play-over">▶</div>
              </div>
              <div class="vid-info">
                <h4 style="margin:0 0 6px;font-size:0.95rem;line-height:1.4">{{ v.title }}</h4>
                <div class="vid-meta">
                  <span v-if="v.author">{{ v.author }}</span>
                  <span v-if="v.views != null"> • {{ v.views.toLocaleString() }} views</span>
                  <span v-if="v.publishedAt"> • {{ new Date(v.publishedAt).toLocaleDateString() }}</span>
                </div>
              </div>
            </a>
          </div>

          <div v-if="videos.length === 0" class="text-muted">No videos available</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
